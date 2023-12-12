---
title: include file
description: include file
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: include
ms.date: 11/27/2023
ms.author: anfdocs
ms.custom: include file

# azure-netapp-files-resource-limits.md
# azure-netapp-files-set-up-capacity-pool.md
# azure-netapp-files-resize-capacity-pools-or-volumes.md
---

1-TiB capacity pool sizing is currently in preview. You can only take advantage of the 1-TiB minimum if all the volumes in the capacity pool are using Standard network features. The generally available minimum size for capacity pools with all volumes using Standard network features is 2 TiB. If any volume is using Basic network features, the minimum size is 4 TiB.

To use the 1-TiB minimum, you must first [register for the preview](../azure-netapp-files-set-up-capacity-pool.md#before-you-begin). 
