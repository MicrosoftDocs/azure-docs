---
title: Create and manage blob leases with Python
titleSuffix: Azure Storage
description: Learn how to manage a lock on a blob in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 01/25/2023
ms.subservice: blobs
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create and manage blob leases with Python

This article shows how to create and manage blob leases using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

A lease creates and manages a lock on a blob for write and delete operations. The lock duration can be 15 to 60 seconds, or can be infinite. A lease on a blob provides exclusive write and delete access to the blob. To write to a blob with an active lease, a client must include the active lease ID with the write request.

You can use the Python client library to acquire, renew, release and break leases. Lease operations are handled by the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, which provides a client containing all lease operations for [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) and [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). To learn more about lease states and when you might perform an operation, see [Lease states and actions](#lease-states-and-actions).

All container operations are permitted on a container that includes blobs with an active lease, including [Delete Container](/rest/api/storageservices/delete-container). Therefore, a container may be deleted even if blobs within it have active leases. Use the [Lease Container](/rest/api/storageservices/lease-container) operation to control rights to delete a container. To learn more about container leases using the client library, see [Create and manage container leases with Python](storage-blob-container-lease-python.md).

## Acquire a lease

When you acquire a lease, you'll obtain a lease ID that your code can use to operate on the blob. To acquire a lease, create an instance of the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, and then use the following method:

- [BlobLeaseClient.acquire](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-acquire)

You can also acquire a lease on a blob by creating an instance of [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient), and using the following method:

- [BlobClient.acquire_lease](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-acquire-lease)

The following example acquires a 30-second lease for a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_acquire_blob_lease":::

## Renew a lease

If your lease expires, you can renew it. To renew a lease, use the following method:

- [BlobLeaseClient.renew](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-renew)

The following example renews a lease for a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_renew_blob_lease":::

## Release a lease

You can either wait for a lease to expire or explicitly release it. When you release a lease, other clients can obtain a lease. You can release a lease by using the following method:

- [BlobLeaseClient.release](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-release)

The following example releases the lease on a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_release_blob_lease":::

## Break a lease

When you break a lease, the lease ends, but other clients can't acquire a lease until the lease period expires. You can break a lease by using the following method:

- [BlobLeaseClient.break_lease](/java/api/com.azure.storage.blob.specialized.blobleaseclient#com-azure-storage-blob-specialized-blobleaseclient-breaklease())

The following example breaks the lease on a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_break_blob_lease":::

## Lease states and actions

The following diagram shows the five states of a lease, and the commands or events that cause lease state changes.

:::image type="content" source="./media/blob-dev-guide/storage-dev-guide-blob-lease.png" alt-text="A diagram showing blob lease states and state change triggers." lightbox="./media/blob-dev-guide/storage-dev-guide-blob-lease.png"::: 

The following table lists the five lease states, gives a brief description of each, and lists the lease actions allowed in a given state. These lease actions cause state transitions, as shown in the diagram.
  
| Lease state | Description | Lease actions allowed |  
| --- | --- | --- |
| **Available** | The lease is unlocked and can be acquired. | `acquire` |
| **Leased** | The lease is locked. | `acquire` (same lease ID only), `renew`, `change`, `release`, and `break` |
| **Expired** | The lease duration has expired. | `acquire`, `renew`, `release`, and `break` |
| **Breaking** | The lease has been broken, but the lease will continue to be locked until the break period has expired. | `release` and `break` |
| **Broken** | The lease has been broken, and the break period has expired. | `acquire`, `release`, and `break` |

When a lease expires, the lease ID is maintained by the Blob service until the blob is modified or leased again. A client may attempt to renew or release the lease using the expired lease ID. If this operation is successful, the client knows that the blob hasn't been changed since the lease ID was last valid. If the request fails, the client knows that the blob was modified, or the blob was leased again since the lease was last active. The client must then acquire a new lease on the blob.

If a lease expires rather than being explicitly released, a client may need to wait up to one minute before a new lease can be acquired for the blob. However, the client can renew the lease with their lease ID immediately if the blob hasn't been modified.

A lease can't be granted for a blob snapshot, since snapshots are read-only. Requesting a lease against a snapshot results in status code `400 (Bad Request)`.

## Resources

To learn more about managing blob leases using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for managing blob leases use the following REST API operation:

- [Lease Blob](/rest/api/storageservices/lease-blob)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

### See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)