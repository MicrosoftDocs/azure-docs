---
title: Create and manage container leases with JavaScript
titleSuffix: Azure Storage 
description: Learn how to manage a lock on a container in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 05/01/2023
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js
---

# Create and manage container leases with JavaScript

This article shows how to create and manage container leases using the [Azure Storage client library for JavaScript](/javascript/api/overview/azure/storage-blob-readme). You can use the client library to acquire, renew, release, and break container leases.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with a container lease. To learn more, see the authorization guidance for the following REST API operation:
    - [Lease Container](/rest/api/storageservices/lease-container#authorization)

## About container leases

[!INCLUDE [storage-dev-guide-about-container-lease](../../../includes/storage-dev-guides/storage-dev-guide-about-container-lease.md)]

Lease operations are handled by the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class, which provides a client containing all lease operations for blobs and containers. To learn more about blob leases using the client library, see [Create and manage blob leases with JavaScript](storage-blob-lease-javascript.md).

## Acquire a lease

When you acquire a container lease, you obtain a lease ID that your code can use to operate on the container. If the container already has an active lease, you can only request a new lease by using the active lease ID. However, you can specify a new lease duration.

To acquire a lease, create an instance of the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class, and then use one of the following methods:

- [acquireLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-acquirelease)

The following example acquires a 30-second lease for a container:

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-container.js" id="Snippet_AcquireContainerLease":::

## Renew a lease

You can renew a container lease if the lease ID specified on the request matches the lease ID associated with the container. The lease can be renewed even if it has expired, as long as the container hasn't been leased again since the expiration of that lease. When you renew a lease, the duration of the lease resets.

To renew a lease, use one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [renewLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-renewlease)

The following example renews a container lease:

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-container.js" id="Snippet_RenewContainerLease":::

## Release a lease

You can release a container lease if the lease ID specified on the request matches the lease ID associated with the container. Releasing a lease allows another client to acquire a lease for the container immediately after the release is complete.

You can release a lease using one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [releaseLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-releaselease)

The following example releases a lease on a container:

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-container.js" id="Snippet_ReleaseContainerLease":::

## Break a lease

You can break a container lease if the container has an active lease. Any authorized request can break the lease; the request isn't required to specify a matching lease ID. A lease can't be renewed after it's broken, and breaking a lease prevents a new lease from being acquired until the original lease expires or is released.

You can break a lease using one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [breakLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-breaklease)

The following example breaks a lease on a container:

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-container.js" id="Snippet_BreakContainerLease":::

[!INCLUDE [storage-dev-guide-container-lease](../../../includes/storage-dev-guides/storage-dev-guide-container-lease.md)]

## Resources

To learn more about managing container leases using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for managing container leases use the following REST API operation:

- [Lease Container](/rest/api/storageservices/lease-container)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-container.js)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)