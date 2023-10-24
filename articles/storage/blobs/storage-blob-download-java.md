---
title: Download a blob with Java
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Java client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 09/08/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Download a blob with Java

[!INCLUDE [storage-dev-guide-selector-download](../../../includes/storage-dev-guides/storage-dev-guide-selector-download.md)]

This article shows how to download a blob using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Java. To learn about setting up your project, including package installation, adding `import` directives, and creating an authorized client object, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform a download operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)

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

## Download a block blob with configuration options

You can define client library configuration options when downloading a blob. These options can be tuned to improve performance and enhance reliability. The following code examples show how to use [BlobDownloadToFileOptions](/java/api/com.azure.storage.blob.options.blobdownloadtofileoptions) to define configuration options when calling a download method.

### Specify data transfer options on download

You can configure values in [ParallelTransferOptions](/java/api/com.azure.storage.common.paralleltransferoptions) to improve performance for data transfer operations. The following values can be tuned for downloads based on the needs of your app:

- `blockSize`: The maximum block size to transfer for each request. You can set this value by using the [setBlockSizeLong](/java/api/com.azure.storage.common.paralleltransferoptions#com-azure-storage-common-paralleltransferoptions-setblocksizelong(java-lang-long)) method.
- `maxConcurrency`: The maximum number of parallel requests issued at any given time as a part of a single parallel transfer. You can set this value by using the [setMaxConcurrency](/java/api/com.azure.storage.common.paralleltransferoptions#com-azure-storage-common-paralleltransferoptions-setmaxconcurrency(java-lang-integer)) method.

Add the following `import` directive to your file to use `ParallelTransferOptions` for a download:

```java
import com.azure.storage.common.*;
```

The following code example shows how to set values for `ParallelTransferOptions` and include the options as part of a `BlobDownloadToFileOptions` instance. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java" id="Snippet_DownloadBlobWithTransferOptions":::

To learn more about tuning data transfer options, see [Performance tuning for uploads and downloads with Java](storage-blobs-tune-upload-download-java.md).

## Resources

To learn more about how to download blobs using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobDownload.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]
