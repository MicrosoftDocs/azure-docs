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

In this article, you'll learn how to write a query using SQL on-demand (preview) that will read documents from  CosmosDB collections.
Synapse SQL on-demand enables you to analyze CosmosDB documents from built-in analytical storage where analytic don't impact CosmosDB
resource units (RU) that are used on main transactional storage.

`OPENROWSET` function enables you to read and analyze the documents from CosmosDB analytical storage.

## Data set

This example uses a data from [European Centre for Disease Prevention and Control (ECDC) Covid-19 Cases](https://azure.microsoft.com/services/open-datasets/catalog/ecdc-covid-19-cases/) and [COVID-19 Open Research Dataset (CORD-19), doi:10.5281/zenodo.3715505](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/). Assumption is that you have CosmosDB collections `EcdcCases` and `Cord19` where you have imported samples from these data sets.

See the licence and the structure of data on these page.

## Read CosmosDB documents

The easiest way to see to the content of your documents is to provide a connection string that contains
CosmosDB account name, database, access key, and region to `OPENROWSET` function, and provide the name of collection that you want to query:

```sql
select top 10 *
from openrowset( 
       'CosmosDB',
       'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       EcdcCases) as documents
```

In this example, we are connected to analytical storage of `covid` database on CosmosDB account `MyCosmosDbAccount` placed in region `westus2`
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

`OPENROWSET` enables you to explicitly specify what columns you want to read from the collection and to specify their types. 
Let's imagine that we have imported some documents from [ECDC Covid data set](https://azure.microsoft.com/services/open-datasets/catalog/ecdc-covid-19-cases/)with the following structure:

```json
{"date_rep":"2020-08-13","cases":254,"countries_and_territories":"Serbia","geo_id":"RS"}
{"date_rep":"2020-08-12","cases":235,"countries_and_territories":"Serbia","geo_id":"RS"}
{"date_rep":"2020-08-11","cases":163,"countries_and_territories":"Serbia","geo_id":"RS"}
```

`OPENROWSET` function enables you to specify subset of columns that you want to read and the exact column types in `WITH` clause:

```sql
select top 10 *
from openrowset(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       EcdcCases
    ) with ( date_rep varchar(20), cases bigint, geo_id varchar(6) ) as rows
```

The result of this query might look like:

| date_rep | cases | geo_id |
| --- | --- | --- |
| 2020-08-13 | 254 | RS |
| 2020-08-12 | 235 | RS |
| 2020-08-11 | 163 | RS |

Look at the [rules for type mappings](#type-mappings) at the end of the document for more information about the sql types that should be used for CosmosDB value.

## Nested values

Nested objects and arrays from CosmosDB documents are formatted as JSON string. You can use SQL JSON functions
to read the values from these complex types:

```sql
SELECT
    title = JSON_VALUE(metadata, '$.title'),
    authors = JSON_QUERY(metadata, '$.authors'),
    first_author_name = JSON_VALUE(metadata, '$.authors[0].first')
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       Cord19
    WITH ( metadata varchar(MAX) ) AS docs;
```

the result of this query might look like:

| title | authors | first_autor_name |
| --- | --- | --- |
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"MÃƒÂ©lade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Julien |	

As an alternative, you can specify the paths to nested values in the objects using `WITH` clause:

```sql
SELECT
    *
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       Cord19
    WITH ( title varchar(1000) '$.metadata.title',
           authors varchar(max) '$.metadata.authors'
    ) AS docs;
```

## Flattening nested arrays

CosmosDB documents might have nested subarrays like the authors array from [Cord19])(https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/) data set:

```json
{
    "paper_id": <str>,                      # 40-character sha1 of the PDF
    "metadata": {
        "title": <str>,
        "authors": [                        # list of author dicts, in order
            {
                "first": <str>,
                "middle": <list of str>,
                "last": <str>,
                "suffix": <str>,
                "affiliation": <dict>,
                "email": <str>
            },
            ...
        ],
        ...
}
```

In some cases, you might need to "join" the properties from the document (metadata) with all
elements of the array (authors). Synapse SQL enables you to flatten nested structure by applying
OPENJSON function on the nested array:

```sql
SELECT
    *
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=CoPyYOurC0smosDbKeyHere==',
       Cord19
    ) WITH ( title varchar(1000) '$.metadata.title',
             authors varchar(max) '$.metadata.authors' ) AS docs
      CROSS APPLY OPENJSON ( authors )
                  WITH (
                       first varchar(50),
                       last varchar(50),
                       affiliation nvarchar(max) as json
                  ) AS a
```

The result of this query might look like:

| title | authors | first | last | affiliation |
| --- | --- | --- | --- | --- |
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"MÃƒÂ©lade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Julien | MÃƒÂ©lade | `	{"laboratory":"Centre de Recher…` |
Supplementary Information An eco-epidemi… | `[{"first":"Julien","last":"MÃƒÂ©lade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Nicolas | 4# |`{"laboratory":"","institution":"U…` | 
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"MÃƒÂ©lade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Beza | Ramazindrazana |	`{"laboratory":"Centre de Recher…` |
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"MÃƒÂ©lade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Olivier | Flores |`{"laboratory":"UMR C53 CIRAD, …` |		

## Type mappings

CosmosDB contains JSON document with numbers, strings, logical values, nested objects or arrays. You would need to
choose sql types that match these values if you are using `WITH` clause. See below the types that should be used for different values in CosmosDB.

| CosmosDB value type | SQL data type |
| --- | --- |
| Logical | bit |
| Decimal | float |
| Integer | bigint |
| Date time (unix timestamp) | bigint |
| Date time (ISO format) | varchar(30) |
| String | varchar \*(UTF8 collation) |
| Nested object | varchar(max), serialized as JSON text |

## Next steps

Advance to the next article to learn how to [Create and use views](create-use-views.md).
