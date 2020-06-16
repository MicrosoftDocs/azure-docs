---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Manage assets in Azure Media Services
titleSuffix: Azure Media Services
description: An asset where you input media (for example, through upload or live ingest), output media (from a job output), and publish media from (for streaming). This topic give an overview of how to create a new asset and upload files.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/26/2020
ms.author: juliako
ms.custom: seodec18

---

# Manage assets

In Azure Media Services, an [Asset](https://docs.microsoft.com/rest/api/media/assets) is where you 

* upload media files into an asset,
* ingest and archive live streams into an asset,
* output the results of an encoding of analytics job to an asset,
* publish media for streaming, 
* download files from an asset.

This topic gives an overview of how to upload files into an asset and perform some other common operations. It also provides links to code samples and related topics.

## Prerequisite 

Before you start developing, review:

* [Concepts](concepts-overview.md)
* [Developing with Media Services v3 APIs](media-services-apis-overview.md) (includes information on accessing APIs, naming conventions, and so on) 

## Upload media files into an asset

After the digital files are uploaded into storage and associated with an Asset, they can be used in the Media Services encoding, streaming, and analyzing content workflows. One of the common Media Services workflows is to upload, encode, and stream a file. This section outlines the general steps.

1. Use the Media Services v3 API to create a new "input" Asset. This operation creates a container in the storage account associated with your Media Services account. The API returns the container name (for example, `"container": "asset-b8d8b68a-2d7f-4d8c-81bb-8c7bbbe67ee4"`).

    If you already have a blob container that you want to associate with an Asset, you can specify the container name when you create the Asset. Media Services currently only supports blobs in the container root and not with paths in the file name. Thus, a container with the "input.mp4" file name will work. However, a container with the "videos/inputs/input.mp4" file name won't work.

    You can use the Azure CLI to upload directly to any storage account and container that you have rights to in your subscription.

    The container name must be unique and follow storage naming guidelines. The name doesn't have to follow the Media Services Asset container name (Asset-GUID) formatting.

    ```azurecli
    az storage blob upload -f /path/to/file -c MyContainer -n MyBlob
    ```
2. Get a SAS URL with read-write permissions that will be used to upload digital files into the Asset container.

    You can use the Media Services API to [list the asset container URLs](https://docs.microsoft.com/rest/api/media/assets/listcontainersas).

    **AssetContainerSas.listContainerSas** takes a [ListContainerSasInput](https://docs.microsoft.com/rest/api/media/assets/listcontainersas#listcontainersasinput) parameter on which you set `expiryTime`. The time should be set to  < 24 hours.

    [ListContainerSasInput](https://docs.microsoft.com/rest/api/media/assets/listcontainersas#listcontainersasinput) returns multiple SAS URLs as there are two storage account keys for each storage account. A storage account has two keys because it helps with failover and seamless rotation of storage account keys. The first SAS URL represents the first storage account key and the second SAS URL represents the second key.
3. Use the Azure Storage APIs or SDKs (for example, the [Storage REST API](../../storage/common/storage-rest-api-auth.md) or [.NET SDK](../../storage/blobs/storage-quickstart-blobs-dotnet.md)) to upload files into the Asset container.
4. Use Media Services v3 APIs to create a Transform and a Job to process your "input" Asset. For more information, see [Transforms and Jobs](transform-concept.md).
5. Stream the content from the "output" asset.

### Create a new asset

> [!NOTE]
> An Asset's properties of the Datetime type are always in UTC format.

#### REST

```
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Media/mediaServices/{amsAccountName}/assets/{assetName}?api-version=2018-07-01
```

For a REST example, see the [Create an Asset with REST](https://docs.microsoft.com/rest/api/media/assets/createorupdate#examples) example.

The example shows how to create the **Request Body** where you can specify description, container name, storage account, and other useful info.

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

### See also

* [Create a job input from a local file](job-input-from-local-file-how-to.md)
* [Create a job input from an HTTPS URL](job-input-from-http-how-to.md)

## Ingest and archive live streams into an asset

In Media Services, a [Live Output](https://docs.microsoft.com/rest/api/media/liveoutputs) object is like a digital video recorder that will catch and record your live stream into an asset in your Media Services account. The recorded content is persisted into the container defined by the [Asset](https://docs.microsoft.com/rest/api/media/assets) resource.

For more information, see:

* [Using a cloud DVR](live-event-cloud-dvr.md)
* [Streaming live tutorial](stream-live-tutorial-with-api.md)

## Output the results of a job to an asset

In Media Services, when processing your videos (for example, encoding or analyzing) you need to create an output [asset](assets-concept.md) to store the result of your [job](transforms-jobs-concept.md).

For more information, see:

* [Encoding a video](encoding-concept.md)
* [Create a job input from a local file](job-input-from-local-file-how-to.md)

## Publish an asset for streaming

To publish an asset for streaming, you need to create a [Streaming Locator](streaming-locators-concept.md). The streaming locator needs to know the asset name that you want to publish. 

For more information, see:

[Tutorial: Upload, encode, and stream videos with Media Services v3](stream-files-tutorial-with-api.md)

## Download results of a job from an output asset

You can then download these results of your job to a local folder using Media Service and Storage APIs. 

See the [download files](download-results-howto.md) example.

## Filtering, ordering, paging

See [Filtering, ordering, paging of Media Services entities](entities-overview.md).

## Next steps

See the full code examples that demonstrate how to upload, encode, analyze, stream live and on-demand: 

* [Java](https://docs.microsoft.com/samples/azure-samples/media-services-v3-java/azure-media-services-v3-samples-using-java/), 
* [.NET](https://docs.microsoft.com/samples/azure-samples/media-services-v3-dotnet/azure-media-services-v3-samples-using-net/), 
* [REST](https://docs.microsoft.com/samples/azure-samples/media-services-v3-rest-postman/azure-media-services-postman-collection/).
