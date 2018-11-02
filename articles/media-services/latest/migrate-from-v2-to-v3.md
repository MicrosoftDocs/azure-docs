---
title: Migrate from Azure Media Services v2 to v3 | Microsoft Docs
description: This article describes changes that were introduced in Azure Media Services v3 and shows differences between two versions.
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
ms.date: 11/01/2018
ms.author: juliako
---

# Migrate from Media Services v2 to v3

This article describes changes that were introduced in Azure Media Services (AMS) v3 and shows differences between two versions.

## Why should you move to v3?

### API is more approachable

*  v3 is based on a unified API surface, which exposes both management and operations functionality built on Azure Resource Manager. Azure Resource Manager templates can be used to create and deploy Transforms, Streaming Endpoints, LiveEvents, and more.
* Open API (aka Swagger) Specification document.
* SDKs available for .Net, .Net Core, Node.js, Python, Java, Ruby.
* Azure CLI integration.

### New features

* Encoding now supports HTTPS ingest (Url-based input).
* Transforms are new in v3. A Transform is used to share configurations, create Azure Resource Manager Templates, and isolate encoding settings for a specific customer or tenant. 
* An Asset can have multiple StreamingLocators each with different Dynamic Packaging and Dynamic Encryption settings.
* Content protection supports multi-key features. 
* LiveEvent Preview supports Dynamic Packaging and Dynamic Encryption. This enables content protection on Preview as well as DASH and HLS packaging.
* LiveOutput is simpler to use than the older Program entity. 
* RBAC support on entities was added.

## Changes from v2

* In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but will not allow creation of new ones.

    For Assets created with v3, Media Services supports the [Azure Storage](https://docs.microsoft.com/azure/storage/common/storage-service-encryption?toc=%2fazure%2fstorage%2fblobs%2ftoc.json) server-side storage encryption.
    
* Media Services SDKs decoupled from the Storage SDK, which gives more control over the Storage SDK used and avoids versioning issues. 
* In v3, all of the encoding bit rates are in bits per second. This is different than the REST v2 Media Encoder Standard presets. For example, the bitrate in v2 would be specified as 128, but in v3 it would be 128000. 
* AssetFiles, AccessPolicies, IngestManifests do not exist in v3.
* ContentKeys are no longer an entity, property of the StreamingLocator.
* Event Grid support replaces NotificationEndpoints.
* Some entities were renamed

  * JobOutput replaces Task, now just part of the Job.
  * LiveEvent replaces Channel.
  * LiveOutput replaces Program.
  * StreamingLocator replaces Locator.
* LiveOutputs do not need to be started explicitely, they start on creation and stop when deleted. Programs worked differently, they had to be startd after creation.
* Deleting a LiveOutput does NOT delete the underlying Asset that it is attached to.  

## Code changes

### Create an asset and upload a file 

[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L113)

[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L169)

### Submit a job

[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L146)

[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L298)

### Publish an asset with AES encryption 

#### v2

1. Create ContentKeyAuthorizationPolicyOption
2. Create ContentKeyAuthorizationPolicy
3. Create AssetDeliveryPolicy
4. Create Asset and upload content OR Submit job and use output asset
5. Associate AssetDeliveryPolicy with Asset
6. Create ContentKey
7. Attach ContentKey to Asset
8. Create AccessPolicy
9. Create Locator

[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L64)

#### v3

1. Create Content Key Policy
2. Create Asset
3. Upload content or use Asset as JobOutput
4. Create StreamingLocator

[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs#L105)

## Known issues

- Currently, Media Reserved Units can only be managed using the Media Services v2 API. For more information, see [Scaling media processing](../previous/media-services-scale-media-processing-overview.md).
- Media Services resources created with the v3 API cannot be managed by the v2 API.
- Most Media Services entities that were created with the v2 API, can continue being managed using the v3 API. There are a few exceptions:  
    - Jobs and Tasks created in v2 do not show up in v3 as they are not associated with a Transform. Since Jobs and Tasks are relatively short-lived entities (essentially only useful while in flight) the recommendation is to switch to v3 Transforms and Jobs. There will be a relatively short time period of needing to monitor the inflight v2 Jobs during the switchover.
    - Channels and Programs created with v2 (mapped to LiveEvents and LiveOutputs in v3) cannot continue being managed with v3. The recommendation is to switch to v3 LiveEvents and LiveOutputs at a convenient Channel Stop. 
     
        Presently, you cannot migrate continuously running Channels. Media Services team is working on adding this feature.
        
- Currently, you cannot use the Azure portal to manage v3 resources. Use REST API or one of the supported SDKs.

## Next steps

To see how easy it is to start encoding and streaming video files, check out [Stream files](stream-files-dotnet-quickstart.md). 

