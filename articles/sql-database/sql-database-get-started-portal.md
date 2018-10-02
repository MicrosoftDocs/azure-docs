---
title: 'Azure portal: Create a SQL database | Microsoft Docs'
description: Create a SQL Database logical server, server-level firewall rule, and database in the Azure portal, and query it.
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.custom: 
ms.devlang: 
ms.topic: quickstart
author: sachinpMSFT
ms.author: sachinp
ms.reviewer: carlrab
manager: craigg
ms.date: 09/07/2018
---
# Create an Azure SQL database in the Azure portal

This quickstart walks through how to create a SQL database in Azure using the [DTU-based purchasing model](sql-database-service-tiers-dtu.md). Azure SQL Database is a “Database-as-a-Service” offering that enables you to run and scale highly available SQL Server databases in the cloud. This quickstart shows you how to get started by creating and then querying a SQL database using the Azure portal.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

  >[!NOTE]
  >This tutorial uses the DTU-based purchasing model but the [vCore-based purchasing model](sql-database-service-tiers-vcore.md) is also available.

## Log in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create a SQL database

An Azure SQL database is created with a defined set of [compute and storage resources](sql-database-service-tiers-dtu.md). The database is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md) and in an [Azure SQL Database logical server](sql-database-features.md).

Follow these steps to create a SQL database containing the Adventure Works LT sample data.

1. Click **Create a resource** in the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **Create** under **SQL Database** on the **New** page.

   ![create database-1](./media/sql-database-get-started-portal/create-database-1.png)

3. Fill out the SQL Database form with the following information, as shown on the preceding image:   

   | Setting       | Suggested value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Database name** | mySampleDatabase | For valid database names, see [Database Identifiers](https://docs.microsoft.com/sql/relational-databases/databases/database-identifiers). |
   | **Subscription** | Your subscription  | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group**  | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Select source** | Sample (AdventureWorksLT) | Loads the AdventureWorksLT schema and data into your new database |

   > [!IMPORTANT]
   > You must select the sample database on this form because it is used in the remainder of this quickstart.
   >

4. Under **Server**, click **Configure required settings** and fill out the SQL server (logical server) form with the following information, as shown on the following image:   

   | Setting       | Suggested value | Description |
   | ------------ | ------------------ | ------------------------------------------------- |
   | **Server name** | Any globally unique name | For valid server names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Server admin login** | Any valid name | For valid login names, see [Database Identifiers](https://docs.microsoft.com/sql/relational-databases/databases/database-identifiers). |
   | **Password** | Any valid password | Your password must have at least 8 characters and must contain characters from three of the following categories: upper case characters, lower case characters, numbers, and non-alphanumeric characters. |
   | **Subscription** | Your subscription | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Location** | Any valid location | For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/). |

   > [!IMPORTANT]
   > The server admin login and password that you specify here are required to log in to the server and its databases later in this quickstart. Remember or record this information for later use.
   >  

   ![create database-server](./media/sql-database-get-started-portal/create-database-server.png)

5. When you have completed the form, click **Select**.

6. Click **Pricing tier** to specify the service tier, the number of DTUs, and the amount of storage. Explore the options for the amount of DTUs and storage that is available to you for each service tier.

   > [!IMPORTANT]
   > More than 1 TB of storage in the Premium tier is currently available in all regions except the following: UK North, West Central US, UK South2, China East, USDoDCentral, Germany Central, USDoDEast, US Gov Southwest, US Gov South Central, Germany Northeast,  China North, US Gov East. In other regions, the storage max in the Premium tier is limited to 1 TB. See [P11-P15 Current Limitations]( sql-database-dtu-resource-limits-single-databases.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  

7. For this quickstart, select the **Standard** service tier and then use the slider to select **10 DTUs (S0)** and **1** GB of storage.

   ![create database-s1](./media/sql-database-get-started-portal/create-database-s1.png)

8. Accept the preview terms to use the **Add-on Storage** option.

   > [!IMPORTANT]
   > More than 1 TB of storage in the Premium tier is currently available in all regions except the following: West Central US, China East, USDoDCentral, USGov Iowa, Germany Central, USDoDEast, US Gov Southwest, Germany Northeast,  China North. In other regions, the storage max in the Premium tier is limited to 1 TB. See [P11-P15 Current Limitations]( sql-database-dtu-resource-limits-single-databases.md#single-database-limitations-of-p11-and-p15-when-the-maximum-size-greater-than-1-tb).  

9. After selecting the server tier, the number of DTUs, and the amount of storage, click **Apply**.  

10. Now that you have completed the SQL Database form, click **Create** to provision the database. Provisioning takes a few minutes.

11. On the toolbar, click **Notifications** to monitor the deployment process.

     ![notification](./media/sql-database-get-started-portal/notification.png)

## Query the SQL database

Now that you have created a sample database in Azure, let’s use the built-in query tool within the Azure portal to confirm that you can connect to the database and query the data.

1. On the SQL Database page for your database, click **Query editor (preview)** in the left-hand menu and then click **Login**.

   ![login](./media/sql-database-get-started-portal/query-editor-login.png)

2. Select SQL server authentication, provide the required login information, and then click **OK** to log in.

3. After you are authenticated as **ServerAdmin**, type the following query in the query editor pane.

   ```sql
   SELECT TOP 20 pc.Name as CategoryName, p.name as ProductName
   FROM SalesLT.ProductCategory pc
   JOIN SalesLT.Product p
   ON pc.productcategoryid = p.productcategoryid;
   ```

4. Click **Run** and then review the query results in the **Results** pane.

   ![query editor results](./media/sql-database-get-started-portal/query-editor-results.png)

5. Close the **Query editor** page, click **OK** to discard your unsaved edits.

## Clean up resources

Save these resources if you want to go to [Next steps](#next-steps) and learn how to connect and query your database using a number of different methods. If, however, you wish to delete the resources that you created in this quickstart, use the following steps.


1. From the left-hand menu in the Azure portal, click **Resource groups** and then click **myResourceGroup**.
2. On your resource group page, click **Delete**, type **myResourceGroup** in the text box, and then click **Delete**.

## Next steps

- Now that you have a database, you need to create a server-level firewall rule to connect to it from your on-premises tools. See [Create server-level firewall rule](sql-database-get-started-portal-firewall.md)
- If creating a server-level firewall rule, you can [connect and query](sql-database-connect-query.md) using one of your favorite tools or languages, including
  - [Connect and query using SQL Server Management Studio](sql-database-connect-query-ssms.md)
  - [Connect and query using Azure Data Studio](https://docs.microsoft.com/sql/azure-data-studio/quickstart-sql-database?toc=/azure/sql-database/toc.json)
- To create databases using Azure CLI, see [Azure CLI samples](sql-database-cli-samples.md)
- To create databases using Azure PowerShell, see [Azure PowerShell samples](sql-database-powershell-samples.md)