---
title: Managing concurrency in Blob storage
titleSuffix: Azure Storage
description: 
services: storage
author: tamram

ms.service: storage
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/24/2020
ms.author: tamram
ms.subservice: common
ms.custom: devx-track-csharp
---

# Managing Concurrency in Blob storage

Modern applications often have multiple users viewing and updating data simultaneously. Application developers need to think carefully about how to provide a predictable experience to their end users, particularly for scenarios where multiple users can update the same data. There are three main data concurrency strategies that developers typically consider:  

1. **Optimistic concurrency**: An application performing an update will, as part of its update, determine whether the data has changed since the application last read that data. For example, if two users viewing a wiki page make an update to the same page, then the wiki platform must ensure that the second update does not overwrite the first update. It must also ensure that both users understand whether or not their update was successful. This strategy is most often used in web applications.

1. **Pessimistic concurrency**: An application looking to perform an update will take a lock on an object preventing other users from updating the data until the lock is released. For example, in a master/subordinate data replication scenario where only the master performs updates, the master typically holds an exclusive lock for an extended period of time on the data to ensure no one else can update it.

1. **Last writer wins**: An approach that allows update operations to proceed without first determining whether another application has updated the data since the data was first read. This strategy (or lack of a formal strategy) is typically used where data is partitioned in such a way that there is no likelihood that multiple users will access the same data. It can also be useful where short-lived data streams are being processed.  

Azure Storage supports all three strategies, although it is distinctive in its ability to provide full support for optimistic and pessimistic concurrency. Azure Storage was designed to embrace a strong consistency model that guarantees that when the service performs an insert or update operation, subsequent reads see the latest update.

In addition to selecting an appropriate concurrency strategy, developers should also be aware of how a storage platform isolates changes, particularly changes to the same object across transactions. Azure Storage uses snapshot isolation to allow read operations concurrently with write operations within a single partition. Snapshot isolation guarantees that all read operations return a consistent snapshot of the data even while updates are occurring.

You can opt to use either optimistic or pessimistic concurrency models to manage access to blobs and containers. If you do not explicitly specify a strategy, then by default the last writer wins.  

This article provides an overview of how Azure Storage simplifies development by providing first class support for all three of these concurrency strategies.  

## Optimistic concurrency for blobs and containers

Azure Storage assigns an identifier to every object stored. This identifier is updated every time an update operation is performed on an object. The identifier is returned to the client as part of an HTTP GET response using the ETag (entity tag) header that is defined within the HTTP protocol.

A client that is performing an update can send the original ETag together with a conditional header to ensure that an update will only occur if a certain condition has been met. For example, if the **If-Match** header is specified, Azure Storage verifies that the value of the ETag specified in the update request is the same as the ETag for the object being updated. For more information about conditional headers, see [Specifying conditional headers for Blob service operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).

The outline of this process is as follows:  

1. Retrieve a blob from Azure Storage. The response includes an HTTP ETag Header value that identifies the current version of the object.
1. When you update the blob, include the ETag value you received in step 1 in the **If-Match** conditional header of the write request. Azure Storage compares the ETag value in the request with the current ETag value of the blob.
1. If the current ETag value of the blob is a different version than the ETag in the **If-Match** conditional header in the request, Azure Storage returns HTTP status code 412 (Precondition Failed) to the client. This error indicates to the client that another process has updated the blob since the client retrieved it.
1. If the current ETag value of the blob is the same version as the ETag in the **If-Match** conditional header in the request, Azure Storage performs the requested operation and updates the current ETag value of the blob.  

# [\.NET v12](#tab/dotnet)


# [\.NET v11](#tab/dotnetv11)

The following code shows how to construct an **If-Match AccessCondition** based on the ETag value that is accessed from the properties of a blob that was previously either retrieved or inserted. It then uses the **AccessCondition** object when it updates the blob: the **AccessCondition** object adds the **If-Match** header to the request. If another process has updated the blob, the Blob service returns an HTTP 412 (Precondition Failed) status message.  

```csharp
public void DemonstrateOptimisticConcurrencyBlob(string containerName, string blobName)
{
    Console.WriteLine("Demonstrate optimistic concurrency");

    // Parse connection string and create container.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExists();

    // Create test blob. The default strategy is last writer wins, so 
    // write operation will overwrite existing blob if present.
    CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);
    blockBlob.UploadText("Hello World!");

    // Retrieve the ETag from the newly created blob.
    string originalETag = blockBlob.Properties.ETag;
    Console.WriteLine("Blob added. Original ETag = {0}", originalETag);

    /// This code simulates an update by another client.
    string helloText = "Blob updated by another client.";
    // No ETag was provided, so original blob is overwritten and ETag updated.
    blockBlob.UploadText(helloText);
    Console.WriteLine("Blob updated. Updated ETag = {0}", blockBlob.Properties.ETag);

    // Now try to update the blob using the original ETag value.
    try
    {
        Console.WriteLine(@"Attempt to update blob using original ETag
                            to generate if-match access condition");
        blockBlob.UploadText(helloText, accessCondition: AccessCondition.GenerateIfMatchCondition(originalETag));
    }
    catch (StorageException ex)
    {
        if (ex.RequestInformation.HttpStatusCode == (int)HttpStatusCode.PreconditionFailed)
        {
            Console.WriteLine(@"Precondition failure as expected. 
                                Blob's ETag does not match.");
        }
        else
        {
            throw;
        }
    }
    Console.WriteLine();
}
```

---

