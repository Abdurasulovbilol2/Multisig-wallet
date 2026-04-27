import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.13.4/+esm";

let provider;
let signer;
let contract;
let contractFactory;
let artifact;
let mode;
let localAccounts = [];
let localAccountIndex = 0;

const accountEl = document.getElementById("account");
const contractAddressEl = document.getElementById("contractAddress");
const logEl = document.getElementById("log");
const manualAddressEl = document.getElementById("manualAddress");

function log(message) {
  const line = `[${new Date().toLocaleTimeString()}] ${message}`;
  logEl.textContent = `${line}\n${logEl.textContent}`;
}

async function loadArtifact() {
  if (artifact) return artifact;
  const res = await fetch(
    "/artifacts/contracts/BasicMultiSig.sol/BasicMultiSig.json",
  );
  if (!res.ok) {
    throw new Error(
      "Compile first: run 'npm run compile' in VS Code terminal.",
    );
  }
  artifact = await res.json();
  return artifact;
}

async function finishConnection() {
  const loaded = await loadArtifact();
  contractFactory = new ethers.ContractFactory(
    loaded.abi,
    loaded.bytecode,
    signer,
  );

  if (contract?.target) {
    contract = new ethers.Contract(contract.target, loaded.abi, signer);
  }

  await setDefaultOwners();
}

async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is required for browser interaction.");
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();
  const address = await signer.getAddress();
  mode = "metamask";
  accountEl.textContent = `Wallet: ${address}`;
  log(`Connected MetaMask wallet ${address}`);

  const network = await provider.getNetwork();
  log(`Network chainId=${network.chainId.toString()}. Use localhost:8545.`);

  await finishConnection();
}

async function connectLocalNode() {
  provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  localAccounts = await provider.send("eth_accounts", []);

  if (!localAccounts.length) {
    throw new Error(
      "No unlocked accounts found on local node. Run 'npm run node'.",
    );
  }

  localAccountIndex = 0;
  signer = await provider.getSigner(localAccounts[localAccountIndex]);
  mode = "local";
  manualAddressEl.value = localAccounts[localAccountIndex];

  const address = await signer.getAddress();
  accountEl.textContent = `Wallet: ${address}`;
  log(`Connected Local Node account ${address}`);

  const network = await provider.getNetwork();
  log(`Network chainId=${network.chainId.toString()} via local JSON-RPC.`);

  await finishConnection();
}

async function connectManualWallet() {
  let rpcUrl = document.getElementById("manualRpcUrl").value.trim();
  let manualAddress = document.getElementById("manualAddress").value.trim();
  const privateKey = document.getElementById("manualPrivateKey").value.trim();

  if (!rpcUrl) {
    rpcUrl = "http://127.0.0.1:8545";
  }

  // Recover from common input mistake: wallet address pasted into RPC field.
  if (ethers.isAddress(rpcUrl) && !manualAddress) {
    manualAddress = rpcUrl;
    rpcUrl = "http://127.0.0.1:8545";
    document.getElementById("manualAddress").value = manualAddress;
    document.getElementById("manualRpcUrl").value = rpcUrl;
    log("Detected wallet address in RPC field. Moved it to manual address.");
  }

  if (!privateKey && !manualAddress) {
    throw new Error(
      "Enter manual wallet address (unlocked node) or private key.",
    );
  }

  provider = new ethers.JsonRpcProvider(rpcUrl);

  if (privateKey) {
    signer = new ethers.Wallet(privateKey, provider);
    mode = "manual";
  } else {
    if (!ethers.isAddress(manualAddress)) {
      throw new Error("Manual wallet address is invalid.");
    }

    signer = await provider.getSigner(manualAddress);
    mode = "manual-address";
  }

  localAccounts = [];

  const address = await signer.getAddress();
  accountEl.textContent = `Wallet: ${address}`;
  log(`Connected manual wallet ${address}`);

  const network = await provider.getNetwork();
  log(
    `Network chainId=${network.chainId.toString()} via manual RPC ${rpcUrl}.`,
  );

  await finishConnection();
}

async function ensureConnected() {
  if (!signer || !provider || !contractFactory) {
    await connectLocalNode();
  }
}

