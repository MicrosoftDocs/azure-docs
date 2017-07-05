---
title: Make SQL databases available to your Azure Stack users | Microsoft Docs
description: Tutorial to install the SQL Server resource provider and create offers that let Azure Stack users create SQL databases.
services: azure-stack
documentationcenter: ''
author: ErikjeMS
manager: 
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 5/10/2017
ms.author: erikje
ms.custom: mvc

---
# Make SQL databases available to your Azure Stack users

As an Azure Stack administrator, you can create offers that let your users (tenants) create SQL databases that they can use with their cloud-native apps, websites, and workloads. By providing these custom, on-demand, cloud-based databases to your users, you can save them time and resources. To set this up, you will:

> [!div class="checklist"]
> * Deploy the SQL Server resource provider
> * Create an offer
> * Test the offer

## Deploy the SQL Server resource provider

The deployment process is described in detail in the [Use SQL databases on Azure Stack article](azure-stack-sql-resource-provider-deploy.md), and is comprised of the following primary steps:

1.	[Deploy the SQL resource provider on the POC host]( azure-stack-sql-resource-provider-deploy.md#deploy-the-resource-provider).
2.	[Verify the deployment]( azure-stack-sql-resource-provider-deploy.md#verify-the-deployment-using-the-azure-stack-portal).
3.	[Provide capacity by connecting to a hosting SQL server]( azure-stack-sql-resource-provider-deploy.md#provide-capacity-by-connecting-to-a-hosting-sql-server).

## Create an offer

1.	[Set a quota](azure-stack-setting-quotas.md) and name it *SQLServerQuota*. Select **Microsoft.SQLAdapter** for the **Namespace** field.
2.	[Create a plan](azure-stack-create-plan.md). Name it *TestSQLServerPlan*, select the **Microsoft.SQLAdapter** service, and **SQLServerQuota** quota.

    > [!NOTE]
    > To let users create other apps, other services might be required in the plan. For example, Azure Functions requires that the plan include the **Microsoft.Storage** service, while Wordpress requires **Microsoft.MySQLAdapter**.
    > 
    >

3.	[Create an offer](azure-stack-create-offer.md), name it **TestSQLServerOffer** and select the **TestSQLServerPlan** plan.

## Test the offer

Now that you've deployed the SQL Server resource provider and created an offer, you can sign in as a user, subscribe to the offer, and create a database.

### Subscribe to the offer
1. Sign in to the Azure Stack portal (https://portal.local.azurestack.external) as a tenant.
2. Click **Get a subscription** and then type **TestSQLServerSubscription** under **Display Name**.
3. Click **Select an offer** > **TestSQLServerOffer** > **Create**.
4. Click **More services** > **Subscriptions** > **TestSQLServerSubscription** > **Resource providers**.
5. Click **Register** next to the **Microsoft.SQLAdapter** provider.

### Create a SQL database

1. Click **+** > **Data + Storage** > **SQL Database**.
2. Leave the defaults for the fields, or you can use these examples:
    - **Database Name**: SQLdb
    - **Max Size in MB**: 100
    - **Subscription**: TestSQLOffer
    - **Resource Group**: SQL-RG
3. Click **Login Settings**, enter credentials for the database, and then click **OK**.
4. Click **SKU** > select the SQL SKU that you created for the SQL Hosting Server > **OK**.
5. Click **Create**.

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Deploy the SQL Server resource provider
> * Create an offer
> * Test the offer

Advance to the next tutorial to learn how to:

> [!div class="nextstepaction"]
> [Make web, mobile, and API apps available to your users]( azure-stack-tutorial-app-service.md)

