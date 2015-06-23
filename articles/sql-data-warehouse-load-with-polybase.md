<properties
   pageTitle="Use PolyBase to load data into SQL Data Warehouse | Microsoft Azure"
   description="Learn what PolyBase is and how to use it for data warehousing scenarios."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="sahaj08"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/23/2015"
   ms.author="sahajs;barbkess"/>


# Use PolyBase to load data into SQL Data Warehouse
PolyBase is an integration technology that allows you to query and join data from multiple sources, all by using Transact-SQL commands.

With PolyBase you can:
- Use Transact-SQL to import and query data stored in Azure blob storage. 
- Simplify ETL process by loading data first and then transforming it in SQL Data Warehouse.
- Build an integrated solution since PolyBase works with Microsoft’s business intelligence stack (e.g., SSRS, SSAS, PowerPivot, PowerQuery, PowerView) and third party tools (e.g., Tableau, Microstrategy, Cognos).


This tutorial shows you how to: 

- Create these PolyBase objects: external data source, external file format, and external table. 
- Query data stored in Azure blob storage.
- Import data from Azure blob storage into SQL Data Warehouse.


## Prerequisites
To step through this tutorial, you need:
- Azure storage account
- Your own data stored in Azure blob storage as text files with the pipe character ('|') separating the fields.


## Step 1: Create PolyBase external objects

In this step, you will create the external objects that PolyBase requires for connecting to and querying data in Azure blob storage.

### Create a database credential
To access Azure blob storage, you need to create a database credential that stores your Azure storage account information. This is a new construct in SQL-based products. The syntax shown below is what works right now, but will be changing slightly.

```
-- Creating master key
CREATE MASTER KEY ENCRYPTION BY PASSWORD = 'S0me!nfo';
-- Creating credential
CREATE CREDENTIAL WASBSecret ON DATABASE WITH IDENTITY = 'joe', Secret = 'myazurestoragekey==';
```

### Create an external data source
The external data source is an object stored in SQL Data Warehouse that stores the location of the Azure blob storage data and your access information.

```
-- Create external data source (Azure blob storage) 
CREATE EXTERNAL DATA SOURCE azure_storage 
WITH (
	TYPE = HADOOP, 
       LOCATION ='wasb[s]://mycontainer@ test.blob.core.windows.net/path’,
      CREDENTIAL = WASBSecret
)
```

Reference topic: [CREATE EXTERNAL DATA SOURCE][].

### Create an external file format
The external file format is an object that the format of the external data. In this example, the data is a text file and the fields are separated with the pipe character ('|').

```
-- Create external file format (delimited text file)
CREATE EXTERNAL FILE FORMAT text_file_format 
WITH (
	FORMAT_TYPE = DELIMITEDTEXT, 
	FORMAT_OPTIONS (
		FIELD_TERMINATOR ='|', 
		USE_TYPE_DEFAULT = TRUE
	)
)
```
Reference topic: [CREATE EXTERNAL FILE FORMAT][].


### Create an external table

The external table definition is similar to a relational table definition. The key difference is the location and the format of the data. The external table definition is stored in SQL Data Warehouse. The data is stored the location specified by the data source.

The LOCATION option specifies the path to the data from the root of the data source. In this example, the data is located at 'wasb[s]://mycontainer@ test.blob.core.windows.net/path/Demo/car_sensordata.tbl'.

```
-- Creating external table pointing to file stored in Azure Storage
CREATE EXTERNAL TABLE [dbo].[CarSensor_Data] (
    [SensorKey] int NOT NULL, 
    [CustomerKey] int NOT NULL, 
    [GeographyKey] int NULL, 
    [Speed] float NOT NULL, 
    [YearMeasured] int NOT NULL
)
WITH (LOCATION='/Demo/car_sensordata.tbl',
      DATA_SOURCE = azure_storage,
      FILE_FORMAT = text_file_format,      
)
```

Reference topic: [CREATE EXTERNAL TABLE][].

### View the external objects

The objects just created are stored in SQL Data Warehouse. You can view them in the SQL Server Data Tools (SSDT) Object Explorer.


## Query data in Azure blob storage
Queries against external tables simply use the table name as though it was a relational table. 

This is an ad-hoc query that joins insurance customer data stored in SQL Data Warehouse, with automobile sensor data stored in Azure storage blob. The result shows the drivers that drive faster than others.

```
-- Join relational data with Azure blob storage data. 
SELECT DISTINCT
    Insured_Customers.FirstName,
    Insured_Customers.LastName,
    Insured_Customers.YearlyIncome,
    CarSensor_Data.Speed
FROM Insured_Customers, CarSensor_Data
WHERE Insured_Customers.CustomerKey = CarSensor_Data.CustomerKey and CarSensor_Data.Speed > 60 
ORDER BY CarSensor_Data.Speed desc
```

## Import data from Azure blob storage
This example imports speed data for drivers who drive more than 35 mph. The purpose is to speed up further analysis by storing the data directly in SQL Data Warehouse and by storing the data with columnstore technology.

Storing data directly removes the data transfer time for queries. Storing data with a columnstore index improves query performance for analysis queries by up to 10x.

This example uses the CREATE TABLE AS SELECT statement to import data. The new table inherits the columns named in the query. It inherits the data types of those columns from the external table definition. 

CREATE TABLE AS SELECT is a highly performant Transact-SQL statement  that replaces INSERT...SELECT.  It was originally developed for  the massively parallel processing (MPP) engine in Analytics Platform System and is now in SQL Data Warehouse.

```
-- Import speed data for analysis of drivers who drive more than 35 mph. 

CREATE TABLE Fast_Customers
WITH (
	CLUSTERED COLUMNSTORE INDEX
	DISTRIBUTION = HASH(Insured_Customers.CustomerKey)
	)
AS SELECT DISTINCT 
    Insured_Customers.FirstName,
    Insured_Customers.LastName,
    Insured_Customers.YearlyIncome,
    Insured_Customers.MaritalStatus
FROM Insured_Customers INNER JOIN 
(
	SELECT * from CarSensor_Data where Speed > 35 
) as SensorD
ON Insured_Customers.CustomerKey = SensorD.CustomerKey
ORDER BY YearlyIncome

```
See [CREATE TABLE AS SELECT][].



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


<!--Other Web references-->
[CREATE EXTERNAL DATA SOURCE]: https://msdn.microsoft.com/library/dn935022.aspx
[CREATE EXTERNAL FILE FORMAT]: https://msdn.microsoft.com/library/dn935026.aspx
[CREATE EXTERNAL TABLE]: https://msdn.microsoft.com/library/dn935021.aspx
[CREATE TABLE AS SELECT]: https://msdn.microsoft.com/library/mt204041.aspx

