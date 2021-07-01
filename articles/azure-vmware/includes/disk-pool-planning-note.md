---
title: Disk pool planning note for vNet
description: Important note about the importance of deploying a vNet closer to Azure VMware Solution hosts.
ms.topic: include
ms.date: 07/14/2021
---

<!-- Used in attach-disk-pools-to-azure-vmware-solution.md and tutorial-network-checklist.md -->

>[!IMPORTANT]
>If you plan to scale your Azure VMware Solution hosts using disk pools, it's crucial to deploy a vNet close to the hosts with an ExpressRoute Gateway.  The closer the storage is to your hosts, the better the performance.