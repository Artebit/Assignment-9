const hre = require("hardhat");

async function main() {
  const Soulbound = await hre.ethers.getContractFactory("SoulboundVisitCardERC721");
  const soulbound = await Soulbound.deploy();
  await soulbound.deployed();

  console.log("Soulbound ERC721 deployed to:", soulbound.address);

  const ERC1155 = await hre.ethers.getContractFactory("GameCharacterCollectionERC1155");
  const erc1155 = await ERC1155.deploy();
  await erc1155.deployed();

  console.log("ERC1155 deployed to:", erc1155.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});