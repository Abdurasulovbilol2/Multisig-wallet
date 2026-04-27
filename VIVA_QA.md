# Viva Q&A Cheat Sheet

## Q1. What is M-of-N in your project?

M-of-N means out of N total owners, at least M owners must approve a transaction before execution.

## Q2. Why is this better than a single-owner wallet?

A single-owner wallet can be drained if one key is stolen. Multi-sig requires compromise of multiple keys, which is harder.

## Q3. What access control is used?

onlyOwner modifiers ensure only registered owners can submit, approve, revoke, or execute transactions.

## Q4. How do you prevent duplicate approvals?

Each txId has a mapping that tracks whether a specific owner already approved. A second approval from the same owner is rejected.

## Q5. Can a transaction be executed twice?

No. The transaction has an executed flag and execution is blocked once it is true.

## Q6. What if an owner changes mind before execution?

The owner can call revokeApproval(txId), which decreases approval count before execution.

## Q7. What logs are available for auditing?

Submit, Approve, Revoke, Execute, and Deposit events provide immutable traceability.

## Q8. What are limitations of this version?

No timelock, fixed owner set, and no daily spending limit.

## Q9. What is one major future improvement?

Add owner-rotation and threshold-update methods protected by multi-signature governance itself.

## Q10. How does this relate to cybersecurity?

It enforces separation of duties and reduces single-point compromise risk, which are core cybersecurity control principles.
