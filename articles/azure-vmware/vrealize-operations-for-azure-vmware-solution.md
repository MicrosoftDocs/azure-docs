---
title: Configure VMware Aria Operations for Azure VMware Solution
description: Learn how to set up VMware Aria Operations for your Azure VMware Solution private cloud.
ms.topic: how-to
ms.service: azure-vmware
ms.date: 01/09/2025
ms.custom: engagement-fy23
---

# Configure Aria Operations for Azure VMware Solution

Aria Operations is an operations management platform that allows VMware infrastructure administrators to monitor system resources. These system resources could be application-level or infrastructure level (both physical and virtual) objects. Most VMware administrators use Aria Operations to monitor and manage their VMware private cloud components – vCenter Server, ESXi, NSX, vSAN, and VMware HCX. Each provisioned Azure VMware Solution private cloud includes a dedicated vCenter Server, NSX Manager, vSAN, and HCX deployment.

Thoroughly review [Before you begin](#before-you-begin) and [Prerequisites](#prerequisites) first.

## Before you begin
* Review the [Aria Operations product documentation](https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18.html) to learn more about deploying Aria Operations.
* Review the basic Azure VMware Solution Software-Defined Datacenter (SDDC) [tutorial series](tutorial-network-checklist.md).
* Optionally, review the [InstallingCloud Proxy](https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18/getting-started-with-vmware-aria-operations-8-18/-post-installation-considerations/installing-cloud-proxy-in-vrealize-operations-manager.html) product documentation for the on-premises Aria Operations managing Azure VMware Solution deployment option.

## Prerequisites
* [Aria Operations](https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18/getting-started-with-vmware-aria-operations-8-18/about-installing/workflow-of-vrealize-operations-manager-installation.html) is installed.
* An Azure VMware Solution private cloud is deployed in Azure.
* A VPN or an Azure ExpressRoute configured between on-premises and Azure VMware Solution private cloud.

## On-premises Aria Operations managing Azure VMware Solution deployment
Most customers have an existing on-premises deployment of Aria Operations to manage one or more on-premises vCenter Server SSO domains. When they provision an Azure VMware Solution private cloud, they connect their on-premises environment with their private cloud using an Azure ExpressRoute or a Layer 3 VPN solution.

:::image type="content" source="media/vrealize-operations-manager/aria-operations-deployment-option-1.png" alt-text="Diagram showing the on-premises Aria Operations managing the Azure VMware Solution deployment." border="false" lightbox="media/vrealize-operations-manager/aria-operations-deployment-option-1.png":::

To extend the Aria Operations capabilities to the Azure VMware Solution private cloud, you create an adapter [instance for the private cloud resources](https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18/vmware-aria-operations-configuration-guide-8-18/connect-to-data-sources/azure-vmware-solution/configure-azure-vmware-solution-in-vrealize-operations-manager.html). It collects data from the Azure VMware Solution private cloud and brings it into the on-premises Aria Operations. The on-premises Aria Operations instance can directly connect to the vCenter Server and NSX Manager of the Azure VMware Solution. Optionally, you can deploy an Aria Operations Remote Collector in the Azure VMware Solution private cloud. The collector compresses and encrypts the data collected from the private cloud before it's sent over the ExpressRoute or VPN network to the Aria Operations running on-premises.

> [!TIP]
> Refer to the [VMware documentation](https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18/getting-started-with-vmware-aria-operations-8-18/about-installing/workflow-of-vrealize-operations-manager-installation.html) for step-by-step guide for installing Aria Operations.

## Aria Operations Cloud managing Azure VMware Solution deployment
VMware Aria Operations Cloud supports the Azure VMware Solution, including the vCenter Server, vSAN and NSX adapters.

> [!IMPORTANT]
> Refer to the [VMware documentation](https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18/vmware-aria-operations-configuration-guide-8-18/connect-to-data-sources/azure-vmware-solution/configure-azure-vmware-solution-in-vrealize-operations-manager.html) for the step-by-step guide for connecting Aria Operations Cloud to Azure VMware Solution.

## Known limitations

- The **cloudadmin@vsphere.local** user in Azure VMware Solution has [limited privileges](architecture-identity.md). Virtual machines (VMs) on Azure VMware Solution doesn't support in-guest memory collection using VMware tools. Active and consumed memory utilization continues to work in this case.
- Workload optimization for host-based business intent doesn't work because Azure VMware Solutions manage cluster configurations, including DRS settings.
- Workload optimization for the cross-cluster placement within the private cloud using the cluster-based business intent is fully supported with Aria Operations. However, workload optimization isn't aware of resource pools and places the VMs at the cluster level. A user can manually correct it in the Azure VMware Solution vCenter Server interface.
- You can't sign into Aria Operations using your Azure VMware Solution vCenter Server credentials.
- Azure VMware Solution doesn't support the Aria Operations plugin.

When you connect the Azure VMware Solution vCenter Server to Aria Operations using a vCenter Server CloudAdmin Account, you see a warning:

:::image type="content" source="./media/vrealize-operations-manager/warning-adapter-instance-creation-succeeded.png" alt-text="Screenshot shows a Warning message that states the adapter instance was created successfully.":::

The warning occurs because the **cloudadmin@vsphere.local** user in Azure VMware Solution doesn't have sufficient privileges to do all vCenter Server actions required for registration. However, the privileges are sufficient for the adapter instance to do data collection, as seen in the following example:

:::image type="content" source="./media/vrealize-operations-manager/adapter-instance-to-perform-data-collection.png" alt-text="Screenshot shows the adapter instance to collect data.":::

For more information, see [Privileges Required for Configuring a vCenter Server Adapter Instance](https://techdocs.broadcom.com/us/en/vmware-cis/aria/aria-operations/8-18/vmware-aria-operations-configuration-guide-8-18/connect-to-data-sources/vsphere/configuring-a-vcenter-server-cloud-account-in-vrealize-operations/privileges-required-for-configuring-a-vcenter-adapter-instance.html).

> [!NOTE]
> VMware Aria Operations integration with the NSX Manager component of the Azure VMware Solution requires the “auditor” role to be added to the user with the NSX Manager cloudadmin role.

<!-- LINKS - external -->

<!-- LINKS - internal -->
