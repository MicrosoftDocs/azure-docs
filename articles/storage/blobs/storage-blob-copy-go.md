---
title: Copy a blob with Go
titleSuffix: Azure Storage
description: Learn how to copy a blob in Azure Storage by using the Go client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/05/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Copy a blob with Go

[!INCLUDE [storage-dev-guide-selector-copy](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy.md)]

This article provides an overview of copy operations using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

## About copy operations

Copy operations can be used to move data within a storage account, between storage accounts, or into a storage account from a source outside of Azure. When using the Blob Storage client libraries to copy data resources, it's important to understand the REST API operations behind the client library methods. The following table lists REST API operations that can be used to copy data resources to a storage account. The table also includes links to detailed guidance about how to perform these operations using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme).

| REST API operation | When to use | Client library methods | Guidance |
| --- | --- | --- | --- |
| [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) | This operation is preferred for scenarios where you want to move data into a storage account and have a URL for the source object. This operation completes synchronously. | [UploadBlobFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#Client.UploadBlobFromURL) | [Copy a blob from a source object URL with Go](storage-blob-copy-url-go.md) |
| [Put Block From URL](/rest/api/storageservices/put-block-from-url) | For large objects, you can use [Put Block From URL](/rest/api/storageservices/put-block-from-url) to write individual blocks to Blob Storage, and then call [Put Block List](/rest/api/storageservices/put-block-list) to commit those blocks to a block blob. This operation completes synchronously. | [StageBlockFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#Client.StageBlockFromURL) | [Copy a blob from a source object URL with Go](storage-blob-copy-url-go.md) |
| [Copy Blob](/rest/api/storageservices/copy-blob) | This operation can be used when you want asynchronous scheduling for a copy operation. | [StartCopyFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.StartCopyFromURL) | [Copy a blob with asynchronous scheduling using Go](storage-blob-copy-async-go.md) |

For append blobs, you can use the [Append Block From URL](/rest/api/storageservices/append-block-from-url) operation to commit a new block of data to the end of an existing append blob. The following client library method wraps this operation:

- [AppendBlockFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/appendblob#Client.AppendBlockFromURL)

For page blobs, you can use the [Put Page From URL](/rest/api/storageservices/put-page-from-url) operation to write a range of pages to a page blob where the contents are read from a URL. The following client library method wraps this operation:

- [UploadPagesFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/pageblob#Client.UploadPagesFromURL)

## Client library resources

- [Client module reference documentation](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme)
- [Client module source code](https://github.com/Azure/azure-sdk-for-go/tree/main/sdk/storage/azblob)
- [Package (pkg.go.dev)](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob)
