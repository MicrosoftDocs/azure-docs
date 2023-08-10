---
title:  Azure AI Video Indexer accounts  
description: This article gives an overview of Azure AI Video Indexer accounts and provides links to other articles for more details.
ms.topic: conceptual
ms.date: 01/25/2023
ms.author: juliako
---

# Azure AI Video Indexer account types

This article gives an overview of Azure AI Video Indexer accounts types and provides links to other articles for more details.

## Trial account

When starting out with [Azure AI Video Indexer](https://www.videoindexer.ai/), click **start free** to kick off a quick and easy process of creating a trial account. No Azure subscription is required and this is a great way to explore Azure AI Video Indexer and try it out with your content. Keep in mind that the trial Azure AI Video Indexer account has a limitation on the number of indexing minutes, support, and SLA.

With a trial account, Azure AI Video Indexer provides:

* up to 600 minutes of free indexing to the [Azure AI Video Indexer](https://www.videoindexer.ai/) website users and
* up to 2400 minutes of free indexing to users that subscribe to the Azure AI Video Indexer API on the [developer portal](https://api-portal.videoindexer.ai/).

The trial account option is not available on the Azure Government cloud. For other Azure Government limitations, see [Limitations of Azure AI Video Indexer on Azure Government](connect-to-azure.md#limitations-of-azure-ai-video-indexer-on-azure-government).

## Paid (unlimited) account

When you have used up the free trial minutes or are ready to start using Video Indexer for production workloads, you can create a regular paid account which doesn't have minute, support, or SLA limitations. Account creation can be performed through the Azure portal (see [Create an account with the Azure portal](create-account-portal.md)) or API (see [Create accounts with API](/rest/api/videoindexer/stable/accounts)).

Azure AI Video Indexer unlimited accounts are Azure Resource Manager (ARM) based and unlike trial accounts, are created in your Azure subscription. Moving to an unlimited ARM based account unlocks many security and management capabilities, such as [RBAC user management](../role-based-access-control/overview.md), [Azure Monitor integration](../azure-monitor/overview.md), deployment through ARM templates, and much more.

Billing is per indexed minute, with the per minute cost determined by the selected preset.  For more information regarding pricing, see [Azure AI Video Indexer pricing](https://azure.microsoft.com/pricing/details/video-indexer/).

## Create accounts

* To create an ARM-based (paid) account with the Azure portal, see [Create accounts with the Azure portal](create-account-portal.md). 
* To create an account with an API, see [Create accounts](/rest/api/videoindexer/stable/accounts)

    > [!TIP]
    > Make sure you are signed in with the correct domain to the [Azure AI Video Indexer website](https://www.videoindexer.ai/). For details, see [Switch tenants](switch-tenants-portal.md).  
* [Upgrade a trial account to an ARM-based (paid) account and import your content for free](import-content-from-trial.md).  
   
 ## Classic accounts
 
Before ARM based accounts were added to Azure AI Video Indexer, there was a "classic" account type (where the accounts management plane is built on API Management.) The classic account type is still used by some users.

* If you are using a classic (paid) account and interested in moving to an ARM-based account, see [connect an existing classic Azure AI Video Indexer account to an ARM-based account](connect-classic-account-to-arm.md).
 
For more information on the difference between regular unlimited accounts and classic accounts, see [Azure AI Video Indexer as an Azure resource](https://techcommunity.microsoft.com/t5/ai-applied-ai-blog/azure-video-indexer-is-now-available-as-an-azure-resource/ba-p/2912422).

## Limited access features

[!INCLUDE [limited access](./includes/limited-access-account-types.md)]

For more information, see [Azure AI Video Indexer limited access features](limited-access-features.md).

## Next steps

Make sure to review [Pricing](https://azure.microsoft.com/pricing/details/video-indexer/).
