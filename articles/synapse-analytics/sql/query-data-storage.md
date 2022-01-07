---
title: Query data storage with serverless SQL pool 
description: This article describes how to query Azure storage using the serverless SQL pool resource within Azure Synapse Analytics.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: sql
ms.date: 04/15/2020
ms.author: stefanazaric
ms.reviewer: sngun 
---
# Query storage files with serverless SQL pool in Azure Synapse Analytics

Serverless SQL pool enables you to query data in your data lake. It offers a T-SQL query surface area that accommodates semi-structured and unstructured data queries. For querying, the following T-SQL aspects are supported:

- Full [SELECT](/sql/t-sql/queries/select-transact-sql?view=azure-sqldw-latest&preserve-view=true) surface area, including majority of [SQL functions and operators](overview-features.md).
- CREATE EXTERNAL TABLE AS SELECT ([CETAS](develop-tables-cetas.md)) creates an [external table](develop-tables-external-tables.md) and then exports, in parallel, the results of a Transact-SQL SELECT statement to Azure Storage.

For more information on what is vs. what isn't currently supported, read the [serverless SQL pool overview](on-demand-workspace-overview.md) article, or the following articles:
- [Develop storage access](develop-storage-files-overview.md) where you can learn how to use [External table](develop-tables-external-tables.md) and [OPENROWSET](develop-openrowset.md) function to read data from storage.
- [Control storage access](develop-storage-files-storage-access-control.md) where you can learn how to enable Synapse SQL to access storage using SAS authentication, or Managed Identity of the workspace.

## Overview

To support a smooth experience for in place querying of data that's located in Azure Storage files, serverless SQL pool uses the [OPENROWSET](develop-openrowset.md) function with additional capabilities:

