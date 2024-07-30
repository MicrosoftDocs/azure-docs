---
title: Options to migrate data from MongoDB
titleSuffix: vCore-based Azure Cosmos DB for MongoDB
description: Review various options to migrate your data from other MongoDB sources to vCore-based Azure Cosmos DB for MongoDB.
author: sandeep-nair
ms.author: sandnair
ms.reviewer: sidandrews
ms.service: cosmos-db
ms.subservice: mongodb-vcore
ms.topic: conceptual
ms.date: 11/17/2023
# CustomerIntent: As a MongoDB user, I want to understand the various options available to migrate my data to vCore-based Azure Cosmos DB for MongoDB, so that I can make an informed decision about which option is best for my use case.
---

# What are the options to migrate data from MongoDB to vCore-based Azure Cosmos DB for MongoDB?

This document describes the various options to lift and shift your MongoDB workloads to vCore-based Azure Cosmos DB for MongoDB offering.

Migrations can be done in two ways:

- Offline Migration: A snapshot based bulk copy from source to target. New data added/updated/deleted on the source after the snapshot isn't copied to the target. The application downtime required depends on the time taken for the bulk copy activity to complete.

- Online Migration: Apart from the bulk data copy activity done in the offline migration, a change stream monitors all additions/updates/deletes. After the bulk data copy is completed, the data in the change stream is copied to the target to ensure that all updates made during the migration process are also transferred to the target. The application downtime required is minimal.

## Azure Data Studio (Online)

The [MongoDB migration extension for Azure Data Studio](/azure-data-studio/extensions/database-migration-for-mongo-extension) is the preferred tool in migrating your MongoDB workloads to the vCore-based Azure Cosmos DB for MongoDB.

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

You can use the native MongoDB tools such as *mongodump/mongorestore*, *mongoexport/mongoimport* to migrate datasets offline (without replicating live changes) to vCore-based Azure Cosmos DB for MongoDB offering.

| Scenario | MongoDB native tool |
| --- | --- |
| Move subset of database data (JSON/CSV-based) | *mongoexport/mongoimport* |
| Move whole database (BSON-based) | *mongodump/mongorestore* |

- *mongoexport/mongoimport* is the best pair of migration tools for migrating a subset of your MongoDB database.
  - *mongoexport* exports your existing data to a human-readable JSON or CSV file. *mongoexport* takes an argument specifying the subset of your existing data to export.
  - *mongoimport* opens a JSON or CSV file and inserts the content into the target database instance (vCore-based Azure Cosmos DB for MongoDB in this case.).
  - JSON and CSV aren't a compact format; you could incur excess network charges as *mongoimport* sends data to vCore-based Azure Cosmos DB for MongoDB.
- *mongodump/mongorestore* is the best pair of migration tools for migrating your entire MongoDB database. The compact BSON format makes more efficient use of network resources as the data is inserted into vCore-based Azure Cosmos DB for MongoDB.
  - *mongodump* exports your existing data as a BSON file.
  - *mongorestore* imports your BSON file dump into vCore-based Azure Cosmos DB for MongoDB.

> [!NOTE]
> The MongoDB native tools can move data only as fast as the host hardware allows.

## Data migration using Azure Databricks (Offline/Online)

Migrating using Azure Databricks offers full control of the migration rate and data transformation. This method can also support large datasets that are in TBs in size. The spark migration utility operates as a job within Databricks.


This tool supports the following MongoDB sources:
- MongoDB VM
- MongoDB Atlas
- AWS DocumentDB 
- Azure Cosmos DB MongoDB RU (Offline only)

[Sign up  for Azure Cosmos DB for MongoDB Spark Migration](https://forms.office.com/r/cLSRNugFSp) to gain access to the Spark Migration Tool GitHub repository. The repository offers detailed, step-by-step instructions for migrating your workloads from various Mongo sources to vCore-based Azure Cosmos DB for MongoDB.


## Related content

- Migrate data to vCore-based Azure Cosmos DB for MongoDB using [native MongoDB tools](how-to-migrate-native-tools.md).
- Migrate data to vCore-based Azure Cosmos DB for MongoDB using the [MongoDB migration extension for Azure Data Studio](/azure-data-studio/extensions/database-migration-for-mongo-extension).
