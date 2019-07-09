---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Assets in Azure Media Services  | Microsoft Docs
description: This article gives an explanation of what assets are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 07/02/2019
ms.author: juliako
ms.custom: seodec18

---

# Assets

In Azure Media Services, an [Asset](https://docs.microsoft.com/rest/api/media/assets) contains information about digital files stored in Azure Storage (including video, audio, images, thumbnail collections, text tracks, and closed caption files). 

An Asset is mapped to a blob container in the [Azure Storage account](storage-account-concept.md) and the files in the Asset are stored as block blobs in that container. Media Services supports Blob tiers when the account uses General-purpose v2 (GPv2) storage. With GPv2, you can move files to [Cool or Archive storage](https://docs.microsoft.com/azure/storage/blobs/storage-blob-storage-tiers). **Archive** storage is suitable for archiving source files when no longer needed (for example, after they have been encoded).

The **Archive** storage tier is only recommended for very large source files that have already been encoded and the encoding Job output was put in an output blob container. The blobs in the output container that you want to associate with an Asset and use to stream or analyze your content, must exist in a **Hot** or **Cool** storage tier.

## Upload digital files into Assets

After the digital files are uploaded into storage and associated with an Asset, they can be used in the Media Services encoding, streaming, analyzing content workflows. One of the common Media Services workflows is to upload, encode, and stream a file. This section outlines the general steps.

> [!TIP]
> Before you start developing, review [Developing with Media Services v3 APIs](media-services-apis-overview.md) (includes information on accessing APIs, naming conventions, etc.)

1. Use the Media Services v3 API to create a new "input" Asset. This operation creates a container in the storage account associated with your Media Services account. The API returns the container name (for example, `"container": "asset-b8d8b68a-2d7f-4d8c-81bb-8c7bbbe67ee4"`).
   
    If you already have a blob container that you want to associate with an Asset, you can specify the container name when creating the Asset. Media Services currently only supports blobs in the container root and not with paths in the file name. Thus, a container with the "input.mp4" file name will work. However, a container with the "videos/inputs/input.mp4" file name, will not work.

    You can use the Azure CLI to upload directly to any storage account and container that you have rights to in your subscription. <br/>The container name must be unique and follow storage naming guidelines. The name doesn't have to follow the Media Services Asset container name (Asset-GUID) formatting. 
    
    ```azurecli
    az storage blob upload -f /path/to/file -c MyContainer -n MyBlob
    ```
2. Get a SAS URL with read-write permissions that will be used to upload digital files into the Asset container. You can use the Media Services API to [list the asset container URLs](https://docs.microsoft.com/rest/api/media/assets/listcontainersas).
3. Use the Azure Storage APIs or SDKs (for example, the [Storage REST API](../../storage/common/storage-rest-api-auth.md), [JAVA SDK](../../storage/blobs/storage-quickstart-blobs-java-v10.md), or [.NET SDK](../../storage/blobs/storage-quickstart-blobs-dotnet.md)) to upload files into the Asset container. 
4. Use Media Services v3 APIs to create a Transform and a Job to process your "input" Asset. For more information, see [Transforms and Jobs](transform-concept.md).
5. Stream the content from the "output" asset.

For a full .NET example that shows how to: create the Asset, get a writable SAS URL to the Asset’s container in storage, upload the file into the container in storage using the SAS URL, see [Create a job input from a local file](job-input-from-local-file-how-to.md).

### Create a new asset

> [!NOTE]
> Asset's properties of the Datetime type are always in UTC format.

#### REST

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{amsAccountName}/assets/{assetName}?api-version=2018-07-01
```

For a REST example, see the [Create an Asset with REST](https://docs.microsoft.com/rest/api/media/assets/createorupdate#examples) example.

The example shows how to create the **Request Body** where you can specify useful information like description, container name, storage account, and other information.

#### cURL

```cURL
curl -X PUT \
  'https://management.azure.com/subscriptions/00000000-0000-0000-000000000000/resourceGroups/resourceGroupName/providers/Microsoft.Media/mediaServices/amsAccountName/assets/myOutputAsset?api-version=2018-07-01' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "properties": {
    "description": "",
  }
}'
```

#### .NET

```csharp
 Asset asset = await client.Assets.CreateOrUpdateAsync(resourceGroupName, accountName, assetName, new Asset());
```

For a full example, see [Create a job input from a local file](job-input-from-local-file-how-to.md). In Media Services v3, a job's input can also be created from HTTPS URLs (see [Create a job input from an HTTPS URL](job-input-from-http-how-to.md)).

## Map v3 asset properties to v2

The following table shows how the [Asset](https://docs.microsoft.com/rest/api/media/assets/createorupdate#asset)'s properties in v3 map to Asset's properties in v2.

|v3 properties|v2 properties|
|---|---|
|id - (unique) the full Azure Resource Manager path, see examples in [Asset](https://docs.microsoft.com/rest/api/media/assets/createorupdate)||
|name - (unique) see [Naming conventions](media-services-apis-overview.md#naming-conventions) ||
|alternateId|AlternateId|
|assetId|Id - (unique) value starts with the `nb:cid:UUID:` prefix.|
|created|Created|
|description|Name|
|lastModified|LastModified|
|storageAccountName|StorageAccountName|
|storageEncryptionFormat| Options (creation options)|
|type||

## Storage side encryption

To protect your Assets at rest, the assets should be encrypted by the storage side encryption. The following table shows how the storage side encryption works in Media Services:

|Encryption option|Description|Media Services v2|Media Services v3|
|---|---|---|---|
|Media Services Storage Encryption|AES-256 encryption, key managed by Media Services|Supported<sup>(1)</sup>|Not supported<sup>(2)</sup>|
|[Storage Service Encryption for Data at Rest](https://docs.microsoft.com/azure/storage/common/storage-service-encryption)|Server-side encryption offered by Azure Storage, key managed by Azure or by customer|Supported|Supported|
|[Storage Client-Side Encryption](https://docs.microsoft.com/azure/storage/common/storage-client-side-encryption)|Client-side encryption offered by Azure storage, key managed by customer in Key Vault|Not supported|Not supported|

<sup>1</sup> While Media Services does support handling of content in the clear/without any form of encryption, doing so is not recommended.

<sup>2</sup> In Media Services v3, storage encryption (AES-256 encryption) is only supported for backwards compatibility when your Assets were created with Media Services v2. Meaning v3 works with existing storage encrypted assets but will not allow creation of new ones.

## Filtering, ordering, paging

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

* [Stream a file](stream-files-dotnet-quickstart.md)
* [Using a cloud DVR](live-event-cloud-dvr.md)
* [Differences between Media Services v2 and v3](migrate-from-v2-to-v3.md)
