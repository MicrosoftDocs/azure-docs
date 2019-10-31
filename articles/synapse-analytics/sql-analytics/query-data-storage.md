---
title: Overview - Query data in storage
description: This section contains sample queries you can use to try out SQL on-demand service.
services: sql-data-warehouse
author: azaricstefan
ms.service: sql-data-warehouse 
ms.topic: overview
ms.subservice: design
ms.date: 10/07/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Overview: Query data in storage

This section contains sample queries you can use to try out SQL on-demand service.

Currently supported files are: 
- CSV
- Parquet 
- JSON


## Prerequisites

Tool to issue queries:

- SQL client of your choice:
    - Synapse Studio
    - Azure Data Studio
    - SQL Server Management Studio

Parameters:

| Parameter                                 | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| SQL on-demand service endpoint address    | Will be used as server name                                   |
| SQL on-demand service endpoint region     | Will be used to determine what storage will we use in samples |
| Username and password for endpoint access | Will be used to access endpoint                               |
| Database you will use to create views     | This database will be used as starting point in samples       |

## First time setup

There are two steps prior to using samples:

- Create database for your views (in case you want to use views)
- Create credentials to be used by SQL on-demand to access files in storage

### Create database

Create your own database. Database is needed to create views in it. You will use this database in some of sample queries in this documentation. 

> [!NOTE]
> Note that databases are used only for view metadata, not for actual data.
> 
> Write down database name you use. you will need it later on.

```sql
CREATE DATABASE mydbname
```



### Create credentials

We need to create credential before you can run queries. This credential will be used by SQL on-demand service to access files in storage.

For more information on how to manage storage access control check this [link](development-storage-files-storage-access-control.md).

> [!NOTE]
> Please note that you need to create credential for storage account that is located in your endpoint region. Although SQL on-demand can access storages from different regions, having storage and endpoint in same region will provide better performance experience.

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


## Validation


Execute following three queries and check if credentials are created correctly.

> [!NOTE]
> Note that all URIs in sample queries are using storage account located in North Europe Azure region. 
> 
> Make sure that you created appropriate credential. Run this query and make sure storage account is listed:

```sql
-- QUERY 1 - Validate CSV credential
SELECT name
FROM sys.credentials 
WHERE 
	name = 'https://sqlondemandstorage.blob.core.windows.net/csv'

-- QUERY 2 - Validate Parquet credential
SELECT name
FROM sys.credentials 
WHERE 
	name = 'https://sqlondemandstorage.blob.core.windows.net/parquet'

-- QUERY 3 - Validate JSON credential
SELECT name
FROM sys.credentials 
WHERE 
	name = 'https://sqlondemandstorage.blob.core.windows.net/json'
```

If you can't find appropriate credential, check [First time setup](#first-time-setup).

### Sample query

Last step of validation is to execute the following query.

```sql
SELECT 
	COUNT_BIG(*)
FROM  
	OPENROWSET(
		BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2017/month=9/*.parquet',
		FORMAT='PARQUET'
	) AS nyc
```

Query above should return number: **8945574**.

## Next steps

Now you are ready to start with following quickstart articles:

- [Querying single CSV file](querying-single-csv-file.md)

- [Querying folders and multiple CSV files](query-folders-multiple-csv-files.md)

- [Querying specific files](querying-specific-files.md)

- [Querying Parquet files](query-parquet-files.md)

- [Querying Parquet nested types](querying-parquet-nested-types.md)

- [Querying JSON files](query-json-files.md)

- [Creating and using views](create-use-views.md)


Advance to the next article to learn how to query single CSV file.
> [!div class="nextstepaction"]
> [Querying single CSV file](querying-single-csv-file.md)
