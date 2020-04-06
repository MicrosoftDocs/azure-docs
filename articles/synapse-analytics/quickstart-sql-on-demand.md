---
title: Using SQL on-demand (preview)
description: In this quickstart, you will see and learn how easy is to query various types of files using SQL on-demand (preview).
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice:
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Using SQL on-demand

Synapse SQL on-demand  (preview) is a serverless query service that enables you to run the SQL queries on your files placed in Azure Storage. In this quickstart, you will learn how to query various types of files using SQL on-demand.

The following file types are supported: JSON, CSV, Apache Parquet

## Prerequisites

Choose a SQL client to issue queries:

- [Azure Synapse Studio](quickstart-synapse-studio.md) is a web tool that you can use to browse files in storage and create SQL query.
- [Azure Data Studio](./sql-analytics/get-started-azure-data-studio.md) is a client tool that enables you to run SQL queries and notebooks on your On-demand database.
- [SQL Server Management Studio](./sql-analytics/get-started-ssms.md) is a client tool that enables you to run SQL queries on your On-demand database.

Parameters for quickstart:

| Parameter                                 | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| SQL on-demand service endpoint address    | Used as server name                                   |
| SQL on-demand service endpoint region     | Used to determine what storage will we use in samples |
| Username and password for endpoint access | Used to access endpoint                               |
| The database used to create views         | Database used as starting point in samples       |

## First-time setup

Prior to using samples:

- Create database for your views (in case you want to use views)
- Create credentials to be used by SQL on-demand to access files in storage

### Create database

Create your own database for demo purposes. This is the database in which you create your views. Use this database in the sample queries in this article.

> [!NOTE]
> The databases are used only for view metadata, not for actual data.
>
> Write down database name you use for use later in the Quickstart.

Use the following query, changing `mydbname` to a name of your choice:

```sql
CREATE DATABASE mydbname
```

### Create credentials

To run queries using SQL on-demand, create credentials for SQL on-demand to use to access files in storage.

> [!NOTE]
> Note that you need to create credential for access to the storage account. Although SQL on-demand can access storages from different regions, having storage and Azure Synapse workspace in same region will provide better performance experience.

Modify the following code snippet to create credential for CSV, JSON and Parquet containers:

```sql
-- create credentials for containers in our demo storage account
IF EXISTS
   (SELECT * FROM sys.credentials
   WHERE name = 'https://sqlondemandstorage.blob.core.windows.net')
   DROP CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net]
GO

CREATE CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D'
GO
```

## Querying CSV files

The following image is a preview of the file to be queried:

![First 10 rows of the CSV file without header, Windows style new line.](./sql-analytics/media/querying-single-csv-file/population.png)

The following query shows how to read a CSV file that does not contain a header row, with Windows-style new line, and comma-delimited columns:

```sql
SELECT TOP 10 *
FROM OPENROWSET
  (
      BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population/*.csv'
    , FORMAT = 'CSV'
    , FIELDTERMINATOR =','
    , ROWTERMINATOR = '\n'
  )
WITH
  (
      [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2
    , [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2
    , [year] smallint
    , [population] bigint
  ) AS [r]
WHERE
  country_name = 'Luxembourg' AND year = 2017
```

You can specify schema at query compilation time.
For more examples, see how to [query CSV file](./sql-analytics/query-single-csv-file.md).

## Querying parquet files

The following sample shows the automatic schema inference capabilities for querying Parquet files. It returns the number of rows in September of 2017 without specifying schema.

> [!NOTE]
> You do not have to specify columns in `OPENROWSET WITH` clause when reading Parquet files. In that case, SQL on-demand utilizes metadata in the Parquet file and bind columns by name.

```sql
SELECT COUNT_BIG(*)
FROM OPENROWSET
  (
      BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2017/month=9/*.parquet'
    , FORMAT='PARQUET'
  ) AS nyc
```

Find more information about [querying parquet files](./sql-analytics/query-parquet-files.md)].

## Querying JSON files

### JSON sample file

Files are stored in *json* container, folder *books*, and contain single book entry with following structure:

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

### Querying JSON files

Following query shows how to use [JSON_VALUE](https://docs.microsoft.com/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) to retrieve scalar values (title, publisher) from a book with the title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected articles*:

```sql
SELECT
    JSON_VALUE(jsonContent, '$.title') AS title
  , JSON_VALUE(jsonContent, '$.publisher') as publisher
  , jsonContent
FROM OPENROWSET
  (
      BULK 'https://sqlondemandstorage.blob.core.windows.net/json/books/*.json'
    , FORMAT='CSV'
    , FIELDTERMINATOR ='0x0b'
    , FIELDQUOTE = '0x0b'
    , ROWTERMINATOR = '0x0b'
  )
WITH
  ( jsonContent varchar(8000) ) AS [r]
WHERE
  JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics'
```

> [!IMPORTANT]
> We are reading the entire JSON file as single row/column so FIELDTERMINATOR, FIELDQUOTE, and ROWTERMINATOR are set to 0x0b because we do not expect to find it in the file.

## Next steps

Now you are ready to start with following Quickstarts:

- [Query single CSV file](./sql-analytics/query-single-csv-file.md)
- [Query folders and multiple CSV files](./sql-analytics/query-folders-multiple-csv-files.md)
- [Query specific files](./sql-analytics/query-specific-files.md)
- [Query Parquet files](./sql-analytics/query-parquet-files.md)
- [Query Parquet nested types](./sql-analytics/query-parquet-nested-types.md)
- [Query JSON files](./sql-analytics/query-json-files.md)
- [Creating and using views](sql/create-use-views.md)
- [Creating and using external tables](sql/create-use-external-tables.md)
- [Persist query result to Azure storage](sql/create-external-table-as-select.md)

Advance to the next article to learn how to query single CSV file.
> [!div class="nextstepaction"]
> [Query single CSV file](./sql-analytics/query-single-csv-file.md)
