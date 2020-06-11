---
title: Azure Blockchain Service ledger versions, patching, & upgrade
description: Overview of the supported ledgers versions in Azure Blockchain Service, including policies regarding systems patching and system-managed and user-managed upgrades.
ms.date: 06/02/2020
ms.topic: conceptual
ms.reviewer: janders
#Customer intent: As an operator, I want to understand supported upgrades and versions for Azure Blockchain Service.
---

# Supported Azure Blockchain Service ledger versions

Azure Blockchain Service uses the Ethereum-based [Quorum](https://www.goquorum.com/developers) ledger designed for the processing of private transactions within a group of known participants, identified as a consortium in Azure Blockchain Service.

Currently, Azure Blockchain Service supports [Quorum version 2.5.0](https://github.com/jpmorganchase/quorum/releases/tag/v2.5.0) and [Tessera transaction manager](https://github.com/jpmorganchase/tessera).

## Managing updates and upgrades

Versioning in Quorum is done through a major, minor, and patch releases. For example, if the Quorum version is 2.0.1, release type would be categorized as follows:

|Major | Minor  | Patch  |
| :--- | :----- | :----- |
| 2 | 0 | 1 | 

Azure Blockchain Service automatically updates patch releases of Quorum to existing running members within 30 days of being made available from Quorum.

## Availability of new ledger versions

Azure Blockchain Service provides the latest major and minor versions of the Quorum ledger within 60 days of being available from the Quorum manufacturer. A maximum of four minor releases are provided for consortia to choose from when provisioning a new member and consortium. Upgrading from to a major or minor release is currently not supported. For example, if you are running version 2.x, an upgrade to version 3.x is currently not supported. Similarly, if you are running version 2.2, an upgrade to version 2.3 is currently not supported.

## Next steps

[Limits in Azure Blockchain Service](limits.md)
