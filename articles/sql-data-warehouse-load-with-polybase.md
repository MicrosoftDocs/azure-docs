<properties
   pageTitle="PolyBase in SQL Data Warehouse Tutorial | Microsoft Azure"
   description="Learn what PolyBase is and how to use it for data warehousing scenarios."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/09/2015"
   ms.author="sahajs;barbkess"/>


# Load data with PolyBase
PolyBase technology allows you to query and join data from multiple sources, all by using Transact-SQL commands. 

Using PolyBase, you can query data stored in Azure blob storage and load it into SQL Data Warehouse database with the following steps:
- Create database master key and credential.
- Create PolyBase objects: external data source, external file format, and external table. 
- Query data stored in Azure blob storage.
- Load data from Azure blob storage into SQL Data Warehouse.


## Prerequisites
To step through this tutorial, you need:
- Azure storage account
- Your data stored in Azure blob storage as delimited text files


First, you will create the objects that PolyBase requires for connecting to and querying data in Azure blob storage.

## Create database master key
Connect to master database on your server to create a database master key. This key is used to encrypt your credential secret in the next step. 

```
-- Creating master key
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'S0me!nfo';
```

Reference topic: [CREATE MASTER KEY (Transact-SQL)][].

## Create a database scoped credential
To access Azure blob storage, you need to create a database scoped credential that stores authentication information for your Azure storage account. Connect to your data warehouse database and create a database scoped credential for each Azure storage account you want to access. Specify an identity name and your Azure storage account key as the Secret. The identity name does not affect authentication to Azure Storage.

```
-- Creating credential
CREATE DATABASE SCOPED CREDENTIAL ASBSecret WITH IDENTITY = 'joe', 
	Secret = 'myazurestoragekey==';
```

Reference topic: [CREATE CREDENTIAL (Transact-SQL)][].

When you rotate your Azure storage account keys, you will need to drop the credential and re-create it using the new key as the Secret.

```
-- Dropping credential
DROP DATABASE SCOPED CREDENTIAL ASBSecret;
```

Reference topic: [DROP CREDENTIAL (Transact-SQL)][].


## Create an external data source
The external data source is a database object that stores the location of the Azure blob storage data and your access information. You need to define an external data source for each Azure Storage container you want to access.

```
-- Creating external data source (Azure Blob Storage) 
CREATE EXTERNAL DATA SOURCE azure_storage 
WITH (
	TYPE = HADOOP, 
       LOCATION ='wasbs://mycontainer@ test.blob.core.windows.net/path’,
      CREDENTIAL = ASBSecret
);
```

Reference topic: [CREATE EXTERNAL DATA SOURCE (Transact-SQL)][].

## Create an external file format
The external file format is a database object that specifies the format of the external data. In this example, we have uncompressed data in a text file and the fields are separated with the pipe character ('|'). 

```
-- Creating external file format (delimited text file)
CREATE EXTERNAL FILE FORMAT text_file_format 
WITH (
	FORMAT_TYPE = DELIMITEDTEXT, 
	FORMAT_OPTIONS (
		FIELD_TERMINATOR ='|', 
		USE_TYPE_DEFAULT = TRUE
	)
);
```

PolyBase can work with compressed and uncompressed data in delimited text, Hive RCFILE and HIVE ORC formats. 

Reference topic: [CREATE EXTERNAL FILE FORMAT (Transact-SQL)][].

## Create an external table

The external table definition is similar to a relational table definition. The key difference is the location and the format of the data. The external table definition is stored in SQL Data Warehouse database. The data is stored the location specified by the data source.

The LOCATION option specifies the path to the data from the root of the data source. In this example, the data is located at 'wasbs://mycontainer@ test.blob.core.windows.net/path/Demo/'.

```
-- Creating external table pointing to file stored in Azure Storage
CREATE EXTERNAL TABLE [ext].[CarSensor_Data] (
    [SensorKey] int NOT NULL, 
    [CustomerKey] int NOT NULL, 
    [GeographyKey] int NULL, 
    [Speed] float NOT NULL, 
    [YearMeasured] int NOT NULL
)
WITH (LOCATION='/Demo/',
      DATA_SOURCE = azure_storage,
      FILE_FORMAT = text_file_format,      
);
```
> [AZURE.NOTE] Please note that you cannot create statistics on an external table at this time.

