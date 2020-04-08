---
title: Query JSON files using SQL on-demand (preview) 
description: This section explains how to read JSON files using SQL on-demand in Azure Synapse Analytics.
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice:
ms.date: 03/20/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---

# Query JSON files using SQL on-demand (preview) in Azure Synapse Analytics 

In this article, you'll learn how to write a query using SQL on-demand (preview) in Azure Synapse Analytics. The query's objective is to read JSON files.

## Prerequisites

Before reading the rest of this article, review the following articles:

- [First-time setup](query-data-storage.md#first-time-setup)
- [Prerequisites](query-data-storage.md#prerequisites)

## Sample JSON files

The section below contains sample scripts to read JSON files. Files are stored in a *json* container, folder *books*, and contain a single book entry with following structure:

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

## Read JSON files

To process JSON files using JSON_VALUE and [JSON_QUERY](https://docs.microsoft.com/sql/t-sql/functions/json-query-transact-sql?view=sql-server-2017), you need to read the JSON file from storage as a single column. The following script reads the *book1.json* file as a single column:

```sql
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
    ) AS [r];
```

> [!NOTE]
> You are reading the entire JSON file as single row or column. So, FIELDTERMINATOR, FIELDQUOTE and ROWTERMINATOR are set to 0x0b.

## Query JSON files using JSON_VALUE

The query below shows you how to use [JSON_VALUE](https://docs.microsoft.com/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) to retrieve scalar values (title, publisher) from a book entitled *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected articles*:

```sql
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
    JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics';
```

## Query JSON files using JSON_QUERY

The following query shows you how to use [JSON_QUERY](https://docs.microsoft.com/sql/t-sql/functions/json-query-transact-sql?view=sql-server-2017) to retrieve objects and arrays (authors) from a book entitled *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

```sql
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
    JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics';
```

## Query JSON files using OPENJSON

The following query uses [OPENJSON](https://docs.microsoft.com/sql/t-sql/functions/openjson-transact-sql?view=sql-server-2017). It will retrieve objects and properties within a book entitled *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected articles*:

```sql
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
        jsonContent NVARCHAR(4000) --Note that you have to use NVARCHAR(4000) for OPENJSON to work.
    ) AS [r]
CROSS APPLY OPENJSON(jsonContent) AS j
WHERE
    JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics';
```

## Next steps

The next articles in this series will demonstrate how to:

- [Querying folders and multiple files](query-folders-multiple-csv-files.md)
- [Create and use views](create-use-views.md).
