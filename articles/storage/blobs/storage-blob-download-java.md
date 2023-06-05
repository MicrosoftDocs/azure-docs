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

This article shows how to download a blob using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)
- The package **azure-storage-blob** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md#set-up-your-project).

## Download a blob

You can use any of the following methods to download a blob:

- [downloadContent](/java/api/com.azure.storage.blob.specialized.blobclientbase)
- [downloadStream](/java/api/com.azure.storage.blob.specialized.blobclientbase)
- [downloadToFile](/java/api/com.azure.storage.blob.specialized.blobclientbase)
 
## Download to a file path

The following example downloads a blob to a local file path:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobFile":::

## Download to a stream

The following example downloads a blob to an `OutputStream` object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBLobStream":::

## Download to a string

The following example assumes that the blob is a text file, and downloads the blob to a `String` object:

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