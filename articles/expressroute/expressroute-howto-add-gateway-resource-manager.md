---
title: 'Configure a virtual network gateway for ExpressRoute using PowerShell'
description: Learn how to add, resize, and remove a virtual network gateway for ExpressRoute using Azure PowerShell. This guide covers gateway creation, SKU selection, and configuration steps.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 11/06/2025
ms.author: duau
ms.custom: devx-track-azurepowershell
---
# Configure a virtual network gateway for ExpressRoute using PowerShell
> [!div class="op_single_selector"]
> * [Resource Manager - Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
> * [Resource Manager - PowerShell](expressroute-howto-add-gateway-resource-manager.md)
> * [Classic - PowerShell](expressroute-howto-add-gateway-classic.md)
> 

This article shows you how to add, resize, and remove a virtual network gateway for a preexisting virtual network using PowerShell. The steps apply to virtual networks created with the Resource Manager deployment model for ExpressRoute. For more information, see [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

:::image type="content" source="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway-circuit.png" alt-text="Diagram showing an ExpressRoute gateway connected to the ExpressRoute circuit." lightbox="./media/expressroute-howto-add-gateway-portal-resource-manager/gateway-circuit.png":::

## Prerequisites

Before you begin, make sure you have:

- An Azure account with an active subscription.
- An existing virtual network where you want to create the gateway. For more information, see [Create a virtual network using PowerShell](/azure/virtual-network/quick-create-powershell).
- Azure PowerShell installed. For more information, see [Install Azure PowerShell](/powershell/azure/install-azure-powershell).
- Sufficient address space in your virtual network for a gateway subnet (/27 or larger).

### Example configuration values

The following table shows example values used in this article. You can use these values to create a test environment or refer to them to better understand the examples:

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
| Region | *West US* |
| Gateway Name | *GW* |   
| Gateway IP Name | *GWIP* |
| Gateway IP configuration Name | *gwipconf* |
| Type | *ExpressRoute* |

## Add a gateway

> [!IMPORTANT]
> If you plan to use IPv6-based private peering over ExpressRoute, select an availability zone-enabled SKU (ErGw1Az, ErGw2Az, ErGw3Az) for **-GatewaySku**, or use a non-availability zone SKU (Standard, HighPerformance, UltraPerformance) with Standard and Static Public IP.

1. Connect to your Azure account.

   ```azurepowershell-interactive
   Connect-AzAccount
   ```

1. Declare your variables for this article. Edit the sample values to reflect your configuration:

   ```azurepowershell-interactive 
   $RG = "TestRG"
   $Location = "West US"
   $GWName = "GW"
   $GWIPName = "GWIP"
   $GWIPconfName = "gwipconf"
   $VNetName = "TestVNet"
   ```

   If you want to create the gateway in an Azure Extended Zone, add the **$ExtendedLocation** variable:

   ```azurepowershell-interactive 
   $RG = "TestRG"
   $Location = "West US"
   $ExtendedLocation = "losangeles"
   $GWName = "GW"
   $GWIPName = "GWIP"
   $GWIPconfName = "gwipconf"
   $VNetName = "TestVNet"
   ```

1. Store the virtual network object as a variable:

   ```azurepowershell-interactive
   $vnet = Get-AzVirtualNetwork -Name $VNetName -ResourceGroupName $RG
   ```

1. Add a gateway subnet to your virtual network. The gateway subnet must be named **GatewaySubnet**. The gateway subnet must be /27 or larger (/26, /25, and so on). If you plan to connect 16 ExpressRoute circuits to your gateway, you must create a gateway subnet of /26 or larger:

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix 192.168.200.0/26
   ```

   If you're using a dual stack virtual network and plan to use IPv6-based private peering over ExpressRoute, create a dual stack gateway subnet instead:

   ```azurepowershell-interactive
   Add-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix "10.0.0.0/26","ace:daa:daaa:deaa::/64"
   ```

1. Set the configuration:

   ```azurepowershell-interactive
   $vnet = Set-AzVirtualNetwork -VirtualNetwork $vnet
   ```

1. Store the gateway subnet as a variable:

   ```azurepowershell-interactive
   $subnet = Get-AzVirtualNetworkSubnetConfig -Name 'GatewaySubnet' -VirtualNetwork $vnet
   ```

1. (Optional) Request a public IP address for Extended Zone gateways.

   Public IP addresses are no longer required for ExpressRoute gateways, except for Extended Zone gateways. If you want to create the gateway in an Azure Extended Zone, request a public IP address using the **-ExtendedLocation** parameter:

   ```azurepowershell-interactive
   $pip = New-AzPublicIpAddress -Name $GWIPName  -ResourceGroupName $RG -Location $Location -ExtendedLocation $ExtendedLocation -AllocationMethod Static -SKU Standard
   ```

   > [!NOTE]
   > - Basic SKU public IP isn't supported with ExpressRoute virtual network gateways.
   > - Creating a public IP is no longer required. [Microsoft creates and manages your public IP](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip), which means all ExpressRoute virtual network gateways are created as zone-redundant.

1. Create the IP configuration for your gateway.

   The gateway configuration defines the subnet to use. In this step, you specify the configuration that's used when you create the gateway.

   **For standard gateways:**

   ```azurepowershell-interactive
   $ipconf = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet 
   ```

   **For Extended Zone gateways:**
   
   ```azurepowershell-interactive
   $ipconf = New-AzVirtualNetworkGatewayIpConfig -Name $GWIPconfName -Subnet $subnet -PublicIpAddressId $pip.Id 
   ```

1. Create the gateway.

   The **-GatewayType** parameter must be set to **ExpressRoute**. The **-GatewaySku** parameter determines the gateway's performance and features. Gateway creation can take 45 minutes or more to complete.

   Choose the appropriate command based on your gateway SKU:

   ### [ErGwScale SKU (Scalable Gateway)](#tab/ergwscale-sku)

   For flexible, scalable gateways, use the **ErGwScale** SKU with the **-MinScaleUnit** and **-MaxScaleUnit** parameters.

   **Fixed scaling (recommended for predictable workloads):**

   When you set the minimum and maximum scale units to the same value, the gateway maintains a fixed bandwidth:

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -IpConfigurations $ipconf -GatewayType Expressroute -GatewaySku ErGwScale -MinScaleUnit 2 -MaxScaleUnit 2
   ```

   **Autoscaling (recommended for variable workloads):**

   When you set different minimum and maximum values, the gateway automatically scales based on traffic:

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -IpConfigurations $ipconf -GatewayType Expressroute -GatewaySku ErGwScale -MinScaleUnit 2 -MaxScaleUnit 10
   ```

   > [!IMPORTANT]
   > - When you set the maximum scale unit to 1, the minimum scale unit must also be 1.
   > - Scale units range from 1 to 40.
   > - Each scale unit provides 1 Gbps of bandwidth.

   For more information, see [About ExpressRoute scalable gateway](scalable-gateway.md).

   ### [Traditional SKUs](#tab/traditional-sku)

   For fixed-performance gateways, use one of the traditional SKUs:

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -IpConfigurations $ipconf -GatewayType Expressroute -GatewaySku Standard
   ```

   Available SKUs: **Standard**, **HighPerformance**, **UltraPerformance**, **ErGw1Az**, **ErGw2Az**, **ErGw3Az**

   For more information about gateway SKUs, see [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md).

   ### [Extended Zone Gateway](#tab/extended-zone)

   If you want to create the gateway in an Azure Extended Zone, add the **-ExtendedLocation** parameter:

   ```azurepowershell-interactive
   New-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG -Location $Location -ExtendedLocation $ExtendedLocation -IpConfigurations $ipconf -GatewayType Expressroute -GatewaySku Standard
   ```

   > [!NOTE]
   > To create the gateway in an [Azure Extended Zone](../extended-zones/overview.md), you must first [request access to the Extended Zone](../extended-zones/request-access.md). Once you have access, you can create the gateway.
   >
   > The following considerations apply when creating a virtual network gateway in an Extended Zone:
   > - Availability Zones aren't supported in Azure Extended Zones.
   > - The following SKUs are currently supported in Azure Extended Zones: *Standard*, *HighPerformance*, *UltraPerformance*.
   > - Local SKU circuit isn't supported with gateways in Azure Extended Zone.

   ---

## Verify the gateway was created

Use the following commands to verify that the gateway has been created:

```azurepowershell-interactive
Get-AzVirtualNetworkGateway -ResourceGroupName $RG
```

## Resize a gateway

You can change the gateway SKU to scale up or down the gateway's performance. Use the appropriate command based on your gateway type:

### [ErGwScale SKU](#tab/resize-ergwscale)

For scalable gateways (ErGwScale SKU), use the **Set-AzVirtualNetworkGateway** command with the **-MinScaleUnit** and **-MaxScaleUnit** parameters:

```azurepowershell-interactive
$vng = Get-AzVirtualNetworkGateway -Name <GatewayName> -ResourceGroupName <ResourceGroupName>
Set-AzVirtualNetworkGateway -VirtualNetworkGateway $vng -MinScaleUnit 2 -MaxScaleUnit 10 -GatewaySku ErGwScale
```

You can adjust the scale units to change the gateway's bandwidth and performance. Scale changes can take up to 30 minutes to complete.

### [Traditional SKUs](#tab/resize-traditional)

For traditional gateway SKUs (Standard, HighPerformance, UltraPerformance, ErGw1Az, ErGw2Az, ErGw3Az), use the **Resize-AzVirtualNetworkGateway** command:

```azurepowershell-interactive
$gw = Get-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
Resize-AzVirtualNetworkGateway -VirtualNetworkGateway $gw -GatewaySku HighPerformance
```

> [!NOTE]
> You can only upgrade within the same SKU family (non-availability zone or availability zone-enabled). For more information, see [Upgrade a gateway SKU](expressroute-howto-add-gateway-portal-resource-manager.md#upgrade-a-gateway-sku).

---

## Clean up resources

If you no longer need the gateway, use the following command to remove it:

```azurepowershell-interactive
Remove-AzVirtualNetworkGateway -Name $GWName -ResourceGroupName $RG
```

## Next steps

After you create the virtual network gateway, you can link your virtual network to an ExpressRoute circuit:

> [!div class="nextstepaction"]
> [Link a virtual network to an ExpressRoute circuit](expressroute-howto-linkvnet-arm.md)

For more information about ExpressRoute gateways:

- [About ExpressRoute virtual network gateways](expressroute-about-virtual-network-gateways.md)
- [About ExpressRoute scalable gateway](scalable-gateway.md)
- [Configure a virtual network gateway using the Azure portal](expressroute-howto-add-gateway-portal-resource-manager.md)
