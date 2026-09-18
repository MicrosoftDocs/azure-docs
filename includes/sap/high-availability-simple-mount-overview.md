---
title: HA Cluster Overview
description: Include File for HA Cluster Overview
services: 
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: include
ms.date: 06/01/2026
author: zamasiel-msft
ms.author: zamasiel
manager: radeltch
---

This article describes how to deploy and configure Azure virtual machines (VMs), install the cluster framework, and install a high-availability (HA) SAP NetWeaver system with a simple mount structure. You can implement the presented architecture by using one of the Azure native Network File System (NFS) services selectable above.

This article describes a high-availability configuration for ASCS with a simple mount structure. To deploy the SAP application layer, you need shared directories like `/sapmnt/SID`, `/usr/sap/SID`, and `/usr/sap/trans`, which are highly available. 

You still need a Pacemaker cluster to help protect single-point-of-failure components like SAP Central Services (SCS) and ASCS.

Compared to the classic Pacemaker cluster configuration, with the simple mount deployment, the cluster doesn't manage the file systems.

This article doesn't cover the database layer.

The example configurations and installation commands use the following instance numbers and server names.

| Instance name                       | Instance number |
| ----------------------------------- | --------------- |
| ASCS                                | 00              |
| Enqueue Replication Server (ERS)    | 01              |
| Primary Application Server (PAS)    | 02              |
| Additional Application Server (AAS) | 03              |
| SAP system identifier               | NW1             |

:::image type="complex" source="../../articles/sap/workloads/media/includes/high-availability-simplemount-overview/high-availability-guide-nfs-simple-mount.png" alt-text="A diagram that shows SAP NetWeaver high availability with simple mount and NFS.":::
This diagram shows a typical SAP NetWeaver HA architecture with a simple mount. The `sapmnt` and `saptrans` file systems are deployed on Azure native NFS, NFS shares on Azure Files, or NFS volumes on Azure NetApp Files. A Pacemaker cluster protects the SAP central services. The clustered VMs are behind an Azure load balancer. The Pacemaker cluster doesn't manage the file systems, in contrast to the classic Pacemaker configuration.
:::image-end:::
