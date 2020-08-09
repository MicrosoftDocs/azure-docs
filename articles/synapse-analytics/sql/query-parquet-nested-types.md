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
Nested types are complex structures that represent objects or arrays. Nested types can be stored in: 
- [PARQUET](query-parquet-files.md) where you can have multiple complex columns containing arrays and objects.
- Hierarchical [JSON files](query-json-files.md) where you can read complex JSON documents as single column.
- CosmosDB collection where every document can contain complex nested properties (currently under gated public preview).

Synapse SQL on-demand formats all nested types as JSON objects and arrays, so you can [extract or modify complex objects using JSON functions](https://docs.microsoft.com/sql/relational-databases/json/validate-query-and-change-json-data-with-built-in-functions-sql-server) or [parse JSON data using OPENJSON function](https://docs.microsoft.com/sql/relational-databases/json/convert-json-data-to-rows-and-columns-with-openjson-sql-server). 

One example of query that extracts scalar and objects values from [COVID-19 Open Research Dataset](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/) JSON file with nested objects is shown below. 

```sql
SELECT
    title = JSON_VALUE(doc, '$.metadata.title'),
    first_author = JSON_QUERY(doc, '$.metadata.authors[0]'),
    first_author_name = JSON_VALUE(doc, '$.metadata.authors[0].first'),
    complex_object = doc
FROM
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/covid19temp/comm_use_subset/pdf_json/000b7d1517ceebb34e1e3e817695b6de03e2fa78.json',
        FORMAT='CSV', FIELDTERMINATOR ='0x0b', FIELDQUOTE = '0x0b', ROWTERMINATOR = '0x0b'
    )
    WITH ( doc varchar(MAX) ) AS docs;
```

`JSON_VALUE` function returns a scalar value from the field at the specified path. `JSON_QUERY` function returns an object formatted as JSON from the field at the specified path.

> [!IMPORTANT]
> This example uses a file from [COVID-19 Open Research Dataset](https://azure.microsoft.com/services/open-datasets/catalog/covid-19-open-research/). See ths licence and the structure of data on this page.

## Prerequisites

Your first step is to **create a database**  with a datasource that references. Then initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script will create the data sources, database scoped credentials, and external file formats that are used in these samples.

## Project nested or repeated data

PARQUET file can have multiple columns with complex types. The values from these columns are formatted as JSON text and returned as VARCHAR column. The following query reads the *structExample.parquet* file and shows how to read the values of the nested columns: 

```sql
SELECT
    DateStruct, TimeStruct, TimestampStruct, DecimalStruct, FloatStruct
FROM
    OPENROWSET(
        BULK 'parquet/nested/structExample.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    )
    WITH (
        DateStruct VARCHAR(8000),
        TimeStruct VARCHAR(8000),
        TimestampStruct VARCHAR(8000),
        DecimalStruct VARCHAR(8000),
        FloatStruct VARCHAR(8000)
    ) AS [r];
```

This query will return the following result where the content of every nested object is returned as JSON text:

| DateStruct	| TimeStruct	| TimestampStruct	| DecimalStruct	| FloatStruct |
| --- | --- | --- | --- | --- |
|{"Date":"2009-04-25"}|	{"Time":"20:51:54.3598000"}|	{"Timestamp":"5501-04-08 12:13:57.4821000"}|	{"Decimal":11143412.25350}|	{"Float":0.5}|
|{"Date":"1916-04-29"}|	{"Time":"00:16:04.6778000"}|	{"Timestamp":"1990-06-30 20:50:52.6828000"}|	{"Decimal":1963545.62800}|	{"Float":-2.125}|

The following query reads the *justSimpleArray.parquet* file. It projects all columns from the Parquet file including nested or repeated data.

```sql
SELECT
    SimpleArray
FROM
    OPENROWSET(
        BULK 'parquet/nested/justSimpleArray.parquet',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='PARQUET'
    ) AS [r];
```

This query will return the following result:

|SimpleArray|
| --- |
|[11,12,13]|
|[21,22,23]|

## Read properties from nested object columns

`JSON_VALUE` function enables you to return values from 
column formatted as JSON text:

```sql
SELECT
    title = JSON_VALUE(complex_column, '$.metadata.title'),
    first_author_name = JSON_VALUE(complex_column, '$.metadata.authors[0].first'),
    body_text = JSON_VALUE(complex_column, '$.body_text.text'),
    complex_column
FROM
    OPENROWSET( BULK 'https://azureopendatastorage.blob.core.windows.net/covid19temp/comm_use_subset/pdf_json/000b7d1517ceebb34e1e3e817695b6de03e2fa78.json',
                FORMAT='CSV', FIELDTERMINATOR ='0x0b', FIELDQUOTE = '0x0b', ROWTERMINATOR = '0x0b' ) WITH ( complex_column varchar(MAX) ) AS docs;
```

The result is shown in the following table:

|title	| first_author_name	| body_text	| complex_column |
| --- | --- | --- | --- |
| Supplementary Information An eco-epidemiolo... | Julien	| - Figure S1 : Phylogeny of... | `{    "paper_id": "000b7d1517ceebb34e1e3e817695b6de03e2fa78",    "metadata": {        "title": "Supplementary Information An eco-epidemiological study of Morbilli-related paramyxovirus infection in Madagascar bats reveals host-switching as the dominant macro-evolutionary mechanism",        "authors": [            {                "first": "Julien"` |

Unlike JSON files that in most cases return single column containing complex JSON object. PARQUET files may have multiple complex. You can read the properties of nested column using `JSON_VALUE` function on each column. `OPENROWSET` enables you to directly specify the paths of the nested properties in `WITH` clause. Paths can be set as a name of the column or you can add [JSON path expression](https://docs.microsoft.com/sql/relational-databases/json/json-path-expressions-sql-server) after column type.

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
        [DateValue] DATE '$.DateStruct.Date',
        [TimeStruct.Time] TIME,
        [TimestampStruct.Timestamp] DATETIME2,
        DecimalValue DECIMAL(18, 5) '$.DecimalStruct.Decimal',
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

The result is shown in the following table:

|SimpleArray	| FirstElement	| SecondElement	| ThirdElement |
| --- | --- | --- | --- |
| [11,12,13] | 11	| 12 | 13 |
| [21,22,23] | 21	| 22 | 23 |

## Access sub-objects from complex columns

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

## Project values from repeated columns

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
