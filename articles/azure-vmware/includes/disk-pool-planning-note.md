---
title: Disk pool planning note for vNet
description: Important note about the importance of deploying a vNet closer to Azure VMware Solution hosts.
ms.topic: include
ms.date: 07/14/2021

# used in: 
# articles\azure-vmware\attach-disk-pools-to-azure-vmware-solution.md
# articles\azure-vmware\tutorial-network-checklist.md
# articles\azure-vmware\includes\production-ready-deployment-steps.md 
---


If you plan to scale your Azure VMware Solution hosts using [Azure disk pools](../../virtual-machines/disks-pools.md), it's crucial to deploy the vNet close to your hosts with an ExpressRoute virtual network gateway.  The closer the storage is to your hosts, the better the performance.