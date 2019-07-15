---
title: Project Acoustics Azure Batch Account Setup
titlesuffix: Azure Cognitive Services
description: This how-to describes setting up an Azure Batch account for use with Project Acoustics Unity and Unreal engine integrations.
services: cognitive-services
author: ashtat
manager: nitinme

ms.service: cognitive-services
ms.subservice: acoustics
ms.topic: conceptual
ms.date: 03/20/2019
ms.author: kegodin
---

# Project Acoustics Azure Batch Account Setup
This how-to describes setting up an Azure Batch account for use with Project Acoustics Unity and Unreal engine integrations.

## Get an Azure subscription
An [Azure Subscription](https://azure.microsoft.com/free/) is required before setting up Batch and Storage accounts. If you're signing up for the first time, Azure provides a few time-limited free resources and $200 credit.

## Create Azure Batch and storage accounts
Next, follow [these instructions](https://docs.microsoft.com/azure/batch/batch-account-create-portal) to set up your Azure Batch and associated Azure Storage accounts.

Pick default options for both Batch and Storage accounts:
  
  ![Screenshot of Azure Batch new accounts options showing default settings](media/new-batch-account-create.png)

  ![Screenshot of Azure Storage new accounts options showing default settings](media/batch-storage-account-create.png)

It takes a few minutes for Azure to deploy the accounts. Look for a completion notification in the upper right corner on the portal.
  
  ![Screenshot of Azure accounts deployed notification](media/batch-accounts-deploy-notification.png)

Your accounts should now be visible on your dashboard.
  
  ![Screenshot of Azure portal dashboard showing a Batch and Storage account](media/azure-portal-dashboard.png)

## Set up acoustics bake UI with Azure credentials
Click on the Batch account link on the dashboard, then click on the **Keys** link on the Batch account page to access your credentials.
  
  ![Screenshot of Azure Batch account with link to Keys page highlighted](media/batch-access-keys.png)

  ![Screenshot of Azure Batch account keys page with access keys](media/batch-keys-info.png)

Click on the **Storage Account** link on the page to access your Azure Storage account credentials.
  
  ![Screenshot of Azure Storage account keys page with access keys](media/storage-keys-info.png)

Enter these credentials in the [Unity bake plugin](unity-baking.md) or [Unreal bake plugin](unreal-baking.md).

## Node types and region support
Project Acoustics requires Fsv2- and H-series compute optimized Azure VM nodes which may not be supported in all Azure regions. Please check [this table](https://azure.microsoft.com/global-infrastructure/services)
to ensure you're picking the right location for your Batch account.
![Screenshot showing Azure Virtual Machines by Region](media/azure-regions.png) 

## Upgrading your quota
Azure Batch accounts are provisioned on account creation with a limit of 20 compute cores. We may want to increase this limit for faster bake times, because you can parallelize your acoustics workload across many nodes, up to the number of probe points in your scene. You can request a quota increase by clicking on the **Quota** link on your Azure Batch portal page and then clicking on **Request Quota Increase**:

![Screenshot of Azure Quota page](media/azure-quotas.png)

## Next steps
* Integrate the Project Acoustics plugin into your [Unity](unity-integration.md) or [Unreal](unreal-integration.md) project

