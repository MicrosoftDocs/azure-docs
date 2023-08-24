---
title: Delete and restore a blob with JavaScript
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the JavaScript client library
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 11/30/2022
ms.service: azure-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Delete and restore a blob with JavaScript

This article shows how to delete blobs with the [Azure Storage client library for JavaScript](https://www.npmjs.com/package/@azure/storage-blob). If you've enabled [soft delete for blobs](soft-delete-blob-overview.md), you can restore deleted blobs during the retention period.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to delete a blob, or to restore a soft-deleted blob. To learn more, see the authorization guidance for the following REST API operations:
    - [Delete Blob](/rest/api/storageservices/delete-blob#authorization)
    - [Undelete Blob](/rest/api/storageservices/undelete-blob#authorization)

## Delete a blob

To delete a blob, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then call either of these methods:

- [BlobClient.delete](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-delete)
- [BlobClient.deleteIfExists](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-deleteifexists)

The following example deletes a blob.

```javascript
async function deleteBlob(containerClient, blobName){

  // include: Delete the base blob and all of its snapshots.
  // only: Delete only the blob's snapshots and not the blob itself.
  const options = {
    deleteSnapshots: 'include' // or 'only'
  }

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.delete(options);

  console.log(`deleted blob ${blobName}`);

}
```

The following example deletes a blob if it exists.

```javascript
async function deleteBlobIfItExists(containerClient, blobName){

  // include: Delete the base blob and all of its snapshots.
  // only: Delete only the blob's snapshots and not the blob itself.
  const options = {
    deleteSnapshots: 'include' // or 'only'
  }

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.deleteIfExists(options);

  console.log(`deleted blob ${blobName}`);

}
```

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot. 

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs, create a [BlobClient](storage-blob-javascript-get-started.md#create-a-blobclient-object) then call the following method:

- [BlobClient.undelete](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-undelete)

This method restores soft-deleted blobs and any deleted snapshots associated with it. Calling this method for a blob that has not been deleted has no effect. 

```javascript
async function undeleteBlob(containerClient, blobName){

  // Create blob client from container client
  const blockBlobClient = await containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.undelete();

  console.log(`undeleted blob ${blobName}`);

}
```

## Resources

To learn more about how to delete blobs and restore deleted blobs using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/delete-blob.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)
