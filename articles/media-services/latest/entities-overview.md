---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services entities overview - Azure | Microsoft Docs
description: This article gives an overview of Azure Media Services entities.  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 12/20/2018
ms.author: juliako
ms.custom: seodec18

---

# Azure Media Services entities overview

This article gives a brief overview of Azure Media Services entities and points to an article for more information about each entity. 

| Topic | Description |
|---|---|
| [Account filters and Asset filters](filters-dynamic-manifest-overview.md)|When delivering your content to customers (streaming Live events or Video on Demand) your client might need more flexibility than what's described in the default Asset's manifest file. Azure Media Services enables you to define [Account Filters](https://docs.microsoft.com/rest/api/media/accountfilters) and [Asset Filters](https://docs.microsoft.com/rest/api/media/assetfilters). Then, use **Dynamic Manifests** based on the predefined filters. |
| [Assets](assets-concept.md)|An [Asset](https://docs.microsoft.com/rest/api/media/assets) entity contains digital files (including video, audio, images, thumbnail collections, text tracks, and closed caption files) and the metadata about these files. After the digital files are uploaded into an Asset, they can be used in the Media Services encoding, streaming, analyzing content workflows.|
| [Content Key Policies](content-key-policy-concept.md)|You can use Media Services to secure your media from the time it leaves your computer through storage, processing, and delivery. With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients.|
| [LiveEvents and LiveOutputs](live-events-outputs-concept.md)|Media Services enables you to deliver live events to your customers on the Azure cloud. To configure your live streaming events in Media Services v3, you need to learn about [Live Events](https://docs.microsoft.com/rest/api/media/liveevents) and [Live Outputs](https://docs.microsoft.com/rest/api/media/liveoutputs).|
| [Streaming Endpoints](streaming-endpoint-concept.md)|A [Streaming Endpoints](https://docs.microsoft.com/rest/api/media/streamingendpoints) entity represents a streaming service that can deliver content directly to a client player application, or to a Content Delivery Network (CDN) for further distribution. The outbound stream from a Streaming Endpoint service can be a live stream, or a video on-demand Asset in your Media Services account. When you create a Media Services account, a **default** Streaming Endpoint is created for you in a stopped state. You cannot delete the  **default** Streaming Endpoint. Additional Streaming Endpoints can be created under the account. To start streaming videos, you need to start the Streaming Endpoint from which you want to stream your video. |
| [Streaming Locators](streaming-locators-concept.md)|You need to provide your clients with a URL that they can use to play back encoded video or audio files, you need to create a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators) and build the streaming URLs.|
| [Streaming Policies](streaming-policy-concept.md)| [Streaming Policies](https://docs.microsoft.com/rest/api/media/streamingpolicies) enable you to define streaming protocols and encryption options for your StreamingLocators. You can either specify the name of a custom Streaming Policy you created or use one of the predefined Streaming Policies offered by Media Services. <br/><br/>When using a custom Streaming Policy, you should design a limited set of such policies for your Media Service account, and reuse them for your Streaming Locators whenever the same encryption options and protocols are needed. You should not be creating a new Streaming Policy for each Streaming Locator.|
| [Transforms and Jobs](transforms-jobs-concept.md)|Use [Transforms](https://docs.microsoft.com/rest/api/media/transforms) to configure common tasks for encoding or analyzing videos. Each **Transform** describes a recipe, or a workflow of tasks for processing your video or audio files.<br/><br/>A [Job](https://docs.microsoft.com/rest/api/media/jobs) is the actual request to Azure Media Services to apply the **Transform** to a given input video or audio content. The **Job** specifies information such as the location of the input video, and the location for the output. You can specify the location of your input video using: HTTPS URLs, SAS URLs, or an Asset.|

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
