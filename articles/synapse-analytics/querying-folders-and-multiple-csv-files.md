---
title: Querying folders and multiple csv files #Required; update as needed page title displayed in search results. Include the brand.
description: Reading multiple files/folders is supported thru usage of wildcards, similar to wildcard used in Windows OS but with greater flexibility since multiple wildcards are allowed. #Required; Add article description that is displayed in search results.
services: synapse-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: synapse-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/08/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Quickstart: Querying folders and multiple files sss

Reading multiple files/folders is supported thru usage of wildcards, similar to wildcard used in Windows OS but with greater flexibility since multiple wildcards are allowed. Please take a look at following sections for more details.
<!---Required:
Lead with a light intro that describes, in customer-friendly language, what the customer will learn, or do, or accomplish. Answer the fundamental “why would I want to do this?” question.
--->

We will show how to query folders and multiple CSV files in following sections.

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

## Read multiple files in folder

We will use folder *csv/taxi* for following sample queries. It contains NYC Taxi - Yellow Taxi Trip Records data from July 2016. to June 2018.

Files in *csv/taxi* are named after year and month:

- yellow_tripdata_2016-07.csv
- yellow_tripdata_2016-08.csv
- yellow_tripdata_2016-09.csv
- ...
- yellow_tripdata_2018-04.csv
- yellow_tripdata_2018-05.csv
- yellow_tripdata_2018-06.csv



Each file has the following structure:

![First ten rows of the CSV file](./media/querying-folders-and-multiple-csv-files/nyc-taxi.png)



### Read all files in folder

This sample reads all NYC Yellow Taxi data files from *csv/taxi* folder and returns total number of passengers and rides per year. It also shows usage of aggregate functions.

```sql
SELECT 
	YEAR(pickup_datetime) as [year],
	SUM(passenger_count) AS passengers_total,
	COUNT(*) AS [rides_total]
FROM OPENROWSET(
	BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/taxi/*.*',
		FORMAT = 'CSV', 
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
	YEAR(pickup_datetime) 
```

> Please note that all accessed files with single OPENROWSET must have the same structure (number of columns and their data types).



### Read subset of files in folder

This sample reads NYC Yellow Taxi data files for year 2017. from *csv/taxi* folder using wildcard and returns total fare amount per payment type.

```sql
SELECT 
	payment_type,  
	SUM(fare_amount) AS fare_total
FROM OPENROWSET(
	BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/taxi/yellow_tripdata_2017-*.csv',
		FORMAT = 'CSV', 
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
GROUP BY payment_type
ORDER BY payment_type 

```

> Please note that all accessed files with single OPENROWSET must have the same structure (number of columns and their data types).

 

## Read folders

Path that you provide to OPENROWSET can be path to folder also. Following sections shows such queries.

### Read all files from specific folder

Although we can read all files in folder using file level wildcard as shown in [Read all files in folder](#read-all-files-in-folder), there is a way to query to folder and it will consume all files from particular folder. 

If path provided in OPENROWSET points to folder, all files in that folder will be used as source for our query.  Following query will read all files in *csv/taxi* folder.
> Please note existence of / at the end of path in query below. It denotes folder. If / is omitted, query will target file named *taxi* instead.

```sql
SELECT 
	YEAR(pickup_datetime) as [year],
	SUM(passenger_count) AS passengers_total,
	COUNT(*) AS [rides_total]
FROM OPENROWSET(
	BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/taxi/',
		FORMAT = 'CSV', 
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
	YEAR(pickup_datetime)
```

> Please note that all accessed files with single OPENROWSET must have the same structure (number of columns and their data types).

### Read all files from multiple folders

It is possible to read files from multiple folders with usage of wildcard. Following query will read all files from all folders located in *csv* folder, which names start with *t* and end with *i*.

> Please note existence of / at the end of path in query below. It denotes folder. If / is omitted, query will target files named *t&ast;i* instead.

```sql
SELECT 
	YEAR(pickup_datetime) as [year],
	SUM(passenger_count) AS passengers_total,
	COUNT(*) AS [rides_total]
FROM OPENROWSET(
	BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/t*i/', 
		FORMAT = 'CSV', 
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
	YEAR(pickup_datetime)
```

> Please note that all accessed files with single OPENROWSET must have the same structure (number of columns and their data types).

Since we have only one folder that matches criteria, the result of this query is the same as in [Read all files in folder](#read-all-files-in-folder).

## Multiple wildcards

We can use multiple wildcards on different levels of path. For example, we can enrich previous query to read files with 2017 data only, from all folders which names start with *t* and end with *i*.

> Please note existence of / at the end of path in query below. It denotes folder. If / is omitted, query will target files named *t&ast;i* instead.

> Please note that there is a limit of maximum 10 wildcards per query.


```sql
SELECT 
	YEAR(pickup_datetime) as [year],
	SUM(passenger_count) AS passengers_total,
	COUNT(*) AS [rides_total]
FROM OPENROWSET(
	BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/t*i/yellow_tripdata_2017-*.csv',
		FORMAT = 'CSV', 
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
	YEAR(pickup_datetime)
```

> Please note that all accessed files with single OPENROWSET must have the same structure (number of columns and their data types).

Since we have only one folder that matches criteria, the result of this query is the same as in [Read subset of files in folder](#read-subset-of-files-in-folder) and [Read all files from specific folder](#read-all-files-from-specific-folder). More complex scenarios of wildcard usage are covered in [Querying Parquet files](querying-parquet-files.md).



## Next steps

You can see more in [Querying specific files](querying-specific-files.md).

Advance to the next article to learn how to query specific files.
> [!div class="nextstepaction"]
> [Querying specific files](querying-specific-files)

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->