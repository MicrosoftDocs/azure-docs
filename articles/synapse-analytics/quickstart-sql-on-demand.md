---
title: Using SQL on demand (preview)
description: In this quickstart, you will see and learn how easy is to query various types of files using SQL on-demand (preview).
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

Synapse SQL on demand is a serverless query service that enables you to run the SQL queries on your files placed in Azure Storage. In this quickstart, you will learn how to query various types of files using SQL on-demand.

## File format support
SQL on demand supports the following file formats:
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

Using Synapse studio upload them to a linked ADLSGEN2 account. They should have URIs that look like this

    ```
    https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.csv
    https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.parquet
    https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.parquet
    ```

## Querying Parquet files

Create a SQL Script and enter the follwing T-SQL to query the parquet file:

```
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK 'https://ACCOUNT.dfs.core.windows.net/CONTAINER/SearchLog.parquet',
        FORMAT='PARQUET'
    ) AS [r];
```


## Querying CSV files


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
  ) AS r
```

# Next Steps
* CSV examples [query CSV file](sql/query-single-csv-file.md).
* Parquet examples [querying parquet files](sql/query-parquet-files.md)].

