---
title: Get container and blob url with JavaScript or TypeScript
titleSuffix: Azure Storage
description: Learn how to get a container or blob URL in Azure Storage by using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 10/28/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# Get a URL for a container or blob with JavaScript or TypeScript

You can get a container or blob URL by using the `url` property of the client object:

- [ContainerClient.url](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-url)
- [BlobClient.url](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-url)
- [BlockBlobClient.url](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-url)

> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and JavaScript or TypeScript](storage-blob-javascript-get-started.md) article.
 
## Get a URL for a container or blob

The following example gets a container URL and a blob URL by accessing the client's **url** property:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure_storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/get-url.js" id="Snippet_GetUrl":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-get-url.ts" id="Snippet_GetUrl":::

---

> [!TIP]
> When iterating over objects in a loop, use the object's `name` property to create a client, then get the URL with the client. Iterators don't return client objects, they return item objects. 

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/get-url.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-get-url.ts) code samples from this article (GitHub)

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Get Blob](/rest/api/storageservices/get-blob) (REST API)
