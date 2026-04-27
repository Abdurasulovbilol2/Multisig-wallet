# Report Template: Multi-Signature Wallet Security Analysis

## 1. Objective

Build and test a Solidity smart contract implementing M-of-N transaction approval to improve wallet security.

Proposed statement:

This project implements a 2-of-3 multi-signature wallet in Solidity and evaluates its security advantages over single-key authorization.

## 2. System Design

- Owners (N): [fill]
- Required approvals (M): [fill]
- Network / Environment: Remix VM or testnet [fill]
- Contract file: [contracts/BasicMultiSig.sol](contracts/BasicMultiSig.sol)

Suggested values for class demo:

- Owners (N): 3
- Required approvals (M): 2
- Environment: Remix VM (Shanghai)

## 3. Contract Features

- Transaction submission by owner
- Transaction approval by multiple owners
- Approval revocation before execution
- Execution only after threshold M is reached

## 4. Demonstration Procedure

1. Deploy contract with N owners and threshold M.
2. Deposit funds.
3. Submit transfer transaction.
4. Approve from Owner A.
5. Approve from Owner B (until threshold reached).
6. Execute transfer.

Concrete demo values (example):

1. Deploy with owner addresses Owner1, Owner2, Owner3 and M = 2.
2. Deposit 5 ETH to the contract.
3. Submit transaction with:
   - to = receiver account
   - value = 1 ether
   - data = 0x
4. Owner1 calls approveTransaction(0).
5. Owner2 calls approveTransaction(0).
6. Any owner calls executeTransaction(0).

## 5. Evidence (Screenshots)

Attach the following screenshots:

1. Deployment parameters and successful deployment
2. Contract balance after deposit
3. Submit event and txId
4. First approval event
5. Second approval event and approval count
6. Execute event and receiver balance change

Recommended attachment mapping:

1. ![Deploy](screenshots/01-deploy.png)
2. ![Contract Balance](screenshots/02-contract-balance.png)
3. ![Submit Transaction](screenshots/03-submit-tx.png)
4. ![First Approval](screenshots/04-approve-owner1.png)
5. ![Second Approval](screenshots/05-approve-owner2.png)
6. ![Execute Transaction](screenshots/06-execute-tx.png)

## 6. Security Analysis

### 6.1 What vulnerability is reduced?

Single point of failure from one private key compromise.

### 6.2 How does multi-sig improve security?

It changes the attacker requirement from compromising 1 key to compromising at least M keys.

### 6.3 Insider threat impact

A single malicious owner cannot execute transactions alone.

### 6.4 Audit and forensics value

Events (Submit, Approve, Execute) produce immutable evidence for incident review.

## 7. Limitations

- No timelock
- Fixed owners and threshold after deployment
- No daily spending cap

## 8. Conclusion

The multi-signature design increases resilience against key theft and insider misuse by enforcing collective authorization.

Short conclusion option:

The implemented 2-of-3 multi-signature wallet demonstrates that critical fund transfers can be protected through distributed authorization. Compared to single-key control, this design significantly raises the attack cost and reduces the probability of unauthorized transactions.
