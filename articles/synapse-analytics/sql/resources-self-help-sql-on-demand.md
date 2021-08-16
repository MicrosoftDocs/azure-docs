---
title: Serverless SQL pool self-help
description: This section contains information that can help you troubleshoot problems with serverless SQL pool.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics 
ms.topic: overview
ms.subservice: sql
ms.date: 05/15/2020
ms.author: stefanazaric
ms.reviewer: jrasnick
---

# Self-help for serverless SQL pool

This article contains information about how to troubleshoot most frequent problems with serverless SQL pool in Azure Synapse Analytics.

## Synapse studio

### Serverless SQL pool is grayed out in Synapse Studio

If Synapse Studio can't establish connection to serverless SQL pool, you'll notice that serverless SQL pool is grayed out or shows status "Offline". Usually, this problem occurs when one of the following cases happens:

1) Your network prevents communication to Azure Synapse backend. Most frequent case is that port 1443 is blocked. To get the serverless SQL pool to work, unblock this port. Other problems could prevent serverless SQL pool to work as well, [visit full troubleshooting guide for more information](../troubleshoot/troubleshoot-synapse-studio.md).
2) You don't have permissions to log into serverless SQL pool. To gain access, one of the Azure Synapse workspace administrators should add you to workspace administrator or SQL administrator role. [Visit full guide on access control for more information](../security/synapse-workspace-access-control-overview.md).

### Query fails with error: Websocket connection was closed unexpectedly.

If your query fails with the error message: 'Websocket connection was closed unexpectedly', it means that your browser connection to Synapse Studio was interrupted, for example because of a network issue. 

To resolve this issue, rerun this query. If this message occurs often in your environment, advise help from your network administrator, check firewall settings, and [visit this troubleshooting guide for more information](../troubleshoot/troubleshoot-synapse-studio.md). 

If the issue still continues, create a [support ticket](../../azure-portal/supportability/how-to-create-azure-support-request.md) through the Azure portal and try [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) or [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) for the same queries instead of Synapse Studio for further investigation.

## Query execution

### Query fails because file cannot be opened

If your query fails with the error 'File cannot be opened because it does not exist or it is used by another process' and you're sure both file exist and it's not used by another process it means serverless SQL pool can't access the file. This problem usually happens because your Azure Active Directory identity doesn't have rights to access the file or because a firewall is blocking access to the file. By default, serverless SQL pool is trying to access the file using your Azure Active Directory identity. To resolve this issue, you need to have proper rights to access the file. Easiest way is to grant yourself 'Storage Blob Data Contributor' role on the storage account you're trying to query. 
- [Visit full guide on Azure Active Directory access control for storage for more information](../../storage/blobs/assign-azure-role-data-access.md). 
- [Visit Control storage account access for serverless SQL pool in Azure Synapse Analytics](develop-storage-files-storage-access-control.md)

#### Alternative to Storage Blob Data Contributor role

Instead of granting Storage Blob Data Contributor, you can also grant more granular permissions on a subset of files. 

* All users that need access to some data in this container also needs to have the EXECUTE permission on all parent folders up to the root (the container). 
Learn more about [how to set ACLs in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-explorer-acl.md). 

> [!NOTE]
> Execute permission on the container level needs to be set within the Azure Data Lake Gen2.
> Permissions on the folder can be set within Synapse. 


If you would like to query data2.csv in this example, the following permissions are needed: 
   - execute permission on container
   - execute permission on folder1 
   - read permission on data2.csv

![Drawing showing permission structure on data lake.](./media/resources-self-help-sql-on-demand/folder-structure-data-lake.png)

* Log into Synapse with an admin user that has full permissions on the data you want to access.

* In the data pane, right-click on the file and select MANAGE ACCESS.

![Screenshot showing manage access UI.](./media/resources-self-help-sql-on-demand/manage-access.png)

* Choose at least “read” permission, type in the users UPN or Object ID, for example user@contoso.com and click Add

