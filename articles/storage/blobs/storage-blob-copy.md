---
title: Copy a blob with .NET
titleSuffix: Azure Storage
description: Learn how to copy a blob in Azure Storage by using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 03/24/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Copy a blob with .NET

This article shows how to copy a blob using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage), and focuses on copy scenarios using the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) and [Copy Blob](/rest/api/storageservices/copy-blob) REST API operations. You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform a copy operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Put Blob From URL](/rest/api/storageservices/put-blob-from-url#authorization)
    - [Copy Blob](/rest/api/storageservices/copy-blob#authorization)
    - [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob#authorization)
- Packages installed to your project directory. These examples use **Azure.Storage.Blobs**. If you're using `DefaultAzureCredential` for authorization, you also need **Azure.Identity**. To learn more about setting up your project, see [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project). To see the necessary `using` directives, see [Code samples](#code-samples).

[!INCLUDE [storage-dev-guide-about-blob-copy](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-copy.md)]

## Copy a blob

This section gives an overview of methods provided by the Azure Storage client library for .NET to perform a copy operation.

## [Put Blob From URL API](#tab/put-blob-from-url)

The following methods wrap the [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) REST API operation, and create a new block blob where the contents of the blob are read from a given URL:

- [SyncUploadFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuri)
- [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync)

These methods are preferred for scenarios where you want to move data into a storage account and have a URL for the source object.

For larger objects, you may choose to work with individual blocks. The following methods wrap the [Put Block From URL](/rest/api/storageservices/put-block-from-url) REST API operation. These methods create a new block to be committed as part of a blob where the contents are read from a source URL:

- [StageBlockFromUri](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuri)
- [StageBlockFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.stageblockfromuriasync)

## [Copy Blob API](#tab/copy-blob)

The following methods wrap the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and begin an asynchronous copy of data from the source blob:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The `StartCopyFromUri` and `StartCopyFromUriAsync` methods return a [CopyFromUriOperation](/dotnet/api/azure.storage.blobs.models.copyfromurioperation) object containing information about the copy operation. These methods are used when asynchronous scheduling is needed for a copy operation.

---

## Copy a blob within the same storage account

If you're copying a blob within the same storage account, access to the source blob can be authorized via Azure Active Directory (Azure AD), a shared access signature (SAS), or an account key. 

## [Put Blob From URL API](#tab/put-blob-from-url)

The following example shows a scenario for copying a source blob within the same storage account. The [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync) method can optionally accept a Boolean parameter to indicate whether an existing blob should be overwritten, as shown in the example.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyWithinAccount_PutBlobFromURL":::

The [SyncUploadFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blockblobclient.syncuploadfromuriasync) method can also accept a [BlobSyncUploadFromUriOptions](/dotnet/api/azure.storage.blobs.models.blobsyncuploadfromurioptions) parameter to specify further options for the operation.

## [Copy Blob API](#tab/copy-blob)

The following example shows a scenario for copying a source blob within the same storage account. This example also shows how to lease the source blob during the copy operation to prevent changes.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyWithinAccount_CopyBlob":::

---

## Copy a blob from another storage account

## [Put Blob From URL API](#tab/put-blob-from-url)

If the source is a blob in another storage account, the source blob must either be public, or authorized via Azure AD or SAS token. The SAS token needs to include the **Read ('r')** permission. To learn more about SAS tokens, see [Delegate access with shared access signatures](../common/storage-sas-overview.md).

The following example shows a scenario for copying a blob from another storage account. In this example, we create a source blob URI with an appended SAS token by calling [GenerateSasUri](/dotnet/api/azure.storage.blobs.blobcontainerclient.generatesasuri) on the blob client. To use this method, the source blob client needs to be authorized via account key. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyAcrossAccounts_PutBlobFromURL":::

If you already have a SAS token, you can construct the URI for the source blob as follows:

```csharp
// Append the SAS token to the URI - include ? before the SAS token
var sourceBlobSASURI = new Uri(
    $"https://{srcAccountName}.blob.core.windows.net/{srcContainerName}/{srcBlobName}?{sasToken}");
```

## [Copy Blob API](#tab/copy-blob)

If the source is a blob in another storage account, the source blob must either be public or authorized via SAS token. The SAS token needs to include the **Read ('r')** permission. To learn more about SAS tokens, see [Delegate access with shared access signatures](../common/storage-sas-overview.md).

The following example shows a scenario for copying a blob from another storage account. In this example, we create a source blob URI with an appended SAS token by calling [GenerateSasUri](/dotnet/api/azure.storage.blobs.blobcontainerclient.generatesasuri) on the blob client. To use this method, the source blob client needs to be authorized via account key. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyAcrossAccounts_CopyBlob":::

If you already have a SAS token, you can construct the URI for the source blob as follows:

```csharp
// Append the SAS token to the URI - include ? before the SAS token
var sourceBlobSASURI = new Uri(
    $"https://{srcAccountName}.blob.core.windows.net/{srcContainerName}/{srcBlobName}?{sasToken}");
```

---

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

## [Put Blob From URL API](#tab/put-blob-from-url)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs" id="Snippet_CopyFromExternalSource_PutBlobFromURL":::

## [Copy Blob API](#tab/copy-blob)

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyFromExternalSource_CopyBlob":::

---

## Check the status of a copy operation

This section only applies to copy operations using the `Copy Blob` API. 

To check the status of a `Copy Blob` operation, you can call [UpdateStatusAsync](/dotnet/api/azure.storage.blobs.models.copyfromurioperation.updatestatusasync#azure-storage-blobs-models-copyfromurioperation-updatestatusasync(system-threading-cancellationtoken)) and parse the response to get the value for the `x-ms-copy-status` header. 

The following code example shows how to check the status of a copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CheckStatusCopyBlob":::

## Abort a copy operation

This section only applies to copy operations using the `Copy Blob` API. 

Aborting a pending `Copy Blob` operation results in a destination blob of zero length. However, the metadata for the destination blob has the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

To abort a pending copy operation, call one of the following operations:
- [AbortCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuri)
- [AbortCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuriasync)

These methods wrap the [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) REST API operation, which cancels a pending `Copy Blob` operation. The following code example shows how to abort a pending `Copy Blob` operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_AbortBlobCopy":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for .NET, see the following resources.

#### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods covered in this article use the following REST API operations:

- [Put Blob From URL](/rest/api/storageservices/put-blob-from-url) (REST API)
- [Put Block From URL](/rest/api/storageservices/put-block-from-url) (REST API)
- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

#### Code samples

- [View code samples from this article using Put Blob From URL operation (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/PutBlobFromURL.cs)
- [View code samples from this article using Copy Blob operation (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]
