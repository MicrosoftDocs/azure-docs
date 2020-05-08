---
title: How to use OPENROWSET in SQL on-demand (preview)
description: This article describes syntax of OPENROWSET in SQL on-demand (preview) and explains how to use arguments.
services: synapse-analytics
author: filippopovic
ms.service: synapse-analytics
ms.topic: overview
ms.subservice:
ms.date: 05/07/2020
ms.author: fipopovi
ms.reviewer: jrasnick
---

# How to use OPENROWSET with SQL on-demand (preview)

The `OPENROWSET(BULK...)` function allows you to access files in Azure Storage. `OPENROWSET` function reads content of some remote data source (for example file) and returns the content as a set of rows. Within the SQL on-demand (preview) resource, the OPENROWSET bulk rowset provider is accessed by calling the OPENROWSET function and specifying the BULK option.  

The `OPENROWSET` function can be referenced in the `FROM` clause of a query as if it were a table name `OPENROWSET`. It supports bulk operations through a built-in BULK provider that enables data from a file to be read and returned as a rowset.

## Data source

OPENROWSET function in Synapse SQL reads content of the file(s) from a data source. Data source is Azure storage account and it can be explicitly referenced in `OPENROWSET` function or can be dynamically inferred from URL of the files that you want to read.
The `OPENROWSET` function can optionally contain `DATA_SOURCE` parameter that specify data source that contains files.
- `OPENROWSET` without `DATA_SOURCE` can be used to directly read content of the files form the URL location specified as `BULK` option:

```sql
SELECT *
FROM OPENROWSET(BULK 'http://storage..../container/folder/*.parquet',
                TYPE = 'PARQUET') AS file
```

