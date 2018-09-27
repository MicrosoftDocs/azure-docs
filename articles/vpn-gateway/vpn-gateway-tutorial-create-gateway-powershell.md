---
title: Create and Manage Azure VPN gateway using PowerShell | Microsoft Docs
description: Tutorial - Create and Manage VPN gateway with the Azure PowerShell module
services: vpn-gateway
documentationcenter: na
author: yushwang
manager: rossort
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: vpn-gateway
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: infrastructure
ms.date: 05/14/2018
ms.author: yushwang
ms.custom: mvc
#Customer intent: I want to create a VPN gateway for my virtual network so that I can connect to my VNet and communicate with resources remotely.
---

# Create and Manage VPN gateway with the Azure PowerShell module

Azure VPN gateways provide cross-premises connectivity between customer premises and Azure. This tutorial covers basic Azure VPN gateway deployment items such as creating and managing a VPN gateway. You learn how to:

> [!div class="checklist"]
> * Create a VPN gateway
> * Resize a VPN gateway
> * Reset a VPN gateway

The following diagram shows the virtual network and the VPN gateway created as part of this tutorial.

![VNet and VPN gateway](./media/vpn-gateway-tutorial-create-gateway-powershell/vnet1-gateway.png)

### Azure Cloud Shell and Azure PowerShell

