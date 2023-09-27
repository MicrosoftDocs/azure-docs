---
title: 'Configure BGP for VPN Gateway: PowerShell'
titleSuffix: Azure VPN Gateway
description: Learn how to configure BGP for VPN gateways using PowerShell.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/12/2023
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell
---
# How to configure BGP for VPN Gateway: PowerShell

This article helps you enable BGP on cross-premises site-to-site (S2S) VPN connections and VNet-to-VNet connections using Azure PowerShell. If you aren't familiar with this type of configuration, you may find it easier to use the [Azure portal](bgp-howto.md) version of this article.

BGP is the standard routing protocol commonly used in the Internet to exchange routing and reachability information between two or more networks. BGP enables the VPN gateways and your on-premises VPN devices, called BGP peers or neighbors, to exchange "routes" that will inform both gateways on the availability and reachability for those prefixes to go through the gateways or routers involved. BGP can also enable transit routing among multiple networks by propagating routes a BGP gateway learns from one BGP peer to all other BGP peers.

For more information about the benefits of BGP and to understand the technical requirements and considerations of using BGP, see [About BGP and Azure VPN Gateway](vpn-gateway-bgp-overview.md).

## Getting started

Each part of this article helps you form a basic building block for enabling BGP in your network connectivity. If you complete all three parts (configure BGP on the gateway, S2S connection, and VNet-to-VNet connection) you build the topology as shown in Diagram 1. You can combine these sections to build a more complex multihop transit network that meets your needs.

**Diagram 1**

:::image type="content" source="./media/bgp-howto/vnet-to-vnet.png" alt-text="Diagram showing network architecture and settings." border="false":::

## <a name ="enablebgp"></a>Enable BGP for the VPN gateway

This section is required before you perform any of the steps in the other two configuration sections. The following configuration steps set up the BGP parameters of the VPN gateway as shown in Diagram 2.

**Diagram 2**

:::image type="content" source="./media/bgp-howto/gateway.png" alt-text="Diagram showing settings for the virtual network gateway." border="false":::

### Before you begin

You can run the steps for this exercise using Azure Cloud Shell in your browser. If you want to use PowerShell directly from your computer instead, install the Azure Resource Manager PowerShell cmdlets. For more information about installing the PowerShell cmdlets, see [How to install and configure Azure PowerShell](/powershell/azure/).

### Create and configure VNet1

#### 1. Declare your variables

For this exercise, we start by declaring variables. The following example declares the variables using the values for this exercise. You can use the example variables (with the exception of subscription name) if you're running through the steps to become familiar with this type of configuration. Modify any variables, and then copy and paste into your PowerShell console. Be sure to replace the values with your own when configuring for production.

```azurepowershell-interactive
$Sub1 = "Replace_With_Your_Subscription_Name"
$RG1 = "TestRG1"
$Location1 = "East US"
$VNetName1 = "TestVNet1"
$FESubName1 = "FrontEnd"
$BESubName1 = "Backend"
$GWSubName1 = "GatewaySubnet"
$VNetPrefix11 = "10.11.0.0/16"
$VNetPrefix12 = "10.12.0.0/16"
$FESubPrefix1 = "10.11.0.0/24"
$BESubPrefix1 = "10.12.0.0/24"
$GWSubPrefix1 = "10.12.255.0/27"
$VNet1ASN = 65010
$DNS1 = "8.8.8.8"
$GWName1 = "VNet1GW"
$GWIPName1 = "VNet1GWIP"
$GWIPconfName1 = "gwipconf1"
$Connection12 = "VNet1toVNet2"
$Connection15 = "VNet1toSite5"
```

#### 2. Connect to your subscription and create a new resource group

To use the Resource Manager cmdlets, Make sure you switch to PowerShell mode. For more information, see [Using Windows PowerShell with Resource Manager](../azure-resource-manager/management/manage-resources-powershell.md).

If you use Azure Cloud Shell, you automatically connect to your account. If you use PowerShell from your computer, open your PowerShell console and connect to your account. Use the following sample to help you connect:

```azurepowershell-interactive
Connect-AzAccount
Select-AzSubscription -SubscriptionName $Sub1
New-AzResourceGroup -Name $RG1 -Location $Location1
```

