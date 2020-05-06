---
title: Create and use views in SQL on-demand (preview)
description: In this section, you'll learn how to create and use views to wrap SQL on-demand (preview) queries. Views will allow you to reuse those queries. Views are also needed if you want to use tools, such as Power BI, in conjunction with SQL on-demand.
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 04/15/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---

# Create and use views in SQL on-demand (preview) using Azure Synapse Analytics

In this section, you'll learn how to create and use views to wrap SQL on-demand (preview) queries. Views will allow you to reuse those queries. Views are also needed if you want to use tools, such as Power BI, in conjunction with SQL on-demand.

## Prerequisites

Your first step is to create a database where the view will be created and initialize the objects needed to authenticate on Azure storage by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. All queries in this article will be executed on your sample database.

## Create a view

You can create views the same way you create regular SQL Server views. The query below creates view that reads *population.csv* file.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created.

```sql
USE [mydbname];
GO

DROP VIEW IF EXISTS populationView;
GO

CREATE VIEW populationView AS
SELECT * 
FROM OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population/population.csv',
         FORMAT = 'CSV', 
        FIELDTERMINATOR =',', 
        ROWTERMINATOR = '\n'
    )
WITH (
    [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
    [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
    [year] smallint,
    [population] bigint
) AS [r];
```

## Use a view

You can use views in your queries the same way you use views in SQL Server queries.

The following query demonstrates using the *population_csv* view we created in [Create a view](#create-a-view). It returns country names with their population in 2019 in descending order.

> [!NOTE]
> Change the first line in the query, i.e., [mydbname], so you're using the database you created.

```sql
USE [mydbname];
GO

SELECT
    country_name, population
FROM populationView
WHERE
    [year] = 2019
ORDER BY
    [population] DESC;
```

## Next steps

For information on how to query different file types, refer to the [Query single CSV file](query-single-csv-file.md), [Query Parquet files](query-parquet-files.md), and [Query JSON files](query-json-files.md) articles.
