---
title: Azure AI Video Indexer (AVI) changes related to Azure Media Service (AMS) retirement  
description: This article explains the upcoming changes to Azure AI Video Indexer (AVI) related to the retirement of Azure Media Services (AMS).
ms.topic: conceptual
ms.date: 11/23/2022
ms.author: inhenkel
author: IngridAtMicrosoft
---

# Azure AI Video Indexer (AVI) changes related to Azure Media Service (AMS) retirement

This article explains the upcoming changes to Azure AI Video Indexer (AVI) that are the rault of the [retirement of Azure Media Services (AMS)](/azure/media-services/latest/azure-media-services-retirement).

Currently, AVI requires the creation of an AMS account. Additionally, AVI uses AMS for video encoding and streaming operations. The required changes will affect all AVI customers.

To continue using AVI beyond June 30, 2024, all customers **must** make changes to their AVI accounts to remove the AMS dependency. Detailed guidance for converting AVI accounts will be provided in January 2024 when the new account type is released.

## Pricing and billing

Currently, AVI uses AMS for encoding and streaming for the AVI player. AMS charges you for both encoding and streaming. In the future, AVI will encode media and you'll be billed using the updated AVI accounts. Pricing details will be shared in January 2024. There will be no charge for the AVI video player.

## AVI account functional changes

Video Indexer will continue to offer the same insights, performance, and functionality. However, a few aspects of the service will change which fall under the following three categories:

- AVI account changes
- AVI API changes
- AVI product changes

AVI has three account types. All will be impacted by the AMS retirement. The account types are:

- ARM-based accounts
    - Classic accounts
    - Trial accounts

See [Azure AI Video Indexer account types](/azure/azure-video-indexer/accounts-overview) to understand more about AVI account types.

### Azure Resource Manager (ARM)-based accounts

1. **New accounts:** As of January 15, all newly created AVI accounts will be Updated AVI accounts. You'll no longer be able to create AMS-dependent accounts.
1. **Existing accounts**: Existing accounts will continue to work through June 30, 2024. To continue using the account beyond June 30, customers must go through the process to convert their account to an Updated AVI account. If you don’t convert your account to an Updated AVI account, you won't be able to access the account or use it beyond June 30.

### Classic accounts

1.  **New accounts:** As of January 15, all newly created AVI accounts will be Updated AVI accounts. You'll no longer be able to create Classic accounts.
1.  **Existing accounts:** Existing classic accounts will continue to work through June 30, 2024. AVI will release an updated API version for the Updated accounts that doesn’t contain any AMS related parameters.
1.  To continue using the account beyond June 30, 2024, classic accounts will have to go through two steps:
    1.  Connect the account as an ARM-based account. You can connect the accounts already. See [Azure AI Video Indexer accounts](accounts-overview.md) for instructions.
    1.  Convert the account to an Updated AVI account. If you don’t convert your account to an Updated AVI account, you won’t be able to access the account or use it beyond June 30.

### Existing trial accounts

1. As of January 15, 2024 Video Indexer trial accounts will continue to work as usual. However, when using them through the APIs, customers must use the updated APIs.
2. AVI supports [importing content](import-content-from-trial.md) from a trial AVI account to a paid AVI account. This import option will be supported only until **January 15th, 2024**. Trial account owners will be sent instructions on how to move to ARM-based accounts in the coming months.

## AVI API changes

**Between January 15 to June 30, 2024**, AVI will support both existing data and control plane APIs as well as the APIs for the updated AVI accounts that contain ARM related parameters.

Updated AVI account owners will only use the updated APIs that will exclude all AMS related parameters.

**On July 1st, 2024**, code using APIs with AMS parameters will no longer be supported. This applies to both control plane and data plane operations.

### Breaking API changes

There will be breaking API changes. The following table gives you some of the details, so you can be aware of what is coming, but actionable guidance will be provided in January. 

| **Type** | **API Name** |  **Change** |
|--|--|--|
| **ARM** | Create \ Update \ Patch \ ListAccount | 1. The `mediaServices` Account property will be replaced with the `storageServices` account property.<br/> 2. The `Identity` property will change from the `Owner` managed identity to `Storage Blob Data Contributor` permissions on the storage resource |
| **ARM** | Get \ MoveAccount | ? |  |  |
| **ARM** | GetClassicAccount \ ListClassicAccounts |  API no longer be supported. |
| **Classic** | CreatePaidAccountManually | API no longer be supported. |
| **Classic** | UpdateAccountMediaServicesAsync |  API no longer be supported. |
| **Data plane** | Upload | Upload will longer accept the `assetId` parameter. |
| **Data plane** | Upload / ReIndex / Redact | `AdaptiveBitrate` will no longer be supported for new uploads. |
| **Data plane** | GetVideoIndex | `PublishedUrl` property will always null. |
| **Data plane** | GetVideoStreamingURL | The streaming url will returns references to AVI rather than AMS. |

Full details of the API changes and alternatives will be provided in January when the updated APIs are released.

## AVI product changes

As of July 1, 2024, AVI won’t use AMS for encoding or streaming. As a result, it will no longer support the following:

- Encoding with adaptive bitrate will no longer be supported. Only single bitrate will be supported for new indexing jobs. Videos already encoded with adaptive bitrate will be playable in the AVI player.
- Video Indexer [dynamic encryption](/azure/media-services/latest/drm-content-protection-concept) of media files will no longer be supported.
- Media files created by AVI Updated accounts won’t be playable by the [Azure Media Player](https://azure.microsoft.com/products/media-services/media-player).
- Using a Cognitive Insights widget and playing the content with the Azure Media Player outlined [here](video-indexer-embed-widgets#embed-the-cognitive-insights-widget-and-use-azure-media-player-to-play-the-content.md) will no longer be supported.

<!--
![](media/2fddb69db60e0fdc2baefec916484757.png)

| Timeline                | Change                                                                                                                                                         |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sep 11th-Jan 15th       | Announcement with no change                                                                                                                                    |
| 15 Jan 2024 – June 30th | Release of Updated AVI accounts and updated API’s without AMS parameters. All new VI accounts will be Azure Storage-based                                      |
| 30 June 2024 +          | AMS-based accounts will no longer be supported Can only use updated AVI APIs without AMS related parameters Product changes take effect (only single bitrate)  |
-->