Next, create a new resource group.

```azurepowershell-interactive
New-AzResourceGroup -Name $RG1 -Location $Location1
```

#### 3. Create TestVNet1

The following sample creates a virtual network named TestVNet1 and three subnets, one called GatewaySubnet, one called FrontEnd, and one called Backend. When substituting values, it's important that you always name your gateway subnet specifically GatewaySubnet. If you name it something else, your gateway creation fails.

```azurepowershell-interactive
$fesub1 = New-AzVirtualNetworkSubnetConfig -Name $FESubName1 -AddressPrefix $FESubPrefix1
$besub1 = New-AzVirtualNetworkSubnetConfig -Name $BESubName1 -AddressPrefix $BESubPrefix1
$gwsub1 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName1 -AddressPrefix $GWSubPrefix1

New-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1 -Location $Location1 -AddressPrefix $VNetPrefix11,$VNetPrefix12 -Subnet $fesub1,$besub1,$gwsub1
```

### Create the VPN gateway with BGP enabled

#### 1. Create the IP and subnet configurations

Request a public IP address to be allocated to the gateway you'll create for your VNet. You'll also define the required subnet and IP configurations.

```azurepowershell-interactive
$gwpip1 = New-AzPublicIpAddress -Name $GWIPName1 -ResourceGroupName $RG1 -Location $Location1 -AllocationMethod Dynamic

$vnet1 = Get-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1
$subnet1 = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet1
$gwipconf1 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName1 -Subnet $subnet1 -PublicIpAddress $gwpip1
```

#### 2. Create the VPN gateway with the AS number

Create the virtual network gateway for TestVNet1. BGP requires a Route-Based VPN gateway, and also an additional parameter *-Asn* to set the ASN (AS Number) for TestVNet1. Make sure to specify the *-Asn* parameter. If you don't set the -Asn parameter, ASN 65515 (which does not work for this configuration) is assigned by default. Creating a gateway can take a while (45 minutes or more to complete).

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1 -Location $Location1 -IpConfigurations $gwipconf1 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw1 -Asn $VNet1ASN
```

Once the gateway is created, you can use this gateway to establish cross-premises connection or VNet-to-VNet connection with BGP.

#### 3. Get the Azure BGP Peer IP address

Once the gateway is created, you need to obtain the BGP Peer IP address on the VPN gateway. This address is needed to configure the VPN gateway as a BGP Peer for your on-premises VPN devices.

If you are using CloudShell, you may need to reestablish your variables if the session timed out while creating your gateway.

Reestablish variables if necessary:

```azurepowershell-interactive
$RG1 = "TestRG1"
$GWName1 = "VNet1GW"
```

Run the following command and note the "BgpPeeringAddress" value from the output.

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1
$vnet1gw.BgpSettingsText
```

Example output:

```PowerShell
$vnet1gw.BgpSettingsText
{
    "Asn": 65010,
    "BgpPeeringAddress": "10.12.255.30",
    "PeerWeight": 0
}
```

If you don't see the BgpPeeringAddress displayed as an IP address, your gateway is still being configured. Try again when the gateway is complete.

## Establish a cross-premises connection with BGP

To establish a cross-premises connection, you need to create a *local network gateway* to represent your on-premises VPN device, and a *connection* to connect the VPN gateway with the local network gateway as explained in [Create site-to-site connection](tutorial-site-to-site-portal.md). The following sections contain the properties required to specify the BGP configuration parameters, shown in Diagram 3.

**Diagram 3**

:::image type="content" source="./media/bgp-howto/cross-premises.png" alt-text="Diagram showing IPsec configuration." border="false":::

Before proceeding, make sure you enabled BGP for the VPN gateway in the previous section.

### Step 1: Create and configure the local network gateway

#### 1. Declare your variables

This exercise continues to build the configuration shown in the diagram. Be sure to replace the values with the ones that you want to use for your configuration. For example, you need to the IP address for your VPN device. For this exercise, you can substitute a valid IP address if you don't plan on connecting to your VPN device at this time. You can later replace the IP address.

```azurepowershell-interactive
$RG5 = "TestRG5"
$Location5 = "West US"
$LNGName5 = "Site5"
$LNGPrefix50 = "10.51.255.254/32"
$LNGIP5 = "4.3.2.1"
$LNGASN5 = 65050
$BGPPeerIP5 = "10.51.255.254"
```

