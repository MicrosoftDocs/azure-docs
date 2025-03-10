---
title: Query data storage using serverless SQL pool 
description: Learn how to query Azure storage using the serverless SQL pool resource within Azure Synapse Analytics.
services: synapse analytics
author: azaricstefan
ms.service: azure-synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 01/23/2025
ms.author: stefanazaric
ms.reviewer: whhender 
---

# Query storage files using serverless SQL pool

Serverless SQL pool allows you to query data in your data lake. It offers a Transact-SQL (T-SQL) query surface area that accommodates semi-structured and unstructured data queries. For querying, the following T-SQL aspects are supported:

- Full [SELECT](/sql/t-sql/queries/select-transact-sql?view=azure-sqldw-latest&preserve-view=true) surface area, including most [SQL functions and operators](overview-features.md).
- [CREATE EXTERNAL TABLE AS SELECT (CETAS)](develop-tables-cetas.md) creates an [external table](develop-tables-external-tables.md) and then exports, in parallel, the results of a T-SQL SELECT statement to Azure Storage.

For more information on what is or isn't currently supported, read the [serverless SQL pool overview](on-demand-workspace-overview.md), or the following articles:
- [Develop storage access](develop-storage-files-overview.md) where you can use [External tables](develop-tables-external-tables.md) and the [OPENROWSET](develop-openrowset.md) function to read data from storage.
- [Control storage access](develop-storage-files-storage-access-control.md) where you can learn how to enable Synapse SQL to access storage using SAS authentication or the Managed Identity of the workspace.

## Overview

To support a smooth experience for in-place querying of data that's located in Azure Storage files, serverless SQL pool uses the [OPENROWSET](develop-openrowset.md) function with more capabilities:

