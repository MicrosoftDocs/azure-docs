---
title: Metrics for Azure NetApp Files | Microsoft Docs
description: Describes metrics for Azure NetApp Files.
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/17/2020
ms.author: b-juche
---
# Metrics for Azure NetApp Files

Azure NetApp Files provides metrics on allocated storage, actual storage usage, volume IOPS, and latency. By analyzing these metrics, you can gain a better understanding on the usage pattern and volume performance of your NetApp accounts.  

## <a name="capacity_pools"></a>Usage metrics for capacity pools

<!-- 
- *Pool Provisioned Size*  
    The logical space (GiB) the capacity pool is provisioned with.  
    This size is the size you selected during capacity pool creation. 
--> 
- *Pool Allocated to Volume Size*  
    The total of volume quota (GiB) in a given capacity pool (that is, the total of the volumes' provisioned sizes in the capacity pool).  
    This size is the size you selected during volume creation.  
- *Pool Consumed Size*  
    The total of logical space (GiB) used across volumes in a capacity pool.  
<!-- 
- *Pool Consumed Snapshot Size*  
    The total of logical space (GiB) used by snapshots across all volumes in a capacity pool. 
-->

## <a name="volumes"></a>Usage metrics for volumes

<!--
- *Volume Quota Size*    
    The quota size (GiB) the volume is provisioned with.   
    This size is the size you selected during capacity pool creation. 
-->
- *Volume Consumed Size*   
    The total logical space used in a volume (GiB).  
    This size includes logical space used by active file systems and snapshots.  
- *Volume Snapshot Size*   
   The incremental logical space used by snapshots in a volume.  

## Performance metrics for volumes

- *AverageReadLatency*   
    The average time for reads from the volume in milliseconds.
- *AverageWriteLatency*   
    The average time for writes from the volume in milliseconds.
- *ReadIops*   
    The number of reads to the volume per second.
- *WriteIops*   
    The number of writes to the volume per second.

## Next steps

* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
