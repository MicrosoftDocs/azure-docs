---
title:  Azure Video Indexer accounts  
description: This article gives an overview of Azure Video Indexer accounts and provides links to other articles for more details.
ms.topic: conceptual
ms.date: 06/22/2022
ms.author: juliako
---

# Azure Video Indexer account types

This article gives an overview of Azure Video Indexer accounts types and provides links to other articles for more details.

## A trial account

The first time you visit the [Azure Video Indexer](https://www.videoindexer.ai/) website, a trial account is automatically created. The trial Azure Video Indexer account has limitation on number of indexing minutes, support, and SLA.

With a trial, account Azure Video Indexer provides:

* up to 600 minutes of free indexing to the [Azure Video Indexer](https://www.videoindexer.ai/) website users and 
* up to 2400 minutes of free indexing to users that subscribe to the Azure Video Indexer API on the [developer portal](https://aka.ms/avam-dev-portal).

When using the trial account, you don't have to set up an Azure subscription.

The trial account option is not available on the Azure Government cloud. For other Azure Government limitations, see [Limitations of Azure Video Indexer on Azure Government](connect-to-azure.md#limitations-of-azure-video-indexer-on-azure-government).

## A paid (unlimited) account

You can later create a paid account where you're not limited by the quota. Two types of paid accounts are available to you: Azure Resource Manager (ARM) (currently in preview) and classic (generally available). The main difference between the two is account management platform. While classic accounts are built on the API Management, ARM-based accounts management is built on Azure, which enables apply access control to all services with role-based access control (Azure RBAC) natively.

With the paid option, you pay for indexed minutes, for more information, see [Azure Video Indexer pricing](https://azure.microsoft.com/pricing/details/video-indexer/).

When creating a new paid account, you need to connect the Azure Video Indexer account to your Azure subscription and an Azure Media Services account. 

**The recommended paid account type is the ARM-based account**.

## To get access to your account

|   | ARM-based |Classic| Trial|
|---|---|---|---|
|Get access token | [ARM REST API](https://aka.ms/avam-arm-api) |[Get access token](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Get-Account-Access-Token)|Same as classic
|Share account| [Azure RBAC(role based access control)](../role-based-access-control/overview.md)| [Invite users](invite-users.md) |Same as classic

## Create accounts

* Creating ARM accounts. Make sure you are signed in with the correct domain to the [Azure Video Indexer website](https://www.videoindexer.ai/). For details, see [Switch tenants](switch-tenants-portal.md).  

    * You can create an Azure Video Indexer ARM-based account through one of the following:
    
      1. The [Azure Video Indexer website](https://aka.ms/vi-portal-link)
      2. The [Azure portal](https://portal.azure.com/#home)
      
    For the detailed description, [Get started with Azure Video Indexer in Azure portal](create-account-portal.md).
* Upgrade a trial account to an ARM-based account and [import your content for free](import-content-from-trial.md).  
* [Create classic accounts using API](https://api-portal.videoindexer.ai/api-details#api=Operations&operation=Create-Paid-Account).
* [Connect an existing classic paid Azure Video Indexer account to an ARM-based account](connect-classic-account-to-arm.md).

## Limited access features

This section talks about limited access features in Azure Video Indexer.

|When did I create the account?|Trial Account (Free)|	Paid Account <br/>(classic or ARM-based)|
|---|---|---|
|Existing VI accounts <br/><br/>created before June 21, 2022|Able to access face identification, customization and celebrities recognition till June 2023. <br/><br/>**Recommended**: Move to a paid account and afterward fill in the [intake form](https://aka.ms/facerecognition) and based on the eligibility criteria we will enable the features also after the grace period. |Able to access face identification, customization and celebrities recognition till June 2023\*.<br/><br/>**Recommended**: fill in the [intake form](https://aka.ms/facerecognition) and based on the eligibility criteria we will enable the features also after the grace period. <br/><br/>We proactively sent emails to these customers + AEs.|
|New VI accounts <br/><br/>created after June 21, 2022	|Not able the access face identification, customization and celebrities recognition as of today. <br/><br/>**Recommended**: Move to a paid account and afterward fill in the [intake form](https://aka.ms/facerecognition). Based on the eligibility criteria we will enable the features (after max 10 days).|Azure Video Indexer disables the access face identification, customization and celebrities recognition as of today by default, but gives the option to enable it. <br/><br/>**Recommended**: Fill in the [intake form](https://aka.ms/facerecognition) and based on the eligibility criteria we will enable the features (after max 10 days).|

\*In Brazil South we also disabled the face detection.

For more information, see [Azure Video Indexer limited access features](limited-access-features.md).

## Next steps

Make sure to review [Pricing](https://azure.microsoft.com/pricing/details/video-indexer/).
