---
title: Using SQL on demand #Required; update as needed page title displayed in search results. Include the brand.
description: In this quickstart, we will show capabilities of SQL on demand and go through examples. #Required; Add article description that is displayed in search results.
services: sql-analytics #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: azaricstefan #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-analytics #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: quickstart #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/07/2019 #Update with current date; mm/dd/yyyy format.
ms.author: v-stazar #Required; update with your microsoft alias of author; optional team alias.
ms.reviewer: jrasnick
---

# Quickstart: Using SQL on demand 

In this quickstart we will go through few examples and explain how to use SQL on demand.

Following file extensions are supported: 
- JSON
- CSV
- Parquet

CSV files may have different formats. In this section, we will show how to query single CSV file with different file formats: with and without header row, comma and tab delimited values, Windows and Unix style line endings, non-quoted and quoted values, and escaping characters.
<!---Required:
Lead with a light intro that describes, in customer-friendly language, what the customer will learn, or do, or accomplish. Answer the fundamental “why would I want to do this?” question.
--->

In this quickstart, you will query a single CSV file.

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
| /parquet/taxi                                                | NYC public data files in Parquet format, partitioned by year and month using Hive/Hadoop partitioning scheme. |
| /parquet/nested/                                             | Sample Parquet files with nested columns                     |
| /json/                                                       | Parent folder for data in JSON format                        |
| /json/books/                                                 | JSON files with books data                                   |


## Querying

Bellow you can see 3 examples of querying **CSV**, **Parquet** and **JSON** files.

### Querying CSV file - no header row, Windows style new line

Following query shows how to read CSV file without header row, with Windows-style new line and comma delimited columns.

File preview:

![First ten rows of the CSV file without header, Windows style new line.](./media/querying-single-csv-file/population.png)


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

You do not have to use OPENROWSET WITH clause when reading Parquet files because **columns names and data types will be automatically read from Parquet files**. 

This sample shows automatic schema inference capabilities for Parquet files. It returns number of rows in September 2017. without specifying schema. 

> Please note that you do not have to specify columns in OPENROWSET WITH clause when reading parquet files. In that case, SQL on demand service will utilize metadata in parquet file and bind columns by name.  

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

Following query shows how to use [JSON_VALUE](https://docs.microsoft.com/en-us/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) to retrieve scalar values (title, publisher) from book with title *Probabilistic and Statistical Methods in Cryptology, An Introduction by Selected Topics*:

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

> Note that we are reading entire JSON file as single row/column so FIELDTERMINATOR, FIELDQUOTE and ROWTERMINATOR are set to 0x0b as we do not expect to find it in the file.

## Next steps

Now you are ready to start with following quickstarts:

1. [Querying single CSV file](querying-single-csv-file.md)

2. [Querying folders and multiple CSV files](querying-folders-and-multiple-csv-files.md)

3. [Querying specific files](querying-specific-files.md)

4. [Querying Parquet files](querying-parquet-files.md)

5. [Creating and using views](creating-and-using-views.md)

6. [Querying JSON files](querying-json-files.md)

7. [Querying Parquet nested types](querying-parquet-nested-types.md)


Advance to the next article to learn how to query single CSV file.
> [!div class="nextstepaction"]
> [Querying single CSV file](querying-single-csv-file.md)
