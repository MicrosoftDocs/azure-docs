---
title: ' | Microsoft Docs'
description: 
services: virtual-wan
author: cherylmc

ms.service: virtual-wan
ms.topic: tutorial
ms.date: 09/21/2018
ms.author: cherylmc
Customer intent: As someone with a networking background, I want to work with routing tables for NVA.
---

# Tutorial: Create a Virtual Hub Route table to steer traffic to a Network Virtual Appliance

This tutorial shows you how to steer traffic from a Virtual Hub to a Network Virtual Appliance. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a WAN
> * Create a site
> * Create a hub
> * Connect a hub to a site
> * Connect a VNet to a hub
> * Download and apply the VPN device configuration
> * View your virtual WAN
> * View resource health
> * Monitor a connection

## Before you begin

Verify that you have met the following criteria:

1. A Network Virtual Appliance (NVA) is a third-party software of your choice that is typically provisioned from Azure Marketplace (Link) in a Virtual Network.
2. A private IP assigned to the NVA network interface. 
3. NVA cannot be deployed in the Virtual Hub, so we will expect it to be deployed in a separate VNet. For the purpose of this discussion, lets call this VNet the ‘DMZ VNet’
4. The ‘DMZ VNet’ may have one or many virtual networks connected to it. For the purpose of this discussion, we will call this virtual network as the ‘Indirect spoke VNet’. These VNet can be connected to the DMZ VNet using VNet peering.
5. Please ensure there are no Virtual Network Gateways in any VNets.



## <a name="cleanup"></a>Clean up resources

When you no longer need these resources, you can use [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group and all of the resources it contains. Replace "myResourceGroup" with the name of your resource group and run the following PowerShell command:

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myResourceGroup -Force
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create a WAN
> * Create a site
> * Create a hub
> * Connect a hub to a site
> * Connect a VNet to a hub
> * Download and apply the VPN device configuration
> * View your virtual WAN
> * View resource health
> * Monitor a connection

To learn more about Virtual WAN, see the [Virtual WAN Overview](virtual-wan-about.md) page.
