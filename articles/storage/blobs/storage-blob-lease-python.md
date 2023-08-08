---
title: Create and manage blob leases with Python
titleSuffix: Azure Storage
description: Learn how to manage a lock on a blob in your Azure Storage account using the Python client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 08/02/2023
ms.devlang: python
ms.custom: devx-track-python, devguide-python
---

# Create and manage blob leases with Python

This article shows how to create and manage blob leases using the [Azure Storage client library for Python](/python/api/overview/azure/storage). You can use the client library to acquire, renew, release, and break blob leases.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Python. To learn about setting up your project, including package installation, adding `import` statements, and creating an authorized client object, see [Get started with Azure Blob Storage and Python](storage-blob-python-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with a blob lease. To learn more, see the authorization guidance for the following REST API operation:
    - [Lease Blob](/rest/api/storageservices/lease-blob#authorization)

## About blob leases

[!INCLUDE [storage-dev-guide-about-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-lease.md)]

Lease operations are handled by the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, which provides a client containing all lease operations for blobs and containers. To learn more about container leases using the client library, see [Create and manage container leases with Python](storage-blob-container-lease-python.md).

## Acquire a lease

When you acquire a blob lease, you obtain a lease ID that your code can use to operate on the blob. If the blob already has an active lease, you can only request a new lease by using the active lease ID. However, you can specify a new lease duration.

To acquire a lease, create an instance of the [BlobLeaseClient](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient) class, and then use the following method:

- [BlobLeaseClient.acquire](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-acquire)

You can also acquire a lease on a blob by creating an instance of [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient), and using the following method:

- [BlobClient.acquire_lease](/python/api/azure-storage-blob/azure.storage.blob.blobclient#azure-storage-blob-blobclient-acquire-lease)

The following example acquires a 30-second lease for a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_acquire_blob_lease":::

## Renew a lease

You can renew a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. The lease can be renewed even if it has expired, as long as the blob hasn't been modified or leased again since the expiration of that lease. When you renew a lease, the duration of the lease resets.

To renew a lease, use the following method:

- [BlobLeaseClient.renew](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-renew)

The following example renews a lease for a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_renew_blob_lease":::

## Release a lease

You can release a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. Releasing a lease allows another client to acquire a lease for the blob immediately after the release is complete.

You can release a lease by using the following method:

- [BlobLeaseClient.release](/python/api/azure-storage-blob/azure.storage.blob.blobleaseclient#azure-storage-blob-blobleaseclient-release)

The following example releases the lease on a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_release_blob_lease":::

## Break a lease

You can break a blob lease if the blob has an active lease. Any authorized request can break the lease; the request isn't required to specify a matching lease ID. A lease can't be renewed after it's broken, and breaking a lease prevents a new lease from being acquired for a period of time until the original lease expires or is released.

You can break a lease by using the following method:

- [BlobLeaseClient.break_lease](/java/api/com.azure.storage.blob.specialized.blobleaseclient#com-azure-storage-blob-specialized-blobleaseclient-breaklease())

The following example breaks the lease on a blob:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/blob-devguide-py/blob-devguide-blobs.py" id="Snippet_break_blob_lease":::

[!INCLUDE [storage-dev-guide-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-blob-lease.md)]

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