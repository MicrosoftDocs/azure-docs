---
title: Store query results from serverless SQL pool
description: In this article, you'll learn how to store query results to storage using serverless SQL pool.
author: vvasic-msft
ms.service: azure-synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 02/20/2025
ms.author: vvasic
 
---

# Store query results to storage using serverless SQL pool in Azure Synapse Analytics

In this article, you'll learn how to store query results to storage using serverless SQL pool.

## Prerequisites

Your first step is to **create a database** where you'll execute the queries. Then initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script will create the data sources, database scoped credentials, and external file formats that are used to read data in these samples.

Follow the instructions in this article to create data sources, database scoped credentials, and external file formats that are used to write data into the output storage.

## Create external table as select

You can use the CREATE EXTERNAL TABLE AS SELECT (CETAS) statement to store the query results to storage.

> [!NOTE]
> Change these values in the query to reflect your environment:
> - mydbname - change it to the name of the database you created
> - storage-account-sas - the [shared access signature](/azure/ai-services/document-intelligence/authentication/create-sas-tokens#generating-sas-tokens) for a storage account where you want to write your results
> - your-storage-account-name - the name of your storage account where you want to write your results (Make sure you have a container called 'csv' or that you change the name of the container here also)

```sql
USE [mydbname];
GO

CREATE DATABASE SCOPED CREDENTIAL [SasTokenWrite]
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
     SECRET = 'storage-account-sas';
GO

CREATE EXTERNAL DATA SOURCE [MyDataSource] WITH (
    LOCATION = 'https://your-storage-account-name.blob.core.windows.net/csv', CREDENTIAL = [SasTokenWrite]
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
> You must modify this script and change the target location to execute it again. External tables can't be created on the location where you already have some data.

## Use the external table

You can use the external table created through CETAS like a regular external table.

> [!NOTE]
> Change the first line in the query, that is, [mydbname], so you're using the database you created.

```sql
USE [mydbname];
GO

SELECT
    CountryName, PopulationCount
FROM PopulationCETAS
WHERE
    [Year] = 2019
ORDER BY
    [PopulationCount] DESC;
```

## Remarks

Once you store your results, the data in the external table can't be modified. You can't repeat this script because CETAS won't overwrite the underlying data created in the previous execution.

The only supported output types are currently Parquet and CSV.

## Related content

For more information on how to query different file types, see the [Query single CSV file](query-single-csv-file.md), [Query Parquet files](query-parquet-files.md), and [Query JSON files](query-json-files.md) articles.
