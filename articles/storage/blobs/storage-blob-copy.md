---
title: Copy a blob with .NET - Azure Storage
description: Learn how to copy a blob in your Azure Storage account using the .NET client library.
services: storage
author: mhopkins-msft

ms.author: mhopkins
ms.date: 08/20/2019
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
---

# Copy a blob with .NET

This article shows how to copy a blob with an Azure Storage account. The example code uses the [Azure Storage client library for .NET](/dotnet/api/overview/azure/storage/client).

## Copy a blob

In version 2012-02-12 and later, the source for a copy blob operation can be a committed blob in any Azure storage account.

Beginning with version 2015-02-21, the source for a copy blob operation can be an Azure file in any Azure storage account.

> [!NOTE]
> Only storage accounts created on or after June 7th, 2012 allow blobs to be copied from another storage account.

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

## Remarks

 In version 2012-02-12 and newer, call the [StartCopyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblob.startcopyasync?view=azure-dotnet) method to initiate an asynchronous copy operation. This operation returns a copy ID you can use to check or abort the copy operation. The Blob service copies blobs on a best-effort basis.

 The source blob for a copy operation may be a block blob, an append blob, a page blob, or a snapshot. If the destination blob already exists, it must be of the same blob type as the source blob. Any existing destination blob will be overwritten. The destination blob can't be modified while a copy operation is in progress.

 In version 2015-02-21 and newer, the source for the copy operation may also be a file in the Azure File service. If the source is a file, the destination must be a block blob.

 Multiple pending copy operations within an account might be processed sequentially. A destination blob can only have one outstanding copy blob operation. In other words, a blob can't be the destination for multiple pending copy operations. An attempt to copy to a destination blob that already has a copy operation pending fails with status code 409 (Conflict).

 Only storage accounts created on or after June 7th, 2012 allow copying from another storage account. An attempt to copy from another storage account to an account created before June 7th, 2012 fails with status code 400 (Bad Request).

 The entire source blob or file is always copied. Copying a range of bytes or set of blocks is not supported.

 A copy operation can take any of the following forms.

- You can copy a source blob to a destination blob with a different name. The destination blob can be an existing blob of the same blob type (block, append, or page), or can be a new blob created by the copy operation.
- You can copy a source blob to a destination blob with the same name, effectively replacing the destination blob. Such a copy operation removes any uncommitted blocks and overwrites the destination blob's metadata.
- You can copy a source file in the Azure File service to a destination blob. The destination blob can be an existing block blob, or can be a new block blob created by the copy operation. Copying from files to page blobs or append blobs is not supported.
- You can copy a snapshot over its base blob. By promoting a snapshot to the position of the base blob, you can restore an earlier version of a blob.
- You can copy a snapshot to a destination blob with a different name. The resulting destination blob is a writeable blob and not a snapshot.

When copying from a page blob, the Blob service creates a destination page blob of the source blob's length, initially containing all zeroes. Then, the source page ranges are enumerated, and non-empty ranges are copied.

For a block blob or an append blob, the Blob service creates a committed blob of zero length before returning from this operation.

When copying from a block blob, all committed blocks and their block IDs are copied. Uncommitted blocks are not copied. At the end of the copy operation, the destination blob will have the same committed block count as the source.

When copying from an append blob, all committed blocks are copied. At the end of the copy operation, the destination blob will have the same committed block count as the source.

For all blob types, you can check the [CopyState.Status](/dotnet/api/microsoft.azure.storage.blob.copystate.status?view=azure-dotnet) property on the destination blob to get the status of the copy operation. The final blob will be committed when the copy completes.

When the source of a copy operation provides ETags, if there are any changes to the source while the copy is in progress, the copy will fail. An attempt to change the destination blob while a copy is in progress will fail with 409 Conflict.

The ETag for a block blob changes when the copy operation is initiated and when the copy finishes. The ETag for a page blob changes when the copy operation is initiated, and continues to change frequently during the copy. The contents of a block blob are only visible after the full copy completes.

### Copying blob properties and metadata

When a blob is copied, the following system properties are copied to the destination blob with the same values.

