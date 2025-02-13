---
title: VMware solution software versions
description: Supported VMware solution software versions for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 1/27/2025
author: suzizuber
ms.author: v-suzuber
ms.custom: engagement-fy23
---

<!-- Used in faq.md and concepts-private-clouds-clusters#host-maintenance-and-lifecycle-management and introduction#vmware-software-versions-->

The VMware solution software versions used in new deployments of Azure VMware Solution private clouds are:

| Software                         |    Version   |    Build number   |
| :---                             |     :---:    |     :---:         |
| VMware vCenter Server            |    [8.0 U2d](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/release-notes/vcenter-server-update-and-patch-release-notes/vsphere-vcenter-server-80u2d-release-notes.html)   | 23929136 |
| VMware ESXi                      |    [8.0 U2b](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/release-notes/esxi-update-and-patch-release-notes/vsphere-esxi-80u2b-release-notes.html)  | 23305546 |
| VMware vSAN                      |    [8.0 U2](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/release-notes/vmware-vsan-802-release-notes.html)   | 23305546 |
| VMware vSAN Witness              |    [8.0 U2](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/release-notes/vmware-vsan-802-release-notes.html)   | 23305546 |
| VMware vSAN on-disk format       |    [19](https://knowledge.broadcom.com/external/article?legacyId=2148493)   | N/A |
| VMware vSAN storage architecture |    [OSA](https://blogs.vmware.com/cloud-foundation/2022/08/31/comparing-the-original-storage-architecture-to-the-vsan-8-express-storage-architecture/)   | N/A |
| VMware NSX                       |    [!INCLUDE [nsxt-version](nsxt-version.md)]   | 22224317 |
| VMware HCX                       |    [4.9.1](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-9/hcx-4-9-release-notes/Chunk701473140.html#Chunk701473140)   | 23857539 |
| VMware Site Recovery Manager     |    [8.8.0.3](https://techdocs.broadcom.com/us/en/vmware-cis/live-recovery/site-recovery-manager/8-8/release-notes/vmware-site-recovery-manager-8803-release-notes.html)   | 23263429 |
| VMware vSphere Replication       |    [8.8.0.3](https://techdocs.broadcom.com/us/en/vmware-cis/live-recovery/vsphere-replication/8-8/release-notes/vsphere-replication-8803-release-notes.html)   | 23166649 |

If the listed build number does not match the build number listed in the release notes, it will be due to a custom patch applied for cloud providers.

The current running software version is applied to new clusters added to an existing private cloud, if the vCenter Server version supports it.
