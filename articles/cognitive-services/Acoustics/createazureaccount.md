---
title: Setup Azure accounts for Acoustics | Microsoft Docs
description: Use advanced acoustics and spatialization in your Unity title
services: cognitive-services
author: ashtat
manager: noelc
ms.service: cognitive-services
ms.component: acoustics
ms.topic: article
ms.date: 08/03/2018
ms.author: kegodin
---

# Setup Azure Accounts for Acoustics
Follow this guide for setting up Azure Batch and Storage accounts necessary for working with acoustics. For information about the Unity plugin developed as part of Project Acoustics, see [What is acoustics](what-is-acoustics.md). For information about how to incorporate acoustics into your Unity project, see [Getting Started](gettingstarted.md).  

## Get an Azure Subscription
An [Azure Subscription](https://azure.microsoft.com/en-us/free/) is required before setting up Batch and Storage accounts. If you're signing up for the first time, Azure provides a few time-limited free resources and $200 credit.

## Create Azure Batch and Storage Accounts
Next, follow [these instructions](https://docs.microsoft.com/en-us/azure/batch/batch-account-create-portal) to set up your Azure Batch and associated Azure Storage accounts.

Pick default options for both Batch and Storage accounts
  
  ![New Batch Account](media/NewBatchAccountCreate.png)

  ![New Storage Account](media/BatchStorageAccountCreate.png)

It takes a few minutes for Azure to deploy the accounts. Look for a completion notification in the upper right corner on the portal.
  
  ![Accounts Deployed](media/BatchAccountsDeployNotification.png)

Your accounts should now be visible on your dashboard.
  
  ![Portal Dashboard](media/AzurePortalDashboard.png)

## Set up acoustics bake UI with Azure credentials
Click on the Batch account link on the dashboard, then click on the "Keys" link on the Batch account page to access your credentials.
  
  ![Batch Keys Link](media/BatchAccessKeys.png)

  ![Batch Account Credentials](media/BatchKeysInfo.png)

Click on the "Storage Account" link on the page to access your Azure Storage account credentials.
  
  ![Storage Account Credentials](media/StorageKeysInfo.png)

Enter these credentials in the Bake tab as described in the [bake UI walkthrough](bakeuiwalkthrough.md).
