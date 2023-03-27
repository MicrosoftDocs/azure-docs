---
title: Copy a blob asynchronously with .NET
titleSuffix: Azure Storage
description: Learn how to copy a blob asynchronously in Azure Storage by using the .NET client library.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 03/24/2023
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: csharp
ms.custom: devx-track-csharp, devguide-csharp
---

# Copy a blob asynchronously with .NET

This article shows how to perform a [Copy Blob](/rest/api/storageservices/copy-blob#authorization) operation to copy a blob asynchronously using the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage), and how to abort a pending copy operation.

## Prerequisites

To work with the code examples in this article, make sure you have:

- An authorized client object to connect to Blob Storage data resources. To learn more, see [Create and manage client objects that interact with data resources](storage-blob-client-management.md).
- Permissions to perform a copy operation. To learn more, see the authorization guidance for the following REST API operations:
    - [Copy Blob](/rest/api/storageservices/copy-blob#authorization)
    - [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob#authorization)
- Packages installed to your project directory. These examples use **Azure.Storage.Blobs**. If you're using `DefaultAzureCredential` for authorization, you also need **Azure.Identity**. To learn more about setting up your project, see [Get Started with Azure Storage and .NET](storage-blob-dotnet-get-started.md#set-up-your-project). To see the necessary `using` directives, see [Code samples](#code-samples).

[!INCLUDE [storage-dev-guide-about-blob-copy](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-copy.md)]

## Copy a blob asynchronously

The following methods begin an asynchronous copy of data from the source blob:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The `StartCopyFromUri` and `StartCopyFromUriAsync` methods return a [CopyFromUriOperation](/dotnet/api/azure.storage.blobs.models.copyfromurioperation) object containing information about the copy operation. These methods wrap the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation.

#### Copy a blob within the same storage account

If you're copying a blob within the same storage account, access to the source blob can be authorized via Azure Active Directory (Azure AD), a shared access signature (SAS), or an account key. 

The following example shows a scenario for copying a blob from a different container within the same storage account. This example also shows how to lease the source blob during the copy operation to prevent changes.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyBlobWithinAccount":::

#### Copy a blob from another storage account

If the source is a blob in another storage account, access to the source blob must be authorized via SAS token. The SAS token needs to include the **Read ('r')** permission. To learn more about SAS tokens, see [Delegate access with shared access signatures](../common/storage-sas-overview.md).

The following example shows a scenario for copying a blob from another storage account. In this example, we create a source blob URI with an appended SAS token by calling [GenerateSasUri](/dotnet/api/azure.storage.blobs.blobcontainerclient.generatesasuri) on the blob client. To use this method, the source blob client needs to be authorized via account key. 

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyBlobAcrossAccounts":::

If you already have a SAS token, you can construct the URI for the source blob as follows:

```csharp
// Append the SAS token to the URI - include ? before the SAS token
var sourceBlobSASURI = new Uri(
    $"https://{srcAccountName}.blob.core.windows.net/{srcContainerName}/{srcBlobName}?{sasToken}");
```

#### Check the status of a copy operation

To check the status of an asynchronous copy operation, you can call [UpdateStatusAsync](/dotnet/api/azure.storage.blobs.models.copyfromurioperation.updatestatusasync#azure-storage-blobs-models-copyfromurioperation-updatestatusasync(system-threading-cancellationtoken)) and parse the response to get the value for the `x-ms-copy-status` header. 

The following code example shows how to check the status of a copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CheckStatusCopyBlob":::

## Copy a blob snapshot over the base blob

You can perform a copy operation to promote a snapshot over its base blob, as long as the base blob is in an online tier (hot or cool). The snapshot remains, but its destination is overwritten with a copy that can be read and written to.

The following code example shows how to copy a blob snapshot over the base blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopySnapshot":::

To learn more about blob snapshots, see [Blob snapshots](snapshots-overview.md).

## Copy a previous blob version over the base blob

You can perform a copy operation to promote a version over its base blob, as long as the base blob is in an online tier (hot or cool). The version remains, but its destination is overwritten with a copy that can be read and written to.

The following code example shows how to copy a blob version over the base blob:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_CopyVersion":::

To learn more about blob versioning, see [Blob versioning](versioning-overview.md).

## Rehydrate a blob using a copy operation

You can rehydrate a blob from the archive tier by copying it to an online tier. You can specify copy options, including access tier and rehydrate priority, in a [BlobCopyFromUriOptions] object.

The following example shows how to rehydrate an archived blob by copying it to a blob in the hot tier:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_RehydrateUsingCopy":::

> [!NOTE]
> Copying an archived blob to an online destination tier is supported within the same storage account. Beginning with service version 2021-02-12, you can copy an archived blob to a different storage account, as long as the destination account is in the same region as the source account. When you copy an archived blob to an online tier, the source and destination blobs must have different names. 

After the copy operation is complete, the destination blob appears in the archive tier. The destination blob is then rehydrated to the online tier that you specified in the copy operation. When the destination blob is fully rehydrated, it becomes available in the new online tier.

To learn more about rehydrating an archived blob, see [Rehydrate an archived blob to an online tier](archive-rehydrate-to-online-tier.md).

## Abort a copy operation

Aborting a copy operation results in a destination blob of zero length. However, the metadata for the destination blob has the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

To abort a pending copy operation, call one of the following operations:
- [AbortCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuri)
- [AbortCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuriasync)

The following code example shows how to abort a pending copy operation:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs" id="Snippet_AbortBlobCopy":::

## Resources

To learn more about copying blobs asynchronously using the Azure Blob Storage client library for .NET, see the following resources.

#### REST API operations

The Azure SDK for .NET contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar .NET paradigms. The client library methods covered in this article use the following REST API operations:

- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

#### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/dotnet/BlobDevGuideBlobs/CopyBlob.cs)

[!INCLUDE [storage-dev-guide-resources-dotnet](../../../includes/storage-dev-guides/storage-dev-guide-resources-dotnet.md)]
