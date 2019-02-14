---
title: Resource limits for Azure NetApp Files | Microsoft Docs
description: Describes limits for Azure NetApp Files resources, including limits for capacity pools, volumes, and the delegated subnet.
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
ms.topic: reference
ms.date: 01/03/2019
ms.author: b-juche
---
# Resource limits for Azure NetApp Files
Understanding resource limits for Azure NetApp Files helps you manage your volumes.

## <a name="capacity_pools"></a>Capacity pools

- The minimum size for a single capacity pool is 4 TiB, and the maximum size is 500 TiB. 
- Each capacity pool can belong to only one NetApp account. However, you can have multiple capacity pools within a NetApp account.  

## <a name="volumes"></a>Volumes

- The minimum size for a single volume is 100 GiB, and the maximum size is 92 TiB.
- You can have a maximum of 100 volumes per Azure subscription per region.  

## <a name="delegated_subnet"></a>Delegated subnet 

In each Azure Virtual Network (Vnet), only one subnet can be delegated to Azure NetApp Files.

## Next steps

[Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
