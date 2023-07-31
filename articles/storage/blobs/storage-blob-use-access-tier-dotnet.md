---
title: Set or change a blob's access tier with .NET
titleSuffix: Azure Storage 
description: Learn how to set or change a blob's access tier in your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 07/03/2023
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Set or change a block blob's access tier with .NET

This article shows how to set or change the access tier for a block blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). 

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform an operation to set the blob's access tier. To learn more, see the authorization guidance for the following REST API operation:
    - [Set Blob Tier](/rest/api/storageservices/set-blob-tier#authorization)
- The package **Azure.Storage.Blobs** installed to your project directory. To learn more about setting up your project, see [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project).

[!INCLUDE [storage-dev-guide-about-access-tiers](../../../includes/storage-dev-guides/storage-dev-guide-about-access-tiers.md)]

> [!NOTE]
> To set the access tier to `Cold` using .NET, you must use a minimum [client library](/dotnet/api/azure.storage.blobs) version of 12.15.0.

## Set a blob's access tier during upload

You can set a blob's access tier on upload by using the [BlobUploadOptions](/dotnet/api/azure.storage.blobs.models.blobuploadoptions) class. The following code example shows how to set the access tier when uploading a blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/UploadBlob.cs" id="Snippet_UploadWithAccessTier":::

To learn more about uploading a blob with .NET, see [Upload a blob with .NET](storage-blob-upload.md).

## Change the access tier for an existing block blob

You can change the access tier of an existing block blob by using one of the following functions:

- [SetAccessTier](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.setaccesstier)
- [SetAccessTierAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.setaccesstierasync)

The following code example shows how to change the access tier for an existing blob to `Cool`:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/AccessTiers.cs" id="Snippet_ChangeAccessTier":::

If you are rehydrating an archived blob, you can optionally set the `rehydratePriority` parameter to `High` or `Standard`.

## Copy a blob to a different access tier

You can change the access tier of an existing block blob by specifying an access tier as part of a copy operation. To change the access tier during a copy operation, use the [BlobCopyFromUriOptions](/dotnet/api/azure.storage.blobs.models.blobcopyfromurioptions) class and specify the [AccessTier](/dotnet/api/azure.storage.blobs.models.blobcopyfromurioptions.accesstier#azure-storage-blobs-models-blobcopyfromurioptions-accesstier) property. If you're rehydrating a blob from the archive tier using a copy operation, you can optionally set the [RehydratePriority](/dotnet/api/azure.storage.blobs.models.blobcopyfromurioptions.rehydratepriority#azure-storage-blobs-models-blobcopyfromurioptions-rehydratepriority) property to `High` or `Standard`.

The following code example shows how to rehydrate an archived blob to the `Hot` tier using a copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/AccessTiers.cs" id="Snippet_RehydrateUsingCopy":::

To learn more about copying a blob with .NET, see [Copy a blob with .NET](storage-blob-copy.md).

## Resources

To learn more about setting access tiers using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods for setting access tiers use the following REST API operation:

- [Set Blob Tier](/rest/api/storageservices/set-blob-tier) (REST API)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/AccessTiers.cs)

### See also

- [Access tiers best practices](access-tiers-best-practices.md)
- [Blob rehydration from the Archive tier](archive-rehydrate-overview.md)
