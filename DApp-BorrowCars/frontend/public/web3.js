// 导入Web3.js
const Web3 = require('web3');
const web3 = new Web3('HTTP://127.0.0.1:7545'); 

// 合约地址和ABI
const contractAddress = '0xF166D6c082F160Ca0CB7162326C5c0D106B577a5BALANCE'; 
const contractABI = [...]; 

// 创建智能合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 获取用户拥有的汽车列表
async function getUserOwnedCars() {
    const userAddress = 'HTTP://127.0.0.1:7545'; 
    const ownedCars = await contract.methods.getOwnedCars().call({ from: userAddress });
    return ownedCars;
}

// 租借汽车
async function rentCar(carId, borrowDuration) {
    const userAddress = 'HTTP://127.0.0.1:7545'; 
    await contract.methods.borrowCar(carId, borrowDuration).send({ from: userAddress });
}

// 更新界面函数
async function updateUI() {
    // 获取用户拥有的汽车列表
    const ownedCars = await getUserOwnedCars();
    // 更新界面以显示拥有的汽车

    // 获取可租借的汽车列表
    const availableCars = await contract.methods.getAvailableCars().call();
    // 更新界面以显示可租借的汽车

    // 添加其他逻辑和界面更新
}

// 处理租借汽车表单提交
document.getElementById('rentCarForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const carId = document.getElementById('carId').value;
    const borrowDuration = document.getElementById('borrowDuration').value;
    await rentCar(carId, borrowDuration);
    updateUI();
});

// 调用updateUI以初始化界面
updateUI();