Azure Storage also supports other conditional headers, including as **If-Modified-Since**, **If-Unmodified-Since** and **If-None-Match**. For more information, see [Specifying Conditional Headers for Blob Service Operations](/rest/api/storageservices/specifying-conditional-headers-for-blob-service-operations).  

## Pessimistic concurrency for blobs

To lock a blob for exclusive use, you can acquire a lease on it. When you acquire the lease, you specify the duration of the lease. A finite lease may be valid from between 15 to 60 seconds. A lease can also be infinite, which amounts to an exclusive lock. You can renew a finite lease to extend it, and you can release any lease when you are finished with it. Azure Storage automatically releases finite leases when they expire.  

Leases enable different synchronization strategies to be supported, including exclusive write/shared read operations, exclusive write/exclusive read operations, and shared write/exclusive read operations. When a lease exists, Azure Storage enforces exclusive access to write operations for the lease holder. However, ensuring exclusivity for read operations requires the developer to make sure that all client applications use a lease ID and that only one client at a time has a valid lease ID. Read operations that do not include a lease ID result in shared reads.  

# [\.NET v12](#tab/dotnet)



# [\.NET v11](#tab/dotnetv11)

The following code shows how to acquire an exclusive lease on a blob for 30 seconds, update the content of the blob, and release the lease. If there is already a valid lease on the blob when you try to acquire a new lease, Azure Storage returns HTTP error code 409 (Conflict). The code example uses an **AccessCondition** object to encapsulate the lease information when it makes a request to update the blob in Azure Storage.

```csharp
public void DemonstratePessimisticConcurrencyBlob(string containerName, string blobName)
{
    Console.WriteLine("Demonstrate pessimistic concurrency");

    // Parse connection string and create container.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConnectionString);
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
    CloudBlobContainer container = blobClient.GetContainerReference(containerName);
    container.CreateIfNotExists();

    CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);
    blockBlob.UploadText("Hello World!");
    Console.WriteLine("Blob added.");

    // Acquire lease for 15 seconds.
    string lease = blockBlob.AcquireLease(TimeSpan.FromSeconds(15), null);
    Console.WriteLine("Blob lease acquired. Lease = {0}", lease);

    // Update blob using lease. This operation should succeed.
    const string helloText = "Blob updated";
    var accessCondition = AccessCondition.GenerateLeaseCondition(lease);
    blockBlob.UploadText(helloText, accessCondition: accessCondition);
    Console.WriteLine("Blob updated using an exclusive lease");

    // Simulate another client attempting to update to blob without providing lease.
    try
    {
        // Operation will fail as no valid lease was provided.
        Console.WriteLine("Now try to update blob without valid lease.");
        blockBlob.UploadText("Update operation will fail without lease.");
    }
    catch (StorageException ex)
    {
        if (ex.RequestInformation.HttpStatusCode == (int)HttpStatusCode.PreconditionFailed)
        {
            Console.WriteLine(@"Precondition failure error as expected. 
                                Blob lease not provided.");
        }
        else
        {
            throw;
        }
    }

    // Release lease proactively.
    blockBlob.ReleaseLease(accessCondition);
    Console.WriteLine();
}
```

---

If you attempt a write operation on a leased blob without passing the lease ID, the request fails with a 412 error. Note that if the lease expires before calling the **UploadText** method but you still pass the lease ID, the request also fails with a **412** error. For more information about managing lease expiry times and lease IDs, see the [Lease Blob](https://msdn.microsoft.com/library/azure/ee691972.aspx) REST documentation.  

## Pessimistic concurrency for containers

Leases on containers enable the same synchronization strategies to be supported as on blobs (exclusive write / shared read, exclusive write / exclusive read and shared write / exclusive read) however unlike blobs the storage service only enforces exclusivity on delete operations. To delete a container with an active lease, a client must include the active lease ID with the delete request. All other container operations succeed on a leased container without including the lease ID in which case they are shared operations. If exclusivity of update (put or set) or read operations is required then developers should ensure all clients use a lease ID and that only one client at a time has a valid lease ID.  

The following container operations can use leases to manage pessimistic concurrency:  

* Delete Container
* Get Container Properties
* Get Container Metadata
* Set Container Metadata
* Get Container ACL
* Set Container ACL
* Lease Container  

For more information, see:  

* [Specifying Conditional Headers for Blob Service Operations](https://msdn.microsoft.com/library/azure/dd179371.aspx)
* [Lease Container](https://msdn.microsoft.com/library/azure/jj159103.aspx)
* [Lease Blob](https://msdn.microsoft.com/library/azure/ee691972.aspx)

## Next steps

For the complete sample application referenced in this blog:  

* [Managing Concurrency using Azure Storage - Sample Application](https://code.msdn.microsoft.com/Managing-Concurrency-using-56018114)  

For more information on Azure Storage see:  

* [Microsoft Azure Storage Home Page](https://azure.microsoft.com/services/storage/)
* [Introduction to Azure Storage](storage-introduction.md)
* Storage Getting Started for [Blob](../blobs/storage-dotnet-how-to-use-blobs.md), [Table](../../cosmos-db/table-storage-how-to-use-dotnet.md),  [Queues](../storage-dotnet-how-to-use-queues.md), and [Files](../storage-dotnet-how-to-use-files.md)
* Storage Architecture – [Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency](https://docs.microsoft.com/archive/blogs/windowsazurestorage/sosp-paper-windows-azure-storage-a-highly-available-cloud-storage-service-with-strong-consistency)

