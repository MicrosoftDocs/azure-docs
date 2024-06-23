---
title: Options to migrate data from MongoDB
titleSuffix: Azure Cosmos DB for MongoDB vCore
description: Review various options to migrate your data from other MongoDB sources to Azure Cosmos DB for MongoDB vCore.
author: sandeep-nair
ms.author: sandnair
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 11/17/2023
# CustomerIntent: As a MongoDB user, I want to understand the various options available to migrate my data to Azure Cosmos DB for MongoDB vCore, so that I can make an informed decision about which option is best for my use case.
---

# What are the options to migrate data from MongoDB to Azure Cosmos DB for MongoDB vCore?

This document describes the various options to lift and shift your MongoDB workloads to Azure Cosmos DB for MongoDB vCore offering.

## Azure Data Studio (Offline)

The [The MongoDB migration extension for Azure Data Studio](/azure-data-studio/extensions/database-migration-for-mongo-extension) is the preferred tool in migrating your MongoDB workloads to the API for MongoDB vCore.

The migration process has two phases:

- **Premigration assessment** - An evaluation of your current MongoDB data estate to determine if there are any incompatibilities.
- **Migration** - The migration operation using services managed by Azure.

### Premigration assessment

Assessment involves finding out whether you're using the [features and syntax that are supported](./compatibility.md). The purpose of this stage is to identify any incompatibilities or warnings that exist in the current MongoDB solution. You should resolve the issues found in the assessment results before moving on with the migration process.

> [!TIP]
> We recommend you review the [supported features and syntax](./compatibility.md) in detail and perform a proof-of-concept prior to the actual migration.

### Migration

Use the graphical user interface to manage the entire migration process from start to finish. The migration is launched in Azure Data Studio but runs in the cloud on Azure-managed resources.

## Native MongoDB tools (Offline)

You can use the native MongoDB tools such as *mongodump/mongorestore*, *mongoexport/mongoimport* to migrate datasets offline (without replicating live changes) to Azure Cosmos DB for MongoDB vCore offering.

| Scenario | MongoDB native tool |
| --- | --- |
| Move subset of database data (JSON/CSV-based) | *mongoexport/mongoimport* |
| Move whole database (BSON-based) | *mongodump/mongorestore* |

- *mongoexport/mongoimport* is the best pair of migration tools for migrating a subset of your MongoDB database.
  - *mongoexport* exports your existing data to a human-readable JSON or CSV file. *mongoexport* takes an argument specifying the subset of your existing data to export.
  - *mongoimport* opens a JSON or CSV file and inserts the content into the target database instance (Azure Cosmos DB for MongoDB vCore in this case.).
  - JSON and CSV aren't a compact format; you could incur excess network charges as *mongoimport* sends data to Azure Cosmos DB for MongoDB vCore.
- *mongodump/mongorestore* is the best pair of migration tools for migrating your entire MongoDB database. The compact BSON format makes more efficient use of network resources as the data is inserted into Azure Cosmos DB for MongoDB vCore.
  - *mongodump* exports your existing data as a BSON file.
  - *mongorestore* imports your BSON file dump into Azure Cosmos DB for MongoDB vCore.

> [!NOTE]
> The MongoDB native tools can move data only as fast as the host hardware allows.

## Data migration using Azure Databricks (Offline/Online)

Migrating using Azure Databricks offers full control of the migration rate and data transformation. This method can also support large datasets that are in TBs in size.

- [Azure Databricks](https://azure.microsoft.com/services/databricks/) is a platform as a service (PaaS) offering for [Apache Spark](https://spark.apache.org/). You can use Azure Databricks to do an offline/online migration of databases from MongoDB to Azure Cosmos DB for MongoDB.
- Here's how you can [migrate data to Azure Cosmos DB for MongoDB vCore offline using Azure Databricks](../migrate-databricks.md#provision-an-azure-databricks-cluster)

## Related content

- Migrate data to Azure Cosmos DB for MongoDB vCore [using native MongoDB tools](how-to-migrate-native-tools.md).
- Migrate data to Azure Cosmos DB for MongoDB vCore [using Azure Databricks](../migrate-databricks.md).
