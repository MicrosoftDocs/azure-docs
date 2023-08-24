---
title: Create and manage blob leases with Java
titleSuffix: Azure Storage
description: Learn how to manage a lock on a blob in your Azure Storage account using the Java client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: azure-storage
ms.topic: how-to
ms.date: 08/02/2023
ms.devlang: java
ms.custom: devx-track-java, devguide-java, devx-track-extended-java
---

# Create and manage blob leases with Java

This article shows how to create and manage blob leases using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme). You can use the client library to acquire, renew, release, and break blob leases.

## Prerequisites

- This article assumes you already have a project set up to work with the Azure Blob Storage client library for Java. To learn about setting up your project, including package installation, adding `import` directives, and creating an authorized client object, see [Get Started with Azure Storage and Java](storage-blob-java-get-started.md).
- The [authorization mechanism](../common/authorize-data-access.md) must have permissions to work with a blob lease. To learn more, see the authorization guidance for the following REST API operation:
    - [Lease Blob](/rest/api/storageservices/lease-blob#authorization)

## About blob leases

[!INCLUDE [storage-dev-guide-about-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-about-blob-lease.md)]

Lease operations are handled by the [BlobLeaseClient](/java/api/com.azure.storage.blob.specialized.blobleaseclient) class, which provides a client containing all lease operations for blobs and containers. To learn more about container leases using the client library, see [Create and manage container leases with Java](storage-blob-container-lease-java.md).

## Acquire a lease

When you acquire a blob lease, you obtain a lease ID that your code can use to operate on the blob. If the blob already has an active lease, you can only request a new lease by using the active lease ID. However, you can specify a new lease duration.

To acquire a lease, create an instance of the [BlobLeaseClient](/java/api/com.azure.storage.blob.specialized.blobleaseclient) class, and then use the following method:

- [acquireLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example acquires a 30-second lease for a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_AcquireLease":::

## Renew a lease

You can renew a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. The lease can be renewed even if it has expired, as long as the blob hasn't been modified or leased again since the expiration of that lease. When you renew a lease, the duration of the lease resets.

To renew an existing lease, use the following method:

- [renewLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example renews a lease for a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_RenewLease":::

## Release a lease

You can release a blob lease if the lease ID specified on the request matches the lease ID associated with the blob. Releasing a lease allows another client to acquire a lease for the blob immediately after the release is complete.

You can release a lease by using the following method:

- [releaseLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example releases the lease on a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_ReleaseLease":::

## Break a lease

You can break a blob lease if the blob has an active lease. Any authorized request can break the lease; the request isn't required to specify a matching lease ID. A lease can't be renewed after it's broken, and breaking a lease prevents a new lease from being acquired for a period of time until the original lease expires or is released.

You can break a lease by using the following method:

- [breakLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient)

The following example breaks the lease on a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_BreakLease":::

[!INCLUDE [storage-dev-guide-blob-lease](../../../includes/storage-dev-guides/storage-dev-guide-blob-lease.md)]

## Resources

To learn more about managing blob leases using the Azure Blob Storage client library for Java, see the following resources.

### REST API operations

The Azure SDK for Java contains libraries that build on top of the Azure REST API, allowing you to interact with REST API operations through familiar Java paradigms. The client library methods for managing blob leases use the following REST API operation:

- [Lease Blob](/rest/api/storageservices/lease-blob)

### Code samples

- [View code samples from this article (GitHub)](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java)

[!INCLUDE [storage-dev-guide-resources-java](../../../includes/storage-dev-guides/storage-dev-guide-resources-java.md)]

### See also

- [Managing Concurrency in Blob storage](concurrency-manage.md)