A couple of things to note regarding the local network gateway parameters:

* The local network gateway can be in the same or different location and resource group as the VPN gateway. This example shows them in different resource groups in different locations.
* The prefix you need to declare for the local network gateway is the host address of your BGP Peer IP address on your VPN device. In this case, it's a /32 prefix of "10.51.255.254/32".
* As a reminder, you must use different BGP ASNs between your on-premises networks and Azure VNet. If they're the same, you need to change your VNet ASN if your on-premises VPN device already uses the ASN to peer with other BGP neighbors.

#### 2. Create the local network gateway for Site5

Create the resource group before you create the local network gateway.

```azurepowershell-interactive
New-AzResourceGroup -Name $RG5 -Location $Location5
```

Create the local network gateway. Notice the two additional parameters for the local network gateway: Asn and BgpPeerAddress.

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG5 -Location $Location5 -GatewayIpAddress $LNGIP5 -AddressPrefix $LNGPrefix50 -Asn $LNGASN5 -BgpPeeringAddress $BGPPeerIP5
```

### Step 2: Connect the VNet gateway and local network gateway

#### 1. Get the two gateways

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1  -ResourceGroupName $RG1
$lng5gw  = Get-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG5
```

#### 2. Create the TestVNet1 to Site5 connection

In this step, you create the connection from TestVNet1 to Site5. You must specify "-EnableBGP $True" to enable BGP for this connection. As discussed earlier, it's possible to have both BGP and non-BGP connections for the same VPN gateway. Unless BGP is enabled in the connection property, Azure won't enable BGP for this connection even though BGP parameters are already configured on both gateways.

Redeclare your variables if necessary:

```azurepowershell-interactive
$Connection15 = "VNet1toSite5"
$Location1 = "East US"
```

Then run the following command:

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $True
```

#### On-premises device configuration

The following example lists the parameters you enter into the BGP configuration section on your on-premises VPN device for this exercise:

```
- Site5 ASN            : 65050
- Site5 BGP IP         : 10.51.255.254
- Prefixes to announce : (for example) 10.51.0.0/16
- Azure VNet ASN       : 65010
- Azure VNet BGP IP    : 10.12.255.30
- Static route         : Add a route for 10.12.255.30/32, with nexthop being the VPN tunnel interface on your device
- eBGP Multihop        : Ensure the "multihop" option for eBGP is enabled on your device if needed
```

The connection is established after a few minutes, and the BGP peering session starts once the IPsec connection is established.

## Establish a VNet-to-VNet connection with BGP

This section adds a VNet-to-VNet connection with BGP, as shown in the Diagram 4.

**Diagram 4**

:::image type="content" source="./media/bgp-howto/vnet-to-vnet.png" alt-text="Diagram showing full network configuration." border="false":::

The following instructions continue from the previous steps. You must first complete the steps in the [Enable BGP for the VPN gateway](#enablebgp) section to create and configure TestVNet1 and the VPN gateway with BGP.

### Step 1: Create TestVNet2 and the VPN gateway

It's important to make sure that the IP address space of the new virtual network, TestVNet2, doesn't overlap with any of your VNet ranges.

In this example, the virtual networks belong to the same subscription. You can set up VNet-to-VNet connections between different subscriptions. For more information, see [Configure a VNet-to-VNet connection](vpn-gateway-vnet-vnet-rm-ps.md). Make sure you add the "-EnableBgp $True" when creating the connections to enable BGP.

#### 1. Declare your variables

Be sure to replace the values with the ones that you want to use for your configuration.

```azurepowershell-interactive
$RG2 = "TestRG2"
$Location2 = "East US"
$VNetName2 = "TestVNet2"
$FESubName2 = "FrontEnd"
$BESubName2 = "Backend"
$GWSubName2 = "GatewaySubnet"
$VNetPrefix21 = "10.21.0.0/16"
$VNetPrefix22 = "10.22.0.0/16"
$FESubPrefix2 = "10.21.0.0/24"
$BESubPrefix2 = "10.22.0.0/24"
$GWSubPrefix2 = "10.22.255.0/27"
$VNet2ASN = 65020
$DNS2 = "8.8.8.8"
$GWName2 = "VNet2GW"
$GWIPName2 = "VNet2GWIP"
$GWIPconfName2 = "gwipconf2"
$Connection21 = "VNet2toVNet1"
$Connection12 = "VNet1toVNet2"
```

#### 2. Create TestVNet2 in the new resource group

```azurepowershell-interactive
New-AzResourceGroup -Name $RG2 -Location $Location2

