---
title: Copy a blob with asynchronous scheduling using .NET
titleSuffix: Azure Storage
description: Learn how to copy a blob with asynchronous scheduling in Azure Storage by using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 04/11/2023
ms.service: azure-storage
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp, devx-track-dotnet
---

# Copy a blob with asynchronous scheduling using .NET

This article shows how to copy a blob with asynchronous scheduling using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL. You can also abort a pending copy operation.

The client library methods covered in this article use the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and can be used when you want to perform a copy with asynchronous scheduling. For most copy scenarios where you want to move data into a storage account and have a URL for the source object, see [Copy a blob from a source object URL with .NET](storage-blob-copy-url-dotnet.md).

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for .NET. To learn about setting up your project, including package installation, adding `using` directives, and creating an authorized client object, see [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to perform a copy operation, or to abort a pending copy. To learn more, see the authorization guidance for the following REST API operation:
    - [Copy Blob](/rest/api/storageservices/copy-blob#authorization)
    - [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob#authorization)

[!INCLUDE [storage-dev-guide-blob-copy-async](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-copy-async.md)]

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
