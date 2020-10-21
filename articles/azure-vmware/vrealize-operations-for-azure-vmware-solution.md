---
title: Set up vRealize Operations for Azure VMware Solution
description: Learn how to set up vRealize Operations for your Azure VMware Solution private cloud. 
ms.topic: how-to
ms.date: 09/22/2020
---

# Set up vRealize Operations for Azure VMware Solution


vRealize Operations Manager is an operations management platform that allows VMware infrastructure administrators to monitor system resources. These system resources could be application-level or infrastructure level (both physical and virtual) objects. Historically, most VMware administrators have used vRealize Operations to monitor and manage the VMware private cloud components – vCenter, ESXi, NSX-T, vSAN, and Hybrid Cloud Extension (HCX). Each Azure VMware Solution private cloud is provisioned with a dedicated vCenter, NSX-T, vSAN, and HCX deployment. 

Thoroughly review [Before you begin](#before-you-begin) and [Prerequisites](#prerequisites) first. Then, we'll walk you through the two typical deployment topologies for vRealize Operations Manager with Azure VMware Solution:

> [!div class="checklist"]
> * [On-premises vRealize Operations managing Azure VMware Solution deployment](#on-premises-vrealize-operations-managing-azure-vmware-solution-deployment)
> * [vRealize Operations running on Azure VMware Solution deployment](#vrealize-operations-running-on-azure-vmware-solution-deployment)

## Before you begin
* Review the [vRealize Operations Manager product documentation](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-7FFC61A0-7562-465C-A0DC-46D092533984.html) to learn more deploying vRealize Operations. 
* Review the basic Azure VMware Solution Software Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Optionally, review the [vRealize Operations Remote Controller](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-263F9219-E801-4383-8A59-E84F3D01ED6B.html) product documentation for the on-premises vRealize Operations managing Azure VMware Solution deployment option. 



## Prerequisites
* VPN or Azure ExpressRoute should be configured between on-premises and Azure VMware Solution SDDC.
* An Azure VMware Solution private cloud has been deployed in Azure.



## On-premises vRealize Operations managing Azure VMware Solution deployment
Most customers have an existing on-premise deployment of vRealize Operations used to manage one or more on-premise vCenters domains. When customers provision a new Azure VMware Solution private cloud in Azure, they typically connect their on-premise environment with Azure VMware Solution using either an Azure ExpressRoute or using a Layer 3 VPN solution – as shown below.   

:::image type="content" source="media/vrealize-operations-manager/vrealize-operations-deployment-option-1.png" alt-text="On-premises vRealize Operations managing Azure VMware Solution deployment"  border="false":::

To extend the vRealize Operations capabilities to the Azure VMware Solution private cloud, you create an adapter [instance for the Azure VMware Solution private cloud resources](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.config.doc/GUID-640AD750-301E-4D36-8293-1BFEB67E2600.html) - to collect data from the Azure VMware Solution private cloud and bring it into on-premises vRealize Operations. The on-premises vRealize Operations Manager instance can directly connect to the vCenter and NSX-T manager on Azure VMware Solution or you can optionally deploy a vRealize Operations Remote Collector on the Azure VMware Solution private cloud. A vRealize Operations Remote Collector compresses and encrypts the data collected from the Azure VMware Solution private cloud before it's sent over the ExpressRoute or VPN network to the vRealize Operations Manager running on-premise. 

> [!TIP]
> Refer to the [VMware documentation](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-7FFC61A0-7562-465C-A0DC-46D092533984.html) for step-by-step guide for installing vRealize Operations Manager. 



## vRealize Operations running on Azure VMware Solution deployment

Another deployment option is to deploy an instance of vRealize Operations Manager on one of the vSphere clusters in the Azure VMware Solution private cloud – as shown below. 

:::image type="content" source="media/vrealize-operations-manager/vrealize-operations-deployment-option-2.png" alt-text="vRealize Operations running on Azure VMware Solution" border="false":::

After deploying the Azure VMware Solution instance of vRealize Operations you can configure vRealize Operations to collect data from vCenter, ESXi, NSX-T, vSAN, and HCX. 

> [!TIP]
> Refer to the [VMware documentation](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-7FFC61A0-7562-465C-A0DC-46D092533984.html) for step-by-step guide for installing vRealize Operations Manager.


## Known limitations

- The **cloudadmin@vsphere.local** user in Azure VMware Solution has [limited privileges](concepts-role-based-access-control.md). In-guest memory collection using VMware tools is not supported with virtual machines (VMs) on Azure VMware Solution. Active and consumed memory utilizations continue to work in this case.
- Workload optimization for host-based business intent does not work because Azure VMware Solutions manage cluster configurations, including DRS settings.
- Workload optimization for the cross cluster placement within the SDDC using the cluster-based business intent is fully supported with vRealize Operations Manager 8.0  and onwards. However, workload optimization is not aware of resource pools and places the virtual machines at the cluster level. A user can manually correct this in the Azure VMware Solution vCenter Server interface.
- You cannot sign in to vRealize Operations Manager using your Azure VMware Solution vCenter Server credentials. 
- Azure VMware Solution does not support the vRealize Operations Manager plugin.

When connecting the Azure VMware Solution vCenter to vRealize Operations Manager using a vCenter Server Cloud Account, you'll encounter the following warning:

:::image type="content" source="./media/vrealize-operations-manager/warning-adapter-instance-creation-succeeded.png" alt-text="Warning adapter instance creation succeeded":::

The warning occurs because the **cloudadmin@vsphere.local** user in Azure VMware Solution doesn't have sufficient privileges to do all vCenter Server actions required for registration. However, the privileges are sufficient for the adapter instance to do data collection, as seen below:

:::image type="content" source="./media/vrealize-operations-manager/adapter-instance-to-perform-data-collection.png" alt-text="Adapter instance to perform data collection":::

For more information, see [Privileges Required for Configuring a vCenter Adapter Instance](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.core.doc/GUID-3BFFC92A-9902-4CF2-945E-EA453733B426.html).

<!-- LINKS - external -->


<!-- LINKS - internal -->




