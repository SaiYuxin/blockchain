// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CarNFT is ERC721, Ownable {
    uint256 public totalCars; // 总汽车数量
    uint256 public availableCars; // 可用汽车数量

    struct Car {
        address owner; // 汽车的拥有者
        address currentBorrower; // 当前借用汽车的用户
        uint256 borrowEndTime; // 借用结束时间
    }

    mapping(uint256 => Car) public cars; // 汽车NFT的映射，将NFT编号映射到汽车信息

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        totalCars = 0;
        availableCars = 0;
    }

    // 创建一辆新汽车的NFT
    function mintCar() external onlyOwner {
        uint256 tokenId = totalCars;
        _mint(msg.sender, tokenId);
        cars[tokenId] = Car(msg.sender, address(0), 0);


        totalCars++;
        availableCars++;
    }

    // 借用一辆汽车
    function borrowCar(uint256 tokenId, uint256 borrowDuration) external {
        require(ownerOf(tokenId) != address(0), "汽车不存在");
        require(cars[tokenId].currentBorrower == address(0), "汽车已被借用");


        require(borrowDuration > 0, "借用期限必须大于0");

        cars[tokenId].currentBorrower = msg.sender;
        cars[tokenId].borrowEndTime = block.timestamp + borrowDuration;
        availableCars--;


        safeTransferFrom(msg.sender, address(this), tokenId);
    }

    // 还车
    function returnCar(uint256 tokenId) external {
        require(ownerOf(tokenId) == address(this), "汽车不在合约中");
        require(cars[tokenId].currentBorrower == msg.sender, "您没有权限还车");
        require(block.timestamp >= cars[tokenId].borrowEndTime, "借用期限尚未结束");


        cars[tokenId].currentBorrower = address(0);
        availableCars++;
        safeTransferFrom(address(this), msg.sender, tokenId);
    }

    // 获取汽车的拥有者
    function getOwner(uint256 tokenId) external view returns (address) {
        return cars[tokenId].owner;
    }

    // 获取当前借用汽车的用户
    function getCurrentBorrower(uint256 tokenId) external view returns (address) {
        return cars[tokenId].currentBorrower;
    }

    // 获取可用汽车数量
    function getAvailableCars() external view returns (uint256) {
        return availableCars;
    }

    // 获取用户拥有的汽车列表
    function getOwnedCars() external view returns (uint256[] memory) {
        uint256[] memory ownedCars = new uint256[](balanceOf(msg.sender));

        
        uint256 index = 0;


        for (uint256 i = 0; i < totalCars; i++) {
            if (ownerOf(i) == msg.sender) {
                ownedCars[index] = i;
                index++;
            }
        }
        return ownedCars;
    }
}
