---
title: Create and Manage Azure S2S VPN connections using PowerShell | Microsoft Docs
description: Tutorial - Create and Manage S2S VPN connections with the Azure PowerShell module
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
ms.date: 05/08/2018
ms.author: yushwang
ms.custom: mvc
#Customer intent: I want to create an S2S VPN connection so that I can connect my VNet and on-premises network.
---

# Create and Manage S2S VPN connections with the Azure PowerShell module

Azure S2S VPN connections provide secure, cross-premises connectivity between customer premises and Azure. This tutorial walks through IPsec S2S VPN connection life cycles such as creating and managing a S2S VPN connection. You learn how to:

> [!div class="checklist"]
> * Create an S2S VPN connection
> * Update the connection property: pre-shared key, BGP, IPsec/IKE policy
> * Add more VPN connections
> * Delete a VPN connection

The following diagram shows the topology for this tutorial:

![Site-to-Site VPN connection diagram](./media/vpn-gateway-tutorial-vpnconnection-powershell/site-to-site-diagram.png)

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.3 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

## Requirements

Complete the first tutorial: "[Create VPN gateway with Azure PowerShell](vpn-gateway-tutorial-create-gateway-powershell.md)" to create the following resources:

1. Resource group (TestRG1), virtual network (VNet1), and GatewaySubnet
2. VPN gateway (VNet1GW)

The virtual network parameter values are listed below. Note the additional values for the local network gateway to represent your on-premises network. Change the values based on your environment and network setup.

```azurepowershell-interactive
# Virtual network
$RG1         = "TestRG1"
$VNet1       = "VNet1"
$Location1   = "East US"
$VNet1Prefix = "10.1.0.0/16"
$VNet1ASN    = 65010
$Gw1         = "VNet1GW"

# On-premises network
$LNG1        = "VPNsite1"
$LNGprefix1  = "10.101.0.0/24"
$LNGprefix2  = "10.101.1.0/24"
$LNGIP1      = "YourDevicePublicIP"

# Optional - on-premises BGP properties
$LNGASN1     = 65011
$BGPPeerIP1  = "10.101.1.254"

# Connection
$Connection1 = "VNet1ToSite1"
```

The workflow to create an S2S VPN connection is straightforward:

1. Create a local network gateway to represent your on-premises network
2. Create a connection between your Azure VPN gateway and the local network gateway

## Create a local network gateway

A local network gateway represents your on-premises network. You can specify the properties of your on-premises network in the local network gateway, including:

* Public IP address of your VPN device
* On-premises address space
* (Optional) BGP attributes (BGP peer IP address and AS number)

Create a local network gateway with the [New-AzureRmLocalNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermlocalnetworkgateway?view=azurermps-6.8.1) command.

```azurepowershell-interactive
New-AzureRmLocalNetworkGateway -Name $LNG1 -ResourceGroupName $RG1 `
  -Location 'East US' -GatewayIpAddress $LNGIP1 -AddressPrefix $LNGprefix1,$LNGprefix2
```

## Create a S2S VPN connection

Next, create a Site-to-Site VPN connection between your virtual network gateway and your VPN device with the [New-AzureRmVirtualNetworkGatewayConnection](https://docs.microsoft.com/powershell/module/azurerm.network/new-azurermvirtualnetworkgatewayconnection?view=azurermps-6.8.1). Notice that the '-ConnectionType' for Site-to-Site VPN is *IPsec*.

```azurepowershell-interactive
$vng1 = Get-AzureRmVirtualNetworkGateway -Name $GW1  -ResourceGroupName $RG1
$lng1 = Get-AzureRmLocalNetworkGateway   -Name $LNG1 -ResourceGroupName $RG1

New-AzureRmVirtualNetworkGatewayConnection -Name $Connection1 -ResourceGroupName $RG1 `
  -Location $Location1 -VirtualNetworkGateway1 $vng1 -LocalNetworkGateway2 $lng1 `
  -ConnectionType IPsec -SharedKey "Azure@!b2C3"
