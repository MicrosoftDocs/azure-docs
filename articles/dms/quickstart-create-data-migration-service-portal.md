---
title:  Create Azure Database Migration Service instance using the Azure portal | Microsoft Docs
description: Use the Azure portal to create an instance of the Azure Database Migration Service
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

# Create a Database Migration Service instance using the Azure portal
In this quick start, you use the Azure portal to create an instance of the Azure Database Migration Service.  After you create the service, you will be able to use it to migrate data from SQL Server on premises to an Azure SQL database.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Log in to the Azure portal
Open your web browser, and navigate to the [Microsoft Azure portal](https://portal.azure.com/). Enter your credentials to sign in to the portal. The default view is your service dashboard.

## Create Azure Database Migration Service
1. Click **+** to create a new service.  Database Migration Service is still in preview.  

1. Search the marketplace for "migration", select "Database Migration Service (preview)," then click **create**.

    ![Create migration service](media/quickstart-create-data-migration-service-portal/dms-create-service.png)

1. Choose a **Service name** that is memorable and unique to identify your Azure Database Migration Service Instance.

1. Select your Azure **Subscription** in which you want to create the Database Migration Service.

1. Create a new **Network** with a unique name.

1. Choose the **Location** that is closest to your source or target server.

1. Select Basic: 1 vCore for the **Pricing tier**.

1. Click **Create**.

After a few moments, your Azure Database Migration service will be created and ready to use.

## Next steps
> [!div class="nextstepaction"]
> [Migrate SQL Server on-premises to Azure SQL DB](tutorial-sql-server-to-azure-sql.md)