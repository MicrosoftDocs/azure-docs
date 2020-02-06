--- 
title: Azure VMware Solutions (AVS) - Create AVS Private Cloud
description: Describes how to create an AVS Private Cloud to extend VMware workloads to the cloud with operational flexibility and continuity
author: sharaths-cs
ms.author: b-shsury 
ms.date: 08/19/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---

# Create an AVS Private Cloud

An AVS Private Cloud is an isolated VMware stack that supports ESXi hosts, vCenter, vSAN, and NSX. AVS Private Clouds are managed through the AVS portal. They have their own vCenter server in its own management domain. The stack runs on dedicated nodes and isolated bare metal hardware nodes.

Creating an AVS Private Cloud helps you address a variety of common needs for network infrastructure:

* **Growth**. If you've reached a hardware refresh point for your existing infrastructure, an AVS Private Cloud allows you to expand with no new hardware investment required.

* **Fast expansion**. If any temporary or unplanned capacity needs arise, an AVS Private Cloud allows you to create the additional capacity with no delay.

* **Increased protection**. With an AVS Private Cloud of three or more nodes, you get automatic redundancy and high availability protection.

* **Long-term infrastructure needs**. If your datacenters are at capacity or you want to restructure to lower your costs, an AVS Private Cloud allows you to retire datacenters and migrate to a cloud-based solution while remaining compatible with your enterprise operations.

When you create an AVS Private Cloud, you get a single vSphere cluster and all the management VMs that are created in that cluster.

## Before you begin

Nodes must be provisioned before you can create your AVS Private Cloud. For more information on provisioning nodes, see [Provision nodes for Azure VMware Solutions (AVS)](create-nodes.md).

Allocate a CIDR range for vSphere/vSAN subnets for the AVS Private Cloud. An AVS Private Cloud is created as an isolated VMware stack environment (with ESXi hosts, vCenter, vSAN, and NSX) managed by a vCenter server. Management components are deployed in the network that is selected for vSphere/vSAN subnets CIDR. The network CIDR range is divided into different subnets during the deployment. The vSphere/vSAN subnet address space must be unique. It must not overlap with any network that communicates with the AVS environment. The networks that communicate with AVS include on-premises networks and Azure virtual networks. For more information on vSphere/vSAN subnets, see VLANs and subnets overview.

* Minimum vSphere/vSAN subnets CIDR range prefix: /24
* Maximum vSphere/vSAN subnets CIDR range prefix: /21


## Access the AVS portal

Access the [AVS portal](access-cloudsimple-portal.md).

## Create a New AVS Private Cloud

1. Select **All services**.
2. Search for **AVS Services**.
3. Select the AVS service on which you want to create your AVS Private Cloud.
4. From **Overview**, click **Create AVS Private Cloud** to open a new browser tab for AVS portal. If prompted, sign in with your Azure sign in credentials.

    ![Create AVS Private Cloud from Azure](media/create-private-cloud-from-azure.png)

5. In the AVS portal, provide a name for your AVS Private Cloud.
6. Select **Location** for your AVS Private Cloud.
7. Select **Node type**, consistent with what you provisioned on Azure.
8. Specify **Node count**. At least three nodes are required to create an AVS Private Cloud.

    ![Create AVS Private Cloud - Basic info](media/create-private-cloud-basic-info.png)

9. Click **Next: Advanced options**.
10. Enter the CIDR range for vSphere/vSAN subnets. Make sure that the CIDR range doesn't overlap with any of your on-premises or other Azure subnets (virtual networks) or with the gateway subnet.

    **CIDR range options:** /24, /23, /22, or /21. A /24 CIDR range supports up to nine nodes, a /23 CIDR range supports up to 41 nodes, and a /22 and /21 CIDR range supports up to 64 nodes (the maximum number of nodes in an AVS Private Cloud).

    > [!IMPORTANT]
    > IP addresses in the vSphere/vSAN CIDR range are reserved for use by the AVS Private Cloud infrastructure. Don't use the IP address in this range on any virtual machine.

11. Click **Next: Review and create**.
12. Review the settings. If you need to change any settings, click **Previous**.
13. Click **Create**.

AVS Private Cloud provisioning process starts. It can take up to two hours for the AVS Private Cloud to be provisioned.

For instructions on expanding an existing AVS Private Cloud, see [Expand an AVS Private Cloud](expand-private-cloud.md).