```

Add the optional "**-EnableBGP $True**" property to enable BGP for the connection if you are using BGP. It is disabled by default.

## Update the VPN connection pre-shared key, BGP, and IPsec/IKE policy

### View and update your pre-shared key

Azure S2S VPN connection uses a pre-shared key (secret) to authenticate between your on-premises VPN device and the Azure VPN gateway. You can view and update the pre-shared key for a connection with [Get-AzureRmVirtualNetworkGatewayConnectionSharedKey](https://docs.microsoft.com/powershell/module/azurerm.network/get-azurermvirtualnetworkgatewayconnectionsharedkey?view=azurermps-6.8.1) and [Set-AzureRmVirtualNetworkGatewayConnectionSharedKey](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermvirtualnetworkgatewayconnectionsharedkey?view=azurermps-6.8.1).

> [!IMPORTANT]
> The pre-shared key is a string of **printable ASCII characters** no longer than 128 in length.

This command shows the pre-shared key for the connection:

```azurepowershell-interactive
Get-AzureRmVirtualNetworkGatewayConnectionSharedKey `
  -Name $Connection1 -ResourceGroupName $RG1
```

The output will be "**Azure@!b2C3**" following the example above. Use the command below to change the pre-shared key value to "**Azure@!_b2=C3**":

```azurepowershell-interactive
Set-AzureRmVirtualNetworkGatewayConnectionSharedKey `
  -Name $Connection1 -ResourceGroupName $RG1 `
  -Value "Azure@!_b2=C3"
```

### Enable BGP on VPN connection

Azure VPN gateway supports BGP dynamic routing protocol. You can enable BGP on each individual connection, depending on whether you are using BGP in your on-premises networks and devices. Specify the following BGP properties before enabling BGP on the connection:

* Azure VPN ASN (Autonomous System Number)
* On-premises local network gateway ASN
* On-premises local network gateway BGP peer IP address

If you have not configured the BGP properties, use the following commands to add these properties to your VPN gateway and local network gateway: [Set-AzureRmVirtualNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermvirtualnetworkgateway?view=azurermps-6.8.1) and [Set-AzureRmLocalNetworkGateway](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermlocalnetworkgateway?view=azurermps-6.8.1).

```azurepowershell-interactive
$vng1 = Get-AzureRmVirtualNetworkGateway -Name $GW1  -ResourceGroupName $RG1
Set-AzureRmVirtualNetworkGateway -VirtualNetworkGateway $vng1 -Asn $VNet1ASN

$lng1 = Get-AzureRmLocalNetworkGateway   -Name $LNG1 -ResourceGroupName $RG1
Set-AzureRmLocalNetworkGateway -LocalNetworkGateway $lng1 `
  -Asn $LNGASN1 -BgpPeeringAddress $BGPPeerIP1
```

Enable BGP with [Set-AzureRmVirtualNetworkGatewayConnection](https://docs.microsoft.com/powershell/module/azurerm.network/set-azurermvirtualnetworkgatewayconnection?view=azurermps-6.8.1).

```azurepowershell-interactive
$connection = Get-AzureRmVirtualNetworkGatewayConnection `
  -Name $Connection1 -ResourceGroupName $RG1

Set-AzureRmVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection `
  -EnableBGP $True
