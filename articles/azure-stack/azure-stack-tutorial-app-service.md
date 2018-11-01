---
title: Make web, and API apps available to your Azure Stack users | Microsoft Docs
description: Tutorial to install the App Service resource provider and create offers that give your Azure Stack users the ability to create web, and API apps.
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
ms.date: 10/15/2018
ms.author: jeffgilb
ms.reviewer: 
ms.custom: mvc
---
# Tutorial: make web and API apps available to your Azure Stack users

As an Azure Stack cloud administrator, you can create offers that let your users (tenants) create Azure Functions and web, and API applications. By giving your users access to these on-demand, cloud-based apps, you can save them time and resources.

To set this up, you will:

> [!div class="checklist"]
> * Deploy the App Service resource provider
> * Create an offer
> * Test the offer

## Deploy the App Service resource provider

1. [Prepare the Azure Stack Development Kit host](azure-stack-app-service-before-you-get-started.md). This includes deploying the SQL Server resource provider, which is required for creating some apps.
2. [Download the installer and helper scripts](azure-stack-app-service-deploy.md).
3. [Run the helper script to create required certificates](azure-stack-app-service-deploy.md).
4. [Install the App Service resource provider](azure-stack-app-service-deploy.md) (It will take a couple hours to install and for all the worker roles to appear.)
5. [Validate the installation](azure-stack-app-service-deploy.md#validate-the-app-service-on-azure-stack-installation).

## Create an offer

As an example, you can create an offer that lets users create DNN web content management systems. It requires the SQL Server service which you already enabled by installing the SQL Server resource provider.

1.	[Set a quota](azure-stack-setting-quotas.md) and name it *AppServiceQuota*. Select **Microsoft.Web** for the **Namespace** field.
2.	[Create a plan](azure-stack-create-plan.md). Name it *TestAppServicePlan*, select the **Microsoft.SQL** service and the **AppService Quota** quota.

    > [!NOTE]
    > To let users create other apps, other services might be required in the plan. For example, Azure Functions requires the **Microsoft.Storage** service in the plan, while Wordpress requires **Microsoft.MySQL**.

3.	[Create an offer](azure-stack-create-offer.md), name it **TestAppServiceOffer** and select the **TestAppServicePlan** plan.

## Test the offer

Now that you've deployed the App Service resource provider and created an offer, you can sign in as a user, subscribe to the offer, and create an app.

For this example, we'll create a DNN Platform content management system. First, you create a SQL database and then the DNN web app.

### Subscribe to the offer

1. Sign in to the Azure Stack portal (https://portal.local.azurestack.external) as a tenant.
2. Select **Get a subscription** >, enter **TestAppServiceSubscription** under **Display Name** > **Select an offer** > **TestAppServiceOffer** > **Create**.

### Create a SQL database

1. Select **+** > **Data + Storage** > **SQL Database**.
2. Keep the default values, except for the following fields:

    - **Database Name**: DNNdb
    - **Max Size in MB**: 100
    - **Subscription**: TestAppServiceOffer
    - **Resource Group**: DNN-RG

3. Select **Login Settings**, enter credentials for the database, and then select **OK**. You'll use these credentials later in this tutorial.
4. Under **SKU** > select the SQL SKU that you created for the SQL Hosting Server > and then select **OK**.
5. Select **Create**.

### Create a DNN app

1. Select **+** > **See all** > **DNN Platform preview** > **Create**.
2. Enter *DNNapp* under **App name** and select **TestAppServiceOffer** under **Subscription**.
3. Select **Configure required settings** > **Create New** > to enter an **App Service plan** name.
4. Select **Pricing tier** > **F1 Free** > **Select** > **OK**.
5. Select **Database** and enter the credentials for the SQL database you created earlier.
6. Select **Create**.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Deploy the App Service resource provider
> * Create an offer
> * Test the offer

Advance to the next tutorial to learn how to:

> [!div class="nextstepaction"]
> [Deploy apps to Azure and Azure Stack](user/azure-stack-solution-pipeline.md)
