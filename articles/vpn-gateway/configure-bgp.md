---
title: Configure BGP for Azure VPN Gateway
titleSuffix: Azure VPN Gateway
description: Learn how to configure BGP for Azure VPN Gateway by using the Azure portal, Azure PowerShell, or Azure CLI.
author: duongau
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 08/27/2026
ms.author: duau
zone_pivot_groups: vpn-bgp-deployment-method

# Customer intent: As a network administrator, I want to configure BGP for my VPN gateway, so that I can enable dynamic routing and enhance connectivity between my on-premises networks and Azure resources.
---
# How to configure BGP for Azure VPN Gateway

This article helps you configure Border Gateway Protocol (BGP) for Azure VPN Gateway by using the Azure portal, Azure PowerShell, or Azure CLI. The procedures cover BGP-enabled VPN gateways, cross-premises site-to-site (S2S) connections, and VNet-to-VNet connections.

BGP exchanges routing and reachability information between networks. Azure VPN gateways and on-premises VPN devices act as BGP peers or neighbors. They exchange routes that identify which gateways or routers can reach specific network prefixes. BGP can also provide transit routing by propagating routes that a gateway learns from one BGP peer to other BGP peers.

For more information about the benefits of BGP and to understand the technical requirements and considerations of using BGP, see [About BGP and Azure VPN Gateway](vpn-gateway-bgp-overview.md).

## Getting started

This article has three parts: configure BGP on a VPN gateway, configure BGP on an S2S connection, and configure BGP on a VNet-to-VNet connection. Complete all three parts to build the topology in Diagram 1. You can also complete individual parts when the required gateway and connection resources already exist.

**Diagram 1**

:::image type="content" source="./media/bgp-howto/vnet-to-vnet.png" alt-text="Diagram showing network architecture and settings." border="false":::

If BGP is disabled between TestVNet2 and TestVNet1, TestVNet2 doesn't learn the routes for the on-premises network, Site5, and can't communicate with Site5. When you enable BGP, all three networks can communicate over the S2S IPsec and VNet-to-VNet connections.

### Prerequisites

* Verify that you have an Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
* Use a route-based VPN gateway. BGP isn't supported on policy-based VPN gateways or the Basic gateway SKU.
* Use different ASNs for connected BGP peers. Azure assigns ASN 65515 to a VPN gateway by default. This ASN is valid for the Azure gateway, but Azure reserves it and an on-premises peer can't reuse it. The examples use ASNs 65010 and 65020 for the Azure gateways.

## BGP configuration considerations

The following considerations apply to all three deployment methods:

* Azure automatically assigns one BGP peer IP address from `GatewaySubnet` to an active-standby VPN gateway and two addresses to an active-active VPN gateway.
* Use public or private ASNs, including 32-bit ASNs. Don't use ASNs reserved by Azure or the Internet Assigned Numbers Authority (IANA). For the supported and reserved values, see [What ASNs can I use?](vpn-gateway-vpn-faq.md#what-asns-can-i-use).
* If your on-premises VPN device uses an Automatic Private IP Addressing (APIPA) address as its BGP peer IP, configure a custom Azure APIPA BGP address in the range `169.254.21.0` through `169.254.22.255`.
* Custom APIPA BGP addresses must be unique across your on-premises VPN devices and all connected VPN gateways.
* When you use APIPA addresses, Azure VPN Gateway doesn't initiate the BGP peering session. The on-premises VPN device must initiate the connection.
* If a local network gateway uses an APIPA BGP peer IP, VPN Gateway uses the corresponding custom Azure APIPA address. If the peer uses a regular private IP address, VPN Gateway uses its automatically assigned `GatewaySubnet` BGP peer address.

:::zone pivot="azure-portal"

## Azure portal

### 1. Create TestVNet1

Use [Create a virtual network and VPN gateway](tutorial-create-gateway-portal.md) to create TestVNet1 with these values:

* Resource group: TestRG1
* Region: East US
* Address spaces: 10.11.0.0/16 and 10.12.0.0/16
* FrontEnd subnet: 10.11.0.0/24
* BackEnd subnet: 10.12.0.0/24
* GatewaySubnet: 10.12.255.0/27

### 2. Create TestVNet1 gateway with BGP

The following settings create the BGP-enabled gateway shown in Diagram 2.

**Diagram 2**

