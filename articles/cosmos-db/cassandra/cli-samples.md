---
title: Azure CLI Samples for Azure Cosmos DB Cassandra API
description: Azure CLI Samples for Azure Cosmos DB Cassandra API
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-cassandra
ms.topic: sample
ms.date: 02/21/2022
ms.author: mjbrown 
ms.custom: devx-track-azurecli
---

# Azure CLI samples for Azure Cosmos DB Cassandra API

[!INCLUDE[appliesto-cassandra-api](../includes/appliesto-cassandra-api.md)]

The following tables include links to sample Azure CLI scripts for the Azure Cosmos DB Cassandra API and to sample Azure CLI scripts that apply to all Cosmos DB APIs. Common samples are the same across all APIs.

These samples require Azure CLI version 2.12.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If using Azure Cloud Shell, the latest version is already installed.

## Cassandra API Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos account, keyspace and table](../scripts/cli/cassandra/create.md)| Creates an Azure Cosmos DB account, keyspace, and table for Cassandra API. |
| [Create a serverless Azure Cosmos account for Cassandra API, keyspace and table](../scripts/cli/cassandra/serverless.md)| Creates a serverless Azure Cosmos DB account, keyspace, and table for Cassandra API. |
| [Create an Azure Cosmos account, keyspace and table with autoscale](../scripts/cli/cassandra/autoscale.md)| Creates an Azure Cosmos DB account, keyspace, and table with autoscale for Cassandra API. |
| [Perform throughput operations](../scripts/cli/cassandra/throughput.md) | Read, update and migrate between autoscale and standard throughput on a keyspace and table.|
| [Lock resources from deletion](../scripts/cli/cassandra/lock.md)| Prevent resources from being deleted with  resource locks.|
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

- [CLI Samples for Gremlin](../graph/cli-samples.md)
- [CLI Samples for MongoDB API](../mongodb/cli-samples.md)
- [CLI Samples for SQL](../sql/cli-samples.md)
- [CLI Samples for Table](../table/cli-samples.md)
