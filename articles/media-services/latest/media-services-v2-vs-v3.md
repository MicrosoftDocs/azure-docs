---
title: Migrate from Azure Media Services v2 to v3
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
ms.date: 03/09/2020
ms.author: juliako
---

# Media Services v2 vs. v3

This article describes changes that were introduced in Azure Media Services v3 and shows differences between two versions.

## General changes from v2

* For assets created with v3, Media Services supports only the [Azure Storage server-side storage encryption](https://docs.microsoft.com/azure/storage/common/storage-service-encryption).
    * You can use v3 APIs with Assets created with v2 APIs that had [storage encryption](../previous/media-services-rest-storage-encryption.md) (AES 256) provided by Media Services.
    * You cannot create new Assets with the legacy AES 256 [storage encryption](../previous/media-services-rest-storage-encryption.md) using v3 APIs.
* The [Asset](assets-concept.md)'s properties in v3 differ to from v2, see [how the properties map](#map-v3-asset-properties-to-v2).
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
* To get information about a job, you need to know the Transform name under which the job was created. 
* In v2, XML [input](../previous/media-services-input-metadata-schema.md) and [output](../previous/media-services-output-metadata-schema.md) metadata files get generated as the result of an encoding job. In v3, the metadata format changed from XML to JSON. 
* In Media Services v2, initialization vector (IV) can be specified. In Media Services v3, the FairPlay IV cannot be specified. While it does not impact customers using Media Services for both packaging and license delivery, it can be an issue when using a third party DRM system to deliver the  FairPlay licenses (hybrid mode). In that case, it is important to know that the FairPlay IV is derived from the cbcs key ID and can be retrieved using this formula:

    ```
    string cbcsIV =  Convert.ToBase64String(HexStringToByteArray(cbcsGuid.ToString().Replace("-", string.Empty)));
    ```

    with

    ``` 
    public static byte[] HexStringToByteArray(string hex)
    {
        return Enumerable.Range(0, hex.Length)
            .Where(x => x % 2 == 0)
            .Select(x => Convert.ToByte(hex.Substring(x, 2), 16))
            .ToArray();
    }
    ```

    For more information, see the [Azure Functions C# code for Media Services v3 in hybrid mode for both Live and VOD operations](https://github.com/Azure-Samples/media-services-v3-dotnet-core-functions-integration/tree/master/LiveAndVodDRMOperationsV3).
 
> [!NOTE]
> Review the naming conventions that are applied to [Media Services v3 resources](media-services-apis-overview.md#naming-conventions). Also review [naming blobs](assets-concept.md#naming).

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
 
## Asset specific changes

### Map v3 asset properties to v2

The following table shows how the [Asset](https://docs.microsoft.com/rest/api/media/assets/createorupdate#asset)'s properties in v3 map to Asset's properties in v2.

|v3 properties|v2 properties|
|---|---|
|`id` - (unique) the full Azure Resource Manager path, see examples in [Asset](https://docs.microsoft.com/rest/api/media/assets/createorupdate)||
|`name` - (unique) see [Naming conventions](media-services-apis-overview.md#naming-conventions) ||
|`alternateId`|`AlternateId`|
|`assetId`|`Id` - (unique) value starts with the `nb:cid:UUID:` prefix.|
|`created`|`Created`|
|`description`|`Name`|
|`lastModified`|`LastModified`|
|`storageAccountName`|`StorageAccountName`|
|`storageEncryptionFormat`| `Options` (creation options)|
|`type`||

### Storage side encryption

To protect your Assets at rest, the assets should be encrypted by the storage side encryption. The following table shows how the storage side encryption works in Media Services:

|Encryption option|Description|Media Services v2|Media Services v3|
|---|---|---|---|
|Media Services Storage Encryption|AES-256 encryption, key managed by Media Services.|Supported<sup>(1)</sup>|Not supported<sup>(2)</sup>|
|[Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)|Server-side encryption offered by Azure Storage, key managed by Azure or by customer.|Supported|Supported|
|[Storage Client-Side Encryption](https://docs.microsoft.com/azure/storage/common/storage-client-side-encryption)|Client-side encryption offered by Azure storage, key managed by customer in Key Vault.|Not supported|Not supported|

<sup>1</sup> While Media Services does support handling of content in the clear/without any form of encryption, doing so isn't recommended.

<sup>2</sup> In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but won't allow creation of new ones.

## Code differences

The following table shows the code differences between v2 and v3 for common scenarios.

|Scenario|V2 API|V3 API|
|---|---|---|
|Create an asset and upload a file |[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L113)|[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L169)|
|Submit a job|[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L146)|[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L298)<br/><br/>Shows how to first create a Transform and then submit a Job.|
|Publish an asset with AES encryption |1. Create ContentKeyAuthorizationPolicyOption<br/>2. Create ContentKeyAuthorizationPolicy<br/>3. Create AssetDeliveryPolicy<br/>4. Create Asset and upload content OR Submit job and use output asset<br/>5. Associate AssetDeliveryPolicy with Asset<br/>6. Create ContentKey<br/>7. Attach ContentKey to Asset<br/>8. Create AccessPolicy<br/>9. Create Locator<br/><br/>[v2 .NET example](https://github.com/Azure-Samples/media-services-dotnet-dynamic-encryption-with-aes/blob/master/DynamicEncryptionWithAES/DynamicEncryptionWithAES/Program.cs#L64)|1. Create Content Key Policy<br/>2. Create Asset<br/>3. Upload content or use Asset as JobOutput<br/>4. Create Streaming Locator<br/><br/>[v3 .NET example](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/EncryptWithAES/Program.cs#L105)|
|Get job details and manage jobs |[Manage jobs with v2](../previous/media-services-dotnet-manage-entities.md#get-a-job-reference) |[Manage jobs with v3](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/blob/master/AMSV3Tutorials/UploadEncodeAndStreamFiles/Program.cs#L546)|

> [!NOTE]
> Please bookmark this article and keep checking for updates.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

[Migration guidance for moving from Media Services v2 to v3](migrate-from-v2-to-v3.md)
