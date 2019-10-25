---
title: Using CETAS in SQL Analytics #Required; update as needed page title displayed in search results. Include the brand.
description: #Required; Add article description that is displayed in search results.
services: sql-data-warehouse #Required for articles that deal with a service, we will use sql-data-warehouse for now and bulk update later once we have the  service slug assigned by ACOM.
author: filippopovic #Required; update with your GitHub user alias, with correct capitalization.
ms.service: sql-data-warehouse #Required; we will use sql-data-warehouse for now and bulk update later once the service is added to the approved list.
ms.topic: overview #Required
ms.subservice: design #Required will update once these are established.
ms.date: 10/21/2019 #Update with current date; mm/dd/yyyy format.
ms.author: fipopovi #Required; update with your microsoft alias of author; optional team alias.
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
Specifies where to write the results of the SELECT statement on the external data source. The root folder is the data location specified in the external data source.

DATA_SOURCE = *external_data_source_name*
Specifies the name of the external data source object that contains the location where the external data will be stored. To create an external data source, use [CREATE EXTERNAL DATA SOURCE (Transact-SQL)](development-tables-external-tables.md#create-external-data-source).

FILE_FORMAT = *external_file_format_name*
Specifies the name of the external file format object that contains the format for the external data file. To create an external file format, use [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](development-tables-external-tables.md#create-external-file-format).

WITH *common_table_expression*
Specifies a temporary named result set, known as a common table expression (CTE). For more information, see [WITH common_table_expression (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/queries/with-common-table-expression-transact-sql?view=aps-pdw-2016-au7).

SELECT <select_criteria> Populates the new table with the results from a SELECT statement. *select_criteria* is the body of the SELECT statement that determines which data to copy to the new table. For information about SELECT statements, see [SELECT (Transact-SQL)](https://docs.microsoft.com/en-us/sql/t-sql/queries/select-transact-sql?view=aps-pdw-2016-au7).

### Example

Following example 

+++++++++++++++++++++++++++++++++++++++


## Next steps

