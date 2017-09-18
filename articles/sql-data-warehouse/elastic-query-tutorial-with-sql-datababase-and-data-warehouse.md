--
title: Elastic Query Tutorial with SQL Data Warehouse | Microsoft Docs
description: 'Learn how to use Elastic Query with SQL Data Warehouse '
services: sql-data-warehouse
documentationcenter: NA
author: hirokib
manager: johnmac
editor: ''

ms.assetid: e2dc8f3f-10e3-4589-a4e2-50c67dfcf67f
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: integrate
ms.date: 09/18/2017
ms.author: elbutter

--


# Elastic Query with SQL Data Warehouse

In this tutorial, you will learn how to use Elastic Query to submit a query from SQL Database to SQL Data Warehouse. Elastic Query is functionality that exists between Azure SQL products. For more information about Elastic Query as a concept, see [**Elastic Query Concepts with SQL Data Warehouse**][Elastic Query Concepts with SQL Data Warehouse]

## Prerequisites for the tutorial

Before you begin the tutorial, you must have the following prerequisites:

1. Installed SQL Server Management Studio (SSMS).
2. Created an Azure SQL server with a  database and data warehouse within this server.
3. Setup firewall rules for accessing the Azure SQL Server.

## Setup connection between SQL Data Warehouse and SQL Database instances 

1. Using SSMS or another query client, open a new query for database **master** on your logical server.

2. Create a login and user that will represent the SQL database to data warehouse connection.

  ```sql
  CREATE LOGIN SalesDBLogin WITH PASSWORD = 'aReallyStrongPassword!@#';
  ```

3. Using SSMS or another query client, open a new query for the **SQL data warehouse instance** on your logical server.

4. Create a user on the data warehouse instance with the login you created in Step 2

   ```sql
   CREATE USER SalesDBUser FOR LOGIN SalesDBLogin;
   ```

5. Grant permissions to the user from Step 4 that you would like the SQL Database would like to execute. In this example, permission is only being granted for SELECT on a specific schema. This illustrates
   how we may restrict the database to a specific domain of our control. 

   ```sql
   GRANT SELECT ON SCHEMA :: [dbo] TO SalesDBUser;
   ```

6. Using SSMS or another query c

7. lient, open a new query for the **SQL database instance** on your logical server.

8. Create a master key if you do not already have one. 

   ```sql
   CREATE MASTER KEY; 
   ```

9. Create a database scoped credential using the credentials you created in Step 2.

   ```sql
   CREATE DATABASE SCOPED CREDENTIAL SalesDBElasticCredential
   WITH IDENTITY = 'SalesDBLogin',
   SECRET = 'aReallyStrongPassword@#!';
   ```

10. Create an external data source which points to the data warehouse instance.

    ```sql
    CREATE EXTERNAL DATA SOURCE EnterpriseDwSrc WITH 
        (TYPE = RDBMS, 
        LOCATION = '<SERVER NAME>.database.windows.net', 
        DATABASE_NAME = '<SQL DATA WAREHOUSE NAME>', 
        CREDENTIAL = SalesDBElasticCredential, 
    ) ;
    ```

11. Now you can create external tables that reference this external data source. Queries using those tables will be sent to the data warehouse instance to be processed and sent back to the database instance.


## Elastic Query from SQL database to SQL data warehouse

In the next few steps we will create a table in our data warehouse instance with several values. We will then demonstrate how to set up an external table to query the data warehouse instance from the database instance.

1. Using SSMS or another query client, open a new query for the **SQL Data Warehouse** on your logical server.

2. Submit the following query to create an **OrdersInformation** table in your data warehouse instance.

   ```sql
   CREATE TABLE [dbo].[OrderInformation]
   ( 
       [OrderID] [int] NOT NULL, 
       [CustomerID] [int] NOT NULL 
   ) 
   INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (123, 1) 
   INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (149, 2) 
   INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (857, 2) 
   INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (321, 1) 
   INSERT INTO [dbo].[OrderInformation] ([OrderID], [CustomerID]) VALUES (564, 8)
   ```

3. Using SSMS or another query client, open a new query for the **SQL database** on your logical server.

4. Submit the following query to create an external table definition that points to the **OrdersInformation** table in the data warehouse instance.

   ```sql
   CREATE EXTERNAL TABLE [dbo].[OrderInformation]
   ( 
       [OrderID] [int] NOT NULL, 
       [CustomerID] [int] NOT NULL 
   ) 
   WITH 
   (DATA_SOURCE = EnterpriseDwSrc)
   ```

5. Observe that you now have an external table definition in your **SQL database instance**.

   ![elastic query external table definition](./media/sql-data-warehouse-elastic-query-with-sql-database/elastic-query-external-table.png)


6. Submit the following query, which will query the data warehouse instance. You should receive the five values that you inserted in Step 2. 

```sql
SELECT * FROM [dbo].[OrderInformation];
```

> [!NOTE]
>
> You should notice that despite few values, this query takes considerable time to return. When using elastic query with data warehouse, one should consider the overhead costs of query processing and movement over the wire. Avoid moving small subsections of data.

Congratulations, you have set up the very basics of Elastic Query. 






<!--Image references-->

<!--Article references-->

[Elastic Query Concepts with SQL Data Warehouse]: ./sql-data-warehouse-elastic-query-with-sql-database-concepts.md

<!--MSDN references-->

<!--Other Web references-->