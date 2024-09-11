---
title: VMware solution software versions
description: Supported VMware solution software versions for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 8/20/2024
author: suzizuber
ms.author: v-suzuber
ms.custom: engagement-fy23
---

<!-- Used in faq.md and concepts-private-clouds-clusters#host-maintenance-and-lifecycle-management and introduction#vmware-software-versions-->

The VMware solution software versions used in new deployments of Azure VMware Solution private clouds are:

| Software                         |    Version   |
| :---                             |     :---:    |
| VMware vCenter Server            |    [8.0 U2b](https://docs.vmware.com/en/VMware-vSphere/8.0/rn/vsphere-vcenter-server-80u2b-release-notes/index.html)   |
| VMware ESXi                      |    [8.0 U2b](https://docs.vmware.com/en/VMware-vSphere/8.0/rn/vsphere-esxi-80u2b-release-notes/index.html)  |
| VMware vSAN                      |    [8.0 U2](https://docs.vmware.com/en/VMware-vSphere/8.0/rn/vmware-vsan-802-release-notes/index.html)   |
| VMware vSAN on-disk format       |    [19](https://kb.vmware.com/s/article/2148493)   |
| VMware vSAN storage architecture |    [OSA](https://core.vmware.com/blog/comparing-original-storage-architecture-vsan-8-express-storage-architecture)   |
| VMware NSX                       |    [!INCLUDE [nsxt-version](nsxt-version.md)]   |
| VMware HCX                       |    [4.8.2](https://docs.vmware.com/en/VMware-HCX/4.8.2/rn/vmware-hcx-482-release-notes/index.html)   |
| VMware Site Recovery Manager     |    [8.8.0.3](https://docs.vmware.com/en/Site-Recovery-Manager/8.8/rn/vmware-site-recovery-manager-8803-release-notes/index.html)   |
| VMware vSphere Replication       |    [8.8.0.3](https://docs.vmware.com/en/vSphere-Replication/8.8/rn/vsphere-replication-8803-release-notes/index.html)   |

The current running software version is applied to new clusters added to an existing private cloud, if the vCenter Server version supports it.
