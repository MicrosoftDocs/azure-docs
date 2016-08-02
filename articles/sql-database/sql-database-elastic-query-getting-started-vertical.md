<properties
	pageTitle="Get started with cross-database queries (vertical partitioning) | Microsoft Azure"	
	description="how to use elastic database query with vertically partitioned databases"
	services="sql-database"
	documentationCenter=""  
	manager="jhubbard"
	authors="torsteng"/>

<tags
	ms.service="sql-database"
	ms.workload="sql-database"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/23/2016"
	ms.author="torsteng" />

# Get started with cross-database queries (vertical partitioning) (preview)

Elastic database query (preview) for Azure SQL Database allows you to run T-SQL queries that span multiple databases using a single connection point. This topic applies to [vertically partitioned databases](sql-database-elastic-query-vertical-partitioning.md).  

When completed, you will: learn how to configure and use an Azure SQL Database to perform queries that span multiple related databases. 

For more information about the elastic database query feature, please see  [Azure SQL Database elastic database query overview](sql-database-elastic-query-overview.md). 

## Create the sample databases

To start with, we need to create two databases, **Customers** and **Orders**, either in the same or different logical servers.   

Execute the following queries on the **Orders** database to create the **OrderInformation** table and input the sample data. 

	CREATE TABLE [dbo].[OrderInformation]( 
		[OrderID] [int] NOT NULL, 
		[CustomerID] [int] NOT NULL 
		) 
	INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (123, 1) 
	INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (149, 2) 
	INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (857, 2) 
	INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (321, 1) 
	INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (564, 8) 

Now, execute following query on the **Customers** database to create the **CustomerInformation** table and input the sample data. 

	CREATE TABLE [dbo].[CustomerInformation]( 
		[CustomerID] [int] NOT NULL, 
		[CustomerName] [varchar](50) NULL, 
		[Company] [varchar](50) NULL 
		CONSTRAINT [CustID] PRIMARY KEY CLUSTERED ([CustomerID] ASC) 
	) 
	INSERT INTO [dbo].[CustomerInformation] ([CustomerID], [CustomerName], [Company]) VALUES (1, 'Jack', 'ABC') 
	INSERT INTO [dbo].[CustomerInformation] ([CustomerID], [CustomerName], [Company]) VALUES (2, 'Steve', 'XYZ') 
	INSERT INTO [dbo].[CustomerInformation] ([CustomerID], [CustomerName], [Company]) VALUES (3, 'Lylla', 'MNO') 

## Create database objects
### Database scoped master key and credentials

1. Open SQL Server Management Studio or SQL Server Data Tools in Visual Studio.
2. Connect to the Orders database and execute the following T-SQL commands:

		CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<password>'; 
		CREATE DATABASE SCOPED CREDENTIAL ElasticDBQueryCred 
		WITH IDENTITY = '<username>', 
		SECRET = '<password>';  

	The "username" and "password" should be the username and password used to login into the Customers database.
	Authentication using Azure Active Directory with elastic queries is not currently supported.

### External data sources
To create an external data source, execute the following command on the Orders database: 

	CREATE EXTERNAL DATA SOURCE MyElasticDBQueryDataSrc WITH 
		(TYPE = RDBMS, 
		LOCATION = '<server_name>.database.windows.net', 
		DATABASE_NAME = 'Customers', 
		CREDENTIAL = ElasticDBQueryCred, 
	) ;

### External tables
Create an external table on the Orders database, which matches the definition of the CustomerInformation table:

	CREATE EXTERNAL TABLE [dbo].[CustomerInformation] 
	( [CustomerID] [int] NOT NULL, 
	  [CustomerName] [varchar](50) NOT NULL, 
	  [Company] [varchar](50) NOT NULL) 
	WITH 
	( DATA_SOURCE = MyElasticDBQueryDataSrc) 

## Execute a sample elastic database T-SQL query

Once you have defined your external data source and your external tables you can now use T-SQL to query your external tables. Execute this query on the Orders database: 

	SELECT OrderInformation.CustomerID, OrderInformation.OrderId, CustomerInformation.CustomerName, CustomerInformation.Company 
	FROM OrderInformation 
	INNER JOIN CustomerInformation 
	ON CustomerInformation.CustomerID = OrderInformation.CustomerID 

## Cost

Currently, the elastic database query feature is included into the cost of your Azure SQL Database.  

For pricing information see [SQL Database Pricing](/pricing/details/sql-database). 


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->

<!--anchors-->
