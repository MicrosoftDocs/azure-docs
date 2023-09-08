---
title: Download a blob with .NET
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the .NET client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/23/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Download a blob with .NET

This article shows how to download a blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for .NET. To learn about setting up your project, including package installation, adding `using` directives, and creating an authorized client object, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform a download operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)

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

## Download a block blob with configuration options

You can define client library configuration options when downloading a blob. These options can be tuned to improve performance and enhance reliability. The following code examples show how to use [BlobDownloadToOptions](/dotnet/api/azure.storage.blobs.models.blobdownloadtooptions) to define configuration options when calling a download method. Note that the same options are available for [BlobDownloadOptions](/dotnet/api/azure.storage.blobs.models.blobdownloadoptions).

### Specify data transfer options on download

You can configure the values in [StorageTransferOptions](/dotnet/api/azure.storage.storagetransferoptions) to improve performance for data transfer operations. The following code example shows how to set values for `StorageTransferOptions` and include the options as part of a `BlobDownloadToOptions` instance. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DownloadBlob.cs" id="Snippet_DownloadBlobWithTransferOptions":::

To learn more about tuning data transfer options, see [Performance tuning for uploads and downloads](storage-blobs-tune-upload-download.md).

### Specify transfer validation options on download

You can specify transfer validation options to help ensure that data is downloaded properly and hasn't been tampered with during transit. Transfer validation options can be defined at the client level using [BlobClientOptions](/dotnet/api/azure.storage.blobs.blobclientoptions), which applies validation options to all methods called from a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) instance. 

You can also override transfer validation options at the method level using [BlobDownloadToOptions](/dotnet/api/azure.storage.blobs.models.blobdownloadtooptions). The following code example shows how to create a `BlobDownloadToOptions` object and specify an algorithm for generating a checksum. The checksum is then used by the service to verify data integrity of the downloaded content.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/DownloadBlob.cs" id="Snippet_DownloadBlobWithChecksum":::

The following table shows the available options for the checksum algorithm, as defined by [StorageChecksumAlgorithm](/dotnet/api/azure.storage.storagechecksumalgorithm):

| Name | Value | Description |
| --- | --- | --- |
| Auto | 0 | Recommended. Allows the library to choose an algorithm. Different library versions may choose different algorithms. |
| None | 1 | No selected algorithm. Don't calculate or request checksums.
| MD5 | 2 | Standard MD5 hash algorithm. |
| StorageCrc64 | 3 | Azure Storage custom 64-bit CRC. |

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
