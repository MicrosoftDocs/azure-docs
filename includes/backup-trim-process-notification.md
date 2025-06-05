---
author: AbhishekMallick-MS
ms.author: v-abhmallick
ms.date: 12/24/2024
ms.topic: include
ms.service: azure-backup
---

>[!Note]
>When the trim is performed within the guest OS, the tracking of incremental blocks is reset, resulting in a full backup. The trim within the guest OS releases unused blocks of the virtual disk (VHDX) and optimizes the disk size. However, this reduces the size of the VHDX and changes the SequenceNumber of the tracked incremental blocks, resulting in a full backup size. Unless the purpose is to improve the efficiency of storage on the Hyper-V host side, we recommend you  to stop the trim process within the guest to avoid an increase in backup size.