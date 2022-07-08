---
title: Synchronize Apache Spark for external table definitions in serverless SQL pool
description: Overview of how to query Spark tables using serverless SQL pool
services: synapse-analytics 
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: sql
ms.date: 02/15/2022
author: juluczni
ms.author: juluczni
ms.reviewer: sngun, wiassaf
---

# Synchronize Apache Spark for Azure Synapse external table definitions in serverless SQL pool

Serverless SQL pool can automatically synchronize metadata from Apache Spark. A serverless SQL pool database will be created for each database existing in serverless Apache Spark pools. 

For each Spark external table based on Parquet or CSV and located in Azure Storage, an external table is created in a serverless SQL pool database. As such, you can shut down your Spark pools and still query Spark external tables from serverless SQL pool.

When a table is partitioned in Spark, files in storage are organized by folders. Serverless SQL pool will use partition metadata and only target relevant folders and files for your query.

Metadata synchronization is automatically configured for each serverless Apache Spark pool provisioned in the Azure Synapse workspace. You can start querying Spark external tables instantly.

Each Spark Parquet or CSV external table located in Azure Storage is represented with an external table in a dbo schema that corresponds to a serverless SQL pool database. 

For Spark external table queries, run a query that targets an external [spark_table]. Before running the following example, make sure you have correct [access to the storage account](develop-storage-files-storage-access-control.md) where the files are located.

```sql
SELECT * FROM [db].dbo.[spark_table]
```

## Apache Spark data types to SQL data types mapping

For more information on mapping Apache Spark data types to SQL data types, see [Azure Synapse Analytics shared metadata tables](../metadata/table.md).

## Next steps

Advance to the [Storage Access Control](develop-storage-files-storage-access-control.md) article to learn more about storage access control.
