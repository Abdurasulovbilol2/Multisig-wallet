const hre = require("hardhat");

async function main() {
  const [owner1, owner2, owner3, receiver] = await hre.ethers.getSigners();

  console.log("Deploying BasicMultiSig...");
  console.log("Owner 1:", owner1.address);
  console.log("Owner 2:", owner2.address);
  console.log("Owner 3:", owner3.address);
  console.log("Receiver:", receiver.address);

  const BasicMultiSig = await hre.ethers.getContractFactory("BasicMultiSig");
  const multisig = await BasicMultiSig.deploy(
    [owner1.address, owner2.address, owner3.address],
    2,
  );

  await multisig.waitForDeployment();
  const multisigAddress = await multisig.getAddress();
  console.log("BasicMultiSig deployed at:", multisigAddress);

  // Fund contract so it can execute outgoing transfer.
  const depositTx = await owner1.sendTransaction({
    to: multisigAddress,
    value: hre.ethers.parseEther("1.0"),
  });
  await depositTx.wait();

  const contractBalanceAfterDeposit = await hre.ethers.provider.getBalance(
    multisigAddress,
  );
  console.log(
    "Contract balance after deposit:",
    hre.ethers.formatEther(contractBalanceAfterDeposit),
    "ETH",
  );

  const transferValue = hre.ethers.parseEther("0.1");
  const receiverBalanceBefore = await hre.ethers.provider.getBalance(
    receiver.address,
  );

  const submitTx = await multisig
    .connect(owner1)
    .submitTransaction(receiver.address, transferValue, "0x");
  await submitTx.wait();
  console.log("Transaction submitted with txId 0");

  const approve1 = await multisig.connect(owner1).approveTransaction(0);
  await approve1.wait();
  console.log("Owner 1 approved txId 0");

  const approve2 = await multisig.connect(owner2).approveTransaction(0);
  await approve2.wait();
  console.log("Owner 2 approved txId 0");

  const executeTx = await multisig.connect(owner3).executeTransaction(0);
  await executeTx.wait();
  console.log("Transaction executed");

  const receiverBalanceAfter = await hre.ethers.provider.getBalance(
    receiver.address,
  );
  const received = receiverBalanceAfter - receiverBalanceBefore;
  console.log(
    "Receiver balance increased by:",
    hre.ethers.formatEther(received),
    "ETH",
  );

  const contractBalanceFinal = await hre.ethers.provider.getBalance(
    multisigAddress,
  );
  console.log(
    "Contract final balance:",
    hre.ethers.formatEther(contractBalanceFinal),
    "ETH",
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
