---
title: 'Create a single database - Azure SQL Database | Microsoft Docs'
description: Create and query a single database in Azure SQL Database using the Azure portal, PowerShell and Azure CLI.
services: sql-database
ms.service: sql-database
ms.subservice: single-database
ms.custom:
ms.devlang:
ms.topic: quickstart
author: sachinpMSFT
ms.author: ninarn
ms.reviewer: carlrab, sstein
ms.date: 09/09/2019
---
# Quickstart: Create a single database in Azure SQL Database using the Azure portal, PowerShell, and Azure CLI

Creating a [single database](sql-database-single-database.md) is the quickest and simplest deployment option for creating a database in Azure SQL Database. This quickstart shows you how to create and then query a single database using the Azure portal.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/). 

For all steps in this quickstart, sign in to the [Azure portal](https://portal.azure.com/).

## Create a single database

A single database can either be created in the provisioned or serverless compute tier.

- A single database in the provisioned compute tier is pre-allocated a fixed amount of compute resources including CPU and memory using one of two [purchasing models](sql-database-purchase-models.md).
- A single database in the serverless compute tier has a range of compute resources including CPU and memory that are auto-scaled and is only available in the [vCore-based purchasing models](sql-database-service-tiers-vcore.md).

When you create a single database, you also define a [SQL Database server](sql-database-servers.md) to manage it and place it within [Azure resource group](../azure-resource-manager/resource-group-overview.md) in a specified region.

> [!NOTE]
> This quickstart uses the [vCore-based purchasing model](sql-database-service-tiers-vcore.md), but the [DTU-based purchasing model](sql-database-service-tiers-DTU.md) is also available.

To create a single database containing the AdventureWorksLT sample data:

[!INCLUDE [sql-database-create-single-database](includes/sql-database-create-single-database.md)]

## Query the database

Now that you've created the database, use the built-in query tool in the Azure portal to connect to the database and query the data.

1. On the **SQL Database** page for your database, select **Query editor (preview)** in the left menu.

   ![Sign in to Query editor](./media/sql-database-get-started-portal/query-editor-login.png)

2. Enter your login information, and select **OK**.
3. Enter the following query in the **Query editor** pane.

   ```sql
   SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
   FROM SalesLT.ProductCategory pc
   JOIN SalesLT.Product p
   ON pc.productcategoryid = p.productcategoryid;
   ```

4. Select **Run**, and then review the query results in the **Results** pane.

   ![Query editor results](./media/sql-database-get-started-portal/query-editor-results.png)

5. Close the **Query editor** page, and select **OK** when prompted to discard your unsaved edits.

## Clean up resources

Keep this resource group, database server, and single database if you want to go to the [Next steps](#next-steps). The next steps show you how to connect and query your database using different methods.

When you're finished using these resources, you can delete them as follows:

1. From the left menu in the Azure portal, select **Resource groups**, and then select **myResourceGroup**.
2. On your resource group page, select **Delete resource group**.
3. Enter *myResourceGroup* in the field, and then select **Delete**.

## Next steps

- Create a server-level firewall rule to connect to the single database from on-premises or remote tools. For more information, see [Create a server-level firewall rule](sql-database-server-level-firewall-rule.md).
- After you create a server-level firewall rule, [connect and query](sql-database-connect-query.md) your database using several different tools and languages.
  - [Connect and query using SQL Server Management Studio](sql-database-connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
- To create a single database in the provisioned compute tier using Azure CLI, see [Azure CLI samples](sql-database-cli-samples.md).
- To create a single database in the provisioned compute tier using Azure PowerShell, see [Azure PowerShell samples](sql-database-powershell-samples.md).
- To create a single database in the serverless compute tier using Azure Powershell, see [Create serverless database](sql-database-serverless.md#create-new-database-in-serverless-compute-tier).
