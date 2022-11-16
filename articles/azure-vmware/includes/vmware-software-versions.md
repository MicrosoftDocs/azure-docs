---
title: VMware software versions
description: Supported VMware software versions for Azure VMware Solution.
ms.topic: include
ms.service: azure-vmware
ms.date: 11/04/2022
author: suzizuber
ms.author: v-szuber
---

<!-- Used in faq.md and concepts-private-clouds-clusters#host-maintenance-and-lifecycle-management -->


The VMware solution software versions used in new deployments of Azure VMware Solution private cloud clusters are:

| Software                     |    Version   |
| :---                         |     :---:    |
| VMware vCenter Server        |    7.0 U3c   |
| ESXi                         |    7.0 U3c   |
| vSAN                         |    7.0 U3c   |
| vSAN on-disk format          |    10        |
| HCX                          |    4.4.2     |
| VMware NSX-T Data Center <br />**NOTE:** VMware NSX-T Data Center is the only supported version of NSX Data Center.               |      [[!INCLUDE [nsxt-version](nsxt-version.md)]](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/3.1/rn/VMware-NSX-T-Data-Center-312-Release-Notes.html)     |


The current running software version is applied to new clusters added to an existing private cloud. For more information, see the [VMware software version requirements for HCX](https://docs.vmware.com/en/VMware-HCX/4.4.2/rn/vmware-hcx-442-release-notes/index.html) and [Understanding vSAN on-disk format versions and compatibility](https://kb.vmware.com/s/article/2148493).

