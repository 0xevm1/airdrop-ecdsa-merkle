🚧 WIP - Not final submission yet

                                  ,~-.
                                 (  ' )-.          ,~'`-.
                              ,~' `  ' ) )       _(   _) )
                             ( ( .--.===.--.    (  `    ' )
                              `.%%.;::|888.#`.   `-'`~~=~'
                              /%%/::::|8888\##\
                             |%%/:::::|88888\##|
                             |%%|:::::|88888|##|.,-.
                             \%%|:::::|88888|##/    )_
                              \%\:::::|88888/#/ ( `'  )
                               \%\::::|8888/#/(  ,  -'`-.
                           ,~-. `%\:::|888/#'(  (     ') )
                          (  ) )_ `\__|__/'   `~-~=--~~='
                         ( ` ')  ) [VVVVV]
                ∘ ∘˚˳°∘ ∘˚˳°∘.∘˚˳°∘°(˘ω˘♡)💕
            ∘˚˳°∘∘˚˳°∘            💕[XXX]
       ∘˚˳°∘  ∘˚˳°∘                 `"""'  

# Airdrop

## ERC20 Token Airdrop via EIP712 ECDSA signatures method and MerkleTree claiming method



Contains two distinct claiming methods, alongside a switch to disable ECDSA method, ostensibly in the event that it becomes insecure in the future, 
while retaining the ability for beneficiaries to claim their tokens using the MerkleTree method.

Aside from that, both methods unburden the beneficiaries for needing gas to claim, 
and also allow for privacy of who the beneficiaries are, until they claim.

### ECDSA, EIP712, ERC20, Typescript
EIP712 signatures are in use client side and recovered in the smart contract, instructing one of our
funded addresses to mint tokens for the whitelisted beneficiary.

### MerkleTree, ERC20, Typescript
Computes Merkletree root from the whitelist, verifies it in the smart contract, instructing a mint to occur to the
whitelisted beneficiary.

![Code Coverage](https://github.com/0xevm1/airdrop-ecdsa/merkle/airdrop-coverage.png)

### Setup

On the command line, use:

`git clone git@github.com:0xevm1/airdrop-ecdsa-merkle.git`

Access the folder with: 

`cd airdrop-ecdsa-merkle`

Install with:

`yarn install`

use:

`npx hardhat test`

to compile and run the code along with the tests

use:

`npx hardhat test --fulltrace`

to see SSTORE and SLOAD analysis, how efficient we are with gas and storage in the EVM

use: 

`npx hardhat coverage`

to see how much the tests cover