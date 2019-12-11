---
title: Using SQL on-demand
description: In this quickstart, you will see and learn how easy is to query various types of files using SQL on-demand.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: quickstart
ms.subservice:
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Quickstart: Using SQL on-demand 

In this quickstart, you will see and learn how easy is to query various types of files using SQL on-demand.

Currently following file types are supported: 
- JSON
- CSV
- Parquet

## Prerequisites

Tool to issue queries:

- SQL client of your choice:
    - Azure Synapse Studio
    - Azure Data Studio
    - SQL Server Management Studio

Parameters:

| Parameter                                 | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| SQL on-demand service endpoint address    | Will be used as server name                                   |
| SQL on-demand service endpoint region     | Will be used to determine what storage will we use in samples |
| Username and password for endpoint access | Will be used to access endpoint                               |
| Database you will use to create views     | This database will be used as starting point in samples       |

## First-time setup

There are two steps prior to using samples:

- Create database for your views (in case you want to use views)
- Create credentials to be used by SQL on-demand to access files in storage

### Create database

Since you will use demo environment, you should create your own database for demo purposes. Database is needed to create views in it. You will use this database in some of sample queries in this documentation. 

> [!NOTE]
> Note that databases are used only for view metadata, not for actual data.
> 
> Write down database name you use. you will need it later on.

```sql
CREATE DATABASE mydbname
```



### Create credentials

We need to create credentials before you can run queries. These credentials will be used by SQL on-demand service to access files in storage.

> [!NOTE]
> Note that you need to create credential for storage account that is located in your endpoint region. Although SQL on-demand can access storages from different regions, having storage and endpoint in same region will provide better performance experience.

**Code snippet on how to create credentials for CSV, JSON and Parquet containers**, run:

```mssql
-- create credentials for CSV container in our demo storage account
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://sqlondemandstorage.blob.core.windows.net/csv')
DROP CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/csv]
Go

CREATE CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/csv]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D'
Go

-- create credentials for JSON container in our demo storage account
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://sqlondemandstorage.blob.core.windows.net/json')
DROP CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/json]
Go

CREATE CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/json]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D'
Go

-- create credentials for PARQUET container in our demo storage account
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://sqlondemandstorage.blob.core.windows.net/parquet')
DROP CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/parquet]
Go

CREATE CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/parquet]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D'
Go
```

## Provided demo data

Demo data contains following data sets:

- NYC Taxi - Yellow Taxi Trip Records - part of public NYC data set 
  - CSV format
  - Parquet format
- Population data set
  - CSV format
- Sample Parquet files with nested columns
  - Parquet format
- Books JSON
  - JSON format

| Folder path                                                  | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| /csv/                                                        | Parent folder for data in CSV format                         |
| /csv/population/<br />/csv/population-unix/<br />/csv/population-unix-hdr/<br />/csv/population-unix-hdr-escape<br />/csv/population-unix-hdr-quoted | Folders with Population data files in different CSV formats. |
| /csv/taxi/                                                   | Folder with NYC public data files in CSV format              |
| /parquet/                                                    | Parent folder for data in Parquet format                     |
| /parquet/taxi                                                | NYC public data files in Parquet format, partitioned by year, and month using Hive/Hadoop partitioning scheme. |
| /parquet/nested/                                             | Sample Parquet files with nested columns                     |
| /json/                                                       | Parent folder for data in JSON format                        |
| /json/books/                                                 | JSON files with books data                                   |


## Querying

Bellow you can see three examples of querying **CSV**, **Parquet, and **JSON** files.

### Querying CSV file - no header row, Windows style new line

Following query shows how to read CSV file without header row, with Windows-style new line and comma-delimited columns using SQL on-demand.

File preview:

![First 10 rows of the CSV file without header, Windows style new line.](./media/querying-single-csv-file/population.png)


```sql
SELECT * 
FROM OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/csv', 
 		FORMAT = 'CSV', 
		FIELDTERMINATOR =',', 
		ROWTERMINATOR = '\n'
	)
WITH (
	[country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
	[country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
	[year] smallint,
	[population] bigint
) AS [r]
WHERE 
	country_name = 'Luxembourg' 
	AND year = 2017
```

### Querying Parquet files without specifying schema

Column names and data types will be automatically read from Parquet metadata if you don't specify OPENROWSET WITH clause.

This sample shows automatic schema inference capabilities for Parquet files. It returns number of rows in September 2017. without specifying schema. 

> [!NOTE]
> Note that you do not have to specify columns in OPENROWSET WITH clause when reading parquet files. In that case, SQL on-demand service will utilize metadata in parquet file and bind columns by name.  

```sql
SELECT 
	COUNT_BIG(*)
FROM  
	OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2017/month=9/*.parquet', 
		FORMAT='PARQUET'
	) AS nyc
```
### Querying JSON files

#### JSON sample file

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

#### Querying JSON files using JSON_VALUE

Following query shows how to use [JSON_VALUE](https://docs.microsoft.com/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) to retrieve scalar values (title, publisher) from book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected articles*:

```mssql
SELECT 
    JSON_VALUE(jsonContent, '$.title') AS title,
	JSON_VALUE(jsonContent, '$.publisher') as publisher,
	jsonContent
FROM 
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/json/books/*.json', 
		FORMAT='CSV', 
        FIELDTERMINATOR ='0x0b',
        FIELDQUOTE = '0x0b', 
        ROWTERMINATOR = '0x0b'
    )
    WITH (
        jsonContent varchar(8000)
    ) AS [r]
WHERE 
	JSON_VALUE(jsonContent, '$.title') = 'Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics'
```

> [!NOTE]
> Note that we are reading entire JSON file as single row/column so FIELDTERMINATOR, FIELDQUOTE and ROWTERMINATOR are set to 0x0b as we do not expect to find it in the file.

## Next steps

Now you are ready to start with following quickstarts:

- [Query single CSV file](query-single-csv-file.md)

- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)

- [Query specific files](query-specific-files.md)

- [Query Parquet files](query-parquet-files.md)

- [Query Parquet nested types](query-parquet-nested-types.md)

- [Query JSON files](query-json-files.md)

- [Creating and using views](create-use-views.md)


Advance to the next article to learn how to query single CSV file.
> [!div class="nextstepaction"]
> [Query single CSV file](query-single-csv-file.md)

