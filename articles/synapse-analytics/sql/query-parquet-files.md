---
title: Query Parquet files using serverless SQL pool
description: In this article, you'll learn how to query Parquet files using serverless SQL pool.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 02/15/2023
ms.author: stefanazaric
ms.reviewer: sngun 
---

# Query Parquet files using serverless SQL pool in Azure Synapse Analytics

In this article, you'll learn how to write a query using serverless SQL pool that will read Parquet files.

## Quickstart example

`OPENROWSET` function enables you to read the content of parquet file by providing the URL to your file.

### Read parquet file

The easiest way to see to the content of your `PARQUET` file is to provide file URL to `OPENROWSET` function and specify parquet `FORMAT`. If the file is publicly available or if your Microsoft Entra identity can access this file, you should be able to see the content of the file using the query like the one shown in the following example:

```sql
select top 10 *
from openrowset(
    bulk 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet',
    format = 'parquet') as rows
```

Make sure that you can access this file. If your file is protected with SAS key or custom Azure identity, you would need to set up [server level credential for sql login](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#server-level-credential).

> [!IMPORTANT]
> Ensure you are using a UTF-8 database collation (for example `Latin1_General_100_BIN2_UTF8`) because string values in PARQUET files are encoded using UTF-8 encoding.
> A mismatch between the text encoding in the PARQUET file and the collation may cause unexpected conversion errors.
> You can easily change the default collation of the current database using the following T-SQL statement:
> `ALTER DATABASE CURRENT COLLATE Latin1_General_100_BIN2_UTF8;`
> For more information on collations, see [Collation types supported for Synapse SQL](reference-collation-types.md).

If you use the `Latin1_General_100_BIN2_UTF8` collation you will get an additional performance boost compared to the other collations. The `Latin1_General_100_BIN2_UTF8` collation is compatible with parquet string sorting rules. The SQL pool is able to eliminate some parts of the parquet files that will not contain data needed in the queries (file/column-segment pruning). If you use other collations, all data from the parquet files will be loaded into Synapse SQL and the filtering is happening within the SQL process. The `Latin1_General_100_BIN2_UTF8` collation has additional performance optimization that works only for parquet and Cosmos DB. The downside is that you lose fine-grained comparison rules like case insensitivity.

### Data source usage

Previous example uses full path to the file. As an alternative, you can create an external data source with the location that points to the root folder of the storage, and use that data source and the relative path to the file in `OPENROWSET` function:

```sql
create external data source covid
with ( location = 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases' );
go
select top 10 *
from openrowset(
        bulk 'latest/ecdc_cases.parquet',
        data_source = 'covid',
        format = 'parquet'
    ) as rows
```

If a data source is protected with SAS key or custom identity, you can configure [data source with database scoped credential](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#database-scoped-credential).

### Explicitly specify schema

`OPENROWSET` enables you to explicitly specify what columns you want to read from the file using `WITH` clause:

```sql
select top 10 *
from openrowset(
        bulk 'latest/ecdc_cases.parquet',
        data_source = 'covid',
        format = 'parquet'
    ) with ( date_rep date, cases int, geo_id varchar(6) ) as rows
```

> [!IMPORTANT]
> Make sure that you are explicilty specifying some UTF-8 collation (for example `Latin1_General_100_BIN2_UTF8`) for all string columns in `WITH` clause or set some UTF-8 collation at database level.
> Mismatch between text encoding in the file and string column collation might cause unexpected conversion errors.
> You can easily change default collation of the current database using the following T-SQL statement:
> `ALTER DATABASE CURRENT COLLATE Latin1_General_100_BIN2_UTF8;`
> You can easily set collation on the colum types, for example:
>    `geo_id varchar(6) collate Latin1_General_100_BIN2_UTF8`
> For more information on collations, see [Collation types supported for Synapse SQL](../sql/reference-collation-types.md).

In the following sections, you can see how to query various types of PARQUET files.

## Prerequisites

Your first step is to **create a database** with a datasource that references [NYC Yellow Taxi](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/) storage account. Then initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script will create the data sources, database scoped credentials, and external file formats that are used in these samples.

## Dataset

[NYC Yellow Taxi](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/) dataset is used in this sample. You can query Parquet files the same way you [read CSV files](query-single-csv-file.md). The only difference is that the `FILEFORMAT` parameter should be set to `PARQUET`. Examples in this article show the specifics of reading Parquet files.

## Query set of parquet files

You can specify only the columns of interest when you query Parquet files.

```sql
SELECT
        YEAR(tpepPickupDateTime),
        passengerCount,
        COUNT(*) AS cnt
FROM  
    OPENROWSET(
        BULK 'puYear=2018/puMonth=*/*.snappy.parquet',
        DATA_SOURCE = 'YellowTaxi',
        FORMAT='PARQUET'
    ) WITH (
        tpepPickupDateTime DATETIME2,
        passengerCount INT
    ) AS nyc
GROUP BY
    passengerCount,
    YEAR(tpepPickupDateTime)
ORDER BY
    YEAR(tpepPickupDateTime),
    passengerCount;
```

## Automatic schema inference

You don't need to use the OPENROWSET WITH clause when reading Parquet files. Column names and data types are automatically read from Parquet files.

Have in mind that if you are reading number of files at once, the schema, column names and data types will be inferred from the first file service gets from the storage. This can mean that some of the columns expected are omitted, all because the file used by the service to define the schema did not contain these columns. To explicitly specify the schema, please use OPENROWSET WITH clause.

The following sample shows the automatic schema inference capabilities for Parquet files. It returns the number of rows in September 2018 without specifying a schema.

> [!NOTE]
> You don't have to specify columns in the OPENROWSET WITH clause when reading Parquet files. In that case, serverless SQL pool query service will utilize metadata in the Parquet file and bind columns by name.

```sql
SELECT TOP 10 *
FROM  
    OPENROWSET(
        BULK 'puYear=2018/puMonth=9/*.snappy.parquet',
        DATA_SOURCE = 'YellowTaxi',
        FORMAT='PARQUET'
    ) AS nyc
```

### Query partitioned data

The data set provided in this sample is divided (partitioned) into separate subfolders. You can target specific partitions using the filepath function. This example shows fare amounts by year, month, and payment_type for the first three months of 2017.

> [!NOTE]
> The serverless SQL pool query is compatible with Hive/Hadoop partitioning scheme.

```sql
SELECT
        YEAR(tpepPickupDateTime),
        passengerCount,
        COUNT(*) AS cnt
FROM  
    OPENROWSET(
        BULK 'puYear=*/puMonth=*/*.snappy.parquet',
        DATA_SOURCE = 'YellowTaxi',
        FORMAT='PARQUET'
    ) nyc
WHERE
    nyc.filepath(1) = 2017
    AND nyc.filepath(2) IN (1, 2, 3)
    AND tpepPickupDateTime BETWEEN CAST('1/1/2017' AS datetime) AND CAST('3/31/2017' AS datetime)
GROUP BY
    passengerCount,
    YEAR(tpepPickupDateTime)
ORDER BY
    YEAR(tpepPickupDateTime),
    passengerCount;
```

## Type mapping

For Parquet type mapping to SQL native type check [type mapping for Parquet](develop-openrowset.md#type-mapping-for-parquet).

## Next steps

Advance to the next article to learn how to [Query Parquet nested types](query-parquet-nested-types.md).