:::image type="content" source="./media/bgp-howto/gateway.png" alt-text="Diagram showing settings for the virtual network gateway." border="false":::

1. Create the gateway by using [Create and manage a VPN gateway](tutorial-create-gateway-portal.md) and these values:

    * Name: VNet1GW
    * Region: East US
    * Gateway type: VPN
    * VPN type: Route-based
    * SKU: `VpnGw2AZ`
    * Virtual network: TestVNet1
    * Public IP address: Create new
    * Public IP address name: VNet1GWIP
    * Public IP address SKU: Standard
    * Assignment: Static
    * Enable active-active mode: Disabled
    * Configure BGP: Enabled
    * ASN: 65010

1. For an active-standby gateway whose on-premises peer uses APIPA, enter a unique address such as `169.254.21.2` for **Azure APIPA BGP IP address**.
1. Select **Review + create**. After validation succeeds, select **Create**. Deployment can take 45 minutes or longer.

For active-active gateways, the portal displays fields for both gateway instances and allows multiple custom APIPA addresses. Each address must be unique and in the allowed range. For an advanced active-active APIPA example, see [Configure active-active BGP connections with AWS](vpn-gateway-howto-aws-bgp.md).

### 3. Get the Azure BGP peer IP addresses

1. Go to the VNet1GW resource.
1. Select **Configuration**.
1. Record the ASN, public IP address, and **BGP Peer IP address**. An active-active gateway displays addresses for both instances.

### 4. Establish a cross-premises S2S connection with BGP

Diagram 3 shows the local network gateway and connection settings.

**Diagram 3**

:::image type="content" source="./media/bgp-howto/cross-premises.png" alt-text="Diagram showing IPsec configuration." border="false":::

#### Create the local network gateway

