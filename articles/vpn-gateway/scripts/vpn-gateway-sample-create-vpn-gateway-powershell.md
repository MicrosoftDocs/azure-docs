---
title: 'Azure PowerShell script sample - Create a VPN gateway'
titleSuffix: Azure VPN Gateway
description: Learn how to use a PowerShell script to create a virtual network, network subnet, and route-based VPN gateway.
services: vpn-gateway
documentationcenter: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.devlang: powershell
ms.topic: sample
ms.date: 02/10/2021
ms.author: alzam 
ms.custom: devx-track-azurepowershell
---

# Create a VPN gateway - PowerShell script sample

This PowerShell script creates a route-based VPN gateway.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

```azurepowershell-interactive
# Declare variables
  $RG = "TestRG1"
  $Location = "East US"
  $VNetName  = "VNet1"
  $FESubName = "FrontEnd"
  $VNetPrefix1 = "10.1.0.0/16"
  $FESubPrefix = "10.1.0.0/24"
  $GWSubPrefix = "10.1.255.0/27"
  $GWName = "VNet1GW"
  $GWIPName = "VNet1GWIP"

# Create a resource group
New-AzResourceGroup -Name $RG -Location $Location
# Create a virtual network
$virtualNetwork = New-AzVirtualNetwork `
  -ResourceGroupName $RG `
  -Location $Location `
  -Name $VNetName `
  -AddressPrefix $VNetPrefix1
# Create a subnet configuration
$subnetConfig = Add-AzVirtualNetworkSubnetConfig `
  -Name $FESubName `
  -AddressPrefix $FESubPrefix `
  -VirtualNetwork $virtualNetwork
# Set the subnet configuration for the virtual network
$virtualNetwork | Set-AzVirtualNetwork
# Add a gateway subnet
$vnet = Get-AzVirtualNetwork -ResourceGroupName $RG -Name $VNetName
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix $GWSubPrefix -VirtualNetwork $vnet
# Set the subnet configuration for the virtual network
$vnet | Set-AzVirtualNetwork
# Request a public IP address
$gwpip= New-AzPublicIpAddress -Name $GWIPName -ResourceGroupName $RG -Location $Location -AllocationMethod Dynamic
# Create the gateway IP address configuration
$vnet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG
$subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
$gwipconfig = New-AzVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gwpip.Id
# Create the VPN gateway
New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG `
-Location $Location -IpConfigurations $gwipconfig -GatewayType Vpn `
-VpnType RouteBased -GatewaySku VpnGw1
```

## Clean up resources

When you no longer need the resources you created, use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to delete the resource group. This will delete the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzResourceGroup -Name TestRG1
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Add-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/add-azvirtualnetworksubnetconfig) | Adds a subnet configuration. This configuration is used with the virtual network creation process. |
| [Get-AzVirtualNetwork](/powershell/module/az.network/get-azvirtualnetwork) | Gets virtual network details. |
| [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzVirtualNetworkSubnetConfig](/powershell/module/az.network/new-azvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzVirtualNetwork](/powershell/module/az.network/new-azvirtualnetwork) | Creates a virtual network. |
| [New-AzPublicIpAddress](/powershell/module/az.network/new-azpublicipaddress) | Creates a public IP address. |
|[New-AzVirtualNetworkGateway](/powershell/module/az.network/new-azvirtualnetworkgateway) | Creates a VPN gateway. |
|[Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) | Removes a resource group and all resources contained within. |
| [Set-AzVirtualNetwork](/powershell/module/az.network/set-azvirtualnetwork) | Sets the subnet configuration for the virtual network. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/).
