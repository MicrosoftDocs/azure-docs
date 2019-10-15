---
title: Querying specific files #Required; update as needed page title displayed in search results. Include the brand.
description: Sometimes you may need to know which row in result set came from which file/folder. In such cases, you can use virtual columns to return file name and/or path in result set, or you can use them to filter data based on file name and/or folder path. #Required; Add article description that is displayed in search results.
services: sql-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/07/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Quickstart: Querying specific files 

## TODO: Links bellow for syntax should be pointing to correct article!
SQL on demand Query service can address multiple files and folders as described in [Querying folders and multiple CSV files](querying-folders-and-multiple-csv-files.md). Sometimes you may need to know which row in result set came from which file/folder. In such cases, you can use virtual columns to return file name and/or path in result set, or you can use them to filter data based on file name and/or folder path. These functions are described in syntax section - [filename function](https://github.com/Azure/ProjectStarlight/blob/master/Syntax.md#filename-function) and [filepath function](https://github.com/Azure/ProjectStarlight/blob/master/Syntax.md#filepath-function). You can find short descriptions along samples below.

<!---Required:
Lead with a light intro that describes, in customer-friendly language, what the customer will learn, or do, or accomplish. Answer the fundamental “why would I want to do this?” question.
--->

In this quickstart, you will query a specific file.

If you don’t have a <service> subscription, create a free trial account...
<!--- Required, if a free trial account exists
Because quickstarts are intended to help new customers use a subscription to quickly try out a specific product/service, include a link to a free trial before the first H2, if one exists. You can find listed examples in [Write quickstarts](contribute-how-to-mvc-quickstart.md)
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.--->

## Prerequisites

Before reading rest of the article make sure to check following articles:
- [First time setup](query-data-in-storage.md#First-time-setup)
- [Prerequisites](query-data-in-storage.md#Prerequisites)


## Before you begin
> Please note that all URIs in sample queries are using storage account located in North Europe Azure region. **If your endpoint is located in West US region, please change URI** to point to *partystoragewestus* storage account.
>
> Please make sure that you created appropriate credential for your region. Run this query and make sure storage account in your region is listed:

```sql
SELECT name
FROM sys.credentials 
WHERE 
	name = 'https://sqlondemandstorage.blob.core.windows.net/csv'
```

If you can't find appropriate credential, please check [First time setup](query-data-in-storage.md#First-Time-Setup).

## Functions

### Filename

This function returns file name that row originates from.

Following sample reads NYC Yellow Taxi data files for last three months of 2017. and returns number of rides per file. Note that OPENROWSET part of query specifies what files will be read.

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



Following example shows how filename() can be used in WHERE clause to filter files to be read. Note that it accesses whole folder in OPENROWSET part of query and filters files in WHERE clause. This example returns the same results as previous one. 

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

Following sample reads NYC Yellow Taxi data files for last three months of 2017. and returns number of rides per file path. Note that OPENROWSET part of query specifies what files will be read.

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



Following example shows how filepath() can be used in WHERE clause to filter files to be read. Note that we used wildcards in OPENROWSET part of query and additionally filter files in WHERE clause. This example returns the same results as previous one. 

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

You can see more in [Querying Parquet files](querying-parquet-files.md).


Advance to the next article to learn how query folders and multiple CSV files.
> [!div class="nextstepaction"]
> [Querying Parquet files](querying-parquet-files.md)

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->