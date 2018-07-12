---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Assets in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what assets are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako
---

# Assets

An **Asset** contains digital files (including video, audio, images, thumbnail collections, text tracks and closed caption files) and the metadata about these files. After the digital files are uploaded into an asset, they could be used in the Media Services encoding and streaming workflows.

An asset is mapped to a blob container in the [Azure Storage account](storage-account-concept.md) and the files in the asset are stored as block blobs in that container. You can interact with the Asset files in the containers using the Storage SDK clients.

Azure Media Services supports Blob tiers when the account uses General-purpose v2 (GPv2) storage. With GPv2, you can move files to cool or cold storage. Cold storage is suitable for archiving source files when no longer needed (for example, after they have been encoded.)

In Media Services v3, the job input can be created from assets or from HTTP(s) URLs. To create an asset that can be used as an input for your job, see [Create a job input from a local file](job-input-from-local-file-how-to.md).

Also, read about [storage accounts in Media Services](storage-account-concept.md) and [transforms and jobs](transform-concept.md).

## Asset definition

The following table shows the Asset's properties and gives their definitions.

|Name|Type|Description|
|---|---|---|
|Id|string|Fully qualified resource ID for the resource.|
|name|string|The name of the resource.|
|properties.alternateId |string|The alternate ID of the Asset.|
|properties.assetId |string|The Asset ID.|
|properties.container |string|The name of the asset blob container.|
|properties.created |string|The creation date of the Asset.|
|properties.description |string|The Asset description.|
|properties.lastModified |string|The last modified date of the Asset.|
|properties.storageAccountName |string|The name of the storage account.|
|properties.storageEncryptionFormat |AssetStorageEncryptionFormat |The Asset encryption format. One of None or MediaStorageEncryption.|
|type|string|The type of the resource.|

For the full definition, see [Assets](https://docs.microsoft.com/rest/api/media/assets).

## Filtering, ordering, paging

Media Services supports the following OData query options for Assets: 

* $filter 
* $orderby 
* $top 
* $skiptoken 

### Filtering/ordering

The following table shows how these options may be applied to the Asset properties: 

|Name|Filter|Order|
|---|---|---|
|Id|Supports:<br/>Equals<br/>Greater than<br/>Less Than|Supports:<br/>Ascending<br/>Descending|
|name|||
|properties.alternateId |Supports:<br/>Equals||
|properties.assetId |Supports:<br/>Equals||
|properties.container |||
|properties.created|Supports:<br/>Equals<br/>Greater than<br/>Less Than|Supports:<br/>Ascending<br/>Descending|
|properties.description |||
|properties.lastModified |||
|properties.storageAccountName |||
|properties.storageEncryptionFormat | ||
|type|||

The following C# example filters on the created date:

```csharp
var odataQuery = new ODataQuery<Asset>("properties/created lt 2018-05-11T17:39:08.387Z");
var firstPage = await MediaServicesArmClient.Assets.ListAsync(CustomerResourceGroup, CustomerAccountName, odataQuery);
```

### Pagination

Pagination is supported for each of the four enabled sort orders. 

If a query response contains many (currently over 1000) items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. The page size is not configurable by the user. 

If Assets are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded.) 

The following C# example shows how to enumerate through all the assets in the account.

```csharp
var firstPage = await MediaServicesArmClient.Assets.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.Assets.ListNextAsync(currentPage.NextPageLink);
}
```

For REST examples, see [Assets - List](https://docs.microsoft.com/rest/api/media/assets/list)

## Next steps

> [!div class="nextstepaction"]
> [Stream a file](stream-files-dotnet-quickstart.md)
