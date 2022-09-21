---
title: Use blob index tags to find data in Azure Blob Storage (JavaScript)
description: Learn how to categorize, manage, and query for blob objects by using the JavaScript client library.  
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: javascript
ms.custom: "devx-track-js"
---

# Use blob index tags to manage and find data in Azure Blob Storage (JavaScript)

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article. Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with JavaScript](storage-blob-container-create.md). 

## Set and retrieve index tags

You can set and get index tags if your code has authorized access by using an account key or if your code uses a security principal that has been given the appropriate role assignments. For more information, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

#### Set tags

You can set tags at blob upload time or by using the following method:

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

#### Get tags

You can get tags by using either of the following methods: 

- [BlobClient.getTags](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-gettags
)

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

You can use index tags to find and filter data if your code has authorized access by using an account key or if your code uses a security principal that has been given the appropriate role assignments. For more information, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

Data is queried with a JSON object sent as a string. The properties don't need to have additional string quotes but the values do need additional string quotes.

The following table shows some query strings:

|Query string for tags (tagOdataQuery)|Description|
|--|--|
|`id='1' AND project='billing'`|Filter blobs across all containers based on these two properties|
|`owner='PhillyProject' AND createdOn >= '2021-12' AND createdOn <= '2022-06'`|Filter blobs across all containers based on strict property value for `owner` and range of dates for `createdOn` property.|
|`@container = 'my-container' AND createdBy = 'Jill'`|**Filter by container** and specific property. In this query, `createdBy` is a text match and doesn't indicate an authorization match through Active Directory. |


You can find data by using the following method: 

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

## See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)
