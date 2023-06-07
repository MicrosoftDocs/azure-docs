---
title: VMware software versions
description: Supported VMware software versions for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 5/6/2023
author: suzizuber
ms.author: v-szuber
---

<!-- Used in faq.md and concepts-private-clouds-clusters#host-maintenance-and-lifecycle-management and introduction#vmware-software-versions-->


The VMware solution software versions used in new deployments of Azure VMware Solution private cloud clusters are:

| Software                     |    Version   |
| :---                         |     :---:    |
| VMware vCenter Server        |    [7.0 U3k](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-vcenter-server-70u3k-release-notes.html)   |
| VMware ESXi                  |    [7.0 U3k](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vsphere-esxi-70u3k-release-notes.html)   |
| VMware vSAN                  |    [7.0 U3](https://docs.vmware.com/en/VMware-vSphere/7.0/rn/vmware-vsan-703-release-notes.html)   |
| VMware vSAN on-disk format   |    [15](https://kb.vmware.com/s/article/2148493)        |
| VMware HCX                   |    [4.5.2](https://docs.vmware.com/en/VMware-HCX/4.5/rn/vmware-hcx-45-release-notes/index.html)     |
| VMware NSX-T Data Center <br />**NOTE:** VMware NSX-T Data Center Advanced is the only supported version of NSX Data Center.                     |    [!INCLUDE [nsxt-version](nsxt-version.md)]   |

The current running software version is applied to new clusters added to an existing private cloud.
