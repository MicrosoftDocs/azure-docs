---
title: Query Parquet nested types using SQL on-demand (preview)
description: In this article, you'll learn how to query Parquet nested types.
services: synapse-analytics
author: azaricstefan 
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 05/20/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---

# Query nested types in Parquet and JSON files using SQL on-demand (preview) in Azure Synapse Analytics

In this article, you'll learn how to write a query using SQL on-demand (preview) in Azure Synapse Analytics. This query will read Parquet nested types.
Nested types are complex structures that represent objects or arrays. Nested types can be stored in [PARQUET](query-parquet-files.md) or hierarchical [JSON files](query-json-files.md).

Synapse SQL on-demand formats all nested types as JSON objects and arrays, so you can use [Extract, or modify complex objects using JSON functions](https://docs.microsoft.com/sql/relational-databases/json/validate-query-and-change-json-data-with-built-in-functions-sql-server) or [parse JSON data using OPENJSON function](https://docs.microsoft.com/sql/relational-databases/json/convert-json-data-to-rows-and-columns-with-openjson-sql-server). 

One example of query that extracts scalar and objects values from [COVID-19 Open Research Dataset](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/) JSON file with nested objects is shown below. 

```sql
SELECT
    title = JSON_VALUE(doc, '$.metadata.title'),
    first_author = JSON_QUERY(doc, '$.metadata.authors[0]'),
    first_author_name = JSON_VALUE(doc, '$.metadata.authors[0].first')
FROM
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/covid19temp/comm_use_subset/pdf_json/000b7d1517ceebb34e1e3e817695b6de03e2fa78.json',
        FORMAT='CSV', FIELDTERMINATOR ='0x0b', FIELDQUOTE = '0x0b', ROWTERMINATOR = '0x0b'
    )
    WITH ( doc varchar(MAX) ) AS docs;
```

`JSON_VALUE` function returns a scalar value from the field at the specified path. `JSON_QUERY` function returns an object formated as JSON from the field at the specified path.

> [!IMPORTANT]
> This example uses a file from [COVID-19 Open Research Dataset](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/). See ths licence and the structure of data on this page.

## Prerequisites

Your first step is to **create a database**  with a datasource that references. Then initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script will create the data sources, database scoped credentials, and external file formats that are used in these samples.

## Project nested or repeated data

PARQUET file can have multiple columns with complex types. The values from these columns are formatted as JSON text and returned as VARCHAR column. The following query reads the *justSimpleArray.parquet* file. It projects all columns from the Parquet file including nested or repeated data.

```sql
SELECT
    *
FROM
    OPENROWSET(
        BULK 'parquet/nested/justSimpleArray.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    ) AS [r];
```

## Read properties from nested object columns

The following query reads the *structExample.parquet* file and shows how to surface elements of a nested column. You have two ways to reference nested value:
- Specifying the nested value path expression after type specification.
- Formatting the column name as nested path using do "." to reference the fields.

```sql
SELECT
    *
FROM
    OPENROWSET(
        BULK 'parquet/nested/structExample.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    )
    WITH (
        -- you can see original nested columns values by uncommenting lines below
        --DateStruct VARCHAR(8000),
        [DateValue] DATE '$.DateStruct.Date',
        --TimeStruct VARCHAR(8000),
        [TimeStruct.Time] TIME,
        --TimestampStruct VARCHAR(8000),
        [TimestampStruct.Timestamp] DATETIME2,
        --DecimalStruct VARCHAR(8000),
        DecimalValue DECIMAL(18, 5) '$.DecimalStruct.Decimal',
        --FloatStruct VARCHAR(8000),
        [FloatStruct.Float] FLOAT
    ) AS [r];
```

## Access elements from repeated columns

The following query reads the *justSimpleArray.parquet* file and uses [JSON_VALUE](/sql/t-sql/functions/json-value-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) to retrieve a **scalar** element from within a repeated column, such as an Array or Map:

```sql
SELECT
    *,
    JSON_VALUE(SimpleArray, '$[0]') AS FirstElement,
    JSON_VALUE(SimpleArray, '$[1]') AS SecondElement,
    JSON_VALUE(SimpleArray, '$[2]') AS ThirdElement
FROM
    OPENROWSET(
        BULK 'parquet/nested/justSimpleArray.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    ) AS [r];
```

## Access sub-objets from complex columns

The following query reads the *mapExample.parquet* file and uses [JSON_QUERY](/sql/t-sql/functions/json-query-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) to retrieve a **non-scalar** element from within a repeated column, such as an Array or Map:

```sql
SELECT
    MapOfPersons,
    JSON_QUERY(MapOfPersons, '$."John Doe"') AS [John]
FROM
    OPENROWSET(
        BULK 'parquet/nested/mapExample.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    ) AS [r];
```

You can also explicitly reference the columns that you want to return in `WITH` clause:

```sql
SELECT DocId,
    MapOfPersons,
    JSON_QUERY(MapOfPersons, '$."John Doe"') AS [John]
FROM
    OPENROWSET(
        BULK 'parquet/nested/mapExample.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    ) 
    WITH (DocId bigint, MapOfPersons VARCHAR(max)) AS [r];
```

The structure `MapOfPersons` is returned as `VARCHAR` column and formatted as JSON string.

## Projecting values from repeated columns

If you have an array of scalar values (for example `[1,2,3]`) in some columns, you can easily expand them and join them with the main row using the following script:

```sql
SELECT
    SimpleArray, Element
FROM
    OPENROWSET(
        BULK 'parquet/nested/justSimpleArray.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    ) AS arrays
    CROSS APPLY OPENJSON (SimpleArray) WITH (Element int '$') as array_values
```

## Next steps

The next article will show you how to [Query JSON files](query-json-files.md).
