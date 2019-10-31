---
title: Querying Parquet files
description: In this section, we will show how to query Parquet files.
services: sql-data-warehouse
author: azaricstefan
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Querying Parquet files 

Reading this article you will learn how to write a query in SQL Analytics on-demand that will read Parquet files.


## Prerequisites

Before reading rest of the article, make sure to check following articles:
- [First time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)


## Read Parquet files

You can query Parquet files the same way you read CSV files. The only difference is FILEFORMAT parameter that should be set to PARQUET. Examples in this section show specifics of reading Parquet files.

> [!NOTE]
> Note that you do not have to specify columns in OPENROWSET WITH clause when reading parquet files. In that case, SQL on-demand Query service will utilize metadata in parquet file and bind columns by name.  

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

> [!NOTE]
> Please note that you do not have to specify columns in OPENROWSET WITH clause when reading parquet files. In that case, SQL on-demand Query service will utilize metadata in parquet file and bind columns by name.  

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

> [!NOTE]
> Please note that SQL on-demand Query is compatible with Hive/Hadoop partitioning scheme.

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

## Next steps

You can see more in [Querying Parquet nested types](query-parquet-nested-types.md).

Advance to the next article to learn how to query parquet nested types.
> [!div class="nextstepaction"]
> [Querying Parquet nested types](query-parquet-nested-types.md)
