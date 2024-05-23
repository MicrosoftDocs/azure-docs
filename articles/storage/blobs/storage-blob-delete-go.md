---
title: Delete and restore a blob with Go
titleSuffix: Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the Go client library.
services: storage
author: pauljewellmsft

ms.author: pauljewell
ms.date: 05/22/2024
ms.service: azure-blob-storage
ms.topic: how-to
ms.devlang: golang
ms.custom: devx-track-go, devguide-go
---

# Delete and restore a blob with Go

[!INCLUDE [storage-dev-guide-selector-delete-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-delete-blob.md)]

This article shows how to delete blobs using the [Azure Storage client module for Go](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#section-readme). If you've enabled [soft delete for blobs](soft-delete-blob-overview.md), you can restore deleted blobs during the retention period.

[!INCLUDE [storage-dev-guide-prereqs-go](../../../includes/storage-dev-guides/storage-dev-guide-prereqs-go.md)]

## Set up your environment

[!INCLUDE [storage-dev-guide-project-setup-go](../../../includes/storage-dev-guides/storage-dev-guide-project-setup-go.md)]

#### Authorization

The authorization mechanism must have the necessary permissions to delete a blob, or to restore a soft-deleted blob. For authorization with Microsoft Entra ID (recommended), you need Azure RBAC built-in role **Storage Blob Data Contributor** or higher. To learn more, see the authorization guidance for [Delete Blob](/rest/api/storageservices/delete-blob#authorization) and [Undelete Blob](/rest/api/storageservices/undelete-blob#authorization).

## Delete a blob

To delete a blob, call the following method:

- [DeleteBlob](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob#Client.DeleteBlob)

The following example deletes a blob:

:::code language="go" source="~/blob-devguide-go/cmd/delete_blob/delete_blob.go" id="snippet_delete_blob":::

If the blob has any associated snapshots, you must delete all of its snapshots to delete the blob. The following example deletes a blob and its snapshots:

:::code language="go" source="~/blob-devguide-go/cmd/delete_blob/delete_blob.go" id="snippet_delete_blob_snapshots":::

To delete *only* the snapshots and not the blob itself, you can pass the value `DeleteSnapshotsOptionTypeOnly` to the `DeleteSnapshots` parameter.

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period expires, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot.

How you restore a soft-deleted blob depends on whether or not your storage account has blob versioning enabled. For more information on blob versioning, see [Blob versioning](../../storage/blobs/versioning-overview.md). See one of the following sections, depending on your scenario:

- [Blob versioning is not enabled](#restore-soft-deleted-objects-when-versioning-is-disabled)
- [Blob versioning is enabled](#restore-soft-deleted-objects-when-versioning-is-enabled)

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs when versioning is disabled, call the following method:

- [UndeleteBlob](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.Undelete)

This method restores the content and metadata of a soft-deleted blob and any associated soft-deleted snapshots. Calling this method for a blob that hasn't been deleted has no effect.

:::code language="go" source="~/blob-devguide-go/cmd/delete_blob/delete_blob.go" id="snippet_restore_blob":::

#### Restore soft-deleted objects when versioning is enabled

If a storage account is configured to enable blob versioning, deleting a blob causes the current version of the blob to become the previous version. To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use the following method:

- [StartCopyFromURL](https://pkg.go.dev/github.com/Azure/azure-sdk-for-go/sdk/storage/azblob/blob#Client.StartCopyFromURL)

The following code example identifies a version of a deleted blob, and restores that version by copying it to the base blob:

:::code language="go" source="~/blob-devguide-go/cmd/delete_blob/delete_blob.go" id="snippet_restore_blob_version":::

[!INCLUDE [storage-dev-guide-code-samples-note-go](../../../includes/storage-dev-guides/storage-dev-guide-code-samples-note-go.md)]

## Resources

To learn more about how to delete blobs and restore deleted blobs using the Azure Blob Storage client module for Go, see the following resources.

### Code samples

- View [code samples](https://github.com/Azure-Samples/blob-storage-devguide-go/blob/main/cmd/delete_blob/delete_blob.go) from this article (GitHub)

### REST API operations

The Azure SDK for Go contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Go paradigms. The client library methods for deleting blobs and restoring deleted blobs use the following REST API operations:

- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)

[!INCLUDE [storage-dev-guide-resources-go](../../../includes/storage-dev-guides/storage-dev-guide-resources-go.md)]

### See also

- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Blob versioning](versioning-overview.md)