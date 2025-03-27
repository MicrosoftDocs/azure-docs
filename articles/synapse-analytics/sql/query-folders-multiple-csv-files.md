---
title: Query folders and multiple files using serverless SQL pool
description: Learn how to read multiple files or folders in serverless SQL pool using wildcards, similar to using wildcards in Windows.
services: synapse analytics
author: azaricstefan
ms.service: azure-synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 01/17/2025
ms.author: stefanazaric
ms.reviewer: whhender
---

# Query folders and multiple files  

In this article, you learn how to write a query using serverless SQL pool in Azure Synapse Analytics.

Serverless SQL pool supports reading multiple files or folders by using wildcards, which are similar to the wildcards used in Windows. However, greater flexibility is present since multiple wildcards are allowed.

## Prerequisites

Your first step is to *create a database* where you can execute the queries. Then, initialize the objects by executing a [setup script](https://github.com/Azure-Samples/Synapse/blob/main/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script creates the data sources, database scoped credentials, and external file formats that are used in these samples.

Use the folder *csv/taxi* to follow the sample queries. It contains *NYC Taxi - Yellow Taxi Trip Records* data from July 2016 to June 2018. Files in *csv/taxi* are named after year and month using the following pattern:

  `yellow_tripdata_<year>-<month>.csv*`

## Read all files in folder

The following example reads all NYC Yellow Taxi data files from the *csv/taxi* folder, and then returns the total number of passengers and rides per year. It also shows usage of aggregate functions.

```sql
SELECT 
    YEAR(pickup_datetime) as [year],
    SUM(passenger_count) AS passengers_total,
    COUNT(*) AS [rides_total]
FROM OPENROWSET(
        BULK 'csv/taxi/*.csv',
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        pickup_datetime DATETIME2 2, 
        passenger_count INT 4
    ) AS nyc
GROUP BY
    YEAR(pickup_datetime)
ORDER BY
    YEAR(pickup_datetime);
```

> [!NOTE]
> All files accessed with the single `OPENROWSET` must have the same structure (number of columns and their data types).

### Read subset of files in folder

The following example reads the 2017 NYC Yellow Taxi data files from the *csv/taxi* folder using a wildcard and returns the total fare amount per payment type.

```sql
SELECT 
    payment_type,  
    SUM(fare_amount) AS fare_total
FROM OPENROWSET(
        BULK 'csv/taxi/yellow_tripdata_2017-*.csv',
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        payment_type INT 10,
        fare_amount FLOAT 11
    ) AS nyc
GROUP BY payment_type
ORDER BY payment_type;
```

> [!NOTE]
> All files accessed with the single `OPENROWSET` must have the same structure (number of columns and their data types).

### Read subset of files in folder using multiple file paths

The following example reads the 2017 NYC Yellow Taxi data files from the *csv/taxi* folder using two file paths. The first uses the full path to the file containing data from the month of January, and the second uses a wildcard to read the months *October*, *November*, and *December*. For each path, the total fare amount per payment type is returned.

```sql
SELECT 
    payment_type,  
    SUM(fare_amount) AS fare_total
FROM OPENROWSET(
        BULK (
            'csv/taxi/yellow_tripdata_2017-01.csv',
            'csv/taxi/yellow_tripdata_2017-1*.csv'
        ),
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        payment_type INT 10,
        fare_amount FLOAT 11
    ) AS nyc
GROUP BY payment_type
ORDER BY payment_type;
```

> [!NOTE]
> All files accessed with the single `OPENROWSET` must have the same structure (number of columns and their data types).

## Read folders

The path that you provide to `OPENROWSET` can also be a path to a folder. The following sections include these query types.

### Read all files from specific folder

You can read all the files in a folder using the file-level wildcard as shown in [Read all files in folder](#read-all-files-in-folder). But, there's a way to query a folder and consume all files within that folder.

If the path provided in `OPENROWSET` points to a folder, all files in that folder are used as a source for your query. The following query reads all files in the *csv/taxi* folder.

> [!NOTE]
> Note the existence of the `/` at the end of the path in the query. It denotes a folder. If the `/` is omitted, the query targets a file named *taxi* instead.

```sql
SELECT
    YEAR(pickup_datetime) as [year],
    SUM(passenger_count) AS passengers_total,
    COUNT(*) AS [rides_total]
FROM OPENROWSET(
        BULK 'csv/taxi/',
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        vendor_id VARCHAR(100) COLLATE Latin1_General_BIN2, 
        pickup_datetime DATETIME2, 
        dropoff_datetime DATETIME2,
        passenger_count INT,
        trip_distance FLOAT,
        rate_code INT,
        store_and_fwd_flag VARCHAR(100) COLLATE Latin1_General_BIN2,
        pickup_location_id INT,
        dropoff_location_id INT,
        payment_type INT,
        fare_amount FLOAT,
        extra FLOAT,
        mta_tax FLOAT,
        tip_amount FLOAT,
        tolls_amount FLOAT,
        improvement_surcharge FLOAT,
        total_amount FLOAT
    ) AS nyc
GROUP BY
    YEAR(pickup_datetime)
ORDER BY
    YEAR(pickup_datetime);
```

> [!NOTE]
> All files accessed with the single `OPENROWSET` must have the same structure (number of columns and their data types).

### Read all files from multiple folders

It's possible to read files from multiple folders by using a wildcard. The following query reads all files from all folders located in the *csv* folder that have names starting with *t* and ending with *i*.

> [!NOTE]
> Note the existence of the `/` at the end of the path in the query. It denotes a folder. If the `/` is omitted, the query targets files named *t&ast;i* instead.

```sql
SELECT
    YEAR(pickup_datetime) as [year],
    SUM(passenger_count) AS passengers_total,
    COUNT(*) AS [rides_total]
FROM OPENROWSET(
        BULK 'csv/t*i/', 
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        vendor_id VARCHAR(100) COLLATE Latin1_General_BIN2, 
        pickup_datetime DATETIME2, 
        dropoff_datetime DATETIME2,
        passenger_count INT,
        trip_distance FLOAT,
        rate_code INT,
        store_and_fwd_flag VARCHAR(100) COLLATE Latin1_General_BIN2,
        pickup_location_id INT,
        dropoff_location_id INT,
        payment_type INT,
        fare_amount FLOAT,
        extra FLOAT,
        mta_tax FLOAT,
        tip_amount FLOAT,
        tolls_amount FLOAT,
        improvement_surcharge FLOAT,
        total_amount FLOAT
    ) AS nyc
GROUP BY
    YEAR(pickup_datetime)
ORDER BY
    YEAR(pickup_datetime);
```

> [!NOTE]
> All files accessed with the single `OPENROWSET` must have the same structure (number of columns and their data types).

Since you have only one folder that matches the criteria, the query result is the same as [Read all files in folder](#read-all-files-in-folder).

## Traverse folders recursively

Serverless SQL pool can recursively traverse folders if you specify `/**` at the end of path. The following query reads all files from all folders and subfolders located in the *csv/taxi* folder.

```sql
SELECT
    YEAR(pickup_datetime) as [year],
    SUM(passenger_count) AS passengers_total,
    COUNT(*) AS [rides_total]
FROM OPENROWSET(
        BULK 'csv/taxi/**', 
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        vendor_id VARCHAR(100) COLLATE Latin1_General_BIN2, 
        pickup_datetime DATETIME2, 
        dropoff_datetime DATETIME2,
        passenger_count INT,
        trip_distance FLOAT,
        rate_code INT,
        store_and_fwd_flag VARCHAR(100) COLLATE Latin1_General_BIN2,
        pickup_location_id INT,
        dropoff_location_id INT,
        payment_type INT,
        fare_amount FLOAT,
        extra FLOAT,
        mta_tax FLOAT,
        tip_amount FLOAT,
        tolls_amount FLOAT,
        improvement_surcharge FLOAT,
        total_amount FLOAT
    ) AS nyc
GROUP BY
    YEAR(pickup_datetime)
ORDER BY
    YEAR(pickup_datetime);
```

> [!NOTE]
> All files accessed with the single `OPENROWSET` must have the same structure (number of columns and their data types).

## Use multiple wildcards

You can use multiple wildcards on different path levels. For example, you can enrich a previous query to read files with 2017 data only, from all folders where names start with *t* and end with *i*.

> [!NOTE]
> Note the existence of the `/` at the end of the path in the query. It denotes a folder. If the `/` is omitted, the query targets files named *t&ast;i* instead.
> There's a maximum limit of 10 wildcards per query.

```sql
SELECT
    YEAR(pickup_datetime) as [year],
    SUM(passenger_count) AS passengers_total,
    COUNT(*) AS [rides_total]
FROM OPENROWSET(
        BULK 'csv/t*i/yellow_tripdata_2017-*.csv',
        DATA_SOURCE = 'sqlondemanddemo',
        FORMAT = 'CSV', PARSER_VERSION = '2.0',
        FIRSTROW = 2
    )
    WITH (
        vendor_id VARCHAR(100) COLLATE Latin1_General_BIN2, 
        pickup_datetime DATETIME2, 
        dropoff_datetime DATETIME2,
        passenger_count INT,
        trip_distance FLOAT,
        rate_code INT,
        store_and_fwd_flag VARCHAR(100) COLLATE Latin1_General_BIN2,
        pickup_location_id INT,
        dropoff_location_id INT,
        payment_type INT,
        fare_amount FLOAT,
        extra FLOAT,
        mta_tax FLOAT,
        tip_amount FLOAT,
        tolls_amount FLOAT,
        improvement_surcharge FLOAT,
        total_amount FLOAT
    ) AS nyc
GROUP BY
    YEAR(pickup_datetime)
ORDER BY
    YEAR(pickup_datetime);
```

> [!NOTE]
> All files accessed with the single `OPENROWSET` must have the same structure (number of columns and their data types).

Since you have only one folder that matches the criteria, the query result is the same as [Read subset of files in folder](#read-subset-of-files-in-folder) and [Read all files from specific folder](#read-all-files-from-specific-folder). For more complex wildcard usage scenarios, see [Query Parquet files](query-parquet-files.md).

## Next step

> [!div class="nextstepaction"]
> [Use file metadata in serverless SQL pool queries](query-specific-files.md)
