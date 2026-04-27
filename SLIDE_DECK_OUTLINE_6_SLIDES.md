# 6-Slide Deck Outline: Multi-Signature Wallet Security

## Slide 1: Title and Objective

On slide:

- Multi-Signature Smart Contract Wallet (M-of-N)
- Cyber Security Focused Blockchain Access Control
- Objective: Prevent unauthorized fund transfer using threshold approvals

Speaker notes:

This project implements a Solidity-based multi-signature wallet. The key idea is replacing single-key authorization with M-of-N approval, so one compromised key cannot move funds.

## Slide 2: Security Problem and Threat Model

On slide:

- Single-key wallet = single point of failure
- Threats:
  - Private key compromise
  - Malicious insider
  - Accidental transfer
- Need: shared authorization for critical actions

Speaker notes:

In traditional wallets, one stolen key can drain all assets. From a cybersecurity perspective, this is weak access control. We address this using threshold-based authorization.

## Slide 3: Proposed Design (2-of-3)

On slide:

- N = 3 owners
- M = 2 approvals required
- Core workflow:
  1. Submit transaction
  2. Approve by owners
  3. Execute after threshold
- Contract: [contracts/BasicMultiSig.sol](contracts/BasicMultiSig.sol)

Speaker notes:

In this demo, any transfer needs approval from at least two owners. This enforces separation of duties and reduces unilateral control risk.

## Slide 4: Remix Demonstration Evidence

On slide:

- Deployed contract with 3 owners and threshold 2
- Deposited ETH
- Submitted txId 0
- Approved by Owner1 and Owner2
- Executed successfully after second approval

Evidence files:

- [screenshots/01-deploy.png](screenshots/01-deploy.png)
- [screenshots/02-contract-balance.png](screenshots/02-contract-balance.png)
- [screenshots/03-submit-tx.png](screenshots/03-submit-tx.png)
- [screenshots/04-approve-owner1.png](screenshots/04-approve-owner1.png)
- [screenshots/05-approve-owner2.png](screenshots/05-approve-owner2.png)
- [screenshots/06-execute-tx.png](screenshots/06-execute-tx.png)

Speaker notes:

The demo confirms execution is blocked before threshold and allowed only after required approvals are met.

## Slide 5: Security Analysis and Impact

On slide:

- Attack effort increases from 1 key to at least M keys
- Insider misuse reduced by shared decision making
- Event logs improve accountability and forensics
- Practical mapping to access control principles

Speaker notes:

Security is improved because authorization is distributed. The model raises attacker cost and provides an immutable action trail through events.

## Slide 6: Limitations and Future Work

On slide:

- Current limitations:
  - No timelock
  - Fixed owners/threshold after deployment
  - No spending cap policy
- Future enhancements:
  - Owner rotation and threshold updates via governance
  - Timelock for high-value transfers
  - Policy-based transaction controls

Speaker notes:

This is an educational baseline. Future hardening can make it suitable for more realistic operational scenarios.

## Optional Closing Line

This project shows how cybersecurity principles like separation of duties and least unilateral privilege can be enforced directly in smart contract logic.
