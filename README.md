## ERC20 Token Airdrop via ECDSA method and MerkleTree method

### ECDSA, EIP712, ERC20, Typescript
EIP712 signatures are in use client side and recovered in the smart contract, instructing one of our
funded addresses to mint tokens for the whitelisted beneficiary.

### MerkleTree, ERC20, Typescript
Use 

Install with
`yarn install`

use
`npx hardhat test`
to compile and run the code along with the tests

use
`npx hardhat test --fulltrace`
to see SSTORE and SLOAD analysis, how efficient we are with gas and storage in the EVM

use
`npx hardhat coverage`
to see how much the tests cover