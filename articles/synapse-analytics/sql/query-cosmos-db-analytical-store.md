---
title: Query Azure Cosmos DB analytical storage using Synapse SQL on-demand (preview)
description: In this article, you'll learn how to query Azure Cosmos DB analytical storage using Synapse SQL Link for Azure Cosmos DB using SQL on-demand (preview).
services: synapse analytics
author: jovanpop-msft
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 08/20/2020
ms.author: jovanpop
ms.reviewer: jrasnick
---

# Query Azure Cosmos DB analytical storage using SQL on-demand (preview) in Azure Synapse Analytics

In this article, you'll learn how to write a query using SQL on-demand (preview) that will read [items](https://docs.microsoft.com/azure/cosmos-db/databases-containers-items#azure-cosmos-items) from Azure Cosmos DB [containers](https://docs.microsoft.com/azure/cosmos-db/databases-containers-items#azure-cosmos-containers).
Synapse SQL on-demand enables you to analyze Azure Cosmos DB items from built-in analytical storage where analytic don't impact Azure Cosmos DB
resource units (RU) that are used on the main transactional storage.

`OPENROWSET` function enables you to read and analyze the documents from Azure Cosmos DB analytical storage. The following `OPENROWSET` syntax is used to query Azure Cosmos DB analytical storage:

```sqlsyntax
openrowset( 
       'CosmosDB',
       <Azure Cosmos DB connection string>,
       <Container name>)
       [ < with clause > ]
```



## Data set

