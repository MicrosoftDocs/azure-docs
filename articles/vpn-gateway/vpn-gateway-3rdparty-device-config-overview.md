---
title: 'Partner VPN device configurations for connecting to Azure VPN gateways'
description: Learn about partner VPN device configurations for connecting to Azure VPN gateways.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Overview of partner VPN device configurations
This article provides an overview of configuring on-premises VPN devices for connecting to Azure VPN gateways. A sample Azure virtual network and VPN gateway setup is used to show you how to connect to different on-premises VPN device configurations by using the same parameters.



## Device requirements
Azure VPN gateways use standard IPsec/IKE protocol suites for site-to-site (S2S) VPN tunnels. For a list of IPsec/IKE parameters and cryptographic algorithms for Azure VPN gateways, see [About VPN devices](vpn-gateway-about-vpn-devices.md). You can also specify the exact algorithms and key strengths for a specific connection as described in [About cryptographic requirements](vpn-gateway-about-compliance-crypto.md).

## <a name ="singletunnel"></a>Single VPN tunnel
The first configuration in the sample consists of a single S2S VPN tunnel between an Azure VPN gateway and an on-premises VPN device. You can optionally configure the [Border Gateway Protocol (BGP) across the VPN tunnel](#bgp).

![Diagram of a single S2S VPN tunnel](./media/vpn-gateway-3rdparty-device-config-overview/singletunnel.png)

For step-by-step instructions to set up a single VPN tunnel, see [Configure a site-to-site connection](./tutorial-site-to-site-portal.md). The following sections specify the connection parameters for the sample configuration and provide a PowerShell script to help you get started.

### Connection parameters
This section lists the parameters for the examples that are described in the previous sections.

| **Parameter**                | **Value**                    |
| ---                          | ---                          |
| Virtual network address prefixes        | 10.11.0.0/16<br>10.12.0.0/16 |
| Azure VPN gateway IP         | Azure VPN Gateway IP         |
| On-premises address prefixes | 10.51.0.0/16<br>10.52.0.0/16 |
| On-premises VPN device IP    | On-premises VPN device IP    |
| * Virtual network BGP ASN                | 65010                        |
| * Azure BGP peer IP           | 10.12.255.30                 |
| * On-premises BGP ASN         | 65050                        |
| * On-premises BGP peer IP     | 10.52.255.254                |

\* Optional parameter for BGP only.

### Sample PowerShell script
This section provides a sample script to get you started. For detailed instructions, see [Create an S2S VPN connection by using PowerShell](vpn-gateway-create-site-to-site-rm-powershell.md).

```powershell
# Declare your variables

$Sub1          = "Replace_With_Your_Subscription_Name"
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

Connect-AzAccount
Select-AzSubscription -SubscriptionName $Sub1
New-AzResourceGroup -Name $RG1 -Location $Location1

# Create virtual network

$fesub1 = New-AzVirtualNetworkSubnetConfig -Name $FESubName1 -AddressPrefix $FESubPrefix1 $besub1 = New-AzVirtualNetworkSubnetConfig -Name $BESubName1 -AddressPrefix $BESubPrefix1
$gwsub1 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName1 -AddressPrefix $GWSubPrefix1

New-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1 -Location $Location1 -AddressPrefix $VNetPrefix11,$VNetPrefix12 -Subnet $fesub1,$besub1,$gwsub1

# Create VPN gateway

$gwpip1    = New-AzPublicIpAddress -Name $GWIPName1 -ResourceGroupName $RG1 -Location $Location1 -AllocationMethod Dynamic
$vnet1     = Get-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1
$subnet1   = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet1
$gwipconf1 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName1 -Subnet $subnet1 -PublicIpAddress $gwpip1

New-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1 -Location $Location1 -IpConfigurations $gwipconf1 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw1 -Asn $VNet1ASN

# Create local network gateway

New-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1 -Location $Location1 -GatewayIpAddress $LNGIP5 -AddressPrefix $LNGPrefix51,$LNGPrefix52 -Asn $LNGASN5 -BgpPeeringAddress $BGPPeerIP5

# Create the S2S VPN connection

$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1  -ResourceGroupName $RG1
$lng5gw  = Get-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1

New-AzVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $False
```

### <a name ="policybased"></a>(Optional) Use custom IPsec/IKE policy with UsePolicyBasedTrafficSelectors
If your VPN devices don't support any-to-any traffic selectors, such as route-based or VTI-based configurations, create a custom IPsec/IKE policy with the [UsePolicyBasedTrafficSelectors](vpn-gateway-connect-multiple-policybased-rm-ps.md) option.

> [!IMPORTANT]
> You must create an IPsec/IKE policy to enable the **UsePolicyBasedTrafficSelectors** option on the connection.


The sample script creates an IPsec/IKE policy with the following algorithms and parameters:
* IKEv2: AES256, SHA384, DHGroup24
* IPsec: AES256, SHA1, PFS24, SA Lifetime 7,200 seconds, and 20,480,000 KB (20 GB)

The script applies the IPsec/IKE policy and enables the **UsePolicyBasedTrafficSelectors** option on the connection.

```powershell
$ipsecpolicy5 = New-AzIpsecPolicy -IkeEncryption AES256 -IkeIntegrity SHA384 -DhGroup DHGroup24 -IpsecEncryption AES256 -IpsecIntegrity SHA1 -PfsGroup PFS24 -SALifeTimeSeconds 7200 -SADataSizeKilobytes 20480000

$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1  -ResourceGroupName $RG1
$lng5gw  = Get-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1

New-AzVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $False -IpsecPolicies $ipsecpolicy5 -UsePolicyBasedTrafficSelectors $True
```

### <a name ="bgp"></a>(Optional) Use BGP on S2S VPN connection
When you create the S2S VPN connection, you can optionally use [BGP for the VPN gateway](vpn-gateway-bgp-resource-manager-ps.md). This approach has two differences:

* The on-premises address prefixes can be a single host address. The on-premises BGP peer IP address is specified as follows:

    ```powershell
    New-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG1 -Location $Location1 -GatewayIpAddress $LNGIP5 -AddressPrefix $LNGPrefix50 -Asn $LNGASN5 -BgpPeeringAddress $BGPPeerIP5
    ```

* When you create the connection, you must set the **-EnableBGP** option to $True:

    ```powershell
    New-AzVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $True
    ```

## Next steps
For step-by-step instructions to set up active-active VPN gateways, see [Configuring active-active VPN gateways for cross-premises and VNet-to-VNet connections](vpn-gateway-activeactive-rm-powershell.md).
