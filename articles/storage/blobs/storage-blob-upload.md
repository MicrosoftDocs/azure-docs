---
title: Upload a blob with .NET
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 07/07/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Upload a blob with .NET

This article shows how to upload a blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can upload data to a block blob from a file path, a stream, a binary object, or a text string. You can also open a blob stream and write to it, or upload large blobs in blocks.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for .NET. To learn about setting up your project, including package installation, adding `using` directives, and creating an authorized client object, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob](/rest/api/storageservices/put-blob#authorization)
    - [Put Block](/rest/api/storageservices/put-block#authorization)

## Upload data to a block blob

You can use either of the following methods to upload data to a block blob:

- [Upload](/dotnet/api/azure.storage.blobs.blobclient.upload)
- [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync)

When using these upload methods, the client library may call either [Put Blob](/rest/api/storageservices/put-blob) or a series of [Put Block](/rest/api/storageservices/put-block) calls followed by [Put Block List](/rest/api/storageservices/put-block-list). This behavior depends on the overall size of the object and how the [data transfer options](#specify-data-transfer-options-on-upload) are set.

To open a stream in Blob Storage and write to that stream, use either of the following methods:

- [OpenWrite](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.openwrite)
- [OpenWriteAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.openwriteasync)

## Upload a block blob from a local file path

The following example uploads a block blob from a local file path:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadFile":::

## Upload a block blob from a stream

The following example uploads a block blob by creating a [Stream](/dotnet/api/system.io.stream) object and uploading the stream.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadStream":::

## Upload a block blob from a BinaryData object

The following example uploads a block blob from a [BinaryData](/dotnet/api/system.binarydata) object.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadBinaryData":::

## Upload a block blob from a string

The following example uploads a block blob from a string:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadString":::

## Upload to a stream in Blob Storage

You can open a stream in Blob Storage and write to it. The following example creates a zip file in Blob Storage and writes files to it. Instead of building a zip file in local memory, only one file at a time is in memory. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadToStream":::

## Upload a block blob with configuration options

You can define client library configuration options when uploading a blob. These options can be tuned to improve performance, enhance reliability, and optimize costs. The following code examples show how to use [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions) to define configuration options when calling an upload method.

### Specify data transfer options on upload

You can configure the values in [StorageTransferOptions](/dotnet/api/azure.storage.storagetransferoptions) to improve performance for data transfer operations. The following code example shows how to set values for `StorageTransferOptions` and include the options as part of a `BlobUploadOptions` instance. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadWithTransferOptions":::

To learn more about tuning data transfer options, see [Performance tuning for uploads and downloads with .NET](storage-blobs-tune-upload-download.md).

### Specify transfer validation options on upload

You can specify transfer validation options to help ensure that data is uploaded properly and hasn't been tampered with during transit. Transfer validation options can be defined at the client level using [BlobClientOptions](/dotnet/api/azure.storage.blobs.blobclientoptions), which applies validation options to all methods called from a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) instance. 

You can also override transfer validation options at the method level using [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions). The following code example shows how to create a `BlobUploadOptions` object and specify an algorithm for generating a checksum. The checksum is then used by the service to verify data integrity of the uploaded content.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadWithChecksum":::

The following table shows the available options for the checksum algorithm, as defined by [StorageChecksumAlgorithm](/dotnet/api/azure.storage.storagechecksumalgorithm):

| Name | Value | Description |
| --- | --- | --- |
| Auto | 0 | Recommended. Allows the library to choose an algorithm. Different library versions may choose different algorithms. |
| None | 1 | No selected algorithm. Don't calculate or request checksums.
| MD5 | 2 | Standard MD5 hash algorithm. |
| StorageCrc64 | 3 | Azure Storage custom 64-bit CRC. |

### Upload with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. You can add tags to a [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions) instance, and pass that instance into the `UploadAsync` method.

The following example uploads a block blob with index tags:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadBlobWithTags":::

### Set a blob's access tier on upload

You can set a blob's access tier on upload by using the [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions) class. The following code example shows how to set the access tier when uploading a blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadWithAccessTier":::

Setting the access tier is only allowed for block blobs. You can set the access tier for a block blob to `Hot`, `Cool`, `Cold`, or `Archive`. To set the access tier to `Cold`, you must use a minimum [client library](/dotnet/api/azure.storage.blobs) version of 12.15.0.

To learn more about access tiers, see [Access tiers overview](access-tiers-overview.md).

## Upload a block blob by staging blocks and committing

You can have greater control over how to divide uploads into blocks by manually staging individual blocks of data. When all of the blocks that make up a blob are staged, you can commit them to Blob Storage. You can use this approach to enhance performance by uploading blocks in parallel. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadBlocks":::

## Resources

To learn more about uploading blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for uploading blobs use the following REST API operations:

- [Put Blob](/rest/api/storageservices/put-blob) (REST API)
- [Put Block](/rest/api/storageservices/put-block) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs)

### See also

- [Performance tuning for uploads and downloads](storage-blobs-tune-upload-download.md).
- [Manage and find Azure Blob data with blob index tags](storage-manage-find-blobs.md)
- [Use blob index tags to manage and find data on Azure Blob Storage](storage-blob-index-how-to.md)
