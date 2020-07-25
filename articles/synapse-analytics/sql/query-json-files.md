---
title: Query JSON files using SQL on-demand (preview) 
description: This section explains how to read JSON files using SQL on-demand in Azure Synapse Analytics.
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: how-to
ms.subservice: sql
ms.date: 05/20/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---

# Query JSON files using SQL on-demand (preview) in Azure Synapse Analytics

In this article, you'll learn how to write a query using SQL on-demand (preview) in Azure Synapse Analytics. The query's objective is to read JSON files. Supported formats are listed in [OPENROWSET](develop-openrowset.md).

## Quickstart example

The easiest way to see to the content of your JSON file is to provide file URL to `OPENROWSET` function, specify csv `FORMAT`, and set values `0x0b` for `fieldterminator` and `fieldquote`. If you need to read line-delimited JSON files this is enough. If you have classic JSON file you would need to set values `0x0b` for `rowterminator`. If the file is publicly available or if your Azure AD identity can access this file, you should be able to see the content of the file using the query like the one shown in the following example:

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

Make sure that you can access this file. If your file is protected with SAS key or custom identity, your would need to setup [server level credential for sql login](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#server-scoped-credential). 

Previous example uses full path to the file. As an alternative, you can create an external data source with the location that points to the root folder of the storage, and use that data source and the relative path to the file in `OPENROWSET` function:

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

If a data source is protected with SAS key or custom identity you can configure [data source with database scoped credential](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#database-scoped-credential).

In the following sections you can see how to query various types of JSON files.

## Prerequisites

Your first step is to **create a database** where you will execute the queries. Then initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script will create the data sources, database scoped credentials, and external file formats that are used in these samples.

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

To process JSON files using JSON_VALUE and [JSON_QUERY](/sql/t-sql/functions/json-query-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest), you need to read the JSON file from storage as a single column. The following script reads the *book1.json* file as a single column:

```sql
SELECT
    *
FROM
    OPENROWSET(
        BULK 'json/books/book1.json',
        DATA_SOURCE = 'SqlOnDemandDemo',
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

The query below shows you how to use [JSON_VALUE](/sql/t-sql/functions/json-value-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) to retrieve scalar values (title, publisher) from a JSON documents:

```sql
select
    JSON_VALUE(doc, '$.date_rep') AS date_reported,
    JSON_VALUE(doc, '$.countries_and_territories') AS country,
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

## Query JSON files using JSON_QUERY

The following query shows you how to use [JSON_QUERY](/sql/t-sql/functions/json-query-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) to retrieve objects and arrays (authors) from a book entitled *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

```sql
SELECT
    JSON_QUERY(jsonContent, '$.authors') AS authors,
    jsonContent
FROM
    OPENROWSET(
        BULK 'json/books/*.json',
        DATA_SOURCE = 'SqlOnDemandDemo',
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

The following query uses [OPENJSON](/sql/t-sql/functions/openjson-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest). It will retrieve objects and properties within a book entitled *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

```sql
SELECT
    j.*
FROM
    OPENROWSET(
        BULK 'json/books/*.json',
        DATA_SOURCE = 'SqlOnDemandDemo',
        FORMAT='CSV',
        FIELDTERMINATOR ='0x0b',
        FIELDQUOTE = '0x0b',
        ROWTERMINATOR = '0x0b'
    )
    WITH (
        jsonContent NVARCHAR(max) -- Use appropriate length. Make sure JSON fits. 
    ) AS [r]
CROSS APPLY OPENJSON(jsonContent) AS j
WHERE
    JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics';
```

## Next steps

The next articles in this series will demonstrate how to:

- [Querying folders and multiple files](query-folders-multiple-csv-files.md)
- [Create and use views](create-use-views.md)