All the files for the same table need to be under the same logical folder in Azure BLOB. As a best practice, break your Azure Storage data into no more than 1GB files when possible for parallel processing with SQL Data Warehouse.

Reference topic: [CREATE EXTERNAL TABLE (Transact-SQL)][].

The objects you just created are stored in SQL Data Warehouse database. You can view them in the SQL Server Data Tools (SSDT) Object Explorer. 


## Query Azure blob storage data
Queries against external tables simply use the table name as though it was a relational table. 

This is an ad-hoc query that joins insurance customer data stored in SQL Data Warehouse, with automobile sensor data stored in Azure storage blob. The result shows the drivers that drive faster than others.

```
-- Join SQL Data Warehouse relational data with Azure storage data. 
SELECT 
    [Insured_Customers].[FirstName],
    [Insured_Customers].[LastName],
    [Insured_Customers].[YearlyIncome],
    [CarSensor_Data].[Speed]
FROM [dbo].[Insured_Customers] INNER JOIN [ext].[CarSensor_Data]
ON [Insured_Customers].[CustomerKey] = [CarSensor_Data].[CustomerKey]
WHERE [CarSensor_Data].[Speed] > 60 
ORDER BY [CarSensor_Data].[Speed] desc;
```

## Load data from Azure blob storage
This example loads data from Azure blob storage to SQL Data Warehouse database.

Storing data directly removes the data transfer time for queries. Storing data with a columnstore index improves query performance for analysis queries by up to 10x.

This example uses the CREATE TABLE AS SELECT statement to load data. The new table inherits the columns named in the query. It inherits the data types of those columns from the external table definition. 

CREATE TABLE AS SELECT is a highly performant Transact-SQL statement  that replaces INSERT...SELECT.  It was originally developed for  the massively parallel processing (MPP) engine in Analytics Platform System and is now in SQL Data Warehouse.

```
-- Load data from Azure blob storage to SQL Data Warehouse 

CREATE TABLE [dbo].[Customer_Speed]
WITH (
	CLUSTERED COLUMNSTORE INDEX
	DISTRIBUTION = HASH([CarSensor_Data].[CustomerKey])
	)
AS SELECT * from [ext].[CarSensor_Data];
```

See [CREATE TABLE AS SELECT (Transact-SQL)][].


## Limitations
Loading with PolyBase only supports UTF-8 encoding style. For other encoding styles, say UTF-16, consider using bcp utility, SSIS or Azure Data Factory to load data into SQL Data Warehouse database.

## Next steps
For more development tips, see [SQL Data Warehouse development overview][].

<!--Image references-->

<!--Article references-->
[Load data with bcp]: ./sql-data-warehouse-load-with-bcp/
[Load with PolyBase]: ./sql-data-warehouse-load-with-polybase/
[solution partners]: ./sql-data-warehouse-solution-partners/
[SQL Data Warehouse development overview]:  ./sql-data-warehouse-overview-develop/

<!--MSDN references-->
[supported source/sink]: https://msdn.microsoft.com/library/dn894007.aspx
[copy activity]: https://msdn.microsoft.com/library/dn835035.aspx
[SQL Server destination adapter]: https://msdn.microsoft.com/library/ms141095.aspx
[SSIS]: https://msdn.microsoft.com/library/ms141026.aspx


<!-- External Links -->
[CREATE EXTERNAL DATA SOURCE (Transact-SQL)]:https://msdn.microsoft.com/library/dn935022(v=sql.130).aspx
[CREATE EXTERNAL FILE FORMAT (Transact-SQL)]:https://msdn.microsoft.com/library/dn935026(v=sql.130).aspx
[CREATE EXTERNAL TABLE (Transact-SQL)]:https://msdn.microsoft.com/library/dn935021(v=sql.130).aspx
[CREATE TABLE AS SELECT (Transact-SQL)]:https://msdn.microsoft.com/library/mt204041.aspx
[CREATE MASTER KEY (Transact-SQL)]:https://msdn.microsoft.com/en-us/library/ms174382.aspx
[CREATE CREDENTIAL (Transact-SQL)]:https://msdn.microsoft.com/en-us/library/ms189522.aspx
[DROP CREDENTIAL (Transact-SQL)]:https://msdn.microsoft.com/en-us/library/ms189450.aspx


