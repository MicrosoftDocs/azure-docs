---
title: Create and manage container leases with Python
titleSuffix: Azure Storage
description: Learn how to manage a lock on a container in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 01/24/2023
ms.subservice: blobs
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create and manage container leases with Python

This article shows how to create and manage container leases using the [Azure Storage client library for Python](/python/api/overview/azure/storage).

A lease establishes and manages a lock on a container for delete operations. The lock duration can be 15 to 60 seconds, or can be infinite. A lease on a container provides exclusive delete access to the container. A container lease only controls the ability to delete the container using the [Delete Container](/rest/api/storageservices/delete-container) REST API operation. To delete a container with an active lease, a client must include the active lease ID with the delete request. All other container operations will succeed on a leased container without the lease ID. If you've enabled [container soft delete](soft-delete-container-overview.md), you can restore deleted containers.

You can use the Python client library to acquire, renew, release and break leases. Lease operations are handled by the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, which provides a client containing all lease operations for [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) and [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient). To learn more about lease states and when you might perform an operation, see [Lease states and actions](#lease-states-and-actions).

## Acquire a lease

When you acquire a lease, you'll obtain a lease ID that your code can use to operate on the container. To acquire a lease, create an instance of the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, and then use the following method:

- [BlobLeaseClient.acquire](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-acquire)

You can also acquire a lease using the following method from the [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) class:

- [ContainerClient.acquire_lease](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-acquire-lease)

The following example acquires a 30-second lease on a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_acquire_container_lease":::

## Renew a lease

If your lease expires, you can renew it. To renew a lease, use the following method:

- [BlobLeaseClient.renew](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-renew)

The following example renews a lease for a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_renew_container_lease":::

## Release a lease

You can either wait for a lease to expire or explicitly release it. When you release a lease, other clients can obtain a lease. You can release a lease by using the following method:

- [BlobLeaseClient.release](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-release)
s
The following example releases the lease on a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_release_container_lease":::

## Break a lease

When you break a lease, the lease ends, but other clients can't acquire a lease until the lease period expires. You can break a lease by using the following method:

- [BlobLeaseClient.break_lease](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-break-lease)

The following example breaks the lease on a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_break_container_lease":::

[!INCLUDE [storage-dev-guide-container-lease](../../../includes/storage-dev-guides/storage-dev-guide-container-lease.md)]

## Resources

To learn more about leasing a container using the Azure Blob Storage client library for Python, see the following resources.

### REST API operations

The Azure SDK for Python contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Python paradigms. The client library methods for leasing a container use the following REST API operation:

- [Lease Container](/rest/api/storageservices/lease-container) (REST API)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py)

[!INCLUDE [storage-dev-guide-resources-python](../../../includes/storage-dev-guides/storage-dev-guide-resources-python.md)]

## See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)
