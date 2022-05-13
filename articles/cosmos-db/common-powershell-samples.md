---
title: Azure PowerShell samples common to all Azure Cosmos DB APIs
description: Azure PowerShell Samples common to all Azure Cosmos DB APIs
ms.service: cosmos-db
ms.topic: sample
ms.date: 05/02/2022
author: markjbrown
ms.author: mjbrown
ms.custom: devx-track-azurecli
---

# Azure PowerShell samples for Azure Cosmos DB API

[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

The following table includes links to sample Azure PowerShell scripts that apply to all Cosmos DB APIs. For API specific samples, see [API specific samples](#api-specific-samples). Common samples are the same across all APIs.

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

These samples require Azure PowerShell Az 5.4.0 or later. Run `Get-Module -ListAvailable Az` to see which versions are installed. If you need to install, see [Install Azure PowerShell module](/powershell/azure/install-az-ps).

## Common API Samples

These samples use a SQL (Core) API account. To use these samples for other APIs, copy the related properties and apply to your API specific scripts.

|Task | Description |
|---|---|
| [Account keys or connection strings](scripts/powershell/common/keys-connection-strings.md)| Get primary and secondary keys and connection strings, or regenerate an account key.|
| [Change failover priority or trigger failover](scripts/powershell/common/failover-priority-update.md)| Change the regional failover priority or trigger a manual failover.|
| [Create an account with IP Firewall](scripts/powershell/common/firewall-create.md)| Create an Azure Cosmos DB account with IP Firewall enabled.|
| [Update account](scripts/powershell/common/account-update.md) | Update an account's default consistency level.|
| [Update an account's regions](scripts/powershell/common/update-region.md) | Add regions to an account or change regional failover order.|

## API specific samples

- [Cassandra API samples](cassandra/powershell-samples.md)
- [Gremlin API samples](graph/powershell-samples.md)
- [MongoDB API samples](mongodb/powershell-samples.md)
- [SQL API samples](sql/powershell-samples.md)
- [Table API samples](table/powershell-samples.md)

## Next steps

- [Azure PowerShell documentation](/powershell)
