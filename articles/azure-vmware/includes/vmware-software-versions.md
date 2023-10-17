---
title: VMware solution software versions
description: Supported VMware solution software versions for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 10/10/2023
author: suzizuber
ms.author: v-szuber
---

<!-- Used in faq.md and concepts-private-clouds-clusters#host-maintenance-and-lifecycle-management and introduction#vmware-software-versions-->


The VMware solution software versions used in new deployments of Azure VMware Solution private clouds are:

| Software                         |    Version   |
| :---                             |     :---:    |
| VMware vCenter Server            |    [7.0 U3k](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3k-release-notes.html)   |
| VMware ESXi                      |    [7.0 U3k](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-esxi-70u3k-release-notes.html)   |
| VMware vSAN                      |    [7.0 U3](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vmware-vsan-703-release-notes.html)   |
| VMware vSAN on-disk format       |    [15](https://kb.vmware.com/s/article/2148493)   |
| VMware vSAN storage architecture |    [OSA](https://core.vmware.com/blog/comparing-original-storage-architecture-vsan-8-express-storage-architecture)   |
| VMware NSX-T Data Center <br />**NOTE:** VMware NSX-T Data Center Advanced is the only supported version of NSX Data Center.   |    [!INCLUDE [nsxt-version](nsxt-version.md)]   |
| VMware HCX                       |    [4.6.3](https://docs.vmware.com/en/VMware-HCX/4.6.3/rn/vmware-hcx-463-release-notes/index.html)   |
| VMware Site Recovery Manager     |    [8.7.0.3](https://docs.vmware.com/en/Site-Recovery-Manager/8.7/rn/vmware-site-recovery-manager-8703-release-notes/index.html)   |
| VMware vSphere Replication       |    [8.7.0.3](https://docs.vmware.com/en/vSphere-Replication/8.7/rn/vsphere-replication-8703-release-notes/index.html)   |

The current running software version is applied to new clusters added to an existing private cloud.
