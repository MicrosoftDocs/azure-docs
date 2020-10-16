---
title: Query Azure Cosmos DB data using serverless SQL pool in Azure Synapse Link (preview)
description: In this article, you'll learn how to query Azure Cosmos DB using SQL on-demand in Azure Synapse Link (preview).
services: synapse analytics
author: jovanpop-msft
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 09/15/2020
ms.author: jovanpop
ms.reviewer: jrasnick
---

# Query Azure Cosmos DB data with serverless SQL pool in Azure Synapse Link (preview)

Synapse serverless SQL pool (previously SQL on-demand) allows you to analyze data in your Azure Cosmos DB containers that are enabled with [Azure Synapse Link](../../cosmos-db/synapse-link.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) in near real time without impacting the performance of your transactional workloads. It offers a familiar T-SQL syntax to query data from the [analytical store](../../cosmos-db/analytical-store-introduction.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) and integrated connectivity to a wide range of BI and ad-hoc querying tools via the T-SQL interface.

For querying Azure Cosmos DB, the full [SELECT](/sql/t-sql/queries/select-transact-sql?view=sql-server-ver15) surface area is supported through the [OPENROWSET](develop-openrowset.md) function, including the majority of [SQL functions and operators](overview-features.md). You can also store results of the query that reads data from Azure Cosmos DB along with data in Azure Blob Storage or Azure Data Lake Storage using [create external table as select](develop-tables-cetas.md#cetas-in-sql-on-demand). You can't currently store serverless SQL pool query results to Azure Cosmos DB using [CETAS](develop-tables-cetas.md#cetas-in-serverless-sql-pool).

In this article, you'll learn how to write a query with serverless SQL pool that will query data from Azure Cosmos DB containers that are Synapse Link enabled. You can then learn more about building serverless SQL pool views over Azure Cosmos DB containers and connecting them to Power BI models in [this](./tutorial-data-analyst.md) tutorial. 

## Overview

To support querying and analyzing data in Azure Cosmos DB analytical store, serverless SQL pool uses the following `OPENROWSET` syntax:

```sql
OPENROWSET( 
       'CosmosDB',
       '<Azure Cosmos DB connection string>',
       <Container name>
    )  [ < with clause > ] AS alias
```

The Azure Cosmos DB connection string specifies the Azure Cosmos DB account name, database name, database account master key, and an optional region name to `OPENROWSET` function. 

> [!IMPORTANT]
> Make sure that you use alias after `OPENROWSET`. There is a [known issue](#known-issues) that cause connection issue to Synapse serverless SQL endpoint if you don't specify the alias after `OPENROWSET` function.

The connection string has the following format:
```sql
'account=<database account name>;database=<database name>;region=<region name>;key=<database account master key>'
```

The Azure Cosmos DB container name is specified without quotes in the `OPENROWSET` syntax. If the container name has any special characters (for example, a dash '-'), the name should be wrapped within the `[]` (square brackets) in the `OPENROWSET` syntax.

> [!NOTE]
> Serverless SQL pool does not support querying Azure Cosmos DB transactional store.

## Sample data set

The examples in this article are based on data from [European Centre for Disease Prevention and Control (ECDC) COVID-19 Cases](https://azure.microsoft.com/services/open-datasets/catalog/ecdc-covid-19-cases/) and [COVID-19 Open Research Dataset (CORD-19), doi:10.5281/zenodo.3715505](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/). 

You can see the license and the structure of data on these pages, and download sample data for [ECDC](https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.json) and [Cord19](https://azureopendatastorage.blob.core.windows.net/covid19temp/comm_use_subset/pdf_json/000b7d1517ceebb34e1e3e817695b6de03e2fa78.json) data sets.

To follow along with this article showcasing how to query Cosmos DB data with serverless SQL pool, make sure that you create the following resources:
* An Azure Cosmos DB database account that is [Synapse Link enabled](../../cosmos-db/configure-synapse-link.md)
* An Azure Cosmos DB database named `covid`
* Two Azure Cosmos DB containers named `EcdcCases` and `Cord19` with above sample data sets loaded.

## Explore Azure Cosmos DB data with automatic schema inference

The easiest way to explore data in Azure Cosmos DB is by leveraging the automatic schema inference capability. By omitting the `WITH` clause from the `OPENROWSET` statement, you can instruct serverless SQL pool to auto detect (infer) the schema of the analytical store of the Azure Cosmos DB container.

```sql
SELECT TOP 10 *
FROM OPENROWSET( 
       'CosmosDB',
       'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
       EcdcCases) as documents
```
In the above example, we're instructing serverless SQL pool to connect to the `covid` database in Azure Cosmos DB account `MyCosmosDbAccount` authenticated using the Azure Cosmos DB key (dummy in the above example). We're then accessing the container `EcdcCases`'s analytical store in the `West US 2` region. Since there's no projection of specific properties, `OPENROWSET` function will return all properties from the Azure Cosmos DB items.

If you need to explore data from the other container in the same Azure Cosmos DB database, you can use the same connection string and reference required container as third parameter:

```sql
SELECT TOP 10 *
FROM OPENROWSET( 
       'CosmosDB',
       'account=MyCosmosDbAccount;database=covid;region=westus2;key=C0Sm0sDbKey==',
       Cord19) as cord19
```

## Explicitly specify schema

While automatic schema inference capability in `OPENROWSET` provides a simple, easy-to-use querience, your business scenarios may require you to explicitly specify the schema to read-only relevant properties from the Azure Cosmos DB data.

`OPENROWSET` enables you to explicitly specify what properties you want to read from the data in the container and to specify their data types. 
Let's imagine that we've imported some data from [ECDC COVID data set](https://azure.microsoft.com/services/open-datasets/catalog/ecdc-covid-19-cases/) with the following structure into Azure Cosmos DB:

```json
{"date_rep":"2020-08-13","cases":254,"countries_and_territories":"Serbia","geo_id":"RS"}
{"date_rep":"2020-08-12","cases":235,"countries_and_territories":"Serbia","geo_id":"RS"}
{"date_rep":"2020-08-11","cases":163,"countries_and_territories":"Serbia","geo_id":"RS"}
```

These flat JSON documents in Azure Cosmos DB can be represented as a set of rows and columns in Synapse SQL. `OPENROWSET` function enables you to specify a subset of properties that you want to read and the exact column types in the `WITH` clause:

```sql
SELECT TOP 10 *
FROM OPENROWSET(
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

Review the [rules for SQL type mappings](#azure-cosmos-db-to-sql-type-mappings) at the end of the article for more information about the SQL types that should be used for Azure Cosmos DB value.

## Querying nested objects and arrays

Azure Cosmos DB allows you to represent more complex data models by composing them as nested objects or arrays. The autosync capability of Synapse Link for Azure Cosmos DB manages the schema representation in the analytical store out-of-the-box which, includes handling nested data types allowing for rich querying from serverless SQL pool.

For example, the [CORD-19](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/) data set has JSON documents following the following structure:

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

The nested objects and arrays in Azure Cosmos DB are represented as JSON strings in the query result when `OPENROWSET` function reads them. One option to read the values from these complex types as SQL columns is use SQL JSON functions:

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

As an alternative option, you can also specify the paths to nested values in the objects when using `WITH` clause:

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

Learn more about analyzing [complex data types in Synapse Link](../how-to-analyze-complex-schema.md) and [nested structures in serverless SQL pool](query-parquet-nested-types.md).

> [!IMPORTANT]
> If you see unexpected characters in your text like `MÃƒÂ©lade` instead of `Mélade` then your database collation is not set to [UTF8](https://docs.microsoft.com/sql/relational-databases/collations/collation-and-unicode-support#utf8) collation. 
> [Change collation of the database](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-database-collation#to-change-the-database-collation) to some UTF8 collation using some SQL statement like `ALTER DATABASE MyLdw COLLATE LATIN1_GENERAL_100_CI_AS_SC_UTF8`.


## Flattening nested arrays

Azure Cosmos DB data might have nested subarrays like the author's array from [Cord19](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/) data set:

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
elements of the array (authors). Serverless SQL pool enables you to flatten nested structures by applying
the `OPENJSON` function on the nested array:

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
Supplementary Information An eco-epidemi… | `[{"first":"Nicolas","last":"4#","suffix":"","affiliation":{"laboratory":"","institution":"U…` | Nicolas | 4# |`{"laboratory":"","institution":"U…` | 
| Supplementary Information An eco-epidemi… |	`[{"first":"Beza","last":"Ramazindrazana","suffix":"","affiliation":{"laboratory":"Centre de Recher…` | Beza | Ramazindrazana |	`{"laboratory":"Centre de Recher…` |
| Supplementary Information An eco-epidemi… |	`[{"first":"Olivier","last":"Flores","suffix":"","affiliation":{"laboratory":"UMR C53 CIRAD, …` | Olivier | Flores |`{"laboratory":"UMR C53 CIRAD, …` |		

> [!IMPORTANT]
> If you see unexpected characters in your text like `MÃƒÂ©lade` instead of `Mélade` then your database collation is not set to [UTF8](https://docs.microsoft.com/sql/relational-databases/collations/collation-and-unicode-support#utf8) collation. 
> [Change collation of the database](https://docs.microsoft.com/sql/relational-databases/collations/set-or-change-the-database-collation#to-change-the-database-collation) to some UTF8 collation using some SQL statement like `ALTER DATABASE MyLdw COLLATE LATIN1_GENERAL_100_CI_AS_SC_UTF8`.

## Azure Cosmos DB to SQL type mappings

It is important to first note that while Azure Cosmos DB transactional store is schema-agnostic, the analytical store is schematized to optimize for analytical query performance. With the autosync capability of Synapse Link, Azure Cosmos DB manages the schema representation in the analytical store out-of-the-box which, includes handling nested data types. Since serverless SQL pool queries the analytical store, it is important to understand how to map Azure Cosmos DB input data types to SQL data types.

Azure Cosmos DB accounts of SQL (Core) API support JSON property types of number, string, boolean, null, nested object or array. You would need to
choose SQL types that match these JSON types if you are using `WITH` clause in `OPENROWSET`. See below the SQL column types that should be used for different property types in Azure Cosmos DB.

| Azure Cosmos DB property type | SQL column type |
| --- | --- |
| Boolean | bit |
| Integer | bigint |
| Decimal | float |
| String | varchar (UTF8 database collation) |
| Date time (ISO formatted string) | varchar(30) |
| Date time (unix timestamp) | bigint |
| Null | `any SQL type` 
| Nested object or array | varchar(max) (UTF8 database collation), serialized as JSON text |

For querying Azure Cosmos DB accounts of Mongo DB API kind, you can learn more about the full fidelity schema representation in the analytical store and the extended property names to be used [here](../../cosmos-db/analytical-store-introduction.md#analytical-schema).

## Known issues

- Alias **MUST** be specified after `OPENROWSET` function (for example, `OPENROWSET (...) AS function_alias`). Omitting alias might cause connection issue and Synapse serverless SQL endpoint might be temporarily unavailable. This issue will be resolved in Nov 2020.
- Serverless SQL pool currently doesn't support [Azure Cosmos DB full fidelity schema](../../cosmos-db/analytical-store-introduction.md#schema-representation). Use serverless SQL pool only to access Cosmos DB well-defined schema.

Possible errors and troubleshooting actions are listed in the following table:

| Error | Root cause |
| --- | --- |
| Syntax errors:<br/> - Incorrect syntax near 'Openrowset'<br/> - `...` is not a recognized BULK OPENROWSET provider option.<br/> - Incorrect syntax near `...` | Possible root causes<br/> - Not using 'CosmosDB' as first parameter,<br/> - Using string literal instead of identifier in third parameter,<br/> - Not specifying third parameter (container name) |
| There was an error in CosmosDB connection string | - Account, Database, Key is not specified <br/> - There is some option in connection string that is not recognized.<br/> - Semicolon `;` is placed at the end of connection string |
| Resolving CosmosDB path has failed with error 'Incorrect account name' or 'Incorrect database name' | Specified account name, database name, or container cannot be found, or analytical storage has not been enabled o the specified collection|
| Resolving CosmosDB path has failed with error 'Incorrect secret value' or 'Secret is null or empty' | Account key is not valid or missing. |
| Column `column name` of type `type name` is not compatible with external data type `type name` | Specified column type in `WITH` clause doesn't match type in Cosmos DB container. Try to change the column type as it is described in the section [Azure Cosmos DB to SQL type mappings](#azure-cosmos-db-to-sql-type-mappings) or use `VARCHAR` type. |
| Column contains `NULL` values in all cells. | Possibly wrong column name or path expression in `WITH` clause. Column name (or path expression after the column type) in `WITH` clause must match some property name in Cosmos DB collection. Comparison is **case-sensitive**  (for example, `productCode` and `ProductCode` are different properties). |

You can report suggestions and issues on [Azure Synapse feedback page](https://feedback.azure.com/forums/307516-azure-synapse-analytics?category_id=387862).

## Next steps

For more information, see the following articles:

- [How-to create and use views in SQL on-demand](create-use-views.md) 
- [Tutorial on building SQL on-demand views over Azure Cosmos DB and connecting them to Power BI models via DirectQuery](./tutorial-data-analyst.md)
