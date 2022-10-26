# Airdrop

*Melvillian*

> Airdrop

A contract for airdropping MACRO token which allows claimers to claim their tokens using either signatures, or a Merkle proof. Once quantum computers have broken ECDSA, an owner can turn off the ability to verify using ECDSA signatures leaving only Merkle proof verification (which uses cryptographic hash functions resistant to quantum computers).



## Methods

### EIP712_DOMAIN

```solidity
function EIP712_DOMAIN() external view returns (bytes32)
```

the EIP712 domain separator for claiming MACRO




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### SUPPORT_TYPEHASH

```solidity
function SUPPORT_TYPEHASH() external view returns (bytes32)
```

EIP-712 typehash for claiming MACRO




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### alreadyClaimed

```solidity
function alreadyClaimed(address) external view returns (bool)
```

A mapping to keep track of which addresses have already claimed their airdrop



#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### disableECDSAVerification

```solidity
function disableECDSAVerification() external nonpayable
```

Causes `Airdrop.signatureClaim` to always revertShould be called when the owner learns offchain that quantum computers have advanced to the point of breaking ECDSA, and thus the `Airdrop.signatureClaim` function is insecure




### isECDSADisabled

```solidity
function isECDSADisabled() external view returns (bool)
```

true if a claimer is able to call `Airdrop.signatureClaim` without reverting, false otherwise. False by default

*We could call this `isECDSAEnabled`, but then we would waste gas first setting it to true, only later to set it to false. With the current variable name we only use a single SSTORE going from false -&gt; true*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### macroToken

```solidity
function macroToken() external view returns (contract MacroToken)
```

Address of the MACRO ERC20 token




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract MacroToken | undefined |

### merkleClaim

```solidity
function merkleClaim(bytes32[] _proof, address _to, uint256 _amount) external nonpayable
```

Allows a msg.sender to claim their MACRO token by providing a merkle proof proving their address is indeed committed to by the Merkle root stored in `Airdrop.merkleRoot`

*An address can only claim its MACRO onceSee `Airdrop.toLeafFormat` for how to format the Merkle leaf data*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _proof | bytes32[] | An array of keccak hashes used to prove msg.sender&#39;s address is included in the Merkle tree represented by `Airdrop.merkleRoot` |
| _to | address | The address the claimed MACRO should be sent to |
| _amount | uint256 | undefined |

### merkleRoot

```solidity
function merkleRoot() external view returns (bytes32)
```

A merkle proof used to prove inclusion in a set of airdrop claimer addresses. Claimers can provide a merkle proof using this merkle root and claim their airdropped tokens




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### signatureClaim

```solidity
function signatureClaim(bytes signature, address _to, uint256 _amount) external nonpayable
```

Allows a msg.sender to claim their MACRO token by providing a signature signed by the `Airdrop.signer` address.

*An address can only claim its MACRO onceSee `Airdrop.toTypedDataHash` for how to format the pre-signed data*

#### Parameters

| Name | Type | Description |
|---|---|---|
| signature | bytes | An array of bytes representing a signature created by the `Airdrop.signer` address |
| _to | address | The address the claimed MACRO should be sent to |
| _amount | uint256 | undefined |

### signer

```solidity
function signer() external view returns (address)
```

The address whose private key will create all the signatures which claimers can use to claim their airdropped tokens




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |



## Events

### ECDSADisabled

```solidity
event ECDSADisabled(address owner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| owner  | address | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |



