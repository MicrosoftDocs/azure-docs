---
title: Download a blob with Java
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Java client library.
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

# Download a blob with Java

This article shows how to download a blob using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can download a blob by using any of the following methods:

- [downloadContent](/java/api/com.azure.storage.blob.specialized.blobclientbase)
- [downloadStream](/java/api/com.azure.storage.blob.specialized.blobclientbase)
- [downloadToFile](/java/api/com.azure.storage.blob.specialized.blobclientbase)
 
## Download to a file path

The following example downloads a blob by using a file path:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobFile":::

## Download to a stream

The following example downloads a blob to an `OutputStream`:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobStream":::

## Download to a string

The following example downloads a blob to a `String` object. This example assumes that the blob is a text file.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobText":::

## Download from a stream

The following example downloads a blob by opening a `BlobInputStream` and reading from the stream:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_ReadBlobStream":::

## Resources

To learn more about how to download blobs using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]