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

- [REST v3 GA release](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01) 

    Includes more APIs for Live, Account/Asset level manifest filters, and DRM support.
- Azure CLI 2.0
 
    Azure CLI 2.0 module for all features including Live, Content Key Policies, Account/Asset Filters, Streaming Policies.
- Support for Azure Resource Management 
    - Resource Manager Templating support – Create Live Events from Resource Manager templates.
    - Unified management and operations API – everything in one place.
- Improvement of Asset operations 
    - Ingest from HTTP(s) URLs or Azure Blob Storage SAS URLs.
    - Easier output support to create custom workflows with Azure Functions.
- Simplified Encoding model using new "Transform" object 

    The new object makes it easy to create and share encoding Resource Manager templates and presets. 
- Azure AD Authentication and Role-Based Access Control (RBAC) 

    Secure Transforms, LiveEvents, Content Key Policies, or Assets by Role or Users in Azure Active Directory.
- New client SDKs with more language support 

    Currently supported languages: .NET Core, Java, Node.js, Ruby, Typescript, Python, Go.
- Live Encoding Updates – New Live backend 
    - New low latency mode for live (10 seconds end-to-end).
    - Improved RTMP support (increased stability and more source encoder support).
    - RTMPS secure ingest.

        When you create a LiveEvent you now get 4 ingest URLs. The 4 ingest URLs are almost identical, have the same streaming token (AppId), only the port number part is different. Two of the URLs are primary and backup for RTMPS. 
    - 24 hour transcoding support. 
    - Improved ad-signaling support in RTMP via SCTE35.
- Streaming – CMAF support 
    
    CMAF and 'cbcs' encryption support for Apple HLS (iOS 11+) and MPEG-DASH players that support CMAF.
- File-based Encoder updates

    Web VTT Thumbnail Sprites.
- Improved Event Grid support
    - Azure EventGrid integration for easier development with Logic Apps and Azure Functions. 
    - Subscribe for events on Encoding, Live Channels, and more.
- Video Indexer GA release announced in August

    For new information about currently supported features, see [What is Video Indexer](../../cognitive-services/video-indexer/video-indexer-overview.md?toc=/azure/media-services/video-indexer/toc.json&bc=/azure/media-services/video-indexer/breadcrumb/toc.json). 

## May 2018 - Preview

### .Net SDK

The following features are present in the .Net SDK:

1. **Transforms** and **Jobs** to encode or analyze media content. For examples, see [Stream files](stream-files-tutorial-with-api.md) and [Analyze](analyze-videos-tutorial-with-api.md).
2. **StreamingLocators** for publishing and streaming content to end-user devices
3. **StreamingPolicies** and **ContentKeyPolicies** to configure key delivery and content protection (DRM) when delivering content.
4. **LiveEvents** and **LiveOutputs** to configure the ingest and archiving of live streaming content.
5. **Assets** to store and publish media content in Azure Storage. 
6. **StreamingEndpoints** to configure and scale dynamic packaging, encryption, and streaming for both live and on-demand media content.

### Known issues

* When submitting a job, you can specify to ingest your source video using HTTPS URLs, SAS URLs, or paths to files located in Azure Blob storage. Currently, AMS v3 does not support chunked transfer encoding over HTTPS URLs.

## Next steps

> [!div class="nextstepaction"]
> [Overview](media-services-overview.md)
