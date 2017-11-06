---
title: Azure PowerShell Script Sample - Calculate blob container size | Microsoft Docs
description: Calculate the size of a container in Azure Blob storage by totaling the size of each of its blobs.
services: storage
documentationcenter: na
author: fhryo-msft
manager: cbrooks
editor: tysonn

ms.assetid:
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: powershell
ms.topic: sample
ms.date: 10/23/2017
ms.author: fryu
---

# Calculate the size of a Blob storage container

This script calculates the size of a container in Azure Blob storage by totaling the size of the blobs in the container.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Understand the size of Blob storage container

Total size of Blob storage container includes the size of container itself and the size of all blobs under the container.

The following describes how the storage capacity is calculated for Blob Containers and Blobs. In the below Len(X) means the number of characters in the string.

### Blob Containers

The following is how to estimate the amount of storage consumed per blob container:

`
48 bytes + Len(ContainerName) * 2 bytes +
For-Each Metadata[3 bytes + Len(MetadataName) + Len(Value)] +
For-Each Signed Identifier[512 bytes]
`

The following is the breakdown:
* 48 bytes of overhead for each container includes the Last Modified Time, Permissions, Public Settings, and some system metadata.
* The container name is stored as Unicode so take the number of characters and multiply by 2.
* For each blob container metadata stored, we store the length of the name (stored as ASCII), plus the length of the string value.
* The 512 bytes per Signed Identifier includes signed identifier name, start time, expiry time and permissions.

### Blobs

The following is how to estimate the amount of storage consumed per blob:

* Block Blob (base blob or snapshot)

`
124 bytes + Len(BlobName) * 2 bytes +
For-Each Metadata[3 bytes + Len(MetadataName) + Len(Value)] +
8 bytes + number of committed and uncommitted blocks * Block ID Size in bytes +
SizeInBytes(data in unique committed data blocks stored) +
SizeInBytes(data in uncommitted data blocks)
`

* Page Blob (base blob or snapshot)

`
124 bytes + Len(BlobName) * 2 bytes +
For-Each Metadata[3 bytes + Len(MetadataName) + Len(Value)] +
number of nonconsecutive page ranges with data * 12 bytes +
SizeInBytes(data in unique pages stored)
`

The following is the breakdown:

* 124 bytes of overhead for blob, which includes the Last Modified Time, Size, Cache-Control, Content-Type, Content-Language, Content-Encoding, Content-MD5, Permissions, Snapshot information, Lease, and some system metadata.
* The blob name is stored as Unicode so take the number of characters and multiple by 2.
* Then for each metadata stored, the length of the name (stored as ASCII), plus the length of the string value.
* Then for Block Blobs
    * 8 bytes for the block list
    * Number of blocks times the block ID size in bytes
    * Plus the size of the data in all of the committed and uncommitted blocks. Note, when snapshots are used, this size only includes the unique data for this base or snapshot blob. If the uncommitted blocks are not used after a week, they will be garbage collected, and then at that time they will no longer count towards billing after that.
* Then for Page Blobs
    * Number of nonconsecutive page ranges with data times 12 bytes. This is the number of unique page ranges you see when calling the GetPageRanges API.
    * Plus the size of the data in bytes of all of the stored pages. Note, when snapshots are used, this size only includes the unique pages for the base blob or snapshot blob being counted.

## Sample script

[!code-powershell[main](../../../powershell_scripts/storage/calculate-container-size/calculate-container-size-ex.ps1 "Calculate container size")]

## Next steps

For more information on Azure Storage Billing, see [Understanding Windows Azure Storage Billing](https://blogs.msdn.microsoft.com/windowsazurestorage/2010/07/08/understanding-windows-azure-storage-billing-bandwidth-transactions-and-capacity/).

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional storage PowerShell script samples can be found in [PowerShell samples for Azure Storage](../blobs/storage-samples-blobs-powershell.md).
