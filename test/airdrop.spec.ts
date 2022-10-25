import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import { Airdrop, ERC20, MacroToken } from "../typechain-types"
import airdropList from "./airdroplist.json"

const provider = ethers.provider
let account1: SignerWithAddress
let account2: SignerWithAddress
let rest: SignerWithAddress[]

let macroToken: MacroToken
let airdrop: Airdrop
let merkleRoot: string

const chainId = hre.network.config.chainId;

describe("Airdrop", function () {
    before(async () => {
        ;[account1, account2, ...rest] = await ethers.getSigners()

        macroToken = (await (await ethers.getContractFactory("MacroToken")).deploy("Macro Token", "MACRO")) as MacroToken
        await macroToken.deployed()

        // TODO: The bytes32 value below is just a random hash in order to get the tests to pass.
        // You must create a merkle tree for testing, computes it root, then set it here
        merkleRoot = "0x150d81d5384973959afe304312de1ccab6382a4dfd98f9211a32278bbafd016b"
    })

    beforeEach(async () => {
        //account2 is signer, different than the deployer who is account1
        airdrop = await (await ethers.getContractFactory("Airdrop")).deploy(merkleRoot, account2.address, macroToken.address)
        await airdrop.deployed()

        await macroToken.addAirdropOwner(airdrop.address);
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
        it ("TODO", async () => {
            throw new Error("TODO: add more tests here!")
        })
    })

    describe("Signature claiming", () => {
        it ("TODO", async () => {
            /*
           EIP712_DOMAIN = keccak256(abi.encode(
               keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
               keccak256(bytes("MacroToken")),
               keccak256(bytes("1")),
               block.chainid,
               address(this)
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

                await expect(airdrop.signatureClaim(sig, claimer, amount))
                    .to.emit(macroToken, 'Transfer')
                    .withArgs(ethers.constants.AddressZero, claimer, amount);

            }

        })
    })
})