This is quick and easy way to read the content of the files without some pre-configuration. This option enables you to use basic authentication option to access the storage. AAD logins can access files only using their own [Azure AD identity](develop-storage-files-storage-access-control.md#user-identity) if Azure storage allows the Azure AD user to access underlying files (for example, if the caller has Storage Reader permission on storage) and if you [enable Azure AD passthrough authentication](develop-storage-files-storage-access-control.md#force-azure-ad-pass-through) on Synapse SQL service. SQL logins can also use `OPENROWSET` without `DATA_SOURCE` to access publicly available files, files protected using SAS key or Managed Identity of Synapse workspace. You would need to [create server-scoped credential](develop-storage-files-storage-access-control.md#examples) to allow access to storage files.
    
- `OPENROWSET` with `DATA_SOURCE` can be used to access files on specified storage account:

```sql
SELECT *
FROM OPENROWSET(BULK '/folder/*.parquet',
                DATA_SOURCE='storage', --> Root URL is in LOCATION of DATA SOURCE
                TYPE = 'PARQUET') AS file
```

This option enables you to configure location of storage account in data source and specify authentication method that should be used to access storage. This option enables you to access publicly available storage, or access storage using SAS token, Managed Identity of workspace, or [Azure AD identity of caller](develop-storage-files-storage-access-control.md#user-identity) (if caller is Azure AD principal). If `DATA_SOURCE` references Azure storage that is not public, you would need to [create database-scoped credential](develop-storage-files-storage-access-control.md#examples) and reference it in `DATA SOURCE` to allow access to storage files.

> [!IMPORTANT]
> `OPENROWSET` without `DATA_SOURCE` provides quick and easy way to access the storage files but offers limited authentication options. As an example, Azure AD principal can access files only using their [Azure AD identity](develop-storage-files-storage-access-control.md#user-identity) and cannot access publicly available files. If you need more powerful authentication options, use `DATA_SOURCE` option and define credential that you want to use to access storage.

## Security

Database user must have `ADMINISTER BULK OPERATIONS` permission to use `OPENROWSET` function.
Storage administrator also must enable user to access the files by providing valid SAS token or enabling Azure AD principal to access storage files. Learn more about storage access control in [this article](develop-storage-files-storage-access-control.md).

OPENROWSET is currently not supported in SQL pool.

## Syntax

```syntaxsql
--OPENROWSET syntax for reading Parquet files
OPENROWSET  
( { BULK 'unstructured_data_path' , [DATA_SOURCE = <data source name>, ]
    FORMAT='PARQUET' }  
)  
[WITH ( {'column_name' 'column_type' }) ]
[AS] table_alias(column_alias,...n)

--OPENROWSET syntax for reading delimited text files
OPENROWSET  
( { BULK 'unstructured_data_path' , [DATA_SOURCE = <data source name>, ] 
    FORMAT = 'CSV'
    [ <bulk_options> ] }  
)  
WITH ( {'column_name' 'column_type' [ 'column_ordinal'] })  
[AS] table_alias(column_alias,...n)
 
<bulk_options> ::=  
[ , FIELDTERMINATOR = 'char' ]    
[ , ROWTERMINATOR = 'char' ] 
[ , ESCAPE_CHAR = 'char' ] 
[ , FIRSTROW = 'first_row' ]     
[ , FIELDQUOTE = 'quote_characters' ]
[ , DATA_COMPRESSION = 'data_compression_method' ]
[ , PARSER_VERSION = 'parser_version' ]
```

## Arguments

You have two choices for input files that contain the target data for querying. Valid values are:

- 'CSV' - Includes any delimited text file with row/column separators. Any character can be used as a field separator, such as  TSV: FIELDTERMINATOR = tab.

- 'PARQUET' - Binary file in Parquet format 

**'unstructured_data_path'**

The unstructured_data_path that establishes a path to the data may have absolute or relative path:
- Absolute path in the format '\<prefix>://\<storage_account_path>/\<storage_path>' enables user to directly read the files.
- Relative path in the format '<storage_path>' that must be used with `DATA_SOURCE` parameter and describes file pattern within <storage_account_path> location defined in `EXTERNAL DATA SOURCE`. 

 Below you'll find the relevant <storage account path> values that will link to your particular external data source. 

| External Data Source       | Prefix | Storage account path                                 |
| -------------------------- | ------ | ---------------------------------------------------- |
| Azure Blob Storage         | https  | \<storage_account>.blob.core.windows.net             |
| Azure Data Lake Store Gen1 | https  | \<storage_account>.azuredatalakestore.net/webhdfs/v1 |
| Azure Data Lake Store Gen2 | https  | \<storage_account>.dfs.core.windows.net              |
||||

'\<storage_path>'

 Specifies a path within your storage that points to the folder or file you want to read. If the path points to a container or folder, all files will be read from that particular container or folder. Files in subfolders won't be included. 

 You can use wildcards to target multiple files or folders. Usage of multiple nonconsecutive wildcards is allowed.
Below is an example that reads all *csv* files starting with *population* from all folders starting with */csv/population*:  
`https://sqlondemandstorage.blob.core.windows.net/csv/population*/population*.csv`

If you specify the unstructured_data_path to be a folder, a SQL on-demand query will retrieve files from that folder. 

> [!NOTE]
> Unlike Hadoop and PolyBase, SQL on-demand doesn't return subfolders. Also, unlike Hadoop and PloyBase, SQL on-demand does return files for which the file name begins with an underline (_) or a period (.).

In the example below, if the unstructured_data_path=`https://mystorageaccount.dfs.core.windows.net/webdata/`, a SQL on-demand query will return rows from mydata.txt and _hidden.txt. It won't return mydata2.txt and mydata3.txt because they are located in a subfolder.

![Recursive data for external tables](./media/develop-openrowset/folder-traversal.png)

`[WITH ( {'column_name' 'column_type' [ 'column_ordinal'] }) ]`

The WITH clause allows you to specify columns that you want to read from files.

- For CSV data files, to read all the columns, provide column names and their data types. If you want a subset of columns, use ordinal numbers to pick the columns from the originating data files by ordinal. Columns will be bound by the ordinal designation. 

> [!IMPORTANT]
> The WITH clause is mandatory for CSV files.
- For Parquet data files, provide column names that match the column names in the originating data files. Columns will be bound by name. If the WITH clause is omitted, all columns from Parquet files will be returned.

column_name = Name for the output column. If provided, this name overrides the column name in the source file.

column_type = Data type for the output column. The implicit data type conversion will take place here.

column_ordinal = Ordinal number of the column in the source file(s). This argument is ignored for Parquet files since binding is done by name. The following example would return a second column only from a CSV file:

```sql
WITH (
    --[country_code] VARCHAR (5) COLLATE Latin1_General_BIN2,
    [country_name] VARCHAR (100) COLLATE Latin1_General_BIN2 2
    --[year] smallint,
    --[population] bigint
)
```

**\<bulk_options>**

FIELDTERMINATOR ='field_terminator'

Specifies the field terminator to be used. The default field terminator is a comma ("**,**").

ROWTERMINATOR ='row_terminator'`

Specifies the row terminator to be used. If row terminator is not specified one of default terminators will be used. Default terminators for PARSER_VERSION = '1.0' are \r\n, \n and \r. Default terminators for PARSER_VERSION = '2.0' are \r\n and \n.

ESCAPE_CHAR = 'char'

Specifies the character in the file that is used to escape itself and all delimiter values in the file. If the escape character is followed by a value other than itself, or any of the delimiter values, the escape character is dropped when reading the value. 

The ESCAPE_CHAR parameter will be applied regardless of whether the FIELDQUOTE is or isn't enabled. It won't be used to escape the quoting character. The quoting character is escaped with double-quotes in alignment with the Excel CSV behavior.

FIRSTROW = 'first_row' 

Specifies the number of the first row to load. The default is 1. This indicates the first row in the specified data file. The row numbers are determined by counting the row terminators. FIRSTROW is 1-based.

FIELDQUOTE = 'field_quote' 

Specifies a character that will be used as the quote character in the CSV file. If not specified, the quote character (") will be used. 

DATA_COMPRESSION = 'data_compression_method'

Specifies compression method. Following compression method is supported:

- org.apache.hadoop.io.compress.GzipCodec

PARSER_VERSION = 'parser_version'

Specifies parser version to be used when reading files. Currently supported CSV parser versions are 1.0 and 2.0

- PARSER_VERSION = '1.0'
- PARSER_VERSION = '2.0'

CSV parser version 1.0 is default and feature-rich, while 2.0 is built for performance and does not support all options and encodings. 

CSV parser version 2.0 specifics:

- Not all data types are supported.
- Maximum row size limit is 8MB.
- Following options are not supported: DATA_COMPRESSION.
- Quoted empty string ("") is interpreted as empty string.

## Examples

The following example returns only two columns with ordinal numbers 1 and 4 from the population*.csv files. Since there's no header row in the files, it starts reading from the first line:

```sql
SELECT * 
FROM OPENROWSET(
        BULK 'https://sqlondemandstorage.blob.core.windows.net/csv/population/population*.csv',
        FORMAT = 'CSV',
        FIRSTROW = 1
    )
WITH (
    [country_code] VARCHAR (5) COLLATE Latin1_General_BIN2 1,
    [population] bigint 4
) AS [r]
```

The following example returns all columns of the first row from the census data set in Parquet format without specifying column names and data types: 

```sql
SELECT 
    TOP 1 *
FROM  
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet',
        FORMAT='PARQUET'
    ) AS [r]
```

If you are getting the error saying that the files cannot be listed, you need to enable Synapse SQL on-demand to access public storage:
- If you are using SQL login you need to [create server-scoped credential that allows access to public storage](develop-storage-files-storage-access-control.md#examples).
- If you are using Azure AD principal to access public storage, you would need to [create server-scoped credential that allows access to public storage](develop-storage-files-storage-access-control.md#examples) and disable [Azure AD passthrough authentication](develop-storage-files-storage-access-control.md#disable-forcing-azure-ad-pass-through).

## Next steps

For more samples, go to [quickstarts](query-data-storage.md) to learn how to use `OPENROWSET to read [CSV](query-single-csv-file.md), [PARQUET](query-parquet-files.md), and [JSON](query-json-files.md) file formats. You can also learn how to save the results of your query to Azure Storage using [CETAS](develop-tables-cetas.md).
