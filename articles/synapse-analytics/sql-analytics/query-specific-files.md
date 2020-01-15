---
title: Querying specific files
description: Sometimes you may need to know which row in result set came from which file/folder. In such cases, you can use virtual columns to return file name and/or path in result set, or you can use them to filter data based on file name and/or folder path.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Querying specific files 

The SQL on-demand Query service can address multiple files and folders as described in [Querying folders and multiple CSV files](query-folders-multiple-csv-files.md). Sometimes, you may need to know which file/folder source correlates to a specific row in the result set.

You can use virtual columns to return file names and/or the path in the result set. Or you can use them to filter data based on the file name and/or folder path. These functions are described in the syntax section [filename function](development-storage-files-overview.md#filename-function) and [filepath function](development-storage-files-overview.md#filepath-function). Below you will find short descriptions along samples.


In this quickstart, you will query a specific file.

## Prerequisites

Before reading the rest of this article, review the following articles:
- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Functions

### Filename

This function returns the file name that row originates from.

The following sample reads the NYC Yellow Taxi data files for the last three months of 2017 and returns the number of rides per file. The OPENROWSET part of the query specifies which files will be read.

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



The following example shows how filename() can be used in the WHERE clause to filter the files to be read. It accesses the entire folder in the OPENROWSET part of  the query and filters files in the WHERE clause. This example returns the same results as the previous one. 

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

The filepath function returns a full or partial path:

- When called without parameter, it returns the full file path that the row originates from. 

- When called with a parameter, it returns part of the path that matches wildcard on the position specified in parameter. For example, parameter value 1 would return part of path that matches the first wildcard.

The following sample reads NYC Yellow Taxi data files for last three months of 2017 and returns the number of rides per file path. The OPENROWSET part of the query specifies which files will be read.

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



The following example shows how filepath() can be used in the WHERE clause to filter the files to be read. You used wildcards in the OPENROWSET part of the query and filtered the files in the WHERE clause. This example returns the same results as the previous one. 

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

Advance to the next article to learn how to query Parquet files.
> [!div class="nextstepaction"]
> [Querying Parquet files](query-parquet-files.md)
