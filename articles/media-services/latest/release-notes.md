---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Azure Media Services v3 release notes | Microsoft Docs
description: To stay up-to-date with the most recent developments, this article provides you with the latest updates on Azure Media Services v3.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 10/07/2018
ms.author: juliako
---

# Azure Media Services v3 release notes 

To stay up-to-date with the most recent developments, this article provides you with information about:

* The latest releases
* Known issues
* Bug fixes
* Deprecated functionality
* Plans for changes

## October 2018 - GA

### REST v3 GA release

The [REST v3 GA release](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01) includes more APIs for Live, Account/Asset level manifest filters, and DRM support.

### Azure CLI 2.0
 
Azure CLI 2.0 module for all features including Live, Content Key Policies, Account/Asset Filters, Streaming Policies.

### Azure Resource Management 

Support for Azure Resource Management enables unified management and operations API (now everything in one place).

Starting with this release, you can use Resource Manager templates to create Live Events.

### Improvement of Asset operations 

The following improvements were introduced:

- Ingest from HTTP(s) URLs or Azure Blob Storage SAS URLs.
- Easier output support to create custom workflows with Azure Functions.

### New Transform object

The new "Transform" object simplifies the Encoding model. The new object makes it easy to create and share encoding Resource Manager templates and presets. 

### Azure AD Authentication and RBAC

Azure AD Authentication and Role-Based Access Control (RBAC) enable secure Transforms, LiveEvents, Content Key Policies, or Assets by Role or Users in Azure Active Directory.

### Client SDKs  

Currently supported languages: .NET Core, Java, Node.js, Ruby, Typescript, Python, Go.

### Live encoding updates

The following live encoding updates are introduced:

- New low latency mode for live (10 seconds end-to-end).
- Improved RTMP support (increased stability and more source encoder support).
- RTMPS secure ingest.

    When you create a LiveEvent, you now get 4 ingest URLs. The 4 ingest URLs are almost identical, have the same streaming token (AppId), only the port number part is different. Two of the URLs are primary and backup for RTMPS. 
- 24 hour transcoding support. 
- Improved ad-signaling support in RTMP via SCTE35.

### CMAF support

CMAF and 'cbcs' encryption support for Apple HLS (iOS 11+) and MPEG-DASH players that support CMAF.

### Web VTT Thumbnail Sprites

You can now use Standard Encoder to generate a Thumbnail Sprite, which is a JPEG file that contains multiple small resolution thumbnails stitched together into a single (large) image, together with a VTT file. This VTT file specifies the time range in the input video that each thumbnail represents, together with the size and coordinates of that thumbnail within the large JPEG file. Video players use the VTT file and sprite image to show a 'visual' seekbar, providing a viewer with visual feedback when scrubbing back and forward along the video timeline.

For more information, see [Generate a Thumbnail Sprite](TODO).

### Improved Event Grid support

You can see the following Event Grid support improvements:

    - Azure EventGrid integration for easier development with Logic Apps and Azure Functions. 
    - Subscribe for events on Encoding, Live Channels, and more.

### Video Indexer

Video Indexer GA release was announced in August. For new information about currently supported features, see [What is Video Indexer](../../cognitive-services/video-indexer/video-indexer-overview.md?toc=/azure/media-services/video-indexer/toc.json&bc=/azure/media-services/video-indexer/breadcrumb/toc.json). 

## May 2018 - Preview

### .Net SDK

The following features are present in the .Net SDK:

* **Transforms** and **Jobs** to encode or analyze media content. For examples, see [Stream files](stream-files-tutorial-with-api.md) and [Analyze](analyze-videos-tutorial-with-api.md).
* **StreamingLocators** for publishing and streaming content to end-user devices
* **StreamingPolicies** and **ContentKeyPolicies** to configure key delivery and content protection (DRM) when delivering content.
* **LiveEvents** and **LiveOutputs** to configure the ingest and archiving of live streaming content.
* **Assets** to store and publish media content in Azure Storage. 
* **StreamingEndpoints** to configure and scale dynamic packaging, encryption, and streaming for both live and on-demand media content.

### Known issues

* When submitting a job, you can specify to ingest your source video using HTTPS URLs, SAS URLs, or paths to files located in Azure Blob storage. Currently, AMS v3 does not support chunked transfer encoding over HTTPS URLs.

## Next steps

> [!div class="nextstepaction"]
> [Overview](media-services-overview.md)
