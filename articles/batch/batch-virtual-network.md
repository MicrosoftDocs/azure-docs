---
title: Provision Azure Batch pool in a virtual network | Microsoft Docs
description: You can create a Batch pool in a virtual network so that compute nodes can communicate securely with other VMs in the network, such as a file server.
services: batch
author: v-dotren
manager: timlt

ms.service: batch
ms.topic: article
ms.date: 10/16/2017
ms.author: v-dotren
---

# Create a pool of virtual machines with your virtual network


When you create an Azure Batch pool, you can provision the pool in a subnet of an [Azure virtual network](../virtual-network/virtual-networks-overview.md) (VNet) that you specify. This article explains how to set up a Batch pool in a VNet. 



## Why use a VNet?


The compute nodes of an Azure Batch pool are automatically networked so that they can communicate with each other. However, by default, the nodes cannot communicate with virtual machines that are not part of the Batch pool, such as a license server or a file server. To allow pool compute nodes to communicate securely with other virtual machines, or with an on-premises network, you can provision the pool in a subnet of an Azure VNet. 



## VNet requirements

To prepare a VNet with one or more subnets in advance, you can use the Azure portal, Azure PowerShell, the Azure Command-Line Interface (CLI), or other methods. For steps to create an Azure Resource Manager-based VNet, see [Create a virtual network with multiple subnets](../virtual-network/virtual-networks-create-vnet-arm-pportal.md). To create a classic VNet, see [Create a virtual network (classic) with multiple subnets](../virtual-network/create-virtual-network-classic.md).

[!INCLUDE [batch-virtual-network-ports](../../includes/batch-virtual-network-ports.md)]
    
## Create a pool with a VNet in the portal

Once you have created your VNet and assigned a subnet to it, you can create a Batch pool with that VNet. Follow these steps to create a pool from the Azure portal: 



1. Navigate to your Batch account in the Azure portal. This account must be in the same subscription and region as the resource group containing the VNet you intend to use. 
2. In the **Settings** window on the left, select the **Pools** menu item.
3. In the **Pools** window, select the **Add** command.
4. On the **Add Pool** window, select the option you intend to use from the **Image Type** dropdown. 
5. Select the correct **Publisher/Offer/Sku** for your custom image.
6. Specify the remaining required settings, including the **Node size**, **Target dedicated nodes**, and **Low priority nodes**, as well as any desired optional settings.
7. In **Virtual Network**, select the virtual network and subnet you wish to use.
  
  ![Add pool with virtual network](./media/batch-virtual-network/add-vnet-pool.png)

## User-defined routes for forced tunneling

You might have requirements in your organization to redirect (force) Internet-bound traffic from the subnet back to your on-premises location for inspection and logging. You can configure forced tunneling in the subnet by adding [user-defined routes](../virtual-network/virtual-networks-udr-overview.md).

To enable forced tunneling for the VNet selected for the Batch pool, add user-defined routes for the following:

* The IP addresses needed for the Batch service to communicate with pool VMs. For the list of addresses, please contact Azure Support.

* Azure Storage addresses. 
    
## Next steps

- For an in-depth overview of Batch, see [Develop large-scale parallel compute solutions with Batch](batch-api-basics.md).
