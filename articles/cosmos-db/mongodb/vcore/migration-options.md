---
title: Migrate data from MongoDB
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Learn about the various options to migrate your data from other MongoDB sources to Azure Cosmos DB for MongoDB vCore.
author: nayakshweta
ms.author: shwetn
ms.reviewer: gahllevy
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 03/09/2023
---

# Options for migrating data to Azure Cosmos DB for MongoDB vCore

This document describes the various options to lift and shift your MongoDB workloads to Azure Cosmos DB for MongoDB vCore-based offering.

## Native MongoDB tools (Offline)

- You can use the native MongoDB tools such as *mongodump/mongorestore*, *mongoexport/mongoimport* to migrate datasets offline (without replicating live changes) to Azure Cosmos DB for MongoDB vCore-based offering.
- *mongodump/mongorestore* works well for migrating your entire MongoDB database. The compact BSON format makes more efficient use of network resources as the data is inserted into Azure Cosmos DB.
  - *mongodump* exports your existing data as a BSON file.
  - *mongorestore* imports your BSON file dump into Azure Cosmos DB.
- *mongoexport/mongoimport* works well for migrating a subset of your MongoDB database.
  - *mongoexport* exports your existing data to a human-readable JSON or CSV file.
  - *mongoexport* takes an argument specifying the subset of your existing data to export.
  - *mongoimport* opens a JSON or CSV file and inserts the content into the target database instance (Azure Cosmos DB in this case.).
  - Since JSON and CSV aren't compact formats, you may incur excess network charges as *mongoimport* sends data to Azure Cosmos DB.
- Here's how you can [migrate data to Azure Cosmos DB for MongoDB vCore using the native MongoDB tools](../tutorial-mongotools-cosmos-db.md#perform-the-migration).

## Data migration using Azure Databricks (Offline/Online)

- This method offers full control of the migration rate and data transformation. It can also support large datasets that are in TBs in size.
- [Azure Databricks](https://azure.microsoft.com/services/databricks/) is a platform as a service (PaaS) offering for [Apache Spark](https://spark.apache.org/). You can use Azure Databricks to do an offline/online migration of databases from MongoDB to Azure Cosmos DB for MongoDB.
- Here's how you can [migrate data to Azure Cosmos DB for MongoDB vCore offline using Azure Databricks](../migrate-databricks.md#provision-an-azure-databricks-cluster)

## Next steps

- Migrate data to Azure Cosmos DB for MongoDB vCore [using native MongoDB tools](../tutorial-mongotools-cosmos-db.md).
- Migrate data to Azure Cosmos DB for MongoDB vCore [using Azure Databricks](../migrate-databricks.md).
