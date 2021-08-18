---
title: Create and use views in serverless SQL pool
description: In this section, you'll learn how to create and use views to wrap serverless SQL pool queries. Views will allow you to reuse those queries. Views are also needed if you want to use tools, such as Power BI, in conjunction with serverless SQL pool.
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 05/20/2020
ms.author: stefanazaric
ms.reviewer: jrasnick 
---

# Create and use views using serverless SQL pool in Azure Synapse Analytics

In this section, you'll learn how to create and use views to wrap serverless SQL pool queries. Views will allow you to reuse those queries. Views are also needed if you want to use tools, such as Power BI, in conjunction with serverless SQL pool.

## Prerequisites

Your first step is to create a database where the view will be created and initialize the objects needed to authenticate on Azure storage by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. All queries in this article will be executed on your sample database.

## Views over external data

You can create views the same way you create regular SQL Server views. The following query creates view that reads *population.csv* file.

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
        BULK 'csv/population/population.csv',
        DATA_SOURCE = 'SqlOnDemandDemo',
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

The view uses an `EXTERNAL DATA SOURCE` with a root URL of your storage, as a `DATA_SOURCE` and adds a relative file path to the files.

### Delta Lake views

If you are creating the views on top of Delta Lake folder, you need to specify the location to the root folder after the `BULK` option instead of specifying the file path.

> [!div class="mx-imgBorder"]
>![ECDC COVID-19 Delta Lake folder](./media/shared/covid-delta-lake-studio.png)

The `OPENROWSET` function that reads data from the Delta Lake folder will examine the folder structure and automatically identify the file locations.

```sql
create or alter view CovidDeltaLake
as
select *
from openrowset(
           bulk 'covid',
           data_source = 'DeltaLakeStorage',
           format = 'delta'
    ) with (
           date_rep date,
           cases int,
           geo_id varchar(6)
           ) as rows
```

Delta Lake is in public preview and there are some known issues and limitations. Review the known issues on [Synapse serverless SQL pool self-help page](resources-self-help-sql-on-demand.md#delta-lake).

## Partitioned views

If you have a set of files that is partitioned in the hierarchical folder structure, you can describe the partition pattern using the wildcards in the file path. Use the  `FILEPATH` function to expose parts of the folder path as partitioning columns.

```sql
CREATE VIEW TaxiView
AS SELECT *, nyc.filepath(1) AS [year], nyc.filepath(2) AS [month]
FROM
    OPENROWSET(
        BULK 'parquet/taxi/year=*/month=*/*.parquet',
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT='PARQUET'
    ) AS nyc
```

The partitioned views will perform folder partition elimination if you query this view with the filters on the partitioning columns. This might improve performance of your queries.

### Delta Lake partitioned views

If you are creating the partitioned views on top of Delta Lake storage, you can specify just a root Delta Lake folder and don't need to explicitly expose the partitioning columns using the `FILEPATH` function:

```sql
CREATE OR ALTER VIEW YellowTaxiView
AS SELECT *
FROM  
    OPENROWSET(
        BULK 'yellow',
        DATA_SOURCE = 'DeltaLakeStorage',
        FORMAT='DELTA'
    ) nyc
```

The `OPENROWSET` function will examine the structure of the underlying Delta Lake folder and automatically identify and expose the partitioning columns. The partition elimination will be done automatically if you put the partitioning column in the `WHERE` clause of a query.

The folder name in the `OPENROWSET` function (`yellow` in this example) that is concatenated with the `LOCATION` URI defined in `DeltaLakeStorage` data source must reference the root Delta Lake folder that contains a subfolder called `_delta_log`.

> [!div class="mx-imgBorder"]
>![Yellow Taxi Delta Lake folder](./media/shared/yellow-taxi-delta-lake.png)

Do not use the `WITH` clause in the `OPENROWSET` function when you query partitioned Delta Lake data. Due to the known issue in the preview, the `WITH` clause will [not properly return the values from the underlying partitioning columns](resources-self-help-sql-on-demand.md#partitioning-column-returns-null-values). Partition elimination works fine if you are directly using the `OPENROWSET` function with the `WITH` clause (without views).  

Delta Lake is in public preview and there are some known issues and limitations. Review the known issues on [Synapse serverless SQL pool self-help page](resources-self-help-sql-on-demand.md#delta-lake).

## Use a view

You can use views in your queries the same way you use views in SQL Server queries.

The following query demonstrates using the *population_csv* view we created in [Create a view](#views-over-external-data). It returns country/region names with their population in 2019 in descending order.

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
