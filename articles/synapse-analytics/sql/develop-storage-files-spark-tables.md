---
title: Synchronize Apache Spark for Azure Synapse external table definitions in SQL on-demand (preview)
description: Overview of how to query Spark tables using SQL on-demand (preview)
services: synapse-analytics 
author: julieMSFT
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice:
ms.date: 04/15/2020
ms.author: jrasnick
ms.reviewer: jrasnick
---

# Synchronize Apache Spark for Azure Synapse external table definitions in SQL on-demand (preview)

The SQL on-demand (preview) can automatically synchronize metadata from Apache Spark for Azure Synapse pools. A SQL on-demand database will be created for each database existing in Spark pools (preview). 

For each Spark external table based on Parquet and located in Azure Storage, an external table is created in the SQL on-demand database. As such, you can shut down your Spark pools and still query Spark external tables from SQL on-demand.

When a table is partitioned in Spark, files in storage are organized by folders. SQL on-demand will utilize partition metadata and only target relevant folders and files for your query.

Metadata synchronization is automatically configured for each Spark pool provisioned in the Azure Synapse workspace. You can start querying Spark external tables instantly.

Each Spark parquet external table located in Azure Storage is represented with an external table in a dbo schema that corresponds to a SQL on-demand database. 

For Spark external table queries, run a query that targets an external [spark_table]. Before running the example below, make sure you have correct [access to the storage account](develop-storage-files-storage-access-control.md) where the files are located.

```sql
SELECT * FROM [db].dbo.[spark_table]
```

## Spark data types to SQL data types mapping

| Spark data type | SQL data type               |
| --------------- | --------------------------- |
| ByteType        | smallint                    |
| ShortType       | smallint                    |
| IntegerType     | int                         |
| LongType        | bigint                      |
| FloatType       | real                        |
| DoubleType      | float                       |
| DecimalType     | decimal                     |
| TimestampType   | datetime2                   |
| DateType        | date                        |
| StringType      | varchar(max)*               |
| BinaryType      | varbinary                   |
| BooleanType     | bit                         |
| ArrayType       | varchar(max)* (into JSON)** |
| MapType         | varchar(max)* (into JSON)** |
| StructType      | varchar(max)* (into JSON)** |

\* Collation used is Latin1_General_100_BIN2_UTF8.

** ArrayType, MapType, and StructType are represented as JSONs.



## Next steps

Advance to the [Storage Access Control](develop-storage-files-storage-access-control.md) article to learn more about storage access control.
