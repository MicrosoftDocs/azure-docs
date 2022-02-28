---
title: Create and manage blob container leases with .NET - Azure Storage 
description: Learn how to manage a lock on a container in your Azure Storage account using the .NET client library.
services: storage
author: normesta

ms.service: storage
ms.topic: how-to
ms.date: 02/25/2022
ms.author: normesta
ms.subservice: blobs
ms.devlang: csharp
ms.custom: devx-track-csharp
---

# Create and manage blob container leases with .NET

A lease establishes and manages a lock on a container or the blobs in a container. You can use the .NET client library to acquire, renew, release and break leases. To learn more about leasing containers, see [Lease Container](/rest/api/storageservices/lease-container).

## Acquire a lease

When you acquire a lease, you'll obtain a lease ID that your code can use to operate on the container. To acquire a lease on a container, create an instance of the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class, and then use either of these methods:

- [Acquire](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.acquire)
- [AcquireAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.acquireasync)

The following example acquires a 30 second lease for a container.

```csharp
public static async Task AcquireLease(BlobContainerClient containerClient)
{
    try
    {
        BlobLeaseClient blobLeaseClient = containerClient.GetBlobLeaseClient();

        TimeSpan ts = new TimeSpan(0, 0, 0, 30);
        Response<BlobLease> blobLeaseResponse = await blobLeaseClient.AcquireAsync(ts);

        Console.WriteLine("Blob Lease Id:" + blobLeaseResponse.Value.LeaseId);
        Console.WriteLine("Remaining Lease Time: " + blobLeaseResponse.Value.LeaseTime);
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine("HTTP error code {0}: {1}",
                            e.Status, e.ErrorCode);
        Console.WriteLine(e.Message);
    }
}
```

## Renew a lease

If your lease expires, you can renew it. To renew a lease for a container, use either of the following methods of the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class:

- [Renew](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.renew)
- [RenewAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.renewasync)

Specify the lease ID by setting the [IfMatch](/dotnet/api/azure.matchconditions.ifmatch) property of a [RequestConditions](/dotnet/api/azure.requestconditions) instance.

The following example renews a lease for a container.

```csharp
public static async Task RenewLease(BlobContainerClient containerClient, string leaseID)
{
    try
    {
        BlobLeaseClient blobLeaseClient = containerClient.GetBlobLeaseClient();
        RequestConditions requestConditions = new RequestConditions();
        requestConditions.IfMatch = new ETag(leaseID);
        await blobLeaseClient.RenewAsync();
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine("HTTP error code {0}: {1}",
                            e.Status, e.ErrorCode);
        Console.WriteLine(e.Message);
    }
}
```

## Release a lease

You can either wait for a lease to expire or explicitly release it. When you release a lease, other clients can obtain a lease on the container. You can release a lease by using either of these methods of the [BlobLeaseClient](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient) class.

- [Release](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.release)
- [ReleaseAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.releaseasync)

The following example releases the lease on a container.

```csharp
public static async Task ReleaseLease(BlobContainerClient containerClient)
{
    try
    {
        BlobLeaseClient blobLeaseClient = containerClient.GetBlobLeaseClient();
        await blobLeaseClient.ReleaseAsync();
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine("HTTP error code {0}: {1}",
                            e.Status, e.ErrorCode);
        Console.WriteLine(e.Message);
    }
}
```

## Break a lease

When you break a lease, the lease ends, but other clients can't acquire a lease until the lease period expires. You can break a lease by using either of these methods:

- [Break](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.break)
- [BreakAsync](/dotnet/api/azure.storage.blobs.specialized.blobleaseclient.breakasync);

The following example breaks the lease on a container.

```csharp
public static async Task BreakLease(BlobContainerClient containerClient)
{
    try
    {
        BlobLeaseClient blobLeaseClient = containerClient.GetBlobLeaseClient();
        await blobLeaseClient.BreakAsync();
    }
    catch (RequestFailedException e)
    {
        Console.WriteLine("HTTP error code {0}: {1}",
                            e.Status, e.ErrorCode);
        Console.WriteLine(e.Message);
    }
}
```

## See also

- [Get started with Azure Blob Storage and .NET](storage-blob-dotnet-get-started.md)
- [Managing Concurrency in Blob storage](concurrency-manage.md)
