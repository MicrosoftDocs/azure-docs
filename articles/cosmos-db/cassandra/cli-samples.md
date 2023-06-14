---
title: Azure CLI Samples for Azure Cosmos DB for Apache Cassandra
description: Azure CLI Samples for Azure Cosmos DB for Apache Cassandra
author: seesharprun
ms.service: cosmos-db
ms.subservice: apache-cassandra
ms.topic: sample
ms.date: 08/19/2022
ms.author: sidandrews
ms.reviewer: mjbrown 
ms.custom: devx-track-azurecli, ignite-2022
---

# Azure CLI samples for Azure Cosmos DB for Apache Cassandra

[!INCLUDE[Cassandra](../includes/appliesto-cassandra.md)]

The following tables include links to sample Azure CLI scripts for the Azure Cosmos DB for Apache Cassandra and to sample Azure CLI scripts that apply to all Azure Cosmos DB APIs. Common samples are the same across all APIs.

These samples require Azure CLI version 2.12.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli). If using Azure Cloud Shell, the latest version is already installed.

## API for Cassandra Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos DB account, keyspace and table](../scripts/cli/cassandra/create.md)| Creates an Azure Cosmos DB account, keyspace, and table for API for Cassandra. |
| [Create a serverless Azure Cosmos DB account for API for Cassandra, keyspace and table](../scripts/cli/cassandra/serverless.md)| Creates a serverless Azure Cosmos DB account, keyspace, and table for API for Cassandra. |
| [Create an Azure Cosmos DB account, keyspace and table with autoscale](../scripts/cli/cassandra/autoscale.md)| Creates an Azure Cosmos DB account, keyspace, and table with autoscale for API for Cassandra. |
| [Perform throughput operations](../scripts/cli/cassandra/throughput.md) | Read, update and migrate between autoscale and standard throughput on a keyspace and table.|
| [Lock resources from deletion](../scripts/cli/cassandra/lock.md)| Prevent resources from being deleted with  resource locks.|
|||

## Common API Samples

These samples apply to all Azure Cosmos DB APIs. These samples use a API for NoSQL account, but these operations are identical across all database APIs in Azure Cosmos DB.

|Task | Description |
|---|---|
| [Add or fail over regions](../scripts/cli/common/regions.md) | Add a region, change failover priority, trigger a manual failover.|
| [Perform account key operations](../scripts/cli/common/keys.md) | List account keys, read-only keys, regenerate keys and list connection strings.|
| [Secure with IP firewall](../scripts/cli/common/ipfirewall.md)| Create an Azure Cosmos DB account with IP firewall configured.|
| [Secure new account with service endpoints](../scripts/cli/common/service-endpoints.md)| Create an Azure Cosmos DB account and secure with service-endpoints.|
| [Secure existing account with service endpoints](../scripts/cli/common/service-endpoints-ignore-missing-vnet.md)| Update an Azure Cosmos DB account to secure with service-endpoints when the subnet is eventually configured.|
| [Find existing free-tier account](../scripts/cli/common/free-tier.md)| Find whether there is an existing free-tier account in your subscription.|
|||

## Next steps

Reference pages for all Azure Cosmos DB CLI commands are available in the [Azure CLI Reference](/cli/azure/cosmosdb).

For Azure CLI samples for other APIs see:

- [CLI Samples for Gremlin](../graph/cli-samples.md)
- [CLI Samples for API for MongoDB](../mongodb/cli-samples.md)
- [CLI Samples for SQL](../sql/cli-samples.md)
- [CLI Samples for Table](../table/cli-samples.md)
