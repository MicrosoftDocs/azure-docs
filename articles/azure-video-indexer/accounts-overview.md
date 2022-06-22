---
title:  Azure Video Indexer accounts  
description: This article gives an overview of Azure Video Indexer accounts and provides links to other articles for more details.
ms.topic: conceptual
ms.date: 06/22/2022
ms.author: juliako
---

# Azure Video Indexer account types

This article gives an overview of Azure Video Indexer accounts and provides links to other articles for more details.

## Differences between classic, ARM, trial accounts

Classic and ARM (Azure resource manager) are both paid accounts with same capabilities and pricing. The only difference is that classic accounts are managed by Azure Video Indexer and ARM accounts are managed by Azure resource manager.

A tial Azure Video Indexer account has limitation on number of videos, support, and SLA. 

### Indexing

* Free trial account: up to 10 hours of free indexing for website users, and up to 40 hours of free indexing for API users.
* Paid unlimited account: for larger scale indexing, create a new Video Indexer account connected to a paid Microsoft Azure subscription.

For more details, see [Pricing](https://azure.microsoft.com/pricing/details/video-indexer/).

### Create accounts

* [Get started with Azure Video Indexer in Azure portal](create-account-portal.md)
* [Create classic accounts](connect-to-azure.md)
* [Connect an existing classic paid Azure Video Indexer account to ARM-based account](connect-classic-account-to-arm.md)

## Limited access features

This section talks about limited access features in Azure Video Indexer.

|When did I create the account?|Trial Account (Free)|	Paid Account <br/>(classic or ARM-based)|
|---|---|---|
|Existing VI accounts <br/><br/>created before June 21, 2022|Able to access face identification, customization and celebrities recognition till June 2023. <br/><br/>**Recommended**: Move to a paid account and afterword fill in the [intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMkZIOUE1R0YwMkU0M1NMUTA0QVNXVDlKNiQlQCN0PWcu) and based on the eligibility criteria we will enable the features also after the grace period. |Able to access face identification, customization and celebrities recognition till June 2023\*<br/><br/>**Recommended**: fill in the [intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMkZIOUE1R0YwMkU0M1NMUTA0QVNXVDlKNiQlQCN0PWcu) and based on the eligibility criteria we will enable the features also after the grace period. <br/><br/>We proactively sent emails to these customers + AEs|
|New VI accounts <br/><br/>created after June 21, 2022	|Not able the access face identification, customization and celebrities recognition as of today. <br/><br/>**Recommended**: Move to a paid account and afterword fill in the [intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMkZIOUE1R0YwMkU0M1NMUTA0QVNXVDlKNiQlQCN0PWcu). Based on the eligibility criteria we will enable the features (after max 10 days).|Azure Video Indexer disables the access face identification, customization and celebrities recognition as of today by default, but gives the option to enable it. <br/><br/>**Recommended**: Fill in the [intake form](https://customervoice.microsoft.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR7en2Ais5pxKtso_Pz4b1_xUMkZIOUE1R0YwMkU0M1NMUTA0QVNXVDlKNiQlQCN0PWcu) and based on the eligibility criteria we will enable the features (after max 10 days).

\*In Brazil South we also disabled the face detection,

For more information, see [Azure Video Indexer limited access features](limited-access-features.md).

## Next steps

[Pricing](https://azure.microsoft.com/pricing/details/video-indexer/)
