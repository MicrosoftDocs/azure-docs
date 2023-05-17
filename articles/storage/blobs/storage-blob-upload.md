---
title: Upload a blob with .NET
titleSuffix: Azure Storage
description: Learn how to upload a blob to your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell
ms.date: 04/21/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Upload a blob with .NET

This article shows how to upload a blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can upload data to a block blob from a file path, a stream, a binary object, or a text string. You can also open a blob stream and write to it, or upload large blobs in blocks.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob](/rest/api/storageservices/put-blob#authorization)
    - [Put Block](/rest/api/storageservices/put-block#authorization)
- The package **Azure.Storage.Blobs** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project).

## Upload data to a block blob

You can use either of the following methods to upload data to a block blob:

- [Upload](/dotnet/api/azure.storage.blobs.blobclient.upload)
- [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync)

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

## Upload with index tags

Blob index tags categorize data in your storage account using key-value tag attributes. These tags are automatically indexed and exposed as a searchable multi-dimensional index to easily find data. You can perform this task by adding tags to a [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions) instance, and then passing that instance into the [UploadAsync](/dotnet/api/azure.storage.blobs.blobclient.uploadasync) method.

The following example uploads a block blob with index tags:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadBlobWithTags":::

## Upload to a stream in Blob Storage

You can open a stream in Blob Storage and write to it. The following example creates a zip file in Blob Storage and writes files to it. Instead of building a zip file in local memory, only one file at a time is in memory. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadToStream":::

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