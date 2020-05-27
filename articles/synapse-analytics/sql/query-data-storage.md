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
Currently supported file formats are:  
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

Your first step is to **create a database** where you will execute the queries. Then initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. This setup script will create the data sources, database scoped credentials, and external file formats that are used to read data in these samples.

> [!NOTE]
> Databases are only used for viewing metadata, not for actual data.  Write down the database name that you use, you will need it later on.

```sql
CREATE DATABASE mydbname;
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

### Sample query

The last step of validation is to execute the following query:

```sql
SELECT
    COUNT_BIG(*)
FROM  
    OPENROWSET(
        BULK 'parquet/taxi/year=2017/month=9/*.parquet',
        DATA_SOURCE = 'sqlondemanddemo',
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
