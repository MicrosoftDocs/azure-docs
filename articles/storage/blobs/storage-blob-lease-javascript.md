---
title: Create and manage blob leases with JavaScript or TypeScript
titleSuffix: Azure Storage
description: Learn how to manage a lock on a blob in your Azure Storage account using the JavaScript client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 10/28/2024
ms.devlang: javascript
ms.custom: devx-track-js, devguide-js, devx-track-ts, devguide-ts
---

# Create and manage blob leases with JavaScript or TypeScript

[!INCLUDE [storage-dev-guide-selector-lease-blob](../../../includes/storage-dev-guides/storage-dev-guide-selector-lease-blob.md)]

This article shows how to create and manage blob leases using the [Azure Storage client library for JavaScript](/javascript/api/overview/azure/storage-blob-readme). You can use the client library to acquire, renew, release, and break blob leases.

## Prerequisites

- The examples in this article assume you already have a project set up to work with the Azure Blob Storage client library for JavaScript. To learn about setting up your project, including package installation, importing modules, and creating an authorized client object to work with data resources, see [Get started with Azure Blob Storage and JavaScript](storage-blob-javascript-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with a blob lease. To learn more, see the authorization guidance for the following REST API operation:
    - [Lease Blob](/rest/api/storageservices/lease-blob#authorization)

## About blob leases

[!INCLUDE [storage-dev-guide-about-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-lease.md)]

Lease operations are handled by the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class, which provides a client containing all lease operations for blobs and containers. To learn more about container leases using the client library, see [Create and manage container leases with JavaScript](storage-blob-container-lease-javascript.md).

## Acquire a lease

When you acquire a blob lease, you obtain a lease ID that your code can use to operate on the blob. If the blob already has an active lease, you can only request a new lease by using the active lease ID. However, you can specify a new lease duration. 

To acquire a lease, create an instance of the [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) class, and then use one of the following methods:

- [acquireLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-acquirelease)

The following example acquires a 30-second lease for a blob:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-blob.js" id="Snippet_AcquireBlobLease":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_AcquireBlobLease":::

---

## Renew a lease

You can renew a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. The lease can be renewed even if it expires, as long as the blob hasn't been modified or leased again since the expiration of that lease. When you renew a lease, the duration of the lease resets.

To renew a lease, use one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [renewLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-renewlease)

The following example renews a lease for a blob:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-blob.js" id="Snippet_RenewBlobLease":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_RenewBlobLease":::

---

## Release a lease

You can release a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. Releasing a lease allows another client to acquire a lease for the blob immediately after the release is complete.

You can release a lease using one of the following methods on a JavaScript [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [releaseLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-releaselease)

The following example releases a lease on a blob:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-blob.js" id="Snippet_ReleaseBlobLease":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_ReleaseBlobLease":::

---

## Break a lease

You can break a blob lease if the blob has an active lease. Any authorized request can break the lease; the request isn't required to specify a matching lease ID. A lease can't be renewed after it's broken, and breaking a lease prevents a new lease from being acquired until the original lease expires or is released.

You can break a lease using one of the following methods on a [BlobLeaseClient](/javascript/api/@azure/storage-blob/blobleaseclient) instance:

- [breakLease](/javascript/api/@azure/storage-blob/blobleaseclient#@azure-storage-blob-blobleaseclient-breaklease)

The following example breaks a lease on a blob:

## [JavaScript](#tab/javascript)

:::code language="javascript" source="~/azure-storage-snippets/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-blob.js" id="Snippet_BreakBlobLease":::

## [TypeScript](#tab/typescript)

:::code language="typescript" source="~/azure-storage-snippets/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts" id="Snippet_BreakBlobLease":::

---

[!INCLUDE [storage-dev-guide-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-blob-lease.md)]

## Resources

To learn more about managing blob leases using the Azure Blob Storage client library for JavaScript, see the following resources.

### Code samples

- View [JavaScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/JavaScript/NodeJS-v12/dev-guide/lease-blob.js) and [TypeScript](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/TypeScript/NodeJS-v12/dev-guide/src/lease-blob.ts) code samples from this article (GitHub)

### REST API operations

The Azure SDK for JavaScript contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar JavaScript paradigms. The client library methods for managing blob leases use the following REST API operation:

- [Lease Blob](/rest/api/storageservices/lease-blob)

[!INCLUDE [storage-dev-guide-resources-javascript](../../../includes/storage-dev-guides/storage-dev-guide-resources-javascript.md)]

### See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)

[!INCLUDE [storage-dev-guide-next-steps-javascript](../../../includes/storage-dev-guides/storage-dev-guide-next-steps-javascript.md)]