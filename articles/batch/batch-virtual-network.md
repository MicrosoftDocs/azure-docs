---
title: Provision Azure Batch pool in a virtual network | Microsoft Docs
description: You can create a Batch pool in a virtual network so that compute nodes can communicate securely with other VMs in the network, such as a file server.
services: batch
author: v-dotren
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 10/13/2017
ms.author: v-dotren
---

# Create a pool of virtual machines with your virtual network


When you create an Azure Batch pool, you can provision the pool in a subnet of an Azure virtual network (VNet) that you specify. This article explains how to set up a Batch pool using the Virtual Machine Configuration in a VNet. 


> [!NOTE]
> It is also possible to set up a pool in the Cloud Services Configuration in a VNet. In this pool configuration, the network requirements and Batch settings differ from those described in this article. For more information about the differences, see the [Batch feature overview](batch-api-basics.md#virtual-network-vnet-and-firewall-configuration)
>


## Why use a VNet?


The compute nodes of an Azure Batch pool are automatically networked so that they can communicate with each other. However, by default, the nodes cannot communicate with virtual machines that are not part of the Batch pool, such as a license server or a file server. To allow pool compute nodes to communicate securely with a license server or file server, you can provision the pool in a subnet of an Azure virtual network (VNet) that you specify.



## Prerequisites

* **Azure Active Directory (AD) authentication**. The Batch client API must use Azure AD authentication. Azure Batch support for Azure AD is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).

* **An Azure VNet** that meets the following requirements:

  - The VNet must be in the same Azure **region** and **subscription** as the Batch account.

  - The VNet must be created in the Azure Resource Manager deployment model. You cannot use a classic VNet in this configuration.

  - The subnet specified for the pool must have enough unassigned IP addresses to accommodate the number of VMs targeted for the pool. If the subnet doesn't have enough unassigned IP addresses, the pool partially allocates the compute nodes, and a resize error occurs. 

  - The VNet must allow communication from the Batch service to be able to schedule tasks on the compute nodes. This can be verified by checking if the VNet has any associated network security groups (NSGs). If communication to the compute nodes in the specified subnet is denied by an NSG, then the Batch service sets the state of the compute nodes to **unusable**. 

* **Enable inbound and outbound ports** on the pool, as shown in the following table, if the VNet has associated NSGs:

 [add include file, shared with batch-api-basics.md]


    
## Prepare a VNet

The VNet you want the pool to use can be created from the portal while you add a pool (see the following section). To prepare a VNet and one or more subnets in advance, you can use [Azure PowerShell](../virtual-network/virtual-networks-create-vnet-arm-ps.md), the [Azure Command-Line Interface 2.0](../virtual-network/virtual-networks-create-vnet-arm-cli.md), an [Azure Resource Manager template](), or the Azure APIs.

## Create a pool with a VNet in the portal

Once you have saved your custom image and you know its resource ID or name, you can create a Batch pool from that image. The following steps show you how to create a pool from the Azure portal.

> [!NOTE]
> If you are creating the pool using one of the Batch APIs, make sure that the identity you use for AAD authentication has permissions to the image resource. See [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).
>

1. Navigate to your Batch account in the Azure portal. This account must be in the same subscription and region as the resource group containing the custom image. 
2. In the **Settings** window on the left, select the **Pools** menu item.
3. In the **Pools** window, select the **Add** command.
4. On the **Add Pool** window, select **Custom Image (Linux/Windows)** from the **Image Type** dropdown. From the **Custom VM image** dropdown, select the image name (short form of the resource ID).
5. Select the correct **Publisher/Offer/Sku** for your custom image.
6. Specify the remaining required settings, including the **Node size**, **Target dedicated nodes**, and **Low priority nodes**, as well as any desired optional settings.

    
## Next steps

- For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
