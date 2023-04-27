---
title: Azure CLI Samples for Azure Cosmos DB for Gremlin
description: Azure CLI Samples for Azure Cosmos DB for Gremlin
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-gremlin
ms.topic: sample
ms.date: 08/19/2022
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurecli, ignite-2022
---

# Azure CLI samples for Azure Cosmos DB for Gremlin

[!INCLUDE[Gremlin](../includes/appliesto-gremlin.md)]

The following tables include links to sample Azure CLI scripts for the Azure Cosmos DB for Gremlin and to sample Azure CLI scripts that apply to all Cosmos DB APIs. Common samples are the same across all APIs.

These samples require Azure CLI version 2.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If using Azure Cloud Shell, the latest version is already installed.

## Gremlin API Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos account, database and graph](../scripts/cli/gremlin/create.md)| Creates an Azure Cosmos DB account, database, and graph for Gremlin API. |
| [Create a serverless Azure Cosmos account for Gremlin API, database and graph](../scripts/cli/gremlin/serverless.md)| Creates a serverless Azure Cosmos DB account, database, and graph for Gremlin API. |
| [Create an Azure Cosmos account, database and graph with autoscale](../scripts/cli/gremlin/autoscale.md)| Creates an Azure Cosmos DB account, database, and graph with autoscale for Gremlin API. |
| [Perform throughput operations](../scripts/cli/gremlin/throughput.md) | Read, update and migrate between autoscale and standard throughput on a database and graph.|
| [Lock resources from deletion](../scripts/cli/gremlin/lock.md)| Prevent resources from being deleted with  resource locks.|
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
| [Find existing free-tier account](../scripts/cli/common/free-tier.md)| Find whether there is an existing free-tier account in your subscription.|
|||

## Next steps

Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb).

For Azure CLI samples for other APIs see:

- [CLI Samples for Cassandra](../cassandra/cli-samples.md)
- [CLI Samples for MongoDB API](../mongodb/cli-samples.md)
- [CLI Samples for SQL](../sql/cli-samples.md)
- [CLI Samples for Table](../table/cli-samples.md)
