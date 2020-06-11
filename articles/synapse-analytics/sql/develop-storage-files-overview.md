---
title: Query storage files using SQL on-demand (preview) within Synapse SQL
description: Describes querying storage files using SQL on-demand (preview) resources within Synapse SQL.
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 04/19/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---
# Query storage files using SQL on-demand (preview) resources within Synapse SQL

SQL on-demand (preview) enables you to query data in your data lake. It offers a T-SQL query surface area that accommodates semi-structured and unstructured data queries.

For querying, the following T-SQL aspects are supported:

- Full [SELECT](/sql/t-sql/queries/select-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) surface area, including majority of SQL functions, operators, and so on.
- CREATE EXTERNAL TABLE AS SELECT ([CETAS](develop-tables-cetas.md)) creates an [external table](develop-tables-external-tables.md) and then exports, in parallel, the results of a Transact-SQL SELECT statement to Azure Storage.

For more information on what is vs. what isn't currently supported, read the [SQL on-demand overview](on-demand-workspace-overview.md) article.

When Azure AD users run queries, the default is for storage accounts to be accessed using the Azure AD pass-through authentication protocol. As such, users will be impersonated and permissions checked at the storage level. You can [control storage access](develop-storage-files-storage-access-control.md) to suit your needs.

## Extensions

To support a smooth experience for in place querying of data that's located in Azure Storage files, SQL on-demand uses the [OPENROWSET](develop-openrowset.md) function with additional capabilities:

