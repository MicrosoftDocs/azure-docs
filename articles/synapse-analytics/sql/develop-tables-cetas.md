---
title: CREATE EXTERNAL TABLE AS SELECT (CETAS) in Synapse SQL
description: Using CREATE EXTERNAL TABLE AS SELECT (CETAS) with Synapse SQL
author: filippopovic
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 02/17/2023
ms.author: fipopovi
ms.reviewer: sngun, wiassaf
---

# CETAS with Synapse SQL

You can use CREATE EXTERNAL TABLE AS SELECT (CETAS) in dedicated SQL pool or serverless SQL pool to complete the following tasks:  

- Create an external table
- Export, in parallel, the results of a Transact-SQL SELECT statement to:

  - Hadoop
  - Azure Storage Blob
  - Azure Data Lake Storage Gen2

## CETAS in dedicated SQL pool

For dedicated SQL pool, CETAS usage and syntax, check the [CREATE EXTERNAL TABLE AS SELECT](/sql/t-sql/statements/create-external-table-as-select-transact-sql?view=azure-sqldw-latest&preserve-view=true) article. Additionally, for guidance on CTAS using dedicated SQL pool, see the [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?view=azure-sqldw-latest&preserve-view=true) article.

## CETAS in serverless SQL pool

When using serverless SQL pool, CETAS is used to create an external table and export query results to Azure Storage Blob or Azure Data Lake Storage Gen2.

For complete syntax, refer to [CREATE EXTERNAL TABLE AS SELECT (Transact-SQL)](/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&preserve-view=true). 

## Examples

These examples use CETAS to save total population aggregated by year and state to an aggregated_data folder that is located in the population_ds datasource.

This sample relies on the credential, data source, and external file format created previously. Refer to the [external tables](develop-tables-external-tables.md) document. To save query results to a different folder in the same data source, change the LOCATION argument. 

To save results to a different storage account, create and use a different data source for DATA_SOURCE argument.

> [!NOTE]
> The samples that follow use a public Azure Open Data storage account. It is read-only. To execute these queries, you need to provide the data source for which you have write permissions.

```sql
-- use CETAS to export select statement with OPENROWSET result to  storage
CREATE EXTERNAL TABLE population_by_year_state
WITH (
    LOCATION = 'aggregated_data/',
    DATA_SOURCE = population_ds,  
    FILE_FORMAT = census_file_format
)  
AS
SELECT decennialTime, stateName, SUM(population) AS population
FROM
    OPENROWSET(BULK 'https://azureopendatastorage.dfs.core.windows.net/censusdatacontainer/release/us_population_county/year=*/*.parquet',
    FORMAT='PARQUET') AS [r]
GROUP BY decennialTime, stateName
GO

-- you can query the newly created external table
SELECT * FROM population_by_year_state
```

The following sample uses an external table as the source for CETAS. It relies on the credential, data source, external file format, and external table created previously. Refer to the [external tables](develop-tables-external-tables.md) document.

```sql
-- use CETAS with select from external table
CREATE EXTERNAL TABLE population_by_year_state
WITH (
    LOCATION = 'aggregated_data/',
    DATA_SOURCE = population_ds,  
    FILE_FORMAT = census_file_format
)  
AS
SELECT decennialTime, stateName, SUM(population) AS population
FROM census_external_table
GROUP BY decennialTime, stateName
GO

-- you can query the newly created external table
SELECT * FROM population_by_year_state
```

### General example

In this example we can see example of a template code for writing CETAS with a View as source and using Managed Identity as an authentication.

```sql
CREATE DATABASE [<mydatabase>];
GO

USE [<mydatabase>];
GO

CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<strong password>';

CREATE DATABASE SCOPED CREDENTIAL [WorkspaceIdentity] WITH IDENTITY = 'Managed Identity';
GO

CREATE EXTERNAL FILE FORMAT [ParquetFF] WITH (
    FORMAT_TYPE = PARQUET,
    DATA_COMPRESSION = 'org.apache.hadoop.io.compress.SnappyCodec'
);
GO

CREATE EXTERNAL DATA SOURCE [SynapseSQLwriteable] WITH (
    LOCATION = 'https://<mystoageaccount>.dfs.core.windows.net/<mycontainer>/<mybaseoutputfolderpath>',
    CREDENTIAL = [WorkspaceIdentity]
);
GO

CREATE EXTERNAL TABLE [dbo].[<myexternaltable>] WITH (
        LOCATION = '<myoutputsubfolder>/',
        DATA_SOURCE = [SynapseSQLwriteable],
        FILE_FORMAT = [ParquetFF]
) AS
SELECT * FROM [<myview>];
GO
```

## Supported data types

CETAS can be used to store result sets with following SQL data types:

- binary
- varbinary
- char
- varchar
- nchar
- nvarchar
- smalldate
- date
- datetime
- datetime2
- datetimeoffset
- time
- decimal
- numeric
- float
- real
- bigint
- tinyint
- smallint
- int
- bigint
- bit
- money
- smallmoney
- uniqueidentifier

> [!NOTE]
> LOBs larger than 1MB can't be used with CETAS.

## Next steps

Try querying [Apache Spark for Azure Synapse external tables](develop-storage-files-spark-tables.md).