- [Query multiple files or folders](#query-multiple-files-or-folders)
- [PARQUET file format](#query-parquet-files)
- [Query CSV and delimited text (field terminator, row terminator, escape char)](#query-csv-files)
- [DELTA LAKE format](#query-delta-lake-format)
- [Read a chosen subset of columns](#read-a-chosen-subset-of-columns)
- [Schema inference](#schema-inference)
- [filename function](#filename-function)
- [filepath function](#filepath-function)
- [Work with complex types and nested or repeated data structures](#work-with-complex-types-and-nested-or-repeated-data-structures)

## Query PARQUET files

To query Parquet source data, use FORMAT = 'PARQUET':

```syntaxsql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.parquet', FORMAT = 'PARQUET') 
WITH (C1 int, C2 varchar(20), C3 varchar(max)) as rows
```

Review the [Query Parquet files](query-parquet-files.md) article for usage examples.

## Query CSV files

To query CSV source data, use FORMAT = 'CSV'. You can specify schema of the CSV file as part of `OPENROWSET` function when you query CSV files:

```sql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.csv', FORMAT = 'CSV', PARSER_VERSION='2.0') 
WITH (C1 int, C2 varchar(20), C3 varchar(max)) as rows
```

There are some additional options that can be used to adjust parsing rules to custom CSv format:
- ESCAPE_CHAR = 'char'
Specifies the character in the file that is used to escape itself and all delimiter values in the file. If the escape character is followed by a value other than itself, or any of the delimiter values, the escape character is dropped when reading the value.
The ESCAPE_CHAR parameter will be applied whether the FIELDQUOTE is or isn't enabled. It won't be used to escape the quoting character. The quoting character must be escaped with another quoting character. Quoting character can appear within column value only if value is encapsulated with quoting characters.
- FIELDTERMINATOR ='field_terminator'
Specifies the field terminator to be used. The default field terminator is a comma ("**,**")
- ROWTERMINATOR ='row_terminator'
Specifies the row terminator to be used. The default row terminator is a newline character: **\r\n**.


## Query DELTA LAKE format

To query Delta Lake source data, use FORMAT = 'DELTA' and reference the root folder containing your Delta Lake files.

```syntaxsql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder', FORMAT = 'DELTA') 
WITH (C1 int, C2 varchar(20), C3 varchar(max)) as rows
```

The root folder must contain a subfolder called `_delta_log`. 
Review the [query Delta Lake format](query-delta-lake-format.md) article for usage examples.

## File schema

SQL language in Synapse SQL enables you to define schema of the file as part of `OPENROWSET` function and read all or subset of columns, or it tries to automatically determine column types from the file using schema inference.

### Read a chosen subset of columns

To specify columns that you want to read, you can provide an optional WITH clause within your `OPENROWSET` statement.

- If there are CSV data files, to read all the columns, provide column names and their data types. If you want a subset of columns, use ordinal numbers to pick the columns from the originating data files by ordinal. Columns will be bound by the ordinal designation.
- If there are Parquet data files, provide column names that match the column names in the originating data files. Columns will be bound by name.

```sql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.parquet', FORMAT = 'PARQUET') 
WITH (
      C1 int, 
      C2 varchar(20),
      C3 varchar(max)
) as rows
```

For every column, you need to specify column name and type in `WITH` clause.
For samples, refer to [Read CSV files without specifying all columns](query-single-csv-file.md#return-a-subset-of-columns).

## Schema inference

By omitting the WITH clause from the `OPENROWSET` statement, you can instruct the service to auto detect (infer) the schema from underlying files.

```sql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.parquet', FORMAT = 'PARQUET') 
```

Make sure [appropriate inferred data types](./best-practices-serverless-sql-pool.md#check-inferred-data-types) are used for optimal performance. 

## Query multiple files or folders

To run a T-SQL query over a set of files within a folder or set of folders while treating them as a single entity or rowset, provide a path to a folder or a pattern (using wildcards) over a set of files or folders.

The following rules apply:

- Patterns can appear either in part of a directory path or in a filename.
- Several patterns can appear in the same directory step or file name.
- If there are multiple wildcards, then files within all matching paths will be included in the resulting file set.

```sql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/myroot/*/mysubfolder/*.parquet', FORMAT = 'PARQUET' ) as rows
```

Refer to [Query folders and multiple files](query-folders-multiple-csv-files.md) for usage examples.

## File metadata functions

### Filename function

This function returns the file name that the row originates from. 

To query specific files, read the Filename section in the [Query specific files](query-specific-files.md#filename) article.

Return data type is nvarchar(1024). For optimal performance, always cast result of filename function to appropriate data type. If you use character data type, make sure appropriate length is used.

### Filepath function

This function returns a full path or a part of path:

- When called without parameter, returns the full file path that a row originates from.
- When called with parameter, it returns part of path that matches the wildcard on position specified in the parameter. For example, parameter value 1 would return part of path that matches the first wildcard.

For additional information, read the Filepath section of the [Query specific files](query-specific-files.md#filepath) article.

Return data type is nvarchar(1024). For optimal performance, always cast result of filepath function to appropriate data type. If you use character data type, make sure appropriate length is used.

## Work with complex types and nested or repeated data structures

To enable a smooth experience with data stored in nested or repeated data types, such as in [Parquet](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md#nested-types) files, serverless SQL pool has added the extensions that follow.

#### Project nested or repeated data

To project data, run a SELECT statement over the Parquet file that contains columns of nested data types. On output, nested values will be serialized into JSON and returned as a varchar(8000) SQL data type.

```sql
    SELECT * FROM
    OPENROWSET
    (   BULK 'unstructured_data_path' ,
        FORMAT = 'PARQUET' )
    [AS alias]
```

For more detailed information, refer to the Project nested or repeated data section of the [Query Parquet nested types](query-parquet-nested-types.md#project-nested-or-repeated-data) article.

#### Access elements from nested columns

To access nested elements from a nested column, such as Struct, use "dot notation" to concatenate field names into the path. Provide the path as column_name in the WITH clause of the `OPENROWSET` function.

The syntax fragment example is as follows:

```syntaxsql
    OPENROWSET
    (   BULK 'unstructured_data_path' ,
        FORMAT = 'PARQUET' )
    WITH ({'column_name' 'column_type',})
    [AS alias]
    'column_name' ::= '[field_name.] field_name'
```

By default, the `OPENROWSET` function matches the source field name and path with the column names provided in the WITH clause. Elements contained at different nesting levels within the same source Parquet file can be accessed via the WITH clause.

**Return values**

- Function returns a scalar value, such as int, decimal, and varchar, from the specified element, and on the specified path, for all Parquet types that aren't in the Nested Type group.
- If the path points to an element that is of a Nested Type, the function returns a JSON fragment starting from the top element on the specified path. The JSON fragment is of type varchar(8000).
- If the property can't be found at the specified column_name, the function returns an error.
- If the property can't be found at the specified column_path, depending on [Path mode](/sql/relational-databases/json/json-path-expressions-sql-server?view=azure-sqldw-latest&preserve-view=true#PATHMODE), the function returns an error when in strict mode or null when in lax mode.

For query samples, review the Access elements from nested columns section in the [Query Parquet nested types](query-parquet-nested-types.md#read-properties-from-nested-object-columns) article.

#### Access elements from repeated columns

To access elements from a repeated column, such as an element of an Array or Map, use the [JSON_VALUE](/sql/t-sql/functions/json-value-transact-sql?view=azure-sqldw-latest&preserve-view=true) function for every scalar element you need to project and provide:

- Nested or repeated column, as the first parameter
- A [JSON path](/sql/relational-databases/json/json-path-expressions-sql-server?view=azure-sqldw-latest&preserve-view=true) that specifies the element or property to access, as a second parameter

To access non-scalar elements from a repeated column, use the [JSON_QUERY](/sql/t-sql/functions/json-query-transact-sql?view=azure-sqldw-latest&preserve-view=true) function for every non-scalar element you need to project and provide:

- Nested or repeated column, as the first parameter
- A [JSON path](/sql/relational-databases/json/json-path-expressions-sql-server?view=azure-sqldw-latest&preserve-view=true) that specifies the element or property to access, as a second parameter

See syntax fragment below:

```syntaxsql
    SELECT
       { JSON_VALUE (column_name, path_to_sub_element), }
       { JSON_QUERY (column_name [ , path_to_sub_element ]), )
    FROM
    OPENROWSET
    (   BULK 'unstructured_data_path' ,
        FORMAT = 'PARQUET' )
    [AS alias]
```

You can find query samples for accessing elements from repeated columns in the [Query Parquet nested types](query-parquet-nested-types.md#access-elements-from-repeated-columns) article.

## Query samples

You can learn more about querying various types of data using the sample queries.

### Tools

The tools you need to issue queries:
    - Azure Synapse Studio 
    - Azure Data Studio
    - SQL Server Management Studio

### Demo setup

Your first step is to **create a database** where you'll execute the queries. Then you'll initialize the objects by executing [setup script](https://github.com/Azure-Samples/Synapse/blob/master/SQL/Samples/LdwSample/SampleDB.sql) on that database. 

This setup script will create the data sources, database scoped credentials, and external file formats that are used to read data in these samples.

> [!NOTE]
> Databases are only used for viewing metadata, not for actual data.  Write down the database name that you use, you will need it later on.

```sql
CREATE DATABASE mydbname;
```

### Provided demo data

Demo data contains the following data sets:

- NYC Taxi - Yellow Taxi Trip Records - part of public NYC data set in CSV and Parquet format
- Population data set in CSV format
- Sample Parquet files with nested columns
- Books in JSON format

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


## Next steps

For more information on how to query different file types, and to create and use views, see the following articles:

- [Query CSV files](query-single-csv-file.md)
- [Query Parquet files](query-parquet-files.md)
- [Query JSON files](query-json-files.md)
- [Query nested values](query-parquet-nested-types.md)
- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)
- [Use file metadata in queries](query-specific-files.md)
- [Create and use views](create-use-views.md)