const hre = require("hardhat");

const ERC1155_ADDRESS = "0x2555a384f5ae365245313aae50fff240a99c874c";
const RECEIVER = "0x1D2C82bf8eD94C52Ca3Ae7C89eF2C543D0997E94";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const erc1155 = await hre.ethers.getContractAt(
    "GameCharacterCollectionERC1155",
    ERC1155_ADDRESS
  );

  const ids = [1, 2];
  const amounts = [1, 1];

  const tx = await erc1155.safeBatchTransferFrom(
    owner.address,
    RECEIVER,
    ids,
    amounts,
    "0x"
  );

  await tx.wait();

  console.log("ERC1155 batch transfer tx:", tx.hash);
  console.log("From:", owner.address);
  console.log("To:", RECEIVER);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});