const { expect } = require("chai");
const { ethers } = require("hardhat");

async function expectRevert(promise, reason) {
  try {
    await promise;
    expect.fail("Expected revert");
  } catch (error) {
    expect(error.message).to.include(reason);
  }
}

describe("Assignment 9 NFT contracts", function () {
  let owner;
  let student;
  let other;
  let erc721;
  let erc1155;

  beforeEach(async function () {
    [owner, student, other] = await ethers.getSigners();

    const Soulbound = await ethers.getContractFactory("SoulboundVisitCardERC721");
    erc721 = await Soulbound.deploy();
    await erc721.deployed();

    const Characters = await ethers.getContractFactory("GameCharacterCollectionERC1155");
    erc1155 = await Characters.deploy();
    await erc1155.deployed();
  });

  it("mints one soulbound ERC721 visit card", async function () {
    await erc721.mintVisitCard(student.address, "ipfs://visit-card.json");

    expect(await erc721.ownerOf(1)).to.equal(student.address);
    expect(await erc721.tokenURI(1)).to.equal("ipfs://visit-card.json");
    expect(await erc721.hasVisitCard(student.address)).to.equal(true);
  });

  it("rejects second visit card for same student", async function () {
    await erc721.mintVisitCard(student.address, "ipfs://visit-card.json");

    await expectRevert(
      erc721.mintVisitCard(student.address, "ipfs://another.json"),
      "student already has card"
    );
  });

  it("blocks ERC721 transfer and approvals", async function () {
    await erc721.mintVisitCard(student.address, "ipfs://visit-card.json");

    await expectRevert(
      erc721.connect(student).transferFrom(student.address, other.address, 1),
      "soulbound: transfers disabled"
    );

    await expectRevert(
      erc721.connect(student).approve(other.address, 1),
      "soulbound: approvals disabled"
    );

    await expectRevert(
      erc721.connect(student).setApprovalForAll(other.address, true),
      "soulbound: approvals disabled"
    );
  });

  it("allows only owner to mint ERC721 visit card", async function () {
    await expectRevert(
      erc721.connect(other).mintVisitCard(student.address, "ipfs://visit-card.json"),
      "OwnableUnauthorizedAccount"
    );
  });

  it("sets ERC1155 token URIs", async function () {
    await erc1155.setTokenUri(1, "ipfs://character-1.json");

    expect(await erc1155.uri(1)).to.equal("ipfs://character-1.json");
  });

  it("batch mints 10 ERC1155 game characters", async function () {
    const ids = [1,2,3,4,5,6,7,8,9,10];
    const amounts = [1,1,1,1,1,1,1,1,1,1];

    await erc1155.mintBatch(owner.address, ids, amounts, "0x");

    for (const id of ids) {
      expect((await erc1155.balanceOf(owner.address, id)).toNumber()).to.equal(1);
    }
  });

  it("supports ERC1155 batch transfer", async function () {
    const ids = [1,2,3,4,5,6,7,8,9,10];
    const amounts = [1,1,1,1,1,1,1,1,1,1];

    await erc1155.mintBatch(owner.address, ids, amounts, "0x");

    await erc1155.safeBatchTransferFrom(
      owner.address,
      student.address,
      [1, 2],
      [1, 1],
      "0x"
    );

    expect((await erc1155.balanceOf(student.address, 1)).toNumber()).to.equal(1);
    expect((await erc1155.balanceOf(student.address, 2)).toNumber()).to.equal(1);
  });

  it("rejects ERC1155 minting from non-owner", async function () {
    await expectRevert(
      erc1155.connect(other).mint(student.address, 1, 1, "0x"),
      "OwnableUnauthorizedAccount"
    );
  });
});