1. Create a local network gateway by using [Create a site-to-site connection](tutorial-site-to-site-portal.md#LocalNetworkGateway).
1. On the **Basics** page, enter these values:

    * Name: Site5
    * Region: West US
    * Endpoint IP address: The public IP address of the on-premises VPN device, such as 128.9.9.9
    * Address space: 10.51.255.254/32

1. On the **Advanced** page, enter these values:

    * Configure BGP settings: Yes
    * Autonomous system number (ASN): 65050
    * BGP peer IP address: 10.51.255.254

1. Select **Review + create**, and then select **Create**.

The ASN and BGP peer IP must match the on-premises VPN device. If this connection uses only BGP, you can leave the address space empty. If it doesn't use BGP, enter every required address prefix.

#### Create or update the S2S connection

1. On VNet1GW, select **Connections**, and then select **Add**.
1. Create the VNet1toSite5 connection, select Site5 as the local network gateway, enter a shared key, and select **Enable BGP**.
1. To enable BGP on an existing connection, open the connection, select **Configuration**, set **BGP** to **Enabled**, and then select **Save**.

Configure the on-premises VPN device with the Site5 ASN and peer IP, Azure ASN 65010, and the Azure peer IP that you recorded. Advertise the required on-premises prefixes and configure eBGP multihop if your device requires it.

### 5. Establish a VNet-to-VNet connection with BGP

Diagram 4 shows the completed topology.

**Diagram 4**

:::image type="content" source="./media/bgp-howto/vnet-to-vnet.png" alt-text="Diagram showing the completed BGP topology." border="false":::

1. Create `TestVNet2` in `TestRG2`, in East US, with these values:

    * Address spaces: `10.21.0.0/16` and `10.22.0.0/16`
    * FrontEnd subnet: `10.21.0.0/24`
    * BackEnd subnet: `10.22.0.0/24`
    * GatewaySubnet: `10.22.255.0/27`

1. Create `VNet2GW` by using the same gateway procedure and these values:

    * SKU: `VpnGw2AZ`
    * Public IP address name: `VNet2GWIP`
    * Public IP address SKU: Standard
    * Assignment: Static
    * Configure BGP: Enabled
    * ASN: `65020`

1. On `VNet1GW`, create the `VNet1toVNet2` connection. Select **VNet-to-VNet** as the connection type, select `VNet2GW` as the second gateway, and select **Enable BGP**.
1. On `VNet2GW`, create the `VNet2toVNet1` connection. Select `VNet1GW` as the second gateway and select **Enable BGP**.

> [!IMPORTANT]
> Enable BGP on both connections. Without BGP, routing is limited to the two connected virtual networks and doesn't provide transit to Site5.

:::zone-end

:::zone pivot="azure-powershell"

## Azure PowerShell

Run these commands in Azure Cloud Shell or in a local PowerShell session with the Az module. The procedure uses [New-AzVirtualNetworkGateway](/powershell/module/az.network/new-azvirtualnetworkgateway), [New-AzLocalNetworkGateway](/powershell/module/az.network/new-azlocalnetworkgateway), and [New-AzVirtualNetworkGatewayConnection](/powershell/module/az.network/new-azvirtualnetworkgatewayconnection).

### 1. Create TestVNet1

Declare the variables for TestVNet1.

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
$GWName1 = "VNet1GW"
$GWIPName1 = "VNet1GWIP"
$GWIPconfName1 = "gwipconf1"
$Connection12 = "VNet1toVNet2"
$Connection15 = "VNet1toSite5"
```

Connect and create TestRG1. This step is the only command that creates TestRG1 in the flow.

```azurepowershell-interactive
Connect-AzAccount
Select-AzSubscription -SubscriptionName $Sub1
New-AzResourceGroup -Name $RG1 -Location $Location1
```

Create TestVNet1 and its three subnets.

```azurepowershell-interactive
$fesub1 = New-AzVirtualNetworkSubnetConfig -Name $FESubName1 -AddressPrefix $FESubPrefix1
$besub1 = New-AzVirtualNetworkSubnetConfig -Name $BESubName1 -AddressPrefix $BESubPrefix1
$gwsub1 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName1 -AddressPrefix $GWSubPrefix1

New-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1 -Location $Location1 -AddressPrefix $VNetPrefix11,$VNetPrefix12 -Subnet $fesub1,$besub1,$gwsub1
```

### 2. Create TestVNet1 gateway with BGP by using PowerShell

**Diagram 2**

:::image type="content" source="./media/bgp-howto/gateway.png" alt-text="Diagram showing settings for the virtual network gateway." border="false":::

Create a Standard static public IP address and the gateway IP configuration.

```azurepowershell-interactive
$gwpip1 = New-AzPublicIpAddress -Name $GWIPName1 -ResourceGroupName $RG1 -Location $Location1 -AllocationMethod Static -Sku Standard

$vnet1 = Get-AzVirtualNetwork -Name $VNetName1 -ResourceGroupName $RG1
$subnet1 = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet1
$gwipconf1 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName1 -Subnet $subnet1 -PublicIpAddress $gwpip1
```

Create a route-based VpnGw2AZ gateway with ASN 65010. Azure assigns the gateway a private BGP peering address from the `GatewaySubnet` range.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1 -Location $Location1 -IpConfigurations $gwipconf1 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw2AZ -Asn $VNet1ASN -EnableBgp $True
```

If your on-premises BGP peer uses an APIPA address, configure a custom Azure APIPA BGP address from `169.254.21.0` through `169.254.22.255`. For more information, see [BGP and routing](vpn-gateway-vpn-faq.md#bgp).

### 3. Get the Azure BGP peer IP addresses

Reestablish variables if your Cloud Shell session timed out.

```azurepowershell-interactive
$RG1 = "TestRG1"
$GWName1 = "VNet1GW"
```

Get the gateway and record its BGP settings.

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1
$vnet1gw.BgpSettingsText
```

The output resembles this example.

```powershell
$vnet1gw.BgpSettingsText
{
   "Asn": 65010,
   "BgpPeeringAddress": "10.12.255.30",
   "PeerWeight": 0
}
```

If `BgpPeeringAddress` is empty, wait for the gateway deployment to finish and try again.

### 4. Establish a cross-premises S2S connection with BGP

**Diagram 3**

:::image type="content" source="./media/bgp-howto/cross-premises.png" alt-text="Diagram showing IPsec configuration." border="false":::

Declare the Site5 variables. Replace `$LNGIP5` with the public IP address of your on-premises VPN device.

```azurepowershell-interactive
$RG5 = "TestRG5"
$Location5 = "West US"
$LNGName5 = "Site5"
$LNGPrefix50 = "10.51.255.254/32"
$LNGIP5 = "4.3.2.1"
$LNGASN5 = 65050
$BGPPeerIP5 = "10.51.255.254"
```

Create the resource group.

```azurepowershell-interactive
New-AzResourceGroup -Name $RG5 -Location $Location5
```

Create the local network gateway with the on-premises ASN and BGP peer address.

```azurepowershell-interactive
New-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG5 -Location $Location5 -GatewayIpAddress $LNGIP5 -AddressPrefix $LNGPrefix50 -Asn $LNGASN5 -BgpPeeringAddress $BGPPeerIP5
```

Get both gateways.

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1
$lng5gw = Get-AzLocalNetworkGateway -Name $LNGName5 -ResourceGroupName $RG5
```

Redeclare the connection variables if necessary.

```azurepowershell-interactive
$Connection15 = "VNet1toSite5"
$Location1 = "East US"
```

Create the S2S connection and enable BGP.

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name $Connection15 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -LocalNetworkGateway2 $lng5gw -Location $Location1 -ConnectionType IPsec -SharedKey 'AzureA1b2C3' -EnableBGP $True
```

Configure the on-premises device with these values.

```
- Site5 ASN            : 65050
- Site5 BGP IP         : 10.51.255.254
- Prefixes to announce : (for example) 10.51.0.0/16
- Azure VNet ASN       : 65010
- Azure VNet BGP IP    : 10.12.255.30
- Static route         : Add a route for 10.12.255.30/32, with the next hop set to the VPN tunnel interface
- eBGP Multihop        : Enable eBGP multihop if your device requires it
```

### 5. Establish a VNet-to-VNet connection with BGP

**Diagram 4**

:::image type="content" source="./media/bgp-howto/vnet-to-vnet.png" alt-text="Diagram showing the completed BGP topology." border="false":::

Declare the TestVNet2 variables.

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
$GWName2 = "VNet2GW"
$GWIPName2 = "VNet2GWIP"
$GWIPconfName2 = "gwipconf2"
$Connection21 = "VNet2toVNet1"
$Connection12 = "VNet1toVNet2"
```

Create TestVNet2 and its subnets.

```azurepowershell-interactive
New-AzResourceGroup -Name $RG2 -Location $Location2

$fesub2 = New-AzVirtualNetworkSubnetConfig -Name $FESubName2 -AddressPrefix $FESubPrefix2
$besub2 = New-AzVirtualNetworkSubnetConfig -Name $BESubName2 -AddressPrefix $BESubPrefix2
$gwsub2 = New-AzVirtualNetworkSubnetConfig -Name $GWSubName2 -AddressPrefix $GWSubPrefix2

New-AzVirtualNetwork -Name $VNetName2 -ResourceGroupName $RG2 -Location $Location2 -AddressPrefix $VNetPrefix21,$VNetPrefix22 -Subnet $fesub2,$besub2,$gwsub2
```

Create the Standard static public IP address and gateway IP configuration.

```azurepowershell-interactive
$gwpip2 = New-AzPublicIpAddress -Name $GWIPName2 -ResourceGroupName $RG2 -Location $Location2 -AllocationMethod Static -Sku Standard

$vnet2 = Get-AzVirtualNetwork -Name $VNetName2 -ResourceGroupName $RG2
$subnet2 = Get-AzVirtualNetworkSubnetConfig -Name "GatewaySubnet" -VirtualNetwork $vnet2
$gwipconf2 = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName2 -Subnet $subnet2 -PublicIpAddress $gwpip2
```

Create `VNet2GW` with ASN 65020.

```azurepowershell-interactive
New-AzVirtualNetworkGateway -Name $GWName2 -ResourceGroupName $RG2 -Location $Location2 -IpConfigurations $gwipconf2 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw2AZ -Asn $VNet2ASN -EnableBgp $True
```

Reestablish variables if necessary.

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

Get both virtual network gateways.

```azurepowershell-interactive
$vnet1gw = Get-AzVirtualNetworkGateway -Name $GWName1 -ResourceGroupName $RG1
$vnet2gw = Get-AzVirtualNetworkGateway -Name $GWName2 -ResourceGroupName $RG2
```

Create the `TestVNet1`-to-`TestVNet2` connection.

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name $Connection12 -ResourceGroupName $RG1 -VirtualNetworkGateway1 $vnet1gw -VirtualNetworkGateway2 $vnet2gw -Location $Location1 -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3' -EnableBgp $True
```

Create the `TestVNet2`-to-`TestVNet1` connection.

```azurepowershell-interactive
New-AzVirtualNetworkGatewayConnection -Name $Connection21 -ResourceGroupName $RG2 -VirtualNetworkGateway1 $vnet2gw -VirtualNetworkGateway2 $vnet1gw -Location $Location2 -ConnectionType Vnet2Vnet -SharedKey 'AzureA1b2C3' -EnableBgp $True
```

> [!IMPORTANT]
> Enable BGP on both connections.

:::zone-end

:::zone pivot="azure-cli"

## Azure CLI

Use Azure Cloud Shell or a local Azure CLI installation. This procedure uses [az network vnet-gateway create](/cli/azure/network/vnet-gateway#az-network-vnet-gateway-create), [az network local-gateway create](/cli/azure/network/local-gateway#az-network-local-gateway-create), and [az network vpn-connection create](/cli/azure/network/vpn-connection#az-network-vpn-connection-create).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

### 1. Create TestVNet1

Create TestRG1.

```azurecli-interactive
az group create --name TestRG1 --location eastus
```

Create TestVNet1 and the FrontEnd subnet.

```azurecli-interactive
az network vnet create -n TestVNet1 -g TestRG1 --address-prefix 10.11.0.0/16 --subnet-name FrontEnd --subnet-prefix 10.11.0.0/24
```

Add the second address space, `BackEnd` subnet, and `GatewaySubnet`.

```azurecli-interactive
az network vnet update -n TestVNet1 --address-prefixes 10.11.0.0/16 10.12.0.0/16 -g TestRG1

az network vnet subnet create --vnet-name TestVNet1 -n BackEnd -g TestRG1 --address-prefix 10.12.0.0/24

az network vnet subnet create --vnet-name TestVNet1 -n GatewaySubnet -g TestRG1 --address-prefix 10.12.255.0/27
```

### 2. Create TestVNet1 gateway with BGP by using Azure CLI

**Diagram 2**

:::image type="content" source="./media/bgp-howto/gateway.png" alt-text="Diagram showing settings for the virtual network gateway." border="false":::

Create a Standard static public IP address.

```azurecli-interactive
az network public-ip create -n GWPubIP -g TestRG1 --sku Standard --allocation-method Static
```

Create a route-based VpnGw2AZ gateway with ASN 65010. Azure assigns the gateway a private BGP peering address from the `GatewaySubnet` range.

```azurecli-interactive
az network vnet-gateway create -n VNet1GW -l eastus --public-ip-address GWPubIP -g TestRG1 --vnet TestVNet1 --gateway-type Vpn --sku VpnGw2AZ --vpn-type RouteBased --asn 65010 --no-wait
```

If your on-premises BGP peer uses an APIPA address, configure a custom Azure APIPA BGP address from `169.254.21.0` through `169.254.22.255`. For more information, see [BGP and routing](vpn-gateway-vpn-faq.md#bgp).

### 3. Get the Azure BGP peer IP addresses

List the gateway configuration.

```azurecli-interactive
az network vnet-gateway list -g TestRG1
```

Record the values in `bgpSettings`.

```json
"bgpSettings": {
  "asn": 65010,
  "bgpPeeringAddress": "10.12.255.30",
  "peerWeight": 0
}
```

If `bgpPeeringAddress` is empty, wait for the gateway deployment to finish and try again.

### 4. Establish a cross-premises S2S connection with BGP

**Diagram 3**

:::image type="content" source="./media/bgp-howto/cross-premises.png" alt-text="Diagram showing IPsec configuration." border="false":::

Create `TestRG5` and the `Site5` local network gateway. Replace the gateway public IP address with the address of your on-premises VPN device.

```azurecli-interactive
az group create -n TestRG5 -l westus

az network local-gateway create --gateway-ip-address 23.99.221.164 -n Site5 -g TestRG5 --local-address-prefixes 10.51.255.254/32 --asn 65050 --bgp-peering-address 10.51.255.254
```

Get the `VNet1GW` resource ID.

```azurecli-interactive
az network vnet-gateway show -n VNet1GW -g TestRG1
```

The output includes the gateway ID and BGP settings.

```json
{
  "activeActive": false,
  "bgpSettings": {
   "asn": 65010,
   "bgpPeeringAddress": "10.12.255.30",
   "peerWeight": 0
  },
  "enableBgp": true,
  "id": "/subscriptions/<subscription-ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW"
}
```

Record the ID value.

```
"id": "/subscriptions/<subscription-ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW"
```

Get the `Site5` resource ID.

```azurecli-interactive
az network local-gateway show -n Site5 -g TestRG5
```

Create the `VNet1ToSite5` connection and use `--enable-bgp` to enable BGP.

```azurecli-interactive
az network vpn-connection create -n VNet1ToSite5 -g TestRG1 --vnet-gateway1 /subscriptions/<subscription-ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW --enable-bgp -l eastus --shared-key "abc123" --local-gateway2 /subscriptions/<subscription-ID>/resourceGroups/TestRG5/providers/Microsoft.Network/localNetworkGateways/Site5
```

Configure the on-premises device with these values.

```
- Site5 ASN            : 65050
- Site5 BGP IP         : 10.51.255.254
- Prefixes to announce : (for example) 10.51.0.0/16
- Azure VNet ASN       : 65010
- Azure VNet BGP IP    : 10.12.255.30
- Static route         : Add a route for 10.12.255.30/32, with the next hop set to the VPN tunnel interface
- eBGP Multihop        : Enable eBGP multihop if your device requires it
```

### 5. Establish a VNet-to-VNet connection with BGP

**Diagram 4**

:::image type="content" source="./media/bgp-howto/vnet-to-vnet.png" alt-text="Diagram showing the completed BGP topology." border="false":::

Create `TestRG2`.

```azurecli-interactive
az group create -n TestRG2 -l eastus
```

Create `TestVNet2` and the `FrontEnd` subnet.

```azurecli-interactive
az network vnet create -n TestVNet2 -g TestRG2 --address-prefix 10.21.0.0/16 --subnet-name FrontEnd --subnet-prefix 10.21.0.0/24
```

Add the second address space, `BackEnd` subnet, and `GatewaySubnet`.

```azurecli-interactive
az network vnet update -n TestVNet2 --address-prefixes 10.21.0.0/16 10.22.0.0/16 -g TestRG2

az network vnet subnet create --vnet-name TestVNet2 -n BackEnd -g TestRG2 --address-prefix 10.22.0.0/24

az network vnet subnet create --vnet-name TestVNet2 -n GatewaySubnet -g TestRG2 --address-prefix 10.22.255.0/27
```

Create a Standard static public IP address.

```azurecli-interactive
az network public-ip create -n GWPubIP2 -g TestRG2 --sku Standard --allocation-method Static
```

Create `VNet2GW` with ASN 65020.

```azurecli-interactive
az network vnet-gateway create -n VNet2GW -l eastus --public-ip-address GWPubIP2 -g TestRG2 --vnet TestVNet2 --gateway-type Vpn --sku VpnGw2AZ --vpn-type RouteBased --asn 65020 --no-wait
```

Get the `VNet1GW` resource ID.

```azurecli-interactive
az network vnet-gateway show -n VNet1GW -g TestRG1
```

The resource ID resembles this value.

```
"/subscriptions/<subscription-ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW"
```

Get the `VNet2GW` resource ID.

```azurecli-interactive
az network vnet-gateway show -n VNet2GW -g TestRG2
```

Create the `TestVNet1`-to-`TestVNet2` connection.

```azurecli-interactive
az network vpn-connection create -n VNet1ToVNet2 -g TestRG1 --vnet-gateway1 /subscriptions/<subscription-ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW --enable-bgp -l eastus --shared-key "abc123" --vnet-gateway2 /subscriptions/<subscription-ID>/resourceGroups/TestRG2/providers/Microsoft.Network/virtualNetworkGateways/VNet2GW
```

Create the `TestVNet2`-to-`TestVNet1` connection.

```azurecli-interactive
az network vpn-connection create -n VNet2ToVNet1 -g TestRG2 --vnet-gateway1 /subscriptions/<subscription-ID>/resourceGroups/TestRG2/providers/Microsoft.Network/virtualNetworkGateways/VNet2GW --enable-bgp -l eastus --shared-key "abc123" --vnet-gateway2 /subscriptions/<subscription-ID>/resourceGroups/TestRG1/providers/Microsoft.Network/virtualNetworkGateways/VNet1GW
```

> [!IMPORTANT]
> Use `--enable-bgp` on both connections.

:::zone-end

## Next steps

For more information about BGP, see [About BGP and VPN Gateway](vpn-gateway-bgp-overview.md).
