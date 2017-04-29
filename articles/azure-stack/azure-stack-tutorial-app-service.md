---
title: Give Azure Stack users the ability to create web, mobile, and API apps | Microsoft Docs
description: Tutorial to install the App Service resource provider and create offers that give Azure Stack users the ability to create web, mobile, and API apps.
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
ms.date: 4/30/2017
ms.author: erikje

---
# Let Azure Stack users create web, mobile, and API apps

If your tenants want to create web, mobile, or API applications, you must add an App Service Resource Provider to your Azure Stack deployment. You can then create an offer that includes App Service and have tenants subscribe to it, so they can create their apps. To set this up, follow these steps (it will take a couple hours to install and for all the worker roles to appear):

## Prepare the POC host

1. Confirm that your Azure Stack POC host meets the requirements for the App Service resource provider:
    - Azure Stack Technical Preview 3.
    - 20 GB of free disk space for a small deployment of the App Service resource provider.
2. You must use the PowerShell Integrated Scripting Environment (ISE) as an administrator, which requires that you [turn off Internet enhanced security](azure-stack-app-service-before-you-get-started.md#turn-off-internet-explorer-enhanced-security) and [enable cookies](azure-stack-app-service-before-you-get-started.md#enable-cookies).
3. [Install PowerShell for Azure Stack](azure-stack-powershell-install.md) and [install Visual Studio](azure-stack-install-visual-studio.md).
4. [Add a Windows Server 2016 virtual machine image](azure-stack-add-default-image.md) to the Azure Stack marketplace so that App Service can create virtual machines required for the App Service deployment.
5. [Install the SQL Server resource provider](azure-stack-sql-resource-provider-deploy.md) (App Service will use the default database). Make note of the following information, which you'll need later when you deploy App Service.
    - SQL database administrator username and password
    - SQL Hosting Server SKU
    

## Deploy the App Service resource provider on the POC host

1.	[Download the installer and helper scripts](azure-stack-app-service-deploy.md#download-the-required-components).
2.	[Run the helper script to create required certificates](azure-stack-app-service-deploy.md#create-certificates-required-by-app-service-on-azure-stack).
3.	[Install the App Service resource provider](azure-stack-app-service-deploy.md#use-the-installer-to-download-and-install-app-service-on-azure-stack).
4.	[Validate the installation](azure-stack-app-service-deploy.md#validate-app-service-on-azure-stack-installation).

## Create an offer that includes App Service

As an example, you can create an offer that lets users create DNN web content management systems. It requires the SQL Server service which you already enabled by installing the SQL Server resource provider.

1.	[Set a quota](azure-stack-setting-quotas.md) and name it *AppServiceQuota*. Select **Microsoft.Web** for the **Namespace** field.
2.	[Create a plan](azure-stack-create-plan.md). Name it *TestAppServicePlan*, select the the **Microsoft.SQL** service, and **AppService Quota** quota.

    > [!NOTE]
    > To let users create other apps, other services might be required in the plan. For example, Azure Functions requires that the plan     include the **Microsoft.Storage** service, while Wordpress requires **Microsoft.MySQL**.
    > 
    >

3.	[Create an offer](azure-stack-create-offer.md), name it **TestAppServiceOffer** and select the **TestAppServicePlan** plan.

## As a tenant, create an app in Azure Stack

Now that you've deployed the App Service resource provider and created an offer, you can sign in as a tenant, subscribe to the offer, and create an app. To create a DNN Platform content management system, you must first create a SQL database and then the DNN web app.

### Subscribe to the offer
1. Sign in to the Azure Stack portal (https://portal.local.azurestack.external) as a tenant.
2. Click **Get a subscription** > type **TestAppServiceSubscription** under **Display Name** > **Select an offer** > **TestAppServiceOffer** > **Create**.

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

## Create a DNN app    

1. Click **+** > **See all** > **DNN Platform preview** > **Create**.
2. Type *DNNapp* under **App name** and select **TestAppServiceOffer** under **Subscription**.
3. Click **Configure required settings** > **Create New** > type an **App Service plan** name.
4. Click **Pricing tier** > **F1 Free** > **Select** > **OK**.
5. Click **Database** and enter the information for the SQL database you created earlier.
6. Click **Create**.

You now have a DNN app ready for your use!




