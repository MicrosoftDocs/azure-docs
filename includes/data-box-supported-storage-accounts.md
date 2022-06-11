---
author: alkohli
ms.service: databox
ms.subservice: pod   
ms.topic: include
ms.date: 10/07/2021
ms.author: alkohli
---

Here is a list of the supported storage accounts and storage types for a Data Box device. For a complete list of all capabilities for all types of storage accounts, see [Types of storage accounts](../articles/storage/common/storage-account-overview.md#types-of-storage-accounts).

#### Supported storage accounts for imports

For import orders, following table shows the supported storage accounts.

| **Storage account / Supported storage types** | **Block blob** |**Page blob**<sup>1</sup> |**Azure files** |**Supported access tiers**|
| --- | --- | -- | -- | -- |
| Classic Standard | Y | Y | Y |
| General-purpose v1 Standard  | Y | Y | Y | Hot, Cool |
| General-purpose v1 Premium  |  | Y| | |
| General-purpose v2 Standard<sup>2</sup>  | Y | Y | Y | Hot, Cool|
| General-purpose v2 Premium  |  |Y | |  |
| Azure Premium FileStorage |  |  | Y |  |  
| Blob storage Standard | Y | | | Hot, Cool |


<sup>1</sup> *Data uploaded to page blobs must be 512 bytes aligned such as VHDs.*

<sup>2</sup> *Azure Data Lake Storage Gen2 (ADLS Gen2) is supported for imports but not for exports.*


#### Supported storage accounts for exports

For export orders, following table shows the supported storage accounts.

| **Storage account / Supported storage types** | **Block blob** |**Page blob*** |**Azure files** |**Supported access tiers**|
| --- | --- | -- | -- | -- |
| Classic Standard | Y | Y | Y | |
| General-purpose v1 Standard  | Y | Y | Y | Hot, Cool |
| General-purpose v1 Premium  |  | Y| | |
| General-purpose v2 Standard  | Y | Y | Y | Hot, Cool |
| General-purpose v2 Premium  |  |Y | | |
| Azure Premium FileStorage |  |  | Y |  |
| Blob storage Standard |Y | | | Hot, Cool |
| Block Blob storage Premium |Y | | | Hot, Cool |
| Page Blob storage Premium | |Y | | |

#### Caveats for storage accounts

- For General-purpose accounts:
  - For import orders, Data Box does not support Queue, Table, and Disk storage types.
  - For export orders, Data Box does not support Queue, Table, Disk, and Azure Data Lake Gen2 storage types.
- Data Box does not support append blobs for Blob Storage and Block Blob Storage accounts.
- Network File System (NFS) 3.0 protocol support in Azure Blob storage is not supported with Data Box.
- Data uploaded to page blobs must be 512 bytes aligned such as VHDs.
- For exports:
  - A maximum of 80 TB can be exported.
  - File history and blob snapshots are not exported.
  - Archive blobs are not supported for export. Rehydrate the blobs in archive tier before you export. For more information, see [Rehydrate an archived blob to an online tier](../articles/storage/blobs/archive-rehydrate-overview.md).