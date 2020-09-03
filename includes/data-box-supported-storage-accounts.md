---
author: alkohli
ms.service: databox
ms.subservice: pod   
ms.topic: include
ms.date: 06/08/2020
ms.author: alkohli
---

Here is a list of the supported storage accounts and the storage types for the Data Box device. For a complete list of all different types of storage accounts and their full capabilities, see [Types of storage accounts](/azure/storage/common/storage-account-overview#types-of-storage-accounts).

For import orders, following table shows the supported storage accounts.

| **Storage account / Supported storage types** | **Block blob** |**Page blob*** |**Azure files** |**Notes**|
| --- | --- | -- | -- | -- |
| Classic Standard | Y | Y | Y |
| General-purpose v1 Standard  | Y | Y | Y | Both hot and cool are supported.|
| General-purpose v1 Premium  |  | Y| | |
| General-purpose v2 Standard  | Y | Y | Y | Both hot and cool are supported.|
| General-purpose v2 Premium  |  |Y | | |
| Blob storage Standard |Y | | |Both hot and cool are supported. |

\* *- Data uploaded to page blobs must be 512 bytes aligned such as VHDs.*

For export orders, following table shows the supported storage accounts.

| **Storage account / Supported storage types** | **Block blob** |**Page blob*** |**Azure files** |**Supported access tiers**|
| --- | --- | -- | -- | -- |
| Classic Standard | Y | Y | Y | |
| General-purpose v1 Standard  | Y | Y | Y | Hot, Cool|
| General-purpose v1 Premium  |  | Y| | |
| General-purpose v2 Standard  | Y | Y | Y | Hot, Cool|
| General-purpose v2 Premium  |  |Y | | |
| Blob storage Standard |Y | | |Hot, Cool |
| Block Blob storage Premium |Y | | |Hot, Cool |
| Page Blob storage Premium | |Y | | |

> [!IMPORTANT]
> - For General-purpose accounts, Data Box does not support Queue, Table, Disk, and Azure Data Lake Gen 2 storage types.
> - Data Box does not support append blobs for Blob Storage and Block Blob Storage accounts.
> - Data Box does not support Premium File Storage accounts.
> - Data uploaded to page blobs must be 512 bytes aligned such as VHDs.
> - A maximum of 80 TB can be exported.
> - File history and blob snapshots are not exported.


