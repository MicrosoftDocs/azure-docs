---
title: Query Parquet files using SQL on-demand (preview)
description: In this article, you'll learn how to query Parquet files using SQL on-demand (preview).
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice:
ms.date: 04/15/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---

# Query Parquet files using SQL on-demand (preview) in Azure Synapse Analytics

In this article, you'll learn how to write a query using SQL on-demand (preview) that will read Parquet files.

## Prerequisites

Before reading rest of this article, review the following articles:

- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Dataset

You can query Parquet files the same way you read CSV files. The only difference is that the FILEFORMAT parameter should be set to PARQUET. Examples in this article show the specifics of reading Parquet files.

> [!NOTE]
> You do not have to specify columns in the OPENROWSET WITH clause when reading parquet files. SQL on-demand will utilize metadata in the Parquet file and bind columns by name.

You'll use the folder *parquet/taxi* for the sample queries. It contains NYC Taxi - Yellow Taxi Trip Records data from July 2016. to June 2018.

Data is partitioned by year and month and the folder structure is as follows:

- year=2016
  - month=6
  - ...
  - month=12
- year=2017
  - month=1
  - ...
  - month=12
- year=2018
  - month=1
  - ...
  - month=6

## Query set of parquet files

You can specify only the columns of interest when you query Parquet files.

```sql
SELECT
        YEAR(pickup_datetime),
        passenger_count,
        COUNT(*) AS cnt
FROM  
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/*/*/*',
        FORMAT='PARQUET'
    ) WITH (
        pickup_datetime DATETIME2,
        passenger_count INT
    ) AS nyc
GROUP BY
    passenger_count,
    YEAR(pickup_datetime)
ORDER BY
    YEAR(pickup_datetime),
    passenger_count;
```

## Automatic schema inference

You don't need to use the OPENROWSET WITH clause when reading Parquet files. Column names and data types are automatically read from Parquet files.

The sample below shows the automatic schema inference capabilities for Parquet files. It returns the number of rows in September 2017 without specifying a schema.

> [!NOTE]
> You don't have to specify columns in the OPENROWSET WITH clause when reading Parquet files. In that case, SQL on-demand Query service will utilize metadata in the Parquet file and bind columns by name.

```sql
SELECT
    COUNT_BIG(*)
FROM
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2017/month=9/*.parquet',
        FORMAT='PARQUET'
    ) AS nyc;
```

### Query partitioned data

The data set provided in this sample is divided (partitioned) into separate subfolders. You can target specific partitions using the filepath function. This example shows fare amounts by year, month, and payment_type for the first three months of 2017.

> [!NOTE]
> The SQL on-demand Query is compatible with Hive/Hadoop partitioning scheme.

```sql
SELECT
    nyc.filepath(1) AS [year],
    nyc.filepath(2) AS [month],
    payment_type,
    SUM(fare_amount) AS fare_total
FROM
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=*/month=*/*.parquet',
        FORMAT='PARQUET'
    ) AS nyc
WHERE
    nyc.filepath(1) = 2017
    AND nyc.filepath(2) IN (1, 2, 3)
    AND pickup_datetime BETWEEN CAST('1/1/2017' AS datetime) AND CAST('3/31/2017' AS datetime)
GROUP BY
    nyc.filepath(1),
    nyc.filepath(2),
    payment_type
ORDER BY
    nyc.filepath(1),
    nyc.filepath(2),
    payment_type;
```

## Type mapping

Parquet files contain type descriptions for every column. The following table describes how Parquet types are mapped to SQL native types.

| Parquet type | Parquet logical type (annotation) | SQL data type |
| --- | --- | --- |
| BOOLEAN | | bit |
| BINARY / BYTE_ARRAY | | varbinary |
| DOUBLE | | float |
| FLOAT | | real |
| INT32 | | int |
| INT64 | | bigint |
| INT96 | |datetime2 |
| FIXED_LEN_BYTE_ARRAY | |binary |
| BINARY |UTF8 |varchar \*(UTF8 collation) |
| BINARY |STRING |varchar \*(UTF8 collation) |
| BINARY |ENUM|varchar \*(UTF8 collation) |
| BINARY |UUID |uniqueidentifier |
| BINARY |DECIMAL |decimal |
| BINARY |JSON |varchar(max) \*(UTF8 collation) |
| BINARY |BSON |varbinary(max) |
| FIXED_LEN_BYTE_ARRAY |DECIMAL |decimal |
| BYTE_ARRAY |INTERVAL |varchar(max), serialized into standardized format |
| INT32 |INT(8, true) |smallint |
| INT32 |INT(16, true) |smallint |
| INT32 |INT(32, true) |int |
| INT32 |INT(8, false) |tinyint |
| INT32 |INT(16, false) |int |
| INT32 |INT(32, false) |bigint |
| INT32 |DATE |date |
| INT32 |DECIMAL |decimal |
| INT32 |TIME (MILLIS )|time |
| INT64 |INT(64, true) |bigint |
| INT64 |INT(64, false ) |decimal(20,0) |
| INT64 |DECIMAL |decimal |
| INT64 |TIME (MICROS / NANOS) |time |
|INT64 |TIMESTAMP (MILLIS / MICROS / NANOS) |datetime2 |
|[Complex type](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md#lists) |LIST |varchar(max), serialized into JSON |
|[Complex type](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md#maps)|MAP|varchar(max), serialized into JSON |

## Next steps

Advance to the next article to learn how to [Query Parquet nested types](query-parquet-nested-types.md).
