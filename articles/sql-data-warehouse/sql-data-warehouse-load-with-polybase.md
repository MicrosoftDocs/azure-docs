<properties
   pageTitle="PolyBase in SQL Data Warehouse Tutorial | Microsoft Azure"
   description="Learn what PolyBase is and how to use it for data warehousing scenarios."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor="jrowlandjones"/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="11/04/2015"
   ms.author="sahajs;barbkess"/>


# Load data with PolyBase
PolyBase technology allows you to query and join data from multiple sources, all by using Transact-SQL commands. 

Using PolyBase, you can query data stored in Azure blob storage and load it into SQL Data 
Warehouse database with the following steps:

- Create database master key and credential.
- Create PolyBase objects: external data source, external file format, and external table. 
- Query data stored in Azure blob storage.
- Load data from Azure blob storage into SQL Data Warehouse.
- Export data from SQL Data Warehouse to Azure blob storage.


## Prerequisites
To step through this tutorial, you need:

- Azure storage account
- Your data stored in Azure blob storage as delimited text files

First, you will create the objects that PolyBase requires for connecting to and querying data in Azure blob storage.

> [AZURE.IMPORTANT] The Azure Storage account types supported by PolyBase are:
> 
> + Standard Locally Redundant Storage (Standard-LRS)
> + Standard Geo-Redundant Storage (Standard-GRS)
> + Standard Read-Access Geo-Redundant Storage (Standard-RAGRS)
>
> Standard Zone Redundant Storage (Standard-ZRS) and Premium Locally Redundant Storage (Premium-LRS) account types are NOT supported by PolyBase. If you are creating a new Azure Storage account, make sure you select a PolyBase-supported storage account type from the Pricing Tier.

## Step 1: Store a credential in your database
To access Azure blob storage, you need to create a database scoped credential that stores authentication information for your Azure storage account. Follow these steps to store a credential with your database.

1. Connect to your SQL Data Warehouse database.
2. Use [CREATE MASTER KEY (Transact-SQL)][] to create a master key for your database. If your database already has a master key you don't need to create another one. This key is used to encrypt your credential "secret" in the next step.

    ```
    -- Create a E master key
    CREATE MASTER KEY;
    ```

1. Check to see if you already have any database credentials. To do this, use the sys.database_credentials system view, not sys.credentials which only shows the server credentials. 

    ```
    -- Check for existing database-scoped credentials.
    SELECT * FROM sys.database_credentials;

3. Use [CREATE CREDENTIAL (Transact-SQL)][] to Create a database scoped credential for each Azure storage account you want to access. In this example, IDENTITY is a friendly name for the credential. It does not affect authenticating to Azure storage. SECRET is your Azure storage account key.

    -- Create a database scoped credential
    CREATE DATABASE SCOPED CREDENTIAL ASBSecret 
    WITH IDENTITY = 'joe'
    ,    Secret = '<azure_storage_account_key>'
    ;
    ```

1. If you need to drop a database-scoped credential, use [DROP CREDENTIAL (Transact-SQL)][]:

```
-- Dropping credential
DROP DATABASE SCOPED CREDENTIAL ASBSecret
;
```

## Step 2: Create an external data source
The external data source is a database object that stores the location of the Azure blob storage data and your access information. Use [CREATE EXTERNAL DATA SOURCE (Transact-SQL)][] to define an external data source for each Azure storage blob you want to access.

    ```
    -- Create an external data source for an Azure storage blob
    CREATE EXTERNAL DATA SOURCE azure_storage 
    WITH
    (
        TYPE = HADOOP,
        LOCATION ='wasbs://mycontainer@test.blob.core.windows.net',
        CREDENTIAL = ASBSecret
    )
    ;
    ```

if you need to drop the external table, use [DROP EXTERNAL DATA SOURCE][]:

    ```
    -- Drop an external data source
    DROP EXTERNAL DATA SOURCE azure_storage
    ;
    ```

## Step 3: Create an external file format
The external file format is a database object that specifies the format of the external data. PolyBase can work with compressed and uncompressed data in delimited text, Hive RCFILE and HIVE ORC formats. 

Use [CREATE EXTERNAL FILE FORMAT (Transact-SQL)][] to create the external file format. This example specifies the data in the file is uncompressed text and the fields are separated with the pipe character ('|'). 

```
-- Create an external file format for a text-delimited file.
-- Data is uncompressed and fields are separated with the
-- pipe character.
CREATE EXTERNAL FILE FORMAT text_file_format 
WITH 
(   
    FORMAT_TYPE = DELIMITEDTEXT, 
    FORMAT_OPTIONS  
    (
        FIELD_TERMINATOR ='|',
        USE_TYPE_DEFAULT = TRUE
    )
)
;
```

If you need to drop an external file format, use [DROP EXTERNAL FILE FORMAT]. 

```
-- Dropping external file format
DROP EXTERNAL FILE FORMAT text_file_format
;
```

## Create an external table

The external table definition is similar to a relational table definition. The key difference is the location and the format of the data. 

