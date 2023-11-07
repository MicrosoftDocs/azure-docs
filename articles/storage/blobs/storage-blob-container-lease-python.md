---
title: Create and manage container leases with Python
titleSuffix: Azure Storage
description: Learn how to manage a lock on a container in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 08/02/2023
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create and manage container leases with Python

[!INCLUDE [storage-dev-guide-selector-lease-container](../../../includes/storage-dev-guides/storage-dev-guide-selector-lease-container.md)]

This article shows how to create and manage container leases using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can use the client library to acquire, renew, release and break container leases.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with a container lease. To learn more, see the authorization guidance for the following REST API operation:
    - [Lease Container](/rest/api/storageservices/lease-container#authorization)

## About container leases

[!INCLUDE [storage-dev-guide-about-container-lease](../../../includes/storage-dev-guides/storage-dev-guide-about-container-lease.md)]

Lease operations are handled by the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, which provides a client containing all lease operations for blobs and containers. To learn more about blob leases using the client library, see [Create and manage blob leases with Python](storage-blob-lease-python.md).

## Acquire a lease

When you acquire a container lease, you obtain a lease ID that your code can use to operate on the container. If the container already has an active lease, you can only request a new lease by using the active lease ID. However, you can specify a new lease duration.

To acquire a lease, create an instance of the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, and then use the following method:

- [BlobLeaseClient.acquire](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-acquire)

You can also acquire a lease using the following method from the [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient) class:

- [ContainerClient.acquire_lease](/python/api/azure-storage-blob/azure.storage.blob.containerclient#azure-storage-blob-containerclient-acquire-lease)

The following example acquires a 30-second lease on a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_acquire_container_lease":::

## Renew a lease

You can renew a container lease if the lease ID specified on the request matches the lease ID associated with the container. The lease can be renewed even if it has expired, as long as the container hasn't been leased again since the expiration of that lease. When you renew a lease, the duration of the lease resets.

To renew a lease, use the following method:

- [BlobLeaseClient.renew](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-renew)

The following example renews a lease for a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_renew_container_lease":::

## Release a lease

You can release a container lease if the lease ID specified on the request matches the lease ID associated with the container. Releasing a lease allows another client to acquire a lease for the container immediately after the release is complete.

You can release a lease by using the following method:

- [BlobLeaseClient.release](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-release)

The following example releases the lease on a container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-containers.py" id="Snippet_release_container_lease":::

## Break a lease

You can break a container lease if the container has an active lease. Any authorized request can break the lease; the request isn't required to specify a matching lease ID. A lease can't be renewed after it's broken, and breaking a lease prevents a new lease from being acquired for a period of time until the original lease expires or is released.

You can break a lease by using the following method:

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
