---
title: "Quickstart: Create an instance using the Azure portal"
titleSuffix: Azure Database Migration Service
description: Use the Azure portal to create an instance of Azure Database Migration Service.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 01/29/2021
ms.service: dms
ms.topic: quickstart
ms.custom:
  - seo-lt-2019
  - mode-ui
  - sql-migration-content
---

# Quickstart: Create an instance of the Azure Database Migration Service by using the Azure portal

In this quickstart, you use the Azure portal to create an instance of Azure Database Migration Service. After you create the instance, you can use it to migrate data from multiple database sources to Azure data platforms, such as from SQL Server to Azure SQL Database or from SQL Server to an Azure SQL Managed Instance.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

From a web browser, sign in to the [Azure portal](https://portal.azure.com). The default view is your service dashboard.

> [!NOTE]
> You can create up to 10 instances of DMS per subscription per region. If you require a greater number of instances, please create a support ticket.

<!--- Register the resource provider -->
[!INCLUDE [resource-provider-register](../../includes/database-migration-service-resource-provider-register.md)]

<!--- Create an instance of the service -->
[!INCLUDE [instance-create](../../includes/database-migration-service-instance-create.md)]  

## Clean up resources

You can clean up the resources created in this quickstart by deleting the [Azure resource group](../azure-resource-manager/management/overview.md). To delete the resource group, navigate to the instance of the Azure Database Migration Service that you created. Select the **Resource group** name, and then select **Delete resource group**. This action deletes all assets in the resource group as well as the group itself.

## Next steps

* [Migrate SQL Server to Azure SQL Database](tutorial-sql-server-to-azure-sql.md)
* [Migrate SQL Server to an Azure SQL Managed Instance offline](tutorial-sql-server-to-managed-instance.md)
* [Migrate SQL Server to an Azure SQL Managed Instance online](tutorial-sql-server-managed-instance-online.md)
