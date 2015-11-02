<properties
   pageTitle="Load data with PolyBase Tutorial | Microsoft Azure"
   description="Learn how to use PolyBase to load data into SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sahajs"
   manager="jhubbard"
   editor="sahajs"/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="10/20/2015"
   ms.author="sahajs;barbkess"/>


# Load data with PolyBase

> [AZURE.SELECTOR]
- [Data Factory](sql-data-warehouse-get-started-load-with-azure-data-factory.md)
- [PolyBase](sql-data-warehouse-load-with-polybase-short.md)
- [BCP](sql-data-warehouse-load-with-bcp.md)

This tutorial will show you how to load  data into your Azure SQL Data Warehouse using PolyBase.


## Prerequisites
To step through this tutorial, you need

- SQL Data Warehouse database
- Azure Storage account


## Step 1: Create a source data file
Open Notepad and copy the following lines of data into a new file. Save this to your local temp directory, C:\Temp\DimDate2.txt.

```
20150301,1,3
20150501,2,4
20151001,4,2
20150201,1,3
20151201,4,2
20150801,3,1
20150601,2,4
20151101,4,2
20150401,2,4
20150701,3,1
20150901,3,1
20150101,1,3
```


## Step 2: Migrate data to Azure Blob Storage

- Download the [latest version of AzCopy][].
- Open a command window, and navigate to the AzCopy installation directory on your computer where AzCopy.exe is located. By default, the install directory is %ProgramFiles(x86)%\Microsoft SDKs\Azure\AzCopy\  on a 64-bit Windows machine.
- Run the following command to upload the file. Specify your Azure Storage Account Key for /DestKey.

```
.\AzCopy.exe /Source:C:\Temp\ /Dest:https://pbdemostorage.blob.core.windows.net/datacontainer/datedimension/ /DestKey:<azure_storage_account_key> /Pattern:DimDate2.txt
```

To learn more about AzCopy, refer to [Getting Started with the AzCopy Command-Line Utility][].


## Step 3: Create External Tables

Next, you need to create external tables in SQL Data Warehouse to refer to the data in Azure blob storage.
To create an external table, use the following steps:

- [Create Master Key][]: To encrypt the secret of your database scoped credential.
- [Create Database Scoped Credential]: To specify authentication information for your Azure storage account.
- [Create External Data Source]: To specify the location of your Azure blob storage.
- [Create External File Format]: To specify the layout of your data.
- [Create External Table]: To reference the Azure Storage data.



```

-- A: Create Master Key
-- Required to encrypt the credential secret in the next step.
CREATE MASTER KEY;


-- B: Create Database Scoped Credential
-- Provide the Azure storage account key. The identity name does not affect authentication to Azure storage.
CREATE DATABASE SCOPED CREDENTIAL AzureStorageCredential 
WITH IDENTITY = 'user', 
SECRET = '<azure_storage_account_key>';


-- C: Create External Data Source
-- Specify location and credential to access your Azure blob storage.
CREATE EXTERNAL DATA SOURCE AzureStorage 
WITH (	
		TYPE = Hadoop, 
		LOCATION = 'wasbs://datacontainer@pbdemostorage.blob.core.windows.net',
		CREDENTIAL = AzureStorageCredential
); 


-- D: Create External File format 
-- Specify the layout of data stored in Azure storage blobs. 
CREATE EXTERNAL FILE FORMAT TextFile 
WITH (FORMAT_TYPE = DelimitedText, 
FORMAT_OPTIONS (FIELD_TERMINATOR = ','));


-- E: Create External Table
-- To reference data stored in Azure blob storage.
CREATE EXTERNAL TABLE dbo.DimDate2External (
	DateId INT NOT NULL, 
	CalendarQuarter TINYINT NOT NULL, 
	FiscalQuarter TINYINT NOT NULL
)
WITH (
		LOCATION='datedimension/', 
		DATA_SOURCE=AzureStorage, 
		FILE_FORMAT=TextFile
);


-- Run a query on external table to confirm that the Azure Storage data can be referenced.
SELECT count(*) FROM dbo.DimDate2External;

```



## Step 4: Load data into SQL Data Warehouse

- To load the data into a new table, run the CREATE TABLE AS SELECT statement. The new table inherits the columns named in the query. It inherits the data types of those columns from the external table definition. 
- To load the data into an existing table, use the INSERT...SELECT statement.  


```

-- Load the data from Azure blob storage to SQL Data Warehouse

CREATE TABLE dbo.DimDate2
WITH 
(   
    CLUSTERED COLUMNSTORE INDEX,
		DISTRIBUTION = ROUND_ROBIN
)
AS 
SELECT * 
FROM   [dbo].[DimDate2External];

```
See [CREATE TABLE AS SELECT (Transact-SQL)][].


To learn more about PolyBase, refer to [PolyBase in SQL Data Warehouse Tutorial][].


<!--Article references-->
[PolyBase in SQL Data Warehouse Tutorial]: sql-data-warehouse-load-with-polybase.md


<!-- External Links -->
[latest version of AzCopy]:http://aka.ms/downloadazcopy
[Getting Started with the AzCopy Command-Line Utility]:https://azure.microsoft.com/documentation/articles/storage-use-azcopy/

[Create External Data Source]:https://msdn.microsoft.com/library/dn935022(v=sql.130).aspx
[Create External File Format]:https://msdn.microsoft.com/library/dn935026(v=sql.130).aspx
[Create External Table]:https://msdn.microsoft.com/library/dn935021(v=sql.130).aspx
[Create Master Key]:https://msdn.microsoft.com/en-us/library/ms174382.aspx
[Create Database Scoped Credential]:https://msdn.microsoft.com/en-us/library/mt270260.aspx
[CREATE TABLE AS SELECT (Transact-SQL)]:https://msdn.microsoft.com/library/mt204041.aspx


