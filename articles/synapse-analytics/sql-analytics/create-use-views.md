---
title: Quickstart - Create and use views
description: This section explains how to leverage views to wrap SQL on-demand queries so you can reuse your queries. Views are also needed if you want tools like Power BI to leverage SQL on-demand Query.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Create and use views

This section explains how to leverage views to wrap SQL on-demand queries so you can reuse your queries. Views are also needed if you want tools like Power BI to leverage SQL on-demand query.


## Prerequisites

Before reading the rest of this article, make sure to check following articles:
- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Create a view

You can create views the same way you create regular SQL Server views. 

The query below creates view that reads *population.csv* file.

> [!NOTE]
> Change the first line in query below to use the database you created. If you have not created a database, please check [First-time setup](query-data-storage.md#first-time-setup).

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



## Use a view

You can use views in your queries the same way you use views in SQL Server queries. 

The following query shows how you can use the *population_csv* view we created in [Create a view](#create-a-view). It returns country names with their population in 2019 in descending order.

> [!NOTE]
> Change the first line in the query below to use the database you created. If you have not created a database, please check [First-time setup](query-data-storage.md#first-time-setup).

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
> [Query single CSV file](query-single-csv-file.md)

> [!div class="nextstepaction"]
> [Query Parquet files](query-parquet-files.md)

> [!div class="nextstepaction"]
> [Query JSON files](query-json-files.md)
