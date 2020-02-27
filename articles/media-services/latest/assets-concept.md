---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Assets
titleSuffix: Azure Media Services
description: Learn about what assets are and how they're used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 08/29/2019
ms.author: juliako
ms.custom: seodec18

---

# Assets in Azure Media Services

In Azure Media Services, an [Asset](https://docs.microsoft.com/rest/api/media/assets) is a core concept. It is where you input media (for example, through upload or live ingest), output media (from a job output), and publish media from (for streaming). 

An Asset is mapped to a blob container in the [Azure Storage account](storage-account-concept.md) and the files in the Asset are stored as block blobs in that container. Assets contain information about digital files stored in Azure Storage (including video, audio, images, thumbnail collections, text tracks, and closed caption files).

Media Services supports Blob tiers when the account uses General-purpose v2 (GPv2) storage. With GPv2, you can move files to [Cool or Archive storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers). **Archive** storage is suitable for archiving source files when no longer needed (for example, after they've been encoded).

The **Archive** storage tier is only recommended for very large source files that have already been encoded and the encoding Job output was put in an output blob container. The blobs in the output container that you want to associate with an Asset and use to stream or analyze your content must exist in a **Hot** or **Cool** storage tier.

## Naming 

### Assets

Asset's names must be unique. Media Services v3 resource names (for example, Assets, Jobs, Transforms) are subject to Azure Resource Manager naming constraints. For more information, see [Naming conventions](media-services-apis-overview.md#naming-conventions).

### Blobs

The names of files/blobs within an asset must follow both the [blob name requirements](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata) and the [NTFS name requirements](https://docs.microsoft.com/windows/win32/fileio/naming-a-file). The reason for these requirements is the files can get copied from blob storage to a local NTFS disk for processing.

## Manage assets in Media Services

For more information, see [Manage assets](manage-assets-concept.md).

## Map v3 asset properties to v2

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

## Storage side encryption

To protect your Assets at rest, the assets should be encrypted by the storage side encryption. The following table shows how the storage side encryption works in Media Services:

|Encryption option|Description|Media Services v2|Media Services v3|
|---|---|---|---|
|Media Services Storage Encryption|AES-256 encryption, key managed by Media Services.|Supported<sup>(1)</sup>|Not supported<sup>(2)</sup>|
|[Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)|Server-side encryption offered by Azure Storage, key managed by Azure or by customer.|Supported|Supported|
|[Storage Client-Side Encryption](https://docs.microsoft.com/azure/storage/common/storage-client-side-encryption)|Client-side encryption offered by Azure storage, key managed by customer in Key Vault.|Not supported|Not supported|

<sup>1</sup> While Media Services does support handling of content in the clear/without any form of encryption, doing so isn't recommended.

<sup>2</sup> In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but won't allow creation of new ones.

## Filtering, ordering, paging

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

* [Stream a file](stream-files-dotnet-quickstart.md)
* [Using a cloud DVR](live-event-cloud-dvr.md)
* [Differences between Media Services v2 and v3](migrate-from-v2-to-v3.md)
