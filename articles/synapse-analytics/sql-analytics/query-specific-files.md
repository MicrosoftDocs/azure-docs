---
title: Querying specific files
description: Sometimes you may need to know which row in result set came from which file/folder. In such cases, you can use virtual columns to return file name and/or path in result set, or you can use them to filter data based on file name and/or folder path.
services: sql-data-warehouse
author: azaricstefan
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Querying specific files 

SQL on-demand Query service can address multiple files and folders as described in [Querying folders and multiple CSV files](query-folders-multiple-csv-files.md). Sometimes you may need to know which row in result set came from which file/folder. In such cases, you can use virtual columns to return file name and/or path in result set, or you can use them to filter data based on file name and/or folder path. These functions are described in syntax section - [filename function](development-storage-files-overview.md#filename-function) and [filepath function](development-storage-files-overview.md#filepath-function). You can find short descriptions along samples below.


In this quickstart, you will query a specific file.

## Prerequisites

Before reading rest of the article, make sure to check following articles:
- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Functions

### Filename

This function returns file name that row originates from.

Following sample reads NYC Yellow Taxi data files for last three months of 2017. and returns number of rides per file. OPENROWSET part of query specifies what files will be read.

```sql
SELECT 
	r.filename() AS [filename]
	,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/taxi/yellow_tripdata_2017-1*.csv',
		FORMAT = 'CSV',
		FIRSTROW = 2
	)
	WITH (
		vendor_id INT, 
		pickup_datetime DATETIME2, 
		dropoff_datetime DATETIME2,
		passenger_count SMALLINT,
		trip_distance FLOAT,
		rate_code SMALLINT,
		store_and_fwd_flag SMALLINT,
		pickup_location_id INT,
		dropoff_location_id INT,
		payment_type SMALLINT,
		fare_amount FLOAT,
		extra FLOAT,
		mta_tax FLOAT,
		tip_amount FLOAT,
		tolls_amount FLOAT,
		improvement_surcharge FLOAT,
		total_amount FLOAT
	) AS [r]
GROUP BY
	r.filename()
ORDER BY
	[filename]
```



Following example shows how filename() can be used in WHERE clause to filter files to be read. It accesses whole folder in OPENROWSET part of query and filters files in WHERE clause. This example returns the same results as previous one. 

```sql
SELECT 
	r.filename() AS [filename]
	,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/taxi/',
		FORMAT = 'CSV',
		FIRSTROW = 2
	)
WITH (
    vendor_id INT, 
    pickup_datetime DATETIME2, 
    dropoff_datetime DATETIME2,
    passenger_count SMALLINT,
    trip_distance FLOAT,
    rate_code SMALLINT,
    store_and_fwd_flag SMALLINT,
    pickup_location_id INT,
    dropoff_location_id INT,
    payment_type SMALLINT,
    fare_amount FLOAT,
    extra FLOAT,
    mta_tax FLOAT,
    tip_amount FLOAT,
    tolls_amount FLOAT,
    improvement_surcharge FLOAT,
    total_amount FLOAT
) AS [r]
WHERE
	r.filename() IN ('yellow_tripdata_2017-10.csv', 'yellow_tripdata_2017-11.csv', 'yellow_tripdata_2017-12.csv')
GROUP BY
	r.filename()
ORDER BY
	[filename]
```



### Filepath

This function returns full path or part of path:

- When called without parameter, returns full file path that row originates from. 

- When called with parameter, it returns part of path that matches wildcard on position specified in parameter. For example, parameter value 1 would return part of path that matches first wildcard.

Following sample reads NYC Yellow Taxi data files for last three months of 2017. and returns number of rides per file path. OPENROWSET part of query specifies what files will be read.

```sql
SELECT 
	r.filepath() AS filepath
	,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/taxi/yellow_tripdata_2017-1*.csv',
		FORMAT = 'CSV',
		FIRSTROW = 2
	)
	WITH (
		vendor_id INT, 
		pickup_datetime DATETIME2, 
		dropoff_datetime DATETIME2,
		passenger_count SMALLINT,
		trip_distance FLOAT,
		rate_code SMALLINT,
		store_and_fwd_flag SMALLINT,
		pickup_location_id INT,
		dropoff_location_id INT,
		payment_type SMALLINT,
		fare_amount FLOAT,
		extra FLOAT,
		mta_tax FLOAT,
		tip_amount FLOAT,
		tolls_amount FLOAT,
		improvement_surcharge FLOAT,
		total_amount FLOAT
	) AS [r]
GROUP BY
	r.filepath()
ORDER BY
	filepath
```



Following example shows how filepath() can be used in WHERE clause to filter files to be read. We used wildcards in OPENROWSET part of query and additionally filter files in WHERE clause. This example returns the same results as previous one. 

```sql
SELECT 
	r.filepath() AS filepath
	,r.filepath(1) AS [year]
	,r.filepath(2) AS [month]
	,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/taxi/yellow_tripdata_*-*.csv',
		FORMAT = 'CSV',
		FIRSTROW = 2
	)
WITH (
    vendor_id INT, 
    pickup_datetime DATETIME2, 
    dropoff_datetime DATETIME2,
    passenger_count SMALLINT,
    trip_distance FLOAT,
    rate_code SMALLINT,
    store_and_fwd_flag SMALLINT,
    pickup_location_id INT,
    dropoff_location_id INT,
    payment_type SMALLINT,
    fare_amount FLOAT,
    extra FLOAT,
    mta_tax FLOAT,
    tip_amount FLOAT,
    tolls_amount FLOAT,
    improvement_surcharge FLOAT,
    total_amount FLOAT
) AS [r]
WHERE
	r.filepath(1) IN ('2017')
	AND r.filepath(2) IN ('10', '11', '12')
GROUP BY
	r.filepath()
	,r.filepath(1)
	,r.filepath(2)
ORDER BY
	filepath
```

## Next steps

You can see more in [Querying Parquet files](query-parquet-files.md).


Advance to the next article to learn how to query Parquet files.
> [!div class="nextstepaction"]
> [Querying Parquet files](query-parquet-files.md)
