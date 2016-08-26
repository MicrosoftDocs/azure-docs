<properties
   pageTitle="Guide for using PolyBase in SQL Data Warehouse | Microsoft Azure"
   description="Guidelines and recommendations for using PolyBase in SQL Data Warehouse scenarios."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="happynicolle"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/30/2016"
   ms.author="nicw;barbkess;sonyama"/>


# Guide for using PolyBase in SQL Data Warehouse

This guide gives practical information for using PolyBase in SQL Data Warehouse.

To get started, see the [Load data with PolyBase][] tutorial.


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

```sql
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

```sql
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

```sql
create statistics [SensorKey] on [Customer_Speed] ([SensorKey]);
create statistics [CustomerKey] on [Customer_Speed] ([CustomerKey]);
create statistics [GeographyKey] on [Customer_Speed] ([GeographyKey]);
create statistics [Speed] on [Customer_Speed] ([Speed]);
create statistics [YearMeasured] on [Customer_Speed] ([YearMeasured]);
```

## Export data to Azure blob storage
This section shows how to export data from SQL Data Warehouse to Azure blob storage. This example uses CREATE EXTERNAL TABLE AS SELECT which is a highly performant Transact-SQL statement to export the data in parallel from all the compute nodes.

The following example creates an external table Weblogs2014 using column definitions and data from dbo.Weblogs table. The external table definition is stored in SQL Data Warehouse and the results of the SELECT statement are exported to the "/archive/log2014/" directory under the blob container specified by the data source. The data is exported in the specified text file format.

```sql
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

```PowerShell
Get-Content <input_file_name> -Encoding Unicode | Set-Content <output_file_name> -Encoding utf8
```

However, whilst this is a simple way to re-encode the data it is by no means the most efficient. The io streaming example below is much, much faster and achieves the same result.

### IO Streaming example for larger files

The code sample below is more complex but as it streams the rows of data from source to target it is much more efficient. Use this approach for larger files.

```PowerShell
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
To learn more about moving data to SQL Data Warehouse, see the [data migration overview][].

<!--Image references-->

<!--Article references-->
[Load data with bcp]: ./sql-data-warehouse-load-with-bcp.md
[Load data with PolyBase]: ./sql-data-warehouse-get-started-load-with-polybase.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[data migration overview]: ./sql-data-warehouse-overview-migrate.md

<!--MSDN references-->
[supported source/sink]: https://msdn.microsoft.com/library/dn894007.aspx
[copy activity]: https://msdn.microsoft.com/library/dn835035.aspx
[SQL Server destination adapter]: https://msdn.microsoft.com/library/ms141095.aspx
[SSIS]: https://msdn.microsoft.com/library/ms141026.aspx

[CREATE EXTERNAL DATA SOURCE (Transact-SQL)]: https://msdn.microsoft.com/library/dn935022.aspx
[CREATE EXTERNAL FILE FORMAT (Transact-SQL)]: https://msdn.microsoft.com/library/dn935026).aspx
[CREATE EXTERNAL TABLE (Transact-SQL)]: https://msdn.microsoft.com/library/dn935021.aspx

[DROP EXTERNAL DATA SOURCE (Transact-SQL)]: https://msdn.microsoft.com/library/mt146367.aspx
[DROP EXTERNAL FILE FORMAT (Transact-SQL)]: https://msdn.microsoft.com/library/mt146379.aspx
[DROP EXTERNAL TABLE (Transact-SQL)]: https://msdn.microsoft.com/library/mt130698.aspx

[CREATE TABLE AS SELECT (Transact-SQL)]: https://msdn.microsoft.com/library/mt204041.aspx
[INSERT...SELECT (Transact-SQL)]: https://msdn.microsoft.com/library/ms174335.aspx
[CREATE MASTER KEY (Transact-SQL)]: https://msdn.microsoft.com/library/ms174382.aspx
[CREATE CREDENTIAL (Transact-SQL)]: https://msdn.microsoft.com/library/ms189522.aspx
[CREATE DATABASE SCOPED CREDENTIAL (Transact-SQL)]: https://msdn.microsoft.com/library/mt270260.aspx
[DROP CREDENTIAL (Transact-SQL)]: https://msdn.microsoft.com/library/ms189450.aspx

<!-- External Links -->
