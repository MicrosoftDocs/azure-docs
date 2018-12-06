---
title: 'VS Code: Connect and query data in Azure SQL Database | Microsoft Docs'
description: Learn how to connect to SQL Database on Azure by using Visual Studio Code. Then, run Transact-SQL (T-SQL) statements to query and edit data.
keywords: connect to sql database
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 12/06/2018
---
# Quickstart: Use Visual Studio Code to connect and query an Azure SQL Database

[Visual Studio Code](https://code.visualstudio.com/docs) is a graphical code editor for Linux, macOS, and Windows. It supports extensions, including the [mssql extension](https://aka.ms/mssql-marketplace) for querying Microsoft SQL Server, Azure SQL Database, and SQL Data Warehouse. This quickstart demonstrates using Visual Studio Code to connect to an Azure SQL database and then run Transact-SQL statements to query, insert, update, and delete data.

## Prerequisites

This tutorial uses the resources created in one of these quickstarts:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

#### Install Visual Studio Code

Make sure you have installed the latest [Visual Studio Code](https://code.visualstudio.com/Download) and loaded the [mssql extension](https://aka.ms/mssql-marketplace). For guidance on installing the mssql extension, see [Install VS Code](https://docs.microsoft.com/sql/linux/sql-server-linux-develop-use-vscode#install-vs-code) and [mssql for Visual Studio Code
](https://marketplace.visualstudio.com/items?itemName=ms-mssql.mssql). 

## Configure Visual Studio Code 

### **Mac OS**
For macOS, you need to install OpenSSL, which is a prerequisite for .Net Core that mssql extension uses. Open your terminal and enter the following commands to install **brew** and **OpenSSL**. 

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew install openssl
mkdir -p /usr/local/lib
ln -s /usr/local/opt/openssl/lib/libcrypto.1.0.0.dylib /usr/local/lib/
ln -s /usr/local/opt/openssl/lib/libssl.1.0.0.dylib /usr/local/lib/
```

### **Linux (Ubuntu)**

No special configuration needed.

### **Windows**

No special configuration needed.

## SQL server connection information

Get connection information for your Azure SQL database. You'll need the fully qualified server name, database name, and sign in credentials for the next procedures.

[!INCLUDE [prerequisites-server-connection-info](../../includes/sql-database-connect-query-prerequisites-server-connection-info-includes.md)]

## Set language mode to SQL

In Visual Studio Code, set the language mode to **SQL**  to enable mssql commands and T-SQL IntelliSense.

1. Open a new Visual Studio Code window. 

2. Press **CTRL**+**N**. A new plain text file opens. 

3. Select **Plain Text** in the status bar's lower right-hand corner.

4. In the **Select language mode** drop-down menu that opens, select **SQL**. 

## Connect to your database

Use Visual Studio Code to establish a connection to your Azure SQL Database server.

> [!IMPORTANT]
> Before continuing, make sure that you have your server and login information ready. Once you begin entering the connection profile information, if you change your focus from Visual Studio Code, you have to restart creating the profile.
>

1. In Visual Studio Code, press **Ctrl+Shift+P** (or **F1**) to open the Command Palette.

2. Select **MS SQL:Connect** and press **Enter**.

3. Select **Create Connection Profile**.

4. Follow the prompts to specify the new profile's connection properties. After specifying each value, press **Enter** to continue. 

   | Property       | Suggested value | Description |
   | ------------ | ------------------ | ------------------------------------------------- | 
   | **Server name** | The fully qualified server name | Something like: **mynewserver20170313.database.windows.net**. |
   | **Database name** | mySampleDatabase | The database to connect to. |
   | **Authentication** | SQL Login| This tutorial uses SQL Authentication. |
   | **User name** | User name | The user name of the server admin account used to create the server. |
   | **Password (SQL Login)** | Password | The password of the server admin account used to create the server. |
   | **Save Password?** | Yes or No | Select **Yes** if you do not want to enter the password each time. |
   | **Enter a name for this profile** | A profile name, such as **mySampleProfile** | A saved profile speeds your connection on subsequent logins. | 

   If successful, a notification appears saying your profile is created and connected.

## Query data

Use the following [SELECT](https://msdn.microsoft.com/library/ms189499.aspx) Transact-SQL statement to query for the top 20 products by category.

1. In the **Editor** window, paste the following SQL query.

   ```sql
   SELECT pc.Name as CategoryName, p.name as ProductName
   FROM [SalesLT].[ProductCategory] pc
   JOIN [SalesLT].[Product] p
   ON pc.productcategoryid = p.productcategoryid;
   ```

2. Press **Ctrl**+**Shift**+**E** to execute the query and display results from the Product and ProductCategory tables.

    ![Query](./media/sql-database-connect-query-vscode/query.png)

## Insert data

Use the following [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) Transact-SQL statement to add a new product into the `SalesLT.Product` table.

1. Replace the previous query with this one.

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

2. Press **Ctrl**+**Shift**+**E** to insert a new row in the Product table.

## Update data

Use the following [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) Transact-SQL statement to update the added product.

1. Replace the previous query with this one:

   ```sql
   UPDATE [SalesLT].[Product]
   SET [ListPrice] = 125
   WHERE Name = 'myNewProduct';
   ```

2. Press **Ctrl**+**Shift**+**E** to update the specified row in the Product table.

## Delete data

Use the following [DELETE](https://docs.microsoft.com/sql/t-sql/statements/delete-transact-sql) Transact-SQL statement to remove the new product.

1. Replace the previous query with this one:

   ```sql
   DELETE FROM [SalesLT].[Product]
   WHERE Name = 'myNewProduct';
   ```

2. Press **Ctrl**+**Shift**+**E** to delete the specified row in the Product table.

## Next steps

- To connect and query using SQL Server Management Studio, see [Quickstart: Azure SQL Database: Use SQL Server Management Studio to connect and query data](sql-database-connect-query-ssms.md).
- To connect and query using the Azure portal, see [Quickstart: Azure portal: Use the SQL Query editor to connect and query data](sql-database-connect-query-portal.md).
- For an MSDN magazine article on using Visual Studio Code, see [Create a database IDE with MSSQL extension blog post](https://msdn.microsoft.com/magazine/mt809115).
