---
title: Copy a blob with asynchronous scheduling using Go
titleSuffix: Azure Storage
description: Learn how to copy a blob with asynchronous scheduling in Azure Storage by using the Go client module.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 07/25/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Copy a blob with asynchronous scheduling using Go

[!INCLUDE [storage-dev-guide-selector-copy-async](../../../includes/storage-dev-guides/storage-dev-guide-selector-copy-async.md)]

This article shows how to copy a blob with asynchronous scheduling using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). You can copy a blob from a source within the same storage account, from a source in a different storage account, or from any accessible object retrieved via HTTP GET request on a given URL. You can also abort a pending copy operation.

The methods covered in this article use the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and can be used when you want to perform a copy with asynchronous scheduling. For most copy scenarios where you want to move data into a storage account and have a URL for the source object, see [Copy a blob from a source object URL with Go](storage-blob-copy-url-go.md).

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to perform a copy operation, or to abort a pending copy. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Copy Blob](/rest/api/storageservices/copy-blob#authorization) or [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob#authorization).

## About copying blobs with asynchronous scheduling

The `Copy Blob` operation can finish asynchronously and is performed on a best-effort basis, which means that the operation isn't guaranteed to start immediately or complete within a specified time frame. The copy operation is scheduled in the background and performed as the server has available resources. The operation can complete synchronously if the copy occurs within the same storage account. 

A `Copy Blob` operation can perform any of the following actions:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or it can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, which replaces the destination blob. This type of copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs isn't supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

The source blob for a copy operation can be one of the following types: block blob, append blob, page blob, blob snapshot, or blob version. The copy operation always copies the entire source blob or file. Copying a range of bytes or set of blocks isn't supported.

If the destination blob already exists, it must be of the same blob type as the source blob, and the existing destination blob is overwritten. The destination blob can't be modified while a copy operation is in progress, and a destination blob can only have one outstanding copy operation.

To learn more about the `Copy Blob` operation, including information about properties, index tags, metadata, and billing, see [Copy Blob remarks](/rest/api/storageservices/copy-blob#remarks).

## Copy a blob with asynchronous scheduling

This section gives an overview of methods provided by the Azure Storage client module for Go to perform a copy operation with asynchronous scheduling.

The following methods wrap the [Copy Blob](/rest/api/storageservices/copy-blob) REST API operation, and begin an asynchronous copy of data from the source blob:

- [StartCopyFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.StartCopyFromURL)

## Copy a blob from a source within Azure

If you're copying a blob within the same storage account, the operation can complete synchronously. Access to the source blob can be authorized via Microsoft Entra ID (recommended), a shared access signature (SAS), or an account key. For an alterative synchronous copy operation, see [Copy a blob from a source object URL with Go](storage-blob-copy-url-go.md).

If the copy source is a blob in a different storage account, the operation can complete asynchronously. The source blob must either be public or authorized via SAS token. The SAS token needs to include the **Read ('r')** permission. To learn more about SAS tokens, see [Delegate access with shared access signatures](../common/storage-sas-overview.md).

The following example shows a scenario for copying a source blob from a different storage account with asynchronous scheduling. In this example, we create a source blob URL with an appended user delegation SAS token. The example assumes you provide your own SAS. The example also shows how to lease the source blob during the copy operation to prevent changes to the blob from a different client. The `Copy Blob` operation saves the `ETag` value of the source blob when the copy operation starts. If the `ETag` value is changed before the copy operation finishes, the operation fails. We also set the access tier for the destination blob to `Cool` using the [StartCopyFromURLOptions](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#StartCopyFromURLOptions) struct.

:::code language="go" source="~/blob-devguide-go/cmd/copy-blob-async/copy_blob_async.go" id="snippet_copy_from_source_async":::

The following example shows sample usage:

:::code language="go" source="~/blob-devguide-go/cmd/copy-blob-async/copy_blob_async.go" id="snippet_copy_from_source_async_usage":::

> [!NOTE]
> User delegation SAS tokens offer greater security, as they're signed with Microsoft Entra credentials instead of an account key. To create a user delegation SAS token, the Microsoft Entra security principal needs appropriate permissions. For authorization requirements, see [Get User Delegation Key](/rest/api/storageservices/get-user-delegation-key#authorization).

## Copy a blob from a source outside of Azure

You can perform a copy operation on any source object that can be retrieved via HTTP GET request on a given URL, including accessible objects outside of Azure. The following example shows a scenario for copying a blob from an accessible source object URL:

:::code language="go" source="~/blob-devguide-go/cmd/copy-blob-async/copy_blob_async.go" id="snippet_copy_from_external_source_async":::

The following example shows sample usage:

:::code language="go" source="~/blob-devguide-go/cmd/copy-blob-async/copy_blob_async.go" id="snippet_copy_from_external_source_async_usage":::

## Check the status of a copy operation

To check the status of an asynchronous `Copy Blob` operation, you can poll the [GetProperties](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.GetProperties) method and check the copy status.

The following code example shows how to check the status of a copy operation:

:::code language="go" source="~/blob-devguide-go/cmd/copy-blob-async/copy_blob_async.go" id="snippet_check_copy_status":::

## Abort a copy operation

Aborting a pending `Copy Blob` operation results in a destination blob of zero length. However, the metadata for the destination blob has the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

To abort a pending copy operation, call the following operation:

- [AbortCopyFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blockblob#Client.AbortCopyFromURL)

This method wraps the [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) REST API operation, which cancels a pending `Copy Blob` operation. The following code example shows how to abort a pending `Copy Blob` operation:

:::code language="go" source="~/blob-devguide-go/cmd/copy-blob-async/copy_blob_async.go" id="snippet_abort_copy":::

## Resources

To learn more about copying blobs with asynchronous scheduling using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/copy-blob-async/copy_blob_async.go)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The methods covered in this article use the following REST API operations:

- [Copy Blob](/rest/api/storageservices/copy-blob) (REST API)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]
