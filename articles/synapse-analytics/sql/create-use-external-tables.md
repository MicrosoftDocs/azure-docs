---
title: Create and use external tables in SQL on-demand (preview)
description: In this section, you'll learn how to create and use external tables in SQL on-demand (preview). External tables are useful when you want to control access to external data in SQL On-demand and if you want to use tools, such as Power BI, in conjunction with SQL on-demand.
services: synapse-analytics
author: vvasic-msft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 03/20/2020
ms.author: vvasic
ms.reviewer: jrasnick, carlrab
---

# Create and use external tables in SQL on-demand (preview) using Azure Synapse Analytics

In this section, you'll learn how to create and use external tables in SQL on-demand (preview). External tables are useful when you want to control access to external data in SQL On-demand and if you want to use tools, such as Power BI, in conjunction with SQL on-demand.

## Prerequisites

Your first step is to review the articles below and make sure you've met the prerequisites for creating and using SQL on-demand external tables:

- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Create an external table

You can create external tables the same way you create regular SQL Server external tables. The query below creates an external table that reads *population.csv* file.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created. If you have not created a database, please read [First-time setup](query-data-storage.md#first-time-setup).

```sql
USE [mydbname];
GO

CREATE EXTERNAL DATA SOURCE [CsvDataSource] WITH (
    LOCATION = 'https://sqlondemandstorage.blob.core.windows.net/csv'
);
GO

CREATE EXTERNAL FILE FORMAT CSVFileFormat
WITH (  
    FORMAT_TYPE = DELIMITEDTEXT,
    FORMAT_OPTIONS (
        FIELD_TERMINATOR = ',',
        STRING_DELIMITER = '"',
        FIRST_ROW = 2
    )
);
GO

CREATE EXTERNAL TABLE populationExternalTable
(
    [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
    [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
    [year] smallint,
    [population] bigint
);
WITH (
    LOCATION = 'population/population.csv',
    DATA_SOURCE = CsvDataSource,
    FILE_FORMAT = CSVFileFormat
);
GO
```

## Use a external table

You can use external tables in your queries the same way you use them in SQL Server queries.

The following query demonstrates using the *population* external table we created in [Create an external table](#create-an-external-table) section. It returns country names with their population in 2019 in descending order.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created. If you have not created a database, please read [First-time setup](query-data-storage.md#first-time-setup).

```sql
USE [mydbname];
GO

SELECT
    country_name, population
FROM populationExternalTable
WHERE
    [year] = 2019
ORDER BY
    [population] DESC;
```

## Next steps

For information on how to store results of a query to the storage refer to the [Store query results to the storage](../sql-analytics/create-external-table-as-select.md).
