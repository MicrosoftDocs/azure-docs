---
title: Usage metrics for Azure NetApp Files | Microsoft Docs
description: Describes usage metrics for Azure NetApp Files capacity pools and volumes. 
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
ms.topic: concepts
ms.date: 02/15/2019
ms.author: b-juche
---
# Usage metrics for Azure NetApp Files

Azure NetApp Files displays size information for various objects. Understanding the associated usage metrics helps you monitor and optimize your Azure NetApp Files subscription.  

## <a name="capacity_pools"></a>For capacity pools

- *Volume pool allocated size*  
    This is the size (GiB) of the provisioned capacity pool.  
- *Volume pool allocated used*  
    This is the total of volume quota (GiB) in a given capacity pool (that is, the total of the volumes' provisioned sizes in the capacity pool). This is the size you selected during volume creation.  
- *Volume pool total logical size*  
    This is the total of logical space (GiB) used across volumes in a capacity pool.  
- *Volume pool total snapshot size*  
    This is the total of incremental logical space used by the snapshots.  

## <a name="volumes"></a>For volumes

- *Volume allocated size*   
    This is the volume size (quota) provisioned in GiB.  
- *Volume logical size*   
    This is the total logical space used in a volume (GiB). 
    This size includes logical space used by active file systems and snapshots.  
- *Volume snapshot size*   
    This is the incremental logical space used by snapshots in a volume.  

## Next steps

* [Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
* [Create a volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
