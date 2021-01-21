---
title: VMware software versions
description: Supported VMware software versions for Azure VMware Solution.
ms.topic: include
ms.date: 12/29/2020
---

<!-- Used in faq.md and concepts-private-clouds-clusters.md -->


The current software versions of the VMware software used in Azure VMware Solution private cloud clusters are:

| Software              |    Version   |
| :---                  |     :---:    |
| VCSA / vSphere / ESXi |    6.7 U3    | 
| ESXi                  |    6.7 U3    | 
| vSAN                  |    6.7 U3    |
| NSX-T                 |      2.5     |


>[!NOTE]
>NSX-T is the only supported version of NSX.

For any new cluster in a private cloud, the software version matches what's currently running. For any new private cloud in a subscription, the software stack's latest version gets installed. For more information, see the [VMware software version requirements](https://docs.vmware.com/en/VMware-HCX/services/user-guide/GUID-54E5293B-8707-4D29-BFE8-EE63539CC49B.html).

The private cloud software bundle upgrades keep the software within one version of the most recent software bundle release from VMware. The private cloud software versions may differ from the most recent versions of the individual software components (ESXi, NSX-T, vCenter, vSAN). You can find the general upgrade policies and processes for the Azure VMware Solution platform software described in [Private cloud updates and upgrades](../concepts-upgrades.md).

