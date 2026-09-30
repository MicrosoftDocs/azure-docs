---
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 05/20/2024
ms.author: anfdocs

# azure-netapp-files-resource-limits.md
# azure-netapp-files-set-up-capacity-pool.md
# azure-netapp-files-resize-capacity-pools-or-volumes.md
# Customer intent: "As a cloud administrator, I want to understand the capacity pool size requirements based on network features, so that I can optimize resource allocation and ensure efficient storage management."
---

You can only take advantage of the 1-TiB minimum if all the volumes in the capacity pool are using Standard network features. 1-TiB capacity pools are generally available. If any volume is using Basic network features, the minimum size is 4 TiB.