* Grant read permission for this user.
![Screenshot showing grant read permissions UI](./media/resources-self-help-sql-on-demand/grant-permission.png)

> [!NOTE]
> For guest users, this needs to be done directly with the Azure Data Lake Service as it can not be done directly through Synapse. 

### Query fails because it cannot be executed due to current resource constraints 

If your query fails with the error message 'This query can't be executed due to current resource constraints', it means that serverless SQL pool isn't able to execute it at this moment due to resource constraints: 

- Make sure data types of reasonable sizes are used. Also, specify schema for Parquet files for string columns as they'll be VARCHAR(8000) by default. 

- If your query targets CSV files, consider [creating statistics](develop-tables-statistics.md#statistics-in-serverless-sql-pool). 

- Visit [performance best practices for serverless SQL pool](./best-practices-serverless-sql-pool.md) to optimize query.  

### Could not allocate tempdb space while transferring data from one distribution to another

This error is special case of the generic [query fails because it cannot be executed due to current resource constraints](#query-fails-because-it-cannot-be-executed-due-to-current-resource-constraints) error. This error is returned when the resources allocated to the `tempdb` database are insufficient to run the query. 

Apply the same mitigation and the best practices before you file a support ticket.

### Query fails with error while handling an external file. 

If your query fails with the error message 'error handling external file: Max errors count reached', it means that there is a mismatch of a specified column type and the data that needs to be loaded. 
To get more information about the error and which rows and columns to look at, change the parser version from ‘2.0’ to ‘1.0’. 

#### Example
If you would like to query the file ‘names.csv’ with this query 1, Synapse SQL Serverless will return with such error. 

names.csv
```csv
Id,first name, 
1,Adam
2,Bob
3,Charles
4,David
5,Eva
```

Query 1:
```sql
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK '[FILE-PATH OF CSV FILE]',
        FORMAT = 'CSV',
        PARSER_VERSION='2.0',
       FIELDTERMINATOR =';',
       FIRSTROW = 2
    ) 
    WITH (
    [ID] SMALLINT, 
    [Text] VARCHAR (1) COLLATE Latin1_General_BIN2 
)

    AS [result]
```
causes:

```Error handling external file: ‘Max error count reached’. File/External table name: [filepath].```

As soon as parser version is changed from version 2.0 to version 1.0, the error messages help to identify the problem. The new error message is now instead: 

```Bulk load data conversion error (truncation) for row 1, column 2 (Text) in data file [filepath]```

Truncation tells us that our column type is too small to fit our data. The longest first name in this ‘names.csv’ file has seven characters. Therefore, the according data type to be used should be at least VARCHAR(7). 
The error is caused by this line of code: 

```sql 
    [Text] VARCHAR (1) COLLATE Latin1_General_BIN2
```
Changing the query accordingly resolves the error: After debugging, change the parser version to 2.0 again to achieve maximum performance. Read more about when to use which parser version [here](develop-openrowset.md). 

```sql 
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK '[FILE-PATH OF CSV FILE]',
        FORMAT = 'CSV',
        PARSER_VERSION='2.0',
        FIELDTERMINATOR =';',
        FIRSTROW = 2
    ) 
    WITH (
    [ID] SMALLINT, 
    [Text] VARCHAR (7) COLLATE Latin1_General_BIN2 
)

    AS [result]
```

### Query fails with conversion error
If your query fails with the error message 
'bulk load data conversion error (type mismatches or invalid character for the specified codepage) for row n, column m [columnname] in the data file [filepath]', it means that your data types did not match the actual data for row number n and column m. 

For instance, if you expect only integers in your data but in row n there might be a string, this is the error message you will get. 
To resolve this problem, inspect the file and the according data types you did choose. Also check if your row delimiter and field terminator settings are correct. The following example shows how inspecting can be done using VARCHAR as column type. 
Read more on field terminators, row delimiters and escape quoting characters [here](query-single-csv-file.md). 

#### Example 
If you would like to query the file ‘names.csv’ with this query 1, Synapse SQL Serverless will return with such error. 

names.csv
```csv
Id, first name, 
1,Adam
2,Bob
3,Charles
4,David
five,Eva
```

Query 1:
```sql 
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK '[FILE-PATH OF CSV FILE]',
        FORMAT = 'CSV',
        PARSER_VERSION='1.0',
       FIELDTERMINATOR =',',
       FIRSTROW = 2
    ) 
    WITH (
    [ID] SMALLINT, 
    [Firstname] VARCHAR (25) COLLATE Latin1_General_BIN2 
)

    AS [result]
```

causes this error: 
```Bulk load data conversion error (type mismatch or invalid character for the specified codepage) for row 6, column 1 (ID) in data file [filepath]```

It is necessary to browse the data and make an informed decision to handle this problem. 
To look at the data that causes this problem, the data type needs to be changed first. Instead of querying column “ID” with the data type “SMALLINT”, VARCHAR(100) is now used to analyze this issue. 
Using this slightly changed Query 2, the data can now be processed and shows the list of names. 

Query 2: 
```sql
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK '[FILE-PATH OF CSV FILE]',
        FORMAT = 'CSV',
        PARSER_VERSION='1.0',
       FIELDTERMINATOR =',',
       FIRSTROW = 2
    ) 
    WITH (
    [ID] VARCHAR(100), 
    [Firstname] VARCHAR (25) COLLATE Latin1_General_BIN2 
)

    AS [result]
```

names.csv
```csv
Id, first name, 
1,Adam
2,Bob
3,Charles
4,David
five,Eva
```

It looks like the data has unexpected values for ID in the fifth row. 
In such circumstances, it is important to align with the business owner of the data to agree on how corrupt data like this can be avoided. If prevention is not possible at application level and dealing with all kinds of data types for ID needs to be done, reasonable sized VARCHAR might be the only option here.

> [!Tip]
> Try to make VARCHAR() as short as possible. Avoid VARCHAR(MAX) if possible as this can impair performance. 

### The result table does not look like expected. Result columns are empty or unexpected loaded. 

If your query does not fail but you find that your result table is not loaded as expected, it is likely that row delimiter or field terminator have been chosen wrong. 
To resolve this problem, it is needed to have another look at the data and change those settings. As a result table is shown, debugging this query is easy like in upcoming example. 

#### Example
If you would like to query the file ‘names.csv’ with this Query 1, Synapse SQL Serverless will return with result table that looks odd. 

names.csv
```csv
Id,first name, 
1,Adam
2,Bob
3,Charles
4,David
5,Eva
```

```sql
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK '[FILE-PATH OF CSV FILE]',
        FORMAT = 'CSV',
        PARSER_VERSION='1.0',
       FIELDTERMINATOR =';',
       FIRSTROW = 2
    ) 
    WITH (
    [ID] VARCHAR(100), 
    [Firstname] VARCHAR (25) COLLATE Latin1_General_BIN2 
)

    AS [result]
```

causes this result table

| ID            |   firstname   | 
| ------------- |-------------  | 
| 1,Adam        | NULL | 
| 2,Bob         | NULL | 
| 3,Charles     | NULL | 
| 4,David       | NULL | 
| 5,Eva         | NULL | 

There seems to be no value in our column “firstname”. Instead, all values did end up being in column “ID”. Those values are separated by comma. 
The problem was caused by this line of code as it is necessary to choose the comma instead of the semicolon symbol as field terminator:

```sql
FIELDTERMINATOR =';',
```

Changing this single character solves the problem:

```sql
FIELDTERMINATOR =',',
```

The result table created by query 2 looks now as expected. 

Query 2:
```sql
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK '[FILE-PATH OF CSV FILE]',
        FORMAT = 'CSV',
        PARSER_VERSION='1.0',
       FIELDTERMINATOR =',',
       FIRSTROW = 2
    ) 
    WITH (
    [ID] VARCHAR(100), 
    [Firstname] VARCHAR (25) COLLATE Latin1_General_BIN2 
)

    AS [result]
``` 

returns

| ID            |   firstname   | 
| ------------- |-------------  | 
| 1        | Adam | 
| 2         | Bob | 
| 3     | Charles | 
| 4       | David | 
| 5         | Eva | 


### Query fails with error: Column [column-name] of type [type-name] is  not compatible with external data type [external-data-type-name] 

If your query fails with the error message 'Column [column-name] of type [type-name] is not compatible with external data type […]', it is likely that tried to map a PARQUET data type to the wrong SQL data type. 
For instance, if your parquet file has a column price with float numbers (like 12.89) and you tried to map it to INT, this is the error message you will get. 

To resolve this, inspect the file and the according data types you did choose. This [mapping table](develop-openrowset.md#type-mapping-for-parquet) helps to choose a SQL data type. 
Best practice hint: Specify mapping only for columns that would otherwise resolve into VARCHAR data type. 
Avoiding VARCHAR when possible, leads to better performance in queries. 

#### Example
If you would like to query the file 'taxi-data.parquet' with this Query 1, Synapse SQL Serverless will return with such error.

taxi-data.parquet:

|PassengerCount |SumTripDistance|AvgTripDistance |
|---------------|---------------|----------------|
| 1 | 2635668.66000064 | 6.72731710678951 |
| 2 | 172174.330000005 | 2.97915543404919 |
| 3 | 296384.390000011 | 2.8991352022851  |
| 4 | 12544348.58999806| 6.30581582240281 |
| 5 | 13091570.2799993 | 111.065989028627 |

Query 1:
```sql
SELECT
    *
FROM
    OPENROWSET(
        BULK '<filepath>taxi-data.parquet',
        FORMAT='PARQUET'
    )  WITh
        (
        PassengerCount INT, 
        SumTripDistance INT, 
        AVGTripDistance FLOAT
        )

    AS [result]
```
causes this error: 

```Column 'SumTripDistance' of type 'INT' is not compatible with external data type 'Parquet physical type: DOUBLE', please try with 'FLOAT'. File/External table name: '<filepath>taxi-data.parquet'.```

This error message tells us that data types are not compatible and already comes with the suggestion to use the FLOAT instead of INT. 
The error is hence caused by this line of code: 

```sql
SumTripDistance INT, 
```

Using this slightly changed Query 2, the data can now be processed and shows all three columns. 

Query 2: 
```sql
SELECT
    *
FROM
    OPENROWSET(
        BULK '<filepath>taxi-data.parquet',
        FORMAT='PARQUET'
    )  WITh
        (
        PassengerCount INT, 
        SumTripDistance FLOAT, 
        AVGTripDistance FLOAT
        )

    AS [result]
```

## Configuration

### Query fails with: Please create a master key in the database or open the master key in the session before performing this operation.

If your query fails with the error message 'Please create a master key in the database or open the master key in the session before performing this operation.', it means that your user database has no access to a master key in the moment. 

Most likely, you just created a new user database and did not create a master key yet. 

To resolve this, create a master key with the following query:

```sql
CREATE MASTER KEY [ ENCRYPTION BY PASSWORD ='password' ];
```

> [!NOTE]
> Replace 'password' with a different secret here. 

### CREATE STATEMENT is not supported in master database

If your query fails with the error message:

> 'Failed to execute query. Error: CREATE EXTERNAL TABLE/DATA SOURCE/DATABASE SCOPED CREDENTIAL/FILE FORMAT is not supported in master database.' 

it means that master database in serverless SQL pool does not support creation of:
  - External tables
  - External data sources
  - Database scoped credentials
  - External file formats

Solution:

  1. Create a user database:

```sql
CREATE DATABASE <DATABASE_NAME>
```

  2. Execute create statement in the context of <DATABASE_NAME>, which failed earlier for master database. 
  
  Example for creation of External file format:
    
```sql
USE <DATABASE_NAME>
CREATE EXTERNAL FILE FORMAT [SynapseParquetFormat] 
WITH ( FORMAT_TYPE = PARQUET)
```

### Operation is not allowed for a replicated database.
   
If you are trying to create some SQL objects, users, or change permissions in a database, you might get the errors like 'Operation CREATE USER is not allowed for a replicated database'. This error is returned when you try to create some objects in a database that is [shared with Spark pool](../metadata/database.md). The databases that are replicated from Apache Spark pools are read-only. You cannot create new objects into replicated database using T-SQL.

Create a separate database and reference the synchronized [tables](../metadata/table.md) using 3-part names and cross-database queries.

## Cosmos DB

Possible errors and troubleshooting actions are listed in the following table.

| Error | Root cause |
| --- | --- |
| Syntax errors:<br/> - Incorrect syntax near `Openrowset`<br/> - `...` is not a recognized `BULK OPENROWSET` provider option.<br/> - Incorrect syntax near `...` | Possible root causes:<br/> - Not using CosmosDB as the first parameter.<br/> - Using a string literal instead of an identifier in the third parameter.<br/> - Not specifying the third parameter (container name). |
| There was an error in the CosmosDB connection string. | - The account, database, or key isn't specified. <br/> - There's some option in a connection string that isn't recognized.<br/> - A semicolon (`;`) is placed at the end of a connection string. |
| Resolving CosmosDB path has failed with the error "Incorrect account name" or "Incorrect database name." | The specified account name, database name, or container can't be found, or analytical storage hasn't been enabled to the specified collection.|
| Resolving CosmosDB path has failed with the error "Incorrect secret value" or "Secret is null or empty." | The account key isn't valid or is missing. |
| Column `column name` of the type `type name` isn't compatible with the external data type `type name`. | The specified column type in the `WITH` clause doesn't match the type in the Azure Cosmos DB container. Try to change the column type as it's described in the section [Azure Cosmos DB to SQL type mappings](query-cosmos-db-analytical-store.md#azure-cosmos-db-to-sql-type-mappings), or use the `VARCHAR` type. |
| Column contains `NULL` values in all cells. | Possibly a wrong column name or path expression in the `WITH` clause. The column name (or path expression after the column type) in the `WITH` clause must match some property name in the Azure Cosmos DB collection. Comparison is *case-sensitive*. For example, `productCode` and `ProductCode` are different properties. |

You can report suggestions and issues on the [Azure Synapse Analytics feedback page](https://feedback.azure.com/forums/307516-azure-synapse-analytics?category_id=387862).

### UTF-8 collation warning is returned while reading CosmosDB string types

A serverless SQL pool will return a compile-time warning if the `OPENROWSET` column collation doesn't have UTF-8 encoding. You can easily change the default collation for all `OPENROWSET` functions running in the current database by using the T-SQL statement `alter database current collate Latin1_General_100_CI_AS_SC_UTF8`.

[Latin1_General_100_BIN2_UTF8 collation](best-practices-serverless-sql-pool.md#use-proper-collation-to-utilize-predicate-pushdown-for-character-columns) provides the best performance when you filter your data using string predicates.

### Some rows are not returned

- There is a synchronization delay between transactional and analytical store. The document that you entered in the Cosmos DB transactional store might appear in analytical store after 2-3 minutes.
- The document might violate some [schema constraints](../../cosmos-db/analytical-store-introduction.md#schema-constraints). 

### Query returns `NULL` values

Synapse SQL will return `NULL` instead of the values that you see in the transaction store in the following cases:
- There is a synchronization delay between transactional and analytical store. The value that you entered in Cosmos DB transactional store might appear in analytical store after 2-3 minutes.
- Possibly wrong column name or path expression in the `WITH` clause. Column name (or path expression after the column type) in the `WITH` clause must match the property names in Cosmos DB collection. Comparison is case-sensitive (for example, `productCode` and `ProductCode` are different properties). Make sure that your column names exactly match the Cosmos DB property names.
- The property might not be moved to the analytical storage because it violates some [schema constraints](../../cosmos-db/analytical-store-introduction.md#schema-constraints), such as more than 1000  properties or more than 127 nesting levels.
- If you are using well-defined [schema representation](../../cosmos-db/analytical-store-introduction.md#schema-representation) the value in transactional store might have a wrong type. Well-defined schema locks the types for each property by sampling the documents. Any value added in the transactional store that doesn't match the type is treated as a wrong value and not migrated to the analytical store. 
- If you are using full-fidelity [schema representation](../../cosmos-db/analytical-store-introduction.md#schema-representation) make sure that you are adding type suffix after property name like `$.price.int64`. If you don't see a value for the referenced path, maybe it is stored under different type path, for example `$.price.float64`. See [how to query Cosmos Db collections in the full-fidelity schema](query-cosmos-db-analytical-store.md#query-items-with-full-fidelity-schema).

### Column is not compatible with external data type

The value specified in the `WITH` clause doesn't match the underlying Cosmos DB types in analytical storage and cannot be implicitly converted. Use `VARCHAR` type in the schema.

### CosmosDB performance issues

If you are experiencing some unexpected performance issues, make sure that you applied the best practices, such as:
- Make sure that you have placed the client application, serverless pool, and Cosmos DB analytical storage in [the same region](best-practices-serverless-sql-pool.md#colocate-your-cosmosdb-analytical-storage-and-serverless-sql-pool).
- Make sure that you are using the `WITH` clause with [optimal data types](best-practices-serverless-sql-pool.md#use-appropriate-data-types).
- Make sure that you are using [Latin1_General_100_BIN2_UTF8 collation](best-practices-serverless-sql-pool.md#use-proper-collation-to-utilize-predicate-pushdown-for-character-columns) when you filter your data using string predicates.
- If you have repeating queries that might be cached, try to use [CETAS to store query results in Azure Data Lake Storage](best-practices-serverless-sql-pool.md#use-cetas-to-enhance-query-performance-and-joins).

## Delta Lake

Delta Lake support is currently in public preview in serverless SQL pools. There are some known issues that you might see during the preview.
- Make sure that you are referencing root Delta Lake folder in the [OPENROWSET](./develop-openrowset.md) function or external table location.
  - Root folder must have a sub-folder named `_delta_log`. The query will fail if there is no `_delta_log` folder. If you don't see that folder, then you are referencing plain Parquet files that must be [converted to Delta Lake](../spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#convert-parquet-to-delta) using Apache Spark pools.
  - Do not specify wildcards to describe the partition schema. Delta Lake query will automatically identify the Delta Lake partitions. 
- Delta Lake tables created in the Apache Spark pools are not synchronized in serverless SQL pool. You cannot query Apache Spark pools Delta Lake tables using T-SQL language.
- External tables do not support partitioning. Use [partitioned views](create-use-views.md#delta-lake-partitioned-views) on Delta Lake folder to leverage the partition elimination. See known issues and workarounds below.
- Serverless SQL pools do not support time travel queries. You can vote for this feature on [Azure feedback site](https://feedback.azure.com/forums/307516-azure-synapse-analytics/suggestions/43656111-add-time-travel-feature-in-delta-lake). Use Apache Spark pools in Azure Synapse Analytics to [read historical data](../spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#read-older-versions-of-data-using-time-travel).
- Serverless SQL pools do not support updating Delta Lake files. You can use serverless SQL pool to query the latest version of Delta Lake. Use Apache Spark pools in Azure Synapse Analytics [to update Delta Lake](../spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#update-table-data).
- Delta Lake support is not available in dedicated SQL pools. Make sure that you are using serverless pools to query Delta Lake files.

You can propose ideas and enhancements on [Azure Synapse feedback site](https://feedback.azure.com/forums/307516-azure-synapse-analytics?category_id=171048).

### Content of directory on path cannot be listed

The following error is returned when serverless SQL pool cannot read the Delta Lake transaction log folder.

```
Msg 13807, Level 16, State 1, Line 6
Content of directory on path 'https://.....core.windows.net/.../_delta_log/*.json' cannot be listed.
```

Make sure that `_delta_log` folder exists (maybe you are querying plain Parquet files that are not converted to Delta Lake format).

If the `_delta_log` folder exists, make sure that you have both read and list permission on the underlying Delta Lake folders.
Try to read \*.json files directly using FORMAT='CSV' (put your URI in the BULK parameter):

```sql
select top 10 * 
from openrowset(BULK 'https://.....core.windows.net/.../_delta_log/*.json', 
FORMAT='csv', FIELDQUOTE = '0x0b', FIELDTERMINATOR ='0x0b', ROWTERMINATOR = '0x0b') with (line varchar(max)) as logs
```

If this query fails, the caller does not have permission to read the underlying storage files. 

Easiest way is to grant yourself 'Storage Blob Data Contributor' role on the storage account you're trying to query. 
- [Visit full guide on Azure Active Directory access control for storage for more information](../../storage/blobs/assign-azure-role-data-access.md). 
- [Visit Control storage account access for serverless SQL pool in Azure Synapse Analytics](develop-storage-files-storage-access-control.md)

### Partitioning column returns NULL values

**Status**: Resolved

**Release**: July 2021

### Query failed because of a topology change or compute container failure

**Status**: Resolved

**Release**: July 2021

### Column of type 'VARCHAR' is not compatible with external data type 'Parquet column is of nested type'

You are trying to read Delta Lake files that contain some nested type columns without specifying WITH clause (using automatic schema inference). Automatic schema inference doesn't work with the nested columns in Delta Lake.

**Workaround:** Use the `WITH` clause and explicitly assign the `VARCHAR` type to the nested columns. Note that this will not work if your data set is partitioned, due to another known issue where `WITH` clause returns `NULL` for partition columns. Partitioned data sets with complex type columns are currently not supported.

### Cannot find value of partitioning column in file 

Delta Lake data sets may have `NULL` values in the partitioning columns. These partitions are stored in `HIVE_DEFAULT_PARTITION` folder. This is currently not supported in serverless SQL pool. In this case you will get the error that looks like:

```
Resolving Delta logs on path 'https://....core.windows.net/.../' failed with error:
Cannot find value of partitioning column '<column name>' in file 
'https://......core.windows.net/...../<column name>=__HIVE_DEFAULT_PARTITION__/part-00042-2c0d5c0e-8e89-4ab8-b514-207dcfd6fe13.c000.snappy.parquet'.
```

**Workaround:** Try to update your Delta Lake data set using Apache Spark pools and use some value (empty string or `"null"`) instead of `null` in the partitioning column.

### JSON text is not properly formatted

This error indicates that serverless SQL pool cannot read Delta Lake transaction log. You will probably see the error like the following error:

```
Msg 13609, Level 16, State 4, Line 1
JSON text is not properly formatted. Unexpected character '{' is found at position 263934.
Msg 16513, Level 16, State 0, Line 1
Error reading external metadata.
```
First, make sure that your Delta Lake data set is not corrupted.
- Verify that you can read the content of the Delta Lake folder using Apache Spark pool in Synapse or Databricks cluster. This way you will ensure that the `_delta_log` file is not corrupted.
- Verify that you can read the content of data files by specifying `FORMAT='PARQUET'` and using recursive wildcard `/**` at the end of the URI path. If you can read all Parquet files, the issue is in `_delta_log` transaction log folder.

**Workaround:** This problem might happen if you are using some `_UTF8` database collation. Try to run a query on `master` database or any other database that has non-UTF8 collation. If this workaround resolves your issue, use a database without `_UTF8` collation.

In the data set is valid, and the workaround cannot help, report a support ticket and provide a repro to Azure support:
- Do not make any changes like adding/removing the columns or optimizing the table because this might change the state of Delta Lake transaction log files.
- Copy the content of `_delta_log` folder into a new empty folder. **DO NOT** copy `.parquet data` files.
- Try to read the content that you copied in new folder and verify that you are getting the same error.
- Now you can continue using Delta Lake folder with Spark pool. You will provide copied data to Microsoft support if you are allowed to share this.
- Send the content of the copied `_delta_log` file to Azure support.

Azure team will investigate the content of the `delta_log` file and provide more info about the possible errors and the workarounds.

## Security

### AAD service principal login failures when SPI is creating a role assignment
If you want to create role assignment for Service Principal Identifier/AAD app using another SPI, or have already created one and it fails to login, you're probably receiving following error:
```
Login error: Login failed for user '<token-identified principal>'.
```
For service principals login should be created with Application ID as SID (not with Object ID). There is a known limitation for service principals which is preventing Synapse service to fetch Application Id from Azure AD Graph when creating role assignment for another SPI/app.  

#### Solution #1
Navigate to Azure Portal > Synapse Studio > Manage > Access control and manually add Synapse Administrator or Synapse SQL Administrator for desired Service Principal.

#### Solution #2
You need to manually create a proper login through SQL code:
```sql
use master
go
CREATE LOGIN [<service_principal_name>] FROM EXTERNAL PROVIDER;
go
ALTER SERVER ROLE sysadmin ADD MEMBER [<service_principal_name>];
go
```

#### Solution #3
You can also setup service principal Synapse Admin using PowerShell. You need to have [Az.Synapse module](/powershell/module/az.synapse) installed.
The solution is to use cmdlet New-AzSynapseRoleAssignment with `-ObjectId "parameter"` - and in that parameter field to provide Application ID (instead of Object ID) using workspace admin Azure service principal credentials. PowerShell script:
```azurepowershell
$spAppId = "<app_id_which_is_already_an_admin_on_the_workspace>"
$SPPassword = "<application_secret>"
$tenantId = "<tenant_id>"
$secpasswd = ConvertTo-SecureString -String $SPPassword -AsPlainText -Force
$cred = New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $spAppId, $secpasswd

Connect-AzAccount -ServicePrincipal -Credential $cred -Tenant $tenantId

New-AzSynapseRoleAssignment -WorkspaceName "<workspaceName>" -RoleDefinitionName "Synapse Administrator" -ObjectId "<app_id_to_add_as_admin>" [-Debug]
```

#### Validation
Connect to serverless SQL endpoint and verify that the external login with SID `app_id_to_add_as_admin` is created:
```sql
select name, convert(uniqueidentifier, sid) as sid, create_date
from sys.server_principals where type in ('E', 'X')
```
or just try to login on serverless SQL endpoint using the just set admin app.

## Constraints

There are some general system constraints that may affect your workload:

| Property | Limitation |
|---|---|
| Max number of Synapse workspaces per subscription | 20 |
| Max number of databases per serverless pool | 20 (not including databases synchronized from Apache Spark pool) |
| Max number of databases synchronized from Apache Spark pool | Not limited |
| Max number of databases objects per database | The sum of the number of all objects in a database cannot exceed 2,147,483,647 (see [limitations in SQL Server database engine](/sql/sql-server/maximum-capacity-specifications-for-sql-server#objects) ) |
| Max identifier length (in characters) | 128 (see [limitations in SQL Server database engine](/sql/sql-server/maximum-capacity-specifications-for-sql-server#objects) )|
| Max query duration | 30 min |
| Max size of the result set | 80 GB (shared between all currently executing concurrent queries) |
| Max concurrency | Not limited and depends on the query complexity and amount of data scanned. One serverless SQL pool can concurrently handle 1000 active sessions that are executing lightweight queries, but the numbers will drop if the queries are more complex or scan a larger amount of data. |

## Next steps

Review the following articles to learn more about how to use serverless SQL pool:

- [Query single CSV file](query-single-csv-file.md)

- [Query folders and multiple CSV files](query-folders-multiple-csv-files.md)

- [Query specific files](query-specific-files.md)

- [Query Parquet files](query-parquet-files.md)

- [Query Parquet nested types](query-parquet-nested-types.md)

- [Query JSON files](query-json-files.md)

- [Create and using views](create-use-views.md)

- [Create and using external tables](create-use-external-tables.md)

- [Store query results to storage](create-external-table-as-select.md)
