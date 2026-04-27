// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Basic Multi-Signature Wallet (M-of-N)
/// @notice Demonstrates transaction submission, approval, revocation, and execution
contract BasicMultiSig {
    event Deposit(address indexed sender, uint256 amount, uint256 balance);
    event Submit(uint256 indexed txId, address indexed to, uint256 value, bytes data);
    event Approve(address indexed owner, uint256 indexed txId);
    event Revoke(address indexed owner, uint256 indexed txId);
    event Execute(uint256 indexed txId);

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint256 public requiredApprovals;

    struct Transaction {
        address to;
        uint256 value;
        bytes data;
        bool executed;
        uint256 approvalCount;
    }

    Transaction[] public transactions;
    mapping(uint256 => mapping(address => bool)) public approvedBy;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "Not owner");
        _;
    }

    modifier txExists(uint256 txId) {
        require(txId < transactions.length, "Transaction does not exist");
        _;
    }

    modifier notExecuted(uint256 txId) {
        require(!transactions[txId].executed, "Transaction already executed");
        _;
    }

    modifier notApproved(uint256 txId) {
        require(!approvedBy[txId][msg.sender], "Already approved");
        _;
    }

    constructor(address[] memory _owners, uint256 _requiredApprovals) {
        require(_owners.length > 0, "Owners required");
        require(
            _requiredApprovals > 0 && _requiredApprovals <= _owners.length,
            "Invalid approval threshold"
        );

        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "Invalid owner");
            require(!isOwner[owner], "Duplicate owner");

            isOwner[owner] = true;
            owners.push(owner);
        }

        requiredApprovals = _requiredApprovals;
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }

    function submitTransaction(address _to, uint256 _value, bytes calldata _data) external onlyOwner {
        require(_to != address(0), "Invalid recipient");

        uint256 txId = transactions.length;
        transactions.push(
            Transaction({
                to: _to,
                value: _value,
                data: _data,
                executed: false,
                approvalCount: 0
            })
        );

        emit Submit(txId, _to, _value, _data);
    }

    function approveTransaction(uint256 txId)
        external
        onlyOwner
        txExists(txId)
        notExecuted(txId)
        notApproved(txId)
    {
        approvedBy[txId][msg.sender] = true;
        transactions[txId].approvalCount += 1;

        emit Approve(msg.sender, txId);
    }

    function revokeApproval(uint256 txId) external onlyOwner txExists(txId) notExecuted(txId) {
        require(approvedBy[txId][msg.sender], "Not approved");

        approvedBy[txId][msg.sender] = false;
        transactions[txId].approvalCount -= 1;

        emit Revoke(msg.sender, txId);
    }

    function executeTransaction(uint256 txId) external onlyOwner txExists(txId) notExecuted(txId) {
        Transaction storage txn = transactions[txId];
        require(txn.approvalCount >= requiredApprovals, "Not enough approvals");

        txn.executed = true;

        (bool success, ) = txn.to.call{value: txn.value}(txn.data);
        require(success, "Execution failed");

        emit Execute(txId);
    }

    function getOwners() external view returns (address[] memory) {
        return owners;
    }

    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }
}
