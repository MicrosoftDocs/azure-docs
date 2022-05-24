---
title: Azure CLI Samples for Azure Cosmos DB Table API
description: Azure CLI Samples for Azure Cosmos DB Table API
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-table
ms.topic: sample
ms.date: 02/21/2022
ms.author: mjbrown 
ms.custom: devx-track-azurecli
---

# Azure CLI samples for Azure Cosmos DB Table API

[!INCLUDE[appliesto-table-api](../includes/appliesto-table-api.md)]

The following tables include links to sample Azure CLI scripts for the Azure Cosmos DB Table API and to sample Azure CLI scripts that apply to all Cosmos DB APIs. Common samples are the same across all APIs.

These samples require Azure CLI version 2.12.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If using Azure Cloud Shell, the latest version is already installed.

## Table API Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos account and table](../scripts/cli/table/create.md)| Creates an Azure Cosmos DB account and table for Table API. |
| [Create a serverless Azure Cosmos account and table](../scripts/cli/table/serverless.md)| Creates a serverless Azure Cosmos DB account and table for Table API. |
| [Create an Azure Cosmos account and table with autoscale](../scripts/cli/table/autoscale.md)| Creates an Azure Cosmos DB account and table with autoscale for Table API. |
| [Perform throughput operations](../scripts/cli/table/throughput.md) | Read, update and migrate between autoscale and standard throughput on a table.|
| [Lock resources from deletion](../scripts/cli/table/lock.md)| Prevent resources from being deleted with resource locks.|
|||

## Common API Samples

These samples apply to all Azure Cosmos DB APIs. These samples use a SQL (Core) API account, but these operations are identical across all database APIs in Cosmos DB.

|Task | Description |
|---|---|
| [Add or fail over regions](../scripts/cli/common/regions.md) | Add a region, change failover priority, trigger a manual failover.|
| [Perform account key operations](../scripts/cli/common/keys.md) | List account keys, read-only keys, regenerate keys and list connection strings.|
| [Secure with IP firewall](../scripts/cli/common/ipfirewall.md)| Create a Cosmos account with IP firewall configured.|
| [Secure new account with service endpoints](../scripts/cli/common/service-endpoints.md)| Create a Cosmos account and secure with service-endpoints.|
| [Secure existing account with service endpoints](../scripts/cli/common/service-endpoints-ignore-missing-vnet.md)| Update a Cosmos account to secure with service-endpoints when the subnet is eventually configured.|
|||

## Next steps

Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb).

For Azure CLI samples for other APIs see:

- [CLI Samples for Cassandra](../cassandra/cli-samples.md)
- [CLI Samples for Gremlin](../graph/cli-samples.md)
- [CLI Samples for MongoDB API](../mongodb/cli-samples.md)
- [CLI Samples for SQL](../sql/cli-samples.md)
