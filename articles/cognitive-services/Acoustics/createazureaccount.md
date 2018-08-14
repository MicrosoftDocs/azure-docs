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
Follow this guide for setting up Azure Batch and Storage accounts necessary for working with Microsoft Acoustics. For information about Microsoft Acoustics, see [Introduction to Microsoft Acoustics](what-is-acoustics.md). For information about how to incorporate Microsoft Acoustics into your Unity project, see [Getting Started](gettingstarted.md).  


### **Step 1 -** Get an Azure Subscription
An [Azure Subscription](https://azure.microsoft.com/en-us/free/) is required before setting up Batch and Storage accounts. For those signing up for the first time, Azure provides a few time limited free resources and $200 credit which you can use towards cloud bakes for Microsoft Acoustics.

### **Step 2 -** Create Azure Batch and Storage Accounts
Next, please follow [these instructions]((https://docs.microsoft.com/en-us/azure/batch/batch-account-create-portal)) to setup your Azure Batch and associated Azure Storage accounts.

* Pick default options for both Batch and Storage accounts
  
  ![New Batch Account](Media/NewBatchAccountCreate.png)

  ![New Storage Account](Media/BatchStorageAccountCreate.png)

* It takes a few minutes for Azure to deploy the accounts. Look for a completion notification in the upper right corner on the portal.
  
  ![Accounts Deployed](Media/BatchAccountsDeploynotification.png)

* Your accounts should now be visible on your dashboard.
  
  ![Portal Dashboard](Media/AzurePortalDashboard.png)

### **Step 3 -** Setup Microsoft Acoustics Bake UI with Azure Credentials
This is the last remaning step before you can start scheduling acoustics bakes on the cloud. 

* Click on the Batch account link on the dashboard.
* Click on the "Keys" link on the Batch account page to access your credentials.
  
  ![Batch Keys Link](Media/BatchAccessKeys.png)

  ![Batch Account Creds](Media/BatchKeysInfo.png)
* Similarly click on the "Storage Account" link on the page to access your Azure Storage account credentials.
  
  ![Storage Account Creds](Media/StorageKeysInfo.png)

* Use these credentials to setup the Bake Tab as described in the [Bake UI walkthrough](bakeuiwalkthrough.md).