function getOwnersInput() {
  const raw = document.getElementById("owners").value.trim();
  return raw
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function getContractAddress() {
  const addr = contract?.target;
  if (!addr) {
    throw new Error("Deploy contract first.");
  }
  return addr;
}

async function deployContract() {
  await ensureConnected();
  const owners = getOwnersInput();
  const threshold = Number(document.getElementById("threshold").value);
  if (!owners.length) {
    throw new Error("Add owner addresses.");
  }

  log("Deploying BasicMultiSig...");
  contract = await contractFactory.deploy(owners, threshold);
  await contract.waitForDeployment();
  contractAddressEl.textContent = `Contract: ${contract.target}`;
  log(`Deployed at ${contract.target}`);
}

async function fundContract() {
  await ensureConnected();
  const addr = getContractAddress();
  const eth = document.getElementById("fundEth").value;
  const tx = await signer.sendTransaction({
    to: addr,
    value: ethers.parseEther(eth),
  });
  log(`Funding tx sent: ${tx.hash}`);
  await tx.wait();
  log(`Contract funded with ${eth} ETH`);
}

async function submitTransaction() {
  await ensureConnected();
  getContractAddress();
  const to = document.getElementById("to").value.trim();
  const valueEth = document.getElementById("valueEth").value.trim();
  const data = document.getElementById("data").value.trim() || "0x";

  const tx = await contract.submitTransaction(
    to,
    ethers.parseEther(valueEth),
    data,
  );
  log(`submitTransaction tx: ${tx.hash}`);
  await tx.wait();
  log("Transaction submitted (likely txId 0 if first)");
}

async function approveTransaction() {
  await ensureConnected();
  getContractAddress();
  const txId = Number(document.getElementById("submitTxId").value);
  const tx = await contract.approveTransaction(txId);
  log(`approveTransaction tx: ${tx.hash}`);
  await tx.wait();
  log(`Approved txId ${txId}`);
}

async function executeTransaction() {
  await ensureConnected();
  getContractAddress();
  const txId = Number(document.getElementById("submitTxId").value);
  const tx = await contract.executeTransaction(txId);
  log(`executeTransaction tx: ${tx.hash}`);
  await tx.wait();
  log(`Executed txId ${txId}`);
}

async function refreshTx() {
  await ensureConnected();
  getContractAddress();
  const txId = Number(document.getElementById("txIdRefresh").value);
  const tx = await contract.transactions(txId);
  log(
    `Tx ${txId}: to=${tx.to}, value=${ethers.formatEther(
      tx.value,
    )} ETH, executed=${tx.executed}, approvals=${tx.approvalCount}`,
  );
}

async function switchOwner() {
  if (mode === "local") {
    if (!localAccounts.length) {
      throw new Error("Local accounts not loaded.");
    }

    localAccountIndex = (localAccountIndex + 1) % localAccounts.length;
    signer = await provider.getSigner(localAccounts[localAccountIndex]);
    const address = await signer.getAddress();

    const loaded = await loadArtifact();
    if (contract?.target) {
      contract = new ethers.Contract(contract.target, loaded.abi, signer);
    }

    accountEl.textContent = `Wallet: ${address}`;
    log(`Switched to local account ${address}`);
    return;
  }

  if (mode === "manual" || mode === "manual-address") {
    throw new Error(
      "Manual mode uses one selected account. Enter another address/key and reconnect to switch.",
    );
  }

  if (!window.ethereum) {
    throw new Error("MetaMask is required in this mode.");
  }

  await window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [{ eth_accounts: {} }],
  });
  await connectWallet();
}

async function safe(action) {
  try {
    await action();
  } catch (err) {
    log(`ERROR: ${err.message || err}`);
  }
}

async function setDefaultOwners() {
  await ensureConnected();
  let accounts = [];
  try {
    accounts = await provider.send("eth_accounts", []);
  } catch {
    accounts = [];
  }

  if (!accounts.length && signer) {
    accounts = [await signer.getAddress()];
  }

  if (!accounts.length) {
    log("No accounts discovered automatically. Enter owners manually.");
    return;
  }

  const defaults = accounts.slice(0, 3);
  document.getElementById("owners").value = defaults.join(", ");
  document.getElementById("to").value = accounts[3] || "";
  if (!manualAddressEl.value && accounts[0]) {
    manualAddressEl.value = accounts[0];
  }
  log("Loaded default account values into form.");
}

document
  .getElementById("connectBtn")
  .addEventListener("click", () => safe(connectWallet));
document
  .getElementById("connectLocalBtn")
  .addEventListener("click", () => safe(connectLocalNode));
document
  .getElementById("connectManualBtn")
  .addEventListener("click", () => safe(connectManualWallet));
document
  .getElementById("deployBtn")
  .addEventListener("click", () => safe(deployContract));
document
  .getElementById("fundBtn")
  .addEventListener("click", () => safe(fundContract));
document
  .getElementById("submitBtn")
  .addEventListener("click", () => safe(submitTransaction));
document
  .getElementById("approveBtn")
  .addEventListener("click", () => safe(approveTransaction));
document
  .getElementById("executeBtn")
  .addEventListener("click", () => safe(executeTransaction));
document
  .getElementById("refreshBtn")
  .addEventListener("click", () => safe(refreshTx));
document
  .getElementById("switchOwnerBtn")
  .addEventListener("click", () => safe(switchOwner));

safe(async () => {
  try {
    await connectWallet();
  } catch {
    log("MetaMask not detected. Falling back to Local Node mode.");
    await connectLocalNode();
  }
});
