const hre = require("hardhat");

const ERC721_ADDRESS = "0x5d30fa9cbb80ed8cdecf536c4ca3138ea082b677";
const ERC1155_ADDRESS = "0x2555a384f5ae365245313aae50fff240a99c874c";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const student = owner.address;

  const erc721 = await hre.ethers.getContractAt(
    "SoulboundVisitCardERC721",
    ERC721_ADDRESS
  );

  const erc1155 = await hre.ethers.getContractAt(
    "GameCharacterCollectionERC1155",
    ERC1155_ADDRESS
  );

  const visitCardTx = await erc721.mintVisitCard(
    student,
    "ipfs://student-visit-card.json"
  );
  await visitCardTx.wait();
  console.log("ERC721 visit card mint tx:", visitCardTx.hash);

  const ids = [1,2,3,4,5,6,7,8,9,10];
  const amounts = [1,1,1,1,1,1,1,1,1,1];

  const batchMintTx = await erc1155.mintBatch(student, ids, amounts, "0x");
  await batchMintTx.wait();
  console.log("ERC1155 batch mint tx:", batchMintTx.hash);

  console.log("Student wallet:", student);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});