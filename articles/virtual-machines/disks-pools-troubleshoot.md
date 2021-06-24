---
title: Troubleshoot Azure disk pools
description: Learn how to approach an Azure disk pool.
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 06/23/2021
ms.author: rogarana
ms.subservice: disks
---

# Troubleshoot Azure disk pools


## What happens to my AVS cluster if the disk pool is suddenly unavailable over the iSCSI endpoint

All datastores associated to the disk pool become inaccessible.  

All VMs hosted on AVS environment with data stored on the impacted datastores will be in an unhealthy state 

Open: What is the exact state of the VM? 

Open: Confirm on whether the VM is impacted if there is no outstanding traffic to the data store 

The health of the AVS cluster is not impacted with the exception on placing a host to maintenance mode. When you attempt to place a host into maintenance mode when any connected datastores are inaccessible, you can still successfully migrate VMs that do not have data stored on the inaccessible datastore of this host. For VMs with data stored on the inaccessible datastore, migration will fail. You need to follow the instruction here for mitigation. 

### Does AVS cluster recover automatically when the disk pool iSCSI endpoint becomes available? 

Yes, only if the disk pool is recovered within X hours. If the iSCSI endpoint of the disk pool is not recovered within X hours, AVS cluster will not automatically recover. You need to disconnect the disk pool and reconnect back.

