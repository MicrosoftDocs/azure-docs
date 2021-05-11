---
title: Frequently asked questions for Azure Confidential Ledger
description: Frequently asked questions for Azure Confidential Ledger
services: confidential-ledger
author: msmbaldwin
ms.service: confidential-ledger
ms.topic: overview
ms.date: 04/15/2021
ms.author: mbaldwin


---

# Frequently asked questions for Azure Confidential Ledger

## How can I tell if the ACC Ledger service would be useful to my organization?

You should consider using the Ledger if your organization stores records which are valuable enough for a motivated attacker to try and compromise the underlying logging/storage system. This includes "insider" scenarios where a rogue employee might attempt to forge, modify or remove previous records.

## What makes ACC Ledger much more secure?

As its name suggests, the Ledger utilizes [Azure Confidential Computing platform](../confidential-computing/index.yml). One Ledger spans across three or more identical instances, each of which run in a dedicated and fully attested hardware-backed enclave. The Ledger's integrity is maintained through a consensus-based blockchain.

## When writing to the ACC Ledger, do I need to store write receipts?

Not necessarily. Some solutions today require users to maintain write receipts for future log validation. This requires users to manage those receipts in a secure storage facility, which adds an additional burden. The Ledger eliminates this challenge through a Merkle tree-based approach, where write receipts include a full tree path to a signed root-of-trust. This means that users can verify transactions without storing or managing any Ledger data.

## How do I verify Ledger's authenticity?

Ledger's authenticity verification can be broken down into two broad categories:

- Verifying that Ledger server nodes that your client is communicating with are authentic. For details, see [Authenticating Confidential Ledger Nodes](authenticate-ledger-nodes.md).
- Verifying that the Ledger blocks, containing all of a user's transactions, have not been tampered with. For details, see [Offline Ledger verification](offline-ledger-verification.md).

## What is the cost of ACC Ledger?

During the private preview period, Ledger is provided to you free of cost. Once it's made publicly available, the Ledger will be a paid service. Additional information will be available closer to public preview.

## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)