- The external table definition is stored as metadata in the SQL Data Warehouse database. 
- The data is stored in the external location specified by the data source.

Use [CREATE EXTERNAL TABLE (Transact-SQL)][] to define the external table.

The LOCATION option specifies the path to the data from the root of the data source. In this example, the data is located at 'wasbs://mycontainer@test.blob.core.windows.net/path/Demo/'. All the files for the same table need to be under the same logical folder in Azure blob storage.

Optionally, you can also specify reject options (REJECT_TYPE, REJECT_VALUE, REJECT_SAMPLE_VALUE) that determine how PolyBase will handle dirty records it receives from the external data source.

```
-- Creating an external table for data in Azure blob storage.
CREATE EXTERNAL TABLE [ext].[CarSensor_Data] 
(
     [SensorKey]     int    NOT NULL,
     [CustomerKey]   int    NOT NULL,
     [GeographyKey]  int        NULL,
     [Speed]         float  NOT NULL,
     [YearMeasured]  int    NOT NULL,
)
WITH 
(
    LOCATION    = '/Demo/',
    DATA_SOURCE = azure_storage,
    FILE_FORMAT = text_file_format      
)
;
```

The objects you just created are stored in SQL Data Warehouse database. You can view them in the SQL Server Data Tools (SSDT) Object Explorer. 

To drop an external table you need to use the following syntax:

```
--Dropping external table
DROP EXTERNAL TABLE [ext].[CarSensor_Data]
;
```

> [AZURE.NOTE] When dropping an external table you must use `DROP EXTERNAL TABLE`. You **cannot** use `DROP TABLE`. 

Reference topic: [DROP EXTERNAL TABLE (Transact-SQL)][].

It is also worth noting that external tables are visible in both `sys.tables` and more specifically in `sys.external_tables` catalog views.

## Rotating storage keys

From time to time you will want to change the access key to your blob storage for security reasons. 

The most elegant way to perform this task is to follow a process known as "rotating the keys". You may have noticed that you have two storage keys for your blob storage account. This is so that you can transition 

Rotating your Azure storage account keys is a simple three step process

1. Create second database scoped credential based on the secondary storage access key
2. Create second external data source based off this new credential
3. Drop and create the external table(s) pointing to the new external data source

When you have migrated all your external tables to the new external data source then you can perform the clean up tasks:
 
1. Drop first external data source
2. Drop first database scoped credential based on the primary storage access key
3. Log into Azure and regenerate the primary access key ready for the next time

## Query Azure blob storage data
Queries against external tables simply use the table name as though it was a relational table. 


```

-- Query Azure storage resident data via external table. 
SELECT * FROM [ext].[CarSensor_Data]
;

```

> [AZURE.NOTE] A query on an external table can fail with the error *"Query aborted-- the maximum reject threshold was reached while reading from an external source"*. This indicates that your external data contains *dirty* records. A data record is considered 'dirty' if the actual data types/number of columns do not match the column definitions of the external table or if the data doesn't conform to the specified external file format. To fix this, ensure that your external table and external file format definitions are correct and your external data conforms to these definitions. In case a subset of external data records are dirty, you can choose to reject these records for your queries by using the reject options in CREATE EXTERNAL TABLE DDL.


## Load data from Azure blob storage
This example loads data from Azure blob storage to SQL Data Warehouse database.

Storing data directly removes the data transfer time for queries. Storing data with a columnstore index improves query performance for analysis queries by up to 10x.

This example uses the CREATE TABLE AS SELECT statement to load data. The new table inherits the columns named in the query. It inherits the data types of those columns from the external table definition. 

CREATE TABLE AS SELECT is a highly performant Transact-SQL statement that loads the data in parallel to all the compute nodes of your SQL Data Warehouse.  It was originally developed for  the massively parallel processing (MPP) engine in Analytics Platform System and is now in SQL Data Warehouse.

```
-- Load data from Azure blob storage to SQL Data Warehouse 

CREATE TABLE [dbo].[Customer_Speed]
WITH 
(   
    CLUSTERED COLUMNSTORE INDEX
,	DISTRIBUTION = HASH([CarSensor_Data].[CustomerKey])
)
AS 
SELECT * 
FROM   [ext].[CarSensor_Data]
;
```

See [CREATE TABLE AS SELECT (Transact-SQL)][].

## Create Statistics on newly loaded data

Azure SQL Data Warehouse does not yet support auto create or auto update statistics.  In order to get the best performance from your queries, it's important that statistics be created on all columns of all tables after the first load or any substantial changes occur in the data.  For a detailed explanation of statistics, see the [Statistics][] topic in the Develop group of topics.  Below is a quick example of how to create statistics on the tabled loaded in this example.

```
create statistics [SensorKey] on [Customer_Speed] ([SensorKey]);
create statistics [CustomerKey] on [Customer_Speed] ([CustomerKey]);
create statistics [GeographyKey] on [Customer_Speed] ([GeographyKey]);
create statistics [Speed] on [Customer_Speed] ([Speed]);
create statistics [YearMeasured] on [Customer_Speed] ([YearMeasured]);
```

