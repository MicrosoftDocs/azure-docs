---
title: Delete and restore a blob container with JavaScript - Azure Storage 
description: Learn how to delete and restore a blob container in your Azure Storage account using the JavaScript client library.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.author: normesta
ms.subservice: blobs
ms.devlang: javascript
ms.custom: devx-track-js
---

# Delete and restore a container in Azure Storage with JavaScript

This article shows how to delete containers with the [Azure Storage client library for JavaScript](). If you've enabled container soft delete, you can restore deleted containers.

## Delete a container

To delete a container in JavaScript, use one of the following methods:

- [delete]()
- [deleteIfExists]()

The **delete** method throw an exception if the container doesn't exist.

The **deleteIfExists** method return a Boolean value indicating whether the container was deleted. If the specified container doesn't exist, then this method return **False** to indicate that the container wasn't deleted.

After you delete a container, you can't create a container with the same name for at *least* 30 seconds. Attempting to create a container with the same name will fail with HTTP error code 409 (Conflict). Any other operations on the container or the blobs it contains will fail with HTTP error code 404 (Not Found).

The following example deletes the specified container, and handles the exception if the container doesn't exist:

:::code language="javascript" source="~/azure-storage-snippets/blobs/quickstarts/JavaScript/V12/nodejs/index.js" id="snippet_DeleteContainer":::

The following example shows how to delete all of the containers that start with a specified prefix.

```javascript

```

## Restore a deleted container

When container soft delete is enabled for a storage account, a container and its contents may be recovered after it has been deleted, within a retention period that you specify. You can restore a soft deleted container by calling either of the following methods of the [BlobServiceClient]() class.

- [UndeleteBlobContainer]()
- [UndeleteBlobContainerAsync]()

The following example finds a deleted container, gets the version ID of that deleted container, and then passes that ID into the [UndeleteBlobContainerAsync]() method to restore the container.

```javascript
```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Soft delete for containers](soft-delete-container-overview.md)
- [Enable and manage soft delete for containers](soft-delete-container-enable.md)
- [Restore Container](/rest/api/storageservices/restore-container)
