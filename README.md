# Multi-Signature Wallet (Cyber Security Demo)

This project demonstrates a basic Solidity multi-signature wallet using M-of-N authorization.

## Why this is recommended

A multi-signature wallet improves security because one private key is no longer enough to move funds.

- Single wallet risk: 1 compromised key can steal all assets.
- Multi-sig model: attacker must compromise at least M out of N keys.
- Insider risk reduction: one team member cannot transfer funds alone.
- Auditability: all approvals and execution events are recorded on-chain.

## Included files

- `contracts/BasicMultiSig.sol`: Solidity contract with submit, approve, revoke, execute flow.
- `REPORT_TEMPLATE.md`: Ready report structure for coursework.
- `screenshots/README.md`: Exact screenshot names and capture checklist.

## Remix IDE demo steps (2-of-3 example)

1. Open Remix IDE and create/import `contracts/BasicMultiSig.sol`.
2. Compile with Solidity compiler 0.8.20 or compatible.
3. Deploy using 3 owner addresses and `requiredApprovals = 2`.
4. Send some ETH to contract address (for transfer demo).
5. Submit transfer transaction via `submitTransaction`.
6. Switch account to Owner 1 and call `approveTransaction(0)`.
7. Switch account to Owner 2 and call `approveTransaction(0)`.
8. Call `executeTransaction(0)` and verify receiver balance increase.

## Security explanation you can say in viva/presentation

The contract enforces separation of power through threshold approval.

- Authorization is distributed across multiple stakeholders.
- Critical transaction execution depends on explicit quorum.
- Unauthorized or unilateral execution is blocked by design.
- On-chain events provide forensic traceability.

## Threat model mapping

- Threat: key theft of one owner account
  - Mitigation: threshold approval still prevents fund movement.
- Threat: malicious insider
  - Mitigation: requires additional honest owner signatures.
- Threat: accidental transfer
  - Mitigation: approval workflow creates review checkpoint before execution.

## Notes

- This is a basic educational contract, not production hardened.
- For real deployments, add timelocks, owner rotation, nonce strategy, and stronger replay protections.