- [Query PARQUET files](#query-parquet-files)
- [Query CSV files and delimited text (field terminator, row terminator, escape char)](#query-csv-files)
- [Query DELTA LAKE format](#query-delta-lake-format)
- [Read a chosen subset of columns](#read-a-chosen-subset-of-columns)
- [Schema inference](#schema-inference)
- [Query multiple files or folders](#query-multiple-files-or-folders)
- [Filename function](#filename-function)
- [Filepath function](#filepath-function)
- [Work with complex types and nested or repeated data structures](#work-with-complex-types-and-nested-or-repeated-data-structures)

## Query PARQUET files

To query Parquet source data, use `FORMAT = 'PARQUET'`:

```syntaxsql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.parquet', FORMAT = 'PARQUET') 
WITH (C1 int, C2 varchar(20), C3 varchar(max)) as rows
```

For usage examples, see [Query Parquet files](query-parquet-files.md).

## Query CSV files

To query CSV source data, use `FORMAT = 'CSV'`. You can specify schema of the CSV file as part of the `OPENROWSET` function when you query CSV files:

```syntaxsql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.csv', FORMAT = 'CSV', PARSER_VERSION='2.0') 
WITH (C1 int, C2 varchar(20), C3 varchar(max)) as rows
```

There are some extra options that can be used to adjust parsing rules to custom CSV format:
- `ESCAPE_CHAR = 'char'`
    Specifies the character in the file that's used to escape itself and all delimiter values in the file. If the escape character is followed by a value other than itself, or any of the delimiter values, the escape character is dropped when reading the value.
    The `ESCAPE_CHAR` parameter is applied whether the `FIELDQUOTE` is or isn't enabled. It isn't used to escape the quoting character. The quoting character must be escaped with another quoting character. Quoting character can appear within column value only if value is encapsulated with quoting characters.
- `FIELDTERMINATOR ='field_terminator'`
    Specifies the field terminator to be used. The default field terminator is a comma (`,`).
- `ROWTERMINATOR ='row_terminator'`
    Specifies the row terminator to be used. The default row terminator is a newline character (`\r\n`).

## Query DELTA LAKE format

To query Delta Lake source data, use `FORMAT = 'DELTA'` and reference the root folder containing your Delta Lake files.

```syntaxsql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder', FORMAT = 'DELTA') 
WITH (C1 int, C2 varchar(20), C3 varchar(max)) as rows
```

The root folder must contain a subfolder called `_delta_log`. For usage examples, see [Query Delta Lake (v1) files](query-delta-lake-format.md).

## File schema

SQL language in Synapse SQL allows you to define schema of the file as part of the `OPENROWSET` function and to read all or subset of columns, or it tries to automatically determine column types from the file using schema inference.

### Read a chosen subset of columns

To specify columns that you want to read, you can provide an optional `WITH` clause within your `OPENROWSET` statement.

- If there are CSV data files, provide column names and their data types to read all the columns. If you want a subset of columns, use ordinal numbers to pick the columns from the originating data files by ordinal. Columns are bound by the ordinal designation.
- If there are Parquet data files, provide column names that match the column names in the originating data files. Columns are bound by name.

```sql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.parquet', FORMAT = 'PARQUET') 
WITH (
      C1 int, 
      C2 varchar(20),
      C3 varchar(max)
) as rows;
```

For every column, you need to specify column name and type in `WITH` clause. For samples, see [Read CSV files without specifying all columns](query-single-csv-file.md#return-a-subset-of-columns).

## Schema inference

By omitting the `WITH` clause from the `OPENROWSET` statement, you can instruct the service to auto detect (infer) the schema from underlying files.

```syntaxsql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/mycontainer/mysubfolder/data.parquet', FORMAT = 'PARQUET') 
```

Make sure [appropriate inferred data types](./best-practices-serverless-sql-pool.md#check-inferred-data-types) are used for optimal performance.

## Query multiple files or folders

To run a T-SQL query over a set of files within a folder or set of folders while treating them as a single entity or rowset, provide a path to a folder or a pattern (using wildcards) over a set of files or folders.

The following rules apply:

- Patterns can appear either in part of a directory path or in a filename.
- Several patterns can appear in the same directory step or file name.
- If there are multiple wildcards, then files within all matching paths are included in the resulting file set.

```syntaxsql
SELECT * FROM
OPENROWSET( BULK N'https://myaccount.dfs.core.windows.net/myroot/*/mysubfolder/*.parquet', FORMAT = 'PARQUET' ) as rows
```

For usage examples, see [Query folders and multiple files](query-folders-multiple-csv-files.md).

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

Return data type is *nvarchar(1024)*. For optimal performance, always cast the result of the filepath function to appropriate data type. If you use character data type, make sure appropriate length is used.

## Work with complex types and nested or repeated data structures

To enable a smooth experience with data stored in nested or repeated data types, such as in [Parquet](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md#nested-types) files, serverless SQL pool has added the following extensions.

#### Project nested or repeated data

To project data, run a `SELECT` statement over the Parquet file that contains columns of nested data types. On output, nested values are serialized into JSON and returned as a *varchar(8000)* SQL data type.

```sql
    SELECT * FROM
    OPENROWSET
    (   BULK 'unstructured_data_path' ,
        FORMAT = 'PARQUET' )
    [AS alias]
```

For more information, see the *Project nested or repeated data* section of the [Query Parquet nested types](query-parquet-nested-types.md#project-nested-or-repeated-data) article.

#### Access elements from nested columns

To access nested elements from a nested column, such as Struct, use *dot notation* to concatenate field names into the path. Provide the path as `column_name` in the `WITH` clause of the `OPENROWSET` function.

The syntax fragment example is as follows:

```syntaxsql
    OPENROWSET
    (   BULK 'unstructured_data_path' ,
        FORMAT = 'PARQUET' )
    WITH ('column_name' 'column_type')
    [AS alias]
    'column_name' ::= '[field_name.] field_name'
```

By default, the `OPENROWSET` function matches the source field name and path with the column names provided in the `WITH` clause. Elements contained at different nesting levels within the same source Parquet file can be accessed using the `WITH` clause.

**Return values**

- Function returns a scalar value, such as `int`, `decimal`, and `varchar`, from the specified element, and on the specified path, for all Parquet types that aren't in the *Nested Type* group.
- If the path points to an element that is of a *Nested Type*, the function returns a JSON fragment starting from the top element on the specified path. The JSON fragment is of type *varchar(8000)*.
- If the property can't be found at the specified `column_name`, the function returns an error.
- If the property can't be found at the specified `column_path`, depending on [Path mode](/sql/relational-databases/json/json-path-expressions-sql-server?view=azure-sqldw-latest&preserve-view=true#PATHMODE), the function returns an error when in strict mode or null when in lax mode.

For query samples, see the *Read properties from nested object columns* section in the [Query Parquet nested types](query-parquet-nested-types.md#read-properties-from-nested-object-columns) article.

#### Access elements from repeated columns

To access elements from a repeated column, such as an element of an array or map, use the [JSON_VALUE](/sql/t-sql/functions/json-value-transact-sql?view=azure-sqldw-latest&preserve-view=true) function for every scalar element you need to project and provide:

- Nested or repeated column, as the first parameter
- A [JSON path](/sql/relational-databases/json/json-path-expressions-sql-server?view=azure-sqldw-latest&preserve-view=true) that specifies the element or property to access, as a second parameter

To access nonscalar elements from a repeated column, use the [JSON_QUERY](/sql/t-sql/functions/json-query-transact-sql?view=azure-sqldw-latest&preserve-view=true) function for every nonscalar element you need to project and provide:

- Nested or repeated column, as the first parameter
- A [JSON path](/sql/relational-databases/json/json-path-expressions-sql-server?view=azure-sqldw-latest&preserve-view=true) that specifies the element or property to access, as a second parameter

See the following syntax fragment:

```syntaxsql
    SELECT
       JSON_VALUE (column_name, path_to_sub_element),
       JSON_QUERY (column_name [ , path_to_sub_element ])
    FROM
    OPENROWSET
    (   BULK 'unstructured_data_path' ,
        FORMAT = 'PARQUET' )
    [AS alias]
```

You can find query samples for accessing elements from repeated columns in the [Query Parquet nested types](query-parquet-nested-types.md#access-elements-from-repeated-columns) article.

## Related content

For more information on how to query different file types, and to create and use views, see the following articles:

- [Query CSV files](query-single-csv-file.md)
- [Query Parquet files](query-parquet-files.md)
- [Query JSON files](query-json-files.md)
- [Query nested values](query-parquet-nested-types.md)
- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)
- [Use file metadata in queries](query-specific-files.md)
- [Create and use views](create-use-views.md)
