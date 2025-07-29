---
title: 'Quickstart: Use serverless SQL pool'
description: Learn how to use serverless SQL pool to query various types of files in Azure Storage.
author: azaricstefan
ms.service: azure-synapse-analytics
ms.topic: quickstart
ms.subservice: sql
ms.date: 02/10/2025
ms.author: stefanazaric
ms.custom: mode-other
---

# Quickstart: Use serverless SQL pool

Synapse serverless SQL pool is a serverless query service that allows you to run SQL queries on files placed in Azure Storage. In this quickstart, you learn how to query various types of files using serverless SQL pool. For a list of supported formats, see [OPENROWSET](sql/develop-openrowset.md).

This quickstart shows how to query CSV, Apache Parquet, and JSON files.

## Prerequisites

Choose a SQL client to issue queries:

- [Azure Synapse Studio](./get-started-create-workspace.md) is a web tool that you can use to browse files in storage and create SQL queries.
- [Visual Studio Code](https://code.visualstudio.com/docs) with the [mssql extension](https://aka.ms/mssql-marketplace) is a cross-platform lightweight developer and data tool that lets you run SQL queries and notebooks on your on-demand database.
- [SQL Server Management Studio](sql/get-started-ssms.md) is a client tool that lets you run SQL queries on your on-demand database.

This quickstart uses the following parameters:

| Parameter                                 | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| Serverless SQL pool service endpoint address    | Used as server name                                   |
| Serverless SQL pool service endpoint region     | Used to determine what storage to use in samples |
| Username and password for endpoint access | Used to access endpoint                               |
| The database used to create views         | Database used as starting point in samples       |

## First-time setup

Before using the samples:

- Create a database for your views (in case you want to use views).
- Create credentials to be used by serverless SQL pool to access files in storage.

### Create database

Create your own database for demo purposes. You can use this database to create your views and for the sample queries in this article.

> [!NOTE]
> The databases are used only for view metadata, not for actual data. Write down the database name for use later in the quickstart.

Use the following T-SQL command, changing `<mydbname>` to a name of your choice:

```sql
CREATE DATABASE <mydbname>
```

### Create data source

To run queries using serverless SQL pool, create a data source that serverless SQL pool can use to access files in storage. Execute the following code snippet to create the data source used in samples in this section. Replace `<strong-password-here>` with a strong password of your choice.

```sql
-- create master key that will protect the credentials:
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<strong-password-here>'

-- create credentials for containers in our demo storage account
CREATE DATABASE SCOPED CREDENTIAL sqlondemand
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2022-11-02&ss=b&srt=co&sp=rl&se=2042-11-26T17:40:55Z&st=2024-11-24T09:40:55Z&spr=https&sig=DKZDuSeZhuCWP9IytWLQwu9shcI5pTJ%2Fw5Crw6fD%2BC8%3D'
GO
CREATE EXTERNAL DATA SOURCE SqlOnDemandDemo WITH (
    LOCATION = 'https://sqlondemandstorage.blob.core.windows.net',
    CREDENTIAL = sqlondemand
);
```

## Query CSV files

The following image shows a preview of the file to be queried:

:::image type="content" source="sql/media/query-single-csv-file/population.png" alt-text="Screenshot showing the first 10 rows of the CSV file without header, Windows style new line.":::

The following query shows how to read a CSV file that doesn't contain a header row, with Windows-style new line, and comma-delimited columns:

```sql
SELECT TOP 10 *
FROM OPENROWSET
  (
      BULK 'csv/population/*.csv',
      DATA_SOURCE = 'SqlOnDemandDemo',
      FORMAT = 'CSV', PARSER_VERSION = '2.0'
  )
WITH
  (
      country_code VARCHAR (5)
    , country_name VARCHAR (100)
    , year smallint
    , population bigint
  ) AS r
WHERE
  country_name = 'Luxembourg' AND year = 2017
```

You can specify schema at query compilation time. For more examples, see how to [Query CSV files](sql/query-single-csv-file.md).

## Query Parquet files

The following sample shows the automatic schema inference capabilities for querying Parquet files. It returns the number of rows in September of 2017 without specifying schema.

> [!NOTE]
> You don't have to specify columns in `OPENROWSET WITH` clause when reading Parquet files. In that case, serverless SQL pool utilizes metadata in the Parquet file and binds columns by name.

```sql
SELECT COUNT_BIG(*)
FROM OPENROWSET
  (
      BULK 'parquet/taxi/year=2017/month=9/*.parquet',
      DATA_SOURCE = 'SqlOnDemandDemo',
      FORMAT='PARQUET'
  ) AS nyc
```

Find more information, see [Query Parquet files using serverless SQL pool](sql/query-parquet-files.md).

## Query JSON files

### JSON sample file

Files are stored in a *json* container, using folder *books*, and contain a single book entry with the following structure:

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

### Sample query

The following query shows how to use [JSON_VALUE](/sql/t-sql/functions/json-value-transact-sql?view=azure-sqldw-latest&preserve-view=true) to retrieve scalar values (title, publisher) from a book with the title *Probabilistic and Statistical Methods in Cryptology, An Introduction*:

```sql
SELECT
    JSON_VALUE(jsonContent, '$.title') AS title
  , JSON_VALUE(jsonContent, '$.publisher') as publisher
  , jsonContent
FROM OPENROWSET
  (
      BULK 'json/books/*.json',
      DATA_SOURCE = 'SqlOnDemandDemo'
    , FORMAT='CSV'
    , FIELDTERMINATOR ='0x0b'
    , FIELDQUOTE = '0x0b'
    , ROWTERMINATOR = '0x0b'
  )
WITH
  ( jsonContent varchar(8000) ) AS [r]
WHERE
  JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction'
```

> [!IMPORTANT]
> We read the entire JSON file as a single row or column. So `FIELDTERMINATOR`, `FIELDQUOTE`, and `ROWTERMINATOR` are set to `0x0b` because we don't expect to find it in the file.

## Related content

- [Query CSV files](sql/query-single-csv-file.md)
- [Query folders and multiple files](sql/query-folders-multiple-csv-files.md)
- [Query specific files](sql/query-specific-files.md)
- [Query Parquet files using serverless SQL pool](sql/query-parquet-files.md)
- [Query nested types in Parquet and JSON files](sql/query-parquet-nested-types.md)
- [Query JSON files using serverless SQL pool](sql/query-json-files.md)
- [Create and use views using serverless SQL pool](sql/create-use-views.md)
- [Create and use native external tables](sql/create-use-external-tables.md)
- [Store query results to storage](sql/create-external-table-as-select.md)
