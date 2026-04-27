# 5-Minute Presentation Script (Required University Structure)

## 1. INTRODUCTION (40-45 seconds)

Good morning/afternoon.

My dissertation project is a cyber security-focused multi-signature wallet called BasicMultiSig, implemented in Solidity.

The project addresses secure authorization of blockchain fund transfers by replacing single-key control with threshold approvals.

In my implementation, three owners are registered and at least two approvals are required before execution.

## 2. IMPORTANCE OF TOPIC (45-50 seconds)

This topic is important because single-key wallets create a major single point of failure.

If one key is compromised through phishing, malware, or leakage, an attacker can move all funds immediately.

From a cyber security perspective, this is equivalent to giving one credential full critical-system control.

Multi-signature design introduces separation of duties, which is a core security principle used in banking, privileged access management, and high-risk operations.

## 3. PURPOSE OF STUDY (45-50 seconds)

The purpose of this study is to evaluate whether an M-of-N smart contract wallet provides stronger protection than single-signature authorization.

The study specifically aims to:

1. Implement a practical 2-of-3 multi-signature model.
2. Validate transaction behavior in a controlled local environment.
3. Analyze security impact in terms of key-compromise resistance and insider misuse reduction.

The implementation was tested locally using Hardhat and a browser UI in VS Code.

## 4. RESEARCH QUESTIONS (55-60 seconds)

This study is guided by four research questions:

1. Can a smart contract reliably block execution until the approval threshold is reached?
2. Does a 2-of-3 model increase attacker effort compared to single-key wallets?
3. Can the system reduce unilateral insider abuse by requiring shared authorization?
4. Do contract events provide useful forensic evidence for auditing and incident response?

To answer these, I tested a full flow: deploy, fund, submit transaction, approve from multiple owners, and execute after threshold.

## 5. EXPECTED FINDINGS (70-75 seconds)

The expected and observed findings are:

1. Execution is rejected before threshold approvals.
2. Execution succeeds only when required approvals are met.
3. Duplicate approvals and repeated execution are blocked by contract logic.
4. Event logs produce an immutable and traceable transaction history.

In the local demonstration:

1. The wallet was deployed with 3 owners and threshold 2.
2. The contract was funded with 1 ETH.
3. A transfer of 0.1 ETH was submitted and approved by two owners.
4. Execution succeeded after the second approval.
5. Receiver balance increased by 0.1 ETH and contract balance became 0.9 ETH.

These findings support the argument that threshold authorization improves security posture over single-key control.

## 6. CONCLUSION (35-40 seconds)

In conclusion, this study shows that multi-signature smart contracts can enforce cyber security principles directly in code.

The 2-of-3 model reduces single-point compromise risk, limits unilateral insider actions, and improves accountability through on-chain audit trails.

Although this is a prototype with limitations such as no timelock and fixed owners, it demonstrates a strong foundation for secure blockchain transaction governance.

Thank you.
