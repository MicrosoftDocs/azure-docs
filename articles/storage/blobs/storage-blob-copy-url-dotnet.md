---
title: Copy a blob from a source object URL with .NET
titleSuffix: Azure Storage
description: Learn how to copy a blob from a source object URL in Azure Storage by using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 08/05/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Copy a blob from a source object URL with .NET

[!INCLUDE [storage-dev-guide-selector-copy-url](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy-url.md)]

This article shows how to copy a blob from a source object URL using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL.

The client library methods covered in this article use the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) and [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operations. These methods are preferred for copy scenarios where you want to move data into a storage account and have a URL for the source object. For copy operations where you want asynchronous scheduling, see [Copy a blob with asynchronous scheduling using .NET](storage-blob-copy-async-dotnet.md).

[!INCLUDE [storage-dev-guide-prereqs-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-dotnet.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-dotnet.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to perform a copy operation. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Put Blob From URL (REST API)](/rest/api/storageservices/put-blob-from-url#authorization) or [Put Block From URL (REST API)](/rest/api/storageservices/put-block-from-url#authorization).

[!INCLUDE [storage-dev-guide-blob-copy-from-url](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-copy-from-url.md)]

## Copy a blob from a source object URL

This section gives an overview of methods provided by the Azure Storage client library for .NET to perform a copy operation from a source object URL.

The following methods wrap the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) REST API operation, and create a new block blob where the contents of the blob are read from a given URL:

- [SyncUploadFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuri)
- [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync)

These methods are preferred for scenarios where you want to move data into a storage account and have a URL for the source object.

For large objects, you may choose to work with individual blocks. The following methods wrap the [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operation. These methods create a new block to be committed as part of a blob where the contents are read from a source URL:

- [StageBlockFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuri)
- [StageBlockFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuriasync)

## Copy a blob from a source within Azure

If you're copying a blob from a source within Azure, access to the source blob can be authorized via Microsoft Entra ID, a shared access signature (SAS), or an account key. 

The following example shows a scenario for copying from a source blob within Azure. The [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync) method can optionally accept a Boolean parameter to indicate whether an existing blob should be overwritten, as shown in the example. The `overwrite` parameter defaults to false.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyWithinAccount_PutBlobFromURL":::

The [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync) method can also accept a [BlobSyncUploadFromUriOptions](/dotnet/api/azure.storage.blobs.models.blobsyncuploadfromurioptions) parameter to specify further options for the operation.

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyFromExternalSource_PutBlobFromURL":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for .NET, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs)

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods covered in this article use the following REST API operations:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

[!INCLUDE [storage-dev-guide-next-steps-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-dotnet.md)]
