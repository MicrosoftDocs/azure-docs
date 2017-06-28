---
title: Azure Media Services overview and common scenarios | Microsoft Docs
description: This topic gives an overview of Azure Media Services
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.assetid: 7a5e9723-c379-446b-b4d6-d0e41bd7d31f
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: hero-article
ms.date: 01/05/2017
ms.author: juliako;anilmur

---
# Azure Media Services overview and common scenarios

Microsoft Azure Media Services is an extensible cloud-based platform that enables developers to build scalable media management and delivery applications. Media Services is based on REST APIs that enable you to securely upload, store, encode and package video or audio content for both on-demand and live streaming delivery to various clients (for example, TV, PC, and mobile devices).

You can build end-to-end workflows using entirely Media Services. You can also choose to use third-party components for some parts of your workflow. For example, encode using a third-party encoder. Then, upload, protect, package, deliver using Media Services.

You can choose to stream your content live or deliver content on demand. This topic shows common scenarios for delivering your content [live](media-services-overview.md#live_scenarios) or [on demand](media-services-overview.md#vod_scenarios). The topic also links to other relevant topics.

## SDKs and tools

To build Media Services solutions, you can use:

* [Media Services REST API](https://docs.microsoft.com/rest/api/media/operations/azure-media-services-rest-api-reference)
* One of the available client SDKs:
	* [Azure Media Services SDK for .NET](https://github.com/Azure/azure-sdk-for-media-services),
	* [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java),
	* [Azure PHP SDK](https://github.com/Azure/azure-sdk-for-php),
	* [Azure Media Services for Node.js](https://github.com/michelle-becker/node-ams-sdk/blob/master/lib/request.js) (This is a non-Microsoft version of a Node.js SDK. It is maintained by a community and currently does not have a 100% coverage of the AMS APIs).
* Existing tools:
	* [Azure portal](https://portal.azure.com/)
	* [Azure-Media-Services-Explorer](https://github.com/Azure/Azure-Media-Services-Explorer) (Azure Media Services Explorer (AMSE) is a Winforms/C# application for Windows)

The following image shows some of the most commonly used objects when developing against the Media Services OData model.

Click the image to view it full size.  

<a href="./media/media-services-overview/media-services-overview-object-model.png" target="_blank"><img src="./media/media-services-overview/media-services-overview-object-model-small.png"></a> 

You can view the whole model [here](https://media.windows.net/API/$metadata?api-version=2.15).  

## Media Services learning paths
You can view AMS learning paths here:

* [AMS Live Streaming Workflow](https://azure.microsoft.com/documentation/learning-paths/media-services-streaming-live/)
* [AMS on Demand Streaming Workflow](https://azure.microsoft.com/documentation/learning-paths/media-services-streaming-on-demand/)

## Prerequisites

To start using Azure Media Services, you should have the following:

1. An Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com).
2. An Azure Media Services account. Use the Azure portal, .NET, or REST API to create Azure Media Services account. For more information, see [Create Account](media-services-portal-create-account.md).
3. (Optional) Set up development environment. Choose .NET or REST API for your development environment. For more information, see [Set up environment](media-services-dotnet-how-to-use.md).

	Also, learn how to [connect  programmatically](media-services-dotnet-connect-programmatically.md).
4. A standard or premium streaming endpoint in started state.  For more information, see [Managing streaming endpoints](https://docs.microsoft.com/en-us/azure/media-services/media-services-portal-manage-streaming-endpoints)

## Concepts and overview
For Azure Media Services concepts, see [Concepts](media-services-concepts.md).

For a how-to series that introduces you to all the main components of Azure Media Services, see [Azure Media Services Step-by-Step tutorials](https://docs.com/fukushima-shigeyuki/3439/english-azure-media-services-step-by-step-series). This series has a great overview of concepts and it uses the AMSE tool to demonstrate AMS tasks. Note that AMSE tool is a Windows tool. This tool supports most of the tasks you can achieve programmatically with [AMS SDK for .NET](https://github.com/Azure/azure-sdk-for-media-services), [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java), or  [Azure PHP SDK](https://github.com/Azure/azure-sdk-for-php).

## <a id="vod_scenarios"></a>Delivering Media on-Demand with Azure Media Services: common scenarios and tasks
This section describes common scenarios and provides links to relevant topics. The following diagram shows the major parts of the Media Services platform that are involved in delivering content on demand.

![VoD workflow](./media/media-services-video-on-demand-workflow/media-services-video-on-demand.png)

>[!NOTE]
>When your AMS account is created a **default** streaming endpoint is added to your account in the **Stopped** state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the **Running** state.

### Protect content in storage and deliver streaming media in the clear (non-encrypted)
1. Upload a high-quality mezzanine file into an asset.

    It is recommended to apply storage encryption option to your asset in order to protect your content during upload and while at rest in storage.
2. Encode to a set of adaptive bitrate MP4 files.

    It is recommended to apply storage encryption option to the output asset in order to protect your content at rest.
3. Configure asset delivery policy (used by dynamic packaging).

    If your asset is storage encrypted, you **must** configure asset delivery policy.
4. Publish the asset by creating an OnDemand locator.
5. Stream published content.

### Protect content in storage, deliver dynamically encrypted streaming media

1. Upload a high-quality mezzanine file into an asset. Apply storage encryption option to the asset.
2. Encode to a set of adaptive bitrate MP4 files. Apply storage encryption option to the output asset.
3. Create encryption content key for the asset you want to be dynamically encrypted during playback.
4. Configure content key authorization policy.
5. Configure asset delivery policy (used by dynamic packaging and dynamic encryption).
6. Publish the asset by creating an OnDemand locator.
7. Stream published content.

### Use Media Analytics to derive actionable insights from your videos
Media Analytics is a collection of speech and vision components that make it easier for organizations and enterprises to derive actionable insights from their video files. For more information, see [Azure Media Services Analytics Overview](media-services-analytics-overview.md).

1. Upload a high-quality mezzanine file into an asset.
2. Use one of the following Media Analytics services to process your videos:

   * **Indexer** – [Process videos with Azure Media Indexer 2](media-services-process-content-with-indexer2.md)
   * **Hyperlapse** – [Hyperlapse Media Files with Azure Media Hyperlapse](media-services-hyperlapse-content.md)
   * **Motion detection** – [Motion Detection for Azure Media Analytics](media-services-motion-detection.md).
   * **Face detection and Face emotions** – [Face and Emotion Detection for Azure Media Analytics](media-services-face-and-emotion-detection.md).
   * **Video summarization** – [Use Azure Media Video Thumbnails to Create a Video Summarization](media-services-video-summarization.md)
3. Media Analytics media processors produce MP4 files or JSON files. If a media processor produced an MP4 file, you can progressively download the file. If a media processor produced a JSON file, you can download the file from the Azure blob storage.

### Deliver progressive download
1. Upload a high-quality mezzanine file into an asset.
2. Encode to a single MP4 file.
3. Publish the asset by creating an OnDemand or SAS locator.

	If using SAS locator, the content is downloaded from the Azure blob storage. In this case, you do not need to have streaming endpoints in started state.
4. Progressively download content.

## <a id="live_scenarios"></a>Delivering Live Streaming Events with Azure Media Services
When working with Live Streaming the following components are commonly involved:

* A camera that is used to broadcast an event.
* A live video encoder that converts signals from the camera to streams that are sent to a live streaming service.

Optionally, multiple live time synchronized encoders. For certain critical live events that demand very high availability and quality of experience, it is recommended to employ active-active redundant encoders with time synchronizationto achieve seamless failover with no data loss.

* A live streaming service that enables you to do the following:
* ingest live content using various live streaming protocols (for example RTMP or Smooth Streaming),
* (optionally) encode your stream into adaptive bitrate stream
* preview your live stream,
* record and store the ingested content in order to be streamed later (Video-on-Demand)
* deliver the content through common streaming protocols (for example, MPEG DASH, Smooth, HLS) directly to your customers, or to a Content Delivery Network (CDN) for further distribution.

**Microsoft Azure Media Services** (AMS) provides the ability to ingest,  encode, preview, store, and deliver your live streaming content.

When delivering your content to customers your goal is to deliver a high quality video to various devices under different network conditions. To take care of quality and network conditions, use live encoders to encode your stream to multi-bitrate (adaptive bitrate) video stream.  To take care of streaming on different devices, use Media Services [dynamic packaging](media-services-dynamic-packaging-overview.md) to dynamically re-package your stream to different protocols. Media Services supports delivery of the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH.

In Azure Media Services, **Channels**, **Programs**, and **StreamingEndpoints** handle all the live streaming functionalities including ingest, formatting, DVR, security, scalability and redundancy.

A **Channel** represents a pipeline for processing live streaming content. A Channel can receive a live input streams in the following ways:

* An on-premises live encoder sends multi-bitrate **RTMP** or **Smooth Streaming** (fragmented MP4) to the Channel that is configured for **pass-through** delivery. The **pass-through** delivery is when the ingested streams pass through **Channel**s without any further transcoding or encoding. You can use the following live encoders that output multi-bitrate Smooth Streaming: MediaExcel, Imagine Communications, Ateme, Envivio, Cisco and Elemental. The following live encoders output RTMP: Adobe Flash Live Encoder, Haivision, Telestream Wirecast, Teradek and Tricaster encoders.  A live encoder can also send a single bitrate stream to a channel that is not enabled for live encoding, but that is not recommended. When requested, Media Services delivers the stream to customers.

> [!NOTE]
> Using a pass-through method is the most economical way to do live streaming when you are doing multiple events over a long period of time, and you have already invested in on-premises encoders. See [pricing](https://azure.microsoft.com/pricing/details/media-services/) details.
>
>

* An on-premises live encoder sends a single-bitrate stream to the Channel that is enabled to perform live encoding with Media Services in one of the following formats: RTP (MPEG-TS), RTMP, or Smooth Streaming (Fragmented MP4). The Channel then performs live encoding of the incoming single bitrate stream to a multi-bitrate (adaptive) video stream. When requested, Media Services delivers the stream to customers.

### Working with Channels that receive multi-bitrate live stream from on-premises encoders (pass-through)
The following diagram shows the major parts of the AMS platform that are involved in the **pass-through** workflow.

![Live workflow][live-overview2]

For more information, see [Working with Channels that Receive Multi-bitrate Live Stream from On-premises Encoders](media-services-live-streaming-with-onprem-encoders.md).

### Working with Channels that are enabled to perform live encoding with Azure Media Services
The following diagram shows the major parts of the AMS platform that are involved in Live Streaming workflow where a Channel is enabled to perform live encoding with Media Services.

![Live workflow][live-overview1]

For more information, see [Working with Channels that are Enabled to Perform Live Encoding with Azure Media Services](media-services-manage-live-encoder-enabled-channels.md).

## Supported media processors

|Name|Status|Data Centers
|---|---|---|
|Azure Media Face Detector|Preview|All|
|Azure Media Hyperlapse|Preview|All|
|Azure Media Indexer|GA|All|
|Azure Media Motion Detector|Perview|All|
|Azure Media OCR|Preview|All|
|Azure Media Redactor|Preview|All|
|Azure Media Stabilizer|Preview|All|
|Azure Media Video Thumbnails|Preview|All|
|Media Encoder Standard|GA|All|
|Media Indexer v2|Preview|All, except China and Government|
|Media Encoder Premium Workflow|GA|All, except China|
## Consuming content
Azure Media Services provides the tools you need to create rich, dynamic client player applications for most platforms including: iOS Devices, Android Devices, Windows, Windows Phone, Xbox, and Set-top boxes. The following topic provides links to SDKs and Player Frameworks that you can use to develop your own client applications that can consume streaming media from Media Services.

[Developing Video Player Applications](media-services-develop-video-players.md)

## Enabling Azure CDN
Media Services supports integration with Azure CDN. For information on how to enable Azure CDN, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-portal-manage-streaming-endpoints.md).

## Scaling a Media Services account

You can scale **Media Services** by specifying the number of **Streaming Reserved Units** and **Encoding Reserved Units** that you would like your account to be provisioned with.

You can also scale your Media Services account by adding storage accounts to it. Each storage account is limited to 500 TB. To expand your storage beyond the default limitations, you can choose to attach multiple storage accounts to a single Media Services account.
Media Services customers choose either a **Standard** streaming endpoint or one or more **Premium** streaming endpoints, according to their needs. Standard Streaming Endpoint is suitable for most streaming workloads. It includes the same features as Premium Streaming Units. If you have an advanced workload or your streaming capacity requirements doesn't fit to standard streaming endpoint throughput targets or you want to control the capacity of the StreamingEndpoint service to handle growing bandwidth needs by adjusting scale units (also known as premium streaming units), then it is recommended to allocate scale units.

[This](media-services-portal-scale-streaming-endpoints.md) topic links to relevant topics.

## Support
[Azure Support](https://azure.microsoft.com/support/options/) provides support options for Azure, including Media Services.

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

## Service Level Agreement (SLA)
* For Media Services Encoding, we guarantee 99.9% availability of REST API transactions.
* For Streaming, we will successfully service requests with a 99.9% availability guarantee for existing media content when a standard or premium streaming endpoint is purchased.
* For Live Channels, we guarantee that running Channels will have external connectivity at least 99.9% of the time.
* For Content Protection, we guarantee that we will successfully fulfill key requests at least 99.9% of the time.
* For Indexer, we will successfully service Indexer Task requests processed with an Encoding Reserved Unit 99.9% of the time.

For more information, see [Microsoft Azure SLA](https://azure.microsoft.com/support/legal/sla/).

<!-- Images -->
[overview]: ./media/media-services-overview/media-services-overview.png
[vod-overview]: ./media/media-services-video-on-demand-workflow/media-services-video-on-demand.png
[live-overview1]: ./media/media-services-live-streaming-workflow/media-services-live-streaming-new.png
[live-overview2]: ./media/media-services-live-streaming-workflow/media-services-live-streaming-current.png
