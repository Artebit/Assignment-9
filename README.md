# Assignment 9 NFT

This project contains two separate NFT contracts for the assignment:

- `SoulboundVisitCardERC721.sol` - a soulbound ERC-721 student visit card.
- `GameCharacterCollectionERC1155.sol` - an ERC-1155 collection of 10 game characters.

## Contracts

### SoulboundVisitCardERC721

- Uses OpenZeppelin `ERC721URIStorage` and `Ownable`.
- Owner/admin can mint with `mintVisitCard(address student, string tokenUri)`.
- Each student wallet can receive exactly one visit card.
- Transfers are disabled by overriding `transferFrom` and `safeTransferFrom`.
- Approvals are disabled by overriding `approve` and `setApprovalForAll`.
- Metadata is stored off-chain and returned through `tokenURI`.

### GameCharacterCollectionERC1155

- Uses OpenZeppelin `ERC1155` and `Ownable`.
- Supports 10 token IDs: `1` through `10`.
- Owner/admin can assign metadata with `setTokenUri`.
- Owner/admin can mint one token or batch mint with `mintBatch`.
- Standard ERC-1155 transfer, approval, and batch transfer behavior remains enabled.
- Metadata is stored off-chain and returned through `uri`.

## Metadata

Metadata examples are in the `metadata` directory.

- `metadata/visit-card.json` contains the ERC-721 visit card metadata with `image` and attributes such as `studentName`, `studentID`, `course`, and `year`.
- `metadata/character-1.json` through `metadata/character-10.json` contain ERC-1155 marketplace-compatible metadata. Each file has a unique `image` URI and attributes such as `color`, `speed`, `strength`, and `rarity`.

The current metadata files use public HTTPS image URLs for a quick classroom/demo setup. The mint script points token metadata to the raw GitHub URLs under `metadata/`, so the JSON files become reachable after this repository is pushed. If strict IPFS hosting is required, upload the images and JSON metadata to IPFS and replace the metadata/image values with `ipfs://...` links.

## Setup

Install dependencies:

```bash
npm install
```

Compile:

```bash
npm run compile
```

Run tests:

```bash
npm test
```

On Windows PowerShell, if `npx` is blocked by execution policy, use:

```bash
npx.cmd hardhat test
```

## Environment

Create a `.env` file:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
```

Do not commit `.env`.

## Deployment

Deploy both contracts:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

Deploy only the ERC-1155 contract:

```bash
npx hardhat run scripts/deploy-erc1155.js --network sepolia
```

After deployment, update the contract addresses in:

- `scripts/mint.js`
- `scripts/batch-transfer.js`

## Minting

Run:

```bash
npx hardhat run scripts/mint.js --network sepolia
```

The script:

- Mints one soulbound ERC-721 visit card to the student wallet.
- Sets metadata URIs for all 10 ERC-1155 character IDs.
- Batch mints 10 ERC-1155 NFTs to the owner wallet.
- Batch transfers token IDs `1` and `2` to the student wallet.
- Prints transaction hashes for the ERC-721 mint, ERC-1155 URI updates, ERC-1155 batch mint, and ERC-1155 batch transfer.

To use a specific student wallet, set `STUDENT_WALLET` in `scripts/mint.js`.

## Batch Transfer Demo

Run:

```bash
npx hardhat run scripts/batch-transfer.js --network sepolia
```

This demonstrates ERC-1155 batch transfer efficiency by transferring token IDs `1` and `2` in a single transaction.

## Proof Of Functionality

Add the actual deployed transaction hashes or screenshots after running the scripts on Sepolia:

- ERC-721 visit card mint transaction:
- ERC-1155 batch mint transaction:
- ERC-1155 batch transfer transaction:
- Screenshot/link showing student wallet owns one soulbound visit card:
- Screenshot/link showing student wallet received 1 or 2 ERC-1155 game characters:

Local proof from tests:

```text
npx.cmd hardhat test
8 passing
```
