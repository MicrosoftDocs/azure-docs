---
title: Download a blob with Go
titleSuffix: Azure Storage
description: Learn how to download a blob in Azure Storage by using the Go client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/22/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Download a blob with Go

[!INCLUDE [storage-dev-guide-selector-download](../../../includes/storage-dev-guides/storage-dev-guide-selector-download.md)]

This article shows how to download a blob using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). You can download blob data to various destinations, including a local file path, stream, or text string.

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to perform a download operation. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Reader** or higher. To learn more, see the authorization guidance for [Get Blob](/rest/api/storageservices/get-blob#authorization).

## Download a blob

You can use any of the following methods to download a blob:

- [DownloadBuffer](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadBuffer)
- [DownloadFile](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadFile)
- [DownloadStream](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DownloadStream)
 
## Download to a file path

The following example downloads a blob to a file path:

:::code language="go" source="~/blob-devguide-go/cmd/download-blob/download_blob.go" id="snippet_download_blob_file":::

## Download to a stream

The following example downloads a blob to a stream, and reads from the stream by calling the [NewRetryReader](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#DownloadStreamResponse.NewRetryReader) method.

:::code language="go" source="~/blob-devguide-go/cmd/download-blob/download_blob.go" id="snippet_download_blob_stream":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about how to download blobs using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/download-blob/download_blob.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for downloading blobs use the following REST API operation:

- [Get Blob](/rest/api/storageservices/get-blob) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]