---
title: Get container and blob url with JavaScript
titleSuffix: Azure Storage
description: Learn how to get a container or blob URL in Azure Storage by using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 09/13/2022
ms.service: azure-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Get URL for container or blob with JavaScript

You can get a container or blob URL by using the `url` property of the client object:

- ContainerClient.[url](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-url)
- BlobClient.[url](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-url)
- BlockBlobClient.[url](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-url)


The [sample code snippets](https://github.com/Azure-Samples/AzureStorageSnippets/tree/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide) are available in GitHub as runnable Node.js files.

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md) article.
 
## Get URL for container and blob

The following example gets a container URL and a blob URL by accessing the client's **url** property:

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/get-url.js" id="Snippet_GetUrl":::

> [!TIP]
> For loops, you must use the object's `name` property to create a client then get the URL with the client. Iterators don't return client objects, they return item objects. 

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Get Blob](/rest/api/storageservices/get-blob) (REST API)
