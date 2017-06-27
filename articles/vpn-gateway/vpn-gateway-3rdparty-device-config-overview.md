---
title: About 3rd party VPN device configuration | Microsoft Docs
description: This article provides an overview of 3rd party VPN device configurations for connecting to Azure VPN gateways.
services: vpn-gateway
documentationcenter: na
author: yushwang
manager: rossort
editor: ''
tags: ''

ms.assetid: a8bfc955-de49-4172-95ac-5257e262d7ea
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/20/2017
ms.author: yushwang

---
# Overview of 3rd party VPN device configurations
This article provides an overview of on-premises VPN device configurations for connecting to Azure VPN gateways. The sample Azure virtual network and VPN gateway setup will be used to connect to different on-premises VPN devices with the same parameters.

## Device requirements
Azure VPN gateways use standard IPsec/IKE protocol suites for S2S VPN tunnels. Refer to [About VPN devices](vpn-gateway-about-vpn-devices.md) for the detailed IPsec/IKE protocol parameters and default cryptographic algorithms for Azure VPN gateways. You can optionally specify the exact combination of cryptographic algorithms and key strengths for a specific connection as described in [About cryptographic requirements](vpn-gateway-about-compliance-crypto.md).

## <a name ="singletunnel"></a>Single VPN tunnel
The first topology consists of a single S2S VPN tunnel between an Azure VPN gateway and your on-premises VPN device. You can optionally configure BGP across the VPN tunnel.

![single tunnel](./media/vpn-gateway-3rdparty-device-config-overview/singletunnel.png)

Refer to [Configure site-to-site connection](vpn-gateway-howto-site-to-site-resource-manager-portal.md) for detailed, step-by-step guidance. The following sections list the parameters and provide a sample PowerShell script to help you get started.

### Network and VPN gateway information
This section list the parameters for the examples above.

| **Parameter**                | **Value**                    |
| ---                          | ---                          |
| VNet address prefixes        | 10.11.0.0/16<br>10.12.0.0/16 |
| Azure VPN gateway IP         | Azure VPN Gateway IP         |
| On-premises address prefixes | 10.51.0.0/16<br>10.52.0.0/16 |
| On-premises VPN device IP    | On-premises VPN device IP    |
| *VNet BGP ASN                | 65010                        |
| *Azure BGP peer IP           | 10.12.255.30                 |
| *On-premises BGP ASN         | 65050                        |
| *On-premises BGP peer IP     | 10.52.255.254                |

* (*) Optional parameters for BGP only

### Sample PowerShell script
[Create a S2S VPN connection using PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md) has the detailed instructions. This section provides a sample script to get you started.

