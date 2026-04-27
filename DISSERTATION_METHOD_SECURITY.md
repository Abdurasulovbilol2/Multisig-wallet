# Dissertation Section: Methodology and Security Analysis

## Methodology

### Research Aim

The aim of this project is to evaluate whether a threshold-based smart contract wallet (M-of-N) improves operational security compared to a single-signature wallet model in a cyber security context.

### Research Design

A build-and-evaluate experimental methodology was used:

1. Design and implement a Solidity multi-signature wallet.
2. Define a repeatable transaction workflow (submit, approve, execute).
3. Execute controlled test cases in a local blockchain environment.
4. Compare observed behavior with expected security properties.
5. Document limitations and residual risks.

### Implementation Environment

- Smart contract: [contracts/BasicMultiSig.sol](contracts/BasicMultiSig.sol)
- Solidity version: 0.8.20
- Local blockchain: Hardhat node on localhost (chainId 31337)
- Local execution script: [scripts/run-multisig.js](scripts/run-multisig.js)
- Browser interface for demonstration: [frontend/index.html](frontend/index.html), [frontend/main.js](frontend/main.js)
- Build configuration: [hardhat.config.js](hardhat.config.js)

### Contract Design Summary

The wallet defines:

- N owners (stored in `owners` and validated by `isOwner`)
- Threshold M (`requiredApprovals`)
- Transaction queue (`transactions`)
- Per-transaction approval tracking (`approvedBy`)

Core operations:

1. `submitTransaction`: owner creates a pending transfer request.
2. `approveTransaction`: owner records approval for transaction `txId`.
3. `revokeApproval`: owner can remove prior approval before execution.
4. `executeTransaction`: callable only when approval count reaches threshold.

### Experimental Procedure

The controlled experiment used a 2-of-3 setup:

1. Deploy wallet with 3 owner accounts and threshold M = 2.
2. Deposit 1.0 ETH into the wallet.
3. Submit transaction `txId = 0` for 0.1 ETH to receiver.
4. Record behavior after first approval.
5. Record behavior after second approval.
6. Execute transaction and verify state changes.

### Validation Strategy

Validation was based on functional and security assertions.

Functional assertions:

- Contract deploys with valid owners and threshold.
- Deposit increases wallet balance.
- Submitted transaction is stored and retrievable.
- Receiver balance increases after successful execution.

Security assertions:

- Unauthorized accounts cannot call owner-only functions.
- Duplicate approvals are rejected.
- Execution before threshold is rejected.
- Executed transactions cannot be executed twice.

### Data Collection

Data was collected from:

- Console outputs from [scripts/run-multisig.js](scripts/run-multisig.js)
- Hardhat transaction receipts
- On-chain state checks (approval count, executed flag, balances)
- Browser UI logs from [frontend/main.js](frontend/main.js)

### Reproducibility

The experiment is reproducible using:

1. `npm run compile`
2. `npm run node`
3. `npm run ui`
4. Open `http://127.0.0.1:5500/frontend/index.html`

Then repeat deploy, fund, submit, approve, and execute steps.

## Security Analysis

### Security Objective

The contract enforces distributed authorization so that no single private key can unilaterally transfer funds.

### Threat Model

Assumed threats:

1. Single key compromise (phishing, malware, credential leakage)
2. Malicious insider owner
3. Human error or accidental transaction submission

Out of scope for this prototype:

1. Blockchain consensus attacks
2. Validator-level reorg/MEV behavior
3. Endpoint compromise of multiple owners simultaneously

### Security Mechanism

For a single-signature wallet, the attacker must compromise one key.
For an M-of-N wallet, the attacker must compromise at least M keys.

For this implementation (2-of-3):

- Single-signature compromise threshold: 1 key
- Multi-signature compromise threshold: 2 keys

So the minimum credential compromise requirement doubles:

$$
\text{Required compromised keys increases from } 1 \text{ to } 2
$$

### Observed Security Behavior

From local execution results:

1. A transaction can be submitted by an owner but is not auto-executed.
2. One approval is insufficient for execution.
3. After the second approval, execution succeeds.
4. Final balances confirm controlled transfer logic.

This behavior demonstrates enforcement of separation of duties.

### Auditability and Forensics

The contract emits immutable events:

- `Submit`
- `Approve`
- `Revoke`
- `Execute`
- `Deposit`

These events support incident reconstruction and accountability by linking action, actor, and sequence.

### Residual Risks and Limitations

This is a teaching prototype and not production-hardened. Key limitations:

1. No timelock for delayed execution.
2. No owner rotation, recovery, or governance updates.
3. No spending limit policy.
4. No advanced monitoring/alerting integration.
5. No formal verification or third-party audit.

### Ethical and Safe Use Statement

All testing was performed on local development infrastructure (Hardhat localhost). No real assets or production keys were used.

### Conclusion for Dissertation

The implemented 2-of-3 multi-signature wallet demonstrates a practical and measurable security improvement over single-signature control by increasing attacker effort, reducing unilateral insider abuse, and providing auditable transaction trails. Within its prototype scope, the system meets its security objective of threshold-based authorization for critical fund transfers.
