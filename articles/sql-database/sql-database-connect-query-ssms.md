---
title: "SSMS: Connect and query data"
description: Learn how to connect to SQL Database on Azure by using SQL Server Management Studio (SSMS). Then run Transact-SQL (T-SQL) statements to query and edit data.
keywords: connect to sql database,sql server management studio
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 03/10/2020
---
# Quickstart: Use SQL Server Management Studio to connect and query an Azure SQL database

In this quickstart, you'll learn how to use SQL Server Management Studio (SSMS) to connect to an Azure SQL database and run some queries.

## Prerequisites

Completing this quickstart requires the following items:

- [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms/).
- The AdventureWorksLT sample database. If you need a working copy of the AdventureWorksLT database, create one by completing the [Create an Azure SQL database](sql-database-single-database-get-started.md) quickstart.
    - The scripts in this article are written to use the AdventureWorksLT database. If you are using a managed instance, you must either import the AdventureWorks database into an instance database or modify the scripts in this article to use the Wide World Importers database.

If you simply want to run some ad-hoc queries without installing SSMS, see [Quickstart: Use the Azure portal's query editor to query a SQL database](sql-database-connect-query-portal.md).

## Get SQL server connection information

Get the connection information you need to connect to your database. You'll need the fully qualified server name or host name, database name, and login information to complete this quickstart.

1. Sign in to the [Azure portal](https://portal.azure.com/).

2. Navigate to the **SQL database** or **SQL managed instance** you want to query.

3. On the **Overview** page, copy the fully qualified server name. It's next to **Server name** for a single database, or the fully qualified server name next to **Host** for a managed instance. The fully qualified name looks like: *servername.database.windows.net*, except it has your actual server name.

## Connect to your database

In SSMS, connect to your Azure SQL Database server.

> [!IMPORTANT]
> An Azure SQL Database server listens on port 1433. To connect to a SQL Database server from behind a corporate firewall, the firewall must have this port open.

1. Open SSMS.

2. The **Connect to Server** dialog box appears. Enter the following information:

   | Setting      | Suggested value    | Description |
   | ------------ | ------------------ | ----------- |
   | **Server type** | Database engine | Required value. |
   | **Server name** | The fully qualified server name | Something like: **servername.database.windows.net**. |
   | **Authentication** | SQL Server Authentication | This tutorial uses SQL Authentication. |
   | **Login** | Server admin account user ID | The user ID from the server admin account used to create the server. |
   | **Password** | Server admin account password | The password from the server admin account used to create the server. |
   ||||

   ![connect to server](./media/sql-database-connect-query-ssms/connect.png)  

3. Select **Options** in the **Connect to Server** dialog box. In the **Connect to database** drop-down menu, select **mySampleDatabase**. Completing the quickstart in the [Prerequisites section](#prerequisites) creates an AdventureWorksLT database named mySampleDatabase. If your working copy of the AdventureWorks database has a different name than mySampleDatabase, then select it instead.

   ![connect to db on server](./media/sql-database-connect-query-ssms/options-connect-to-db.png)  

4. Select **Connect**. The Object Explorer window opens.

5. To view the database's objects, expand **Databases** and then expand your database node.

   ![mySampleDatabase objects](./media/sql-database-connect-query-ssms/connected.png)  

## Query data

Run this [SELECT](https://msdn.microsoft.com/library/ms189499.aspx) Transact-SQL code to query for the top 20 products by category.

1. In Object Explorer, right-click **mySampleDatabase** and select **New Query**. A new query window connected to your database opens.

2. In the query window, paste the following SQL query:

   ```sql
   SELECT pc.Name as CategoryName, p.name as ProductName
   FROM [SalesLT].[ProductCategory] pc
   JOIN [SalesLT].[Product] p
   ON pc.productcategoryid = p.productcategoryid;
   ```

3. On the toolbar, select **Execute** to run the query and retrieve data from the `Product` and `ProductCategory` tables.

    ![query to retrieve data from table Product and ProductCategory](./media/sql-database-connect-query-ssms/query2.png)

### Insert data

Run this [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) Transact-SQL code to create a new product in the `SalesLT.Product` table.

1. Replace the previous query with this one.

   ```sql
   INSERT INTO [SalesLT].[Product]
           ( [Name]
           , [ProductNumber]
           , [Color]
           , [ProductCategoryID]
           , [StandardCost]
           , [ListPrice]
           , [SellStartDate] )
     VALUES
           ('myNewProduct'
           ,123456789
           ,'NewColor'
           ,1
           ,100
           ,100
           ,GETDATE() );
   ```

2. Select **Execute**  to insert a new row in the `Product` table. The **Messages** pane displays **(1 row affected)**.

#### View the result

1. Replace the previous query with this one.

   ```sql
   SELECT * FROM [SalesLT].[Product]
   WHERE Name='myNewProduct'
   ```

2. Select **Execute**. The following result appears.

   ![result of Product table query](./media/sql-database-connect-query-ssms/result.png)

### Update data

Run this [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) Transact-SQL code to modify your new product.

1. Replace the previous query with this one that returns the new record created previously:

   ```sql
   UPDATE [SalesLT].[Product]
   SET [ListPrice] = 125
   WHERE Name = 'myNewProduct';
   ```

2. Select **Execute** to update the specified row in the `Product` table. The **Messages** pane displays **(1 row affected)**.

### Delete data

Run this [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) Transact-SQL code to remove your new product.

1. Replace the previous query with this one.

   ```sql
   DELETE FROM [SalesLT].[Product]
   WHERE Name = 'myNewProduct';
   ```

2. Select **Execute** to delete the specified row in the `Product` table. The **Messages** pane displays **(1 row affected)**.

## Next steps

- For information about SSMS, see [SQL Server Management Studio](https://msdn.microsoft.com/library/ms174173.aspx).
- To connect and query using the Azure portal, see [Connect and query with the Azure portal SQL Query editor](sql-database-connect-query-portal.md).
- To connect and query using Visual Studio Code, see [Connect and query with Visual Studio Code](sql-database-connect-query-vscode.md).
- To connect and query using .NET, see [Connect and query with .NET](sql-database-connect-query-dotnet.md).
- To connect and query using PHP, see [Connect and query with PHP](sql-database-connect-query-php.md).
- To connect and query using Node.js, see [Connect and query with Node.js](sql-database-connect-query-nodejs.md).
- To connect and query using Java, see [Connect and query with Java](sql-database-connect-query-java.md).
- To connect and query using Python, see [Connect and query with Python](sql-database-connect-query-python.md).
- To connect and query using Ruby, see [Connect and query with Ruby](sql-database-connect-query-ruby.md).
