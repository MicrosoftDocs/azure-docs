---
title: 'Azure VPN Gateway topologies and design'
description: Learn about VPN Gateway topologies and designs you can use to connect on-premises locations to virtual networks.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.date: 01/15/2025
ms.author: cherylmc

---
# VPN Gateway topology and design

There are many different options available for virtual network connections. To help you select a VPN gateway connection topology that meets your requirements, use the diagrams and descriptions in the following sections. The diagrams show the main baseline topologies, but it's possible to build more complex configurations using the diagrams as guidelines.

## <a name="s2smulti"></a>Site-to-site VPN

A site-to-site (S2S) VPN gateway connection is a connection over IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. Site-to-site connections can be used for cross-premises and hybrid configurations. A site-to-site connection requires a VPN device located on-premises that has a public IP address assigned to it.

:::image type="content" source="./media/tutorial-site-to-site-portal/diagram.png" alt-text="Diagram of site-to-site VPN Gateway cross-premises connections." lightbox="./media/tutorial-site-to-site-portal/diagram.png":::

You can create more than one VPN connection from your virtual network gateway, typically connecting to multiple on-premises sites. When working with multiple connections, you must use a RouteBased VPN type. Because each virtual network can only have one VPN gateway, all connections through the gateway share the available bandwidth. This type of connectivity design is sometimes referred to as *multi-site*.

:::image type="content" source="./media/design/multi-site.png" alt-text="Diagram of site-to-site VPN Gateway cross-premises connections with multiple sites." lightbox="./media/design/multi-site.png":::

If you want to create a design for highly available gateway connectivity, you can configure your gateway to be in active-active mode. This mode lets you configure two active tunnels (one from each gateway virtual machine instance) to the same VPN device to create highly available connectivity. In addition to being a highly available connectivity design, another advantage of active-active mode is that customers experience higher throughputs.

* For information about selecting a VPN device, see the [VPN Gateway FAQ - VPN devices](vpn-gateway-vpn-faq.md#s2s).
* For information about highly available connections, see [Designing highly available connections](vpn-gateway-highlyavailable.md).
* For information about active-active mode, see [About active-active mode gateways](about-active-active-gateways.md).

### Deployment methods for S2S

[!INCLUDE [site-to-site table](../../includes/vpn-gateway-table-site-to-site-include.md)]

## <a name="P2S"></a>Point-to-site VPN

A point-to-site (P2S) VPN gateway connection lets you create a secure connection to your virtual network from an individual client computer. A point-to-site connection is established by starting it from the client computer. This solution is useful for telecommuters who want to connect to Azure virtual networks from a remote location, such as from home or a conference. Point-to-site VPN is also a useful solution to use instead of site-to-site VPN when you have only a few clients that need to connect to a virtual network.

Unlike site-to-site connections, point-to-site connections don't require an on-premises public-facing IP address or a VPN device. Point-to-site connections can be used with site-to-site connections through the same VPN gateway, as long as all the configuration requirements for both connections are compatible. For more information about point-to-site connections, see [About point-to-site VPN](point-to-site-about.md).

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png" alt-text="Diagram of point-to-site connections." lightbox="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png":::

### Deployment methods for P2S

[!INCLUDE [point to site table](../../includes/vpn-gateway-table-point-to-site-include.md)]

### P2S VPN client configuration

[!INCLUDE [VPN client configuration table](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## <a name="V2V"></a>VNet-to-VNet connections (IPsec/IKE VPN tunnel)

Connecting a virtual network to another virtual network (VNet-to-VNet) is similar to connecting a virtual network to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE. You can even combine VNet-to-VNet communication with multi-site connection configurations. This lets you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity.

The virtual networks you connect can be:

* in the same or different regions
* in the same or different subscriptions

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png" alt-text="Diagram of VNet-to-VNet connections." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png":::

### Deployment methods for VNet-to-VNet

[!INCLUDE [VNet-to-VNet table](../../includes/vpn-gateway-table-vnet-to-vnet-include.md)]

In some cases, you might want to use virtual network peering instead of VNet-to-VNet to connect your virtual networks. Virtual network peering doesn't use a virtual network gateway. For more information, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).

## <a name="coexisting"></a>Site-to-site and ExpressRoute coexisting connections

[ExpressRoute](../expressroute/expressroute-introduction.md) is a direct, private connection from your WAN (not over the public Internet) to Microsoft Services, including Azure. Site-to-site VPN traffic travels encrypted over the public Internet. Being able to configure site-to-site VPN and ExpressRoute connections for the same virtual network has several advantages.

You can configure a site-to-site VPN as a secure failover path for ExpressRoute, or use site-to-site VPNs to connect to sites that aren't part of your network, but that are connected through ExpressRoute. Notice that this configuration requires two virtual network gateways for the same virtual network, one using the gateway type *Vpn*, and the other using the gateway type *ExpressRoute*.

:::image type="content" source="./media/design/expressroute-vpngateway-coexisting-connections-diagram.png" alt-text="Diagram of ExpressRoute and VPN Gateway coexisting connections." lightbox="./media/design/expressroute-vpngateway-coexisting-connections-diagram.png":::

### Deployment methods for S2S and ExpressRoute coexisting connections

[!INCLUDE [ExpressRoute coexist table](../../includes/vpn-gateway-table-coexist-include.md)]

## Highly available connections

For planning and designing highly available connections, including active-active mode configurations, see [Design highly available gateway connectivity for cross-premises and VNet-to-VNet connections](vpn-gateway-highlyavailable.md).

## Next steps

* View the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md) for additional information.

* Learn more about [VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

* For VPN Gateway BGP considerations, see [About BGP](vpn-gateway-bgp-overview.md).

* For information about virtual network peering, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).

* View the [Subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-networking-limits).

* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
