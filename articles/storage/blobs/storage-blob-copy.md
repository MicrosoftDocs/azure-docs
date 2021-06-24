---
title: Copy a blob with Azure Storage APIs
description: Learn how to copy a blob using the Azure Storage client libraries.
services: storage
author: normesta

ms.author: normesta
ms.date: 01/08/2021
ms.service: storage
ms.subservice: blobs
ms.topic: how-to
ms.custom: "devx-track-csharp, devx-track-python"
---

# Copy a blob with Azure Storage client libraries

This article demonstrates how to copy a blob in an Azure Storage account. It also shows how to abort an asynchronous copy operation. The example code uses the Azure Storage client libraries.

## About copying blobs

When you copy a blob within the same storage account, it's a synchronous operation. When you copy across accounts it's an asynchronous operation.

The source blob for a copy operation may be a block blob, an append blob, a page blob, or a snapshot. If the destination blob already exists, it must be of the same blob type as the source blob. An existing destination blob will be overwritten.

The destination blob can't be modified while a copy operation is in progress. A destination blob can only have one outstanding copy operation. In other words, a blob can't be the destination for multiple pending copy operations.

The entire source blob or file is always copied. Copying a range of bytes or set of blocks is not supported.

When a blob is copied, it's system properties are copied to the destination blob with the same values.

A copy operation can take any of the following forms:

- Copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or can be a new blob created by the copy operation.
- Copy a source blob to a destination blob with the same name, effectively replacing the destination blob. Such a copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- Copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs is not supported.
- Copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- Copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

## Copy a blob

# [.NET v12 SDK](#tab/dotnet)

To copy a blob, call one of the following methods:

- [StartCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuri)
- [StartCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.startcopyfromuriasync)

The `StartCopyFromUri` and `StartCopyFromUriAsync` methods return a [CopyFromUriOperation](/dotnet/api/azure.storage.blobs.models.copyfromurioperation) object containing information about the copy operation.

The following code example gets a [BlobClient](/dotnet/api/azure.storage.blobs.blobclient) representing a previously created blob and copies it to a new blob in the same container:

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CopyBlob.cs" id="Snippet_CopyBlob":::

# [.NET v11 SDK](#tab/dotnet11)

To copy a blob, call one of the following methods:

- [StartCopy](/dotnet/api/microsoft.azure.storage.blob.cloudblob.startcopy)
- [StartCopyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.startcopyasync)

The `StartCopy` and `StartCopyAsync` methods return a copy ID value that is used to check status or abort the copy operation.

The following code example gets a reference to a previously created blob and copies it to a new blob in the same container:

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

        // Lease the source blob for the copy operation 
        // to prevent another client from modifying it.
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

# [Python v12 SDK](#tab/python)

To copy a blob, call the [start_copy_from_url](/azure/developer/python/sdk/storage/azure-storage-blob/azure.storage.blob.blobclient#start-copy-from-url-source-url--metadata-none--incremental-copy-false----kwargs-) method. The `start_copy_from_url` method returns a dictionary containing information about the copy operation.

The following code example gets a [BlobClient](/azure/developer/python/sdk/storage/azure-storage-blob/azure.storage.blob.blobclient) representing a previously created blob and copies it to a new blob in the same container:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/copy_blob.py" id="Snippet_BlobCopy":::

---

## Abort a copy operation

Aborting a copy operation results in a destination blob of zero length. However, the metadata for the destination blob will have the new values copied from the source blob or set explicitly during the copy operation. To keep the original metadata from before the copy, make a snapshot of the destination blob before calling one of the copy methods.

# [.NET v12 SDK](#tab/dotnet)

Check the [BlobProperties.CopyStatus](/dotnet/api/azure.storage.blobs.models.blobproperties.copystatus) property on the destination blob to get the status of the copy operation. The final blob will be committed when the copy completes.

When you abort a copy operation, the destination blob's copy status is set to [CopyStatus.Aborted](/dotnet/api/microsoft.azure.storage.blob.copystatus).

The [AbortCopyFromUri](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuri) and [AbortCopyFromUriAsync](/dotnet/api/azure.storage.blobs.specialized.blobbaseclient.abortcopyfromuriasync) methods cancel an ongoing copy operation.

:::code language="csharp" source="~/azure-storage-snippets/blobs/howto/dotnet/dotnet-v12/CopyBlob.cs" id="Snippet_StopBlobCopy":::

# [.NET v11 SDK](#tab/dotnet11)

Check the [CopyState.Status](/dotnet/api/microsoft.azure.storage.blob.copystate.status) property on the destination blob to get the status of the copy operation. The final blob will be committed when the copy completes.

When you abort a copy operation, the destination blob's copy status is set to [CopyStatus.Aborted](/dotnet/api/microsoft.azure.storage.blob.copystatus).

The [AbortCopy](/dotnet/api/microsoft.azure.storage.blob.cloudblob.abortcopy) and [AbortCopyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.abortcopyasync) methods cancel an ongoing copy operation.

```csharp
// Fetch the destination blob's properties before checking the copy state.
await destBlob.FetchAttributesAsync();

// Check the copy status. If it is still pending, abort the copy operation.
if (destBlob.CopyState.Status == CopyStatus.Pending)
{
    await destBlob.AbortCopyAsync(copyId);
    Console.WriteLine("Copy operation {0} has been aborted.", copyId);
}
```

# [Python v12 SDK](#tab/python)

Check the "status" entry in the [CopyProperties](/azure/developer/python/sdk/storage/azure-storage-blob/azure.storage.blob.copyproperties) dictionary returned by [get_blob_properties](/azure/developer/python/sdk/storage/azure-storage-blob/azure.storage.blob.blobclient#get-blob-properties---kwargs-) method to get the status of the copy operation. The final blob will be committed when the copy completes.

When you abort a copy operation, the [status](/azure/developer/python/sdk/storage/azure-storage-blob/azure.storage.blob.copyproperties) is set to "aborted".

The [abort_copy](/azure/developer/python/sdk/storage/azure-storage-blob/azure.storage.blob.blobclient#abort-copy-copy-id----kwargs-) method cancels an ongoing copy operation.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/copy_blob.py" id="Snippet_StopBlobCopy":::

---

## Azure SDKs

Get more information about Azure SDKs:

 - [Azure SDK for .NET](https://github.com/azure/azure-sdk-for-net)
 - [Azure SDK for Java](https://github.com/azure/azure-sdk-for-java)
 - [Azure SDK for Python](https://github.com/azure/azure-sdk-for-python)
 - [Azure SDK for JavaScript](https://github.com/azure/azure-sdk-for-js)

## Next steps

The following topics contain information about copying blobs and aborting ongoing copy operations by using the Azure REST APIs.

- [Copy Blob](/rest/api/storageservices/copy-blob)
- [Abort Copy Blob](/rest/api/storageservices/abort-copy-blob)
