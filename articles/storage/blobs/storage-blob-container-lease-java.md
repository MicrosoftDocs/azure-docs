---
title: Create and manage container leases with Java - Azure Storage 
description: Learn how to manage a lock on a container in your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 11/15/2022
ms.subservice: blobs
ms.devlang: java
ms.custom: devx-track-java, devguide-java
---

# Create and manage container leases with Java

This article shows how to create and manage container leases using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

A lease establishes and manages a lock on a container for delete operations. The lock duration can be 15 to 60 seconds, or can be infinite. A lease on a container provides exclusive delete access to the container. A container lease only controls the ability to delete the container using the [Delete Container](/rest/api/storageservices/delete-container) operation. To delete a container with an active lease, a client must include the active lease ID with the delete request. All other container operations will succeed on a leased container without the lease ID. If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

You can use the Java client library to acquire, renew, release and break leases. Lease operations are handled by the [BlobLeaseClient](/java/api/com.azure.storage.blob.specialized.blobleaseclient) class, which provides a client containing all lease operations for [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) and [BlobClient](/java/api/com.azure.storage.blob.blobclient). To learn more about lease states and when you might perform an operation, see [Lease states and actions](#lease-states-and-actions).

## Acquire a lease

When you acquire a lease, you'll obtain a lease ID that your code can use to operate on the container. To acquire a lease, create an instance of the [BlobLeaseClient](/java/api/com.azure.storage.blob.specialized.blobleaseclient) class, and then use the following method:

- [acquireLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example acquires a 30-second lease for a container:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerLease.java" id="Snippet_AcquireLeaseContainer":::

## Renew a lease

If your lease expires, you can renew it. To renew an existing lease, use the following method:

- [renewLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example renews a lease for a container:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerLease.java" id="Snippet_RenewLeaseContainer":::

## Release a lease

You can either wait for a lease to expire or explicitly release it. When you release a lease, other clients can immediately acquire a lease for the container as soon as the operation is complete. You can release a lease by using the following method:

- [releaseLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example releases the lease on a container:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerLease.java" id="Snippet_ReleaseLeaseContainer":::

## Break a lease

When you break a lease, the lease ends, and other clients can't acquire a lease until the lease period expires. You can break a lease by using the following method:

- [breakLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example breaks the lease on a container:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerLease.java" id="Snippet_BreakLeaseContainer":::

## Lease states and actions

The following diagram shows the five states of a lease, and the commands or events that cause lease state changes.

:::image type="content" source="./media/blob-dev-guide/storage-dev-guide-container-lease.png" alt-text="A diagram showing container lease states and state change triggers." lightbox="./media/blob-dev-guide/storage-dev-guide-container-lease.png"::: 

The following table lists the five lease states, gives a brief description of each, and lists the lease actions allowed in a given state. These lease actions cause state transitions, as shown in the diagram.
  
| Lease state | Description | Lease actions allowed |  
| --- | --- | --- |
| **Available** | The lease is unlocked and can be acquired. | `acquire` |
| **Leased** | The lease is locked. | `acquire` (same lease ID only), `renew`, `change`, `release`, and `break` |
| **Expired** | The lease duration has expired. | `acquire`, `renew`, `release`, and `break` |
| **Breaking** | The lease has been broken, but the lease will continue to be locked until the break period has expired. | `release` and `break` |
| **Broken** | The lease has been broken, and the break period has expired. | `acquire`, `release`, and `break` |

When a lease expires, the lease ID is maintained by the Blob service until the container is modified or leased again. A client may attempt to renew or release the lease using the expired lease ID. If the request fails, the client knows that the container was leased again, or the container was deleted since the lease was last active.

If a lease expires rather than being explicitly released, a client may need to wait up to one minute before a new lease can be acquired for the container. However, the client can renew the lease with the expired lease ID immediately.

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerLease.java)
- [Lease Container](/rest/api/storageservices/lease-container)
- [Lease Blob](/rest/api/storageservices/lease-blob)
- [Managing Concurrency in Blob storage](concurrency-manage.md)
