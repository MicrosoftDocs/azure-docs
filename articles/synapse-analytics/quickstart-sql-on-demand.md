---
title: Using SQL on demand (preview)
description: learn how to query Parquet, CSV, JSON in ADLSGEN2 files using SQL on-demand (preview).
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice:
ms.date: 04/15/2020
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Using SQL on-demand

Synapse SQL on-demand is a serverless query service that enables you to run the SQL queries on your files placed in Azure Storage. In this quickstart, you will learn how to query various types of files using SQL on-demand.

## File format support
SQL on-demand supports the following file formats:
* JSON
* CSV
* Parquet

## Prerequisites

You will need:
* An Azure Synapse Analtyics workspace
* Read and Write access to an ADLSGEN2 container

## Sample Data

Download these files to your local machine
* [SearchLog.csv](https://synapsesampledata.blob.core.windows.net/public/SearchLog/SearchLog.csv)
* [SearchLog.parquet](https://synapsesampledata.blob.core.windows.net/public/SearchLog/SearchLog.parquet)
* [SearchLog.json](https://synapsesampledata.blob.core.windows.net/public/SearchLog/SearchLog.json)

Upload these files to a linked ADLSGEN2 account. You can perform the upload using any tool, such as Synapse Studio or Azure Storage Explorer.

Once uploaded, the files should have URIs that look like the following example:

    ```
    https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.csv
    https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.parquet
    https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.parquet
    ```


## Querying Parquet files

In Synapse Studio, create a new SQL Script and enter the follwoing T-SQL query:

```
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.parquet',
        FORMAT='PARQUET'
    ) AS [r]
```

Notice that the schema does not have to be defined in the query. It is automatically inferred
from the metadata in the parquet file.

## Querying CSV files

The SearchLog.csv file looks like this:

```id,time,market,searchtext,latency,links,clickedlinks
399266,2019-10-15T11:53:04Z,en-us,how to make nachos,73,www.nachos.com;www.wikipedia.com,NULL
382045,2019-10-15T11:53:25Z,en-gb,best ski resorts,614,skiresorts.com;ski-europe.com;www.travelersdigest.com/ski_resorts.htm,ski-europe.com;www.travelersdigest.com/ski_resorts.htm
382045,2019-10-16T11:53:42Z,en-gb,broken leg,74,mayoclinic.com/health;webmd.com/a-to-z-guides;mybrokenleg.com;wikipedia.com/Bone_fracture,mayoclinic.com/health;webmd.com/a-to-z-
```

Notice that the first row contains the column names

Now, try the following T-SQL in your SQL script.

```sql
SELECT TOP 10 *
FROM OPENROWSET
 (
      BULK 'https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog/SearchLog.csv'
    , FORMAT = 'CSV'
  )
WITH
  (
     id           INTEGER 
    ,time         DATETIME 
    ,market       VARCHAR(16) 
    ,searchtext   VARCHAR(255) 
    ,latency      INTEGER 
    ,links        VARCHAR(255) 
    ,clickedlinks VARCHAR(255) 
  ) AS [r]
```


CSV files don't contain any inherent metadata, so in this case the schema is defined in the query itself. 


# Next Steps
* CSV examples [query CSV file](sql/query-single-csv-file.md).
* Parquet examples [querying parquet files](sql/query-parquet-files.md)].

