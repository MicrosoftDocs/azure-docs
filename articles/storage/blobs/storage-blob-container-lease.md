---
title: Create and manage blob or container leases with .NET - Azure Storage 
description: Learn how to manage a lock on a blob or container in your Azure Storage account using the .NET client library.
services: storage
author: pauljewellmsft
ms.author: pauljewell

ms.service: storage
ms.topic: how-to
ms.date: 03/28/2022
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Create and manage blob or container leases with .NET

A lease establishes and manages a lock on a container or the blobs in a container. You can use the .NET client library to acquire, renew, release and break leases. To learn more about leasing blobs or containers, see [Lease Container](/rest/api/storageservices/lease-container) or [Lease Blobs](/rest/api/storageservices/lease-blob).

## Acquire a lease

When you acquire a lease, you'll obtain a lease ID that your code can use to operate on the blob or container. To acquire a lease, create an instance of the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class, and then use either of these methods:

- [Acquire](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.acquire)
- [AcquireAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.acquireasync)

The following example acquires a 30 second lease for a container.

```csharp
public static async Task AcquireLease(BlobContainerClient containerClient)
{
    BlobLeaseClient blobLeaseClient = containerClient.GetBlobLeaseClient();

    TimeSpan ts = new TimeSpan(0, 0, 0, 30);
    Response<BlobLease> blobLeaseResponse = await blobLeaseClient.AcquireAsync(ts);

    Console.WriteLine("Blob Lease Id:" + blobLeaseResponse.Value.LeaseId);
    Console.WriteLine("Remaining Lease Time: " + blobLeaseResponse.Value.LeaseTime);
}
```

## Renew a lease

If your lease expires, you can renew it. To renew a lease, use either of the following methods of the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class:

- [Renew](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.renew)
- [RenewAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.renewasync)

Specify the lease ID by setting the [IfMatch](/dotnet/api/azure.matchconditions.ifmatch) property of a [RequestConditions](/dotnet/api/azure.requestconditions) instance.

The following example renews a lease for a blob.

```csharp
public static async Task RenewLease(BlobClient blobClient, string leaseID)
{
    BlobLeaseClient blobLeaseClient = blobClient.GetBlobLeaseClient();
    RequestConditions requestConditions = new RequestConditions();
    requestConditions.IfMatch = new ETag(leaseID);
    await blobLeaseClient.RenewAsync();
}
```

## Release a lease

You can either wait for a lease to expire or explicitly release it. When you release a lease, other clients can obtain a lease. You can release a lease by using either of these methods of the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class.

- [Release](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.release)
- [ReleaseAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.releaseasync)

The following example releases the lease on a container.

```csharp
public static async Task ReleaseLease(BlobContainerClient containerClient)
{
    BlobLeaseClient blobLeaseClient = containerClient.GetBlobLeaseClient();
    await blobLeaseClient.ReleaseAsync();
}
```

## Break a lease

When you break a lease, the lease ends, but other clients can't acquire a lease until the lease period expires. You can break a lease by using either of these methods:

- [Break](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.break)
- [BreakAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.breakasync);

The following example breaks the lease on a blob.

```csharp
public static async Task BreakLease(BlobClient blobClient)
{
    BlobLeaseClient blobLeaseClient = blobClient.GetBlobLeaseClient();
    await blobLeaseClient.BreakAsync();
}
```

## See also

- [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)
- [Managing Concurrency in Blob storage](concurrency-manage.md)
