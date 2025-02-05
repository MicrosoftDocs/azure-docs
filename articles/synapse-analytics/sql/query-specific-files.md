---
title: Use file metadata in queries
description: Learn how to provide file and path information about every file used in the query to filter or analyze data based on file name and/or folder path.
author: azaricstefan
ms.service: azure-synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 01/17/2025
ms.author: stefanazaric
ms.reviewer: whhender 
---

# Use file metadata in serverless SQL pool queries

In this article, you learn how to query specific files or folders by using metadata. Serverless SQL pool can address multiple files and folders. For more information, see [Query folders and multiple files](query-folders-multiple-csv-files.md).

Sometimes, you might need to know which file or folder source correlates to a specific row in a result set. You can use the functions `filepath` and `filename` to return file names and/or the path in the result set, or you can use them to filter data based on the file name or folder path. These functions are described in [filename function](query-data-storage.md#filename-function) and [filepath function](query-data-storage.md#filepath-function).

The following sections provide short descriptions and code samples.

## Prerequisites

Your first step is to *create a database* with a data source that references a storage account. Then, initialize the objects by executing a [setup script](https://github.com/Azure-Samples/Synapse/blob/main/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script creates the data sources, database scoped credentials, and external file formats that are used in these samples.

## Functions

### Filename

The `filename` function returns the file name where the row originates from.

The following sample reads the NYC Yellow Taxi data files for *September 2017* and returns the number of rides per file. The `OPENROWSET` part of the query specifies which files are read.

```sql
SELECT
    nyc.filename() AS [filename]
    ,COUNT_BIG(*) AS [rows]
FROM  
    OPENROWSET(
        BULK 'parquet/taxi/year=2017/month=9/*.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    ) nyc
GROUP BY nyc.filename();
```

The following example shows how `filename()` can be used in the `WHERE` clause to filter the files to be read. It accesses the entire folder in the `OPENROWSET` part of the query and filters files in the `WHERE` clause.

Your results will be the same as the prior example.

```sql
SELECT
    r.filename() AS [filename]
    ,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
    BULK 'csv/taxi/yellow_tripdata_2017-*.csv',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0',
        FIRSTROW = 2) 
        WITH (C1 varchar(200) ) AS [r]
WHERE
    r.filename() IN ('yellow_tripdata_2017-10.csv', 'yellow_tripdata_2017-11.csv', 'yellow_tripdata_2017-12.csv')
GROUP BY
    r.filename()
ORDER BY
    [filename];
```

### Filepath

The `filepath` function returns a full or partial path:

- When called without a parameter, it returns the full file path where the row originates from. When `DATA_SOURCE` is used in `OPENROWSET`, it returns the path relative to `DATA_SOURCE`.
- When called with a parameter, it returns part of the path that matches the wildcard on the position specified in the parameter. For example, parameter value *1* returns part of the path that matches the first wildcard.

The following sample reads *NYC Yellow Taxi* data files for the last three months of 2017. It returns the number of rides per file path. The `OPENROWSET` part of the query specifies which files are read.

```sql
SELECT
    r.filepath() AS filepath
    ,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
        BULK 'csv/taxi/yellow_tripdata_2017-1*.csv',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        vendor_id INT
    ) AS [r]
GROUP BY
    r.filepath()
ORDER BY
    filepath;
```

The following example shows how `filepath()` can be used in the `WHERE` clause to filter the files to be read.

You can use the wildcards in the `OPENROWSET` part of the query and filter the files in the `WHERE` clause. Your results will be the same as the prior example.

```sql
SELECT
    r.filepath() AS filepath
    ,r.filepath(1) AS [year]
    ,r.filepath(2) AS [month]
    ,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
        BULK 'csv/taxi/yellow_tripdata_*-*.csv',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT = 'CSV',
        PARSER_VERSION = '2.0',        
        FIRSTROW = 2
    )
WITH (
    vendor_id INT
) AS [r]
WHERE
    r.filepath(1) IN ('2017')
    AND r.filepath(2) IN ('10', '11', '12')
GROUP BY
    r.filepath()
    ,r.filepath(1)
    ,r.filepath(2)
ORDER BY
    filepath;
```

## Next step

> [!div class="nextstepaction"]
> [Query Parquet files using serverless SQL pool](query-parquet-files.md)
