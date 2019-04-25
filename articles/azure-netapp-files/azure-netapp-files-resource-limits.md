---
title: Resource limits for Azure NetApp Files | Microsoft Docs
description: Describes limits for Azure NetApp Files resources, including limits for NetApp accounts, capacity pools, volumes, snapshots, and the delegated subnet.
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
ms.date: 02/14/2019
ms.author: b-juche
---
# Resource limits for Azure NetApp Files

Understanding resource limits for Azure NetApp Files helps you manage your volumes.

- Each Azure subscription can have a maximum of 10 NetApp accounts.
- Each NetApp account can have a maximum of 25 capacity pools.
- Each capacity pool can belong to only one NetApp account.  
- The minimum size for a single capacity pool is 4 TiB, and the maximum size is 500 TiB. 
- Each capacity pool can have a maximum of 500 volumes.
- The minimum size for a single volume is 100 GiB, and the maximum size is 92 TiB.
- Each volume can have a maximum of 255 snapshots.
- Each Azure Virtual Network (Vnet) can have only one subnet delegated to Azure NetApp Files.

**Next steps**

[Understand the storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
