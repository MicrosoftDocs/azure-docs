---
title: CETAS in Synapse SQL
description: Using CETAS with Synapse SQL
services: synapse-analytics
author: filippopovic
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 04/15/2020
ms.author: fipopovi
ms.reviewer: jrasnick
---

# CETAS with Synapse SQL

In either SQL pool or SQL on-demand (preview), you can use CREATE EXTERNAL TABLE AS SELECT (CETAS) to complete the  following tasks:  

- Create an external table
- Export, in parallel, the results of a Transact-SQL SELECT statement to

  - Hadoop
  - Azure Storage Blob
  - Azure Data Lake Storage Gen2

## CETAS in SQL pool

For SQL pool, CETAS usage and syntax, check the [CREATE EXTERNAL TABLE AS SELECT](/sql/t-sql/statements/create-external-table-as-select-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) article. Additionally, for guidance on CTAS using SQL pool, see the [CREATE TABLE AS SELECT](/sql/t-sql/statements/create-table-as-select-azure-sql-data-warehouse?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) article.

## CETAS in SQL on-demand

When using the SQL on-demand resource, CETAS is used to create an external table and export query results to Azure Storage Blob or Azure Data Lake Storage Gen2.

## Syntax

```syntaxsql
CREATE EXTERNAL TABLE [ [database_name  . [ schema_name ] . ] | schema_name . ] table_name
    WITH (
        LOCATION = 'path_to_folder',  
        DATA_SOURCE = external_data_source_name,  
        FILE_FORMAT = external_file_format_name  
)
    AS <select_statement>  
[;]

<select_statement> ::=  
    [ WITH <common_table_expression> [ ,...n ] ]  
    SELECT <select_criteria>
```

## Arguments

*[ [ *database_name* . [ *schema_name* ] . ] | *schema_name* . ] *table_name**

The one to three-part name of the table to create. For an external table, SQL on-demand stores only the table metadata. No actual data is moved or stored in SQL on-demand.

LOCATION = *'path_to_folder'*

Specifies where to write the results of the SELECT statement on the external data source. The root folder is the data location specified in the external data source. LOCATION must point to a folder and have a trailing /. Example: aggregated_data/

DATA_SOURCE = *external_data_source_name*

Specifies the name of the external data source object that contains the location where the external data will be stored. To create an external data source, use [CREATE EXTERNAL DATA SOURCE (Transact-SQL)](develop-tables-external-tables.md#create-external-data-source).

FILE_FORMAT = *external_file_format_name*

Specifies the name of the external file format object that contains the format for the external data file. To create an external file format, use [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](develop-tables-external-tables.md#create-external-file-format). Only external file formats with FORMAT='PARQUET' are currently supported.

WITH *<common_table_expression>*

Specifies a temporary named result set, known as a common table expression (CTE). For more information, see [WITH common_table_expression (Transact-SQL)](/sql/t-sql/queries/with-common-table-expression-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

SELECT <select_criteria>

Populates the new table with the results from a SELECT statement. *select_criteria* is the body of the SELECT statement that determines which data to copy to the new table. For information about SELECT statements, see [SELECT (Transact-SQL)](/sql/t-sql/queries/select-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest).

> [!NOTE]
> ORDER BY clause in SELECT part of CETAS is not supported.

## Permissions

You need to have permissions to list folder content and write to LOCATION folder for CETAS to work.

## Examples

These examples use CETAS to save total population aggregated by year and state to an aggregated_data folder that is located in the population_ds datasource.

This sample relies on the credential, data source, and external file format created previously. Refer to the [external tables](develop-tables-external-tables.md) document. To save query results to a different folder in the same data source, change the LOCATION argument. 

To save results to a different storage account, create and use a different data source for DATA_SOURCE argument.

> [!NOTE]
> The samples that follow  use a public Azure Open Data storage account. It is read-only. To execute these queries, you need to provide the data source for which you have write permissions.

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
    OPENROWSET(BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=*/*.parquet',
    FORMAT='PARQUET') AS [r]
GROUP BY decennialTime, stateName
GO

-- you can query created external table
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

-- you can query created external table
SELECT * FROM population_by_year_state
```

## Supported data types

CETAS can be used to store result sets with following SQL data types:

- binary
- varbinary
- char
- varchar
- date
- time
- datetime2
- decimal
- numeric
- float
- real
- bigint
- int
- smallint
- tinyint
- bit

> [!NOTE]
> LOBs cannot be used with CETAS.

The following data types cannot be used in SELECT part of CETAS:

- nchar
- nvarchar
- datetime
- smalldatetime
- datetimeoffset
- money
- smallmoney
- uniqueidentifier

## Next steps

You can try querying [Apache Spark for Azure Synapse external tables](develop-storage-files-spark-tables.md).
