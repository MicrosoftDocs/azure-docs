---
title: Query Delta Lake format using serverless SQL pool (preview)
description: In this article, you'll learn how to query files stored in Apache Delta Lake format using serverless SQL pool.
services: synapse analytics
author: jovanpop-msft
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 04/27/2021
ms.author: jovanpop
ms.reviewer: jrasnick 
---

# Query Delta Lake files (preview) using serverless SQL pool in Azure Synapse Analytics

In this article, you'll learn how to write a query using serverless Synapse SQL pool to read Apache Delta Lake files.
Delta Lake is an open-source storage layer that brings ACID (atomicity, consistency, isolation, and durability) transactions to Apache Spark and big data workloads.

The serverless SQL pool in Synapse workspace enables you to read the data stored in Delta Lake format, and serve it to reporting tools. 
A serverless SQL pool can read Delta Lake files that are created using Apache Spark, Azure Databricks, or any other producer of the Delta Lake format.

Apache Spark pools in Azure Synapse enable data engineers to modify Delta Lake files using Scala, PySpark, and .NET. Serverless SQL pools help data analysts to create reports
on Delta Lake files created by data engineers.

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

## Quickstart example

The [OPENROWSET](develop-openrowset.md) function enables you to read the content of Delta Lake files by providing the URL to your root folder.

### Read Delta Lake folder

The easiest way to see to the content of your `DELTA` file is to provide the file URL to the [OPENROWSET](develop-openrowset.md) function and specify `DELTA` format. If the file is publicly available or if your Azure AD identity can access this file, you should be able to see the content of the file using a query like the one shown in the following example:

```sql
select top 10 *
from openrowset(
    bulk 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet',
    format = 'delta') as rows
```

Column names and data types are automatically read from Delta Lake files. The `OPENROWSET` function uses best guess types like VARCHAR(1000) for the string columns.
The URI in the `OPENROWSET` function must reference a root Delta Lake folder that contains a subfolder called `_delta_log`.

To improve the performance of your queries, consider specifying explicit types in [the `WITH` cause](#explicitly-specify-schema).

> [!NOTE]
> The serverless Synapse SQL pool uses schema inference to automatically determine columns and their types. The rules for schema inference are the same used for Parquet files.
> For Delta Lake type mapping to SQL native type check [type mapping for Parquet](develop-openrowset.md#type-mapping-for-parquet). 

Make sure you can access your file. If your file is protected with SAS key or custom Azure identity, you will need to set up a [server level credential for sql login](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#server-scoped-credential).

> [!IMPORTANT]
> Ensure you are using a UTF-8 database collation (for example `Latin1_General_100_BIN2_UTF8`) because string values in Delta Lake files are encoded using UTF-8 encoding.
> A mismatch between the text encoding in the Delta Lake file and the collation may cause unexpected conversion errors.
> You can easily change the default collation of the current database using the following T-SQL statement:
>   `alter database current collate Latin1_General_100_BIN2_UTF8`

### Data source usage

The previous examples used the full path to the file. As an alternative, you can create an external data source with the location that points to the root folder of the storage. Once you've created the external data source, use the data source and the relative path to the file in the `OPENROWSET` function. This way you don't need to use the full absolute URI to your files. You can also then define custom credentials to access the storage location.

> [!IMPORTANT]
> Data sources can be created only in custom databases (not in master of the databases replicated from Apache Spark). 

To use the samples below, you will need to complete the following step:
1. **Create a database** with a datasource that references [NYC Yellow Taxi](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/) storage account. 
1. Initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on the database you created in step 1. This setup script will create the data sources, database scoped credentials, and external file formats that are used in these samples.

If you created your database, and switched the context to your database (using `USE database_name` statement or dropdown for selecting database in some query editor), you can create 
your external data source containing the root URI to your data set and use it to query Delta Lake files:

```sql
create external data source covid
with ( location = 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases' );
go

select top 10 *
from openrowset(
        bulk 'latest/ecdc_cases.parquet',
        data_source = 'covid',
        format = 'delta'
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
        format = 'delta'
    )
    with ( date_rep date,
           cases int,
           geo_id varchar(6)
           ) as rows
```

With the explicit specification of the result set schema, you can minimize the type sizes and use the more precise types VARCHAR(6) for string columns instead of pessimistic VARCHAR(1000). Minimization of types might significantly improve performance of your queries.

> [!IMPORTANT]
> Make sure that you are explicitly specifying a UTF-8 collation (for example `Latin1_General_100_BIN2_UTF8`) for all string columns in `WITH` clause or set a UTF-8 collation at the database level.
> Mismatch between text encoding in the file and string column collation might cause unexpected conversion errors.
> You can easily change default collation of the current database using the following T-SQL statement:
>   `alter database current collate Latin1_General_100_BIN2_UTF8`
> You can easily set collation on the colum types using the following definition:
>    `geo_id varchar(6) collate Latin1_General_100_BIN2_UTF8`

## Dataset

[NYC Yellow Taxi](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/) dataset is used in this sample. You can query Parquet files the same way you [read CSV files](query-parquet-files.md). The only difference is that the `FILEFORMAT` parameter should be set to `PARQUET`. Examples in this article show the specifics of reading Parquet files.


### Query partitioned data
The data set provided in this sample is divided (partitioned) into separate subfolders.
Unlike [Parquet](query-parquet-files.md), you don't need to target specific partitions using the `FILEPATH` function. The `OPENROWSET` will identify partitioning
columns in your Delta Lake folder structure and enable you to directly query data using these columns. This example shows fare amounts by year, month, and payment_type for the first three months of 2017.

```sql
SELECT
        YEAR(tpepPickupDateTime),
        passengerCount,
        COUNT(*) AS cnt
FROM  
    OPENROWSET(
        BULK 'yellowTaxi',
        DATA_SOURCE = 'Samples',
        FORMAT='DELTA'
    ) nyc
WHERE
    nyc.year = 2017
    AND nyc.month IN (1, 2, 3)
    AND tpepPickupDateTime BETWEEN CAST('1/1/2017' AS datetime) AND CAST('3/31/2017' AS datetime)
GROUP BY
    passengerCount,
    YEAR(tpepPickupDateTime)
ORDER BY
    YEAR(tpepPickupDateTime),
    passengerCount;
```

The `OPENROWSET` function will eliminate partitions that don't match the `year` and `month` in the where clause. This file/partition pruning technique will significantly
reduce your data set, improve performance, and reduce the cost of the query.

The URI in the `OPENROWSET` function must reference a root Delta Lake folder that contains a subfolder called `_delta_log`.

## Limitation

- Schema inference doesn't work if you have complex data types. For complex data types, use explicit `WITH` schema and specify `VARCHAR(MAX)` type. 
- The `OPENROWSET` function doesn't support updating a Delta Lake file or time travel. Use Apache Spark engine to perform these actions.

## Next steps

Advance to the next article to learn how to [Query Parquet nested types](query-parquet-nested-types.md).

## See also

- [What is Delta Lake](../spark/apache-spark-what-is-delta-lake.md)
- [Azure Databricks Delta lake best practices](/azure/databricks/delta/best-practices.md)
- [Delta Lake Documentation Page](https://docs.delta.io/latest/delta-intro.html)