## Export data to Azure blob storage
This section shows how to export data from SQL Data Warehouse to Azure blob storage. This example uses CREATE EXTERNAL TABLE AS SELECT which is a highly performant Transact-SQL statement to export the data in parallel from all the compute nodes. 

The following example creates an external table Weblogs2014 using column definitions and data from dbo.Weblogs table. The external table definition is stored in SQL Data Warehouse and the results of the SELECT statement are exported to the "/archive/log2014/" directory under the blob container specified by the data source. The data is exported in the specified text file format. 

```
CREATE EXTERNAL TABLE Weblogs2014 WITH
(
    LOCATION='/archive/log2014/',
    DATA_SOURCE=azure_storage,
    FILE_FORMAT=text_file_format
)
AS
SELECT
    Uri,
    DateRequested
FROM
    dbo.Weblogs
WHERE
    1=1
    AND DateRequested > '12/31/2013'
    AND DateRequested < '01/01/2015';
```


## Working around the PolyBase UTF-8 requirement
At present PolyBase supports loading data files that have been UTF-8 encoded. As UTF-8 uses the same character encoding as ASCII PolyBase will also support loading data that is ASCII encoded. However, PolyBase does not support other character encoding such as UTF-16 / Unicode or extended ASCII characters. Extended ASCII includes characters with accents such as the umlaut which is common in German.

To work around this requirement the best answer is to re-write to UTF-8 encoding.

There are several ways to do this. Below are two approaches using Powershell: 

### Simple example for small files

Below is a simple one line Powershell script that creates the file.
 
```
Get-Content <input_file_name> -Encoding Unicode | Set-Content <output_file_name> -Encoding utf8
```

However, whilst this is a simple way to re-encode the data it is by no means the most efficient. The io streaming example below is much, much faster and achieves the same result.

### IO Streaming example for larger files

The code sample below is more complex but as it streams the rows of data from source to target it is much more efficient. Use this approach for larger files.

```
#Static variables
$ascii = [System.Text.Encoding]::ASCII
$utf16le = [System.Text.Encoding]::Unicode
$utf8 = [System.Text.Encoding]::UTF8
$ansi = [System.Text.Encoding]::Default
$append = $False

#Set source file path and file name
$src = [System.IO.Path]::Combine("C:\input_file_path\","input_file_name.txt")

#Set source file encoding (using list above)
$src_enc = $ansi

#Set target file path and file name
$tgt = [System.IO.Path]::Combine("C:\output_file_path\","output_file_name.txt")

#Set target file encoding (using list above)
$tgt_enc = $utf8

$read = New-Object System.IO.StreamReader($src,$src_enc)
$write = New-Object System.IO.StreamWriter($tgt,$append,$tgt_enc)

while ($read.Peek() -ne -1)
{
    $line = $read.ReadLine();
    $write.WriteLine($line);
}
$read.Close()
$read.Dispose()
$write.Close()
$write.Dispose()
```

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[Load data with bcp]: sql-data-warehouse-load-with-bcp.md
[Load with PolyBase]: sql-data-warehouse-load-with-polybase.md
[solution partners]: sql-data-warehouse-solution-partners.md
[development overview]: sql-data-warehouse-overview-develop.md
[Statistics]: sql-data-warehouse-develop-statistics.md

<!--MSDN references-->
[supported source/sink]: https://msdn.microsoft.com/library/dn894007.aspx
[copy activity]: https://msdn.microsoft.com/library/dn835035.aspx
[SQL Server destination adapter]: https://msdn.microsoft.com/library/ms141095.aspx
[SSIS]: https://msdn.microsoft.com/library/ms141026.aspx


<!-- External Links -->
[CREATE EXTERNAL DATA SOURCE (Transact-SQL)]:https://msdn.microsoft.com/library/dn935022(v=sql.130).aspx
[CREATE EXTERNAL FILE FORMAT (Transact-SQL)]:https://msdn.microsoft.com/library/dn935026(v=sql.130).aspx
[CREATE EXTERNAL TABLE (Transact-SQL)]:https://msdn.microsoft.com/library/dn935021(v=sql.130).aspx

[DROP EXTERNAL DATA SOURCE (Transact-SQL)]:https://msdn.microsoft.com/library/mt146367.aspx
[DROP EXTERNAL FILE FORMAT (Transact-SQL)]:https://msdn.microsoft.com/library/mt146379.aspx
[DROP EXTERNAL TABLE (Transact-SQL)]:https://msdn.microsoft.com/library/mt130698.aspx

[CREATE TABLE AS SELECT (Transact-SQL)]:https://msdn.microsoft.com/library/mt204041.aspx
[CREATE MASTER KEY (Transact-SQL)]:https://msdn.microsoft.com/library/ms174382.aspx
[CREATE CREDENTIAL (Transact-SQL)]:https://msdn.microsoft.com/library/ms189522.aspx
[DROP CREDENTIAL (Transact-SQL)]:https://msdn.microsoft.com/library/ms189450.aspx


