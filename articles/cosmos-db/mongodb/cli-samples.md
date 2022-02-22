---
title: Azure CLI Samples for Azure Cosmos DB API for MongoDB
description: Azure CLI Samples for Azure Cosmos DB API for MongoDB
author: markjbrown
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: sample
ms.date: 02/21/2022
ms.author: mjbrown 
ms.custom: devx-track-azurecli
---

# Azure CLI samples for Azure Cosmos DB API for MongoDB

[!INCLUDE[appliesto-mongodb-api](../includes/appliesto-mongodb-api.md)]

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

## MongoDB API Samples

|Task | Description |
|---|---|
| [Create an Azure Cosmos account, database and collection](../scripts/cli/mongodb/create.md)| Creates an Azure Cosmos DB account, database, and collection for MongoDB API. |
| [Create a serverless Azure Cosmos account, database and collection](../scripts/cli/mongodb/serverless.md)| Creates a serverless Azure Cosmos DB account, database, and collection for MongoDB API. |
| [Create an Azure Cosmos account, database with autoscale and two collections with shared throughput](../scripts/cli/mongodb/autoscale.md)| Creates an Azure Cosmos DB account, database with autoscale and two collections with shared throughput for MongoDB API. |
| [Perform throughput operations](../scripts/cli/mongodb/throughput.md) | Read, update and migrate between autoscale and standard throughput on a database and collection.|
| [Lock resources from deletion](../scripts/cli/mongodb/lock.md)| Prevent resources from being deleted with  resource locks.|
|||

## Next steps

Trying to do capacity planning for a migration to Azure Cosmos DB? You can use information about your existing database cluster for capacity planning.
* If all you know is the number of vcores and servers in your existing database cluster, read about [estimating request units using vCores or vCPUs](../convert-vcore-to-request-unit.md) 
* If you know typical request rates for your current database workload, read about [estimating request units using Azure Cosmos DB capacity planner](estimate-ru-capacity-planner.md)
