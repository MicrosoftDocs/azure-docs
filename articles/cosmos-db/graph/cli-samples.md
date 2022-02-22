---
title: Azure CLI Samples for Azure Cosmos DB Gremlin API
description: Azure CLI Samples for Azure Cosmos DB Gremlin API
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-graph
ms.topic: sample
ms.date: 02/21/2022
ms.author: mjbrown 
ms.custom: devx-track-azurecli
---

# Azure CLI samples for Azure Cosmos DB Gremlin API

[!INCLUDE[appliesto-gremlin-api](../includes/appliesto-gremlin-api.md)]

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB. Use the links on the right to navigate to API specific samples. Common samples are the same across all APIs. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb). 

These samples require Azure CLI version 2.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli)

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

## Gremlin API Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos account, database and graph](../scripts/cli/gremlin/create.md)| Creates an Azure Cosmos DB account, database, and graph for Gremlin API. |
| [Create a serverless Azure Cosmos account for Gremlin API, database and graph](../scripts/cli/gremlin/serverless.md)| Creates a serverless Azure Cosmos DB account, database, and graph for Gremlin API. |
| [Create an Azure Cosmos account, database and graph with autoscale](../scripts/cli/gremlin/autoscale.md)| Creates an Azure Cosmos DB account, database, and graph with autoscale for Gremlin API. |
| [Perform throughput operations](../scripts/cli/gremlin/throughput.md) | Read, update and migrate between autoscale and standard throughput on a database and graph.|
| [Lock resources from deletion](../scripts/cli/gremlin/lock.md)| Prevent resources from being deleted with  resource locks.|
|||
