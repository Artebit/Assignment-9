// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GameCharacterCollectionERC1155 is ERC1155, Ownable {
    uint256 public constant CHARACTER_COUNT = 10;

    mapping(uint256 => string) private _tokenUris;

    constructor() ERC1155("") Ownable(msg.sender) {}

    function setTokenUri(uint256 id, string memory tokenUri) external onlyOwner {
        require(id >= 1 && id <= CHARACTER_COUNT, "invalid token id");
        _tokenUris[id] = tokenUri;
    }

    function uri(uint256 id) public view override returns (string memory) {
        require(id >= 1 && id <= CHARACTER_COUNT, "invalid token id");
        return _tokenUris[id];
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external onlyOwner {
        require(id >= 1 && id <= CHARACTER_COUNT, "invalid token id");
        _mint(to, id, amount, data);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            require(ids[i] >= 1 && ids[i] <= CHARACTER_COUNT, "invalid token id");
        }

        _mintBatch(to, ids, amounts, data);
    }
}