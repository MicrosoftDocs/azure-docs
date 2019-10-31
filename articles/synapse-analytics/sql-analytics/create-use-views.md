---
title: Creating and using views
description: This section explains how to leverage views to wrap SQL on-demand queries so you can reuse your queries. Views are also needed if you want tools like Power BI to leverage SQL on-demand Query.
services: sql-data-warehouse
author: azaricstefan
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Creating and using views 

This section explains how to leverage views to wrap SQL on-demand queries so you can reuse your queries. 

Views are also needed if you want tools like Power BI to leverage SQL on-demand query.


## Prerequisites

Before reading rest of the article, make sure to check following articles:
- [First time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Creating views

You can create views the same way you create regular SQL Server views. 

Following query creates view that reads *population.csv* file.

> [!NOTE]
> Please change the first line in query below to use database you created. If you did not create database, please check [First time setup](query-data-storage.md#first-time-setup).

```sql
USE [mydbname]
GO

DROP VIEW IF EXISTS populationView
GO

CREATE VIEW populationView AS
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population/population.csv',
 		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '\n'
	)
WITH (
	[country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
	[country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
	[year] smallint,
	[population] bigint
) AS [r]
```



## Using views

You can use views in your queries the same way you use views in SQL Server queries. 

Following query shows how you can use *population_csv* view we created in [Creating views](#creating-views). It returns country names with their population in 2019 in descending order.

> [!NOTE]
> Please change the first line in query below to use database you created. If you did not create database, please check [First time setup](query-data-storage.md#first-time-setup).

```sql
USE [mydbname]
GO

SELECT 
	country_name, population
FROM populationView
WHERE 
	[year] = 2019
ORDER BY 
	[population] DESC
```

## Next steps

Advance to one of the following articles and learn how to query different files.
> [!div class="nextstepaction"]
> [Querying single CSV file](querying-single-csv-file.md)

> [!div class="nextstepaction"]
> [Querying Parquet files](querying-parquet-files.md)

> [!div class="nextstepaction"]
> [Querying JSON files](query-json-files.md)
