---
title: Disk pool planning note for virtual networks
description: Information about the importance of deploying a virtual network closer to Azure VMware Solution hosts.
ms.topic: include
ms.service: azure-vmware
ms.date: 1/03/2024
author: suzizuber
ms.author: v-szuber
ms.custom: engagement-fy23

# used in: 
# articles\azure-vmware\attach-disk-pools-to-azure-vmware-solution.md
# articles\azure-vmware\tutorial-network-checklist.md
# articles\azure-vmware\includes\production-ready-deployment-steps.md 
---


If you plan to scale your Azure VMware Solution hosts by using [Azure NetApp Files datastores](../attach-azure-netapp-files-to-azure-vmware-solution-hosts.md), deploying the virtual network close to your hosts with an ExpressRoute virtual network gateway is crucial. The closer the storage is to your hosts, the better the performance.
