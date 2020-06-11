---
author: alkohli
ms.service: databox
ms.subservice: pod   
ms.topic: include
ms.date: 05/22/2019
ms.author: alkohli
---

Here is a list of the supported storage accounts and the storage types for the Data Box device. For a complete list of all different types of storage accounts and their full capabilities, see [Types of storage accounts](/azure/storage/common/storage-account-overview#types-of-storage-accounts).

| **Storage account / Supported storage types** | **Block blob** |**Page blob*** |**Azure files** |**Notes**|
| --- | --- | -- | -- | -- |
| Classic Standard | Y | Y | Y |
| General-purpose v1 Standard  | Y | Y | Y | Both hot and cool are supported.|
| General-purpose v1 Premium  |  | Y| | |
| General-purpose v2 Standard  | Y | Y | Y | Both hot and cool are supported.|
| General-purpose v2 Premium  |  |Y | | |
| Blob storage Standard |Y | | |Both hot and cool are supported. |

\* *- Data uploaded to page blobs must be 512 bytes aligned such as VHDs.*
