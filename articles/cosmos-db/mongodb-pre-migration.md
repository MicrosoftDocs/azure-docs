---
title: Pre-migration Steps for Data Migrations from MongoDB to Azure Cosmos DB's API for MongoDB
description: This doc provides an overview of the prerequisites for a data migration from MongoDB to Cosmos DB.
author: roaror
ms.service: cosmos-db
ms.subservice: cosmosdb-mongo
ms.topic: conceptual
ms.date: 4/17/2019
ms.author: roaror

---

# Pre-migration Steps for Data Migrations from MongoDB to Azure Cosmos DB's API for MongoDB

Before you migrate your data from MongoDB (either on-premises or in the cloud (IaaS)) to Azure Cosmos DB’s API for MongoDB, you should:

1. Create an Azure Cosmos DB account
2. Estimate the throughput needed for your workloads
3. Pick an optimal partition key for your data
4. Understand the indexing policy that you can set on your data

If you have already completed the above pre-requisites for migration, see the [Migrate MongoDB data to Azure Cosmos DB's API for MongoDB](../dms/tutorial-mongodb-cosmos-db.md) for the actual data migration instructions. If not, this document provides instructions to handle these pre-requisites. 

## Create an Azure Cosmos account using Azure Cosmos DB's API for MongoDB

Before starting the migration, you need to [create an Azure Cosmos account using Azure Cosmos DB’s API for MongoDB](create-mongodb-dotnet.md). 

At the account creation, you can choose settings to [globally distribute](distribute-data-globally.md) your data. You also have the option to enable multi-region writes (or multi-master configuration), that allows each of your regions to be both a write and read region.

![Account-Creation](./media/mongodb-pre-migration/account-creation.png)

## Estimate the throughput need for your workloads

Before starting the migration by using the [Database Migration Service (DMS)](../dms/dms-overview.md), you should estimate the amount of throughput to provision for your Azure Cosmos databases and collections.

Throughput can be provisioned on either:

- Collection

- Database

> [!NOTE]
> You can also have a combination of the above, where some collections in a database may have dedicated provisioned throughput and others may share the throughput. For details, please see [set throughput on a database and a container](set-throughput.md).
>
