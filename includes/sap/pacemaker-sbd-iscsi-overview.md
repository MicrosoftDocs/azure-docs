---
title: Pacemaker Cluster SBD with iSCSI Targets Overview
description: Include File for Pacemaker Cluster SBD with iSCSI Targets Overview
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 08/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---
## Using SBD with iSCSI targets
This solution requires you to host Internet Small Computer System Interface (iSCSI) targets on at least one additional virtual machine (VM).

:::image type="content" source="../../articles/sap/workloads/media/includes/high-availability-pacemaker-sbd-iscsi-diagram.png" alt-text="Diagram of iSCSI servers hosting iSCSI targets for SBD devices in a Pacemaker Cluster.":::

### Benefits
- These iSCSI host servers can host iSCSI targets for other Pacemaker clusters in the same region as well.
- If you're already using them on-premises, they don't require any changes to how you operate the Pacemaker cluster.

### Important considerations
- You must use three iSCSI host servers to have the highest level of resiliency for your cluster.
   - Using only one server introduces a single point of failure that prevents your cluster from fencing if it's down.
   - Pacemaker doesn't allow fencing if you only have two targets and one is down.
- iSCSI target host servers must reside in the same region as your clusters.
- Network routing between your clusters and iSCSI host servers must not traverse any non-redundant network devices (like a [Network Virtual Appliance][azblog-nva-bestpractices]).
   -  Maintenance events and other issues with network devices can negatively affect the stability and reliability of the overall cluster configuration.

[azblog-nva-bestpractices]: https://azure.microsoft.com/blog/best-practices-to-consider-before-deploying-a-network-virtual-appliance/?msockid=0d7b0a8194026e6002e31c6895b26faf


