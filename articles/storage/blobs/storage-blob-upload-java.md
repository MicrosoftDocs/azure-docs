---
title: Upload a blob with Java
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/02/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Upload a block blob with Java

This article shows how to upload a block blob using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can upload data to a block blob from a file path, a stream, a binary object, or a text string. You can also upload blobs with index tags.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Java. To learn about setting up your project, including package installation, adding `import` directives, and creating an authorized client object, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob](/rest/api/storageservices/put-blob#authorization)
    - [Put Block](/rest/api/storageservices/put-block#authorization)

## Upload data to a block blob

To upload a block blob from a stream or a binary object, use the following method:

- [upload](/java/api/com.azure.storage.blob.blobclient)

To upload a block blob from a file path, use the following method:

- [uploadFromFile](/java/api/com.azure.storage.blob.blobclient)

Each of these methods can be called using a [BlobClient](/java/api/com.azure.storage.blob.blobclient) object or a [BlockBlobClient](/java/api/com.azure.storage.blob.specialized.blockblobclient) object.

## Upload a block blob from a local file path

The following example uploads a file to a block blob using a `BlobClient` object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobFile":::

## Upload a block blob from a stream

The following example uploads a block blob by creating a `ByteArrayInputStream` object, then uploading that stream object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobStream":::

## Upload a block blob from a BinaryData object

The following example uploads `BinaryData` to a block blob using a `BlobClient` object:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobData":::

## Upload a block blob with configuration options

You can define client library configuration options when uploading a blob. These options can be tuned to improve performance, enhance reliability, and optimize costs. The following code examples show how to use [BlobUploadFromFileOptions](/java/api/com.azure.storage.blob.options.blobuploadfromfileoptions) to define configuration options when calling an upload method. If you're not uploading from a file, you can set similar options using [BlobParallelUploadOptions](/java/api/com.azure.storage.blob.options.blobparalleluploadoptions) on an upload method.

### Specify data transfer options on upload

You can configure values in [ParallelTransferOptions](/java/api/com.azure.storage.blob.models.paralleltransferoptions) to improve performance for data transfer operations. The following table lists the methods you can use to set these options, along with a description:

| Method | Description |
| --- | --- |
| [`setBlockSizeLong(Long blockSize)`](/java/api/com.azure.storage.blob.models.paralleltransferoptions#com-azure-storage-blob-models-paralleltransferoptions-setblocksizelong(java-lang-long)) | Sets the block size to transfer for each request. For uploads, the parameter `blockSize` is the size of each block that's staged. This value also determines the number of requests that need to be made. If `blockSize` is large, the upload makes fewer network calls, but each individual call sends more data. |
| [`setMaxConcurrency(Integer maxConcurrency)`](/java/api/com.azure.storage.blob.models.paralleltransferoptions#com-azure-storage-blob-models-paralleltransferoptions-setmaxconcurrency(java-lang-integer)) | The parameter `maxConcurrency` is the maximum number of parallel requests that are issued at any given time as a part of a single parallel transfer. This value applies per API call. |
| [`setMaxSingleUploadSizeLong(Long maxSingleUploadSize)`](/java/api/com.azure.storage.blob.models.paralleltransferoptions#com-azure-storage-blob-models-paralleltransferoptions-setmaxsingleuploadsizelong(java-lang-long)) | If the size of the data is less than or equal to this value, it's uploaded in a single put rather than broken up into chunks. If the data is uploaded in a single shot, the block size is ignored. |

The following code example shows how to set values for [ParallelTransferOptions](/java/api/com.azure.storage.blob.models.paralleltransferoptions) and include the options as part of a [BlobUploadFromFileOptions](/java/api/com.azure.storage.blob.options.blobuploadfromfileoptions) instance. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobWithTransferOptions":::

### Upload a block blob with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data.

The following example uploads a block blob with index tags set using [BlobUploadFromFileOptions](/java/api/com.azure.storage.blob.options.blobuploadfromfileoptions):

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobTags":::

### Set a blob's access tier on upload

You can set a blob's access tier on upload by using the [BlobUploadFromFileOptions](/java/api/com.azure.storage.blob.options.blobuploadfromfileoptions) class. The following code example shows how to set the access tier when uploading a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlobWithAccessTier":::

Setting the access tier is only allowed for block blobs. You can set the access tier for a block blob to `Hot`, `Cool`, `Cold`, or `Archive`. To set the access tier to `Cold`, you must use a minimum [client library](/java/api/overview/azure/storage-blob-readme) version of 12.21.0.

To learn more about access tiers, see [Access tiers overview](access-tiers-overview.md).

## Upload a block blob by staging blocks and committing

You can have greater control over how to divide uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage. You can use this approach to enhance performance by uploading blocks in parallel. 

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java" id="Snippet_UploadBlocks":::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobUpload.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
