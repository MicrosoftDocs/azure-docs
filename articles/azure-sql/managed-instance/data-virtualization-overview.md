---
title: Data virtualization
titleSuffix: Azure SQL Managed Instance 
description: Learn about data virtualization capabilities of Azure SQL Managed Instance
services: sql-database
ms.service: sql-managed-instance
ms.subservice: service-overview
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MladjoA
ms.author: mlandzic
ms.reviewer: mathoma, MashaMSFT
ms.date: 03/02/2022
---

# Data virtualization with Azure SQL Managed Instance (Preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Azure SQL Managed Instance enables you to execute T-SQL queries that read data from files stored in Azure Data Lake Storage Gen2 or Azure Blob Storage, and to combine it in queries with locally stored relational data via joins. This way you can transparently access external data still allowing it to stay in its original format and location using the concept of data virtualization.

## Overview

There are two ways of querying external files, intended for different scenarios:

- OPENROWSET syntax – optimized for ad-hoc querying of files. Typically used to quickly explore the content and the structure of a new set of files.
- External tables – optimized for repetitive querying of files using identical syntax as if data were stored locally in the database. It requires few more preparation steps compared to the first option, but it allows more control over data access. It’s typically used in analytical workloads and for reporting.

File formats directly supported are parquet and delimited text (CSV). JSON file format is supported indirectly by specifying CSV file format and queries returning every document as a separate row. Rows can be further parsed using JSON_VALUE and OPENJSON. 

Location of the file(s) to be queried needs to be provided in a specific format, with location prefix corresponding to the type of the external source and endpoint/protocol used:

```sql
--Blob Storage endpoint
abs://<container>@<storage_account>.blob.core.windows.net/<path>/<file_name>.parquet

--Data Lake endpoint
adls://<container>@<storage_account>.dfs.core.windows.net/<path>/<file_name>.parquet
```

> [!IMPORTANT]
> Usage of the generic https:// prefix is discouraged and will be disabled in the future. Make sure you use endpoint-specific prefixes to avoid interruptions.

The feature needs to be explicitly enabled before using it. Run the following commands to enable the data virtualization capabilities:

```sql
exec sp_configure 'polybase_enabled', 1;
go
reconfigure;
go
```

If you're new to the data virtualization and want to quickly test functionality, start from querying publicly available data sets available in [Azure Open Datasets](https://docs.microsoft.com/azure/open-datasets/dataset-catalog), like the [Bing COVID-19 dataset](https://docs.microsoft.com/azure/open-datasets/dataset-bing-covid-19?tabs=azure-storage) allowing anonymous access:

- Bing COVID-19 dataset - parquet: abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/bing_covid-19_data.parquet
- Bing COVID-19 dataset - CSV: abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/bing_covid-19_data.csv

Once you have first queries executing successfully, you may want to switch to private data sets that require configuring specific access rights or firewall rules. 

To access a private location, you need to authenticate to the storage account using Shared Access Signature (SAS) key with proper access permissions and validity period. The SAS key isn't provided directly in each query. It's used for creation of a database-scoped credential, which is in turn provided as a parameter of an External Data Source.

All the concepts outlined so far are described in detail in the following sections.

## External data source

External Data Source is an abstraction intended for easier management of file locations across multiple queries and for referencing authentication parameters encapsulated in database-scoped credential.

Public locations are described in an external data source by providing the file location path: 

```sql
CREATE EXTERNAL DATA SOURCE DemoPublicExternalDataSource
WITH (
	LOCATION = 'abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest'
--  LOCATION = 'abs://<container>@<storage_account>.blob.core.windows.net/<path>' 
)
```

Private locations beside path require also reference to a credential to be provided:

```sql
-- Step0 (optional): Create master key if it doesn't exist in the database:
-- CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<Put Some Very Strong Password Here>'
-- GO

--Step1: Create database-scoped credential (requires database master key to exist):
CREATE DATABASE SCOPED CREDENTIAL [DemoCredential]
WITH IDENTITY = 'SHARED ACCESS SIGNATURE',
SECRET = '<your SAS key without leading "?" mark>';
GO

--Step2: Create external data source pointing to the file path, and referencing database-scoped credential:
CREATE EXTERNAL DATA SOURCE DemoPrivateExternalDataSource
WITH (
	LOCATION = 'abs://<container>@<storage_account>.blob.core.windows.net/<path>',
    CREDENTIAL = [DemoCredential] 
)
```

