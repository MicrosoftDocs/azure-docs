---
title: Azure Quickstart - Run Batch job - Portal | Microsoft Docs
description:  Quickly learn to run a Batch job with the Azure portal.
services: batch
documentationcenter: 
author: dlepow
manager: timlt
editor: 
ms.assetid: 
ms.service: batch
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: 
ms.workload: 
ms.date: 10/27/2017
ms.author: danlep
ms.custom: mvc
---

# Run a sample job with Azure Batch in the portal


## Log in to Azure 

Log in to the Azure portal at http://portal.azure.com.

## Create Batch account


1. Select **New** > **Compute** > **Batch Service**. 

    ![Batch in the Marketplace][marketplace_portal]

3. Enter values for **Account name** and **Resource group**. The account name must be unique within the Azure **Location** selected, use only lowercase characters or numbers, and contain 3-24 characters. Keep the defaults for remaining settings, and click **Create** to create the account.

  ![Create a Batch account][account_portal]  



When the **Deployment succeeded** message appears, go to the Batch account in the portal.

## Create a Batch pool

To create a pool of VMs for Batch, click **Pools** > **Add**.


## Clean up resources

When no longer needed, delete the resource group, Batch account, and all related resources. To do so, select the resource group for the Batch account and click **Delete**.

## Next steps

In this quick start, you’ve deployed a Batch account, ...

> [!div class="nextstepaction"]
> [Azure Batch tutorials](./batch-dotnet-get-started.md)

[marketplace_portal]: ./media/quick-create-portal/marketplace_batch.png

[account_portal]: ./media/quick-create-portal/batch_account_portal.png