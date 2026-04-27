# Final University Presentation Pack

## A) 2-Minute Script (Directly Usable)

Good morning/afternoon.

My project is a cyber security-focused multi-signature wallet implemented in Solidity.

The core idea is M-of-N authorization. In my implementation, there are 3 owners and at least 2 approvals are required before any transaction can be executed.

This solves a major security problem in single-key wallets: one compromised private key can transfer all assets. In a 2-of-3 model, compromising one key is not enough.

The contract supports four operations:

1. Submit transaction
2. Approve transaction
3. Revoke approval
4. Execute transaction after threshold

I validated this in my local VS Code workflow using Hardhat and a browser UI.

The observed flow was:

1. Deploy with 3 owners and threshold 2
2. Fund contract with 1 ETH
3. Submit transfer of 0.1 ETH
4. Approve from Owner 1 and Owner 2
5. Execute successfully only after second approval

This confirms threshold enforcement and separation of duties.

The events Submit, Approve, Revoke, Execute, and Deposit provide immutable audit evidence for forensics.

In conclusion, this project reduces single-point key compromise risk, constrains insider misuse, and improves accountability through on-chain transparency.

Thank you.

## B) 5-Minute Script (Dissertation/Viva Version)

### 1. Introduction

My dissertation project explores smart contract access control from a cyber security perspective.

The objective is to evaluate whether multi-signature authorization can provide stronger protection than single-signature wallets against unauthorized fund movement.

### 2. Problem Statement

A single-owner wallet has a single point of failure.

If one key is stolen through phishing, malware, or poor key management, an attacker can transfer all funds.

Cyber security best practice for high-impact actions is separation of duties. Multi-signature wallets enforce this technically, not just procedurally.

### 3. Proposed Solution

I implemented an M-of-N wallet in Solidity.

- N = total owners
- M = minimum required approvals

For this project:

- N = 3
- M = 2

This means at least two independent approvals are required for execution.

### 4. System Design

The implementation is in [contracts/BasicMultiSig.sol](contracts/BasicMultiSig.sol).

It includes:

1. Owner registry and onlyOwner access control
2. Threshold validation in constructor
3. Transaction queue with execution state
4. Per-transaction approval tracking
5. Guard checks against duplicate approvals and re-execution

### 5. Experimental Method

I ran the system locally in VS Code using Hardhat node and a browser UI.

Execution sequence:

1. Deploy wallet with 3 owners and threshold 2
2. Deposit 1 ETH
3. Submit transaction txId 0 for 0.1 ETH
4. Approve by first owner
5. Approve by second owner
6. Execute transfer

Observed result:

- Execution blocked before threshold
- Execution successful after second approval
- Receiver gained 0.1 ETH
- Contract balance became 0.9 ETH

### 6. Security Analysis

Security improvement is measurable:

- Single-signature compromise requirement: 1 key
- Multi-signature 2-of-3 compromise requirement: 2 keys

So attacker effort increases from one compromised credential to coordinated compromise of at least two owners.

Additional security effects:

1. Reduces unilateral insider abuse
2. Enforces shared authorization for high-risk actions
3. Produces immutable action logs for auditing

### 7. Limitations

This is a prototype, not production-hardened.

Current limitations:

1. No timelock
2. Fixed owners and threshold
3. No spending cap policy
4. No formal verification

### 8. Conclusion

This project demonstrates that core cyber security principles, especially separation of duties and reduced unilateral privilege, can be enforced directly in smart contract logic.

The 2-of-3 model significantly improves resilience compared to single-key authorization.

## C) 6-Slide Talk Track (Slide-by-Slide)

### Slide 1: Title and Objective

Say:

This project evaluates multi-signature authorization as a blockchain access control mechanism for cyber security.

### Slide 2: Problem and Threat Model

Say:

Single-key wallets are vulnerable to key compromise and unilateral misuse. The project addresses this by requiring collective approvals.

### Slide 3: Proposed 2-of-3 Design

Say:

Any owner can submit, but execution requires 2 approvals from 3 registered owners.

### Slide 4: Demonstration Steps

Say:

Deployed locally, funded contract, submitted tx, approved from two owners, then executed. Execution did not proceed before threshold.

### Slide 5: Security Impact

Say:

Attacker requirement increased from 1 compromised key to at least 2 keys, and all decisions are auditable through events.

### Slide 6: Limitations and Future Work

Say:

Future hardening includes timelock, owner rotation, policy controls, and formal verification.

## D) Closing Line

This work shows that blockchain wallets can embed strong cyber security controls by design, not only by user policy.
