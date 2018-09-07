---
title: Make SQL databases available to your Azure Stack users | Microsoft Docs
description: Tutorial to install the SQL Server resource provider and create offers that let Azure Stack users create SQL databases.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: jeffgilb
ms.reviewer: 
ms.custom: mvc

---
# Tutorial: make SQL databases available to your Azure Stack users

As an Azure Stack cloud administrator, you can create offers that let your users (tenants) create SQL databases that they can use with their cloud-native apps, websites, and workloads. By providing these custom, on-demand, cloud-based databases to your users, you can save them time and resources. To set this up, you will:

> [!div class="checklist"]
> * Deploy the SQL Server resource provider
> * Create an offer
> * Test the offer

## Deploy the SQL Server resource provider

The deployment process is described in detail in the [Use SQL databases on Azure Stack article](azure-stack-sql-resource-provider-deploy.md), and consists of the following primary steps:

1. [Deploy the SQL resource provider](azure-stack-sql-resource-provider-deploy.md).
2. [Verify the deployment](azure-stack-sql-resource-provider-deploy.md#verify-the-deployment-using-the-azure-stack-portal).
3. Provide capacity by connecting to a hosting SQL server. For more information, see [Add hosting servers](azure-stack-sql-resource-provider-hosting-servers.md)

## Create an offer

1.	[Set a quota](azure-stack-setting-quotas.md) and name it *SQLServerQuota*. Select **Microsoft.SQLAdapter** for the **Namespace** field.
2.	[Create a plan](azure-stack-create-plan.md). Name it *TestSQLServerPlan*, select the **Microsoft.SQLAdapter** service, and **SQLServerQuota** quota.

    > [!NOTE]
    > To let users create other apps, other services might be required in the plan. For example, Azure Functions requires the **Microsoft.Storage** service in the plan, while Wordpress requires **Microsoft.MySQLAdapter**.

3.	[Create an offer](azure-stack-create-offer.md), name it **TestSQLServerOffer** and select the **TestSQLServerPlan** plan.

## Test the offer

Now that you've deployed the SQL Server resource provider and created an offer, you can sign in as a user, subscribe to the offer, and create a database.

### Subscribe to the offer

1. Sign in to the Azure Stack portal (https://portal.local.azurestack.external) as a tenant.
2. Select **Get a subscription** and then enter  **TestSQLServerSubscription** under **Display Name**.
3. Select **Select an offer** > **TestSQLServerOffer** > **Create**.
4. Select **All services** > **Subscriptions** > **TestSQLServerSubscription** > **Resource providers**.
5. Select **Register** next to the **Microsoft.SQLAdapter** provider.

### Create a SQL database

1. Select **+** > **Data + Storage** > **SQL Database**.
2. Keep the default values or use these examples for the following fields:
    - **Database Name**: SQLdb
    - **Max Size in MB**: 100
    - **Subscription**: TestSQLOffer
    - **Resource Group**: SQL-RG
3. Select **Login Settings**, enter credentials for the database, and then select **OK**.
4. Select **SKU** > select the SQL SKU that you created for the SQL Hosting Server > and then select **OK**.
5. Select **Create**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Deploy the SQL Server resource provider
> * Create an offer
> * Test the offer

Advance to the next tutorial to learn how to:

> [!div class="nextstepaction"]
> [Make web, mobile, and API apps available to your users]( azure-stack-tutorial-app-service.md)