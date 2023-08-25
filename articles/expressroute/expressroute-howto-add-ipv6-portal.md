---
title: 'Azure ExpressRoute: Add IPv6 support using the Azure portal'
description: Learn how to add IPv6 support to connect to Azure deployments using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Add IPv6 support for private peering using the Azure portal

This article describes how to add IPv6 support to connect via ExpressRoute to your resources in Azure using the Azure portal.

>[!NOTE]
> Some aspects of the portal experience are still being implemented. Therefore, follow the exact order of steps provided in this document to successfully add IPv6 support via the portal. Specifically, make sure to create your virtual network and subnet, or add IPv6 address space to your existing virtual network and GatewaySubnet, *prior* to creating a new virtual network gateway in the portal.

## Sign in to the Azure portal

From a web browser, sign in to the [Azure portal](https://portal.azure.com).

## Add IPv6 Private Peering to your ExpressRoute circuit

1. [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) or navigate to the existing circuit you want to change.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/navigate-to-circuit.png" alt-text="Screenshot of ExpressRoute circuit list.":::

1. Select the **Azure private** peering configuration.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/navigate-to-peering.png" alt-text="Screenshot of ExpressRoute overview page.":::

1. Add an IPv6 Private Peering to your existing IPv4 Private Peering configuration by selecting "Both" for **Subnets**, or only enable IPv6 Private Peering on your new circuit by selecting "IPv6". Provide a pair of /126 IPv6 subnets that you own for your primary link and secondary links. From each of these subnets, you assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. **Save** your peering configuration once you've specified all parameters.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-peering.png" alt-text="Screenshot of adding Ipv6 on private peering page.":::

1. After the configuration has been accepted successfully, you should see something similar to the following example.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/view-ipv6-peering.png" alt-text="Screenshot of Ipv6 configured for private peering.":::

## Update your connection to an existing virtual network

Follow these steps if you have an existing environment of Azure resources that you would like to use your IPv6 Private Peering with.

1. Navigate to the virtual network that your ExpressRoute circuit is connected to.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/navigate-to-vnet.png" alt-text="Screenshot of virtual network list.":::

1. Navigate to the **Address space** tab and add an IPv6 address space to your virtual network. **Save** your address space.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-space.png" alt-text="Screenshot of add Ipv6 address space to virtual network.":::

1. Navigate to the **Subnets** tab and select the **GatewaySubnet**. Check **Add IPv6 address space** and provide an IPv6 address space for your subnet. The gateway IPv6 subnet should be /64 or larger. **Save** your configuration once you've specified all parameters.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-gateway-space.png" alt-text="Screenshot of add Ipv6 address space to the subnet.":::
    
1. If you have an existing zone-redundant gateway, run the following command in PowerShell to enable IPv6 connectivity (note that it may take up to 1 hour for changes to reflect). Otherwise, [create the virtual network gateway](./expressroute-howto-add-gateway-portal-resource-manager.md) using any SKU and a Standard, Static public IP address. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this option is only available for circuits using ExpressRoute Direct).

    ```azurepowershell-interactive
    $gw = Get-AzVirtualNetworkGateway -Name "GatewayName" -ResourceGroupName "ExpressRouteResourceGroup"
    Set-AzVirtualNetworkGateway -VirtualNetworkGateway $gw
    
>[!NOTE]
> If you have an existing gateway that is not zone-redundant (meaning it is Standard, High Performance, or Ultra Performance SKU)  **and** uses a Basic public IP address, you will need to delete and [recreate the gateway](expressroute-howto-add-gateway-portal-resource-manager.md#create-the-virtual-network-gateway) using any SKU and a Standard, Static public IP address.

## Create a connection to a new virtual network

Follow these steps if you plan to connect to a new set of Azure resources using your IPv6 Private Peering.

1. Create a dual-stack virtual network with both IPv4 and IPv6 address space. For more information, see [Create a virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network).

1. [Create the dual-stack gateway subnet](expressroute-howto-add-gateway-portal-resource-manager.md#create-the-gateway-subnet).

1. [Create the virtual network gateway](expressroute-howto-add-gateway-resource-manager.md) using any SKU and a Standard, Static public IP address. If you plan to use FastPath, use UltraPerformance or ErGw3AZ (note that this option is only available for circuits using ExpressRoute Direct). **NOTE:** Use the PowerShell instructions for this step as the Azure portal experience is still under development.

1. [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md).

## Limitations

While IPv6 support is available for connections to deployments in global Azure regions, it doesn't support the following use cases:

* Connections to *existing* ExpressRoute gateways that aren't zone-redundant. *Newly* created ExpressRoute gateways of any SKU (both zone-redundant and not) using  a Standard, Static IP address can be used for dual-stack ExpressRoute connections
* Use of ExpressRoute with virtual WAN
* FastPath with non-ExpressRoute Direct circuits
* FastPath with circuits in the following peering locations: Dubai
* Coexistence with VPN Gateway for IPv6 traffic. You can still configure coexistence with VPN Gateway in a dual-stack vnet, but VPN Gateway only supports IPv4 traffic.

## Next steps

To troubleshoot ExpressRoute problems, see the following articles:

* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
