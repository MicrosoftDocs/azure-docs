---
title: Abort an ongoing blob copy operation with .NET - Azure Storage
description: Learn how to abort an ongoing copy operation in your Azure Storage account using the .NET client library.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/20/2019
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
---

# Abort an ongoing blob copy operation with .NET

This article shows how to abort an ongoing blob copy operation. The example code uses the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).

## About aborting a copy operation

Aborting a copy operation results in a destination blob of zero length for block blobs, append blobs, and page blobs. However, the metadata for the destination blob will have the new values copied from the source blob or set explicitly in the [StartCopy](/dotnet/api/microsoft.azure.storage.blob.cloudblob.startcopy?view=azure-dotnet) or [StartCopyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.startcopyasync?view=azure-dotnet) call. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling `StartCopy` or `StartCopyAsync`.

When you abort an ongoing blob copy operation, the destination blob’s [CopyState.Status](/dotnet/api/microsoft.azure.storage.blob.copystate.status?view=azure-dotnet#Microsoft_Azure_Storage_Blob_CopyState_Status) is set to [CopyStatus.Aborted](/dotnet/api/microsoft.azure.storage.blob.copystatus?view=azure-dotnet).

## Abort a blob copy operation

The [AbortCopy](/dotnet/api/microsoft.azure.storage.blob.cloudblob.abortcopy?view=azure-dotnet) and [AbortCopyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.abortcopyasync?view=azure-dotnet) methods cancel an ongoing blob copy operation, and leave a destination blob with zero length and full metadata. Version 2012-02-12 and newer.

The following code example creates a large block blob, and copies it to a new blob in the same container. If the copy operation does not complete within the specified interval, the example aborts the copy operation.

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

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

## Next steps

- [Copy a blob with .NET](storage-blob-copy.md)
