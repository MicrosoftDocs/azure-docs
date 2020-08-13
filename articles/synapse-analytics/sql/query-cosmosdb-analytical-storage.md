---
title: Query documents in cosmosDB analytical storage using SQL on-demand (preview)
description: In this article, you'll learn how to query CosmosDB documents using Synapse SQL Link for CosmosDB using SQL on-demand (preview).
services: synapse analytics
author: jovanpop-msft
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 08/20/2020
ms.author: jovanpop
ms.reviewer: jrasnick
---

# Query CosmosDB documents using SQL on-demand (preview) in Azure Synapse Analytics

In this article, you'll learn how to write a query using SQL on-demand (preview) that will read documents from  files.

`OPENROWSET` function enables you to read the CosmosDB documents form CosmosDB analytical storage.

## Read CosmosDB documents

The easiest way to see to the content of your documents is to provide a connection string that contains
CosmosDB account name, database, acces key, and region to `OPENROWSET` function and provide the name of collection that you want to query:

```sql
select top 10 *
from openrowset( 
       'CosmosDB',
       'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       EcdcCases) as documents
```

In this example we are connected to analytical storage of `covid` database on CosmosDB account `MyCosmosDbAccount` placed in region `westus2`
and authenticated using CosmosDB key. We are accessing the collection `EcdcCases`. `OPENROWSET` function will return all properties from
the documents.

If you need to read data from another collection, you can use the same connection string and reference required collection as third parameter:

```sql
select top 10 *
from openrowset( 
       'CosmosDB',
       'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       Cord19) as cord19
```

## Explicitly specify schema

`OPENROWSET` enables you to explicitly specify what columns you want to read from the file using `WITH` clause:

```sql
select top 10 *
from openrowset(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       EcdcCases
    ) with ( date_rep date, cases int, geo_id varchar(6) ) as rows
```

Look at the [rules for type mappings](#type-mappings) at the end of the document for more information about the sql types that should be used for CosmosDB value.

## Nested values

Nested objects and arrays from CosmosDB documents are formatted as JSON string. You can use SQL JSON functions
to read the values from these complex types:

```sql
SELECT
    title = JSON_VALUE(metadata, '$.title'),
    authors = JSON_QUERY(metadata, '$.authors'),
    first_author_name = JSON_VALUE(metadata, '$.authors[0].first'),
    body_text = JSON_VALUE(body_text, '$.text')
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       Cord19
    WITH ( metadata varchar(MAX),
           body_text varchar(MAX)
    ) AS docs;
```

As an alternative, you can specify paths to nested objects in `WITH` clause:

```sql
SELECT
    *
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       Cord19
    WITH ( title varchar(100) '$.metadata.title',
           authors varchar(max) '$.metadata.authors',
           body_text varchar(max) '$.metadata.text'
    ) AS docs;
```

> [!IMPORTANT]
> This example uses a file from [COVID-19 Open Research Dataset](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/).
> See ths licence and the structure of data on this page.

## Flattening nested arrays

CosmosDB documents might have nested sub-arrays, and you might need to "join" the properties from the document with all
elements of the array. Synapse enables you to flatten nested structure by applying OPENJSON function on the nested array:

```sql
SELECT
    *
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       Cord19
    WITH ( title varchar(100) '$.metadata.title',
           authors varchar(max) '$.metadata.authors',
           body_text varchar(max) '$.metadata.text'
    ) AS docs
    CROSS APPLY OPENJSON ( authors )
                WITH (
                       first varchar(50),
                       last varchar(50),
                       affiliation nvarchar(max) as json
                ) AS a
```

## Type mappings

CosmosDB contains JSON document with numbers, strings, logical values, sub-objects or sub-arrays. You would need to
choose sql types that match these values if you are using `WITH` clause. See below the types that should be used for different values in CosmosDB.

| CosmosDB value type | SQL data type |
| --- | --- |
| Logical | bit |
| Decimal | float |
| Integer | bigint |
| Date time (unix timestamp) | datetime2 |
| Date time (ISO format) | varchar(40) |
| String | varchar \*(UTF8 collation) |
| Nested object | varchar(max), serialized into JSON |

## Next steps

Advance to the next article to learn how to [Create and use views](create-use-views.md).
