---
title: Serverless SQL pool self-help
description: This section contains information that can help you troubleshoot problems with serverless SQL pool.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: sql
ms.date: 9/23/2021
ms.author: stefanazaric
ms.reviewer: sngun, wiassaf
ms.custom: ignite-fall-2021
---

# Self-help for serverless SQL pool

This article contains information about how to troubleshoot most frequent problems with serverless SQL pool in Azure Synapse Analytics.

## Synapse Studio

Synapse studio is easy to use tool that enables you to access your data using a browser without a need to install database access tools. However, Synapse studio is not designed to read a large set of data or full management of SQL objects.

### Serverless SQL pool is grayed out in Synapse Studio

If Synapse Studio can't establish connection to serverless SQL pool, you'll notice that serverless SQL pool is grayed out or shows status "Offline". Usually, this problem occurs when one of the following cases happens:

1) Your network prevents communication to Azure Synapse backend. Most frequent case is that port 1443 is blocked. To get the serverless SQL pool to work, unblock this port. Other problems could prevent serverless SQL pool to work as well, [visit full troubleshooting guide for more information](../troubleshoot/troubleshoot-synapse-studio.md).
2) You don't have permissions to log into serverless SQL pool. To gain access, one of the Azure Synapse workspace administrators should add you to workspace administrator or SQL administrator role. [Visit full guide on access control for more information](../security/synapse-workspace-access-control-overview.md).

### Websocket connection was closed unexpectedly

If your query fails with the error message: 'Websocket connection was closed unexpectedly', it means that your browser connection to Synapse Studio was interrupted, for example because of a network issue. 

To resolve this issue, rerun this query. If this message occurs often in your environment, advise help from your network administrator, check firewall settings, and [visit this troubleshooting guide for more information](../troubleshoot/troubleshoot-synapse-studio.md). 

If the issue still continues, create a [support ticket](../../azure-portal/supportability/how-to-create-azure-support-request.md) through the Azure portal and try [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) or [SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) for the same queries instead of Synapse Studio for further investigation.

### Serverless databases are not shown in Synapse studio

If you do not see the databases that are created in serverless SQL pool, check is your serverless SQL pool started. If the serverless SQL pool is deactivated, the databases will not be shown. Execute any query (for example `SELECT 1`) on the serverless pool to activate it, and the databases will be shown.

### Synapse Serverless SQL pool is showing as unavailable
Wrong network configuration is often the cause for this behavior. Make sure the ports are appropriately configured. In case you use firewall or Private Endpoint check their settings as well. Finally, make sure the appropriate roles are granted. 

## Storage access