This example uses a data from [European Centre for Disease Prevention and Control (ECDC) COVID-19 Cases](https://azure.microsoft.com/services/open-datasets/catalog/ecdc-covid-19-cases/) and [COVID-19 Open Research Dataset (CORD-19), doi:10.5281/zenodo.3715505](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/). Assumption is that you have Azure Cosmos DB containers `EcdcCases` and `Cord19` where you have imported samples from these data sets. 

See the license and the structure of data on these pages, and also sample data for [ECDC](https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.json) and [Cord19](https://azureopendatastorage.blob.core.windows.net/covid19temp/comm_use_subset/pdf_json/000b7d1517ceebb34e1e3e817695b6de03e2fa78.json) data sets.

You can import data into Azure Cosmos DB container directly using [Data Explorer](/azure/cosmos-db/data-explorer.md) or use [Data Migration Tool](/azure/cosmos-db/import-data.md#JSON).

## Explore Azure Cosmos DB data

The easiest way to see to the content of your items is to provide a connection string that contains
Azure Cosmos DB account name, [database](/azure/cosmos-db/databases-containers-items.md#azure-cosmos-databases), access key, and optional region to `OPENROWSET` function, and provide the name of the [container](/azure/cosmos-db/databases-containers-items.md#azure-cosmos-containers) that you want to query:

```sql
select top 10 *
from openrowset( 
       'CosmosDB',
       'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
       EcdcCases) as documents
```

In this example, we are connected to analytical storage of `covid` database on Azure Cosmos DB account `MyCosmosDbAccount` placed in region `westus2`
and authenticated using Azure Cosmos DB key. We are accessing the [container](/azure/cosmos-db/databases-containers-items.md#azure-cosmos-containers) `EcdcCases`. `OPENROWSET` function will return all properties from the Azure Cosmos DB items.

If you need to read data from another container, you can use the same connection string and reference required container as third parameter:

```sql
select top 10 *
from openrowset( 
       'CosmosDB',
       'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
       Cord19) as cord19
```

## Explicitly specify schema

`OPENROWSET` enables you to explicitly specify what columns you want to read from the container and to specify their types. 
Let's imagine that we have imported some items from [ECDC COVID data set](https://azure.microsoft.com/services/open-datasets/catalog/ecdc-covid-19-cases/) with the following structure:

```json
{"date_rep":"2020-08-13","cases":254,"countries_and_territories":"Serbia","geo_id":"RS"}
{"date_rep":"2020-08-12","cases":235,"countries_and_territories":"Serbia","geo_id":"RS"}
{"date_rep":"2020-08-11","cases":163,"countries_and_territories":"Serbia","geo_id":"RS"}
```

These are the flat JSON documents that can be represented as a set of rows in Synapse SQL. `OPENROWSET` function enables you to specify a subset of columns that you want to read and the exact column types in `WITH` clause:

```sql
select top 10 *
from openrowset(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
       EcdcCases
    ) with ( date_rep varchar(20), cases bigint, geo_id varchar(6) ) as rows
```

The result of this query might look like:

| date_rep | cases | geo_id |
| --- | --- | --- |
| 2020-08-13 | 254 | RS |
| 2020-08-12 | 235 | RS |
| 2020-08-11 | 163 | RS |

Look at the [rules for SQL type mappings](#type-mappings) at the end of the article for more information about the sql types that should be used for Azure Cosmos DB value.

## Nested values

Some items in Azure Cosmos DB might have nested structure. For example, the [CORD-19](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/) items have the following structure:

```json
{
    "paper_id": <str>,                   # 40-character sha1 of the PDF
    "metadata": {
        "title": <str>,
        "authors": <array of objects>    # list of author dicts, in order
        ...
     }
     ...
}
```

The nested objects and arrays are formatted as JSON strings when `OPENROWSET` function reads them. You can use SQL JSON functions
to read the values from these complex types:

```sql
SELECT
    title = JSON_VALUE(metadata, '$.title'),
    authors = JSON_QUERY(metadata, '$.authors'),
    first_author_name = JSON_VALUE(metadata, '$.authors[0].first')
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
       Cord19
    WITH ( metadata varchar(MAX) ) AS docs;
```

The result of this query might look like:

| title | authors | first_autor_name |
| --- | --- | --- |
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"Mélade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Julien |	

As an alternative, you can specify the paths to nested values in the objects using `WITH` clause:

```sql
SELECT
    *
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
       Cord19
    WITH ( title varchar(1000) '$.metadata.title',
           authors varchar(max) '$.metadata.authors'
    ) AS docs;
```

Learn more about analyzing [complex schemas in Synapse workspace](../how-to-analyze-complex-schema.md) and [nested structures in SQL on-demand](query-parquet-nested-types.md).

> [!IMPORTANT]
> If you see unexpected characters in your text like `MÃƒÂ©lade` instead of `Mélade` then your database collation is not set to [UTF8](https://docs.microsoft.com/sql/relational-databases/collations/collation-and-unicode-support#utf8) collation. 
> [Change collation of the database](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-database-collation#to-change-the-database-collation) to some UTF8 collation using some SQL statement like `ALTER DATABASE MyLdw COLLATE LATIN1_GENERAL_100_CI_AS_SC_UTF8`.


## Flattening nested arrays

Azure Cosmos DB items might have nested subarrays like the authors array from [Cord19](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/) data set:

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

In some cases, you might need to "join" the properties from the top item (metadata) with all
elements of the array (authors). Synapse SQL enables you to flatten nested structure by applying
`OPENJSON` function on the nested array:

```sql
SELECT
    *
FROM
    OPENROWSET(
      'CosmosDB',
      'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
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
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"Mélade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Julien | Mélade | `	{"laboratory":"Centre de Recher…` |
Supplementary Information An eco-epidemi… | `[{"first":"Julien","last":"Mélade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Nicolas | 4# |`{"laboratory":"","institution":"U…` | 
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"Mélade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Beza | Ramazindrazana |	`{"laboratory":"Centre de Recher…` |
| Supplementary Information An eco-epidemi… |	`[{"first":"Julien","last":"Mélade","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Olivier | Flores |`{"laboratory":"UMR C53 CIRAD, …` |		

> [!IMPORTANT]
> If you see unexpected characters in your text like `MÃƒÂ©lade` instead of `Mélade` then your database collation is not set to [UTF8](https://docs.microsoft.com/sql/relational-databases/collations/collation-and-unicode-support#utf8) collation. 
> [Change collation of the database](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-database-collation#to-change-the-database-collation) to some UTF8 collation using some SQL statement like `ALTER DATABASE MyLdw COLLATE LATIN1_GENERAL_100_CI_AS_SC_UTF8`.

## Type mappings

Azure Cosmos DB contains items with numbers, strings, logical values, nested objects or arrays. You would need to
choose sql types that match these values if you are using `WITH` clause. See below the types that should be used for different values in Azure Cosmos DB.

| Azure Cosmos DB value type | SQL data type |
| --- | --- |
| Logical | bit |
| Decimal | float |
| Integer | bigint |
| Date time (unix timestamp) | bigint |
| Date time (ISO format) | varchar(30) |
| String | varchar (UTF8 database collation) |
| Nested object | varchar(max) (UTF8 database collation), serialized as JSON text |

> [!IMPORTANT]
> Make sure that you have set [UTF8 collation of the database](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-database-collation#to-change-the-database-collation) using some SQL statement like `ALTER DATABASE MyLdw COLLATE LATIN1_GENERAL_100_CI_AS_SC_UTF8`.

## Next steps

Advance to the next article to learn how to [Create and use views](create-use-views.md).
