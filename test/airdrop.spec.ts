import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Airdrop, ERC20, MacroToken } from "../typechain-types"
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import airdropList from "./airdroplist.json"

const provider = ethers.provider
let account1: SignerWithAddress
let account2: SignerWithAddress
let rest: SignerWithAddress[]

let macroToken: MacroToken
let airdrop: Airdrop
let merkleRoot: string
let merkleTree: MerkleTree

const chainId = hre.network.config.chainId;

//slice(2) ensures data length is correct
function hashToken(address: string, amount: string) {
    return Buffer.from(ethers.utils.solidityKeccak256(['address', 'uint256'], [address, amount]).slice(2), 'hex')
}

describe("Airdrop", function () {
    before(async () => {
        ;[account1, account2, ...rest] = await ethers.getSigners()

        macroToken = (await (await ethers.getContractFactory("MacroToken")).deploy("Macro Token", "MACRO")) as MacroToken
        await macroToken.deployed()

        // You must create a merkle tree for testing, computes it root, then set it here

        merkleTree = new MerkleTree(Object.entries(airdropList).
        map(participants => hashToken(...participants)), keccak256, {sortPairs: true});
        merkleRoot = merkleTree.getHexRoot();


        //EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)

    })

    beforeEach(async () => {
        //account2 is signer, different than the deployer who is account1
        airdrop = await (await ethers.getContractFactory("Airdrop")).deploy(merkleRoot, account2.address, macroToken.address)
        await airdrop.deployed()

    })

    describe("Minting tokens directly", () => {
        it("Owner/deployer should mint token", async() => {
            //320 is all of the tokens allocated for airdrop participants
            await expect(macroToken.mint(airdrop.address, 320)).to.emit(macroToken, 'Transfer')
                .withArgs(ethers.constants.AddressZero, airdrop.address, 320);
        }),
            it("Non-owner should fail at minting token", async() => {

                await expect(macroToken.connect(account2).mint(account2.address, 10)).to.be.revertedWith("ONLY_OWNER")
            })
    })

    describe("setup and disabling ECDSA", () => {

        it("should deploy correctly", async () => {
            // if the beforeEach succeeded, then this succeeds
        })

        it("should disable ECDSA verification", async () => {
            // first try with non-owner user
            await expect(airdrop.connect(account2).disableECDSAVerification()).to.be.revertedWith("Ownable: caller is not the owner")

            // now try with owner
            await expect(airdrop.disableECDSAVerification())
                .to.emit(airdrop, "ECDSADisabled")
                .withArgs(account1.address)
        })
    })

    describe("Merkle claiming", () => {
        it ("Airdrop when valid proof found", async () => {
            macroToken.mint(airdrop.address, 320)

            for(const [claimer, amount] of Object.entries(airdropList)){

                const proof = merkleTree.getHexProof(hashToken(claimer, amount))

                //await expect(airdrop.merkleClaim(proof, claimer, amount)).to.be.revertedWith("Wrong merkle proof")
                //console.log("Claimer: ", claimer, ", Signer: ", rest.find(address => { return address.address === claimer }).address);

                await expect(airdrop.connect(rest.find(address => { return address.address === claimer })).merkleClaim(proof, claimer, amount))
                    .to.emit(macroToken, 'Transfer')
                    .withArgs(airdrop.address, claimer, amount);

            }


        }),
            it ("Give error when duplicate claim attempted", async () => {
                macroToken.mint(airdrop.address, 320)

                for(const [claimer, amount] of Object.entries(airdropList)){

                    const proof = merkleTree.getHexProof(hashToken(claimer, amount))

                    await airdrop.connect(rest.find(address => { return address.address === claimer })).merkleClaim(proof, claimer, amount);

                    await expect(airdrop.connect(rest.find(address => { return address.address === claimer })).merkleClaim(proof, claimer, amount)).to.be.revertedWith("Address has already claimed their tokens")
                }

            }),
            it ("Give error when invalid proof found", async () => {

                let claimer: string = account1.address;
                let amount: string = "10";

                const proof = merkleTree.getHexProof(hashToken(claimer, amount));

                await expect(airdrop.connect(account1).merkleClaim(proof, claimer, amount)).to.be.revertedWith("Wrong merkle proof")

            })

    })

    describe("Signature claiming", () => {
        it ("Airdrop when signing keys match correctly", async () => {
            macroToken.mint(airdrop.address, 320)
            /*
            EIP712_DOMAIN = keccak256(abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes("MacroToken")),
                keccak256(bytes("1")),
                block.chainid,
                address(this) //1
            ));
             */

            for(const [claimer, amount] of Object.entries(airdropList)) {
                //EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)
                const domain = {
                    name: 'MacroToken',
                    version: '1',
                    chainId,
                    verifyingContract: airdrop.address,
                };

                //Claim(address claimer,uint256 amount)
                const types = {
                    Claim: [
                        { name: 'claimer', type: 'address' },
                        { name: 'amount', type: 'uint256' },
                    ],
                };

                const values = { claimer, amount };

                //account2 is now the signer, different than the deployer
                const sig = await account2._signTypedData(domain, types, values);

                await expect(airdrop.connect(rest.find(address => { return address.address === claimer })).signatureClaim(sig, claimer, amount))
                    .to.emit(macroToken, 'Transfer')
                    .withArgs(airdrop.address, claimer, amount);

            }

        }),
            it ("Airdrop when signing keys do not match correctly", async () => {

                /*
                EIP712_DOMAIN = keccak256(abi.encode(
                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                    keccak256(bytes("MacroToken")),
                    keccak256(bytes("1")),
                    block.chainid,
                    address(this) //1
                ));
                 */

                for(const [claimer, amount] of Object.entries(airdropList)) {
                    //EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)
                    const domain = {
                        name: 'MacroToken',
                        version: '1',
                        chainId,
                        verifyingContract: airdrop.address,
                    };

                    //Claim(address claimer,uint256 amount)
                    const types = {
                        Claim: [
                            { name: 'claimer', type: 'address' },
                            { name: 'amount', type: 'uint256' },
                        ],
                    };

                    const values = { claimer, amount };

                    //account2 is now the signer, different than the deployer
                    const sig = await account1._signTypedData(domain, types, values);

                    await expect(airdrop.connect(rest.find(address => { return address.address === claimer })).signatureClaim(sig, claimer, amount))
                        .to.be.revertedWith("Wrong Signature");

                }

            }),
            it ("Duplicate airdrop to an address that already claimed", async () => {
                macroToken.mint(airdrop.address, 320)
                /*
                EIP712_DOMAIN = keccak256(abi.encode(
                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                    keccak256(bytes("MacroToken")),
                    keccak256(bytes("1")),
                    block.chainid,
                    address(this) //1
                ));
                 */

                for(const [claimer, amount] of Object.entries(airdropList)) {
                    //EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)
                    const domain = {
                        name: 'MacroToken',
                        version: '1',
                        chainId,
                        verifyingContract: airdrop.address,
                    };

                    //Claim(address claimer,uint256 amount)
                    const types = {
                        Claim: [
                            { name: 'claimer', type: 'address' },
                            { name: 'amount', type: 'uint256' },
                        ],
                    };

                    const values = { claimer, amount };

                    //account2 is now the signer, different than the deployer
                    const sig = await account2._signTypedData(domain, types, values);

                    airdrop.connect(rest.find(address => { return address.address === claimer })).signatureClaim(sig, claimer, amount);

                    await expect(airdrop.connect(rest.find(address => { return address.address === claimer })).signatureClaim(sig, claimer, amount))
                        .to.be.revertedWith("Address has already claimed their tokens");
                }

            })

    })
})
