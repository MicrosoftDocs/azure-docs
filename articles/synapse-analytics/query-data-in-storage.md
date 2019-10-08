---
title: Overview: Query data in storage #Required; update as needed page title displayed in search results. Include the brand.
description: This section contains sample queries you can use to try out SQL on demand service. #Required; Add article description that is displayed in search results.
services: synapse-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: synapse-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/07/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Overview: Query data in storage

This section contains sample queries you can use to try out SQL on demand service.
<!---Required:
Lead with a light intro that describes, in customer-friendly language, what the customer will learn, or do, or accomplish. Answer the fundamental “why would I want to do this?” question.
--->

Currently supported files are: CSV, Parquet and JSON.

If you don’t have a <service> subscription, create a free trial account...
<!--- Required, if a free trial account exists
Because quickstarts are intended to help new customers use a subscription to quickly try out a specific product/service, include a link to a free trial before the first H2, if one exists. You can find listed examples in [Write quickstarts](contribute-how-to-mvc-quickstart.md)
--->

<!---Avoid notes, tips, and important boxes. Readers tend to skip over them. Better to put that info directly into the article text.--->

## Prerequisites

Tool to issue queries:

- SQL client of your choice:
    - Azure Data Studio
    - SQL Server Management Studio

Parameters:

| Parameter                                 | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| SQL on demand service endpoint address    | Will be used as server name                                   |
| SQL on demand service endpoint region     | Will be used to determine what storage will we use in samples |
| Username and password for endpoint access | Will be used to access endpoint                               |
| Database you will use to create views     | This database will be used as starting point in samples       |

## First time setup

There are two steps prior to using samples:

- Create database for your views (in case you want to use views)
- Create credentials to be used by SQL on demand to access files in storage

### Create database

Since you will use demo environment, you should create your own database for demo purposes. Database is needed to create views in it. You will use this database in some of sample queries in this documentation. 

> Please note that databases are used only for view metadata, not for actual data. Databases will be dropped on daily basis. Please keep all your scripts so you can easily regenerate database if needed.

> Please write down database name you use. you will need it later on.

```sql
CREATE DATABASE mydbname
```



### Create credentials

We need to create credential before you can run queries. This credential will be used by SQL on demand service to access files in storage.

> Please note that you need to create credential for storage account that is located in your endpoint region. Although SQL on demand can access storages from different regions, having storage and endpoint in same region will provide better performance experience.

**Code snippet on how to create credentials for a North Europe region**, run:

```mssql
-- create credentials for csv container in demo storage account in North Europe region
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://partystoragenortheurblob.blob.core.windows.net/csv')
DROP CREDENTIAL [https://partystoragenortheurblob.blob.core.windows.net/csv]
Go

CREATE CREDENTIAL [https://partystoragenortheurblob.blob.core.windows.net/csv]  
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'st=2019-06-02T09%3A29%3A00Z&se=2020-05-10T09%3A29%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=8GW0IxkkM3uLVzRUEPvJgDxknV%2BdITxuGhFImhzN6tQ%3D'
Go

-- create credentials for parquet container in demo storage account in North Europe region
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://partystoragenortheurblob.blob.core.windows.net/parquet')
DROP CREDENTIAL [https://partystoragenortheurblob.blob.core.windows.net/parquet]
Go

CREATE CREDENTIAL [https://partystoragenortheurblob.blob.core.windows.net/parquet]  
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'st=2019-06-02T09%3A30%3A00Z&se=2020-05-10T09%3A30%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=%2FOhnvDIFhBLh3%2FlbRxRpQT6lMMC7RpTtCAYFWiaUYA8%3D'
Go

-- create credentials for json container in demo storage account in North Europe region
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://partystoragenortheurblob.blob.core.windows.net/json')
DROP CREDENTIAL [https://partystoragenortheurblob.blob.core.windows.net/json]
Go

CREATE CREDENTIAL [https://partystoragenortheurblob.blob.core.windows.net/json]  
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'st=2019-08-01T09%3A11%3A00Z&se=2021-08-01T09%3A11%3A00Z&sp=rl&sv=2018-03-28&sr=c&sig=VX9kCqt2yTmqU5MzxhLVWh5uhg%2BTFGeqlycgjJOlTx8%3D'
Go
```

## Provided demo data

Demo data contains following data sets:

# TODO: SAMPLES
**New SAMPLES**
- NYC Taxi & Limousine Commission - yellow taxi trip records
  - Parquet format

**From GITHUB Samples**
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
| /parquet/taxi                                                | NYC public data files in Parquet format, partitioned by year and month using Hive/Hadoop partitioning scheme. |
| /parquet/nested/                                             | Sample Parquet files with nested columns                     |
| /json/                                                       | Parent folder for data in JSON format                        |
| /json/books/                                                 | JSON files with books data                                   |



## Next steps

Now you are ready to start with following quickstarts:

1. [Querying single CSV file](querying-single-csv-file.md)

1. [Querying folders and multiple CSV files](querying-folders-and-multiple-csv-files.md)

1. [Querying specific files](querying-specific-files.md)

1. [Querying Parquet files](querying-parquet-files.md)

1. [Creating and using views](creating-and-using-views.md)

1. [Querying JSON files](querying-json-files.md)

1. [Querying Parquet nested types](querying-parquet-nested-types.md)


Advance to the next article to learn how to query single CSV file.
> [!div class="nextstepaction"]
> [Querying single CSV file](querying-single-csv-file.md)
