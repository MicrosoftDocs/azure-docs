---
title: VMware software versions
description: Supported VMware software versions for Azure VMware Solution.
ms.topic: include
ms.date: 03/31/2021
---

<!-- Used in faq.md, concepts-upgrades.md, and concepts-private-clouds-clusters.md -->


The VMware software versions used in new deployments of Azure VMware Solution  private clouds clusters are:

| Software              |    Version   |
| :---                  |     :---:    |
| VCSA / vSphere / ESXi |    6.7 U3l    | 
| ESXi                  |    6.7 U3l    | 
| vSAN                  |    6.7 U3l    |
| NSX-T <br />**NOTE:** NSX-T is the only supported version of NSX.               |      3.1.1     |


New clusters added to an existing private cloud, the currently running software version is applied. For more information, see the [VMware software version requirements](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-54E5293B-8707-4D29-BFE8-EE63539CC49B.html).

The private cloud software bundle upgrades keep the software within one version of the most recent software bundle release from VMware. The private cloud software versions may differ from the most recent versions of the individual software components (ESXi, NSX-T, vCenter, vSAN). You can find the general upgrade policies and processes for the Azure VMware Solution platform software described in [Private cloud updates and upgrades](../concepts-upgrades.md).

