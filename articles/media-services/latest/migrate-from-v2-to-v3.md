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
ms.date: 05/01/2019
ms.author: juliako
---

# Migration guidance for moving from Media Services v2 to v3

This article describes changes that were introduced in Azure Media Services v3, shows differences between two versions, and provides the migration guidance.

If you have a video service developed today on top of the [legacy Media Services v2 APIs](../previous/media-services-overview.md), you should review the following guidelines and considerations prior to migrating to the v3 APIs. There are many benefits and new features in the v3 API that improve the developer experience and capabilities of Media Services. However, as called out in the [Known Issues](#known-issues) section of this article, there are also some limitations due to changes between the API versions. This page will be maintained as the Media Services team makes continued improvements to the v3 APIs and addresses the gaps between the versions. 

> [!NOTE]
> Currently, you cannot use the Azure portal to manage v3 resources. Use the [REST API](https://aka.ms/ams-v3-rest-ref), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

## Benefits of Media Services v3
  
### API is more approachable

*  v3 is based on a unified API surface, which exposes both management and operations functionality built on Azure Resource Manager. Azure Resource Manager templates can be used to create and deploy Transforms, Streaming Endpoints, Live Events, and more.
* [OpenAPI Specification (formerly called Swagger)](https://aka.ms/ams-v3-rest-sdk) document.
    Exposes the schema for all service components, including file-based encoding.
* SDKs available for [.NET](https://aka.ms/ams-v3-dotnet-ref), .NET Core, [Node.js](https://aka.ms/ams-v3-nodejs-ref), [Python](https://aka.ms/ams-v3-python-ref), [Java](https://aka.ms/ams-v3-java-ref), [Go](https://aka.ms/ams-v3-go-ref), and Ruby.
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

## Changes from v2

* For Assets created with v3, Media Services supports only the [Azure Storage server-side storage encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).
    * You can use v3 APIs with Assets created with v2 APIs that had [storage encryption](../previous/media-services-rest-storage-encryption.md) (AES 256) provided by Media Services.
    * You cannot create new Assets with the legacy AES 256 [storage encryption](../previous/media-services-rest-storage-encryption.md) using v3 APIs.
* The Asset's properties in v3 differ to from v2, see [how the properties map](assets-concept.md#map-v3-asset-properties-to-v2).
* The v3 SDKs are now decoupled from the Storage SDK, which gives you more control over the version of Storage SDK you want to use and avoids versioning issues. 
* In the v3 APIs, all of the encoding bit rates are in bits per second. This is different than the v2 Media Encoder Standard presets. For example, the bitrate in v2 would be specified as 128 (kbps), but in v3 it would be 128000 (bits/second). 
* Entities AssetFiles, AccessPolicies, and IngestManifests do not exist in v3.
* The IAsset.ParentAssets property does not exist in v3.
* ContentKeys is no longer an entity, it is now a property of the Streaming Locator.
* Event Grid support replaces NotificationEndpoints.
* The following entities were renamed
    * Job Output replaces Task, and is now part of a Job.
    * Streaming Locator replaces Locator.
    * Live Event replaces Channel.<br/>Live Events billing is based on Live Channel meters. For more information, see [billing](live-event-states-billing.md) and [pricing](https://azure.microsoft.com/pricing/details/media-services/).
    * Live Output replaces Program.
* Live Outputs start on creation and stop when deleted. Programs worked differently in the v2 APIs, they had to be started after creation.
*  To get information about a job, you need to know the Transform name under which the job was created. 

## Feature gaps with respect to v2 APIs

The v3 API has the following feature gaps with respect to the v2 API. Closing the gaps is work in progress.

* The [Premium Encoder](../previous/media-services-premium-workflow-encoder-formats.md) and the legacy [media analytics processors](../previous/media-services-analytics-overview.md) (Azure Media Services Indexer 2 Preview, Face Redactor, etc.) are not accessible via v3.<br/>Customers who wish to migrate from the Media Indexer 1 or 2 preview can immediately use the AudioAnalyzer preset in the v3 API.  This new preset contains more features than the older Media Indexer 1 or 2. 
* Many of the [advanced features of the Media Encoder Standard in v2](../previous/media-services-advanced-encoding-with-mes.md) APIs are currently not available in v3, such as:
  
    * Stitching of Assets
    * Overlays
    * Cropping
    * Thumbnail Sprites
    * Inserting a silent audio track when input has no audio
    * Inserting a video track when input has no video
* Live Events with transcoding currently do not support Slate insertion mid-stream and ad marker insertion via API call. 

> [!NOTE]
> Please bookmark this article and keep checking for updates.
 
## Code differences

The following table shows the code differences between v2 and v3 for common scenarios.

|Scenario|V2 API|V3 API|
|---|---|---|
|Create an asset and upload a file |[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L113)|[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L169)|
|Submit a job|[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L146)|[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L298)<br/><br/>Shows how to first create a Transform and then submit a Job.|
|Publish an asset with AES encryption |1. Create ContentKeyAuthorizationPolicyOption<br/>2. Create ContentKeyAuthorizationPolicy<br/>3. Create AssetDeliveryPolicy<br/>4. Create Asset and upload content OR Submit job and use output asset<br/>5. Associate AssetDeliveryPolicy with Asset<br/>6. Create ContentKey<br/>7. Attach ContentKey to Asset<br/>8. Create AccessPolicy<br/>9. Create Locator<br/><br/>[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L64)|1. Create Content Key Policy<br/>2. Create Asset<br/>3. Upload content or use Asset as JobOutput<br/>4. Create Streaming Locator<br/><br/>[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs#L105)|
|Get job details and manage jobs |[Manage jobs with v2](../previous/media-services-dotnet-manage-entities.md#get-a-job-reference) |[Manage jobs with v3](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L546)|

## Known issues

* Currently, you cannot use the Azure portal to manage v3 resources. Use the [REST API](https://aka.ms/ams-v3-rest-sdk), CLI, or one of the supported SDKs.
* You need to provision Media Reserved Units (MRUs) in your account in order to control the concurrency and performance of your Jobs, particularly ones involving Video or Audio Analysis. For more information, see [Scaling Media Processing](../previous/media-services-scale-media-processing-overview.md). You can manage the MRUs using [CLI 2.0 for Media Services v3](media-reserved-units-cli-how-to.md), using the [Azure portal](../previous/media-services-portal-scale-media-processing.md), or using the [v2 APIs](../previous/media-services-dotnet-encoding-units.md). You need to provision MRUs, whether you are using Media Services v2 or v3 APIs.
* Media Services entities created with the v3 API cannot be managed by the v2 API.  
* It is not recommended to manage entities that were created with v2 APIs via the v3 APIs. Following are examples of the differences that make the entities in two versions incompatible:   
    * Jobs and Tasks created in v2 do not show up in v3 as they are not associated with a Transform. The recommendation is to switch to v3 Transforms and Jobs. There will be a relatively short time period of needing to monitor the inflight v2 Jobs during the switchover.
    * Channels and Programs created with v2 (which are mapped to Live Events and Live Outputs in v3) cannot continue being managed with v3. The recommendation is to switch to v3 Live Events and Live Outputs at a convenient Channel stop.<br/>Presently, you cannot migrate continuously running Channels.  

> [!NOTE]
> This page will be maintained as the Media Services team makes continued improvements to the v3 APIs and addresses the gaps between the versions.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

To see how easy it is to start encoding and streaming video files, check out [Stream files](stream-files-dotnet-quickstart.md). 

