---
title: Migrate from Azure Media Services v2 to v3 | Microsoft Docs
description: This article describes changes that were introduced in Azure Media Services v3 and shows differences between two versions. The article also provides migration guidance for moving from Media Services v2 to v3.
services: media-services
documentationcenter: na
author: Juliako
manager: femila
editor: ''
tags: ''
keywords: azure media services, stream, broadcast, live, offline

ms.service: media-services
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 03/09/2020
ms.author: juliako
---

# Migration guidance for moving from Media Services v2 to v3

>Get notified about when to revisit this page for updates by copying and pasting this URL: `https://docs.microsoft.com/api/search/rss?search=%22Migrate+from+Azure+Media+Services+v2+to+v3%22&locale=en-us` into your RSS feed reader.

This article provides the migration guidance from Media Services v2 to v3.

If you have a video service developed today on top of the [legacy Media Services v2 APIs](../previous/media-services-overview.md), you should review the following guidelines and considerations prior to migrating to the v3 APIs. There are many benefits and new features in the v3 API that improve the developer experience and capabilities of Media Services. However, as called out in the [Known Issues](#known-issues) section of this article, there are also some limitations due to changes between the API versions. This page will be maintained as the Media Services team makes continued improvements to the v3 APIs and addresses the gaps between the versions. 

## Prerequisites

* Review [Media Services v2 vs. v3](media-services-v2-vs-v3.md)
* [!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Benefits of Media Services v3
  
### API is more approachable

*  v3 is based on a unified API surface, which exposes both management and operations functionality built on Azure Resource Manager. Azure Resource Manager templates can be used to create and deploy Transforms, Streaming Endpoints, Live Events, and more.
* [OpenAPI Specification (formerly called Swagger)](https://aka.ms/ams-v3-rest-sdk) document.
    Exposes the schema for all service components, including file-based encoding.
* SDKs available for [.NET](https://aka.ms/ams-v3-dotnet-ref), .NET Core, [Node.js](/javascript/api/overview/azure/mediaservices/management), [Python](https://aka.ms/ams-v3-python-ref), [Java](https://aka.ms/ams-v3-java-ref), [Go](https://aka.ms/ams-v3-go-ref), and Ruby.
* [Azure CLI](https://aka.ms/ams-v3-cli-ref) integration for simple scripting support.

### New features

* For file-based Job processing, you can use a HTTP(S) URL as the input.<br/>You do not need to have content already stored in Azure, nor do you need to create Assets.
* Introduces the concept of [Transforms](transforms-jobs-concept.md) for file-based Job processing. A Transform can be used to build reusable configurations, to create Azure Resource Manager Templates, and isolate processing settings between multiple customers or tenants.
* An Asset can have multiple [Streaming Locators](streaming-locators-concept.md) each with different [Dynamic Packaging](dynamic-packaging-overview.md) and Dynamic Encryption settings.
* [Content protection](content-key-policy-concept.md) supports multi-key features.
* You can stream Live Events that are up to 24 hours long when using Media Services for transcoding a single bitrate contribution feed into an output stream that has multiple bitrates.
* New Low Latency live streaming support on Live Events. For more information, see [latency](live-event-latency.md).
* Live Event Preview supports [Dynamic Packaging](dynamic-packaging-overview.md) and Dynamic Encryption. This enables content protection on Preview as well as DASH and HLS packaging.
* Live Output is simpler to use than the Program entity in the v2 APIs. 
* Improved RTMP support (increased stability and more source encoder support).
* RTMPS secure ingest.<br/>When you create a Live Event, you get 4 ingest URLs. The 4 ingest URLs are almost identical, have the same streaming token (AppId), only the port number part is different. Two of the URLs are primary and backup for RTMPS.   
* You have role-based access control (RBAC) over your entities. 

## Known issues

*  Currently, you can use the [Azure portal](https://portal.azure.com/) to:

    * manage Media Services v3 [Live Events](live-events-outputs-concept.md), 
    * view (not manage) v3 [Assets](assets-concept.md), 
    * [get info about accessing APIs](access-api-portal.md). 

    For all other management tasks (for example, [Transforms and Jobs](transforms-jobs-concept.md) and [Content protection](content-protection-overview.md)), use the [REST API](https://docs.microsoft.com/rest/api/media/), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).
* You need to provision Media Reserved Units (MRUs) in your account in order to control the concurrency and performance of your Jobs, particularly ones involving Video or Audio Analysis. For more information, see [Scaling Media Processing](../previous/media-services-scale-media-processing-overview.md). You can manage the MRUs using [CLI 2.0 for Media Services v3](media-reserved-units-cli-how-to.md), using the [Azure portal](../previous/media-services-portal-scale-media-processing.md), or using the [v2 APIs](../previous/media-services-dotnet-encoding-units.md). You need to provision MRUs, whether you are using Media Services v2 or v3 APIs.
* Media Services entities created with the v3 API cannot be managed by the v2 API.  
* Not all entities in the V2 API automatically show up in the V3 API.  Following are examples of entities in the two versions that are incompatible:  
    * Jobs and Tasks created in v2 do not show up in v3 as they are not associated with a Transform. The recommendation is to switch to v3 Transforms and Jobs. There will be a relatively short time period of needing to monitor the inflight v2 Jobs during the switchover.
    * Channels and Programs created with v2 (which are mapped to Live Events and Live Outputs in v3) cannot continue being managed with v3. The recommendation is to switch to v3 Live Events and Live Outputs at a convenient Channel stop.<br/>Presently, you cannot migrate continuously running Channels.  

> [!NOTE]
> This page will be maintained as the Media Services team makes continued improvements to the v3 APIs and addresses the gaps between the versions.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

[Tutorial: Encode a remote file based on URL and stream the video - .NET](stream-files-dotnet-quickstart.md)
