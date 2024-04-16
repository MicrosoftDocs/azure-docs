---
title: Managing concurrency in Blob storage
titleSuffix: Azure Storage
description: Learn how to manage multiple writers to a blob by implementing either optimistic or pessimistic concurrency in your application. Optimistic concurrency checks the ETag value for a blob and compares it to the ETag provided. Pessimistic concurrency uses an exclusive lease to lock the blob to other writers.
services: storage
author: pauljewellmsft

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 04/05/2023
ms.author: pauljewell
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Managing Concurrency in Blob storage

Modern applications often have multiple users viewing and updating data simultaneously. Application developers need to think carefully about how to provide a predictable experience to their end users, particularly for scenarios where multiple users can update the same data. There are three main data concurrency strategies that developers typically consider:

- **Optimistic concurrency**: An application performing an update will, as part of its update, determine whether the data has changed since the application last read that data. For example, if two users viewing a wiki page make an update to that page, then the wiki platform must ensure that the second update doesn't overwrite the first update. It must also ensure that both users understand whether their update was successful. This strategy is most often used in web applications.

- **Pessimistic concurrency**: An application looking to perform an update takes a lock on an object preventing other users from updating the data until the lock is released. For example, in a primary/secondary data replication scenario in which only the primary performs updates, the primary typically holds an exclusive lock on the data for an extended period of time to ensure no one else can update it.

- **Last writer wins**: An approach that allows update operations to proceed without first determining whether another application has updated the data since it was read. This approach is typically used when data is partitioned in such a way that multiple users aren't accessing the same data at the same time. It can also be useful where short-lived data streams are being processed.

Azure Storage supports all three strategies, although it's distinctive in its ability to provide full support for optimistic and pessimistic concurrency. Azure Storage was designed to embrace a strong consistency model that guarantees that after the service performs an insert or update operation, subsequent read or list operations return the latest update.

In addition to selecting an appropriate concurrency strategy, developers should also be aware of how a storage platform isolates changes, particularly changes to the same object across transactions. Azure Storage uses snapshot isolation to allow read operations concurrently with write operations within a single partition. Snapshot isolation guarantees that all read operations return a consistent snapshot of the data even while updates are occurring.

You can opt to use either optimistic or pessimistic concurrency models to manage access to blobs and containers. If you don't explicitly specify a strategy, then by default the last writer wins.

## Optimistic concurrency

Azure Storage assigns an identifier to every object stored. This identifier is updated every time a write operation is performed on an object. The identifier is returned to the client as part of an HTTP GET response in the ETag header defined by the HTTP protocol.

A client that is performing an update can send the original ETag together with a conditional header to ensure that an update only occurs if a certain condition has been met. For example, if the **If-Match** header is specified, Azure Storage verifies that the value of the ETag specified in the update request is the same as the ETag for the object being updated. For more information about conditional headers, see [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).

The outline of this process is as follows:

1. Retrieve a blob from Azure Storage. The response includes an HTTP ETag Header value that identifies the current version of the object.
1. When you update the blob, include the ETag value you received in step 1 in the **If-Match** conditional header of the write request. Azure Storage compares the ETag value in the request with the current ETag value of the blob.
1. If the blob's current ETag value differs from the ETag value specified in the **If-Match** conditional header provided on the request, then Azure Storage returns HTTP status code 412 (Precondition Failed). This error indicates to the client that another process has updated the blob since the client first retrieved it. The client should fetch the blob again to get the updated content and properties.
1. If the current ETag value of the blob is the same version as the ETag in the **If-Match** conditional header in the request, Azure Storage performs the requested operation and updates the current ETag value of the blob.

The following code examples show how to construct an **If-Match** condition on the write request that checks the ETag value for a blob. Azure Storage evaluates whether the blob's current ETag is the same as the ETag provided on the request and performs the write operation only if the two ETag values match. If another process has updated the blob in the interim, then Azure Storage returns an HTTP 412 (Precondition Failed) status message.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Concurrency.cs" id="Snippet_DemonstrateOptimisticConcurrencyBlob":::

Azure Storage also supports other conditional headers, including as **If-Modified-Since**, **If-Unmodified-Since** and **If-None-Match**. For more information, see [Specifying Conditional Headers for Blob Service Operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).

## Pessimistic concurrency for blobs

To lock a blob for exclusive use, you can acquire a lease on it. When you acquire the lease, you specify the duration of the lease. A finite lease may be valid from between 15 to 60 seconds. A lease can also be infinite, which amounts to an exclusive lock. You can renew a finite lease to extend it, and you can release the lease when you're finished with it. Azure Storage automatically releases finite leases when they expire.

Leases enable different synchronization strategies to be supported, including exclusive write/shared read operations, exclusive write/exclusive read operations, and shared write/exclusive read operations. When a lease exists, Azure Storage enforces exclusive access to write operations for the lease holder. However, ensuring exclusivity for read operations requires the developer to make sure that all client applications use a lease ID and that only one client at a time has a valid lease ID. Read operations that don't include a lease ID result in shared reads.

The following code examples show how to acquire an exclusive lease on a blob, update the content of the blob by providing the lease ID, and then release the lease. If the lease is active and the lease ID isn't provided on a write request, then the write operation fails with error code 412 (Precondition Failed).

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/Concurrency.cs" id="Snippet_DemonstratePessimisticConcurrencyBlob":::

## Pessimistic concurrency for containers

Leases on containers enable the same synchronization strategies that are supported for blobs, including exclusive write/shared read, exclusive write/exclusive read, and shared write/exclusive read. For containers, however, the exclusive lock is enforced only on delete operations. To delete a container with an active lease, a client must include the active lease ID with the delete request. All other container operations succeed on a leased container without the lease ID.

## Next steps

- [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations)
- [Lease Container](/rest/api/storageservices/lease-container)
- [Lease Blob](/rest/api/storageservices/lease-blob)

## Resources

For related code samples using deprecated .NET version 11.x SDKs, see [Code samples using .NET version 11.x](blob-v11-samples-dotnet.md#optimistic-concurrency-for-blobs).