```

You can disable BGP by changing the "-EnableBGP" property value to **$False**. Refer to [BGP on Azure VPN gateways](vpn-gateway-bgp-resource-manager-ps.md) for more detailed explanations of BGP on Azure VPN gateways.

### Apply a custom IPsec/IKE policy on the connection

You can apply an optional IPsec/IKE policy to specify the exact combination of IPsec/IKE cryptographic algorithms and key strengths on the connection, instead of using the [default proposals](vpn-gateway-about-vpn-devices.md#ipsec). The following sample script creates a different IPsec/IKE policy with the following algorithms and parameters:

* IKEv2: AES256, SHA256, DHGroup14
* IPsec: AES128, SHA1, PFS14, SA Lifetime 14,400 seconds & 102,400,000 KB

```azurepowershell-interactive
$connection = Get-AzureRmVirtualNetworkGatewayConnection -Name $Connection1 `
                -ResourceGroupName $RG1
$newpolicy  = New-AzureRmIpsecPolicy `
                -IkeEncryption AES256 -IkeIntegrity SHA256 -DhGroup DHGroup14 `
                -IpsecEncryption AES128 -IpsecIntegrity SHA1 -PfsGroup PFS2048 `
                -SALifeTimeSeconds 14400 -SADataSizeKilobytes 102400000

Set-AzureRmVirtualNetworkGatewayConnection -VirtualNetworkGatewayConnection $connection `
  -IpsecPolicies $newpolicy
```

Refer to [IPsec/IKE policy for S2S or VNet-to-VNet connections](vpn-gateway-ipsecikepolicy-rm-powershell.md) for a complete list of algorithms and instructions.

## Add another S2S VPN connection

To add an additional S2S VPN connection to the same VPN gateway, create another local network gateway, and create a new connection between the new local network gateway and the VPN gateway. Following the example in this article.

```azurepowershell-interactive
# On-premises network
$LNG2        = "VPNsite2"
$Location2   = "West US"
$LNGprefix21 = "10.102.0.0/24"
$LNGprefix22 = "10.102.1.0/24"
$LNGIP2      = "YourDevicePublicIP"
$Connection2 = "VNet1ToSite2"

New-AzureRmLocalNetworkGateway -Name $LNG2 -ResourceGroupName $RG1 `
  -Location $Location2 -GatewayIpAddress $LNGIP2 -AddressPrefix $LNGprefix21,$LNGprefix22

$vng1 = Get-AzureRmVirtualNetworkGateway -Name $GW1  -ResourceGroupName $RG1
$lng2 = Get-AzureRmLocalNetworkGateway   -Name $LNG2 -ResourceGroupName $RG1

New-AzureRmVirtualNetworkGatewayConnection -Name $Connection2 -ResourceGroupName $RG1 `
  -Location $Location1 -VirtualNetworkGateway1 $vng1 -LocalNetworkGateway2 $lng2 `
  -ConnectionType IPsec -SharedKey "AzureA1%b2_C3+"
```

There are now two S2S VPN connections to your Azure VPN gateway.

![MultiSite VPN connections](./media/vpn-gateway-tutorial-vpnconnection-powershell/multisite-connections.png)

## Delete a S2S VPN connection

Delete a S2S VPN connection with [Remove-AzureRmVirtualNetworkGatewayConnection](https://docs.microsoft.com/powershell/module/azurerm.network/remove-azurermvirtualnetworkgatewayconnection?view=azurermps-6.8.1).

```azurepowershell-interactive
Remove-AzureRmVirtualNetworkGatewayConnection -Name $Connection2 -ResourceGroupName $RG1
```

Delete the local network gateway if you no longer need it. You cannot delete a local network gateway if there are other connections associated with it.

```azurepowershell-interactive
Remove-AzureRmVirtualNetworkGatewayConnection -Name $LNG2 -ResourceGroupName $RG1
```

## Next steps

In this tutorial, you learned about creating and managing S2S VPN connections such as how to:

> [!div class="checklist"]
> * Create an S2S VPN connection
> * Update the connection property: pre-shared key, BGP, IPsec/IKE policy
> * Add more VPN connections
> * Delete a VPN connection

Advance to the following tutorials to learn about S2S, VNet-to-VNet, and P2S connections.

> [!div class="nextstepaction"]
> * [Create VNet-to-VNet connections](vpn-gateway-howto-vnet-vnet-resource-manager-portal.md)
> * [Create P2S connections](vpn-gateway-howto-point-to-site-resource-manager-portal.md)