$fesub2 = New-AzVirtualNetworkSubnetConfig -Name $FESubName2 -AddressPrefix $FESubPrefix2
$besub2 = New-AzVirtualNetworkSubnetConfig -Name $BESubName2 -AddressPrefix $BESubPrefix2
$gwsub2 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName2 -AddressPrefix $GWSubPrefix2

New-AzVirtualNetwork -Name $VNetName2 -ResourceGroupName $RG2 -Location $Location2 -AddressPrefix $VNetPrefix21,$VNetPrefix22 -Subnet $fesub2,$besub2,$gwsub2
```

#### 3. Create the VPN gateway for TestVNet2 with BGP parameters

Request a public IP address to be allocated to the gateway you'll create for your VNet and define the required subnet and IP configurations.

Declare your variables.

```azurepowershell-interactive
$gwpip2    = New-AzPublicIpAddress -Name $GWIPName2 -ResourceGroupName $RG2 -Location $Location2 -AllocationMethod Dynamic

$vnet2     = Get-AzVirtualNetwork -Name $VNetName2 -ResourceGroupName $RG2
$subnet2   = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet2
$gwipconf2 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName2 -Subnet $subnet2 -PublicIpAddress $gwpip2
```

Create the VPN gateway with the AS number. You must override the default ASN on your VPN gateways. The ASNs for the connected VNets must be different to enable BGP and transit routing.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name $GWName2 -ResourceGroupName $RG2 -Location $Location2 -IpConfigurations $gwipconf2 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw1 -Asn $VNet2ASN
```

### Step 2: Connect the TestVNet1 and TestVNet2 gateways

In this example, both gateways are in the same subscription. You can complete this step in the same PowerShell session.

#### 1. Get both gateways

Reestablish variables if necessary:

```azurepowershell-interactive
$GWName1 = "VNet1GW"
$GWName2 = "VNet2GW"
$RG1 = "TestRG1"
$RG2 = "TestRG2"
$Connection12 = "VNet1toVNet2"
$Connection21 = "VNet2toVNet1"
$Location1 = "East US"
$Location2 = "East US"
```

Get both gateways.

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1
$vnet2gw = Get-AzVirtualNetworkGateway -Name $GWName2 -ResourceGroupName $RG2
```

#### 2. Create both connections

In this step, you create the connection from TestVNet1 to TestVNet2, and the connection from TestVNet2 to TestVNet1.

TestVNet1 to TestVNet2 connection.

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name $Connection12 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -VirtualNetworkGateway2 $vnet2gw -Location $Location1 -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3' -EnableBgp $True
```

TestVNet2 to TestVNet1 connection.

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name $Connection21 -ResourceGroupName $RG2 -VirtualNetworkGateway1 $vnet2gw -VirtualNetworkGateway2 $vnet1gw -Location $Location2 -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3' -EnableBgp $True
```

> [!IMPORTANT]
> Be sure to enable BGP for BOTH connections.

After completing these steps, the connection is established after a few minutes. The BGP peering session is up once the VNet-to-VNet connection is completed.

If you completed all three parts of this exercise, you've established the following network topology:

**Diagram 4**

:::image type="content" source="./media/bgp-howto/vnet-to-vnet.png" alt-text="Diagram showing full network" border="false":::

For context, referring to **Diagram 4**, if BGP were to be disabled between TestVNet2 and TestVNet1, TestVNet2 wouldn't learn the routes for the on-premises network, Site5, and therefore couldn't communicate with Site 5. Once you enable BGP, as shown in the Diagram 4, all three networks will be able to communicate over the S2S IPsec and VNet-to-VNet connections.

## Next steps

For more information about BGP, see [About BGP and VPN Gateway](vpn-gateway-bgp-overview.md).
