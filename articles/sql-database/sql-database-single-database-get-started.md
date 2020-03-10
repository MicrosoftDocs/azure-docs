---
title: Create a single database
description: Create an  Azure SQL Database single database using the Azure portal, PowerShell, or Azure CLI. Query the database with Query Editor in the Azure portal.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom:
ms.devlang:
ms.topic: quickstart
author: v-thepet
ms.author: v-thepet
# ms.reviewer: carlrab, sstein, vanto
ms.date: 03/06/2020
---
# Quickstart: Create an Azure SQL Database single database

In this quickstart, you use the Azure portal, a PowerShell script, or an Azure CLI script to create an Azure SQL Database single database. You then query the database using **Query editor** in the Azure portal. 

A [single database](sql-database-single-database.md) is the quickest and simplest deployment option for Azure SQL Database. You manage a single database within a [SQL Database server](sql-database-servers.md), which is inside an [Azure resource group](../azure-resource-manager/management/overview.md) in a specified Azure region. In this quickstart, you create a new resource group and SQL server for the new database.

You can create a single database in the *provisioned* or *serverless* compute tier. A provisioned database is pre-allocated a fixed amount of compute resources, including CPU and memory, and uses one of two [purchasing models](sql-database-purchase-models.md). This quickstart creates a provisioned database using the [vCore-based](sql-database-service-tiers-vcore.md) purchasing model, but you can also choose a [DTU-based](sql-database-service-tiers-DTU.md) model. 

The serverless compute tier is only available in the vCore-based purchasing model, and has an auto-scaled range of compute resources, including CPU and memory. To create a single database in the serverless compute tier, see [Create a serverless database](sql-database-serverless.md#create-new-database-in-serverless-compute-tier).

This quickstart requires an active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/). 

## Create a single database

[!INCLUDE [sql-database-create-single-database](includes/sql-database-create-single-database.md)]

## Query the database

Now you can use the built-in **Query editor** in the Azure portal to connect to the database and query the data.

1. On the **SQL Database** page for your database, select **Query editor (preview)** in the left menu.
2. Enter your server admin login information, and select **OK**.
   
   ![Sign in to Query editor](./media/sql-database-single-database-get-started/query-editor-login.png)

3. Enter the following query in the **Query editor** pane.

   ```sql
   SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
   FROM SalesLT.ProductCategory pc
   JOIN SalesLT.Product p
   ON pc.productcategoryid = p.productcategoryid;
   ```

4. Select **Run**, and then review the query results in the **Results** pane.

   ![Query editor results](./media/sql-database-single-database-get-started/query-editor-results.png)

5. Close the **Query editor** page, and select **OK** when prompted to discard your unsaved edits.

## Clean up resources

Keep the resource group, server, and single database to go on to the next steps, and learn how to connect and query your database with different methods.

When you're finished using these resources, you can delete them as follows:

1. From the left menu in the Azure portal, select **Resource groups**, and then select **myResourceGroup**.
2. On your resource group page, select **Delete resource group**.
3. Enter *myResourceGroup* in the field, and then select **Delete**.

## Next steps

You can [connect and query](sql-database-connect-query.md) your database using several different tools and languages:
  - [Connect and query using SQL Server Management Studio](sql-database-connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
