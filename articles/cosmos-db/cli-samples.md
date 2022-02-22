---
title: Azure CLI Samples for Azure Cosmos DB Table API
description: Azure CLI Samples for Azure Cosmos DB Table API
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: sample
ms.date: 11/15/2021
ms.author: mjbrown 
ms.custom: devx-track-azurecli
---

# Azure CLI samples for Azure Cosmos DB Table API

[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB. Use the links on the right to navigate to API specific samples. Common samples are the same across all APIs. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb).

These samples require Azure CLI version 2.12.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli)

## Common Samples

These samples apply to all Azure Cosmos DB APIs

|Task | Description |
|---|---|
| [Add or fail over regions](../scripts/cli/common/regions.md) | Add a region, change failover priority, trigger a manual failover.|
| [Perform account key operations](../scripts/cli/common/keys.md) | List account keys, read-only keys, regenerate keys and list connection strings.|
| [Secure with IP firewall](../scripts/cli/common/ipfirewall.md)| Create a Cosmos account with IP firewall configured.|
| [Secure new account with service endpoints](../scripts/cli/common/service-endpoints.md)| Create a Cosmos account and secure with service-endpoints.|
| [Secure existing account with service endpoints](../scripts/cli/common/service-endpoints-ignore-missing-vnet.md)| Update a Cosmos account to secure with service-endpoints when the subnet is eventually configured.|
|||

## API specific samples

- [Cassandra API samples](cassandra/cli-samples.md)
- [Gremlin API samples](graph/cli-samples.md)
- [MongoDB API samples](mongodb/cli-samples.md)
- [SQL API samples](sql/cli-samples.md)
- [Table API samples](table/cli-samples.md)
