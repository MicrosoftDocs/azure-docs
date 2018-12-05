---
title: 'Azure portal: Query Azure SQL Database using Query Editor | Microsoft Docs'
description: Learn how to connect to SQL Database in the Azure portal by using the SQL Query Editor. Then, run Transact-SQL (T-SQL) statements to query and edit data.
keywords: connect to sql database,azure portal, portal, query editor
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: AyoOlubeko
ms.author: ayolubek
ms.reviewer: carlrab
manager: craigg
ms.date: 12/05/2018
---
# Quickstart: Azure portal: Use the SQL Query editor to connect and query data

The SQL Query editor is an Azure portal browser tool providing an easy way to execute SQL queries on your Azure SQL Database or Azure SQL Data Warehouse. This quickstart demonstrates using the Query editor to connect to a SQL database and run Transact-SQL statements to query, insert, update, and delete data.

## Prerequisites

This tutorial uses the resources created in one of these quickstarts:

[!INCLUDE [prerequisites-create-db](../../includes/sql-database-connect-query-prerequisites-create-db-includes.md)]

> [!NOTE]
> Make sure that the "Allow access to Azure Services" option is set to "ON" in your SQL Server firewall settings. This option gives the SQL Query editor access to your databases and data warehouses.

## Connect using SQL Authentication

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **SQL databases** from the left-hand menu and choose the one you would like to query.

2. In the left-hand menu, find and select **Query editor (preview)**.

    ![find query editor](./media/sql-database-connect-query-portal/find-query-editor.PNG)

3. If the Login page doesn't automatically appear, select **Login** from the toolbar. Select  **SQL Server authentication** and enter the user ID and password of the server admin account used to create the database.

    ![sign in](./media/sql-database-connect-query-portal/login-menu.png)

4. Select **OK**.


## Connect using Azure AD

Configuring an Active Directory administrator enables you to use a single identity to sign in to the Azure portal and your SQL database. Follow the steps below to configure an active directory admin for your SQL Server.

> [!NOTES]
* Email accounts (for example, outlook.com, gmail.com, yahoo.com, and so on) are not yet supported as Active Directory administrators. Make sure to choose a user created either natively in the Azure Active Directory, or federated into the Azure Active directory.
* Azure Active Directory Administrator sign in doesn't work with accounts that have 2-factor authentication enabled.

1. Select **All Resources** from the left-hand menu. In the page that appears, find and select your SQL Server.

2. From your SQL Server's settings menu, select **Active Directory Admin**.

3. In the Active Directory admin page, select  **Set admin** and choose the user or group as your Active Directory administrator.

    ![select active directory](./media/sql-database-connect-query-portal/select-active-directory.png)

4. At the top of the Active Directory admin page, select **Save**.

Navigate to the SQL database you would like to query and click **Data explorer (preview)** from the left-hand menu. The Data explorer page opens and automatically connects you to the database.


## View data

1. After you're authenticated, paste the following SQL in the Query editor to retrieve the top 20 products by category.

```sql
    SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
    FROM SalesLT.ProductCategory pc
    JOIN SalesLT.Product p
    ON pc.productcategoryid = p.productcategoryid;
```

2. On the toolbar, select **Run** and then review the output in the **Results** pane.

![query editor results](./media/sql-database-connect-query-portal/query-editor-results.png)

## Insert data

Use the following [INSERT](https://msdn.microsoft.com/library/ms174335.aspx) Transact-SQL statement to add a new product in the `SalesLT.Product` table.

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


2. Select **Run**  to insert a new row in the Product table. The **Messages** pane displays "Query succeeded: Affected rows: 1".


## Update data

Use the following [UPDATE](https://msdn.microsoft.com/library/ms177523.aspx) Transact-SQL statement to modify your new product.

1. Replace the previous query with this one.

   ```sql
   UPDATE [SalesLT].[Product]
   SET [ListPrice] = 125
   WHERE Name = 'myNewProduct';
   ```

2. Select **Run** to update the specified row in the Product table. The **Messages** pane displays "Query succeeded: Affected rows: 1".

## Delete data

Use the following [DELETE](https://msdn.microsoft.com/library/ms189835.aspx) Transact-SQL statement to remove your new product.

1. Replace the previous query with this one:

   ```sql
   DELETE FROM [SalesLT].[Product]
   WHERE Name = 'myNewProduct';
   ```

2. Select **Run** to delete the specified row in the Product table. The **Messages** pane displays "Query succeeded: Affected rows: 1".


## Query editor considerations

There are a few things to know when working with the Query editor.

1. You can't use the Query editor to query SQL server databases in a Virtual Network.

1. Pressing F5 refreshes the Query editor page and any query being worked on is lost.

4. Query editor doesn't support connecting to the master database.

5. There's a 5-minute timeout for query execution.


7. Email accounts (for example, outlook.com, hotmail.com, gmail.com, and so on) aren't yet supported as Active Directory administrators. Make sure to choose a user that was either created natively in the Azure Active Directory, or federated into the Azure Active directory

8. The Query editor only supports cylindrical projection for geography data types.

9. There's no support for IntelliSense for database tables and views. However, the editor does support autocomplete on names that have already been typed.


## Next steps

- To learn more about the Transact-SQL supported in Azure SQL databases, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).
