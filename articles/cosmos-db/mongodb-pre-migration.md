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

If you have already completed the above pre-requisites for migration, see the [Migrate MongoDB data to Azure Cosmos DB’s API for MongoDB tutorial] (././dms/tutorial-mongodb-cosmos-db) for the actual data migration instructions. If not, this document provides instructions to handle these pre-requisites. 