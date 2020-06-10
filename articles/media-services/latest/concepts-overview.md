---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Media Services terminology and concepts
titleSuffix: Azure Media Services
description: Learn about terminology and concepts for Azure Media Services.
services: media-servicesgit
documentationcenter: ''
author: Juliako
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 02/18/2020
ms.author: juliako
ms.custom: seodec18

---

# Media Services terminology and concepts

This topic gives a brief overview of Azure Media Services terminology and concepts. The article also provides links to articles with an in-depth explanation of Media Services v3 concepts and functionality.

The fundamental concepts described in these topics should be reviewed before starting development.

> [!NOTE]
> Currently, you can use the [Azure portal](https://portal.azure.com/) to: manage Media Services v3 [Live Events](live-events-outputs-concept.md), view (not manage) v3 [Assets](assets-concept.md), and [get info about accessing APIs](access-api-portal.md).
> For all other management tasks (for example, [Transforms and Jobs](transforms-jobs-concept.md) and [Content protection](content-protection-overview.md)), use the [REST API](https://aka.ms/ams-v3-rest-ref), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Media Services v3 terminology

|Term|Description|
|---|---|
|Live Event|A **Live Event** represents a pipeline for ingesting, transcoding (optionally), and packaging live streams of video, audio, and real-time metadata.<br/><br/>For customers migrating from Media Services v2 APIs, the **Live Event** replaces the **Channel** entity in v2. For more information, see [Migrating from v2 to v3](migrate-from-v2-to-v3.md).|
|Streaming Endpoint/Packaging/Origin|A **Streaming Endpoint** represents a dynamic (just-in-time) packaging and origin service that can deliver your live and on-demand content directly to a client player application. It uses one of the common streaming media protocols (HLS or DASH). In addition, the **Streaming Endpoint** provides dynamic (just-in-time) encryption to industry-leading digital rights management systems (DRMs).<br/><br/>In the media streaming industry, this service is commonly referred to as a **Packager** or **Origin**.  Other common terms in the industry for this capability include JITP (just-in-time-packager) or JITE (just-in-time-encryption).

## Media Services v3 concepts

|Concepts|Description|Links|
|---|---|---|
|Assets and uploading content|To start managing, encrypting, encoding, analyzing, and streaming media content in Azure, you need to create a Media Services account and upload your digital files into **Assets**.|[Cloud upload and storage](storage-account-concept.md)<br/><br/>[Assets concept](assets-concept.md)|
|Encoding content|Once you upload your high-quality digital media files into Assets, you can encode them into formats that can be played on a wide variety of browsers and devices. <br/><br/>To encode with Media Services v3, you need to create **Transforms** and **Jobs**.|[Transforms and Jobs](transforms-jobs-concept.md)<br/><br/>[Encoding with Media Services](encoding-concept.md)|
|Analyzing content (Video Indexer)|Media Services v3 lets you extract insights from your video and audio files using Media Services v3 presets. To analyze your content using Media Services v3 presets, you need to create **Transforms** and **Jobs**.<br/><br/>If you want more detailed insights, use [Video Indexer](https://docs.microsoft.com/azure/media-services/video-indexer/) directly.|[Analyzing video and audio files](analyzing-video-audio-files-concept.md)|
|Packaging and delivery|Once your content is encoded, you can take advantage of **Dynamic Packaging**. In Media Services, a **Streaming Endpoint** is the dynamic packaging service used to deliver media content to client players. To make videos in the output asset available to clients for playback, you have to create a **Streaming Locator** and then build streaming URLs. <br/><br/>When creating the **Streaming Locator**, in addition to the asset's name, you need to specify **Streaming Policy**. **Streaming Policies** enable you to define streaming protocols and encryption options (if any) for your **Streaming Locators**. Dynamic Packaging is used whether you stream your content live or on-demand. <br/><br/>You can use Media Services **Dynamic Manifests** to stream only a specific rendition or subclips of your video.|[Dynamic packaging](dynamic-packaging-overview.md)<br/><br/>[Streaming Endpoints](streaming-endpoint-concept.md)<br/><br/>[Streaming Locators](streaming-locators-concept.md)<br/><br/>[Streaming Policies](streaming-policy-concept.md)<br/><br/>[Dynamic manifests](filters-dynamic-manifest-overview.md)<br/><br/>[Filters](filters-concept.md)|
|Content protection|With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or/and any of the three major DRM systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients. <br/><br/>If specifying encryption options on your stream, create the **Content Key Policy** and associate it with your **Streaming Locator**. The **Content Key Policy** enables you to configure how the content key is delivered to end clients.<br/><br/> Try to reuse policies whenever the same options are needed.| [Content Key Policies](content-key-policy-concept.md)<br/><br/>[Content protection](content-protection-overview.md)|
|Live streaming|Media Services enables you to deliver live events to your customers on the Azure cloud. **Live Events** are responsible for ingesting and processing the live video feeds. When you create a **Live Event**, an input endpoint is created that you can use to send a live signal from a remote encoder. Once you have the stream flowing into the **Live Event**, you can begin the streaming event by creating an **Asset**, **Live Output**, and **Streaming Locator**. **Live Output** will archive the stream  into the **Asset** and make it available to viewers through the **Streaming Endpoint**. A live event can be set to either a *pass-through* (an on-premises live encoder sends a multiple bitrate stream) or *live encoding* (an on-premises live encoder sends a single bitrate stream). |[Live streaming overview](live-streaming-overview.md)<br/><br/>[Live Events and Live Outputs](live-events-outputs-concept.md)|
|Monitoring with Event Grid|To see the progress of the job, use **Event Grid**. Media Services also emits the live event types. With Event Grid, your apps can listen for and react to events from virtually all Azure services, as well as custom sources. |[Handling Event Grid events](reacting-to-media-services-events.md)<br/><br/>[Schemas](media-services-event-schemas.md)|
|Monitoring with Azure Monitor|Monitor metrics and diagnostic logs that help you understand how your apps are performing with Azure Monitor.|[Metrics and diagnostic logs](media-services-metrics-diagnostic-logs.md)<br/><br/>[Diagnostic logs schemas](media-services-diagnostic-logs-schema.md)|
|Player clients|You can use Azure Media Player to play back media content streamed by Media Services on a wide variety of browsers and devices. Azure Media Player uses industry standards, such as HTML5, Media Source Extensions (MSE), and Encrypted Media Extensions (EME) to provide an enriched adaptive streaming experience. |[Azure Media Player overview](use-azure-media-player.md)|

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

* [Encode remote file and stream video – REST](stream-files-tutorial-with-rest.md)
* [Encode uploaded file and stream video - .NET](stream-files-tutorial-with-api.md)
* [Stream live - .NET](stream-live-tutorial-with-api.md)
* [Analyze your video - .NET](analyze-videos-tutorial-with-api.md)
* [AES-128 dynamic encryption - .NET](protect-with-aes128.md)
* [Encrypt dynamically with multi-DRM - .NET](protect-with-drm.md)
