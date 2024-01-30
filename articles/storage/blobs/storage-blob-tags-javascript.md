---
title: Use blob index tags to manage and find data with JavaScript
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the JavaScript client library.  
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 11/30/2022
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Use blob index tags to manage and find data with JavaScript

[!INCLUDE [storage-dev-guide-selector-index-tags](../../../includes/storage-dev-guides/storage-dev-guide-selector-index-tags.md)]

This article shows how to use blob index tags to manage and find data using the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob).

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with blob index tags. To learn more, see the authorization guidance for the following REST API operations:
    - [Get Blob Tags](/rest/api/storageservices/get-blob-tags#authorization)
    - [Set Blob Tags](/rest/api/storageservices/set-blob-tags#authorization)
    - [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags#authorization)

## About blob index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

## Set tags

[!INCLUDE [storage-dev-guide-auth-set-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-set-blob-tags.md)]

To set tags at blob upload time, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then use the following method:

- [BlobClient.setTags](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-settags)

The following example performs this task.

```javascript
// A blob can have up to 10 tags. 
//
// const tags = {
//   project: 'End of month billing summary',
//   reportOwner: 'John Doe',
//   reportPresented: 'April 2022'
// }
async function setTags(containerClient, blobName, tags) {

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  // Set tags
  await blockBlobClient.setTags(tags);

  console.log(`uploading blob ${blobName}`);
}
```

You can delete all tags by passing an empty JSON object into the setTags method.

| Related articles |
|--|
| [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md) |
| [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API) |

## Get tags

[!INCLUDE [storage-dev-guide-auth-get-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-get-blob-tags.md)]

To get tags, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then use the following method: 

- [BlobClient.getTags](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-gettags)

The following example shows how to get and iterate over the blob's tags.

```javascript
async function getTags(containerClient, blobName) {

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  // Get tags
  const result = await blockBlobClient.getTags();

  for (const tag in result.tags) {

      console.log(`TAG: ${tag}: ${result.tags[tag]}`);
  }
}
```

## Filter and find data with blob index tags

[!INCLUDE [storage-dev-guide-auth-filter-blob-tags](../../../includes/storage-dev-guides/storage-dev-guide-auth-filter-blob-tags.md)]

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

Data is queried with a JSON object sent as a string. The properties don't need to have additional string quotes but the values do need additional string quotes.

The following table shows some query strings:

|Query string for tags (tagOdataQuery)|Description|
|--|--|
|`id='1' AND project='billing'`|Filter blobs across all containers based on these two properties|
|`owner='PhillyProject' AND createdOn >= '2021-12' AND createdOn <= '2022-06'`|Filter blobs across all containers based on strict property value for `owner` and range of dates for `createdOn` property.|
|`@container = 'my-container' AND createdBy = 'Jill'`|**Filter by container** and specific property. In this query, `createdBy` is a text match and doesn't indicate an authorization match through Active Directory. |


To find blobs, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then use the following method: 

- [BlobServiceClient.findBlobsByTags](/javascript/api/@azure/storage-blob/blobserviceclient#@azure-storage-blob-blobserviceclient-findblobsbytags)

The following example finds all blobs matching the tagOdataQuery parameter.

```javascript
async function findBlobsByQuery(blobServiceClient, tagOdataQuery) {

  // page size
  const maxPageSize = 10;

  let i = 1;
  let marker;

  const listOptions = {
    includeMetadata: true,
    includeSnapshots: false,
    includeTags: true,
    includeVersions: false
  };

  let iterator = blobServiceClient.findBlobsByTags(tagOdataQuery, listOptions).byPage({ maxPageSize });
  let response = (await iterator.next()).value;

  // Prints blob names
  if (response.blobs) {
    for (const blob of response.blobs) {
      console.log(`Blob ${i++}: ${blob.name} - ${JSON.stringify(blob.tags)}`);
    }
  }

  // Gets next marker
  marker = response.continuationToken;
  
  // no more blobs
  if (!marker) return;
  
  // Passing next marker as continuationToken
  iterator = blobServiceClient
    .findBlobsByTags(tagOdataQuery, listOptions)
    .byPage({ continuationToken: marker, maxPageSize });
  response = (await iterator.next()).value;

  // Prints blob names
  if (response.blobs) {
    for (const blob of response.blobs) {
      console.log(`Blob ${i++}: ${blob.name} - ${JSON.stringify(blob.tags)}`);
    }
  }
}
```

And example output for this function shows the matched blobs and their tags, based on the console.log code in the preceding function:

|Response|
|-|
|Blob 1: set-tags-1650565920363-query-by-tag-blob-a-1.txt - {"createdOn":"2022-01","owner":"PhillyProject","project":"set-tags-1650565920363"}|

## Resources

To learn more about how to use index tags to manage and find data using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for managing and using blob index tags use the following REST API operations:

- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/set-and-retrieve-blob-tags.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
