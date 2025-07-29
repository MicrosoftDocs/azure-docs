---
title: VMware Solution software versions
description: Supported software versions that are used for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 7/29/2025
author: ju-shim
ms.author: jushiman
ms.custom: engagement-fy23
# Customer intent: As a cloud architect, I want to access the supported software version details for Azure VMware Solution, so that I can ensure compatibility and optimize configurations for new deployments in our private cloud environment.
---

<!-- Used in faq.md and concepts-private-clouds-clusters#host-maintenance-and-lifecycle-management and introduction#vmware-software-versions-->

The following table lists the software versions that are used in new deployments of Azure VMware Solution private clouds.

| Software                         |    Version   |    Build number   |
| :---                             |     :---:    |     :---:         |
| VMware vCenter Server            |    [8.0 U3e](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/release-notes/vcenter-server-update-and-patch-release-notes/vsphere-vcenter-server-80u3e-release-notes.html) | 24674346 |
| VMware ESXi                      |    [8.0 U3f + Hot Patch (VAIO bug fix)](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/release-notes/esxi-update-and-patch-release-notes/vsphere-esxi-80u3f-release-notes.html) | 24797835 |
| VMware vSAN                      |    [8.0 U3](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/release-notes/vmware-vsan-803-release-notes.html) | 24797835 |
| VMware vSAN Witness              |    [8.0 U3](https://techdocs.broadcom.com/us/en/vmware-cis/vsan/vsan/8-0/release-notes/vmware-vsan-803-release-notes.html) | 24797835 |
| VMware vSAN on-disk format       |    [20](https://knowledge.broadcom.com/external/article?legacyId=2148493) | N/A |
| VMware vSAN storage architecture |    [Gen 1: OSA, Gen2: ESA](https://blogs.vmware.com/cloud-foundation/2022/08/31/comparing-the-original-storage-architecture-to-the-vsan-8-express-storage-architecture/) | N/A |
| VMware NSX                       |    [!INCLUDE [nsxt-version](nsxt-version.md)] | 22224317 |
| VMware HCX                       |    [4.11](https://techdocs.broadcom.com/us/en/vmware-cis/hcx/vmware-hcx/4-11/hcx-4-11-release-notes/vmware-hcx-411-release-notes.html) | 24457395 |
| VMware Site Recovery Manager     |    [8.8.0.3](https://techdocs.broadcom.com/us/en/vmware-cis/live-recovery/site-recovery-manager/8-8/release-notes/vmware-site-recovery-manager-8803-release-notes.html) | 23263429 |
| VMware vSphere Replication       |    [8.8.0.3](https://techdocs.broadcom.com/us/en/vmware-cis/live-recovery/vsphere-replication/8-8/release-notes/vsphere-replication-8803-release-notes.html) | 23166649 |

If the listed build number doesn't match the build number listed in the release notes, it's because a custom patch was applied for cloud providers.

The current running software version is applied to new clusters that are added to an existing private cloud, if the vCenter Server version supports it.
