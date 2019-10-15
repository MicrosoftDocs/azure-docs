---
title: Querying parquet nested types #Required; update as needed page title displayed in search results. Include the brand.
description: In this section, we will show how to query Parquet files.
 #Required; Add article description that is displayed in search results.
services: sql-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/07/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Quickstart: Querying parquet files 

In this section, we will show how to query Parquet files.

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

## Read Parquet files

You can query Parquet files the same way you read CSV files. The only difference is FILEFORMAT parameter that should be set to PARQUET. Examples in this section shows specifics of reading Parquet files.

> Please note that you do not have to specify columns in OPENROWSET WITH clause when reading parquet files. In that case, SQL on demand Query service will utilize metadata in parquet file and bind columns by name.  

We will use folder *parquet/taxi* for following sample queries. It contains NYC Taxi - Yellow Taxi Trip Records data from July 2016. to June 2018.

Data is partitioned by year and month and folder structure is:

- year=2016
  - month=6
  - ...
  - month=12
- year=2017
  - month=1
  - ...
  - month=12
- year=2018
  - month=1
  - ...
  - month=6


### Read particular columns in Parquet files

You can specify only columns of interest when you query Parquet files.

```sql
SELECT 
		YEAR(pickup_datetime),
		passenger_count,
		COUNT(*) AS cnt
FROM  
	OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/*/*/*',
		FORMAT='PARQUET'
	) WITH (
		pickup_datetime DATETIME2, 
		passenger_count INT
	) AS nyc
GROUP BY 
	passenger_count,
	YEAR(pickup_datetime)
ORDER BY
	YEAR(pickup_datetime),
	passenger_count
```



### Read Parquet files without specifying schema

You do not have to use OPENROWSET WITH clause when reading Parquet files because columns names and data types will be automatically read from Parquet files. 

This sample shows automatic schema inference capabilities for Parquet files. It returns number of rows in September 2017. without specifying schema. 

> Please note that you do not have to specify columns in OPENROWSET WITH clause when reading parquet files. In that case, SQL on demand Query service will utilize metadata in parquet file and bind columns by name.  

```sql
SELECT 
	COUNT_BIG(*)
FROM  
	OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2017/month=9/*.parquet',
		FORMAT='PARQUET'
	) AS nyc
```



### Target specific partitions using filepath function

You can target specific partitions using filepath function, just like we did in CSV examples. This example show fare amounts by year, month and payment_type, for first three months of 2017.

> Please note that SQL on demand Query is compatible with Hive/Hadoop partitioning scheme.

```sql
SELECT 
	nyc.filepath(1) AS [year],
	nyc.filepath(2) AS [month],
	payment_type,
	SUM(fare_amount) AS fare_total
FROM  
	OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=*/month=*/*.parquet', 
		FORMAT='PARQUET'
	) AS nyc
WHERE 
	nyc.filepath(1) = 2017 
	AND nyc.filepath(2) IN (1, 2, 3)
	AND pickup_datetime BETWEEN CAST('1/1/2017' AS datetime) AND CAST('3/31/2017' AS datetime)
GROUP BY 
	nyc.filepath(1),
	nyc.filepath(2),
	payment_type
ORDER BY
	nyc.filepath(1),
	nyc.filepath(2),
	payment_type
```

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->