[!INCLUDE [working with cloudshell](../../includes/vpn-gateway-cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.3 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure. 

## Common network parameter values

Change the values below based on your environment and network setup.

```azurepowershell-interactive
$RG1         = "TestRG1"
$VNet1       = "VNet1"
$Location1   = "East US"
$FESubnet1   = "FrontEnd"
$BESubnet1   = "Backend"
$GwSubnet1   = "GatewaySubnet"
$VNet1Prefix = "10.1.0.0/16"
$FEPrefix1   = "10.1.0.0/24"
$BEPrefix1   = "10.1.1.0/24"
$GwPrefix1   = "10.1.255.0/27"
$VNet1ASN    = 65010
$DNS1        = "8.8.8.8"
$Gw1         = "VNet1GW"
$GwIP1       = "VNet1GWIP"
$GwIPConf1   = "gwipconf1"
```

## Create resource group

Create a resource group with the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. A resource group must be created first. In the following example, a resource group named *TestRG1* is created in the *East US* region:

```azurepowershell-interactive
New-AzureRmResourceGroup -ResourceGroupName $RG1 -Location $Location1
```

## Create a virtual network

Azure VPN gateway provides cross-premises connectivity and P2S VPN server functionality for your virtual network. Add the VPN gateway to an existing virtual network or create a new virtual network and the gateway. This example creates a new virtual network with three subnets: Frontend, Backend, and GatewaySubnet using [New-AzureRmVirtualNetworkSubnetConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworksubnetconfig) and [New-AzureRmVirtualNetwork](/powershell/module/azurerm.network/new-azurermvirtualnetwork):

```azurepowershell-interactive
$fesub1 = New-AzureRmVirtualNetworkSubnetConfig -Name $FESubnet1 -AddressPrefix $FEPrefix1
$besub1 = New-AzureRmVirtualNetworkSubnetConfig -Name $BESubnet1 -AddressPrefix $BEPrefix1
$gwsub1 = New-AzureRmVirtualNetworkSubnetConfig -Name $GWSubnet1 -AddressPrefix $GwPrefix1
$vnet   = New-AzureRmVirtualNetwork `
            -Name $VNet1 `
            -ResourceGroupName $RG1 `
            -Location $Location1 `
            -AddressPrefix $VNet1Prefix `
            -Subnet $fesub1,$besub1,$gwsub1
```

## Request a public IP address for the VPN gateway

Azure VPN gateways communicate with your on-premises VPN devices over the Internet to performs IKE (Internet Key Exchange) negotiation and establish IPsec tunnels. Create and assign a public IP address to your VPN gateway as shown in the example below with [New-AzureRmPublicIpAddress](/powershell/module/azurerm.network/new-azurermpublicipaddress) and [New-AzureRmVirtualNetworkGatewayIpConfig](/powershell/module/azurerm.network/new-azurermvirtualnetworkgatewayipconfig):

> [!IMPORTANT]
> Currently, you can only use a Dynamic public IP address for the gateway. Static IP address is not supported on Azure VPN gateways.

```azurepowershell-interactive
$gwpip    = New-AzureRmPublicIpAddress -Name $GwIP1 -ResourceGroupName $RG1 `
              -Location $Location1 -AllocationMethod Dynamic
$subnet   = Get-AzureRmVirtualNetworkSubnetConfig -Name 'GatewaySubnet' `
              -VirtualNetwork $vnet
$gwipconf = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GwIPConf1 `
              -Subnet $subnet -PublicIpAddress $gwpip
```

## Create VPN gateway

A VPN gateway can take 45 minutes or more to create. Once the gateway creation has completed, you can create a connection between your virtual network and another VNet. Or create a connection between your virtual network and an on-premises location. Create a VPN gateway using the [New-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/New-AzureRmVirtualNetworkGateway) cmdlet.

```azurepowershell-interactive
New-AzureRmVirtualNetworkGateway -Name $Gw1 -ResourceGroupName $RG1 `
  -Location $Location1 -IpConfigurations $gwipconf -GatewayType Vpn `
  -VpnType RouteBased -GatewaySku VpnGw1
```

Key parameter values:
* GatewayType: Use **Vpn** for site-to-site and VNet-to-VNet connections
* VpnType: Use **RouteBased** to interact with wider range of VPN devices and more routing features
* GatewaySku: **VpnGw1** is the default; change it to VpnGw2 or VpnGw3 if you need higher throughputs or more connections. For more information, see [Gateway SKUs](vpn-gateway-about-vpn-gateway-settings.md#gwsku).

Once the gateway creation has completed, you can create a connection between your virtual network and another VNet, or create a connection between your virtual network and an on-premises location. You can also configure a P2S connection to your VNet from a client computer.

## Resize VPN gateway

You can change the VPN gateway SKU after the gateway is created. Different gateway SKUs support different specifications such as throughputs, number of connections, etc. The following example uses [Resize-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/Resize-AzureRmVirtualNetworkGateway) to resize your gateway from VpnGw1 to VpnGw2. For more information, see [Gateway SKUs](vpn-gateway-about-vpn-gateway-settings.md#gwsku).

```azurepowershell-interactive
$gw = Get-AzureRmVirtualNetworkGateway -Name $Gw1 -ResourceGroup $RG1
Resize-AzureRmVirtualNetworkGateway -GatewaySku VpnGw2 -VirtualNetworkGateway $gateway
```

Resizing a VPN gateway also takes about 30 to 45 minutes, although this operation will **not** interrupt or remove existing connections and configurations.

## Reset VPN gateway

As part of the troubleshooting steps, you can reset your Azure VPN gateway to force the VPN gateway to restart the IPsec/IKE tunnel configurations. Use [Reset-AzureRmVirtualNetworkGateway](/powershell/module/azurerm.network/Reset-AzureRmVirtualNetworkGateway) to reset your gateway.

```azurepowershell-interactive
$gw = Get-AzureRmVirtualNetworkGateway -Name $Gw1 -ResourceGroup $RG1
Reset-AzureRmVirtualNetworkGateway -VirtualNetworkGateway $gateway
```

For more information, see [Reset a VPN gateway](vpn-gateway-resetgw-classic.md).

## Get the gateway public IP address

If you know the name of the public IP address, use [Get-AzureRmPublicIpAddress](https://docs.microsoft.com/powershell/module/azurerm.network/get-azurermpublicipaddress?view=azurermps-6.8.1) to show the public IP address assigned to the gateway.

```azurepowershell-interactive
$myGwIp = Get-AzureRmPublicIpAddress -Name $GwIP1 -ResourceGroup $RG1
$myGwIp.IpAddress
```

## Delete VPN gateway

A complete configuration of cross-premises and VNet-to-VNet connectivity requires multipel resource types in addition to VPN gateway. Delete the connections associated with the VPN gateway before deleting the gateway itself. Once the gateway is deleted, you can then delete the public IP address(es) for the gateway. See [Delete a VPN gateway](vpn-gateway-delete-vnet-gateway-powershell.md) for the detailed steps.

If the gateway is part of a protype or proof-of-conceopt deployment, you can use [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, the VPN gateway, and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name $RG1
```

## Next steps

In this tutorial, you learned about basic VPN gateway creation and management such as how to:

> [!div class="checklist"]
> * Create a VPN gateway
> * Resize a VPN gateway
> * Reset a VPN gateway

Advance to the following tutorials to learn about S2S, VNet-to-VNet, and P2S connections.

> [!div class="nextstepaction"]
> * [Create S2S connections](vpn-gateway-tutorial-vpnconnection-powershell.md)
> * [Create VNet-to-VNet connections](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
> * [Create P2S connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
