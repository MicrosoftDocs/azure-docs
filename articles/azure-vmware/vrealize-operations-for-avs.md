---
title: Set up vRealize Operations for Azure VMware Solution (AVS)
description:  
ms.topic: how-to
ms.date: 08/04/2020
---

# Set up vRealize Operations for Azure VMware Solution (AVS)

vRealize Operations Manager is an operations management platform that allows VMware infrastructure administrators to monitor system resources. These system resources could be application-level or infrastructure level (both physical and virtual) objects. Historically, most VMware administrators have used vRealize Operations to monitor and manage the VMware private cloud components – vCenter, ESXi, NSX-T, vSAN, and Hybrid Cloud Extension (HCX). 

Each AVS private cloud is provisioned with a dedicated vCenter, NSX-T, vSAN, and HCX deployment. For customers looking to use vRealize Operations to monitor the AVS private cloud resources, we describe below the commonly used deployment options.


## Before you begin
* Review the [vRealize Operations product documentation](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/vrealize-operations-manager-81-vapp-deploy-guide.pdf) to learn more. 
* Review the basic AVS Software Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Optionally, review the [vRealize Operations Remote Controller](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.core.doc/GUID-7F1F910F-AFB9-493C-9CBF-DEFFF5E9BB69.html) product documentation for the on-premises vRealize Operations managing AVS deployment option. 



## Software version requirements
| Component type | Source environment requirements |
| --- | --- |
| vRealize Operations Manager |    |
| vCenter Server |   |
| ESXi |   |
| NSX-T |   |



## Prerequisites
* ExpressRoute Global Reach should be configured between on-premises and AVS SDDC ExpressRoute circuits.
* An AVS private cloud has been deployed in Azure.


## Deployment option 1: On-premises vRealize Operations managing AVS



## Deployment option 2: vRealize Operations running on AVS



## Next steps



