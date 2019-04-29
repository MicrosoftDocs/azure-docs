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

Azure Blockchain Service uses the Ethereum-based [Quorum](https://github.com/jpmorganchase/quorum/wiki) ledger designed for the processing of private transactions within a group of known participants, identified as a consortium in Azure Blockchain Service.

Currently, Azure Blockchain Service supports [Quorum version 2.2.1](https://github.com/jpmorganchase/quorum/releases/tag/v2.2.1) and [Tessera transaction manager](https://github.com/jpmorganchase/tessera).

## Managing updates and upgrades

Versioning in Quorum is done through a major release, major point release, and a minor point release. For example, if the Quorum version 2.0.1, 2 is a major release, 0 is a major point release, and 1 is minor point release. The service automatically patches minor point releases of the ledger. Currently, upgrading major and major point releases are not supported.

## Availability of new ledger versions

Azure Blockchain Service provides the latest versions of the ledger within 60 days of being available from the ledger manufacturer. A maximum of four major point releases are provided for consortia to choose from when provisioning a new member and consortium.

## Next steps

[Limits in Azure Blockchain Service](limits.md)
