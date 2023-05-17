---
title: Download a blob with .NET
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the .NET client library.
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

# Download a blob with .NET

This article shows how to download a blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an upload operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)
- The package **Azure.Storage.Blobs** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project).

## Download a blob

You can use any of the following methods to download a blob:

- [DownloadTo](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadto)
- [DownloadToAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadtoasync)
- [DownloadContent](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadcontent)
- [DownloadContentAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.downloadcontentasync)

You can also open a stream to read from a blob. The stream only downloads the blob as the stream is read from. You can use either of the following methods:

- [OpenRead](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.openread)
- [OpenReadAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.openreadasync)
 
## Download to a file path

The following example downloads a blob to a local file path. If the specified directory doesn't exist, the code throws a [DirectoryNotFoundException](/dotnet/api/system.io.directorynotfoundexception). If the file already exists at `localFilePath`, it's overwritten by default during subsequent downloads.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DownloadBlob.cs" id="Snippet_DownloadBlobToFile":::

## Download to a stream

The following example downloads a blob by creating a [Stream](/dotnet/api/system.io.stream) object and then downloads to that stream. If the specified directory doesn't exist, the code throws a [DirectoryNotFoundException](/dotnet/api/system.io.directorynotfoundexception).

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DownloadBlob.cs" id="Snippet_DownloadBlobToStream":::

## Download to a string

The following example assumes that the blob is a text file, and downloads the blob to a string: 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DownloadBlob.cs" id="Snippet_DownloadBlobToString":::

## Download from a stream

The following example downloads a blob by reading from a stream:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DownloadBlob.cs" id="Snippet_DownloadBlobFromStream":::

## Resources

To learn more about how to download blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/DownloadBlob.cs)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### See also

- [Performance tuning for uploads and downloads](storage-blobs-tune-upload-download.md).
