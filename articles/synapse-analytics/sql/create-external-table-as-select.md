---
title: Store query results from serverless SQL pool
description: In this article, you'll learn how to store query results to storage using serverless SQL pool.
services: synapse-analytics
author: vvasic-msft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 04/15/2020
ms.author: vvasic
ms.reviewer: jrasnick 
---

# Store query results to storage using serverless SQL pool in Azure Synapse Analytics

In this article, you'll learn how to store query results to storage using serverless SQL pool.

## Prerequisites

Your first step is to **create a database** where you will execute the queries. Then initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script will create the data sources, database scoped credentials, and external file formats that are used to read data in these samples.

Follow the instructions in this article to create data sources, database scoped credentials, and external file formats that are used to write data into the output storage.

## Create external table as select

You can use the CREATE EXTERNAL TABLE AS SELECT (CETAS) statement to store the query results to  storage.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created.

```sql
USE [mydbname];
GO

CREATE DATABASE SCOPED CREDENTIAL [SasTokenWrite]
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
     SECRET = 'sv=2018-03-28&ss=bfqt&srt=sco&sp=rwdlacup&se=2019-04-18T20:42:12Z&st=2019-04-18T12:42:12Z&spr=https&sig=lQHczNvrk1KoYLCpFdSsMANd0ef9BrIPBNJ3VYEIq78%3D';
GO

CREATE EXTERNAL DATA SOURCE [MyDataSource] WITH (
    LOCATION = 'https://<storage account name>.blob.core.windows.net/csv', CREDENTIAL = [SasTokenWrite]
);
GO

CREATE EXTERNAL FILE FORMAT [ParquetFF] WITH (
    FORMAT_TYPE = PARQUET,
    DATA_COMPRESSION = 'org.apache.hadoop.io.compress.SnappyCodec'
);
GO

CREATE EXTERNAL TABLE [dbo].[PopulationCETAS] WITH (
        LOCATION = 'populationParquet/',
        DATA_SOURCE = [MyDataSource],
        FILE_FORMAT = [ParquetFF]
) AS
SELECT
    *
FROM
    OPENROWSET(
        BULK 'csv/population-unix/population.csv',
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0'
    ) WITH (
        CountryCode varchar(4),
        CountryName varchar(64),
        Year int,
        PopulationCount int
    ) AS r;

```

> [!NOTE]
> You must modify this script and change the target location to execute it again. External tables cannot be created on the location where you already have some data.

## Use the external table

You can use the external table created through CETAS like a regular external table.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created.

```sql
USE [mydbname];
GO

SELECT
    country_name, population
FROM PopulationCETAS
WHERE
    [year] = 2019
ORDER BY
    [population] DESC;
```

## Remarks

Once you store your results, the data in the external table cannot be modified. You cannot repeat this script because CETAS will not overwrite the underlying data created in the previous execution. Vote for the following feedback items if some of these are required in your scenarios, or propose the new ones on Azure feedback site:
- [Enable inserting new data into external table](https://feedback.azure.com/forums/307516-azure-synapse-analytics/suggestions/32981347-polybase-allow-insert-new-data-to-existing-exteran)
- [Enable deleting data from external table](https://feedback.azure.com/forums/307516-azure-synapse-analytics/suggestions/15158034-polybase-delete-from-external-tables)
- [Specify partitions in CETAS](https://feedback.azure.com/forums/307516-azure-synapse-analytics/suggestions/19520860-polybase-partitioned-by-functionality-when-creati)
- [Specify file sizes and counts](https://feedback.azure.com/forums/307516-azure-synapse-analytics/suggestions/42263617-cetas-specify-number-of-parquet-files-file-size)

## Next steps

For more information on how to query different file types, see the [Query single CSV file](query-single-csv-file.md), [Query Parquet files](query-parquet-files.md), and [Query JSON files](query-json-files.md) articles.
