---
title: Microsoft Azure Media Services common scenarios | Microsoft Docs
description: This article gives an overview of Microsoft Azure Media Services scenarios.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 3/10/2021
ms.author: inhenkel
---

# Microsoft Azure Media Services common scenarios

[!INCLUDE [media services api v2 logo](./includes/v2-hr.md)]

> [!NOTE]
> No new features or functionality are being added to Media Services v2. Check out the latest version, [Media Services v3](../latest/media-services-overview.md). Also, see [migration guidance from v2 to v3](../latest/migrate-v-2-v-3-migration-introduction.md)

Microsoft Azure Media Services (AMS) enables you to securely upload, store, encode, and package video or audio content for both on-demand and live streaming delivery to various clients (for example, TV, PC, and mobile devices).

This article shows common scenarios for delivering your content live or on-demand.

## Overview

### Prerequisites

* An Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com).
* An Azure Media Services account. For more information, see [Create Account](media-services-portal-create-account.md).
* The streaming endpoint from which you want to stream content has to be in the **Running** state.

    When your AMS account is created, a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint has to be in the **Running** state.

### Commonly used objects when developing against the AMS OData model

The following image shows some of the most commonly used objects when developing against the Media Services OData model.

Click the image to view it full size.  

[![Diagram showing some of the most commonly used objects when developing against the Azure Media Services object data model.](./media/media-services-overview/media-services-overview-object-model-small.png)](./media/media-services-overview/media-services-overview-object-model.png#lightbox)

You can view the whole model [here](https://media.windows.net/API/$metadata?api-version=2.15).  

## Protect content in storage and deliver streaming media in the clear (non-encrypted)

![VoD workflow](./media/scenarios-and-availability/scenarios-and-availability01.png)

1. Upload a high-quality media file into an asset.

    Applying the storage encryption option to your asset in order to protect your content during upload and while at rest in storage is recommended.

1. Encode to a set of adaptive bitrate MP4 files.

    Applying the storage encryption option to the output asset in order to protect your content at rest is recommended.

1. Configure asset delivery policy (used by dynamic packaging).

    If your asset is storage encrypted, you **must** configure asset delivery policy.
1. Publish the asset by creating an OnDemand locator.
1. Stream published content.

## Protect content in storage, deliver dynamically encrypted streaming media

![Protect with PlayReady](./media/media-services-content-protection-overview/media-services-content-protection-with-multi-drm.png)

1. Upload a high-quality media file into an asset. Apply storage encryption option to the asset.
1. Encode to a set of adaptive bitrate MP4 files. Apply storage encryption option to the output asset.
1. Create encryption content key for the asset you want to be dynamically encrypted during playback.
1. Configure content key authorization policy.
1. Configure asset delivery policy (used by dynamic packaging and dynamic encryption).
1. Publish the asset by creating an OnDemand locator.
1. Stream published content.

## Deliver progressive download

1. Upload a high-quality media file into an asset.
1. Encode to a single MP4 file.
1. Publish the asset by creating an OnDemand or SAS locator. If using SAS locator, the content is downloaded from the Azure blob storage. You don't need to have streaming endpoints in started state.
1. Progressively download content.

## Delivering live-streaming events

1. Ingest live content using various live streaming protocols (for example RTMP or Smooth Streaming).
1. (optionally) Encode your stream into adaptive bitrate stream.
1. Preview your live stream.
1. Deliver the content through:
    1. Common streaming protocols (for example, MPEG DASH, Smooth, HLS) directly to your customers,
    1. To a Content Delivery Network (CDN) for further distribution, or
    1. Record and store the ingested content to be streamed later (Video-on-Demand).

When doing live streaming, you can choose one of the following routes:

### Working with channels that receive multi-bitrate live stream from on-premises encoders (pass-through)

The following diagram shows the major parts of the AMS platform that are involved in the **pass-through** workflow.

![Diagram that shows the major parts of the A M S platform involved in the "pass-through" workflow.](./media/scenarios-and-availability/media-services-live-streaming-current.png)

For more information, see [Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders](media-services-live-streaming-with-onprem-encoders.md).

### Working with channels that are enabled to perform live encoding with Azure Media Services

The following diagram shows the major parts of the AMS platform that are involved in Live Streaming workflow where a Channel is enabled to do live encoding with Media Services.

![Live workflow](./media/scenarios-and-availability/media-services-live-streaming-new.png)

For more information, see [Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services](media-services-manage-live-encoder-enabled-channels.md).

## Consuming content

Azure Media Services provides the tools you need to create rich, dynamic client player applications for most platforms including: iOS Devices, Android Devices, Windows, Windows Phone, Xbox, and Set-top boxes.

## Enabling Azure CDN

Media Services supports integration with Azure CDN. For information on how to enable Azure CDN, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-portal-manage-streaming-endpoints.md).

## Scaling a Media Services account

AMS customers can scale streaming endpoints, media processing, and storage in their AMS accounts.

* Media Services customers can choose either a **Standard** streaming endpoint or a **Premium** streaming endpoint. A **Standard** streaming endpoint is suitable for most streaming workloads. It includes the same features as a **Premium** streaming endpoints and scales outbound bandwidth automatically.

    **Premium** streaming endpoints are suitable for advanced workloads, providing dedicated and scalable bandwidth capacity. Customers that have a **Premium** streaming endpoint, by default get one streaming unit (SU). The streaming endpoint can be scaled by adding SUs. Each SU provides additional bandwidth capacity to the application. For more information about scaling **Premium** streaming endpoints, see the [Scaling streaming endpoints](media-services-portal-scale-streaming-endpoints.md) topic.

* A Media Services account is associated with a Reserved Unit Type, which determines the speed with which your media processing tasks are processed. You can pick between the following reserved unit types: **S1**, **S2**, or **S3**. For example, the same encoding job runs faster when you use the **S2** reserved unit type compare to the **S1** type.

    In addition to specifying the reserved unit type, you can specify to provision your account with **Reserved Units** (RUs). The number of provisioned RUs determines the number of media tasks that can be processed concurrently in a given account.

    > [!NOTE]
    > RUs work for parallelizing all media processing, including indexing jobs using Azure Media Indexer. However, unlike encoding, indexing jobs do not get processed faster with faster reserved units.

    For more information see, [Scale media processing](media-services-portal-scale-media-processing.md).

* You can also scale your Media Services account by adding storage accounts to it. Each storage account is limited to 500 TB. For more information, see [Manage storage accounts](./media-services-managing-multiple-storage-accounts.md).

## Next steps

[Migrate to Media Services v3](../latest/media-services-overview.md)

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]