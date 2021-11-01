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

Confidential Ledger is ideal for organizations with records valuable enough for a motivated attacker to try to compromise the underlying logging/storage system, including "insider" scenarios where a rogue employee might attempt to forge, modify, or remove previous records.

## What makes ACC Ledger much more secure?

As its name suggests, the Ledger utilizes [Azure Confidential Computing platform](../confidential-computing/index.yml). One Ledger spans across three or more identical instances, each of which run in a dedicated, fully attested hardware-backed enclave. The Ledger's integrity is maintained through a consensus-based blockchain.

## When writing to the ACC Ledger, do I need to store write receipts?

Not necessarily. Some solutions today require users to maintain write receipts for future log validation. This requires users to manage those receipts in a secure storage facility, which adds an extra burden. The Ledger eliminates this challenge through a Merkle tree-based approach, where write receipts include a full tree path to a signed root-of-trust. Users can verify transactions without storing or managing any Ledger data.

## How do I verify Ledger's authenticity?

You can verify that the Ledger server nodes that your client is communicating with are authentic. For details, see [Authenticating Confidential Ledger Nodes](authenticate-ledger-nodes.md).



## Next steps

- [Overview of Microsoft Azure Confidential Ledger](overview.md)