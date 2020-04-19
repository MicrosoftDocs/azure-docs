---
title: Overview - Query data in storage using SQL on-demand (preview) 
description: This section contains sample queries you can use to try out the SQL on-demand (preview) resource within Azure Synapse Analytics.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice:
ms.date: 04/15/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---

# Overview: Query data in storage

This section contains sample queries you can use to try out the SQL on-demand (preview) resource within Azure Synapse Analytics.
Currently supported files are: 
- CSV
- Parquet
- JSON

## Prerequisites

The tools you need to issue queries:

- SQL client of your choice:
    - Azure Synapse Studio (preview)
    - Azure Data Studio
    - SQL Server Management Studio

Additionally, the parameters are as follows:

| Parameter                                 | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| SQL on-demand service endpoint address    | Will be used as the server name.                                   |
| SQL on-demand service endpoint region     | Will be used to determine the storage used in the samples. |
| Username and password for endpoint access | Will be used to access the endpoint.                               |
| The database you'll use to create views     | This database will be used as a starting point for the samples.       |

## First-time setup

Before using the samples included later in this article, you have two steps:

- Create a database for your views (in case you want to use views)
- Create credentials to be used by SQL on-demand to access the files in storage

### Create database

You need a database to create views. You'll use this database for some of the sample queries in this documentation.

> [!NOTE]
> Databases are only used for viewing metadata, not for actual data.  Write down the database name that you use, you will need it later on.

```sql
CREATE DATABASE mydbname;
```

### Create credentials

You must create credentials before you can run queries. This credential will be used by SQL on-demand service to access the files in storage.

> [!NOTE]
> In order to successfully run How To's in this section you have to use SAS token.
>
> To start using SAS tokens you have to drop the UserIdentity which is explained in the following [article](develop-storage-files-storage-access-control.md#disable-forcing-azure-ad-pass-through).
>
> SQL on-demand by default always uses AAD pass-through.

For more information on how to manage storage access control, check this [link](develop-storage-files-storage-access-control.md).

> [!WARNING]
> You need to create credentials for a storage account that is located in your endpoint region. Although SQL on-demand can access storages from different regions, having storage and endpoint in the same region will provide a better performance experience.

To create credentials for CSV, JSON, and Parquet containers, run the code below:

```sql
-- create credentials for CSV container in our demo storage account
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://sqlondemandstorage.blob.core.windows.net/csv')
DROP CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/csv];
GO

CREATE CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/csv]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D';
GO

-- create credentials for JSON container in our demo storage account
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://sqlondemandstorage.blob.core.windows.net/json')
DROP CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/json];
GO

CREATE CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/json]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D';
GO

-- create credentials for PARQUET container in our demo storage account
IF EXISTS (SELECT * FROM sys.credentials WHERE name = 'https://sqlondemandstorage.blob.core.windows.net/parquet')
DROP CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/parquet];
GO

CREATE CREDENTIAL [https://sqlondemandstorage.blob.core.windows.net/parquet]
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = 'sv=2018-03-28&ss=bf&srt=sco&sp=rl&st=2019-10-14T12%3A10%3A25Z&se=2061-12-31T12%3A10%3A00Z&sig=KlSU2ullCscyTS0An0nozEpo4tO5JAgGBvw%2FJX2lguw%3D';
GO
```

## Provided demo data

Demo data contains the following data sets:

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

Execute the following three queries and check if the credentials are created correctly.

> [!NOTE]
> All URIs in the sample queries use a storage account located in the North Europe Azure region. Make sure that you created the appropriate credential. Run the query below and make sure the storage account is listed.

```sql
SELECT name
FROM sys.credentials
WHERE
     name IN ( 'https://sqlondemandstorage.blob.core.windows.net/csv',
     'https://sqlondemandstorage.blob.core.windows.net/parquet',
     'https://sqlondemandstorage.blob.core.windows.net/json');
```

If you can't find the appropriate credential, check [First-time setup](#first-time-setup).

### Sample query

The last step of validation is to execute the following query:

```sql
SELECT
    COUNT_BIG(*)
FROM  
    OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/parquet/taxi/year=2017/month=9/*.parquet',
        FORMAT='PARQUET'
    ) AS nyc;
```

The above Query should return this number: **8945574**.

## Next steps

You're now ready to continue on with the following How To articles:

- [Query single CSV file](query-single-csv-file.md)

- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)

- [Query specific files](query-specific-files.md)

- [Query Parquet files](query-parquet-files.md)

- [Query Parquet nested types](query-parquet-nested-types.md)

- [Query JSON files](query-json-files.md)

- [Create and using views](create-use-views.md)
