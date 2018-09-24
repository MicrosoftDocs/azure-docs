---
title: 'Azure PowerShell script sample - Configure a Site-to-Site VPN | Microsoft Docs'
description: Configure Site-to-Site VPN.
services: vpn-gateway
documentationcenter: vpn-gateway
author: anzaman

ms.service: vpn-gateway
ms.devlang: powershell
ms.topic: sample
ms.date: 04/30/2018
ms.author: alzam

---

# Create a VPN Gateway and add a Site-to-Site connection using PowerShell

This script creates a route-based VPN Gateway and adds Site-to-Site configuration. In order to create the connection, you also need to configure your VPN device. For more information, see [About VPN devices and IPsec/IKE parameters for Site-to-Site VPN Gateway connections](../vpn-gateway-about-vpn-devices.md).


```azurepowershell-interactive
# Declare variables
  $VNetName  = "VNet1"
  $FESubName = "FrontEnd"
  $BESubName = "Backend"
  $GWSubName = "GatewaySubnet"
  $VNetPrefix1 = "10.0.0.0/16"
  $FESubPrefix = "10.1.0.0/24"
  $BESubPrefix = "10.1.1.0/24"
  $GWSubPrefix = "10.1.255.0/27"
  $VPNClientAddressPool = "192.168.0.0/24"
  $RG = "TestRG1"
  $Location = "East US"
  $GWName = "VNet1GW"
  $GWIPName = "VNet1GWIP"
  $GWIPconfName = "gwipconf"
# Create a resource group
New-AzureRmResourceGroup -Name TestRG1 -Location EastUS
# Create a virtual network
$virtualNetwork = New-AzureRmVirtualNetwork `
  -ResourceGroupName TestRG1 `
  -Location EastUS `
  -Name VNet1 `
  -AddressPrefix 10.1.0.0/16
# Create a subnet configuration
$subnetConfig = Add-AzureRmVirtualNetworkSubnetConfig `
  -Name Frontend `
  -AddressPrefix 10.1.0.0/24 `
  -VirtualNetwork $virtualNetwork
# Set the subnet configuration for the virtual network
$virtualNetwork | Set-AzureRmVirtualNetwork
# Add a gateway subnet
$vnet = Get-AzureRmVirtualNetwork -ResourceGroupName TestRG1 -Name VNet1
Add-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.1.255.0/27 -VirtualNetwork $vnet
# Set the subnet configuration for the virtual network
$vnet | Set-AzureRmVirtualNetwork
# Request a public IP address
$gwpip= New-AzureRmPublicIpAddress -Name VNet1GWIP -ResourceGroupName TestRG1 -Location 'East US' `
 -AllocationMethod Dynamic
# Create the gateway IP address configuration
$vnet = Get-AzureRmVirtualNetwork -Name VNet1 -ResourceGroupName TestRG1
$subnet = Get-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
$gwipconfig = New-AzureRmVirtualNetworkGatewayIpConfig -Name gwipconfig1 -SubnetId $subnet.Id -PublicIpAddressId $gwpip.Id
# Create the VPN gateway
New-AzureRmVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1 `
 -Location 'East US' -IpConfigurations $gwipconfig -GatewayType Vpn `
 -VpnType RouteBased -GatewaySku VpnGw1
# Create the local network gateway
New-AzureRmLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1 `
 -Location 'East US' -GatewayIpAddress '23.99.221.164' -AddressPrefix @('10.101.0.0/24','10.101.1.0/24')
# Configure your on-premises VPN device
# Create the VPN connection
$gateway1 = Get-AzureRmVirtualNetworkGateway -Name VNet1GW -ResourceGroupName TestRG1
$local = Get-AzureRmLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1
New-AzureRmVirtualNetworkGatewayConnection -Name VNet1toSite1 -ResourceGroupName TestRG1 `
 -Location 'East US' -VirtualNetworkGateway1 $gateway1 -LocalNetworkGateway2 $local `
 -ConnectionType IPsec -RoutingWeight 10 -SharedKey 'abc123'
```

## Clean up resources

When you no longer need the resources you created, use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to delete the resource group. This will delete the resource group and all of the resources it contains.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name TestRG1
```

## Script explanation

This script uses the following commands to create the deployment. Each item in the table links to command specific documentation.

| Command | Notes |
|---|---|
| [Add-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/add-azurermvirtualnetworksubnetconfig) | Adds a subnet configuration. This configuration is used with the virtual network creation process. |
| [Get-AzureRmVirtualNetwork](/powershell/module/azurerm.network/get-azurermvirtualnetwork) | Gets a virtual network details. |
| [Get-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/get-azurermvirtualnetworkgateway) | Gets virtual network gateway details. |
| [Get-AzureRmLocalNetworkGateway](/powershell/module/azurerm.network/get-azurermvirtualnetworkgateway) | Gets local network gateway details. |
| [Get-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/get-azurermvirtualnetworksubnetconfig) | Gets the virtual network subnet configuration details. |
| [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) | Creates a resource group in which all resources are stored. |
| [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) | Creates a subnet configuration. This configuration is used with the virtual network creation process. |
| [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork) | Creates a virtual network. |
| [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) | Creates a public IP address. |
| [New-AzureRmVirtualNetworkGatewayIpConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworkgatewayipconfig) | Creates a new gateway ip configuration. |
| [New-AzureRmVirtualNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermvirtualnetworkgateway?view=azurermps-6.8.1) | Creates a VPN gateway. |
| [New-AzureRmLocalNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermlocalnetworkgateway?view=azurermps-6.8.1) | Creates a local network gateway. |
| [New-AzureRmVirtualNetworkGatewayConnection](/powershell/module/azurerm.resources/new-azurermvirtualnetworkgatewayconnection) | Creates a site-to-site connection. |
| [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) | Removes a resource group and all resources contained within. |
| [Set-AzureRmVirtualNetwork](/powershell/module/azurerm.network/set-azurermvirtualnetwork) | Sets the subnet configuration for the virtual network. |
| [Set-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/set-azurermvirtualnetworkgateway) | Sets the configuration for the VPN gateway. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).