## Query data sources using OPENROWSET
[OPENROWSET](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql) syntax enables instant and ad-hoc querying with minimal required database objects created. DATA_SOURCE parameter value is automatically prepended to the BULK parameter to form full path to the file. Format of the file also needs to be provided:

```sql
SELECT TOP 10 *
FROM OPENROWSET(
 BULK 'bing_covid-19_data.parquet',
 DATA_SOURCE = 'DemoPublicExternalDataSource',
 FORMAT = 'parquet'
) AS filerows
```

### Querying multiple files and folders
While in the previous example OPENROWSET command queried a single file, it can also query multiple files or folders by using wildcards in the BULK path.
Here's an example using [NYC yellow taxi trip records open data set](https://docs.microsoft.com/azure/open-datasets/dataset-taxi-yellow):

```sql
--Query all files with .parquet extension in folders matching name pattern:
SELECT TOP 10 *
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',--You need to create the data source first
 FORMAT = 'parquet'
) AS filerows
 ```
When you're querying multiple files or folders, all files accessed with the single OPENROWSET must have the same structure, that is, number of columns and their data types. Folders can't be traversed recursively.

### Schema inference
The automatic schema inference helps you quickly write queries and explore data without knowing file schemas, as seen in previous sample scripts.

The cost of the convenience is that inferred data types may be larger than the actual data types, affecting the performance of queries. This happens when there's no enough information in the source files to make sure the appropriate data type is used. For example, parquet files don't contain metadata about maximum character column length, so instance infers it as varchar(8000). 

> [!NOTE]
> Schema inference works only with files in the parquet format.

You can use sp_describe_first_results_set stored procedure to check the resulting data types of your query:
```sql
EXEC sp_describe_first_result_set N'
 SELECT
 vendor_id, pickup_datetime, passenger_count
 FROM 
 OPENROWSET(
  BULK ''taxi/*/*/*'',
  DATA_SOURCE = ''NYCTaxiDemoDataSource'',
  FORMAT=''parquet''
 ) AS nyc';
 ```

Once you know the data types, you can specify them using WITH clause to improve the performance:
```sql
SELECT TOP 100
 vendor_id, pickup_datetime, passenger_count
FROM
OPENROWSET(
 BULK 'taxi/*/*/*',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',
 FORMAT='PARQUET'
 )
WITH (
vendor_id varchar(4), -- we're using length of 4 instead of the inferred 8000
pickup_datetime datetime2,
passenger_count int
) AS nyc;
```

For CSV files the schema can’t be automatically determined, and you need to explicitly specify columns using WITH clause:

```sql
SELECT TOP 10 *
FROM OPENROWSET(
 BULK 'population/population.csv',
 DATA_SOURCE = 'PopulationDemoDataSourceCSV',
 FORMAT = 'CSV')
WITH (
 [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
 [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2,
 [year] smallint,
 [population] bigint
) AS filerows
```

### File metadata functions
When querying multiple files or folders, you can use Filepath and Filename functions to read file metadata and get part of the path or full path and name of the file that the row in the result set originates from:
```sql
--Query all files and project file path and file name information for each row:
SELECT TOP 10 filerows.filepath(1) as [Year_Folder], filerows.filepath(2) as [Month_Folder],
filerows.filename() as [File_name], filerows.filepath() as [Full_Path], *
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',
 FORMAT = 'parquet') AS filerows
--List all paths:
SELECT DISTINCT filerows.filepath(1) as [Year_Folder], filerows.filepath(2) as [Month_Folder]
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',
 FORMAT = 'parquet') AS filerows
```

When called without a parameter, filepath function returns the file path that the row originates from. When DATA_SOURCE is used in OPENROWSET, it returns path relative to DATA_SOURCE, otherwise it returns full file path.

When called with a parameter, it returns part of the path that matches the wildcard on the position specified in the parameter. For example, parameter value 1 would return part of the path that matches the first wildcard.

Filepath function can also be used for filtering and aggregating rows:
```sql
SELECT
 r.filepath() AS filepath
 ,r.filepath(1) AS [year]
 ,r.filepath(2) AS [month]
 ,COUNT_BIG(*) AS [rows]
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
DATA_SOURCE = 'NYCTaxiDemoDataSource',
FORMAT = 'parquet'
 ) AS r
WHERE
 r.filepath(1) IN ('2017')
 AND r.filepath(2) IN ('10', '11', '12')
GROUP BY
 r.filepath()
 ,r.filepath(1)
 ,r.filepath(2)
ORDER BY
 filepath;
```

