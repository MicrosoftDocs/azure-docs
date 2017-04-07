---
title: 'VS Code: Connect and query data in Azure SQL Database | Microsoft Docs'
description: Learn how to connect to SQL Database on Azure by using Visual Studio Code. Then, run Transact-SQL (T-SQL) statements to query and edit data.
metacanonical: ''
keywords: connect to sql database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 676bd799-a571-4bb8-848b-fb1720007866
ms.service: sql-database
ms.custom: quick start manage
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 03/17/2017
ms.author: carlrab

---
# Azure SQL Database: Use Visual Studio Code to connect and query data

[Visual Studio Code](https://code.visualstudio.com/docs) is a graphical code editor for Linux, macOS, and Windows that supports extensions. Use Visual Studio Code With the [mssql extension](https://aka.ms/mssql-marketplace) to connect to and query an Azure SQL database. This quick start details using Visual Studio Code to connect to an Azure SQL database, and then execute query, insert, update, and delete statements.

This quick start uses as its starting point the resources created in one of these quick starts:

- [Create DB - Portal](sql-database-get-started-portal.md)
- [Create DB - CLI](sql-database-get-started-cli.md)

Before you start, make sure you have installed the newest version of [Visual Studio Code](https://code.visualstudio.com/Download) and loaded the [mssql extension](https://aka.ms/mssql-marketplace). For installation guidance for the mssql extension, see [Install VS Code](https://docs.microsoft.com/sql/linux/sql-server-linux-develop-use-vscode#install-vs-code). 

## Get connection information

Get the fully qualified server name for your Azure SQL Database server in the Azure portal. You use the fully qualified server name to connect to your server using Visual Studio Code.

1. Log in to the [Azure portal](https://portal.azure.com/).
2. Select **SQL Databases** from the left-hand menu, and click your database on the **SQL databases** page. 
3. In the **Essentials** pane in the Azure portal page for your database, locate and then copy the **Server name** to use later in this quick start.

    <img src="./media/sql-database-connect-query-ssms/connection-information.png" alt="connection information" style="width: 780px;" />

## Set language mode to SQL

Set the language mode is set to **SQL** in Visual Studio Code to enable mssql commands and T-SQL IntelliSense.

1. Open a new Visual Studio Code window. 

2. Press **CTRL+K,M**, type **SQL** and press **ENTER** to set the language mode to SQL. 

<img src="./media/sql-database-connect-query-vscode/vscode-language-mode.png" alt="SQL language mode" style="width: 780px;" />

## Connect to the server

Use Visual Studio Code to establish a connection to your Azure SQL Database server.

1. In VS Code, press **CTRL+SHIFT+P** (or **F1**) to open the Command Palette.

2. Type **sqlcon** and press **ENTER**.

3. Click **Yes** to set your language to **SQL**.

4. Press **ENTER** to select **Create Connection Profile**. This creates a connection profile for your SQL Server instance.

5. Follow the prompts to specify the connection properties for the new connection profile. After specifying each value, press **ENTER** to continue. 

   The following table describes the Connection Profile properties.

   | Setting | Description |
   |-----|-----|
   | **Server name** | Enter your fully qualified server name, such as **mynewserver20170313.database.windows.net** |
   | **Database name** | Enter your database name, such as **mySampleDatabase** |
   | **Authentication** | Select SQL Login |
   | **User name** | Enter your server admin account |
   | **Password (SQL Login)** | Enter the password for your server admin account | 
   | **Save Password?** | Select **Yes** or **No** |
   | **[Optional] Enter a name for this profile** | Enter a connection profile name, such as **mySampleDatabase**. 

6. Press the **ESC** key to close the info message that informs you that the profile is created and connected.

7. Verify your connection in the status bar.

   <img src="./media/sql-database-connect-query-vscode/vscode-connection-status.png" alt="Connection status" style="width: 780px;" />

## Query data

Use the [SELECT](https://msdn.microsoft.com/library/ms189499.aspx) Transact-SQL statement to query data in your Azure SQL database.

1. In the **Editor** window, enter the following query in the empty query window:

   ```sql
   SELECT pc.Name as CategoryName, p.name as ProductName
   FROM [SalesLT].[ProductCategory] pc
   JOIN [SalesLT].[Product] p
   ON pc.productcategoryid = p.productcategoryid;
   ```

3. Press **CTRL+SHIFT+E** to retrieve data from the Product and ProductCategory tables.

    <img src="./media/sql-database-connect-query-vscode/query.png" alt="Query" style="width: 780px;" />

## Insert data

Use the [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) Transact-SQL statement to insert data into your Azure SQL database.

1. In the **Editor** window, delete the previous query and enter the following query:

   ```sql
   INSERT INTO [SalesLT].[Product]
           ( [Name]
           , [ProductNumber]
           , [Color]
           , [ProductCategoryID]
		   , [StandardCost]
		   , [ListPrice]
		   , [SellStartDate]
		   )
     VALUES
           ('myNewProduct'
           ,123456789
           ,'NewColor'
           ,1
		   ,100
		   ,100
		   ,GETDATE() );
   ```

3. Press **CTRL+SHIFT+E** to insert a new row in the Product table.

## Update data

Use the [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) Transact-SQL statement to update data in your Azure SQL database.

1.  In the **Editor** window, delete the previous query and enter the following query:

   ```sql
   UPDATE [SalesLT].[Product]
   SET [ListPrice] = 125
   WHERE Name = 'myNewProduct';
   ```

3. Press **CTRL+SHIFT+E** to update the specified row in the Product table.

## Delete data

Use the [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) Transact-SQL statement to delete data in your Azure SQL database.

1. In the **Editor** window, delete the previous query and enter the following query:

   ```sql
   DELETE FROM [SalesLT].[Product]
   WHERE Name = 'myNewProduct';
   ```

3. Press **CTRL+SHIFT+E** to delete the specified row in the Product table.

## Next steps

- For information about Visual Studio Code, see [Visual Studio Code](https://code.visualstudio.com/docs)
- For information about querying and editing data using SQL Server Management Studio, see [SSMS](https://msdn.microsoft.com/library/ms174173.aspx).
