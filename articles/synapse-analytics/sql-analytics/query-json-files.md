---
title: Querying JSON files
description: This section explains how to read JSON files.
services: sql-data-warehouse
author: azaricstefan
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Querying JSON files 

Reading this article you will learn how to write a query in SQL Analytics on-demand that will read JSON files.

## Prerequisites

Before reading rest of the article, make sure to check following articles:
- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)


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

In order to process JSON files using [JSON_VALUE](https://docs.microsoft.com/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) and [JSON_QUERY](https://docs.microsoft.com/sql/t-sql/functions/json-query-transact-sql?view=sql-server-2017) you need to read json file from storage as single column. Following script reads *book1.json* file as single column:

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

> [!NOTE]
> Note that we are reading entire JSON file as single row/column so FIELDTERMINATOR, FIELDQUOTE and ROWTERMINATOR are set to 0x0b.


## Querying JSON files using JSON_VALUE

Following query shows how to use [JSON_VALUE](https://docs.microsoft.com/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) to retrieve scalar values (title, publisher) from book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected articles*:

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

Following query shows how to use [JSON_QUERY](https://docs.microsoft.com/sql/t-sql/functions/json-query-transact-sql?view=sql-server-2017) to retrieve objects and arrays (authors) from book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

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

Following query shows how to use [OPENJSON](https://docs.microsoft.com/sql/t-sql/functions/openjson-transact-sql?view=sql-server-2017) to retrieve objects and properties within book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected articles*:

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

You can see more in [Creating and using views](create-use-views.md).


Advance to the next article to learn how create and use views.
> [!div class="nextstepaction"]
> [Creating and using views](create-use-views.md)
