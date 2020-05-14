---
title: Store query results to storage
description: In this article, you'll learn how to store query results to storage using SQL on-demand (preview).
services: synapse-analytics
author: vvasic-msft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 04/15/2020
ms.author: vvasic
ms.reviewer: jrasnick, carlrab
---

# Store query results to storage using SQL on-demand (preview) using Azure Synapse Analytics

In this article, you'll learn how to store query results to the storage using SQL On-demand (preview).

## Prerequisites

Your first step is to review the articles below and make sure you've met the prerequisites:

- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Create external table as select

You can use CREATE EXTERNAL TABLE AS SELECT (CETAS) statement to store the query results to the storage.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created. If you have not created a database, please read [First-time setup](query-data-storage.md#first-time-setup).

```sql
USE [mydbname];
GO

CREATE EXTERNAL DATA SOURCE [MyDataSource] WITH (
    LOCATION = 'https://sqlondemandstorage.blob.core.windows.net/csv'
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
        BULK 'https://showdemoweu.dfs.core.windows.net/data/population_csv/population.csv',
        FORMAT='CSV'
    ) WITH (
        CountryCode varchar(4),
        CountryName varchar(64),
        Year int,
        PopulationCount int
    ) AS r;

```

## Use a external table created

You can use external table created through CETAS like a regular external table.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created. If you have not created a database, please read [First-time setup](query-data-storage.md#first-time-setup).

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

## Next steps

For information on how to query different file types, refer to the [Query single CSV file](query-single-csv-file.md), [Query Parquet files](query-parquet-files.md), and [Query JSON files](query-json-files.md) articles.
