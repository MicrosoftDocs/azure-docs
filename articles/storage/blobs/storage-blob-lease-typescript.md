---
title: Create and manage blob leases with TypeScript
titleSuffix: Azure Storage
description: Learn how to manage a lock on a blob in your Azure Storage account with TypeScript using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 05/01/2023
ms.devlang: typescript
ms.custom: devx-track-ts, devguide-ts, devx-track-js
---

# Create and manage blob leases with TypeScript

This article shows how to create and manage blob leases using the [Azure Storage client library for JavaScript](/javascript/api/overview/azure/storage-blob-readme). You can use the client library to acquire, renew, release, and break blob leases.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and TypeScript](storage-blob-typescript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with a blob lease. To learn more, see the authorization guidance for the following REST API operation:
    - [Lease Blob](/rest/api/storageservices/lease-blob#authorization)

## About blob leases

[!INCLUDE [storage-dev-guide-about-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-lease.md)]

Lease operations are handled by the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class, which provides a client containing all lease operations for blobs and containers. To learn more about container leases using the client library, see [Create and manage container leases with TypeScript](storage-blob-container-lease-typescript.md).

## Acquire a lease

When you acquire a blob lease, you obtain a lease ID that your code can use to operate on the blob. If the blob already has an active lease, you can only request a new lease by using the active lease ID. However, you can specify a new lease duration. 

To acquire a lease, create an instance of the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class, and then use one of the following methods:

- [acquireLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-acquirelease)

The following example acquires a 30-second lease for a blob:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_AcquireBlobLease":::

## Renew a lease

You can renew a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. The lease can be renewed even if it has expired, as long as the blob hasn't been modified or leased again since the expiration of that lease. When you renew a lease, the duration of the lease resets.

To renew a lease, use one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [renewLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-renewlease)

The following example renews a lease for a blob:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_RenewBlobLease":::

## Release a lease

You can release a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. Releasing a lease allows another client to acquire a lease for the blob immediately after the release is complete.

You can release a lease using one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [releaseLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-releaselease)

The following example releases a lease on a blob:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_ReleaseBlobLease":::

## Break a lease

You can break a blob lease if the blob has an active lease. Any authorized request can break the lease; the request isn't required to specify a matching lease ID. A lease can't be renewed after it's broken, and breaking a lease prevents a new lease from being acquired until the original lease expires or is released.

You can break a lease using one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [breakLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-breaklease)

The following example breaks a lease on a blob:

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_BreakBlobLease":::

[!INCLUDE [storage-dev-guide-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-blob-lease.md)]

## Resources

To learn more about managing blob leases using the Azure Blob Storage client library for JavaScript, see the following resources.

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for managing blob leases use the following REST API operation:

- [Lease Blob](/rest/api/storageservices/lease-blob)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts)

[!INCLUDE [storage-dev-guide-resources-typescript](../../../includes/storage-dev-guides/storage-dev-guide-resources-typescript.md)]

### See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)
