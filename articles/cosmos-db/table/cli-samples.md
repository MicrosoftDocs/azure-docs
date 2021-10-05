---
title: Azure CLI Samples for Azure Cosmos DB Table API
description: Azure CLI Samples for Azure Cosmos DB Table API
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: sample
ms.date: 10/13/2020
ms.author: mjbrown 
ms.custom: devx-track-azurecli
---

# Azure CLI samples for Azure Cosmos DB Table API
[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB. Use the links on the right to navigate to API specific samples. Common samples are the same across all APIs. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb). Azure Cosmos DB CLI script samples can also be found in the [Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).

These samples require Azure CLI version 2.12.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli)

## Common Samples

These samples apply to all Azure Cosmos DB APIs

|Task | Description |
|---|---|
| [Add or failover regions](../scripts/cli/common/regions.md?toc=%2fcli%2fazure%2ftoc.json) | Add a region, change failover priority, trigger a manual failover.|
| [Account keys and connection strings](../scripts/cli/common/keys.md?toc=%2fcli%2fazure%2ftoc.json) | List account keys, read-only keys, regenerate keys and list connection strings.|
| [Secure with IP firewall](../scripts/cli/common/ipfirewall.md?toc=%2fcli%2fazure%2ftoc.json)| Create a Cosmos account with IP firewall configured.|
| [Secure new account with service endpoints](../scripts/cli/common/service-endpoints.md?toc=%2fcli%2fazure%2ftoc.json)| Create a Cosmos account and secure with service-endpoints.|
| [Secure existing account with service endpoints](../scripts/cli/common/service-endpoints-ignore-missing-vnet.md?toc=%2fcli%2fazure%2ftoc.json)| Update a Cosmos account to secure with service-endpoints when the subnet is eventually configured.|
|||

## Table API Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos account and table](../scripts/cli/table/create.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure Cosmos DB account and table for Table API. |
| [Create an Azure Cosmos account and table with autoscale](../scripts/cli/table/autoscale.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure Cosmos DB account and table with autoscale for Table API. |
| [Throughput operations](../scripts/cli/table/throughput.md?toc=%2fcli%2fazure%2ftoc.json) | Read, update and migrate between autoscale and standard throughput on a table.|
| [Lock resources from deletion](../scripts/cli/table/lock.md?toc=%2fcli%2fazure%2ftoc.json)| Prevent resources from being deleted with resource locks.|
|||
