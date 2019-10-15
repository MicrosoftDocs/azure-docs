---
title: Querying JSON files #Required; update as needed page title displayed in search results. Include the brand.
description: This section explains how to read JSON files. #Required; Add article description that is displayed in search results.
services: synapse-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: synapse-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/07/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Quickstart: Querying JSON files 

This section explains how to read JSON files.

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

## Sample JSON files

This section contains sample scripts to read JSON files. Files are stored in *json* container, folder *books*, and contain single book entry with following structure:

```json
{  
   "_id":"ahokw88",
   "type":"Book",
   "title":"The AWK Programming Language",
   "year":"1988",
   "publisher":"Addison-Wesley",
   "authors":[  
      "Alfred V. Aho",
      "Brian W. Kernighan",
      "Peter J. Weinberger"
   ],
   "source":"DBLP"
}
```



## Reading JSON files

In order to process JSON files using [JSON_VALUE](https://docs.microsoft.com/en-us/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) and [JSON_QUERY](https://docs.microsoft.com/en-us/sql/t-sql/functions/json-query-transact-sql?view=sql-server-2017) you need to to read json file from storage as single column. Following script reads *book1.json* file as single column:

```mssql
SELECT 
    *
FROM 
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/json/books/book1.json',
        FORMAT='CSV', 
        FIELDTERMINATOR ='0x0b', 
        FIELDQUOTE = '0x0b', 
        ROWTERMINATOR = '0x0b'
    )
    WITH (
        jsonContent varchar(8000)
    ) AS [r]
```

> Note that we are reading entire JSON file as single row/column so FIELDTERMINATOR, FIELDQUOTE and ROWTERMINATOR are set to 0x0b.


## Querying JSON files using JSON_VALUE

Following query shows how to use [JSON_VALUE](https://docs.microsoft.com/en-us/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) to retrieve scalar values (title, publisher) from book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

```mssql
SELECT 
    JSON_VALUE(jsonContent, '$.title') AS title,
	JSON_VALUE(jsonContent, '$.publisher') as publisher,
	jsonContent
FROM 
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/json/books/*.json',
		FORMAT='CSV', 
        FIELDTERMINATOR ='0x0b',
        FIELDQUOTE = '0x0b', 
        ROWTERMINATOR = '0x0b'
    )
    WITH (
        jsonContent varchar(8000)
    ) AS [r]
WHERE 
	JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics'
```


## Querying JSON files using JSON_QUERY

Following query shows how to use [JSON_QUERY](https://docs.microsoft.com/en-us/sql/t-sql/functions/json-query-transact-sql?view=sql-server-2017) to retrieve objects and arrays (authors) from book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

```mssql
SELECT 
    JSON_QUERY(jsonContent, '$.authors') AS authors,
	jsonContent
FROM 
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/json/books/*.json',
		FORMAT='CSV', 
        FIELDTERMINATOR ='0x0b',
        FIELDQUOTE = '0x0b', 
        ROWTERMINATOR = '0x0b'
    )
    WITH (
        jsonContent varchar(8000)
    ) AS [r]
WHERE 
	JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics'
```


## Querying JSON files using OPENJSON

Following query shows how to use [OPENJSON](https://docs.microsoft.com/en-us/sql/t-sql/functions/openjson-transact-sql?view=sql-server-2017) to retrieve objects and properties within book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

```mssql
SELECT
	j.*
FROM 
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/json/books/*.json',
		FORMAT='CSV', 
        FIELDTERMINATOR ='0x0b',
        FIELDQUOTE = '0x0b', 
        ROWTERMINATOR = '0x0b'
    )
    WITH (
        jsonContent NVARCHAR(4000) --Note that we have to use NVARCHAR(4000) for OPENJSON to work.
    ) AS [r]
CROSS APPLY OPENJSON(jsonContent) AS j
WHERE 
	JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics'
```

## Next steps

You can see more in [Querying Parquet nested types](querying-parquet-nested-types.md).


Advance to the next article to learn how query parquet nested types.
> [!div class="nextstepaction"]
> [Querying Parquet nested types](querying-parquet-nested-types.md)

<!--- Required:
Quickstarts should always have a Next steps H2 that points to the next logical quickstart in a series, or, if there are no other quickstarts, to some other cool thing the customer can do. A single link in the blue box format should direct the customer to the next article - and you can shorten the title in the boxes if the original one doesn’t fit.
Do not use a "More info section" or a "Resources section" or a "See also section". --->