---
title: Using CETAS in SQL Analytics
description: Using CETAS in SQL Analytics
services: sql-data-warehouse
author: filippopovic
ms.service: sql-data-warehouse
ms.topic: overview
ms.subservice: design
ms.date: 10/21/2019
ms.author: fipopovi
ms.reviewer: jrasnick
---

# Using CETAS in SQL Analytics
CETAS (CREATE EXTERNAL TABLE AS SELECT) creates an external table and then exports, in parallel, the results of a Transact-SQL SELECT statement to Hadoop, Azure Storage Blob or Azure Date Lake Store Gen2.



## CETAS in SQL Analytics pool

For usage and syntax in SQL Analytics pool, please check [CREATE EXTERNAL TABLE AS SELECT](/sql/t-sql/statements/create-external-table-as-select-transact-sql).



## CETAS in SQL Analytics on-demand

Use CETAS to create external table and export results of query to Azure Storage Blob or Azure Data Lake Store Gen2.

### Syntax

```
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

#### Arguments

[ [ *database_name* . [ *schema_name* ] . ] | *schema_name* . ] *table_name*
The one to three-part name of the table to create. For an external table, SQL Analytics on-demand stores only the table metadata. No actual data is moved or stored in SQL Analytics on-demand.

LOCATION = 'path_to_folder'
Specifies where to write the results of the SELECT statement on the external data source. The root folder is the data location specified in the external data source. LOCATION must point to folder and have trailing /. Example: aggregated_data/

DATA_SOURCE = *external_data_source_name*
Specifies the name of the external data source object that contains the location where the external data will be stored. To create an external data source, use [CREATE EXTERNAL DATA SOURCE (Transact-SQL)](development-tables-external-tables.md#create-external-data-source).

FILE_FORMAT = *external_file_format_name*
Specifies the name of the external file format object that contains the format for the external data file. To create an external file format, use [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](development-tables-external-tables.md#create-external-file-format). Only external file formats with FORMAT='PARQUET' are supported at this moment.

WITH *common_table_expression*
Specifies a temporary named result set, known as a common table expression (CTE). For more information, see [WITH common_table_expression (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/queries/with-common-table-expression-transact-sql?view=aps-pdw-2016-au7).

SELECT <select_criteria> Populates the new table with the results from a SELECT statement. *select_criteria* is the body of the SELECT statement that determines which data to copy to the new table. For information about SELECT statements, see [SELECT (Transact-SQL)](https://docs.microsoft.com/sql/t-sql/queries/select-transact-sql?view=aps-pdw-2016-au7).

### Permissions

You need to have permissions to list folder content and write to LOCATION folder for CETAS to work. 

### Examples

Following examples uses CETAS to save total population aggregated by year and state to aggregated_data folder in population_ds datasource. 

This sample relies on credential, data source, and external file format previously created in [external tables](development-tables-external-tables.md) document. If you want to save,  result of query to different folder in the same data source, change LOCATION argument. If you want to save results to different storage account, create and use different data source for DATA_SOURCE argument.

> [!NOTE]
> Samples below use public Azure Open Data storage account. It is read-only and you need to provide your data source you have write permissions for to be able to execute these queries.

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
ORDER BY decennialTime, stateName
GO

-- you can query created external table
SELECT * FROM population_by_year_state
```

Following sample uses external table as source for CETAS. It relies on credential, data source, external file format, and external table previously created in [external tables](development-tables-external-tables.md) document. 

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
ORDER BY decennialTime, stateName
GO

-- you can query created external table
SELECT * FROM population_by_year_state
```




## Next steps

You can try querying [Spark tables](development-storage-files-spark-tables.md).