---
title: Copy a blob with .NET
titleSuffix: Azure Storage
description: Learn how to copy blobs in Azure Storage using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/14/2023
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Copy a blob with .NET

[!INCLUDE [storage-dev-guide-selector-copy](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy.md)]

This article provides an overview of copy operations using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

## About copy operations

Copy operations can be used to move data within a storage account, between storage accounts, or into a storage account from a source outside of Azure. When using the Blob Storage client libraries to copy data resources, it's important to understand the REST API operations behind the client library methods. The following table lists REST API operations that can be used to copy data resources to a storage account. The table also includes links to detailed guidance about how to perform these operations using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage).

| REST API operation | When to use | Client library methods | Guidance |
| --- | --- | --- | --- |
| [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) | This operation is preferred for scenarios where you want to move data into a storage account and have a URL for the source object. This operation completes synchronously. | [SyncUploadFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuri)<br>[SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync) | [Copy a blob from a source object URL with .NET](storage-blob-copy-url-dotnet.md) |
| [Put Block From URL](/rest/api/storageservices/put-block-from-url) | For large objects, you can use [Put Block From URL](/rest/api/storageservices/put-block-from-url) to write individual blocks to Blob Storage, and then call [Put Block List](/rest/api/storageservices/put-block-list) to commit those blocks to a block blob. This operation completes synchronously. | [StageBlockFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuri)<br>[StageBlockFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuriasync) | [Copy a blob from a source object URL with .NET](storage-blob-copy-url-dotnet.md) |
| [Copy Blob](/rest/api/storageservices/copy-blob) | This operation can be used when you want asynchronous scheduling for a copy operation. | [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)<br>[StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync) | [Copy a blob with asynchronous scheduling using .NET](storage-blob-copy-async-dotnet.md) |

For append blobs, you can use the [Append Block From URL](/rest/api/storageservices/append-block-from-url) operation to commit a new block of data to the end of an existing append blob. The following client library methods wrap this operation:

- [AppendBlockFromUri](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.appendblockfromuri)
- [AppendBlockFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.appendblobclient.appendblockfromuriasync)

For page blobs, you can use the [Put Page From URL](/rest/api/storageservices/put-page-from-url) operation to write a range of pages to a page blob where the contents are read from a URL. The following client library methods wrap this operation:

- [UploadPagesFromUri](/dotnet/api/azure.storage.blobs.specialized.pageblobclient.uploadpagesfromuri)
- [UploadPagesFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.pageblobclient.uploadpagesfromuriasync)

## Client library resources

- [Client library reference documentation](/dotnet/api/azure.storage.blobs)
- [Client library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Blobs)
- [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Blobs)
