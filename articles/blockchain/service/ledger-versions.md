---
title: Azure Blockchain Service supported ledger versions, patching, and upgrade
description: Overview of the supported ledgers versions in Azure Blockchain Service, including policies regarding systems patching and system-managed and user-managed upgrades.
services: azure-blockchain
keywords: blockchain
author: PatAltimore
ms.author: patricka
ms.date: 05/02/2019
ms.topic: article
ms.service: azure-blockchain
ms.reviewer: janders
manager: femila
---

# Supported Azure Blockchain Service ledger versions

Azure Blockchain Service uses the Ethereum-based [Quorum](https://www.goquorum.com/developers) ledger designed for the processing of private transactions within a group of known participants, identified as a consortium in Azure Blockchain Service.

Currently, Azure Blockchain Service supports [Quorum version 2.2.1](https://github.com/jpmorganchase/quorum/releases/tag/v2.2.1) and [Tessera transaction manager](https://github.com/jpmorganchase/tessera).

## Managing updates and upgrades

Versioning in Quorum is done through a major, minor and patch releases. For example, if the Quorum version is 2.0.1, release type would be categorized as follows:

|Major | Minor  | Patch  |
| :--- | :----- | :----- |
| 2 | 0 | 1 | 

Azure Blockchain Service automatically updates patch releases of Quorum to existing running members within 30 days of being made available from Quorum.

## Availability of new ledger versions

Azure Blockchain Service provides the latest major and minor versions of the Quorum ledger within 60 days of being available from the Quorum manufacturer. A maximum of four minor releases are provided for consortia to choose from when provisioning a new member and consortium. Upgrading from to a major or minor release is currently not supported.

## Next steps

[Limits in Azure Blockchain Service](limits.md)
