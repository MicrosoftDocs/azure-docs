---
title: Synchronize Apache Spark for external table definitions in serverless SQL pool
description: Overview of how to query Spark tables using serverless SQL pool
services: synapse-analytics 
author: julieMSFT
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: sql
ms.date: 04/15/2020
ms.author: jrasnick
ms.reviewer: jrasnick
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

> [!NOTE]
> Add, drop, or alter Spark external table commands for a column will not be reflected in the external table in serverless SQL pool.

## Apache Spark data types to SQL data types mapping

| Spark data type | SQL data type | Comments |
|---|---|---|
| `LongType`, `long`, `bigint`                | `bigint`              | **Spark**: *LongType* represents 8-byte signed integer numbers. [Reference](/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql) |
| `BooleanType`, `boolean`                    | `bit` (Parquet), `varchar(6)` (CSV)  | |
| `DecimalType`, `decimal`, `dec`, `numeric`  | `decimal`             | **Spark**: *DecimalType* represents arbitrary-precision signed decimal numbers. Backed internally by java.math.BigDecimal. A BigDecimal consists of an arbitrary precision integer unscaled value and a 32-bit integer scale. <br> **SQL**: Fixed precision and scale numbers. When maximum precision is used, valid values are from - 10^38 +1 through 10^38 - 1. The ISO synonyms for decimal are dec and dec(p, s). numeric is functionally identical to decimal. [Reference](/sql/t-sql/data-types/decimal-and-numeric-transact-sql]) |
| `IntegerType`, `Integer`, `int`             | `int`                 | **Spark** *IntegerType* represents 4-byte signed integer numbers. [Reference](/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql)|
| `ByteType`, `Byte`, `tinyint`               | `smallint`            | **Spark**: *ByteType* represents 1-byte signed integer numbers [-128 to 127] and ShortType represents 2-byte signed integer numbers [-32768 to 32767]. <br> **SQL**: Tinyint represents 1-byte signed integer numbers [0, 255] and smallint represents 2-byte signed integer numbers [-32768, 32767]. [Reference](/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql)|
| `ShortType`, `Short`, `smallint`            | `smallint`            | Same as above. |
| `DoubleType`, `Double`                      | `float`               | **Spark**: *DoubleType* represents 8-byte double-precision floating point numbers. For **SQL** [visit this page](/sql/t-sql/data-types/float-and-real-transact-sql).|
| `FloatType`, `float`, `real`                | `real`                | **Spark**: *FloatType* represents 4-byte double-precision floating point numbers. For **SQL** [visit this page](/sql/t-sql/data-types/float-and-real-transact-sql).|
| `DateType`, `date`                          | `date`                | **Spark**: *DateType* represents values comprising values of fields year, month and day, without a time-zone.|
| `TimestampType`, `timestamp`                | `datetime2`           | **Spark**: *TimestampType* represents values comprising values of fields year, month, day, hour, minute, and second, with the session local time-zone. The timestamp value represents an absolute point in time.
| `char`                                      | `char`                |
| `StringType`, `String`, `varchar`           | `Varchar(n)`          | **Spark**: *StringType* represents character string values. *VarcharType(n)* is a variant of StringType which has a length limitation. Data writing will fail if the input string exceeds the length limitation. This type can only be used in table schema, not functions/operators.<br> *CharType(n)* is a variant of *VarcharType(n)* which is fixed length. Reading column of type *CharType(n)* always returns string values of length n. Char type column comparison will pad the short one to the longer length. <br> **SQL**: In *Varchar(n)* n can be max 8000, and if it is partitioned column, n can be max 2048. <br> Use it with collation `Latin1_General_100_BIN2_UTF8`. |
| `BinaryType`, `binary`                      | `varbinary(n)`        | **SQL**: In *Varbinary(n)* n can be max 8000, and if it is partitioned column, n can be max 2048. |
| `array`, `map`, `struct`                    | `varchar(max)`        | **SQL**: Serializes into JSON with collation `Latin1_General_100_BIN2_UTF8` |

\* Collation used is Latin1_General_100_BIN2_UTF8.

\** ArrayType, MapType, and StructType are represented as JSONs.

## Next steps

Advance to the [Storage Access Control](develop-storage-files-storage-access-control.md) article to learn more about storage access control.
