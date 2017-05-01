---
title: Let Azure Stack users create SQL databases | Microsoft Docs
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
ms.topic: get-started-article
ms.date: 5/6/2017
ms.author: erikje

---
# Let Azure Stack users create SQL databases

If your tenants want to create SQL databases, you must add a SQL Server resource provider to your Azure Stack deployment. You can then create an offer that includes the resource provider and have tenants subscribe to it, so they can create their databases. Your users can use these SQL databases with their cloud-native apps, websites, and workloads. To set this up, follow these steps:

## Deploy the App Service resource provider on the POC host

1.	[Deploy the SQL resource provider]( azure-stack-sql-resource-provider-deploy.md#deploy-the-resource-provider).
2.	[Verify the deployment]( azure-stack-sql-resource-provider-deploy.md#verify-the-deployment-using-the-azure-stack-portal).
3.	[Provide capacity by connecting to a hosting SQL server]( azure-stack-sql-resource-provider-deploy.md#provide-capacity-by-connecting-to-a-hosting-sql-server).

## Create an offer that includes the SQL Server service

1.	[Set a quota](azure-stack-setting-quotas.md) and name it *SQLServerQuota*. Select **Microsoft.SQLAdapter** for the **Namespace** field.
2.	[Create a plan](azure-stack-create-plan.md). Name it *TestSQLServerPlan*, select the **Microsoft.SQL** service, and **SQLServerQuota** quota.

    > [!NOTE]
    > To let users create other apps, other services might be required in the plan. For example, Azure Functions requires that the plan include the **Microsoft.Storage** service, while Wordpress requires **Microsoft.MySQL**.
    > 
    >

3.	[Create an offer](azure-stack-create-offer.md), name it **TestSQLServerOffer** and select the ** TestSQLServerPlan** plan.

## As a tenant, create a database in Azure Stack

Now that you've deployed the SQL Server resource provider and created an offer, you can sign in as a tenant, subscribe to the offer, and create a database.

### Subscribe to the offer
1. Sign in to the Azure Stack portal (https://portal.local.azurestack.external) as a tenant.
2. Click **Get a subscription** > type **TestSQLServerSubscription** under **Display Name** > **Select an offer** > **TestSQLServerOffer** > **Create**.
3. Click **More services** > **Subscriptions** > **TestSQLServerSubscription** > **Resource providers**.
4. Click **Register** next to the **Microsoft.SQLAdapter** provider.

### Create a SQL database

1. Click **+** > **Data + Storage** > **SQL Database**.
2. Leave the defaults for the fields, except as follows:
    - **Database Name**: DNNdb
    - **Max Size in MB**: 100
    - **Subscription**: TestAppServiceOffer
    - **Resource Group**: DNN-RG
3. Click **Login Settings**, enter credentials for the database, and then click **OK**. You'll use these credentials later in these steps.
4. Click **SKU** > select the SQL SKU that you created for the SQL Hosting Server > **OK**.
5. Click **Create**.

You can now use the new SQL database with your cloud-native apps, websites, and workloads.


## Next steps
[Let users create web, mobile, and API apps]( azure-stack-tutorial-app-service.md)

