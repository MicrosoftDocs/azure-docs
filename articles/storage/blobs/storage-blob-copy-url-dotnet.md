---
title: Copy a blob from a source object URL with .NET
titleSuffix: Azure Storage
description: Learn how to copy a blob from a source object URL in Azure Storage by using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/11/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Copy a blob from a source object URL with .NET

This article shows how to copy a blob from a source object URL using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL.

The client library methods covered in this article use the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) and [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operations. These methods are preferred for copy scenarios where you want to move data into a storage account and have a URL for the source object. For copy operations where you want asynchronous scheduling, see [Copy a blob with asynchronous scheduling using .NET](storage-blob-copy-async-dotnet.md).

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform a copy operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob From URL](/rest/api/storageservices/put-blob-from-url#authorization)
    - [Put Block From URL](/rest/api/storageservices/put-block-from-url#authorization)
- Packages installed to your project directory. These examples use **Azure.Storage.Blobs**. If you're using `DefaultAzureCredential` for authorization, you also need **Azure.Identity**. To learn more about setting up your project, see [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project). To see the necessary `using` directives, see [Code samples](#code-samples).

## About copying blobs from a source object URL

The `Put Blob From URL` operation creates a new block blob where the contents of the blob are read from a given URL. The operation completes synchronously.

The source can be any object retrievable via a standard HTTP GET request on the given URL. This includes block blobs, append blobs, page blobs, blob snapshots, blob versions, or any accessible object inside or outside Azure.

When the source object is a block blob, all committed blob content is copied. The content of the destination blob is identical to the content of the source, but the committed block list isn't preserved and uncommitted blocks aren't copied.

The destination is always a block blob, either an existing block blob, or a new block blob created by the operation. The contents of an existing blob are overwritten with the contents of the new blob.

The `Put Blob From URL` operation always copies the entire source blob. Copying a range of bytes or set of blocks isn't supported. To perform partial updates to a block blob’s contents by using a source URL, use the [Put Block From URL](/rest/api/storageservices/put-block-from-url) API along with [Put Block List](/rest/api/storageservices/put-block-list).

To learn more about the `Put Blob From URL` operation, including blob size limitations and billing considerations, see [Put Blob From URL remarks](/rest/api/storageservices/put-blob-from-url#remarks).

## Copy a blob from a source object URL

This section gives an overview of methods provided by the Azure Storage client library for .NET to perform a copy operation from a source object URL.

The following methods wrap the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) REST API operation, and create a new block blob where the contents of the blob are read from a given URL:

- [SyncUploadFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuri)
- [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync)

These methods are preferred for scenarios where you want to move data into a storage account and have a URL for the source object.

For large objects, you may choose to work with individual blocks. The following methods wrap the [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operation. These methods create a new block to be committed as part of a blob where the contents are read from a source URL:

- [StageBlockFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuri)
- [StageBlockFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuriasync)

## Copy a blob within the same storage account

If you're copying a blob within the same storage account, access to the source blob can be authorized via Azure Active Directory (Azure AD), a shared access signature (SAS), or an account key. 

The following example shows a scenario for copying a source blob within the same storage account. The [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync) method can optionally accept a Boolean parameter to indicate whether an existing blob should be overwritten, as shown in the example. The `overwrite` parameter defaults to false.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyWithinAccount_PutBlobFromURL":::

The [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync) method can also accept a [BlobSyncUploadFromUriOptions](/dotnet/api/azure.storage.blobs.models.blobsyncuploadfromurioptions) parameter to specify further options for the operation.

## Copy a blob from another storage account

If the source is a blob in another storage account, the source blob must either be public, or authorized via Azure AD or SAS token. The SAS token needs to include the **Read ('r')** permission. To learn more about SAS tokens, see [Delegate access with shared access signatures](../common/storage-sas-overview.md).

The following example shows a scenario for copying a blob from another storage account. In this example, we create a source blob URI with an appended *service SAS token* by calling [GenerateSasUri](/dotnet/api/azure.storage.blobs.blobcontainerclient.generatesasuri) on the blob client. To use this method, the source blob client needs to be authorized via account key. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyAcrossAccounts_PutBlobFromURL":::

If you already have a SAS token, you can construct the URI for the source blob as follows:

```csharp
// Append the SAS token to the URI - include ? before the SAS token
var sourceBlobSASURI = new Uri(
    $"https://{srcAccountName}.blob.core.windows.net/{srcContainerName}/{srcBlobName}?{sasToken}");
```

You can also [create a user delegation SAS token with .NET](storage-blob-user-delegation-sas-create-dotnet.md). User delegation SAS tokens offer greater security, as they're signed with Azure AD credentials instead of an account key.

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyFromExternalSource_PutBlobFromURL":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods covered in this article use the following REST API operations:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]
