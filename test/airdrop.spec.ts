import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Airdrop, ERC20, MacroToken } from "../typechain-types"

const provider = ethers.provider
let account1: SignerWithAddress
let account2: SignerWithAddress
let rest: SignerWithAddress[]

let macroToken: MacroToken
let airdrop: Airdrop
let merkleRoot: string

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
        airdrop = await (await ethers.getContractFactory("Airdrop")).deploy(merkleRoot, account1.address, macroToken.address)
        await airdrop.deployed()
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
            throw new Error("TODO: add more tests here!")
        })
    })
})
