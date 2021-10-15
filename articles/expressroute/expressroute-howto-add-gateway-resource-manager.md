---
title: 'Tutorial - Azure ExpressRoute: Add a gateway to a VNet - Azure PowerShell'
description: This tutorial helps you add VNet gateway to an already created Resource Manager VNet for ExpressRoute using Azure PowerShell.
services: expressroute
author: duongau

ms.service: expressroute
ms.topic: tutorial
ms.date: 10/05/2020
ms.author: duau
ms.custom: seodec18, devx-track-azurepowershell

---
# Tutorial: Configure a virtual network gateway for ExpressRoute using PowerShell
> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> * [Video - Azure portal](https://azure.microsoft.com/documentation/videos/azure-expressroute-how-to-create-a-vpn-gateway-for-your-virtual-network)
> 

This tutorial helps you add, resize, and remove a virtual network (VNet) gateway for a pre-existing VNet. The steps for this configuration apply to VNets that were created using the Resource Manager deployment model for an ExpressRoute configuration. For more information, see [About virtual network gateways for ExpressRoute](expressroute-about-virtual-network-gateways.md).

In this tutorial, you learn how to:
> [!div class="checklist"]
> - Create a gateway subnet.
> - Create Virtual Network gateway.

## Prerequisites

### Configuration reference list

The steps for this task use a VNet based on the values in the following configuration reference list. Additional settings and names are also outlined in this list. We don't use this list directly in any of the steps, although we do add variables based on the values in this list. You can copy the list to use as a reference, replacing the values with your own.

| Setting                   | Value                                              |
| ---                       | ---                                                |
| Virtual Network Name | *TestVNet* |    
| Virtual Network address space | *192.168.0.0/16* |
| Resource Group | *TestRG* |
| Subnet1 Name | *FrontEnd* |   
| Subnet1 address space | *192.168.1.0/24* |
| Subnet1 Name | *FrontEnd* |
| Gateway Subnet name | *GatewaySubnet* |    
| Gateway Subnet address space | *192.168.200.0/26* |
| Region | *East US* |
| Gateway Name | *GW* |   
| Gateway IP Name | *GWIP* |
| Gateway IP configuration Name | *gwipconf* |
| Type | *ExpressRoute* |
| Gateway Public IP Name  | *gwpip* |

> [!IMPORTANT]
> IPv6 support for private peering is currently in **Public Preview**. If you would like to connect your virtual network to an ExpressRoute circuit with IPv6-based private peering configured, please make sure that your virtual network is dual stack and follows the guidelines described [here](../virtual-network/ipv6-overview.md).
> 
> 

## Add a gateway

1. To connect with Azure, run `Connect-AzAccount`.

1. Declare your variables for this exercise. Be sure to edit the sample to reflect the settings that you want to use.

   ```azurepowershell-interactive 
   $RG = "TestRG"
   $Location = "East US"
   $GWName = "GW"
   $GWIPName = "GWIP"
   $GWIPconfName = "gwipconf"
   $VNetName = "TestVNet"
   ```
1. Store the virtual network object as a variable.

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG
   ```
1. Add a gateway subnet to your Virtual Network. The gateway subnet must be named "GatewaySubnet". The gateway subnet has to be /27 or larger (/26, /25, and so on). If you plan on connecting 16 ExpressRoute circuits to your gateway, you **must** create a gateway subnet of /26 or larger.

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix 192.168.200.0/26
   ```
    If you are using a dual stack virtual network and plan to use IPv6-based private peering over ExpressRoute, create a dual stack gateway subnet instead.

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix "10.0.0.0/26","ace:daa:daaa:deaa::/64"
   ```
1. Set the configuration.

   ```azurepowershell-interactive
   $vnet = Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```
1. Store the gateway subnet as a variable.

   ```azurepowershell-interactive
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
   ```
1. Request a public IP address. The IP address is requested before creating the gateway. You can't specify the IP address that you want to use; it’s dynamically assigned. You'll use this IP address in the next configuration section. The AllocationMethod must be Dynamic.

   ```azurepowershell-interactive
   $pip = New-AzPublicIpAddress -Name $GWIPName  -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic
   ```
      
   If you plan to use IPv6-based private peering over ExpressRoute, please set the IP SKU to Standard and the AllocationMethod to Static:
   ```azurepowershell-interactive
   $pip = New-AzPublicIpAddress -Name $GWIPName  -ResourceGroupName $RG -Location $Location -AllocationMethod Static -SKU Standard
   ```
   
1. Create the configuration for your gateway. The gateway configuration defines the subnet and the public IP address to use. In this step, you're specifying the configuration that will be used when you create the gateway. Use the following sample to create your gateway configuration.

   ```azurepowershell-interactive
   $ipconf = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddress $pip
   ```
1. Create the gateway. In this step, the **-GatewayType** is especially important. You must use the value **ExpressRoute**. After running these cmdlets, the gateway can take 45 minutes or more to create.

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -IpConfigurations $ipconf -GatewayType Expressroute -GatewaySku Standard
   ```
> [!IMPORTANT]
> If you plan to use IPv6-based private peering over ExpressRoute, make sure to select an AZ SKU (ErGw1AZ, ErGw2AZ, ErGw3AZ) for **-GatewaySku** or use Non-AZ SKU (Standard, HighPerformance, UltraPerformance) for -GatewaySKU with Standard and Static Public IP.
> 
> 

## Verify the gateway was created
Use the following commands to verify that the gateway has been created:

```azurepowershell-interactive
Get-AzVirtualNetworkGateway -ResourceGroupName $RG
```

## Resize a gateway
There are a number of [Gateway SKUs](expressroute-about-virtual-network-gateways.md). You can use the following command to change the Gateway SKU at any time.

> [!IMPORTANT]
> This command doesn't work for UltraPerformance gateway. To change your gateway to an UltraPerformance gateway, first remove the existing ExpressRoute gateway, and then create a new UltraPerformance gateway. To downgrade your gateway from an UltraPerformance gateway, first remove the UltraPerformance gateway, and then create a new gateway.
> 

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku HighPerformance
```

## Clean up resources
Use the following command to remove the gateway:

```azurepowershell-interactive
Remove-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
```

## Next steps
After you've created the VNet gateway, you can link your VNet to an ExpressRoute circuit. 

> [!div class="nextstepaction"]
> [Link a Virtual Network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)
