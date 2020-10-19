---
title: Azure CLI Samples for Azure Cosmos DB Core (SQL) API
description: Azure CLI Samples for Azure Cosmos DB Core (SQL) API
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: sample
ms.date: 10/13/2020
ms.author: mjbrown 
ms.custom: devx-track-azurecli
---

# Azure CLI samples for Azure Cosmos DB Core (SQL) API

The following table includes links to sample Azure CLI scripts for Azure Cosmos DB. Use the links on the right to navigate to API specific samples. Common samples are the same across all APIs. Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb). Azure Cosmos DB CLI script samples can also be found in the [Azure Cosmos DB CLI GitHub Repository](https://github.com/Azure-Samples/azure-cli-samples/tree/master/cosmosdb).

These samples require Azure CLI version 2.12.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli)

For Azure CLI samples for other APIs see [CLI Samples for Cassandra](cli-samples-cassandra.md), [CLI Samples for MongoDB API](cli-samples-mongodb.md), [CLI Samples for Gremlin](cli-samples-gremlin.md), [CLI Samples for Table](cli-samples-table.md)

## Common Samples

These samples apply to all Azure Cosmos DB APIs

|Task | Description |
|---|---|
| [Add or failover regions](scripts/cli/common/regions.md?toc=%2fcli%2fazure%2ftoc.json) | Add a region, change failover priority, trigger a manual failover.|
| [Account keys and connection strings](scripts/cli/common/keys.md?toc=%2fcli%2fazure%2ftoc.json) | List account keys, read-only keys, regenerate keys and list connection strings.|
| [Secure with IP firewall](scripts/cli/common/ipfirewall.md?toc=%2fcli%2fazure%2ftoc.json)| Create a Cosmos account with IP firewall configured.|
| [Secure new account with service endpoints](scripts/cli/common/service-endpoints.md?toc=%2fcli%2fazure%2ftoc.json)| Create a Cosmos account and secure with service-endpoints.|
| [Secure existing account with service endpoints](scripts/cli/common/service-endpoints-ignore-missing-vnet.md?toc=%2fcli%2fazure%2ftoc.json)| Update a Cosmos account to secure with service-endpoints when the subnet is eventually configured.|
|||

## Core (SQL) API Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos account, database and container](scripts/cli/sql/create.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure Cosmos DB account, database, and container for Core (SQL) API. |
| [Create an Azure Cosmos account, database and container with autoscale](scripts/cli/sql/autoscale.md?toc=%2fcli%2fazure%2ftoc.json)| Creates an Azure Cosmos DB account, database, and container with autoscale for Core (SQL) API. |
| [Throughput operations](scripts/cli/sql/throughput.md?toc=%2fcli%2fazure%2ftoc.json) | Read, update and migrate between autoscale and standard throughput on a database and container.|
| [Lock resources from deletion](scripts/cli/sql/lock.md?toc=%2fcli%2fazure%2ftoc.json)| Prevent resources from being deleted with  resource locks.|
|||