- [ContentType](/dotnet/api/microsoft.azure.storage.blob.blobproperties.contenttype?view=azure-dotnet)
- [ContentEncoding](/dotnet/api/microsoft.azure.storage.blob.blobproperties.contentencoding?view=azure-dotnet)
- [ContentLanguage](/dotnet/api/microsoft.azure.storage.blob.blobproperties.contentlanguage?view=azure-dotnet)
- [Length](/dotnet/api/microsoft.azure.storage.blob.blobproperties.length?view=azure-dotnet)
- [CacheControl](/dotnet/api/microsoft.azure.storage.blob.blobproperties.cachecontrol?view=azure-dotnet)
- [ContentMD5](/dotnet/api/microsoft.azure.storage.blob.blobproperties.contentmd5?view=azure-dotnet)
- [ContentDisposition](/dotnet/api/microsoft.azure.storage.blob.blobproperties.contentdisposition?view=azure-dotnet)
- [PageBlobSequenceNumber](/dotnet/api/microsoft.azure.storage.blob.blobproperties.pageblobsequencenumber?view=azure-dotnet) (for page blobs only)
- [AppendBlobCommittedBlockCount](/dotnet/api/microsoft.azure.storage.blob.blobproperties.appendblobcommittedblockcount?view=azure-dotnet) (for append blobs only, and for version 2015-02-21 only)

The source blob's committed block list is also copied to the destination blob, if the blob is a block blob. Any uncommitted blocks are not copied.

The destination blob is always the same size as the source blob, so the value of the `ContentLength` for the destination blob matches that of the source blob.

When the source blob and destination blob are the same, any uncommitted blocks are removed. If metadata is specified in this case, the existing metadata is overwritten with the new metadata.

### Copying a leased blob

The copy operation only reads from the source blob so the lease state of the source blob does not matter. However, the copy operation saves the ETag of the source blob when the copy is initiated. If the ETag value changes before the copy completes, the copy fails. You can prevent changes to the source blob by leasing it during the copy operation.

If the destination blob has an active infinite lease, you must specify its lease ID in the call to the copy operation. If the lease you specify is an active finite-duration lease, this call fails with a status code 412 (Precondition Failed). While the copy is pending, any lease operation on the destination blob will fail with status code 409 (Conflict). An infinite lease on the destination blob is locked in this way during the copy operation whether you are copying to a destination blob with a different name from the source, copying to a destination blob with the same name as the source, or promoting a snapshot over its base blob. If the client specifies a lease ID on a blob that does not yet exist, the Blob service will return status code 412 (Precondition Failed) for requests made against version 2013-08-15 and later; for prior versions the Blob service will return status code 201 (Created).

### Copying snapshots

When a source blob is copied, any snapshots of the source blob are not copied to the destination. When a destination blob is overwritten with a copy, any snapshots associated with the destination blob stay intact under its name.

### Copying archived blobs (version 2018-11-09 and newer)