### Creating view on top of OPENROWSET
You can create and use views to wrap OPENROWSET for easy reusing of underlying query:
```sql
CREATE VIEW TaxiRides AS
SELECT *
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',
 FORMAT = 'parquet'
) AS filerows
```

It’s also convenient to add columns with file location data to a view, using filepath function for easier and more performant filtering. It can reduce the number of files and the amount of data the query on top of the view needs to read and process when filtered by any of those columns:
```sql
CREATE VIEW TaxiRides AS
SELECT *
 ,filerows.filepath(1) AS [year]
 ,filerows.filepath(2) AS [month]
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',
 FORMAT = 'parquet'
) AS filerows
```

Views also enable reporting and analytic tools like Power BI to consume results of OPENROWSET.

## External tables
External tables encapsulate access to the files making the querying experience almost identical to querying local relational data stored in user tables. Creation of an external table requires external data source and external file format objects to exist:

```sql
--Create external file format
CREATE EXTERNAL FILE FORMAT DemoFileFormat
WITH (
 FORMAT_TYPE=PARQUET
)
GO

--Create external table:
CREATE EXTERNAL TABLE tbl_TaxiRides(
 vendor_id VARCHAR(100) COLLATE Latin1_General_BIN2,
 pickup_datetime DATETIME2,
 dropoff_datetime DATETIME2,
 passenger_count INT,
 trip_distance FLOAT,
 fare_amount FLOAT,
 extra FLOAT,
 mta_tax FLOAT,
 tip_amount FLOAT,
 tolls_amount FLOAT,
 improvement_surcharge FLOAT,
 total_amount FLOAT
)
WITH (
 LOCATION = 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = DemoDataSource,
 FILE_FORMAT = DemoFileFormat
);
GO
```

Once external table is created, you can query it just like any other table:
```sql
SELECT TOP 10 *
FROM tbl_TaxiRides
```

Just like OPENROWSET, external tables allow querying multiple files and folders by using wildcards. Schema inference and filepath/filename functions aren't supported with external tables.

## Performance considerations
There's no hard limit in terms of number of files or amount of data that can be queried, but query performance will depend on the amount of data, data format, and complexity of queries and joins.

Collecting statistics on your external data is one of the most important things you can do for query optimization. The more instance knows about your data, the faster it can execute queries. Automatic creation of statistics isn't supported, but you can and should create statistics manually.

### OPENROWSET statistics
Single-column statistics for OPENROWSET path can be created using sp_create_openrowset_statistics 
stored procedure, by passing the select query with a single column as a parameter:
```sql
EXEC sys.sp_create_openrowset_statistics N'
SELECT pickup_datetime
FROM OPENROWSET(
 BULK ''abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/*.parquet'',
 FORMAT = ''parquet'') AS filerows
'
```

By default instance uses 100% of the data provided in the dataset for creating statistics. You can optionally specify sample size as a percentage using TABLESAMPLE options. To create single-column statistics for multiple columns, you should execute stored procedure for each of the columns. You can’t create multi-column statistics for OPENROWSET path.

To update existing statistics, drop them first using sp_drop_openrowset_statistics stored procedure, and then recreate them:
```sql
EXEC sys.sp_drop_openrowset_statistics N'
SELECT pickup_datetime
FROM OPENROWSET(
 BULK ''abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/*.parquet'',
 FORMAT = ''parquet'') AS filerows
'
```

### External table statistics
Syntax for creating stats on external tables resembles the one used for ordinary user tables. To create statistics on a column, provide a name for the statistics object and the name of the column:
```sql
CREATE STATISTICS sVendor
ON tbl_TaxiRides (vendor_id)
WITH FULLSCAN, NORECOMPUTE
```

Provided WITH options are mandatory, and for the sample size allowed options are FULLSCAN and SAMPLE n percent.
To create single-column statistics for multiple columns, execute stored procedure for each of the columns. You can’t create multi-column statistics.

## Next steps

- To learn more about syntax options available with OPENROWSET, see [OPENROWSET T-SQL](https://docs.microsoft.com/sql/t-sql/functions/openrowset-transact-sql).
- For more information about creating external table in SQL Managed Instance, see [CREATE EXTERNAL TABLE](https://docs.microsoft.com/sql/t-sql/statements/create-external-table-transact-sql).
- To learn more about creating external file format, see [CREATE EXTERNAL FILE FORMAT](https://docs.microsoft.com/sql/t-sql/statements/create-external-file-format-transact-sql) 
