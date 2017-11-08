---
title:  Prepare to migrate AdventureWorks2014 from SQL Server to Azure SQL | Microsoft Docs
description: Prepare to migrate AdventureWorks2014 from SQL Server to Azure SQL using Data Migration Assistant and Data Migration Service.
services: database-migration
author: edmacauley
ms.author: edmaca
manager: craigg
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: quickstart
ms.date: 11/08/2017
---

# Prepare to migrate AdventureWorks
In order to complete your first migration, you will need a few components set up.  In this quickstart you will create an instance of the Azure Database Migration Service, create an empty Azure SQL Database, and download the Microsoft Data Migration Assistant.  You can finish this Quickstart in about five minutes.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal
Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create Azure Data Migration Service
Click **+** to create a new service.  Data Migration Service is still in preview.  Search the marketplace for "migration" and select "Data Migration Service (preview)."

![Create migration service](media/quickstart-prepare-to-migrate/DMSCreateMigrationService.png)

Setting|Suggested value|Description
---|---|---
Service name |*example-name*|Choose a unique name that identifies your Azure Data Migration Service.
Subscription|*my subscription*|The Azure subscription that you want to use. If you have multiple subscriptions, choose the appropriate subscription in which the resource is billed for.
Network|*mynetworkname*| Create a new network with a unique name.
Location |*mylocation*| Choose the location that is closest to your source or target server.

## Create a SQL Database
An Azure SQL database is created with a defined set of [compute and storage resources](../sql-database/sql-database-service-tiers.md). The database is created within an [Azure resource group](../azure-resource-manager/resource-group-overview.md) and in an [Azure SQL Database logical server](../sql-database/sql-database-features.md). 

Follow these steps to create an empty SQL database. 

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Databases** from the **New** page, and select **Create** under **SQL Database** on the **New** page.

   ![create database-1](./media/quickstart-prepare-to-migrate/create-database-1.png)

3. Fill out the SQL Database form with the following information, as shown on the preceding image:   

   | Setting       | Suggested value | Description | 
   | ------------ | ------------------ | ------------------------------------------------- | 
   | **Database name** | mySampleDatabase | For valid database names, see [Database Identifiers](https://docs.microsoft.com/en-us/sql/relational-databases/databases/database-identifiers). | 
   | **Subscription** | Your subscription  | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group**  | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Select source** | Blank database | Creates an empty database |


4. Under **Server**, click **Configure required settings** and fill out the SQL server (logical server) form with the following information:   

   | Setting       | Suggested value | Description | 
   | ------------ | ------------------ | ------------------------------------------------- | 
   | **Server name** | Any globally unique name | For valid server names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). | 
   | **Server admin login** | Any valid name | For valid login names, see [Database Identifiers](https://docs.microsoft.com/en-us/sql/relational-databases/databases/database-identifiers). |
   | **Password** | Any valid password | Your password must have at least 8 characters and must contain characters from three of the following categories: upper case characters, lower case characters, numbers, and and non-alphanumeric characters. |
   | **Subscription** | Your subscription | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Location** | Any valid location | For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/). |

   > [!IMPORTANT]
   > The server admin login and password that you specify here are required to log in to the server and its databases later in this quick start. Remember or record this information for later use. 
   >  

   ![create database-server](./media/quickstart-prepare-to-migrate/create-database-server.png)

5. When you have completed the form, click **Select**.

6. Click **Pricing tier** to specify the service tier, the number of DTUs, and the amount of storage. Explore the options for the amount of DTUs and storage that is available to you for each service tier. 

   > [!IMPORTANT]
   > \* Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). 
   > 

7. For this quick start tutorial, select the **Standard** service tier and then use the slider to select **100 DTUs (S3)** and **400** GB of storage.

   ![create database-s1](./media/quickstart-prepare-to-migrate/create-database-s1.png)

8. Accept the preview terms to use the **Add-on Storage** option. 

   > [!IMPORTANT]
   > \* Storage sizes greater than the amount of included storage are in preview and extra costs apply. For details, see [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/). 
   > 

9. After selecting the server tier, the number of DTUs, and the amount of storage, click **Apply**.  

10. Now that you have completed the SQL Database form, click **Create** to provision the database. Provisioning takes a few minutes. 

11. On the toolbar, click **Notifications** to monitor the deployment process.
    
     ![notification](./media/quickstart-prepare-to-migrate/notification.png)

## Install Data Migration Assistant
Azure Data Migration Service uses the Microsoft Data Migration Assistant to migrate schema from a source SQL Server to an Azure SQL instance.  To install DMA, download the latest version of the tool from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=53595), and then run the **DataMigrationAssistant.msi** file.


## Next steps
> [!div class="nextstepaction"]
> [Migrate SQL Server on-premises to Azure SQL DB](howto-sql-server-to-azure-sql.md)