```powershell
# Declare your variables

$Sub1          = "Replace_With_Your_Subcription_Name"
$RG1           = "TestRG1"
$Location1     = "East US 2"
$VNetName1     = "TestVNet1"
$FESubName1    = "FrontEnd"
$BESubName1    = "Backend"
$GWSubName1    = "GatewaySubnet"
$VNetPrefix11  = "10.11.0.0/16"
$VNetPrefix12  = "10.12.0.0/16"
$FESubPrefix1  = "10.11.0.0/24"
$BESubPrefix1  = "10.12.0.0/24"
$GWSubPrefix1  = "10.12.255.0/27"
$VNet1ASN      = 65010
$DNS1          = "8.8.8.8"
$GWName1       = "VNet1GW"
$GWIPName1     = "VNet1GWIP"
$GWIPconfName1 = "gwipconf1"
$Connection15  = "VNet1toSite5"
$LNGName5      = "Site5"
$LNGPrefix50   = "10.52.255.254/32"
$LNGPrefix51   = "10.51.0.0/16"
$LNGPrefix52   = "10.52.0.0/16"
$LNGIP5        = "Your_VPN_Device_IP"
$LNGASN5       = 65050
$BGPPeerIP5    = "10.52.255.254"

# Connect to your subscription and create a new resource group

Login-AzureRmAccount
Select-AzureRmSubscription -SubscriptionName $Sub1
New-AzureRmResourceGroup -Name $RG1 -Location $Location1

# Create virtual network

$fesub1 = New-AzureRmVirtualNetworkSubnetConfig -Name $FESubName1 -AddressPrefix $FESubPrefix1 $besub1 = New-AzureRmVirtualNetworkSubnetConfig -Name $BESubName1 -AddressPrefix $BESubPrefix1
$gwsub1 = New-AzureRmVirtualNetworkSubnetConfig -Name $GWSubName1 -AddressPrefix $GWSubPrefix1

New-AzureRmVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1 -Location $Location1 -AddressPrefix $VNetPrefix11,$VNetPrefix12 -Subnet $fesub1,$besub1,$gwsub1

# Create VPN gateway

$gwpip1    = New-AzureRmPublicIpAddress -Name $GWIPName1 -ResourceGroupName $RG1 -Location $Location1 -AllocationMethod Dynamic
$vnet1     = Get-AzureRmVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1
$subnet1   = Get-AzureRmVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet1
$gwipconf1 = New-AzureRmVirtualNetworkGatewayIpConfig -Name $GWIPconfName1 -Subnet $subnet1 -PublicIpAddress $gwpip1

New-AzureRmVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1 -Location $Location1 -IpConfigurations $gwipconf1 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw1 -Asn $VNet1ASN

# Create local network gateway

New-AzureRmLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1 -Location $Location1 -GatewayIpAddress $LNGIP5 -AddressPrefix $LNGPrefix51,$LNGPrefix52 -Asn $LNGASN5 -BgpPeeringAddress $BGPPeerIP5

# Create the S2S VPN connection

$vnet1gw = Get-AzureRmVirtualNetworkGateway -Name $GWName1  -ResourceGroupName $RG1
$lng5gw  = Get-AzureRmLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1

New-AzureRmVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $False
```

### <a name ="policybased"></a> [Optional] Use custom IPsec/IKE policy with "UsePolicyBasedTrafficSelectors"
If your VPN devices do not support "any-to-any" traffic selectors (route-based/VTI-based configuration), you will need to create a custom IPsec/IKE policy and configure "UsePolicyBasedTrafficSelectors" option as described in [this article](vpn-gateway-connect-multiple-policybased-rm-ps.md).

> [!IMPORTANT]
> You need to create an IPsec/IKE policy in order to enable "UsePolicyBasedTrafficSelectors" option
> on the connection.

The sample script below creates an IPsec/IKE policy with the following algorithms and parameters:
* IKEv2: AES256, SHA384, DHGroup24
* IPsec: AES256, SHA256, PFS24, SA Lifetime 7200 seconds & 2048000KB (2GB)

It then applies the policy and enables "UesPolicyBasedTrafficSelectors" on the connection.

```powershell
$ipsecpolicy5 = New-AzureRmIpsecPolicy -IkeEncryption AES256 -IkeIntegrity SHA384 -DhGroup DHGroup24 -IpsecEncryption AES256 -IpsecIntegrity SHA256 -PfsGroup PFS24 -SALifeTimeSeconds 7200 -SADataSizeKilobytes 2048000

$vnet1gw = Get-AzureRmVirtualNetworkGateway -Name $GWName1  -ResourceGroupName $RG1
$lng5gw  = Get-AzureRmLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1

New-AzureRmVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $False -IpsecPolicies $ipsecpolicy5 -UsePolicyBasedTrafficSelectors $True
```

### <a name ="bgp"></a>[Optional] Use BGP on S2S VPN connection
You can optionally use BGP on the connection. See [BGP for VPN gateway](vpn-gateway-bgp-resource-manager-ps.md). There are two differences:

The on-premises address prefixes can be a single host address, the on-premises BGP peer IP address:

```powershell
New-AzureRmLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1 -Location $Location1 -GatewayIpAddress $LNGIP5 -AddressPrefix $LNGPrefix50 -Asn $LNGASN5 -BgpPeeringAddress $BGPPeerIP5
```

You must set "-EnableBGP" to $True when creating the connection:

```powershell
New-AzureRmVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $True
```

## Next steps
See [Configuring Active-Active VPN Gateways for Cross-Premises and VNet-to-VNet Connections](vpn-gateway-activeactive-rm-powershell.md) for steps to configure active-active cross-premises and VNet-to-VNet connections.

