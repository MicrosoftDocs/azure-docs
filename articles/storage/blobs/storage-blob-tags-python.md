---
title: Use blob index tags to find data with Python
titleSuffix: Azure Storage
description: Learn how to categorize, manage, and query for blob objects by using the Python client library.  
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 01/19/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Use blob index tags to manage and find data with Python

This article shows how to use blob index tags to manage and find data using the [Azure Storage client library for Python](/python/api/overview/azure/storage). 

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. This article shows you how to set, get, and find data using blob index tags.

To learn more about this feature along with known issues and limitations, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

## Set and retrieve index tags

You can set and get index tags if your code has authorized access by using an account key, or if your code uses a security principal that has been given the appropriate role assignments. For more information, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

### Set tags

You can set tags by using the following method:

- [BlobClient.setTags](/java/api/com.azure.storage.blob.specialized.blobclientbase.settags#com-azure-storage-blob-specialized-blobclientbase-settags(java-util-map(java-lang-string-java-lang-string)))

The specified tags in this method will replace existing tags. If old values must be preserved, they must be downloaded and included in the call to this method. The following example shows how to set tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-properties-metadata-tags.py" id="Snippet_SetBLobTags":::

You can delete all tags by passing an empty `Map` object into the `setTags` method:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-properties-metadata-tags.py" id="Snippet_ClearBLobTags":::

### Get tags

You can get tags by using the following method: 

- [BlobClient.getTags](/java/api/com.azure.storage.blob.specialized.BlobClientBase#com-azure-storage-blob-specialized-blobclientbase-gettags())

The following example shows how to retrieve and iterate over the blob's tags:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-properties-metadata-tags.py" id="Snippet_GetBLobTags":::

## Filter and find data with blob index tags

You can use index tags to find and filter data if your code has authorized access by using an account key, or if your code uses a security principal that has been given the appropriate role assignments. For more information, see [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md).

> [!NOTE]
> You can't use index tags to retrieve previous versions. Tags for previous versions aren't passed to the blob index engine. For more information, see [Conditions and known issues](storage-manage-find-blobs.md#conditions-and-known-issues).

You can find data by using the following method: 

- [BlobServiceClient.findBlobsByTags](/java/api/com.azure.storage.blob.blobcontainerclient#com-azure-storage-blob-blobcontainerclient-findblobsbytags(java-lang-string))

The following example finds all blobs tagged as an image:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/Python/blob-devguide/blob-devguide/blob-properties-metadata-tags.py" id="Snippet_FindBlobsByTag":::

## Resources

To learn more about how to use index tags to manage and find data using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for managing and using blob index tags use the following REST API operations:

- [Get Blob Tags](/rest/api/storageservices/get-blob-tags) (REST API)
- [Set Blob Tags](/rest/api/storageservices/set-blob-tags) (REST API)
- [Find Blobs by Tags](/rest/api/storageservices/find-blobs-by-tags) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)