If you are getting the errors while trying to access the files on storage, make sure that you have permissions to access data. You should be able to access publicly available files. If you are accessing data without credentials, make sure that your Azure AD identity can directly access the files.
If you have SAS key that you should use to access files, make sure that you created a credential ([server-level](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#server-scoped-credential) or [database-scoped](develop-storage-files-storage-access-control.md?tabs=shared-access-signature#database-scoped-credential)) that contains that credential. The credentials are required if you need to access data using the workspace [managed identity](develop-storage-files-storage-access-control.md?tabs=managed-identity#database-scoped-credential) and custom [service principal name](develop-storage-files-storage-access-control.md?tabs=service-principal#database-scoped-credential).

### Cannot read, list or access files on data lake storage

If you are using Azure AD login without explicit credential, make sure that your Azure AD identity can access the files on storage. Your Azure AD identity need to have Blob Data Reader or list/read ACL permissions to access the files - see [Query fails because file cannot be opened](#query-fails-because-file-cannot-be-opened).

If you are accessing storage using [credentials](develop-storage-files-storage-access-control.md#credentials), make sure that your [Managed identity](develop-storage-files-storage-access-control.md?tabs=managed-identity) or [SPN](develop-storage-files-storage-access-control.md?tabs=service-principal) has Data Reader/Contributor role, or ALC permissions. If you have used [SAS token](develop-storage-files-storage-access-control.md?tabs=shared-access-signature) make sure that it has `rl` permission and that it didn't expired. 
If you are using SQL login and the `OPENROWSET` function [without data source](develop-storage-files-overview.md#query-files-using-openrowset), make sure that you have a server-level credential that matches the storage URI and has permission to access the storage.

### Query fails because file cannot be opened

If your query fails with the error 'File cannot be opened because it does not exist or it is used by another process' and you're sure both file exist and it's not used by another process it means serverless SQL pool can't access the file. This problem usually happens because your Azure Active Directory identity doesn't have rights to access the file or because a firewall is blocking access to the file. By default, serverless SQL pool is trying to access the file using your Azure Active Directory identity. To resolve this issue, you need to have proper rights to access the file. Easiest way is to grant yourself 'Storage Blob Data Contributor' role on the storage account you're trying to query. 
- [Visit full guide on Azure Active Directory access control for storage for more information](../../storage/blobs/assign-azure-role-data-access.md). 
- [Visit Control storage account access for serverless SQL pool in Azure Synapse Analytics](develop-storage-files-storage-access-control.md)

**Alternative to Storage Blob Data Contributor role**

Instead of granting Storage Blob Data Contributor, you can also grant more granular permissions on a subset of files. 

* All users that need access to some data in this container also needs to have the EXECUTE permission on all parent folders up to the root (the container). 
Learn more about [how to set ACLs in Azure Data Lake Storage Gen2](../../storage/blobs/data-lake-storage-explorer-acl.md). 

> [!NOTE]
> Execute permission on the container level needs to be set within the Azure Data Lake Gen2.
> Permissions on the folder can be set within Azure Synapse. 


If you would like to query data2.csv in this example, the following permissions are needed: 
   - execute permission on container
   - execute permission on folder1 
   - read permission on data2.csv

![Drawing showing permission structure on data lake.](./media/resources-self-help-sql-on-demand/folder-structure-data-lake.png)

* Log into Azure Synapse with an admin user that has full permissions on the data you want to access.

* In the data pane, right-click on the file and select MANAGE ACCESS.

![Screenshot showing manage access UI.](./media/resources-self-help-sql-on-demand/manage-access.png)

* Choose at least “read” permission, type in the users UPN or Object ID, for example user@contoso.com and click Add

* Grant read permission for this user.
![Screenshot showing grant read permissions UI](./media/resources-self-help-sql-on-demand/grant-permission.png)

> [!NOTE]
> For guest users, this needs to be done directly with the Azure Data Lake Service as it can not be done directly through Azure Synapse. 

### Content of directory on the path cannot be listed

This error indicates that the user who is querying Azure Data Lake cannot list the files on a storage. There are several scenarios where this error might happen:
- Azure AD user who is using [Azure AD pass-through authentication](develop-storage-files-storage-access-control.md?tabs=user-identity) do not have permissions to list the files on Azure Data Lake storage.
- Azure AD or SQL user is reading data using [SAS key](develop-storage-files-storage-access-control.md?tabs=shared-access-signature) or [workspace Managed Identity](develop-storage-files-storage-access-control.md?tabs=managed-identity), and that key/identity do not have permission to list the files on the storage.
- User who is accessing DataVerse data does not have permission to query data in DataVerse. This might happen if you are using SQL users.
- User who is accessing Delta Lake might not have permission to read Delta Lake transaction log.
 
The easiest way is to resolve this issue is grant yourself `Storage Blob DataContributor` role on the storage account you're trying to query.
- [Visit full guide on Azure Active Directory access control for storage for more information](../../storage/blobs/assign-azure-role-data-access.md).
- [Visit Control storage account access for serverless SQL pool in Azure Synapse Analytics](develop-storage-files-storage-access-control.md)
 
#### Content of Dataverse table cannot be listed

If you are using the Synapse link for Dataverse to read the linked DataVerse tables, you need to use Azure AD account to access the linked data using the serverless SQL pool.
If you try to use a SQL login to read an external table that is referencing the DataVerse table, you will get the following error:

```
External table '???' is not accessible because content of directory cannot be listed.
```

DataVerse external tables always use **Azure AD passthrough** authentication. You **cannot** configure them to use [SAS key](develop-storage-files-storage-access-control.md?tabs=shared-access-signature) or [workspace Managed Identity](develop-storage-files-storage-access-control.md?tabs=managed-identity).

#### Content of Delta Lake transaction log cannot be listed

The following error is returned when a serverless SQL pool cannot read the Delta Lake transaction log folder.

```Msg 13807, Level 16, State 1, Line 6
Content of directory on path 'https://.....core.windows.net/.../_delta_log/*.json' cannot be listed.
```

Make sure that `_delta_log` folder exists (maybe you are querying plain Parquet files that are not converted to Delta Lake format). If the `_delta_log` folder exists, make sure that you have both read and list permission on the underlying Delta Lake folders. Try to read \*.json files directly using FORMAT='CSV' (put your URI in the BULK parameter):

```sql
select top 10 *
from openrowset(BULK 'https://.....core.windows.net/.../_delta_log/*.json',FORMAT='csv', FIELDQUOTE = '0x0b', FIELDTERMINATOR ='0x0b',ROWTERMINATOR = '0x0b') 
with (line varchar(max)) as logs
```

If this query fails, the caller does not have permission to read the underlying storage files.  

## Query execution

You might get errors during the query execution if the caller [cannot access some objects](develop-storage-files-overview.md#permissions), query [cannot access external data](develop-storage-files-storage-access-control.md#storage-permissions), or you are using some functionalities that are [not supported in serverless SQL pools](overview-features.md).

### Query fails because it cannot be executed due to current resource constraints 

If your query fails with the error message 'This query can't be executed due to current resource constraints', it means that serverless SQL pool isn't able to execute it at this moment due to resource constraints: 

- Make sure data types of reasonable sizes are used.  

- If your query targets Parquet files, consider defining explicit types for string columns because they'll be VARCHAR(8000) by default. [Check inferred data types](./best-practices-serverless-sql-pool.md#check-inferred-data-types).

- If your query targets CSV files, consider [creating statistics](develop-tables-statistics.md#statistics-in-serverless-sql-pool). 

- Visit [performance best practices for serverless SQL pool](./best-practices-serverless-sql-pool.md) to optimize query.  

### Query timeout expired

The error *Query timeout expired* is returned if the query executed more than 30 minutes on serverless SQL pool. This is a limit of serverless SQL pool that cannot be changed. Try to optimize your query by applying [best practices](best-practices-serverless-sql-pool.md#prepare-files-for-querying), or try to materialize parts of your queries using [CETAS](create-external-table-as-select.md). Check is there a concurrent workload running on the serverless pool because the other queries might take the resources. In that case you might split the workload on multiple workspaces.

###  Invalid object name

The error *Invalid object name 'table name'* indicates that you are using an object (table or view) that doesn't exist in the serverless SQL pool database.
- List the tables/views and check does the object exists. Use SSMS or ADS because Synapse studio might show some tables that are not available in the serverless SQL pool.
- If you see the object, check are you using some case-sensitive/binary database collation. Maybe the object name does not match the name that you used in the query. With a binary database collation, `Employee` and `employee` are two different objects.
- If you don't see the object, maybe you are trying to query a table from a Lake/Spark database. There are a few reasons why the table might not be available in the serverless pool:
    - The table has some column types that cannot be represented in serverless SQL.
    - The table has a format that is not supported in serverless SQL pool (Delta, ORC, etc.)

### Could not allocate tempdb space while transferring data from one distribution to another

The error *Could not allocate tempdb space while transferring data from one distribution to another* is returned when the query execution engine cannot process data and transfer it between the nodes that are executing the query. 
It is a special case of the generic [query fails because it cannot be executed due to current resource constraints](#query-fails-because-it-cannot-be-executed-due-to-current-resource-constraints) error. This error is returned when the resources allocated to the `tempdb` database are insufficient to run the query. 

Apply the best practices before you file a support ticket.

### Query fails with error while handling an external file (max error count reached)

If your query fails with the error message 'error handling external file: Max errors count reached', it means that there is a mismatch of a specified column type and the data that needs to be loaded. 
To get more information about the error and which rows and columns to look at, change the parser version from ‘2.0’ to ‘1.0’. 

**Example**
If you would like to query the file ‘names.csv’ with this query 1, Azure Synapse SQL serverless will return with such error. 

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

`Error handling external file: ‘Max error count reached’. File/External table name: [filepath].`

As soon as parser version is changed from version 2.0 to version 1.0, the error messages help to identify the problem. The new error message is now instead: 

`Bulk load data conversion error (truncation) for row 1, column 2 (Text) in data file [filepath]`

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

### Cannot bulk load because the file could not be opened

The error *Cannot bulk load because the file could not be opened* is returned if a file is modified during the query execution. Usually, you are getting an error like:
`Cannot bulk load because the file {file path} could not be opened. Operating system error code 12(The access code is invalid.).`

The serverless sql pools cannot read the files that are modified while the query is running. The query cannot take a lock on the files. 
If you know that the modification operation is **append**, you can try to set the following option `{"READ_OPTIONS":["ALLOW_INCONSISTENT_READS"]}`. See how to [query append-only files](query-single-csv-file.md#querying-appendable-files) or [create tables on append-only files](create-use-external-tables.md#external-table-on-appendable-files).

### Query fails with data conversion error

If your query fails with the error message 'bulk load data conversion error (type mismatches or invalid character for the specified codepage) for row n, column m [columnname] in the data file [filepath]', it means that your data types did not match the actual data for row number n and column m. 

For instance, if you expect only integers in your data but in row n there might be a string, this is the error message you will get. 
To resolve this problem, inspect the file and the according data types you did choose. Also check if your row delimiter and field terminator settings are correct. The following example shows how inspecting can be done using VARCHAR as column type. 
Read more on field terminators, row delimiters and escape quoting characters [here](query-single-csv-file.md). 

**Example** 
If you would like to query the file ‘names.csv’ with this query 1, Azure Synapse SQL serverless will return with such error. 

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
`Bulk load data conversion error (type mismatch or invalid character for the specified codepage) for row 6, column 1 (ID) in data file [filepath]`

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

**Example**
If you would like to query the file ‘names.csv’ with this Query 1, Azure Synapse SQL serverless will return with result table that looks odd. 

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


### Column [column-name] of type [type-name] is  not compatible with external data type [external-data-type-name] 

If your query fails with the error message 'Column [column-name] of type [type-name] is not compatible with external data type […]', it is likely that tried to map a PARQUET data type to the wrong SQL data type. 
For instance, if your parquet file has a column price with float numbers (like 12.89) and you tried to map it to INT, this is the error message you will get. 

To resolve this, inspect the file and the according data types you did choose. This [mapping table](develop-openrowset.md#type-mapping-for-parquet) helps to choose a SQL data type. 
Best practice hint: Specify mapping only for columns that would otherwise resolve into VARCHAR data type. 
Avoiding VARCHAR when possible, leads to better performance in queries. 

**Example**
If you would like to query the file 'taxi-data.parquet' with this Query 1, Azure Synapse SQL serverless will return with such error.

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

`Column 'SumTripDistance' of type 'INT' is not compatible with external data type 'Parquet physical type: DOUBLE', please try with 'FLOAT'. File/External table name: '<filepath>taxi-data.parquet'.`

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

### The query references an object that is not supported in distributed processing mode

The error *The query references an object that is not supported in distributed processing mode* indicates that you have used for object or function that cannot be used while querying data in Azure storage or Cosmos DB analytical storage. Some objects (such as system views) and functions cannot be used while querying data stored in Azure data lake or Cosmos DB analytical storage. Avoid using the queries that join external data with system views, load external data in a temp table, or use some security or metadata functions to filter external data. 

### `WaitIOCompletion` call failed

The error message *WaitIOCompletion call failed* indicates that the query failed while waiting to complete IO operation that reads data from the remote storage (Azure Data Lake).
Make sure that your storage is placed in the same region as serverless SQL pool, and that you are not using `archive access` storage that is paused by default. Check the storage metrics and verify that there are no other workloads on the storage layer (uploading new files) that could saturate IO requests.

### Incorrect syntax near 'NOT'

The error *Incorrect syntax near 'NOT'* indicates that there are some external tables with the columns containing `NOT NULL` constraint in the column definition. Update the table to remove `NOT NULL` from the column definition. This error can sometimes also occur transiently with tables created from a CETAS statement. If the problem doesn't resolve, you can try dropping and recreating the external table.

### Partitioning column returns NULL values

If your query returns `NULL` values instead of partitioning columns or cannot find the partition columns, you have few possible troubleshooting steps:
- If you are using tables to query partitioned data set, note that the tales do not support partitioning. Replace the table with the [partitioned views](create-use-views.md#partitioned-views).
- If you are using the [partitioned views](create-use-views.md#partitioned-views) with the OPENROWSET that [queries partitioned files using the FILEPATH() function](query-specific-files.md), make sure that you have correctly specified wildcard pattern in the location that that you have used the proper index for referencing the wildcard.
- If you are querying the files directly in the partitioned folder, note that the partitioning columns are not the parts of the file columns. The partitioning values are placed in the folder paths and not the files. Therefore, the files do not contain the partitioning values.

### Inserting value to batch for column type DATETIME2 failed

The error *Inserting value to batch for column type DATETIME2 failed* indicates that the serverless pool cannot read the date values form the underlying files. The datetime value stored in Parquet/Delta Lake file cannot be represented as `DATETIME2` column. Inspect the minimum value in the file using spark and check are there some dates less than 0001-01-03. If you stored the files using the Spark 2.4, the date time values before are written using the Julain calendar that is not aligned with the Gregorian Proleptic calendar used in serverless SQL pools. There might be a 2-days difference between Julian calendar user to write the values in Parquet (in some Spark versions) and Gregorian Proleptic calendar used in serverless SQL pool, which might cause conversion to invalid (negative) date value. 

Try to use Spark to update these values because they are treated as invalid date values in SQL. The following sample shows how to update the values that are out of SQL date ranges to `NULL` in Delta Lake:

```spark
from delta.tables import *
from pyspark.sql.functions import *

deltaTable = DeltaTable.forPath(spark, 
             "abfss://my-container@myaccount.dfs.core.windows.net/delta-lake-data-set")
deltaTable.update(col("MyDateTimeColumn") < '0001-02-02', { "MyDateTimeColumn": null } )
```

Note this change will remove the values that cannot be represented. The other date values might be properly loaded but incorrectly represented because there is still a difference between Julian and Gregorian Proleptic calendars. You might see an unexpected date shifts even for the dates before `1900-01-01` if you are using Spark 3.0 or older versions.
Consider [migrating to Spark 3.1 or higher](https://spark.apache.org/docs/latest/sql-migration-guide.html) where it is used Gregorian Proleptic calendar that is aligned with the calendar in the serverless SQL pool.
You should reload your legacy data with the higher version of Spark, and use the following setting to correct the dates:

```spark
spark.conf.set("spark.sql.legacy.parquet.int96RebaseModeInWrite", "CORRECTED")
```

### Query failed because of a topology change or compute container failure

This error might indicate that some internal process issue happened in the serverless SQL pool. File a support ticket with all necessary details that could help Azure support team to investigate the issue.

Please specify in the support requests anything that might be unusual compared to the regular workload, such as large number of concurrent requests or some special workload or query that started executing before this error happened.

## Configuration

Serverless pools enable you to use T-SQL to configure database objects. There are some constraints, such as - you cannot create objects in master and lake house/spark databases, you need to have master key to create credentials, you need to have permission to reference data that is used in the objects.

### Cannot create a database

If you are getting the error '*CREATE DATABASE failed. User database limit has been already reached.*' you have created the maximal number of databases that are supported in one workspace (see [Constraints](#constraints)).
- If you need to separate the objects, use schemas within the databases.
- If you just need to reference Azure Data Lake storage, create Lake house databases or Spark databases that will be synchronized in the serverless SQL pool.

### Please create a master key in the database or open the master key in the session before performing this operation.

If your query fails with the error message *Please create a master key in the database or open the master key in the session before performing this operation*, it means that your user database has no access to a master key in the moment. 

Most likely, you just created a new user database and did not create a master key yet. 

To resolve this, create a master key with the following query:

```sql
CREATE MASTER KEY [ ENCRYPTION BY PASSWORD ='password' ];
```

> [!NOTE]
> Replace 'password' with a different secret here. 

### CREATE STATEMENT is not supported in master database

If your query fails with the error message `Failed to execute query. Error: CREATE EXTERNAL TABLE/DATA SOURCE/DATABASE SCOPED CREDENTIAL/FILE FORMAT is not supported in master database` it means that master database in serverless SQL pool does not support creation of:
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

### Cannot create Azure AD login or user

If you are getting an error while trying to create new Azure AD login or user in database, check what login you used to connect to your database. The login that is trying to create a new Azure AD user must have permission to access Azure AD domain and check does the user exist.
- SQL logins do not have this permission, so you will always get this error if you use SQL authentication.
- If you are using Azure AD login to create new logins, check do you have permission to access Azure AD domain.

## Cosmos DB

Serverless SQL pools enable you to query Cosmos DB analytical storage using the `OPENROWSET` function. Make sure that your Cosmos DB container has analytical storage. Make sure that you correctly specified account, database, and container name. also, make sure that your Cosmos DB account key is valid - see [prerequisites](query-cosmos-db-analytical-store.md#prerequisites).

### Cannot query Cosmos DB using the OPENROWSET function

If you cannot connect to your Cosmos DB account, take a look at [prerequisites](query-cosmos-db-analytical-store.md#prerequisites). Possible errors and troubleshooting actions are listed in the following table.

| Error | Root cause |
| --- | --- |
| Syntax errors:<br/> - Incorrect syntax near `Openrowset`<br/> - `...` is not a recognized `BULK OPENROWSET` provider option.<br/> - Incorrect syntax near `...` | Possible root causes:<br/> - Not using Cosmos DB as the first parameter.<br/> - Using a string literal instead of an identifier in the third parameter.<br/> - Not specifying the third parameter (container name). |
| There was an error in the Cosmos DB connection string. | - The account, database, or key isn't specified. <br/> - There's some option in a connection string that isn't recognized.<br/> - A semicolon (`;`) is placed at the end of a connection string. |
| Resolving Cosmos DB path has failed with the error "Incorrect account name" or "Incorrect database name." | The specified account name, database name, or container can't be found, or analytical storage hasn't been enabled to the specified collection.|
| Resolving Cosmos DB path has failed with the error "Incorrect secret value" or "Secret is null or empty." | The account key isn't valid or is missing. |

### UTF-8 collation warning is returned while reading Cosmos DB string types

A serverless SQL pool will return a compile-time warning if the `OPENROWSET` column collation doesn't have UTF-8 encoding. You can easily change the default collation for all `OPENROWSET` functions running in the current database by using the T-SQL statement `alter database current collate Latin1_General_100_CI_AS_SC_UTF8`.

[Latin1_General_100_BIN2_UTF8 collation](best-practices-serverless-sql-pool.md#use-proper-collation-to-utilize-predicate-pushdown-for-character-columns) provides the best performance when you filter your data using string predicates.

### Missing rows in Cosmos DB analytical store

Some items from Cosmos DB might not be returned by the `OPENROWSET` function.
- There is a synchronization delay between transactional and analytical store. The document that you entered in the Cosmos DB transactional store might appear in analytical store after 2-3 minutes.
- The document might violate some [schema constraints](../../cosmos-db/analytical-store-introduction.md#schema-constraints). 

### Query returns `NULL` values in some Cosmos DB items

Azure Synapse SQL will return `NULL` instead of the values that you see in the transaction store in the following cases:
- There is a synchronization delay between transactional and analytical store. The value that you entered in Cosmos DB transactional store might appear in analytical store after 2-3 minutes.
- Possibly wrong column name or path expression in the `WITH` clause. Column name (or path expression after the column type) in the `WITH` clause must match the property names in Cosmos DB collection. Comparison is case-sensitive (for example, `productCode` and `ProductCode` are different properties). Make sure that your column names exactly match the Cosmos DB property names.
- The property might not be moved to the analytical storage because it violates some [schema constraints](../../cosmos-db/analytical-store-introduction.md#schema-constraints), such as more than 1000  properties or more than 127 nesting levels.
- If you are using well-defined [schema representation](../../cosmos-db/analytical-store-introduction.md#schema-representation) the value in transactional store might have a wrong type. Well-defined schema locks the types for each property by sampling the documents. Any value added in the transactional store that doesn't match the type is treated as a wrong value and not migrated to the analytical store. 
- If you are using full-fidelity [schema representation](../../cosmos-db/analytical-store-introduction.md#schema-representation) make sure that you are adding type suffix after property name like `$.price.int64`. If you don't see a value for the referenced path, maybe it is stored under different type path, for example `$.price.float64`. See [how to query Cosmos DB collections in the full-fidelity schema](query-cosmos-db-analytical-store.md#query-items-with-full-fidelity-schema).

### Column is not compatible with external data type

The error *Column `column name` of the type `type name` isn't compatible with the external data type `type name`* is returned is the specified column type in the `WITH` clause doesn't match the type in the Azure Cosmos DB container. Try to change the column type as it's described in the section [Azure Cosmos DB to SQL type mappings](query-cosmos-db-analytical-store.md#azure-cosmos-db-to-sql-type-mappings), or use the `VARCHAR` type.

### Resolving Cosmos DB path has failed

If you are getting the error: `Resolving Cosmos DB path has failed with error 'This request is not authorized to perform this operation.'`, check do you use private endpoints in Cosmos DB. To allow SQL serverless to access an analytical store with private endpoint, you need to [configure private endpoints for Azure Cosmos DB analytical store](../../cosmos-db/analytical-store-private-endpoints.md#using-synapse-serverless-sql-pools).

### Cosmos DB performance issues

If you are experiencing some unexpected performance issues, make sure that you applied the best practices, such as:
- Make sure that you have placed the client application, serverless pool, and Cosmos DB analytical storage in [the same region](best-practices-serverless-sql-pool.md#colocate-your-azure-cosmos-db-analytical-storage-and-serverless-sql-pool).
- Make sure that you are using the `WITH` clause with [optimal data types](best-practices-serverless-sql-pool.md#use-appropriate-data-types).
- Make sure that you are using [Latin1_General_100_BIN2_UTF8 collation](best-practices-serverless-sql-pool.md#use-proper-collation-to-utilize-predicate-pushdown-for-character-columns) when you filter your data using string predicates.
- If you have repeating queries that might be cached, try to use [CETAS to store query results in Azure Data Lake Storage](best-practices-serverless-sql-pool.md#use-cetas-to-enhance-query-performance-and-joins).

## Delta Lake

There are some limitations and known issues that you might see in Delta Lake support in serverless SQL pools.
- Make sure that you are referencing root Delta Lake folder in the [OPENROWSET](./develop-openrowset.md) function or external table location.
  - Root folder must have a sub-folder named `_delta_log`. The query will fail if there is no `_delta_log` folder. If you don't see that folder, then you are referencing plain Parquet files that must be [converted to Delta Lake](../spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#convert-parquet-to-delta) using Apache Spark pools.
  - Do not specify wildcards to describe the partition schema. Delta Lake query will automatically identify the Delta Lake partitions. 
- Delta Lake tables created in the Apache Spark pools are not automatically available in serverless SQL pool. To query such Delta Lake tables using T-SQL language, run the [CREATE EXTERNAL TABLE](./create-use-external-tables.md#delta-lake-external-table) statement and specify Delta as format.
- External tables do not support partitioning. Use [partitioned views](create-use-views.md#delta-lake-partitioned-views) on Delta Lake folder to leverage the partition elimination. See known issues and workarounds below.
- Serverless SQL pools do not support time travel queries. You can vote for this feature on [Azure feedback site](https://feedback.azure.com/d365community/idea/8fa91755-0925-ec11-b6e6-000d3a4f07b8). Use Apache Spark pools in Azure Synapse Analytics to [read historical data](../spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#read-older-versions-of-data-using-time-travel).
- Serverless SQL pools do not support updating Delta Lake files. You can use serverless SQL pool to query the latest version of Delta Lake. Use Apache Spark pools in Azure Synapse Analytics [to update Delta Lake](../spark/apache-spark-delta-lake-overview.md?pivots=programming-language-python#update-table-data).
- Serverless SQL pools in Azure Synapse Analytics do not support datasets with the [BLOOM filter](/azure/databricks/delta/optimizations/bloom-filters).
- Delta Lake support is not available in dedicated SQL pools. Make sure that you are using serverless pools to query Delta Lake files.

### JSON text is not properly formatted

This error indicates that serverless SQL pool cannot read Delta Lake transaction log. You will probably see the error like the following error:

```
Msg 13609, Level 16, State 4, Line 1
JSON text is not properly formatted. Unexpected character '' is found at position 263934.
Msg 16513, Level 16, State 0, Line 1
Error reading external metadata.
```
Make sure that your Delta Lake data set is not corrupted. Verify that you can read the content of the Delta Lake folder using Apache Spark pool in Azure Synapse. This way you will ensure that the `_delta_log` file is not corrupted.

**Workaround** - try to create a checkpoint on Delta Lake data set using Apache Spark pool and re-run the query. The checkpoint will aggregate transactional json log files and might solve the issue.

If the data set is valid, [create a support ticket](../../azure-portal/supportability/how-to-create-azure-support-request.md#create-a-support-request) and provide an additional info:
- Do not make any changes like adding/removing the columns or optimizing the table because this might change the state of Delta Lake transaction log files.
- Copy the content of `_delta_log` folder into a new empty folder. **DO NOT** copy `.parquet data` files.
- Try to read the content that you copied in new folder and verify that you are getting the same error.
- Send the content of the copied `_delta_log` file to Azure support.

Now you can continue using Delta Lake folder with Spark pool. You will provide copied data to Microsoft support if you are allowed to share this. Azure team will investigate the content of the `delta_log` file and provide more info about the possible errors and the workarounds.

## Performance

The serverless SQL pool assign the resources to the queries based on the size of data set and query complexity. You cannot change or limit the resources that are provided to the queries. There are some cases where you might experience unexpected query performance degradations and identify the root causes.

### Query duration is very long

If you have queries with the query duration longer than 30min, this indicates that returning results to the client is slow. Serverless SQL pool has 30min limit for execution, and any additional time is spent on result streaming. Try with 
- If you are using [Synapse studio](#query-is-slow-when-executed-using-synapse-studio) try to reproduce the issues with some other application like SQL Server Management Studio or Azure Data Studio.
- If your query is slow when executed using [SSMS, ADS, Power BI, or some other application](#query-is-slow-when-executed-using-application) check networking issues and best practices.

#### Query is slow when executed using Synapse studio 

If you are using Synapse Studio, try using some desktop client such as SQL Server Management Studio or Azure Data Studio. Synapse Studio is a web client that is connecting to serverless pool using HTTP protocol, that is generally slower than the native SQL connections used in SQL Server Management Studio or Azure Data Studio.

#### Query is slow when executed using application 

Check the following issues if you are experiencing the slow query execution:
-	Make sure that the client applications are collocated with the serverless SQL pool endpoint. Executing a query across the region can cause additional latency and slow streaming of result set.
-	Make sure that you don’t have networking issues that can cause the slow streaming of result set 
-	Make sure that the client application has enough resources (for example, not using 100% CPU). 
-	Make sure that the storage account or Cosmos DB analytical storage is placed in the same region as your serverless SQL endpoint.

See the best practices for [collocating the resources](best-practices-serverless-sql-pool.md#client-applications-and-network-connections).

### High variations in query durations

If you are executing the same query and observing variations in the query durations, there might be several reasons that can cause this behavior:  
- Check is this a first execution of a query. The first execution of a query collects the statistics required to create a plan. The statistics are collected by scanning the underlying files and might increase the query duration. In Synapse studio you will see additional “global statistics creation” queries in the SQL request list, that are executed before your query.
- Statistics might expire after some time, so periodically you might observe an impact on performance because the serverless pool must scan and re-built the statistics. You might notice additional “global statistics creation” queries in the SQL request list, that are executed before your query.
- Check is there some additional workload that is running on the same endpoint when you executed the query with the longer duration. The serverless SQL endpoint will equally allocate the resources to all queries that are executed in parallel, and the query might be delayed.

## Connections

Serverless SQL pool enables you to connect using TDS protocol and use T-SQL language to query data. Most of the tools that can connect to SQL server or Azure SQL database, can also connect to serverless SQL pool.

### SQL pool is warming up

Following a longer period of inactivity Serverless SQL pool will be deactivated. The activation will happen automatically on the first next activity, such as the first connection attempt. Activation process may take a bit longer than a single connection attempt interval, thus the error message is displayed. Re-trying the connection attempt should be enough.  
As a best practice, for the clients which support it, use ConnectionRetryCount and ConnectRetryInterval connection string keywords to control the reconnect behavior. 

If the error message persists, file a support ticket through the Azure portal.

### Cannot connect from Synapse Studio

See the [Synapse Studio section](#synapse-studio).

### Cannot connect to Synapse pool from a tool

Some tools might not have an explicit option that enables you to connect to the Synapse serverless SQL pool. 
Use an option that you would use to connect to SQL Server or Azure SQL database. The connection dialog do not need to be branded as "Synapse" because the serverless SQL pool use the same protocol as SQL Server or Azure SQL database. 

Even if a tool enables you to enter only a logical server name and predefines `database.windows.net` domain, put the Synapse workspace name followed by `-ondemand` suffix and `database.windows.net` domain.

## Security

Make sure that a user has permissions to access databases, [permissions to execute commands](develop-storage-files-overview.md#permissions), and permissions to access [data lake](develop-storage-files-storage-access-control.md?tabs=service-principal) or [Cosmos DB storage](query-cosmos-db-analytical-store.md#prerequisites). 

### Cannot access Cosmos DB account

You must use read-only Cosmos DB key to access your analytical storage, so make sure that it did not expire or that it is not re-generated.

If you are getting the [Resolving Cosmos DB path has failed](#resolving-cosmos-db-path-has-failed) error, make sure that you configured firewall.

### Cannot access Lakehouse/Spark database

If a user cannot access a lake house or Spark database, it might not have permissions to access and read the database. A user with `CONTROL SERVER` permission should have full access to all databases. As a restricted permission, you might try to use [CONNECT ANY DATABASE and SELECT ALL USER SECURABLES](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/synapse-serverless-shared-database-and-tables-access-for-non/ba-p/2645947).

### SQL user cannot access Dataverse tables

Dataverse tables are accessing storage using the callers Azure AD identity. SQL user with high permissions might try to select data from a table, but the table would not be able to access Dataverse data. This scenario is not supported.

### Azure AD service principal login failures when SPI is creating a role assignment
If you want to create role assignment for Service Principal Identifier/Azure AD app using another SPI, or have already created one and it fails to login, you're probably receiving following error:
```
Login error: Login failed for user '<token-identified principal>'.
```
For service principals login should be created with Application ID as SID (not with Object ID). There is a known limitation for service principals which is preventing the Azure Synapse service from fetching Application ID from Microsoft Graph when creating role assignment for another SPI/app.  

**Solution #1**

Navigate to Azure portal > Synapse Studio > Manage > Access control and manually add Synapse Administrator or Synapse SQL Administrator for desired Service Principal.

**Solution #2**

You need to manually create a proper login through SQL code:
```sql
use master
go
CREATE LOGIN [<service_principal_name>] FROM EXTERNAL PROVIDER;
go
ALTER SERVER ROLE sysadmin ADD MEMBER [<service_principal_name>];
go
```

**Solution #3**

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

**Validation**

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
| Max size of the result set | up to 200 GB (shared between concurrent queries) |
| Max concurrency | Not limited and depends on the query complexity and amount of data scanned. One serverless SQL pool can concurrently handle 1000 active sessions that are executing lightweight queries, but the numbers will drop if the queries are more complex or scan a larger amount of data. |

### Cannot create a database in serverless SQL pool

The serverless SQL pools have limitations and you cannot create more than 20 databases per workspace. If you need to separate objects and isolate them, use schemas.

If you are getting the error '*CREATE DATABASE failed. User database limit has been already reached.*' you have created the maximal number of databases that are supported in one workspace.

You don't need to use separate databases to isolate data for different tenants. All data is stored externally on a data lake and Cosmos DB. The metadata (table, views, function definitions) can be successfully isolated using schemas. Schema-based isolation is also used in Spark where databases and schemas are the same concepts.

## Querying Azure data

Serverless SQL pools enable you to query data in Azure storage or Azure Cosmos DB using [external tables and the OPENROWSET function](develop-storage-files-overview.md).  
Make sure that you have proper [permission setup](develop-storage-files-overview.md#permissions) on your storage.

### Querying CSV data

Learn here how to [query single CSV file](query-single-csv-file.md) or [folders and multiple CSV files](query-folders-multiple-csv-files.md). You can also [query partitioned files](query-specific-files.md)

### Querying Parquet data 

Learn here how to [query Parquet files](query-parquet-files.md) with [nested types](query-parquet-nested-types.md). You can also [query partitioned files](query-specific-files.md).

### Querying Delta Lake 

Learn here how to [query Delta Lake files](query-delta-lake-format.md) with [nested types](query-parquet-nested-types.md). 

### Querying Cosmos DB data 

Learn here how to [query Cosmos DB analytical store](query-cosmos-db-analytical-store.md). You can use [online generator](https://htmlpreview.github.io/?https://github.com/Azure-Samples/Synapse/blob/main/SQL/tools/cosmosdb/generate-openrowset.html) to generate the `WITH` clause based on a sample Cosmos DB document.
You can [create views](create-use-views.md#cosmosdb-view) on top of Cosmos DB containers.

### Querying JSON data 

Learn here how to [query JSON files](query-json-files.md). You can also [query partitioned files](query-specific-files.md)

### Create views, tables and other database objects

Learn here how to create and use [views](create-use-views.md), [external tables](create-use-external-tables.md), or setup [row-level security](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/how-to-implement-row-level-security-in-serverless-sql-pools/ba-p/2354759).
If you have [partitioned files](query-specific-files.md), make sure that you are using [partitioned views](create-use-views.md#partitioned-views).

### Copy and transform data (CETAS)

Learn here how to [store query results to storage](create-external-table-as-select.md) using Create external table as select (CETAS) command.
