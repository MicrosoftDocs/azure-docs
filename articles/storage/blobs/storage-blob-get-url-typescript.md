---
title: Get container and blob url with TypeScript
titleSuffix: Azure Storage
description: Learn how to get a container or blob URL with TypeScript in Azure Storage by using the JavaScript client library using TypeScript.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 03/21/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts, devx-track-js
---

# Get URL for container or blob with TypeScript

You can get a container or blob URL by using the `url` property of the client object:

- ContainerClient.[url](/javascript/api/@azure/storage-blob/containerclient#@azure-storage-blob-containerclient-url)
- BlobClient.[url](/javascript/api/@azure/storage-blob/blobclient#@azure-storage-blob-blobclient-url)
- BlockBlobClient.[url](/javascript/api/@azure/storage-blob/blockblobclient#@azure-storage-blob-blockblobclient-url)


> [!NOTE]
> The examples in this article assume that you've created a [BlobServiceClient](/javascript/api/@azure/storage-blob/blobserviceclient) object by using the guidance in the [Get started with Azure Blob Storage and TypeScript](storage-blob-typescript-get-started.md) article.
 
## Get URL for container and blob

The following example gets a container URL and a blob URL by accessing the client's **url** property:

:::code language="typescript" source="~/azure_storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-get-url.ts" id="Snippet_GetUrl":::

> [!TIP]
> For loops, you must use the object's `name` property to create a client then get the URL with the client. Iterators don't return client objects, they return item objects. 

### Code samples

View code samples from this article (GitHub):
- [Get URL for container and blob](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/blob-get-url.ts)

## See also

- [Get started with Azure Blob Storage and TypeScript](storage-blob-typescript-get-started.md)
- [Get Blob](/rest/api/storageservices/get-blob) (REST API)
