---
title: Query a SQL Database using the query editor in the Azure portal
description: Learn how to connect to SQL Database in the Azure portal by using the SQL Query Editor. Then, run Transact-SQL (T-SQL) statements to query and edit data.
keywords: connect to sql database,query sql database, azure portal, portal, query editor
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom:
ms.devlang:
ms.topic: quickstart
author: Ninarn
ms.author: ninarn
ms.reviewer: carlrab
ms.date: 03/05/2020
---
# Quickstart: Use the Azure portal's query editor to query a SQL database

The query editor is a tool in the Azure portal for executing SQL queries against your Azure SQL Database or Azure SQL Data Warehouse. In this quickstart, you'll use the query editor to run Transact-SQL (T-SQL) statements to query, insert, update, and delete data.

## Prerequisites

To complete this tutorial you need the AdventureWorksLT sample SQL Database. If you don't have a working copy of the AdventureWorksLT SQL Database, use the following quickstart to quickly create one:

- [Quickstart: Create a single database in Azure SQL Database using the Azure portal, PowerShell, and Azure CLI](sql-database-single-database-get-started.md) 

> [!NOTE]
> The query editor uses ports 443 and 1443 to communicate.  Please ensure you have enabled outbound HTTPS traffic on these ports. You also need to add your outbound IP address to the server's allowed firewall rules to access your databases and data warehouses.

## Open the SQL Database Query Editor

1. Sign in to the [Azure portal](https://portal.azure.com/) and select your SQL database.

2. In the **SQL database** menu, select **Query editor (preview)**.

    ![find query editor](./media/sql-database-connect-query-portal/find-query-editor.PNG)



## Connect using SQL Authentication

1. In the **Login** page, under the **SQL server authentication** label, enter a **Login** and **Password** for a user that has access to the database. If you're not sure, use the login and password for the Server admin of the database's server.

    ![sign in](./media/sql-database-connect-query-portal/login-menu.png)

2. Select **OK**.


## Connect using Azure Active Directory

Configuring an Azure Active Directory (Azure AD) administrator enables you to use a single identity to sign in to the Azure portal and your SQL database. To connect to your database using Azure AD, follow the steps below to configure an Azure AD admin for your SQL server.

> [!NOTE]
> * Email accounts (for example, outlook.com, gmail.com, yahoo.com, and so on) aren't yet supported as Azure AD admins. Make sure to choose a user created either natively in the Azure AD, or federated into the Azure AD.
> * Azure AD admin sign in doesn't work with accounts that have 2-factor authentication enabled.

1. In the Azure portal, select your SQL server.

2. On the **SQL server** menu, select **Active Directory admin**.

3. On the SQL server **Active Directory admin** page toolbar, select **Set admin** and choose the user or group as your Azure AD admin.

    ![select active directory](./media/sql-database-connect-query-portal/select-active-directory.png)

4. On the **Add admin** page, in the search box, enter a user or group to find, select it as an admin, and then choose the **Select** button.

5. Back in the SQL server **Active Directory admin** page toolbar, select **Save**.

### Connect to the database

6. In the **SQL server** menu, select **SQL databases**, and then select your SQL database.

7. In the **SQL database** menu, select **Query editor (preview)**. In the **Login** page, under the **Active Directory authentication** label, a message appears saying you have been signed in if you're an Azure AD admin. Then select the **Continue as** *\<your user or group ID>* button. If the page indicates that you have not successfully logged in, you may need to refresh the page.

## Run a query to view data

1. Paste the following query into the query editor:

   ```sql
    SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
    FROM SalesLT.ProductCategory pc
    JOIN SalesLT.Product p
    ON pc.productcategoryid = p.productcategoryid;
   ```

2. Select **Run** and then review the output in the **Results** pane.

   ![query editor results](./media/sql-database-connect-query-portal/query-editor-results.png)

## Run a query to insert data

Run the following [INSERT](/sql/t-sql/statements/insert-transact-sql/) Transact-SQL statement to add a new product in the `SalesLT.Product` table.

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


2. Select **Run**  to insert a new row in the `Product` table. The **Messages** pane displays **Query succeeded: Affected rows: 1**.


## Run a query to update data

Run the following [UPDATE](/sql/t-sql/queries/update-transact-sql/) Transact-SQL statement to modify your new product.

1. Replace the previous query with this one.

   ```sql
   UPDATE [SalesLT].[Product]
   SET [ListPrice] = 125
   WHERE Name = 'myNewProduct';
   ```

2. Select **Run** to update the specified row in the `Product` table. The **Messages** pane displays **Query succeeded: Affected rows: 1**.

## Run a query to delete data

Run the following [DELETE](/sql/t-sql/statements/delete-transact-sql/) Transact-SQL statement to remove your new product.

1. Replace the previous query with this one:

   ```sql
   DELETE FROM [SalesLT].[Product]
   WHERE Name = 'myNewProduct';
   ```

2. Select **Run** to delete the specified row in the `Product` table. The **Messages** pane displays **Query succeeded: Affected rows: 1**.


## Query editor considerations

There are a few things to know when working with the query editor.

* The query editor uses ports 443 and 1443 to communicate. Ensure you have enabled outbound HTTPS traffic on these ports. You will also need to add your outbound IP address to the server's allowed firewall rules to access your databases and data warehouses.

* Pressing **F5** refreshes the query editor page and any query being worked on is lost.

* Query editor doesn't support connecting to the `master` database.

* There's a 5-minute timeout for query execution.

* The query editor only supports cylindrical projection for geography data types.

* There's no support for IntelliSense for database tables and views, but the editor does support autocomplete on names that have already been typed.


## Next steps

To learn more about the Transact-SQL (T-SQL) supported in Azure SQL databases, see [Resolving Transact-SQL differences during migration to SQL Database](sql-database-transact-sql-information.md).
