---
title: Set up vRealize Operations for Azure VMware Solution (AVS)
description:  
ms.topic: how-to
ms.date: 08/06/2020
---

# Set up vRealize Operations for Azure VMware Solution (AVS)

vRealize Operations Manager  is an operations management platform that allows VMware infrastructure administrators to monitor system resources. These system resources could be application-level or infrastructure level (both physical and virtual) objects. Historically, most VMware administrators have used vRealize Operations to monitor and manage the VMware private cloud components – vCenter, ESXi, NSX-T, vSAN, and Hybrid Cloud Extension (HCX).  Each AVS private cloud is provisioned with a dedicated vCenter, NSX-T, vSAN, and HCX deployment. 

Thoroughly review [Before you begin](#before-you-begin), [Software version requirements](#software-version-requirements), and [Prerequisites](#prerequisites) first. 

Then, we'll walk you through all the necessary procedures to:

> [!div class="checklist"]
> * Use vRealize Operations to monitor and manage the AVS private cloud resources
> * Deploy an instance of vRealize Operations on one of the vSphere clusters in the AVS private cloud

After completing the setup, you can follow the recommended next steps provided at the end of this article.  

## Before you begin
* Review the [vRealize Operations  product documentation](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-7FFC61A0-7562-465C-A0DC-46D092533984.html) to learn more deploying vRealize Operations. 
* Review the basic AVS Software Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Optionally, review the [vRealize Operations Remote Controller](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-263F9219-E801-4383-8A59-E84F3D01ED6B.html) product documentation for the on-premises vRealize Operations managing AVS deployment option. 


## Prerequisites
* ExpressRoute Global Reach should be configured between on-premises and AVS SDDC ExpressRoute circuits.
* An AVS private cloud has been deployed in Azure.


## Deployment option 1: On-premises vRealize Operations managing AVS



## Deployment option 2: vRealize Operations running on AVS



## Next steps



