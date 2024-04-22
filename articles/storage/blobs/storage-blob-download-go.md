---
title: Download a blob with Go
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Go client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/22/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Download a blob with Go

[!INCLUDE [storage-dev-guide-selector-download](../../../includes/storage-dev-guides/storage-dev-guide-selector-download.md)]

This article shows how to download a blob using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). You can download blob data to various destinations, including a local file path, stream, or text string. You can also open a blob stream and read from it.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client module for Go. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Go](storage-blob-go-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform a download operation. To learn more, see the authorization guidance for the following REST API operation:
    - [Get Blob](/rest/api/storageservices/get-blob#authorization)

## Download a blob

You can use the following method to download a blob:

- [BlobClient.download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-download-blob)

The `download_blob` method returns a [StorageStreamDownloader](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader) object. During a download, the client libraries split the download request into chunks, where each chunk is downloaded with a separate [Get Blob](/rest/api/storageservices/get-blob) range request. This behavior depends on the total size of the blob and how the [data transfer options](#specify-data-transfer-options-on-download) are set.
 
## Download to a file path

The following example downloads a blob to a file path:

:::code language="go" source="~/blob-devguide-go/cmd/download-blob/download_blob.go id="snippet_download_blob_file":::

## Download to a stream

The following example downloads a blob to a stream. In this example, [StorageStreamDownloader.read_into](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-readinto) downloads the blob contents to a stream and returns the number of bytes read:

:::code language="go" source="~/blob-devguide-go/cmd/download-blob/download_blob.go id="snippet_download_blob_stream":::

## Download a blob in chunks

The following example downloads a blob and iterates over chunks in the download stream. In this example, [StorageStreamDownloader.chunks](/python/api/azure-storage-blob/azure.storage.blob.storagestreamdownloader#azure-storage-blob-storagestreamdownloader-chunks) returns an iterator, which allows you to read the blob content in chunks:

:::code language="go" source="~/blob-devguide-go/cmd/download-blob/download_blob.go id="snippet_download_blob_chunks":::

## Download to a string

The following example downloads blob contents as text. In this example, the `encoding` parameter is necessary for `readall()` to return a string, otherwise it returns bytes:

:::code language="go" source="~/blob-devguide-go/cmd/download-blob/download_blob.go id="snippet_download_blob_text":::

## Download a block blob with configuration options

You can define client library configuration options when downloading a blob. These options can be tuned to improve performance and enhance reliability. The following code examples show how to define configuration options for a download both at the method level, and at the client level when instantiating [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). These options can also be configured for a [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) instance or a [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) instance.

### Specify data transfer options on download

You can set configuration options when instantiating a client to optimize performance for data transfer operations. You can pass the following keyword arguments when constructing a client object in Go:

- `max_chunk_get_size` - The maximum chunk size used for downloading a blob. Defaults to 4 MiB.
- `max_single_get_size` - The maximum size for a blob to be downloaded in a single call. If the total blob size exceeds `max_single_get_size`, the remainder of the blob data is downloaded in chunks. Defaults to 32 MiB.

For download operations, you can also pass the `max_concurrency` argument when calling [download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-download-blob). This argument defines the maximum number of parallel connections for the download operation.

The following code example shows how to specify data transfer options when creating a `BlobClient` object, and how to download data using that client object. The values provided in this sample aren't intended to be a recommendation. To properly tune these values, you need to consider the specific needs of your app.

:::code language="go" source="~/blob-devguide-go/cmd/download-blob/download_blob.go id="snippet_download_blob_transfer_options":::

## Resources

To learn more about how to download blobs using the Azure Blob Storage client module for Go, see the following resources.

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/cmd/download-blob/download_blob.go) from this article (GitHub)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]