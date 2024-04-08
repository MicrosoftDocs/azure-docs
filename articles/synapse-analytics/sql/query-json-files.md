---
title: Query JSON files using serverless SQL pool 
description: This section explains how to read JSON files using serverless SQL pool in Azure Synapse Analytics.
author: azaricstefan
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 05/20/2020
ms.author: stefanazaric
ms.reviewer: sngun 
---

# Query JSON files using serverless SQL pool in Azure Synapse Analytics

In this article, you'll learn how to write a query using serverless SQL pool in Azure Synapse Analytics. The query's objective is to read JSON files using [OPENROWSET](develop-openrowset.md). 
- Standard JSON files where multiple JSON documents are stored as a JSON array.
- Line-delimited JSON files, where JSON documents are separated with new-line character. Common extensions for these types of files are `jsonl`, `ldjson`, and `ndjson`.

## Read JSON documents

The easiest way to see to the content of your JSON file is to provide the file URL to the `OPENROWSET` function, specify csv `FORMAT`, and set values `0x0b` for `fieldterminator` and `fieldquote`. If you need to read line-delimited JSON files, then this is enough. If you have classic JSON file, you would need to set values `0x0b` for `rowterminator`. `OPENROWSET` function will parse JSON and return every document in the following format:

| doc |
| --- |
|{"date_rep":"2020-07-24","day":24,"month":7,"year":2020,"cases":3,"deaths":0,"geo_id":"AF"}|
|{"date_rep":"2020-07-25","day":25,"month":7,"year":2020,"cases":7,"deaths":0,"geo_id":"AF"}|
|{"date_rep":"2020-07-26","day":26,"month":7,"year":2020,"cases":4,"deaths":0,"geo_id":"AF"}|
|{"date_rep":"2020-07-27","day":27,"month":7,"year":2020,"cases":8,"deaths":0,"geo_id":"AF"}|

If the file is publicly available, or if your Microsoft Entra identity can access this file, you should see the content of the file using the query like the one shown in the following examples.

### Read JSON files

The following sample query reads JSON and line-delimited JSON files, and returns every document as a separate row.

```sql
select top 10 *
from openrowset(
        bulk 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.jsonl',
        format = 'csv',
        fieldterminator ='0x0b',
        fieldquote = '0x0b'
    ) with (doc nvarchar(max)) as rows
go
select top 10 *
from openrowset(
        bulk 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.json',
        format = 'csv',
        fieldterminator ='0x0b',
        fieldquote = '0x0b',
        rowterminator = '0x0b' --> You need to override rowterminator to read classic JSON
    ) with (doc nvarchar(max)) as rows
```

The JSON document in the preceding sample query includes an array of objects. The query returns each object as a separate row in the result set. Make sure that you can access this file. If your file is protected with SAS key or custom identity, you would need to set up [server level credential for sql login](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#server-level-credential). 

### Data source usage

The previous example uses full path to the file. As an alternative, you can create an external data source with the location that points to the root folder of the storage, and use that data source and the relative path to the file in the `OPENROWSET` function:

```sql
create external data source covid
with ( location = 'https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases' );
go
select top 10 *
from openrowset(
        bulk 'latest/ecdc_cases.jsonl',
        data_source = 'covid',
        format = 'csv',
        fieldterminator ='0x0b',
        fieldquote = '0x0b'
    ) with (doc nvarchar(max)) as rows
go
select top 10 *
from openrowset(
        bulk 'latest/ecdc_cases.json',
        data_source = 'covid',
        format = 'csv',
        fieldterminator ='0x0b',
        fieldquote = '0x0b',
        rowterminator = '0x0b' --> You need to override rowterminator to read classic JSON
    ) with (doc nvarchar(max)) as rows
```

If a data source is protected with SAS key or custom identity, you can configure [data source with database scoped credential](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#database-scoped-credential).

In the following sections, you can see how to query various types of JSON files.

## Parse JSON documents

The queries in the previous examples return every JSON document as a single string in a separate row of the result set. You can use functions `JSON_VALUE` and `OPENJSON` to parse the values in JSON documents and return them as relational values, as it's shown in the following example:

| date\_rep | cases | geo\_id |
| --- | --- | --- |
| 2020-07-24 | 3 | AF |
| 2020-07-25 | 7 | AF |
| 2020-07-26 | 4 | AF |
| 2020-07-27 | 8| AF |

### Sample JSON document

The query examples read *json* files containing documents with following structure:

```json
{
    "date_rep":"2020-07-24",
    "day":24,"month":7,"year":2020,
    "cases":13,"deaths":0,
    "countries_and_territories":"Afghanistan",
    "geo_id":"AF",
    "country_territory_code":"AFG",
    "continent_exp":"Asia",
    "load_date":"2020-07-25 00:05:14",
    "iso_country":"AF"
}
```

> [!NOTE]
> If these documents are stored as line-delimited JSON, you need to set `FIELDTERMINATOR` and `FIELDQUOTE` to 0x0b. If you have standard JSON format you need to set `ROWTERMINATOR` to 0x0b.

### Query JSON files using JSON_VALUE

The query below shows you how to use [JSON_VALUE](/sql/t-sql/functions/json-value-transact-sql?view=azure-sqldw-latest&preserve-view=true) to retrieve scalar values (`date_rep`, `countries_and_territories`, `cases`) from a JSON documents:

```sql
select
    JSON_VALUE(doc, '$.date_rep') AS date_reported,
    JSON_VALUE(doc, '$.countries_and_territories') AS country,
    CAST(JSON_VALUE(doc, '$.deaths') AS INT) as fatal,
    JSON_VALUE(doc, '$.cases') as cases,
    doc
from openrowset(
        bulk 'latest/ecdc_cases.jsonl',
        data_source = 'covid',
        format = 'csv',
        fieldterminator ='0x0b',
        fieldquote = '0x0b'
    ) with (doc nvarchar(max)) as rows
order by JSON_VALUE(doc, '$.geo_id') desc
```

Once you extract JSON properties from a JSON document, you can define column aliases and optionally cast the textual value to some type.

### Query JSON files using OPENJSON

The following query uses [OPENJSON](/sql/t-sql/functions/openjson-transact-sql?view=azure-sqldw-latest&preserve-view=true). It will retrieve COVID statistics reported in Serbia:

```sql
select
    *
from openrowset(
        bulk 'latest/ecdc_cases.jsonl',
        data_source = 'covid',
        format = 'csv',
        fieldterminator ='0x0b',
        fieldquote = '0x0b'
    ) with (doc nvarchar(max)) as rows
    cross apply openjson (doc)
        with (  date_rep datetime2,
                cases int,
                fatal int '$.deaths',
                country varchar(100) '$.countries_and_territories')
where country = 'Serbia'
order by country, date_rep desc;
```
The results are functionally same as the results returned using the `JSON_VALUE` function. In some cases, `OPENJSON` might have advantage over `JSON_VALUE`:
- In the `WITH` clause you can explicitly set the column aliases and the types for every property. You don't need to put the `CAST` function in every column in `SELECT` list.
- `OPENJSON` might be faster if you are returning a large number of properties. If you are returning just 1-2 properties, the `OPENJSON` function might be overhead.
- You must use the `OPENJSON` function if you need to parse the array from each document, and join it with the parent row.

## Next steps

The next articles in this series will demonstrate how to:

- [Querying folders and multiple files](query-folders-multiple-csv-files.md)
- [Create and use views](create-use-views.md)
