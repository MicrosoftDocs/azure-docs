---
title: Copy or abort a blob copy operation with .NET - Azure Storage
description: Learn how to copy a blob or abort a pending copy operation in your Azure Storage account using the .NET client library.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/09/2019
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
---

# Copy or abort a blob copy operation with .NET

This article shows how to copy a blob with an Azure Storage account. It also shows how to abort a pending blob copy operation. The example code uses the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).

## Copy a blob

The Copy Blob operation copies a blob to a destination within the storage account.

In version 2012-02-12 and later, the source for a Copy Blob operation can be a committed blob in any Azure storage account.

Beginning with version 2015-02-21, the source for a Copy Blob operation can be an Azure file in any Azure storage account.

The following code example gets a reference to a blob created previously and copies it to a new blob in the same container.

```csharp
private static async Task CopyBlockBlobAsync(CloudBlobContainer container)
{
    CloudBlockBlob sourceBlob = null;
    CloudBlockBlob destBlob = null;
    string leaseId = null;

    try
    {
        // Get a block blob from the container to use as the source.
        sourceBlob = container.ListBlobs().OfType<CloudBlockBlob>().FirstOrDefault();

        // Lease the source blob for the copy operation to prevent another client from modifying it.
        // Specifying null for the lease interval creates an infinite lease.
        leaseId = await sourceBlob.AcquireLeaseAsync(null);

        // Get a reference to a destination blob (in this case, a new blob).
        destBlob = container.GetBlockBlobReference("copy of " + sourceBlob.Name);

        // Ensure that the source blob exists.
        if (await sourceBlob.ExistsAsync())
        {
            // Get the ID of the copy operation.
            string copyId = await destBlob.StartCopyAsync(sourceBlob);

            // Fetch the destination blob's properties before checking the copy state.
            await destBlob.FetchAttributesAsync();

            Console.WriteLine("Status of copy operation: {0}", destBlob.CopyState.Status);
            Console.WriteLine("Completion time: {0}", destBlob.CopyState.CompletionTime);
            Console.WriteLine("Bytes copied: {0}", destBlob.CopyState.BytesCopied.ToString());
            Console.WriteLine("Total bytes: {0}", destBlob.CopyState.TotalBytes.ToString());
            Console.WriteLine();
        }
    }
    catch (StorageException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
    finally
    {
        // Break the lease on the source blob.
        if (sourceBlob != null)
        {
            await sourceBlob.FetchAttributesAsync();

            if (sourceBlob.Properties.LeaseState != LeaseState.Available)
            {
                await sourceBlob.BreakLeaseAsync(new TimeSpan(0));
            }
        }
    }
}
```

## Abort a blob copy operation

The Abort Copy Blob operation aborts a pending Copy Blob operation, and leaves a destination blob with zero length and full metadata. Version 2012-02-12 and newer.

The following code example creates a large block blob, and copies it to a new blob in the same container. If the copy operation does not complete within the specified interval, abort the copy operation.

```csharp
private static async Task CopyLargeBlockBlobAsync(CloudBlobContainer container, int sizeInMb)
{
    // Create an array of random bytes, of the specified size.
    byte[] bytes = new byte[sizeInMb * 1024 * 1024];
    Random rng = new Random();
    rng.NextBytes(bytes);

    // Get a reference to a new block blob.
    CloudBlockBlob sourceBlob = container.GetBlockBlobReference("LargeSourceBlob");

    // Get a reference to the destination blob (in this case, a new blob).
    CloudBlockBlob destBlob = container.GetBlockBlobReference("copy of " + sourceBlob.Name);

    MemoryStream msWrite = null;
    string copyId = null;
    string leaseId = null;

    try
    {
        // Create a new block blob comprised of random bytes to use as the source of the copy operation.
        msWrite = new MemoryStream(bytes);
        msWrite.Position = 0;
        using (msWrite)
        {
            await sourceBlob.UploadFromStreamAsync(msWrite);
        }

        // Lease the source blob for the copy operation to prevent another client from modifying it.
        // Specifying null for the lease interval creates an infinite lease.
        leaseId = await sourceBlob.AcquireLeaseAsync(null);

        // Get the ID of the copy operation.
        copyId = await destBlob.StartCopyAsync(sourceBlob);

        // Fetch the destination blob's properties before checking the copy state.
        await destBlob.FetchAttributesAsync();

        // Sleep for 1 second. In a real-world application, this would most likely be a longer interval.
        System.Threading.Thread.Sleep(1000);

        // Check the copy status. If it is still pending, abort the copy operation.
        if (destBlob.CopyState.Status == CopyStatus.Pending)
        {
            await destBlob.AbortCopyAsync(copyId);
            Console.WriteLine("Copy operation {0} has been aborted.", copyId);
        }

        Console.WriteLine();
    }
    catch (StorageException e)
    {
        Console.WriteLine(e.Message);
        Console.ReadLine();
        throw;
    }
    finally
    {
        // Close the stream.
        if (msWrite != null)
        {
            msWrite.Close();
        }

        // Break the lease on the source blob.
        if (sourceBlob != null)
        {
            await sourceBlob.FetchAttributesAsync();

            if (sourceBlob.Properties.LeaseState != LeaseState.Available)
            {
                await sourceBlob.BreakLeaseAsync(new TimeSpan(0));
            }
        }

        // Delete the source blob.
        if (sourceBlob != null)
        {
            await sourceBlob.DeleteIfExistsAsync();
        }

        // Delete the destination blob.
        if (destBlob != null)
        {
            await destBlob.DeleteIfExistsAsync();
        }
    }
}
```

[!INCLUDE [storage-blob-dotnet-resources](../../../includes/storage-blob-dotnet-resources.md)]

## See also

- [Copy Blob operation](/rest/api/storageservices/copy-blob)
- [Abort Copy Blob operation](/rest/api/storageservices/abort-copy-blob)
