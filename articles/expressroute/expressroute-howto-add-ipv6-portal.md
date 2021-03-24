---
title: 'Azure ExpressRoute: Add IPv6 support using the Azure portal'
description: Learn how to add IPv6 support to connect to Azure deployments using the Azure portal.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 03/09/2021
ms.author: duau
---

# Add IPv6 support for private peering using the Azure portal (Preview)

This article describes how to add IPv6 support to connect via ExpressRoute to your resources in Azure using the Azure portal. 

> [!Note]
> This feature is currently available for preview in [Azure regions with Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-region#azure-regions-with-availability-zones). Your ExpressRoute circuit can therefore be created using any peering location, but the IPv6-based deployments it connects to must be in a region with Availability Zones.

## Register for Public Preview
Before adding IPv6 support, you must first enroll your subscription. To enroll, run the following commands via Azure PowerShell:

1.  Sign into Azure and select the subscription. Run these commands for the subscription containing your ExpressRoute circuit, and the subscription containing your Azure deployments (if they're different).

    ```azurepowershell-interactive
    Connect-AzAccount 

    Select-AzSubscription -Subscription "<SubscriptionID or SubscriptionName>"
    ```

1. Register your subscription for Public Preview using the following command:
    ```azurepowershell-interactive
    Register-AzProviderFeature -FeatureName AllowIpv6PrivatePeering -ProviderNamespace Microsoft.Network
    ```

Your request will then be approved by the ExpressRoute team within 2-3 business days.

## Sign in to the Azure portal

From a browser, go to the [Azure portal](https://portal.azure.com), and then sign in with your Azure account.

## Add IPv6 Private Peering to your ExpressRoute circuit

1. [Create an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md) or navigate to the existing circuit you want to change.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/navigate-to-circuit.png" alt-text="Screenshot of ExpressRoute circuit list.":::

1. Select the **Azure private** peering configuration.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/navigate-to-peering.png" alt-text="Screenshot of ExpressRoute overview page.":::

1. Add an IPv6 Private Peering to your existing IPv4 Private Peering configuration by selecting "Both" for **Subnets**, or only enable IPv6 Private Peering on your new circuit by selecting "IPv6". Provide a pair of /126 IPv6 subnets that you own for your primary link and secondary links. From each of these subnets, you'll assign the first usable IP address to your router as Microsoft uses the second usable IP for its router. **Save** your peering configuration once you've specified all parameters.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-peering.png" alt-text="Screenshot of adding Ipv6 on private peering page.":::

1. After the configuration has been accepted successfully, you should see something similar to the following example.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/view-ipv6-peering.png" alt-text="Screenshot of Ipv6 configured for private peering.":::

## Update your connection to an existing virtual network

Follow the steps below if you have an existing environment of Azure resources in a region with Availability Zones that you would like to use your IPv6 Private Peering with.

1. Navigate to the virtual network that your ExpressRoute circuit is connected to.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/navigate-to-vnet.png" alt-text="Screenshot of virtual network list.":::

1. Navigate to the **Address space** tab and add an IPv6 address space to your virtual network. **Save** your address space.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-space.png" alt-text="Screenshot of add Ipv6 address space to virtual network.":::

1. Navigate to the **Subnets** tab and select the **GatewaySubnet**. Check **Add IPv6 address space** and provide an IPv6 address space for your subnet. The gateway IPv6 subnet should be /64 or larger. **Save** your configuration once you've specified all parameters.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/add-ipv6-gateway-space.png" alt-text="Screenshot of add Ipv6 address space to the subnet.":::

1. If you have an existing zone-redundant gateway, navigate to your ExpressRoute gateway and refresh the resource to enable IPv6 connectivity. Otherwise, [create the virtual network gateway](expressroute-howto-add-gateway-portal-resource-manager.md) using a zone-redundant SKU (ErGw1AZ, ErGw2AZ, ErGw3AZ). If you plan to use FastPath, use ErGw3AZ.

    :::image type="content" source="./media/expressroute-howto-add-ipv6-portal/refresh-gateway.png" alt-text="Screenshot of refreshing the gateway.":::

## Create a connection to a new virtual network

Follow the steps below if you plan to connect to a new set of Azure resources in a region with Availability Zones using your IPv6 Private Peering.

1. Create a dual-stack virtual network with both IPv4 and IPv6 address space. For more information, see [Create a virtual network](../virtual-network/quick-create-portal.md#create-a-virtual-network).

1. [Create the dual-stack gateway subnet](expressroute-howto-add-gateway-portal-resource-manager.md#create-the-gateway-subnet).

1. [Create the virtual network gateway](expressroute-howto-add-gateway-portal-resource-manager.md#create-the-virtual-network-gateway) using a zone-redundant SKU (ErGw1AZ, ErGw2AZ, ErGw3AZ). If you plan to use FastPath, use ErGw3AZ (note that this option is only available for circuits using ExpressRoute Direct).

1. [Link your virtual network to your ExpressRoute circuit](expressroute-howto-linkvnet-portal-resource-manager.md).

## Limitations
While IPv6 support is available for connections to deployments in regions with Availability Zones, it doesn't support the following use cases:

* Connections to deployments in Azure via a non-AZ ExpressRoute gateway SKU
* Connections to deployments in non-AZ regions
* Global Reach connections between ExpressRoute circuits
* Use of ExpressRoute with virtual WAN
* FastPath with non-ExpressRoute Direct circuits
* FastPath with circuits in the following peering locations: Dubai
* Coexistence with VPN Gateway

## Next steps

To troubleshoot ExpressRoute problems, see the following articles:

* [Verifying ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md)
* [Troubleshooting network performance](expressroute-troubleshooting-network-performance.md)
