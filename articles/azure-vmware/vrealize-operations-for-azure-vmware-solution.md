---
title: Configure vRealize Operations for Azure VMware Solution
description: Learn how to set up vRealize Operations for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 11/18/2022
---

# Configure vRealize Operations for Azure VMware Solution

vRealize Operations is an operations management platform that allows VMware infrastructure administrators to monitor system resources. These system resources could be application-level or infrastructure level (both physical and virtual) objects. Most VMware administrators have used vRealize Operations to monitor and manage the VMware private cloud components – vCenter Server, ESXi, NSX-T Data Center, vSAN, and VMware HCX. Each provisioned Azure VMware Solution private cloud includes a dedicated vCenter Server, NSX-T Data Center, vSAN, and HCX deployment.

Thoroughly review [Before you begin](#before-you-begin) and [Prerequisites](#prerequisites) first. Then, we'll walk you through the two typical deployment topologies:

> [!div class="checklist"]
> * [On-premises vRealize Operations managing Azure VMware Solution deployment](#on-premises-vrealize-operations-managing-azure-vmware-solution-deployment)
> * [vRealize Operations Cloud managing Azure VMware Solution deployment](#vrealize-operations-cloud-managing-azure-vmware-solution-deployment)

## Before you begin
* Review the [vRealize Operations Manager product documentation](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-7FFC61A0-7562-465C-A0DC-46D092533984.html) to learn more about deploying vRealize Operations.
* Review the basic Azure VMware Solution Software-Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Optionally, review the [vRealize Operations Remote Controller](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-263F9219-E801-4383-8A59-E84F3D01ED6B.html) product documentation for the on-premises vRealize Operations managing Azure VMware Solution deployment option.

## Prerequisites
* [vRealize Operations Manager](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-7FFC61A0-7562-465C-A0DC-46D092533984.html) installed.
* A VPN or an Azure ExpressRoute configured between on-premises and Azure VMware Solution SDDC.
* An Azure VMware Solution private cloud has been deployed in Azure.

## On-premises vRealize Operations managing Azure VMware Solution deployment
Most customers have an existing on-premises deployment of vRealize Operations to manage one or more on-premises vCenter Server domains. When they provision an Azure VMware Solution private cloud, they connect their on-premises environment with their private cloud using an Azure ExpressRoute or a Layer 3 VPN solution.

:::image type="content" source="media/vrealize-operations-manager/vrealize-operations-deployment-option-1.png" alt-text="Diagram showing the on-premises vRealize Operations managing Azure VMware Solution deployment." border="false":::

To extend the vRealize Operations capabilities to the Azure VMware Solution private cloud, you create an adapter [instance for the private cloud resources](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.config.doc/GUID-640AD750-301E-4D36-8293-1BFEB67E2600.html). It collects data from the Azure VMware Solution private cloud and brings it into on-premises vRealize Operations. The on-premises vRealize Operations Manager instance can directly connect to the vCenter Server and NSX-T Manager on Azure VMware Solution. Optionally, you can deploy a vRealize Operations Remote Collector on the Azure VMware Solution private cloud. The collector compresses and encrypts the data collected from the private cloud before it's sent over the ExpressRoute or VPN network to the vRealize Operations Manager running on-premises.

> [!TIP]
> Refer to the [VMware documentation](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.vapp.doc/GUID-7FFC61A0-7562-465C-A0DC-46D092533984.html) for step-by-step guide for installing vRealize Operations Manager.

## vRealize Operations Cloud managing Azure VMware Solution deployment
VMware vRealize Operations Cloud supports the Azure VMware Solution, including the vCenter Server, vSAN and NSX-T Data Center adapters.

> [!IMPORTANT]
> Refer to the [VMware documentation](https://docs.vmware.com/en/vRealize-Operations/Cloud/com.vmware.vcom.config.doc/GUID-6CDFEDDC-A72C-4AB4-B8E8-84542CC6CE27.html) for step-by-step guide for connecting vRealize Operations Cloud to Azure VMware Solution.

## Known limitations

- The **cloudadmin@vsphere.local** user in Azure VMware Solution has [limited privileges](concepts-identity.md).  Virtual machines (VMs) on Azure VMware Solution doesn't support in-guest memory collection using VMware tools.  Active and consumed memory utilization continues to work in this case.
- Workload optimization for host-based business intent doesn't work because Azure VMware Solutions manage cluster configurations, including DRS settings.
- Workload optimization for the cross-cluster placement within the SDDC using the cluster-based business intent is fully supported with vRealize Operations Manager 8.0  and onwards. However, workload optimization isn't aware of resource pools and places the VMs at the cluster level. A user can manually correct it in the Azure VMware Solution vCenter Server interface.
- You can't sign in to vRealize Operations Manager using your Azure VMware Solution vCenter Server credentials.
- Azure VMware Solution doesn't support the vRealize Operations Manager plugin.

When you connect the Azure VMware Solution vCenter Server to vRealize Operations Manager using a vCenter Server Cloud Account, you'll see a warning:

:::image type="content" source="./media/vrealize-operations-manager/warning-adapter-instance-creation-succeeded.png" alt-text="Screenshot showing a Warning message that states the adapter instance was created successfully.":::

The warning occurs because the **cloudadmin@vsphere.local** user in Azure VMware Solution doesn't have sufficient privileges to do all vCenter Server actions required for registration. However, the privileges are sufficient for the adapter instance to do data collection, as seen below:

:::image type="content" source="./media/vrealize-operations-manager/adapter-instance-to-perform-data-collection.png" alt-text="Screenshot showing the adapter instance to collect data.":::

For more information, see [Privileges Required for Configuring a vCenter Server Adapter Instance](https://docs.vmware.com/en/vRealize-Operations-Manager/8.1/com.vmware.vcom.core.doc/GUID-3BFFC92A-9902-4CF2-945E-EA453733B426.html).

> [!NOTE]
> VMware vRealize Automation(vRA) integration with the NSX-T Data Center component of the Azure VMware Solution requires the “auditor” role to be added to the user with the NSX-T Manager cloudadmin role.

<!-- LINKS - external -->

<!-- LINKS - internal -->
