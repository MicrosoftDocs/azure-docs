---
title: Create and manage container leases with Java
titleSuffix: Azure Storage
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

[!INCLUDE [storage-dev-guide-container-lease](../../../includes/storage-dev-guides/storage-dev-guide-container-lease.md)]

## Resources

To learn more about leasing a container using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for leasing a container use the following REST API operation:

- [Lease Container](/rest/api/storageservices/lease-container) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-containers/src/main/java/com/blobs/devguide/containers/ContainerLease.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

## See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)
