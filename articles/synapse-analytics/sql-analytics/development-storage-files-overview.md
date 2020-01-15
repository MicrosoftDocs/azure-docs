---
title: Querying storage files
description: Describes querying storage files using SQL Analytics on-demand.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 10/21/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Querying storage files

SQL Analytics on-demand enables you to query data in your data lake. It offers a T-SQL querying surface area, which is slightly enhanced/extended in some aspects to accommodate for experiences around querying of semi-structured and unstructured data.

For querying, the following T-SQL aspects are supported:

- Full [SELECT](https://docs.microsoft.com/sql/t-sql/queries/select-transact-sql?view=sql-server-2017) surface area, including majority of SQL functions, operators, etc.
- CREATE EXTERNAL TABLE AS SELECT ([CETAS](development-tables-cetas.md)) creates an [external table](development-tables-external-tables.md) and then exports, in parallel, the results of a Transact-SQL SELECT statement to Azure Storage.

For more information on what is supported and what is not, check the [SQL Analytics on-demand overview](on-demand.md) document.

By default, for queries ran by AAD users, storage accounts will be accessed using the AAD pass-through. This means that users will be impersonated and permissions checked on the storage level. You can [control storage access](development-storage-files-storage-access-control.md) to suit your needs.

## Extensions

In order to enable a smooth experience for in place querying of data residing in Azure Storage files, SQL Analytics on-demand uses the [OPENROWSET](development-openrowset.md) function with additional capabilities:

- [Querying multiple files or folders](#querying-multiple-files-or-folders)
- [PARQUET file format](#parquet-file-format)
- [Additional options for working with delimited text (field terminator, row terminator, escape char)](#additional-options-for-working-with-delimited-text)
- [Reading a chosen subset of columns](#reading-a-chosen-subset-of-columns)
- [Schema inference](#schema-inference)
- [filename function](#filename-function)
- [filepath function](#filepath-function)
- [Working with complex types and nested or repeated data structures](#working-with-complex-types-and-nested-or-repeated-data-structures)

### Querying multiple files or folders

To run a T-SQL query over a set of files within a folder or set of folders on storage while treating them as a single entity/rowset, provide a path to a folder or a pattern (using wildcards) over a set of files/folders.  

The following rules apply: 

- Patterns can appear either in part of a directory path or in a filename.
- Several patterns can appear in the same directory step or file name.
- If there are multiple wildcards, then files within all matching paths will be included in the resulting file set.

```
N'https://myaccount.blob.core.windows.net/myroot/*/mysubfolder/*.csv'
```

Check [Querying folders and multiple files](query-folders-multiple-csv-files.md) in the Samples section for usage examples.

### PARQUET file format

To query Parquet source data, use FORMAT = 'PARQUET'

```
OPENROWSET
( 
	{ BULK 'data_file’ ,
	{ FORMATFILE = 'format_file_path' [ <bulk_options>] | SINGLE_BLOB | SINGLE_CLOB | SINGLE_NCLOB } } 
)
AS table_alias(column_alias,...n) 
<bulk_options> ::= 
...
[ , FORMAT = {'CSV' | 'PARQUET'} ] 
```

Check [Querying Parquet files](query-parquet-files.md) in the Samples section for usage examples.

### Additional options for working with delimited text

These additional parameters are introduced for working with CSV (delimited text) files:

```
<bulk_options> ::= 
...
[ , FIELDTERMINATOR = 'char' ]
[ , ROWTERMINATOR = 'char’ ]
[ , ESCAPE_CHAR = 'char' ]
...
```

- ESCAPE_CHAR = 'char'
Specifies the character in the file that is used to escape itself and all delimiter values in the file. If the escape character is followed by a value other than itself or any of the delimiter values, the escape character is dropped when reading the value. 
The ESCAPE_CHAR parameter will be applied regardless of whether the FIELDQUOTE is or isn't enabled. It will not be used to escape the quoting character. The quoting character is escaped with double-quotes in alignment with the Excel CSV behavior.

- FIELDTERMINATOR ='field_terminator'
Specifies the field terminator to be used. The default field terminator is a comma (“**,**”) 

- ROWTERMINATOR ='row_terminator'
Specifies the row terminator to be used. The default row terminator is a newline character, i.e., **\r\n**.

### Reading a chosen subset of columns

To specify columns that you want to read, you can provide an optional WITH clause within your OPENROWSET statement.

- If there are CSV data files, to read all the columns, simply provide column names and their data types. If you want a subset of columns, use ordinal numbers to pick the columns from the originating data files by ordinal (i.e., columns will be bound by the ordinal designation).

- If there are Parquet data files, provide column names that match the column names in the originating data files (i.e., columns will be bound by name).

```
OPENROWSET
...
| BULK 'data_file’,
{ FORMATFILE = 'format_file_path' [ <bulk_options>] | SINGLE_BLOB | SINGLE_CLOB | SINGLE_NCLOB } } 
) AS table_alias(column_alias,...n) | WITH ( {'column_name' 'column_type' [ 'column_ordinal'] })
```
Check [Read CSV files without specifying all columns](query-single-csv-file.md#read-csv-file---without-specifying-all-columns) for samples.

### Schema inference

By omitting the WITH clause from OPENROWSET statement, you can instruct the service to auto detect (infer) the schema from underlying files.

> [!NOTE]
> This currently works only for PARQUET file format.

```
OPENROWSET( 
BULK N'path_to_file(s)', FORMAT='PARQUET'); 

```

### filename function

This function returns the file name that the row originates from.

Check [filename function](query-specific-files.md#filename) in samples section for queries.

### filepath function

This function returns a full path or a part of path:

- When called without parameter, returns the full file path that row originates from. 
- When called with parameter, it returns part of path that matches the wildcard on position specified in parameter. For example, parameter value 1 would return part of path that matches the first wildcard.

Check [filepath function](query-specific-files.md#filepath) in samples section for queries.

### Working with complex types and nested or repeated data structures

In order to enable a smooth experience when working with data stored in nested/repeated data types (e.g., in [Parquet](https://github.com/apache/parquet-format/blob/master/LogicalTypes.md#nested-types) files), Starlight added the extensions below.

#### Projecting nested and/or repeated data

To project data, simply run a SELECT statement over the Parquet file that contains columns of nested data types. On output, nested values will be serialized into JSON and returned as a varchar(8000) SQL data type. 

```
	SELECT  *  FROM
	OPENROWSET 
	(   BULK 'unstructured_data_path' ,
	    FORMAT = 'PARQUET' ) 
	[AS alias]
```

Check [Projecting nested and/or repeated data](query-parquet-nested-types.md#projecting-nested-andor-repeated-data) in samples section for queries.

#### Accessing elements from nested columns

To access nested elements from a nested (e.g., Struct) column, use "dot notation" to concatenate field names into the path and provide the path as column_name in the WITH clause of the OPENROWSET function. 
See the syntax fragment below:

```
	OPENROWSET 
	(   BULK 'unstructured_data_path' , 
	    FORMAT = 'PARQUET'  ) 
	WITH ({'column_name' 'column_type',}) 
	[AS alias] 
	 
	'column_name' ::= '[field_name.] field_name'
```

By default, the OPENROWSET function matches the source field name and path with column names provided in the WITH clause. Elements contained at different nesting levels within the same source Parquet file can be accessed in same via the WITH clause.

*Return values*
- Function returns a scalar value (e.g., int, decimal, varchar) from the specified element on the specified path for all Parquet types that are not in the Nested Type group.
- If the path points to an element that is of a Nested Type, the function returns a JSON fragment starting from the top element on the specified path. The JSON fragment is of type varchar(8000).
- If the property can't be found at the specified column_name, the function returns an error.
- If the property can't be found at the specified column_path, depending on [Path mode](https://docs.microsoft.com/sql/relational-databases/json/json-path-expressions-sql-server?view=sql-server-2017#PATHMODE), the function returns an error (in strict mode) or null (in lax mode)

Check [Accessing elements from nested columns](query-parquet-nested-types.md#accessing-elements-from-nested-columns) in samples section for queries.

#### Accessing elements from repeated columns

To access elements from a repeated column (e.g., element of an Array or Map), use the [JSON_VALUE](https://docs.microsoft.com/sql/t-sql/functions/json-value-transact-sql?view=sql-server-2017) function for every scalar element you need to project and provide:

- Nested/repeated column, as first parameter
- A [JSON path](https://docs.microsoft.com/sql/relational-databases/json/json-path-expressions-sql-server?view=sql-server-2017) that specifies the element/property to access, as a second parameter

To access non-scalar elements from a repeated column, use the [JSON_QUERY](https://docs.microsoft.com/sql/t-sql/functions/json-query-transact-sql?view=sql-server-2017) function for every non-scalar element you need to project and provide:

- Nested/repeated column, as first parameter
- A [JSON path](https://docs.microsoft.com/lational-databases/json/json-path-expressions-sql-server?view=sql-server-2017) that specifies the element/property to access, as a second parameter

See syntax fragment below:

```
	SELECT 
	   { JSON_VALUE (column_name, path_to_sub_element), }
	   { JSON_QUERY (column_name [ , path_to_sub_element ]), ) 
	FROM
	OPENROWSET 
	(   BULK 'unstructured_data_path' ,
	    FORMAT = 'PARQUET' ) 
	[AS alias]
```

Check [Accessing elements from repeated columns](query-parquet-nested-types.md#accessing-elements-from-repeated-columns) in samples section for queries.

## Next steps

Now you are ready to continue with the following quickstart articles:

- [Query single CSV file](query-single-csv-file.md)

- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)

- [Query specific files](query-specific-files.md)

- [Query Parquet files](query-parquet-files.md)

- [Create and use views](create-use-views.md)

- [Query JSON files](query-json-files.md)

- [Query Parquet nested types](query-parquet-nested-types.md)