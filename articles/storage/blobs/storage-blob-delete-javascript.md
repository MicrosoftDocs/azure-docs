---
title: Delete and restore a blob with JavaScript - Azure Storage
description: Learn how to delete and restore a blob in your Azure Storage account using the JavaScript client library
services: storage
author: normesta

ms.author: normesta
ms.date: 03/28/2022
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.devlang: javascript
ms.custom: "devx-track-js"
---

# Delete and restore a blob in your Azure Storage account using the JavaScript client library

This article shows how to delete blobs with the [Azure Storage client library for JavaScript](). If you've enabled blob soft delete, you can restore deleted blobs.

## Delete a blob

To delete a blob, call either of these methods:

- [Delete]()
- [DeleteIfExists]()

The following example deletes a blob.

```javascript

```

## Restore a deleted blob

Blob soft delete protects an individual blob and its versions, snapshots, and metadata from accidental deletes or overwrites by maintaining the deleted data in the system for a specified period of time. During the retention period, you can restore the blob to its state at deletion. After the retention period has expired, the blob is permanently deleted. For more information about blob soft delete, see [Soft delete for blobs](soft-delete-blob-overview.md).

You can use the Azure Storage client libraries to restore a soft-deleted blob or snapshot. 

#### Restore soft-deleted objects when versioning is disabled

To restore deleted blobs when versioning is not enabled, call the following method:

- [undelete]()

These methods restore soft-deleted blobs and any deleted snapshots associated with them. Calling either of these methods for a blob that has not been deleted has no effect. The following example restores  all soft-deleted blobs and their snapshots in a container:

```javascript

```

To restore a specific soft-deleted snapshot, first call the [undelete]() on the base blob, then copy the desired snapshot over the base blob. The following example restores a block blob to the most recently generated snapshot:

```javascript
```

#### Restore soft-deleted blobs when versioning is enabled

To restore a soft-deleted blob when versioning is enabled, copy a previous version over the base blob. You can use either of the following methods:

- [startCopyFromUri]()

```javascript
```

## See also

- [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md)
- [Delete Blob](/rest/api/storageservices/delete-blob) (REST API)
- [Soft delete for blobs](soft-delete-blob-overview.md)
- [Undelete Blob](/rest/api/storageservices/undelete-blob) (REST API)
