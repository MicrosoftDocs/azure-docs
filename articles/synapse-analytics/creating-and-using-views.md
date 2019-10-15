---
title: Creating and using views #Required; update as needed page title displayed in search results. Include the brand.
description: This section explains how to leverage views to wrap SQL on demand queries so you can reuse your queries. Views are also needed if you want tools like Power BI to leverage SQL on demand Query. #Required; Add article description that is displayed in search results.
services: synapse-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: synapse-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/07/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Quickstart: Creating and using views 

This section explains how to leverage views to wrap SQL on demand queries so you can reuse your queries. 

Views are also needed if you want tools like Power BI to leverage SQL on demand Query.

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

## Creating views

You can create views the same way you create regular SQL Server views. 

Following query creates view that reads *population.csv* file.

> Please change the first line in query below to use database you created. If you did not create database, please check [First time setup](query-data-in-storage.md#First-time-setup).

```sql
USE [mydbname]
GO

IF EXISTS(select * FROM sys.views where name = 'populationView')
DROP VIEW populationView
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

Following query shows how you can use *population_csv* view we created in [Creating views](#Creating-views). It returns country names with their population in 2019 in descending order.

> Please change the first line in query below to use database you created. If you did not create database, please check [First time setup](query-data-in-storage.md#First-time-setup).

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

You can see more in [Querying JSON files](querying-json-files.md).

Advance to the next article to learn how to query JSON files.
> [!div class="nextstepaction"]
> [Querying JSON files](querying-json-files.md)


<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->