---
title: Move an Azure disk pool
description: Learn how to manage an Azure disk pool.
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 06/02/2021
ms.author: rogarana
ms.subservice: disks
---

# Move a disk pool to a different subscription

Moving a disk pool involves moving the disk pool itself, the disks contained in the disk pool, the disk pool's managed resource group, and all the resources contained in the managed resource group. Currently, Azure doesn't support moving multiple resource groups to another subscription at once. 

1. Export the template of your existing disk pool.
1. Delete the old disk pool.
1. Move the Azure resources necessary to create a disk pool.
1. Redeploy the disk pool.