---
title: Create and manage blob or container leases with Java - Azure Storage 
description: Learn how to manage a lock on a blob or container in your Azure Storage account using the Java client library.
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

# Create and manage blob or container leases with Java

This article shows how to create and manage blob or container leases using the [Azure Storage client library for Java](/java/api/overview/azure/storage-blob-readme).

A lease establishes and manages a lock on a container or the blobs in a container. You can use the Java client library to acquire, renew, release and break leases. Lease operations are handled by the [BlobLeaseClient](/java/api/com.azure.storage.blob.specialized.blobleaseclient) class, which provides a client containing all lease operations for [BlobContainerClient](/java/api/com.azure.storage.blob.blobcontainerclient) and [BlobClient](/java/api/com.azure.storage.blob.blobclient).

## Acquire a lease

When you acquire a lease, you'll obtain a lease ID that your code can use to operate on the blob or container. To acquire a lease, create an instance of the [BlobLeaseClient](/java/api/com.azure.storage.blob.specialized.blobleaseclient) class, and then use the following method:

- [BlobLeaseClient.acquireLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient#com-azure-storage-blob-specialized-blobleaseclient-acquirelease(int))

The following example acquires a 30-second lease for a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_AcquireLease":::

## Renew a lease

If your lease expires, you can renew it. To renew a lease, use the following method:

- [BlobLeaseClient.renewLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient#com-azure-storage-blob-specialized-blobleaseclient-renewlease())

The following example renews a lease for a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_RenewLease":::

## Release a lease

You can either wait for a lease to expire or explicitly release it. When you release a lease, other clients can obtain a lease. You can release a lease by using the following method:

- [BlobLeaseClient.releaseLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient#com-azure-storage-blob-specialized-blobleaseclient-releaselease())

The following example releases the lease on a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_ReleaseLease":::

## Break a lease

When you break a lease, the lease ends, but other clients can't acquire a lease until the lease period expires. You can break a lease by using the following method:

- [BlobLeaseClient.breakLease](/java/api/com.azure.storage.blob.specialized.blobleaseclient#com-azure-storage-blob-specialized-blobleaseclient-breaklease())

The following example breaks the lease on a blob:

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java" id="Snippet_BreakLease":::

## See also

- [View code sample in GitHub](https://github.com/Azure-Samples/AzureStorageSnippets/blob/master/blobs/howto/Java/blob-devguide/blob-devguide-blobs/src/main/java/com/blobs/devguide/blobs/BlobLease.java)
- [Lease Container](/rest/api/storageservices/lease-container)
- [Lease Blob](/rest/api/storageservices/lease-blob)
- [Managing Concurrency in Blob storage](concurrency-manage.md)
