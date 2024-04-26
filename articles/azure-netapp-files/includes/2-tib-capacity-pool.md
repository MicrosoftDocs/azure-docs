---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 03/20/2024
ms.author: anfdocs

# azure-netapp-files-resource-limits.md
# azure-netapp-files-set-up-capacity-pool.md
# azure-netapp-files-resize-capacity-pools-or-volumes.md
---

You can only take advantage of the 1-TiB minimum if all the volumes in the capacity pool are using Standard network features. 1-TiB capacity pools are generally available. You must register the feature before using it. If any volume is using Basic network features, the minimum size is 4 TiB.

