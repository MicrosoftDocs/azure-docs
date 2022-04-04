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
ms.date: 03/08/2022
---

# Data virtualization with Azure SQL Managed Instance (Preview)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Data virtualization with Azure SQL Managed Instance allows you to execute Transact-SQL (T-SQL) queries against data from files stored in Azure Data Lake Storage Gen2 or Azure Blob Storage, and combine it with locally stored relational data using joins. This way you can transparently access external data while keeping it in its original format and location - also known as data virtualization. 

Data virtualization is currently in preview for Azure SQL Managed Instance. 


## Overview

Data virtualization provides two ways of querying external files stored in Azure Data Lake Storage or Azure Blob Storage, intended for different scenarios: 

- OPENROWSET syntax – optimized for ad-hoc querying of files. Typically used to quickly explore the content and the structure of a new set of files.
- External tables – optimized for repetitive querying of files using identical syntax as if data were stored locally in the database. External tables require several preparation steps compared to the OPENROWSET syntax, but allow for more control over data access. External tables are typically used for analytical workloads and reporting.

Parquet and delimited text (CSV) file formats are directly supported. The JSON file format is indirectly supported by specifying the CSV file format where queries return every document as a separate row. It's possible to parse rows further using `JSON_VALUE` and `OPENJSON`. 

## Getting started 

Use Transact-SQL (T-SQL) to explicitly enable the data virtualization feature before using it. 

To enable data virtualization capabilities, run the following command: 


```sql
exec sp_configure 'polybase_enabled', 1;
go
reconfigure;
go
```

Provide the location of the file(s) you intend to query using the location prefix corresponding to the type of external source and endpoint/protocol, such as the following examples: 

```sql
--Blob Storage endpoint
abs://<container>@<storage_account>.blob.core.windows.net/<path>/<file_name>.parquet

--Data Lake endpoint
adls://<container>@<storage_account>.dfs.core.windows.net/<path>/<file_name>.parquet

```

> [!IMPORTANT]
> Using the generic `https://` prefix is discouraged and will be disabled in the future. Be sure to use endpoint-specific prefixes to avoid interruptions.



If you're new to data virtualization and want to quickly test functionality, start by querying publicly available data sets available in [Azure Open Datasets](../../open-datasets/dataset-catalog.md), like the [Bing COVID-19 dataset](../../open-datasets/dataset-bing-covid-19.md?tabs=azure-storage) allowing anonymous access. 

Use the following endpoints to query the Bing COVID-19 data sets: 

- Parquet: `abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/bing_covid-19_data.parquet`
- CSV: `abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/bing_covid-19_data.csv`

Once your public data set queries are executing successfully, consider switching to private data sets that require configuring specific rights and/or firewall rules. 

To access a private location, use a Shared Access Signature (SAS) with proper access permissions and validity period to authenticate to the storage account. Create a database-scoped credential using the SAS key, rather than providing it directly in each query. The credential is then used as a parameter to access the external data source. 



## External data source

External data sources are abstractions intended to make it easier to manage file locations across multiple queries, and to reference authentication parameters that are encapsulated within database-scoped credentials. 

When accessing a public location, add the file location when querying the external data source: 


```sql
CREATE EXTERNAL DATA SOURCE DemoPublicExternalDataSource
WITH (
	LOCATION = 'abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest'
--  LOCATION = 'abs://<container>@<storage_account>.blob.core.windows.net/<path>' 
)
```

When accessing a private location, include the file path and credential when querying the external data source: 


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

The [OPENROWSET](/sql/t-sql/functions/openrowset-transact-sql) syntax enables instant ad-hoc querying while only creating the minimal number of database objects necessary.
`OPENROWSET` only requires creating the external data source (and possibly the credential) as opposed to the external table approach which requires an external file format and the external table itself. 

The `DATA_SOURCE` parameter value is automatically prepended to the BULK parameter to form the full path to the file. 

When using `OPENROWSET` provide the format of the file, such as the following example, which queries a single file: 

```sql
SELECT TOP 10 *
FROM OPENROWSET(
 BULK 'bing_covid-19_data.parquet',
 DATA_SOURCE = 'DemoPublicExternalDataSource',
 FORMAT = 'parquet'
) AS filerows
```

### Querying multiple files and folders

The `OPENROWSET` command also allows querying multiple files or folders by using wildcards in the BULK path.

The following example uses the [NYC yellow taxi trip records open data set](../../open-datasets/dataset-taxi-yellow.md):

```sql
--Query all files with .parquet extension in folders matching name pattern:
SELECT TOP 10 *
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',--You need to create the data source first
 FORMAT = 'parquet'
) AS filerows
 ```

When querying multiple files or folders, all files accessed with the single `OPENROWSET` must have the same structure (such as the same number of columns and data types).  Folders can't be traversed recursively.

### Schema inference

Automatic schema inference helps you quickly write queries and explore data when you don't know file schemas. Schema inference only works with parquet format files. 

While convenient, the cost is that inferred data types may be larger than the actual data types. This can lead to poor query performance since there may not be enough information in the source files to ensure the appropriate data type is used. For example, parquet files don't contain metadata about maximum character column length, so the instance infers it as varchar(8000). 


Use the [sp_describe_first_results_set](/sql/relational-databases/system-stored-procedures/sp-describe-first-result-set-transact-sql) stored procedure to check the resulting data types of your query, such as the following example: 

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

Once you know the data types, you can then specify them using the `WITH` clause to improve performance:

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

Since the schema of CSV files can't be automatically determined, explicitly specify columns using the `WITH` clause: 


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


