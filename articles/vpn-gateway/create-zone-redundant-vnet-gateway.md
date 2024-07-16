---
title: 'Create a zone-redundant virtual network gateway in Azure availability zones'
description: Learn how to deploy zone-redundant VPN Gateways and ExpressRoute gateways in Azure availability zones.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 03/15/2024
ms.author: cherylmc 
ms.custom: devx-track-azurepowershell

---
# Create a zone-redundant virtual network gateway in availability zones

You can deploy VPN and ExpressRoute gateways in Azure availability zones. This brings resiliency, scalability, and higher availability to virtual network gateways. Deploying gateways in availability zones physically and logically separates gateways within a region, while protecting your on-premises network connectivity to Azure from zone-level failures. For more information, see  [About zone-redundant virtual network gateways](about-zone-redundant-vnet-gateways.md), [What are availability zones?](../reliability/availability-zones-overview.md), and [Availability zone service and regional support](../reliability/availability-zones-service-support.md).

## Azure portal workflow

This section outlines the basic workflow to specify a zone-redundant gateway for an Azure VPN gateway.

### VPN Gateway

Create a virtual network and configure a virtual network gateway using these steps: [Create a VPN gateway](tutorial-create-gateway-portal.md#VNetGateway). When creating the gateway, configure the appropriate SKU and availability zone settings.

* **SKU**: Select an "AZ" SKU from the dropdown. For example, **VpnGw2AZ**. If you don't select an AZ SKU, you can't configure an availability zone setting.

  :::image type="content" source="./media/create-zone-redundant-vnet-gateway/vpn-gateway.png" alt-text="Screenshot shows the VPN Gateway SKU selection to select an availability zone SKU." lightbox="./media/create-zone-redundant-vnet-gateway/vpn-gateway.png":::

* **Availability zone**: Select the Availability zone from the dropdown.

  :::image type="content" source="./media/create-zone-redundant-vnet-gateway/zone.png" alt-text="Screenshot shows the availability zone dropdown to select an availability zone." lightbox="./media/create-zone-redundant-vnet-gateway/zone.png":::

### ExpressRoute

For an ExpressRoute gateway, follow the [ExpressRoute documentation](../expressroute/configure-expressroute-private-peering.md), selecting the proper [ExpressRoute gateway zone-redundant SKU](../expressroute/expressroute-about-virtual-network-gateways.md#gwsku).

* **SKU**: Select an "AZ" SKU from the dropdown. For example, **ErGw2AZ**. If you don't select an AZ SKU, you can't configure an availability zone setting.

  :::image type="content" source="./media/create-zone-redundant-vnet-gateway/expressroute.png" alt-text="Screenshot shows the SKU selection to select an availability zone SKU." lightbox="./media/create-zone-redundant-vnet-gateway/expressroute.png":::
* **Availability zone**: Select the Availability zone from the dropdown.

  :::image type="content" source="./media/create-zone-redundant-vnet-gateway/expressroute-zone.png" alt-text="Screenshot shows the availability zone selection to select an availability zone." lightbox="./media/create-zone-redundant-vnet-gateway/expressroute-zone.png":::

## PowerShell workflow

[!INCLUDE [powershell](../../includes/vpn-gateway-cloud-shell-powershell-about.md)]

### <a name="variables"></a>1. Declare your variables

Declare the variables that you want to use. Use the following sample, substituting the values for your own when necessary. If you close your PowerShell/Cloud Shell session at any point during the exercise, just copy and paste the values again to redeclare the variables. When specifying location, verify that the region you specify is supported. For more information, see [Availability zone service and regional support](../reliability/availability-zones-service-support.md).

```azurepowershell-interactive
$RG1         = "TestRG1"
$VNet1       = "VNet1"
$Location1   = "EastUS"
$FESubnet1   = "FrontEnd"
$BESubnet1   = "Backend"
$GwSubnet1   = "GatewaySubnet"
$VNet1Prefix = "10.1.0.0/16"
$FEPrefix1   = "10.1.0.0/24"
$BEPrefix1   = "10.1.1.0/24"
$GwPrefix1   = "10.1.255.0/27"
$Gw1         = "VNet1GW"
$GwIP1       = "VNet1GWIP"
$GwIPConf1   = "gwipconf1"
```

### <a name="configure"></a>2. Create the virtual network

Create a resource group.

```azurepowershell-interactive
New-AzResourceGroup -ResourceGroupName $RG1 -Location $Location1
```

Create a virtual network.

```azurepowershell-interactive
$fesub1 = New-AzVirtualNetworkSubnetConfig -Name $FESubnet1 -AddressPrefix $FEPrefix1
$besub1 = New-AzVirtualNetworkSubnetConfig -Name $BESubnet1 -AddressPrefix $BEPrefix1
$vnet = New-AzVirtualNetwork -Name $VNet1 -ResourceGroupName $RG1 -Location $Location1 -AddressPrefix $VNet1Prefix -Subnet $fesub1,$besub1
```

### <a name="gwsub"></a>3. Add the gateway subnet

The gateway subnet contains the reserved IP addresses that the virtual network gateway services use. Use the following examples to add and set a gateway subnet:

Add the gateway subnet.

```azurepowershell-interactive
$getvnet = Get-AzVirtualNetwork -ResourceGroupName $RG1 -Name VNet1
Add-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -AddressPrefix 10.1.255.0/27 -VirtualNetwork $getvnet
```

Set the gateway subnet configuration for the virtual network.

```azurepowershell-interactive
$getvnet | Set-AzVirtualNetwork
```

### <a name="publicip"></a>4. Request a public IP address

In this step, choose the instructions that apply to the gateway that you want to create. The selection of zones for deploying the gateways depends on the zones specified for the public IP address.

#### <a name="ipzoneredundant"></a>For zone-redundant gateways

Request a public IP address with a **Standard** PublicIpaddress SKU and don't specify any zone. In this case, the Standard public IP address created is a zone-redundant public IP.

```azurepowershell-interactive
$pip1 = New-AzPublicIpAddress -ResourceGroup $RG1 -Location $Location1 -Name $GwIP1 -AllocationMethod Static -Sku Standard
```

#### <a name="ipzonalgw"></a>For zonal gateways

Request a public IP address with a **Standard** PublicIpaddress SKU. Specify the zone (1, 2 or 3). All gateway instances are deployed in this zone.

```azurepowershell-interactive
$pip1 = New-AzPublicIpAddress -ResourceGroup $RG1 -Location $Location1 -Name $GwIP1 -AllocationMethod Static -Sku Standard -Zone 1
```

### <a name="gwipconfig"></a>5. Create the IP configuration

```azurepowershell-interactive
$getvnet = Get-AzVirtualNetwork -ResourceGroupName $RG1 -Name $VNet1
$subnet = Get-AzVirtualNetworkSubnetConfig -Name $GwSubnet1 -VirtualNetwork $getvnet
$gwipconf1 = New-AzVirtualNetworkGatewayIpConfig -Name $GwIPConf1 -Subnet $subnet -PublicIpAddress $pip1
```

### <a name="gwconfig"></a>6. Create the virtual network gateway

**VPN Gateway example**

```azurepowershell-interactive
New-AzVirtualNetworkGateway -ResourceGroup $RG1 -Location $Location1 -Name $Gw1 -IpConfigurations $GwIPConf1 -GatewayType Vpn -VpnType RouteBased -GatewaySku VpnGw2AZ
```

**ExpressRoute example**

```azurepowershell-interactive
New-AzVirtualNetworkGateway -ResourceGroup $RG1 -Location $Location1 -Name $Gw1 -IpConfigurations $GwIPConf1 -GatewayType ExpressRoute -GatewaySku ErGw2AZ
```

## Next steps

See the [VPN Gateway](index.yml) and [ExpressRoute](../expressroute/index.yml) pages for other configuration information.