---
title: Upload a blob with Java
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 11/16/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java
---

# Upload a block blob with Java

This article shows how to upload a block blob using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can upload a blob, open a blob stream and write to the stream, or upload blobs with index tags.

Blobs in Azure Storage are organized into containers. Before you can upload a blob, you must first create a container. To learn how to create a container, see [Create a container in Azure Storage with Java](storage-blob-container-create-java.md). 

To upload a blob using a stream or a binary object, use the following method:

- [upload](/java/api/com.azure.storage.blob.blobclient)

To upload a blob using a file path, use the following method:

- [uploadFromFile](/java/api/com.azure.storage.blob.blobclient)

Each of these methods can be called using a [BlobClient](/java/api/com.azure.storage.blob.blobclient) object or a [BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient) object.

## Upload data to a block blob

The following example uploads `BinaryData` to a blob using a `BlobClient` object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobData":::

## Upload a block blob from a stream

The following example uploads a blob by creating a `ByteArrayInputStream` object, then uploading that stream object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobStream":::

## Upload a block blob from a local file path

The following example uploads a file to a blob using a `BlobClient` object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobFile":::

## Upload a block blob with index tags

The following example uploads a block blob with index tags set using `BlobUploadFromFileOptions`:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobTags":::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)