When querying multiple files or folders, you can use `Filepath` and `Filename` functions to read file metadata and get part of the path or full path and name of the file that the row in the result set originates from:


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

When called without a parameter, the `Filepath` function returns the file path that the row originates from. When `DATA_SOURCE` is used in `OPENROWSET`, it returns the path relative to the `DATA_SOURCE`, otherwise it returns full file path.

When called with a parameter, it returns part of the path that matches the wildcard on the position specified in the parameter. For example, parameter value 1 would return part of the path that matches the first wildcard.

The `Filepath` function can also be used for filtering and aggregating rows: 

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

You can create and use views to wrap OPENROWSET queries so that you can easily reuse the underlying query: 

```sql
CREATE VIEW TaxiRides AS
SELECT *
FROM OPENROWSET(
 BULK 'taxi/year=*/month=*/*.parquet',
 DATA_SOURCE = 'NYCTaxiDemoDataSource',
 FORMAT = 'parquet'
) AS filerows
```

It's also convenient to add columns with the file location data to a view using the `Filepath` function for easier and more performant filtering. Using views can reduce the number of files and the amount of data the query on top of the view needs to read and process when filtered by any of those columns:


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

Views also enable reporting and analytic tools like Power BI to consume results of `OPENROWSET`.

## External tables

External tables encapsulate access to files making the querying experience almost identical to querying local relational data stored in user tables. Creating an external table requires the external data source and external file format objects to exist:

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

Once the external table is created, you can query it just like any other table:

```sql
SELECT TOP 10 *
FROM tbl_TaxiRides
```

Just like `OPENROWSET`, external tables allow querying multiple files and folders by using wildcards. Schema inference and filepath/filename functions aren't supported with external tables.

## Performance considerations

There's no hard limit in terms of number of files or amount of data that can be queried, but query performance depends on the amount of data, data format, and complexity of queries and joins.

Collecting statistics on your external data is one of the most important things you can do for query optimization. The more the instance knows about your data, the faster it can execute queries. The SQL engine query optimizer is a cost-based optimizer. It compares the cost of various query plans, and then chooses the plan with the lowest cost. In most cases, it chooses the plan that will execute the fastest.

### Automatic creation of statistics

Managed Instance analyzes incoming user queries for missing statistics. If statistics are missing, the query optimizer automatically creates statistics on individual columns in the query predicate or join condition to improve cardinality estimates for the query plan. Automatic creation of statistics is done synchronously so you may incur slightly degraded query performance if your columns are missing statistics. The time to create statistics for a single column depends on the size of the files targeted.

### OPENROWSET manual statistics

Single-column statistics for the `OPENROWSET` path can be created using the `sp_create_openrowset_statistics` stored procedure, by passing the select query with a single column as a parameter:

```sql
EXEC sys.sp_create_openrowset_statistics N'
SELECT pickup_datetime
FROM OPENROWSET(
 BULK ''abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/*.parquet'',
 FORMAT = ''parquet'') AS filerows
'
```

By default, the  instance uses 100% of the data provided in the dataset to create statistics. You can optionally specify the sample size as a percentage using the `TABLESAMPLE` options. To create single-column statistics for multiple columns, execute the stored procedure for each of the columns. You can't create multi-column statistics for the `OPENROWSET` path.

To update existing statistics, drop them first using the `sp_drop_openrowset_statistics` stored procedure, and then recreate them using the `sp_create_openrowset_statistics`: 

```sql
EXEC sys.sp_drop_openrowset_statistics N'
SELECT pickup_datetime
FROM OPENROWSET(
 BULK ''abs://public@pandemicdatalake.blob.core.windows.net/curated/covid-19/bing_covid-19_data/latest/*.parquet'',
 FORMAT = ''parquet'') AS filerows
'
```

### External table manual statistics

The syntax for creating statistics on external tables resembles the one used for ordinary user tables. To create statistics on a column, provide a name for the statistics object and the name of the column:

```sql
CREATE STATISTICS sVendor
ON tbl_TaxiRides (vendor_id)
WITH FULLSCAN, NORECOMPUTE
```

The `WITH` options are mandatory, and for the sample size, the allowed options are `FULLSCAN` and `SAMPLE n` percent. To create single-column statistics for multiple columns, execute the stored procedure for each of the columns. Multi-column statistics are not supported.

## Troubleshooting

Issues with query execution are typically caused by managed instance not being able to access file location. The related error messages may report insufficient access rights, non-existing location or file path, file being used by another process, or that directory cannot be listed. In most cases this indicates that access to files is blocked by network traffic control policies or due to lack of access rights. This is what should be checked:

- Wrong or mistyped location path.
- SAS key validity: it could be expired i.e. out of its validity period, containing a typo, starting with a question mark.
- SAS key persmissions allowed: Read at minimum, and List if wildcards are used
- Blocked inbound traffic on the storage account. Check [Managing virtual network rules for Azure Storage](../../storage/common/storage-network-security.md?tabs=azure-portal#managing-virtual-network-rules) for more details and make sure that access from managed instance VNet is allowed.
- Outbound traffic blocked on the managed instance using [storage endpoint policy](service-endpoint-policies-configure.md#configure-policies). Allow outbound traffic to the storage account.

## Next steps

- To learn more about syntax options available with OPENROWSET, see [OPENROWSET T-SQL](/sql/t-sql/functions/openrowset-transact-sql).
- For more information about creating external table in SQL Managed Instance, see [CREATE EXTERNAL TABLE](/sql/t-sql/statements/create-external-table-transact-sql).
- To learn more about creating external file format, see [CREATE EXTERNAL FILE FORMAT](/sql/t-sql/statements/create-external-file-format-transact-sql)