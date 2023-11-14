// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/BorrowYourCar.sol";

contract CarNFTTest {
    CarNFT carNFT = CarNFT(DeployedAddresses.CarNFT());

    // 测试合约的初始状态
    function testInitialBalance() public {
        uint256 totalCars = carNFT.totalCars();
        uint256 availableCars = carNFT.availableCars();

        Assert.equal(totalCars, 0, "初始总汽车数量应为0");
        Assert.equal(availableCars, 0, "初始可用汽车数量应为0");
    }

    // 测试创建汽车NFT
    function testMintCar() public {
        carNFT.mintCar();
        uint256 totalCars = carNFT.totalCars();
        uint256 availableCars = carNFT.availableCars();

        Assert.equal(totalCars, 1, "创建后总汽车数量应为1");
        Assert.equal(availableCars, 1, "创建后可用汽车数量应为1");
    }

    // 测试借用和还车汽车
    function testBorrowAndReturnCar() public {
        carNFT.mintCar();
        uint256 carId = 0;

        // 借用汽车
        carNFT.borrowCar(carId, 3600); // 借用1小时
        address currentBorrower = carNFT.getCurrentBorrower(carId);
        uint256 availableCars = carNFT.availableCars();

        Assert.equal(currentBorrower, address(this), "借用后当前借用者应为测试合约地址");
        Assert.equal(availableCars, 0, "借用后可用汽车数量应为0");

        // 还车
        carNFT.returnCar(carId);
        currentBorrower = carNFT.getCurrentBorrower(carId);
        availableCars = carNFT.availableCars();

        Assert.equal(currentBorrower, address(0), "还车后当前借用者应为空地址");
        Assert.equal(availableCars, 1, "还车后可用汽车数量应为1");
    }
}
