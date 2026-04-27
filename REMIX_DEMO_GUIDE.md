# Remix Demo Guide (Exact Steps)

This guide is designed so you can complete your demo and collect all required screenshots quickly.

## A. Open and compile

1. Open Remix IDE.
2. Create file [contracts/BasicMultiSig.sol](contracts/BasicMultiSig.sol) and paste code.
3. Go to Solidity Compiler tab.
4. Compiler version: 0.8.20 (or any compatible 0.8.x).
5. Click Compile.

## B. Deploy with 2-of-3 threshold

1. Open Deploy and Run Transactions tab.
2. Environment: Remix VM (Shanghai).
3. Copy first 3 accounts from Account dropdown.
4. In constructor input:
   - \_owners: ["addr1","addr2","addr3"]
   - \_requiredApprovals: 2
5. Click Deploy.
6. Take screenshot: [screenshots/01-deploy.png](screenshots/01-deploy.png)

## C. Fund contract

1. Copy deployed contract address.
2. In Remix, send 5 Ether to contract address (low-level interactions or transfer to contract).
3. Confirm contract balance changed.
4. Take screenshot: [screenshots/02-contract-balance.png](screenshots/02-contract-balance.png)

## D. Submit transaction

1. Expand deployed contract methods.
2. Call submitTransaction with:
   - \_to: any receiver account not equal to contract
   - \_value: 1000000000000000000 (1 ETH)
   - \_data: 0x
3. Confirm Submit event appears with txId = 0.
4. Take screenshot: [screenshots/03-submit-tx.png](screenshots/03-submit-tx.png)

## E. First approval

1. Switch active account to Owner1.
2. Call approveTransaction with txId = 0.
3. Confirm Approve event appears.
4. Take screenshot: [screenshots/04-approve-owner1.png](screenshots/04-approve-owner1.png)

## F. Second approval

1. Switch active account to Owner2.
2. Call approveTransaction with txId = 0.
3. Confirm second Approve event appears.
4. Optionally call transactions(0) and verify approvalCount = 2.
5. Take screenshot: [screenshots/05-approve-owner2.png](screenshots/05-approve-owner2.png)

## G. Execute

1. Using any owner account, call executeTransaction with txId = 0.
2. Confirm Execute event appears.
3. Verify receiver balance increased by about 1 ETH.
4. Take screenshot: [screenshots/06-execute-tx.png](screenshots/06-execute-tx.png)

## H. Optional revoke control

1. Submit a new tx (txId = 1).
2. Approve with one owner.
3. Call revokeApproval(1) from same owner.
4. Confirm Revoke event appears.
5. Optional screenshot: [screenshots/07-revoke-example.png](screenshots/07-revoke-example.png)

## I. Security lines for viva

Use these exact points:

- The design removes single point of failure from one key.
- M-of-N threshold forces collusion or multi-key compromise.
- Insider abuse is constrained by shared authorization.
- On-chain events provide audit evidence for each decision step.