- [Query multiple files or folders](#query-multiple-files-or-folders)
- [PARQUET file format](#parquet-file-format)
- [Additional options for working with delimited text (field terminator, row terminator, escape char)](#additional-options-for-working-with-delimited-text)
- [Read a chosen subset of columns](#read-a-chosen-subset-of-columns)
- [Schema inference](#schema-inference)
- [filename function](#filename-function)
- [filepath function](#filepath-function)
- [Work with complex types and nested or repeated data structures](#work-with-complex-types-and-nested-or-repeated-data-structures)

### Query multiple files or folders

To run a T-SQL query over a set of files within a folder or set of folders while treating them as a single entity or rowset, provide a path to a folder or a pattern (using wildcards) over a set of files or folders.

The following rules apply:

- Patterns can appear either in part of a directory path or in a filename.
- Several patterns can appear in the same directory step or file name.
- If there are multiple wildcards, then files within all matching paths will be included in the resulting file set.

```
N'https://myaccount.blob.core.windows.net/myroot/*/mysubfolder/*.csv'
```

Refer to [Query folders and multiple files](query-folders-multiple-csv-files.md) for usage examples.

### PARQUET file format

To query Parquet source data, use FORMAT = 'PARQUET'

```syntaxsql
OPENROWSET
(
    { BULK 'data_file' ,
    { FORMATFILE = 'format_file_path' [ <bulk_options>] } }
)
AS table_alias(column_alias,...n)
<bulk_options> ::=
...
[ , FORMAT = {'CSV' | 'PARQUET'} ]
```

Review the [Query Parquet files](query-parquet-files.md) article for usage examples.

### Additional options for working with delimited text

These additional parameters are introduced for working with CSV (delimited text) files:

```syntaxsql
<bulk_options> ::=
...
[ , FIELDTERMINATOR = 'char' ]
[ , ROWTERMINATOR = 'char' ]
[ , ESCAPE_CHAR = 'char' ]
...
```

- ESCAPE_CHAR = 'char'
Specifies the character in the file that is used to escape itself and all delimiter values in the file. If the escape character is followed by either a value other than itself or any of the delimiter values, the escape character is dropped when reading the value.
The ESCAPE_CHAR parameter will be applied whether the FIELDQUOTE is or isn't enabled. It won't be used to escape the quoting character. The quoting character is escaped with double-quotes in alignment with the Excel CSV behavior.
- FIELDTERMINATOR ='field_terminator'
Specifies the field terminator to be used. The default field terminator is a comma ("**,**")
- ROWTERMINATOR ='row_terminator'
Specifies the row terminator to be used. The default row terminator is a newline character: **\r\n**.

### Read a chosen subset of columns

To specify columns that you want to read, you can provide an optional WITH clause within your OPENROWSET statement.

- If there are CSV data files, to read all the columns, provide column names and their data types. If you want a subset of columns, use ordinal numbers to pick the columns from the originating data files by ordinal. Columns will be bound by the ordinal designation.
- If there are Parquet data files, provide column names that match the column names in the originating data files. Columns will be bound by name.

```syntaxsql
OPENROWSET
...
| BULK 'data_file',
{ FORMATFILE = 'format_file_path' [ <bulk_options>] } }
) AS table_alias(column_alias,...n) | WITH ( {'column_name' 'column_type' [ 'column_ordinal'] })
```

For samples, refer to [Read CSV files without specifying all columns](query-single-csv-file.md#returning-subset-of-columns).

### Schema inference

By omitting the WITH clause from OPENROWSET statement, you can instruct the service to auto detect (infer) the schema from underlying files.

> [!NOTE]
> This currently works only for PARQUET file format.

```sql
OPENROWSET(
BULK N'path_to_file(s)', FORMAT='PARQUET');
```

Make sure [appropriate inferred data types](best-practices-sql-on-demand.md#check-inferred-data-types) are used for optimal performance. 

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

### Work with complex types and nested or repeated data structures

To enable a smooth experience when working with data stored in nested or repeated data types, such as in [Parquet](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md#nested-types) files, SQL on-demand has added the extensions below.

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

To access nested elements from a nested column, such as Struct, use "dot notation" to concatenate field names into the path. Provide the path as column_name in the WITH clause of the OPENROWSET function.

The syntax fragment example is as follows:

```syntaxsql
    OPENROWSET
    (   BULK 'unstructured_data_path' ,
        FORMAT = 'PARQUET' )
    WITH ({'column_name' 'column_type',})
    [AS alias]
    'column_name' ::= '[field_name.] field_name'
```

By default, the OPENROWSET function matches the source field name and path with the column names provided in the WITH clause. Elements contained at different nesting levels within the same source Parquet file can be accessed via the WITH clause.

**Return values**

- Function returns a scalar value, such as int, decimal, and varchar, from the specified element, and on the specified path, for all Parquet types that are not in the Nested Type group.
- If the path points to an element that is of a Nested Type, the function returns a JSON fragment starting from the top element on the specified path. The JSON fragment is of type varchar(8000).
- If the property can't be found at the specified column_name, the function returns an error.
- If the property can't be found at the specified column_path, depending on [Path mode](/sql/relational-databases/json/json-path-expressions-sql-server?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest#PATHMODE), the function returns an error when in strict mode or null when in lax mode.

For query samples, review the Access elements from nested columns section in the [Query Parquet nested types](query-parquet-nested-types.md#access-elements-from-nested-columns) article.

#### Access elements from repeated columns

To access elements from a repeated column, such as an element of an Array or Map, use the [JSON_VALUE](/sql/t-sql/functions/json-value-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) function for every scalar element you need to project and provide:

- Nested or repeated column, as the first parameter
- A [JSON path](/sql/relational-databases/json/json-path-expressions-sql-server?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) that specifies the element or property to access, as a second parameter

To access non-scalar elements from a repeated column, use the [JSON_QUERY](/sql/t-sql/functions/json-query-transact-sql?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) function for every non-scalar element you need to project and provide:

- Nested or repeated column, as the first parameter
- A [JSON path](/sql/relational-databases/json/json-path-expressions-sql-server?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json&view=azure-sqldw-latest) that specifies the element or property to access, as a second parameter

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

## Next steps

For more information on how to query different file types and creating and using views, see the following articles:

- [Query single CSV file](query-single-csv-file.md)
- [Query Parquet files](query-parquet-files.md)
- [Query JSON files](query-json-files.md)
- [Query Parquet nested types](query-parquet-nested-types.md)
- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)
- [Use file metadata in queries](query-specific-files.md)
- [Create and use views](create-use-views.md)
