---
title: Azure PowerShell script sample - Calculate the total billing size of a blob container
description: Calculate the total size of a container in Azure Blob storage for billing purposes.
services: storage
author: stevenmatthew

ms.service: azure-storage
ms.devlang: powershell
ms.custom: devx-track-azurepowershell
ms.topic: sample
ms.date: 01/19/2023
ms.author: shaas
---

# Calculate the total billing size of a blob container

This script calculates the size of a container in Azure Blob storage for the purpose of estimating billing costs. The script totals the size of the blobs in the container.

> [!IMPORTANT]
> The sample script provided in this article may not accurately calculate the billing size for blob snapshots.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh-az.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

> [!NOTE]
> This PowerShell script calculates the size of a container for billing purposes. If you are calculating container size for other purposes, see [Calculate the total size of a Blob storage container](../scripts/storage-blobs-container-calculate-size-powershell.md) for a simpler script that provides an estimate.

## Determine the size of the blob container

The total size of the blob container includes the size of the container itself and the size of all blobs under the container.

The following sections describes how the storage capacity is calculated for blob containers and blobs. In the following section, Len(X) means the number of characters in the string.

### Blob containers

The following calculation describes how to estimate the amount of storage that's consumed per blob container:

```
48 bytes + Len(ContainerName) * 2 bytes +
For-Each Metadata[3 bytes + Len(MetadataName) + Len(Value)] +
For-Each Signed Identifier[512 bytes]
```

Following is the breakdown:

* 48 bytes of overhead for each container includes the Last Modified Time, Permissions, Public Settings, and some system metadata.

* The container name is stored as Unicode, so take the number of characters and multiply by two.

* For each block of blob container metadata that's stored, we store the length of the name (ASCII), plus the length of the string value.

* The 512 bytes per Signed Identifier includes signed identifier name, start time, expiry time, and permissions.

### Blobs

The following calculations show how to estimate the amount of storage consumed per blob.

* Block blob (base blob or snapshot):

   ```
   124 bytes + Len(BlobName) * 2 bytes +
   For-Each Metadata[3 bytes + Len(MetadataName) + Len(Value)] +
   8 bytes + number of committed and uncommitted blocks * Block ID Size in bytes +
   SizeInBytes(data in unique committed data blocks stored) +
   SizeInBytes(data in uncommitted data blocks)
   ```

* Page blob (base blob or snapshot):

   ```
   124 bytes + Len(BlobName) * 2 bytes +
   For-Each Metadata[3 bytes + Len(MetadataName) + Len(Value)] +
   number of nonconsecutive page ranges with data * 12 bytes +
   SizeInBytes(data in unique pages stored)
   ```

Following is the breakdown:

* 124 bytes of overhead for blob, which includes:
    - Last Modified Time
    - Size
    - Cache-Control
    - Content-Type
    - Content-Language
    - Content-Encoding
    - Content-MD5
    - Permissions
    - Snapshot information
    - Lease
    - Some system metadata

* The blob name is stored as Unicode, so take the number of characters and multiply by two.

* For each block of metadata that's stored, add the length of the name (stored as ASCII), plus the length of the string value.

* For the block blobs:
  * 8 bytes for the block list.
  * Number of blocks times the block ID size in bytes.
  * The size of the data in all of the committed and uncommitted blocks.

    >[!NOTE]
    >When snapshots are used, this size  includes only the unique data for this base or snapshot blob. If the uncommitted blocks are not used after a week, they are garbage-collected. After that, they don't count toward billing.

* For page blobs:
  * The number of nonconsecutive page ranges with data times 12 bytes. This is the number of unique page ranges you see when calling the **GetPageRanges** API.

  * The size of the data in bytes of all of the stored pages.

    >[!NOTE]
    >When snapshots are used, this size includes only the unique pages for the base blob or the snapshot blob that's being counted.

## Sample script

[!code-powershell[main](../../../powershell_scripts/storage/calculate-container-size/calculate-container-size-ex.ps1 "Calculate container size")]

## Next steps

- See [Calculate the total size of a Blob storage container](../scripts/storage-blobs-container-calculate-size-powershell.md) for a simple script that provides an estimate of container size.

- For more information about Azure Storage billing, see [Understanding Windows Azure Storage Billing](https://blogs.msdn.microsoft.com/windowsazurestorage/2010/07/08/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity/).

- For more information about the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).

- You can find additional Storage PowerShell script samples in [PowerShell samples for Azure Storage](../blobs/storage-samples-blobs-powershell.md).