An archived blob can be copied to a new blob within the same storage account. This will still leave the initially archived blob as is. When copying an archived blob as source, use the override of the `StartCopy` or `StartCopyAsync` method that lets you specify the tier of the destination blob:

  - [CloudBlockBlob.StartCopy](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob.startcopy?view=azure-dotnet)
  - [CloudBlockBlob.StartCopyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudblockblob.startcopyasync?view=azure-dotnet#Microsoft_Azure_Storage_Blob_CloudBlockBlob_StartCopyAsync_Microsoft_Azure_Storage_Blob_CloudBlockBlob_System_Nullable_Microsoft_Azure_Storage_Blob_StandardBlobTier__System_Nullable_Microsoft_Azure_Storage_Blob_RehydratePriority__Microsoft_Azure_Storage_AccessCondition_Microsoft_Azure_Storage_AccessCondition_Microsoft_Azure_Storage_Blob_BlobRequestOptions_Microsoft_Azure_Storage_OperationContext_System_Threading_CancellationToken_)
  - [CloudPageBlob.StartCopy](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob.startcopy?view=azure-dotnet#Microsoft_Azure_Storage_Blob_CloudPageBlob_StartCopy_Microsoft_Azure_Storage_Blob_CloudPageBlob_System_Nullable_Microsoft_Azure_Storage_Blob_PremiumPageBlobTier__Microsoft_Azure_Storage_AccessCondition_Microsoft_Azure_Storage_AccessCondition_Microsoft_Azure_Storage_Blob_BlobRequestOptions_Microsoft_Azure_Storage_OperationContext_)
  - [CloudPageBlob.StartCopyAsync](/dotnet/api/microsoft.azure.storage.blob.cloudpageblob.startcopyasync?view=azure-dotnet#Microsoft_Azure_Storage_Blob_CloudPageBlob_StartCopyAsync_Microsoft_Azure_Storage_Blob_CloudPageBlob_System_Nullable_Microsoft_Azure_Storage_Blob_PremiumPageBlobTier__Microsoft_Azure_Storage_AccessCondition_Microsoft_Azure_Storage_AccessCondition_Microsoft_Azure_Storage_Blob_BlobRequestOptions_Microsoft_Azure_Storage_OperationContext_System_Threading_CancellationToken_)

The copy source and destination should be the same storage account when the source is archived. The request will fail if the source of the copy is still pending rehydration. The data will be eventually copied to the destination blob.

For detailed information about block blob level tiering see [Hot, cool and archive storage tiers](https://docs.microsoft.com/azure/storage/storage-blob-storage-tiers).

### Working with a pending copy (version 2012-02-12 and newer)

If the copy operation completes the copy asynchronously, use the following table to determine the next step based on the value of the [CopyState.Status](/dotnet/api/microsoft.azure.storage.blob.copystate.status?view=azure-dotnet) property:

| Status value         | Meaning                                                                                              |
|----------------------|------------------------------------------------------------------------------------------------------|
| `CopyStatus.Success` | The copy completed successfully.                                                                     |
| `CopyStatus.Pending` | The copy has not completed. Check the `CopyState.Status` property until the copy completes or fails. |
| `CopyStatus.Failed`  | The copy operation failed.                                                                           |

During and after a copy operation, the properties of the destination blob contain the copy ID of the copy operation and URL of the source blob. When the copy completes, the Blob service writes the time and outcome value (`success`, `failed`, or `aborted`) to the destination blob properties. If the operation failed, the `CopyState.StatusDescription` property contains an error detail string.

A pending copy operation has a 2 week timeout. A copy attempt that has not completed after 2 weeks times out and leaves an empty blob with the `CopyState.Status` field set to `CopyStatus.Failed` and the `CopyState.StatusDescription` property set to 500 (OperationCancelled). Intermittent, non-fatal errors that can occur during a copy might impede progress of the copy but not cause it to fail. In these cases, `CopyState.StatusDescription` describes the intermittent errors.

Any attempt to modify or snapshot the destination blob during the copy will fail with **409 (Conflict) Copy Blob in Progress**.

If you call the `AbortCopy` or `AbortCopyAsync` methods, `CopyState.Status` is set to `CopyStatus.Aborted` and the destination blob will have intact metadata and a blob length of zero bytes. You can repeat the original method call to try the copy again.

If the copy operation completes synchronously, use the following table to determine the status of the copy operation:

| Status value         | Meaning                                    |
|----------------------|--------------------------------------------|
| `CopyStatus.Success` | The copy operation completed successfully. |
| `CopyStatus.Failed`  | The copy operation failed.                 |

Tier is inherited for premium storage tiers. For block blobs, overwriting the destination blob will inherit the Hot or Cool tier from the destination. Overwriting an archived blob will fail. For detailed information about block blob level tiering see [Hot, cool and archive storage tiers](https://docs.microsoft.com/azure/storage/storage-blob-storage-tiers).

### Billing

The destination account of a copy operation is charged for one transaction to initiate the copy, and also incurs one transaction for each request to abort or request the status of the copy operation.

When the source blob is in another account, the source account incurs transaction costs. In addition, if the source and destination accounts reside in different regions, bandwidth used to transfer the request is charged to the source storage account as egress. Egress between accounts within the same region is free.

When you copy a source blob to a destination blob with a different name within the same account, you use additional storage resources for the new blob, so the copy operation results in a charge against the storage account's capacity usage for those additional resources. However, if the source and destination blob name are the same within the same account (for example, when you promote a snapshot to its base blob), no additional charge is incurred other than the extra copy metadata stored in version 2012-02-12 and newer.

When you promote a snapshot to replace its base blob, the snapshot and base blob become identical. They share blocks or pages, so the copy operation does not result in an additional charge against the storage account's capacity usage. However, if you copy a snapshot to a destination blob with a different name, an additional charge is incurred for the storage resources used by the new blob that results. Two blobs with different names cannot share blocks or pages even if they are identical. For more information about snapshot cost scenarios, see [Understanding How Snapshots Accrue Charges](/rest/api/storageservices/understanding-how-snapshots-accrue-charges).

## Next steps

- [Abort a pending blob copy operation with .NET](storage-blob-copy-abort.md)
