// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulboundVisitCardERC721 is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1;

    mapping(address => bool) public hasVisitCard;

    constructor() ERC721("Student Visit Card", "SVC") Ownable(msg.sender) {}

    function mintVisitCard(address student, string memory tokenUri) external onlyOwner {
        require(student != address(0), "invalid student");
        require(!hasVisitCard[student], "student already has card");

        uint256 tokenId = _nextTokenId;
        _nextTokenId++;

        hasVisitCard[student] = true;
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, tokenUri);
    }

    function approve(address, uint256) public pure override(ERC721, IERC721) {
    revert("soulbound: approvals disabled");
}

function setApprovalForAll(address, bool) public pure override(ERC721, IERC721) {
    revert("soulbound: approvals disabled");
}

function transferFrom(address, address, uint256) public pure override(ERC721, IERC721) {
    revert("soulbound: transfers disabled");
}

function safeTransferFrom(
    address,
    address,
    uint256,
    bytes memory
) public pure override(ERC721, IERC721) {
    revert("soulbound: transfers disabled");
}
}