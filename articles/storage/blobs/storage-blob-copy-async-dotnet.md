---
title: Copy a blob with asynchronous scheduling using .NET
titleSuffix: Azure Storage
description: Learn how to copy a blob with asynchronous scheduling in Azure Storage by using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/11/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Copy a blob with asynchronous scheduling using .NET

This article shows how to copy a blob with asynchronous scheduling using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL. You can also abort a pending copy operation.

The client library methods covered in this article use the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and can be used when you want to perform a copy with asynchronous scheduling. For most copy scenarios where you want to move data into a storage account and have a URL for the source object, see [Copy a blob from a source object URL with .NET](storage-blob-copy-url-dotnet.md).

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform a copy operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Copy Blob](/rest/api/storageservices/copy-blob#authorization)
    - [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob#authorization)
- Packages installed to your project directory. These examples use **Azure.Storage.Blobs**. If you're using `DefaultAzureCredential` for authorization, you also need **Azure.Identity**. To learn more about setting up your project, see [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project). To see the necessary `using` directives, see [Code samples](#code-samples).

## About copying blobs with asynchronous scheduling

The `Copy Blob` operation can finish asynchronously and is performed on a best-effort basis, which means that the operation isn't guaranteed to start immediately or complete within a specified time frame. The copy operation is scheduled in the background and performed as the server has available resources.  The operation can complete synchronously if the copy occurs within the same storage account. 

A `Copy Blob` operation can perform any of the following actions:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or it can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, which replaces the destination blob. This type of copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs isn't supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

The source blob for a copy operation may be one of the following types: block blob, append blob, page blob, blob snapshot, or blob version. The copy operation always copies the entire source blob or file. Copying a range of bytes or set of blocks isn't supported.

If the destination blob already exists, it must be of the same blob type as the source blob, and the existing destination blob is overwritten. The destination blob can't be modified while a copy operation is in progress, and a destination blob can only have one outstanding copy operation.

To learn more about the `Copy Blob` operation, including information about properties, index tags, metadata, and billing, see [Copy Blob remarks](/rest/api/storageservices/copy-blob#remarks).

## Copy a blob with asynchronous scheduling

This section gives an overview of methods provided by the Azure Storage client library for .NET to perform a copy operation with asynchronous scheduling.

The following methods wrap the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and begin an asynchronous copy of data from the source blob:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The `StartCopyFromUri` and `StartCopyFromUriAsync` methods return a [CopyFromUriOperation](/dotnet/api/azure.storage.blobs.models.copyfromurioperation) object containing information about the copy operation. These methods are used when you want asynchronous scheduling for a copy operation.

## Copy a blob from a source within Azure

If you're copying a blob within the same storage account, the operation can complete synchronously. Access to the source blob can be authorized via Azure Active Directory (Azure AD), a shared access signature (SAS), or an account key. For an alterative synchronous copy operation, see [Copy a blob from a source object URL with .NET](storage-blob-copy-url-dotnet.md).

If the copy source is a blob in a different storage account, the operation can complete asynchronously. The source blob must either be public or authorized via SAS token. The SAS token needs to include the **Read ('r')** permission. To learn more about SAS tokens, see [Delegate access with shared access signatures](../common/storage-sas-overview.md).

The following example shows a scenario for copying a source blob from a different storage account with asynchronous scheduling. In this example, we create a source blob URL with an appended user delegation SAS token. The example shows how to generate the SAS token using the client library, but you can also provide your own. The example also shows how to lease the source blob during the copy operation to prevent changes to the blob from a different client. The `Copy Blob` operation saves the `ETag` value of the source blob when the copy operation starts. If the `ETag` value is changed before the copy operation finishes, the operation fails.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyAcrossAccounts_CopyBlob":::

> [!NOTE]
> User delegation SAS tokens offer greater security, as they're signed with Azure AD credentials instead of an account key. To create a user delegation SAS token, the Azure AD security principal needs appropriate permissions. For authorization requirements, see [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key#authorization).

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyFromExternalSource_CopyBlob":::

## Check the status of a copy operation

To check the status of a `Copy Blob` operation, you can call [UpdateStatusAsync](/dotnet/api/azure.storage.blobs.models.copyfromurioperation.updatestatusasync#azure-storage-blobs-models-copyfromurioperation-updatestatusasync(system-threading-cancellationtoken)) and parse the response to get the value for the `x-ms-copy-status` header. 

The following code example shows how to check the status of a copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CheckStatusCopyBlob":::

## Abort a copy operation

Aborting a pending `Copy Blob` operation results in a destination blob of zero length. However, the metadata for the destination blob has the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

To abort a pending copy operation, call one of the following operations:
- [AbortCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuri)
- [AbortCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuriasync)

These methods wrap the [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) REST API operation, which cancels a pending `Copy Blob` operation. The following code example shows how to abort a pending `Copy Blob` operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_AbortBlobCopy":::

## Resources

To learn more about copying blobs using the Azure Blob Storage client library for .NET, see the following resources.

### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods covered in this article use the following REST API operations:

- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]
