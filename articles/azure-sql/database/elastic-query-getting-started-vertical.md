---
title: Get started with cross-database queries
description: how to use elastic database query with vertically partitioned databases
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 01/25/2019
---
# Get started with cross-database queries (vertical partitioning) (preview)
[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

Elastic database query (preview) for Azure SQL Database allows you to run T-SQL queries that span multiple databases using a single connection point. This article applies to [vertically partitioned databases](elastic-query-vertical-partitioning.md).  

When completed, you will: learn how to configure and use an Azure SQL Database to perform queries that span multiple related databases.

For more information about the elastic database query feature, see  [Azure SQL Database elastic database query overview](elastic-query-overview.md).

## Prerequisites

ALTER ANY EXTERNAL DATA SOURCE permission is required. This permission is included with the ALTER DATABASE permission. ALTER ANY EXTERNAL DATA SOURCE permissions are needed to refer to the underlying data source.

## Create the sample databases

To start with, create two databases, **Customers** and **Orders**, either in the same or different servers.

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

        CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<master_key_password>';
        CREATE DATABASE SCOPED CREDENTIAL ElasticDBQueryCred
        WITH IDENTITY = '<username>',
        SECRET = '<password>';  

    The "username" and "password" should be the username and password used to log in into the Customers database.
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

Once you have defined your external data source and your external tables, you can now use T-SQL to query your external tables. Execute this query on the Orders database:

    SELECT OrderInformation.CustomerID, OrderInformation.OrderId, CustomerInformation.CustomerName, CustomerInformation.Company
    FROM OrderInformation
    INNER JOIN CustomerInformation
    ON CustomerInformation.CustomerID = OrderInformation.CustomerID

## Cost

Currently, the elastic database query feature is included into the cost of your Azure SQL Database.  

For pricing information, see [SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database).

## Next steps

* For an overview of elastic query, see [Elastic query overview](elastic-query-overview.md).
* For syntax and sample queries for vertically partitioned data, see [Querying vertically partitioned data)](elastic-query-vertical-partitioning.md)
* For a horizontal partitioning (sharding) tutorial, see [Getting started with elastic query for horizontal partitioning (sharding)](elastic-query-getting-started.md).
* For syntax and sample queries for horizontally partitioned data, see [Querying horizontally partitioned data)](elastic-query-horizontal-partitioning.md)
* See [sp\_execute \_remote](https://msdn.microsoft.com/library/mt703714) for a stored procedure that executes a Transact-SQL statement on a single remote Azure SQL Database or set of databases serving as shards in a horizontal partitioning scheme.
