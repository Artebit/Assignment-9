const hre = require("hardhat");

const ERC721_ADDRESS = "0x5d30fa9cbb80ed8cdecf536c4ca3138ea082b677";
const ERC1155_ADDRESS = "0x2555a384f5ae365245313aae50fff240a99c874c";
const STUDENT_WALLET = "";
const METADATA_BASE_URI =
  "https://raw.githubusercontent.com/Artebit/Assignment-9/main/metadata";

async function main() {
  const [owner] = await hre.ethers.getSigners();

  const student = STUDENT_WALLET || owner.address;

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
    `${METADATA_BASE_URI}/visit-card.json`
  );
  await visitCardTx.wait();
  console.log("ERC721 visit card mint tx:", visitCardTx.hash);

  const ids = [1,2,3,4,5,6,7,8,9,10];
  const amounts = [1,1,1,1,1,1,1,1,1,1];
  const characterUris = ids.map((id) => `${METADATA_BASE_URI}/character-${id}.json`);

  for (let i = 0; i < ids.length; i++) {
    const uriTx = await erc1155.setTokenUri(ids[i], characterUris[i]);
    await uriTx.wait();
    console.log(`ERC1155 token ${ids[i]} URI set tx:`, uriTx.hash);
  }

  const batchMintTx = await erc1155.mintBatch(owner.address, ids, amounts, "0x");
  await batchMintTx.wait();
  console.log("ERC1155 batch mint tx:", batchMintTx.hash);

  const batchTransferTx = await erc1155.safeBatchTransferFrom(
    owner.address,
    student,
    [1, 2],
    [1, 1],
    "0x"
  );
  await batchTransferTx.wait();
  console.log("ERC1155 student batch transfer tx:", batchTransferTx.hash);

  console.log("Owner wallet:", owner.address);
  console.log("Student wallet:", student);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
