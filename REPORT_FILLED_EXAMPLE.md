# Multi-Signature Wallet Security Analysis (Filled Example)

## 1. Objective

This project implements and evaluates a Solidity 2-of-3 multi-signature wallet to demonstrate stronger transaction security than single-key wallets in a cyber security context.

## 2. System Design

- Owners (N): 3
- Required approvals (M): 2
- Environment: Hardhat localhost (chainId 31337) and local browser UI
- Contract: [contracts/BasicMultiSig.sol](contracts/BasicMultiSig.sol)
- Local script: [scripts/run-multisig.js](scripts/run-multisig.js)
- Browser UI: [frontend/index.html](frontend/index.html), [frontend/main.js](frontend/main.js)
- Build configuration: [hardhat.config.js](hardhat.config.js)

## 3. Methodology

### 3.1 Research approach

The project follows a build-and-evaluate methodology:

1. Implement threshold authorization (M-of-N) in Solidity.
2. Execute a controlled transaction workflow.
3. Observe behavior under pre-threshold and post-threshold conditions.
4. Validate whether observed behavior matches security objectives.

### 3.2 Experimental workflow

1. Deploy wallet with 3 owner addresses and threshold M = 2.
2. Deposit 1.0 ETH to wallet address.
3. Submit transfer request txId 0 for 0.1 ETH.
4. Approve once and check that execution condition is still unmet.
5. Approve second time and execute transfer.
6. Verify receiver and contract balance changes.

### 3.3 Reproducibility

The same results can be reproduced with:

1. `npm run compile`
2. `npm run node`
3. `npm run ui`
4. Open `http://127.0.0.1:5500/frontend/index.html`
5. Execute deploy, fund, submit, approve, execute sequence.

## 4. Contract Features

- Owners can submit transfer transactions.
- Owners can approve pending transactions.
- Owners can revoke approvals before execution.
- Transaction execution is allowed only when approvals reach threshold M.

## 5. Demonstration Procedure and Outcome

1. Contract deployed with 3 owners and threshold 2.
2. 1 ETH deposited into contract.
3. Transaction txId 0 submitted to transfer 0.1 ETH.
4. Owner1 approved txId 0.
5. Owner2 approved txId 0.
6. txId 0 executed successfully, and receiver balance increased.

Result:

The transfer could not be executed before threshold approvals and succeeded after two approvals, confirming correct M-of-N authorization logic.

Observed local run values:

- Deployed contract address printed successfully.
- Receiver balance increased by 0.1 ETH.
- Contract final balance became 0.9 ETH.

## 6. Evidence (Screenshots)

1. ![Deploy](screenshots/01-deploy.png)
2. ![Contract Balance](screenshots/02-contract-balance.png)
3. ![Submit Transaction](screenshots/03-submit-tx.png)
4. ![First Approval](screenshots/04-approve-owner1.png)
5. ![Second Approval](screenshots/05-approve-owner2.png)
6. ![Execute Transaction](screenshots/06-execute-tx.png)

## 7. Security Analysis

### 6.1 Reduced vulnerability

The model reduces single point of failure from private key compromise.

### 6.2 Improvement mechanism

In a single-key wallet, attacker effort is to compromise 1 key.
In this design, attacker effort is to compromise at least M keys.

For this demo, required compromise increases from 1 to 2 keys.

Security effect summary:

1. Single private-key theft is insufficient for unauthorized transfer.
2. A single malicious insider cannot execute transactions alone.
3. On-chain events provide a forensic trail for incident review.

### 6.3 Insider threat

A malicious individual owner cannot unilaterally transfer funds, which lowers abuse risk.

### 6.4 Audit and forensics

Submit, Approve, Revoke, and Execute events create an immutable action trail for investigation.

## 8. Limitations

- Owner set is fixed after deployment.
- No timelock protection.
- No spending cap or policy engine.
- No owner rotation/recovery mechanism.
- No formal verification or third-party audit in this project.

## 9. Ethical and Safety Statement

All testing was conducted on local development infrastructure only. No real funds and no production private keys were used.

## 10. Conclusion

The implemented 2-of-3 multi-signature wallet demonstrates practical access control for blockchain security. By requiring collective authorization, it increases resistance to key theft and unilateral insider abuse while preserving transparent and auditable transaction accountability.
