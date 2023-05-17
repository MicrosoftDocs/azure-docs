---
title: 'Azure VPN Gateway topologies and design'
description: Learn about VPN Gateway topologies and designs to connect on-premises locations to virtual networks.
author: cherylmc
ms.service: vpn-gateway
ms.topic: article
ms.date: 04/10/2023
ms.author: cherylmc

---
# VPN Gateway design

It's important to know that there are different configurations available for VPN gateway connections. You need to determine which configuration best fits your needs. In the sections below, you can view design information and topology diagrams about the following VPN gateway connections. Use the diagrams and descriptions to help select the connection topology to match your requirements. The diagrams show the main baseline topologies, but it's possible to build more complex configurations using the diagrams as guidelines.

## <a name="s2smulti"></a>Site-to-site VPN

A Site-to-site (S2S) VPN gateway connection is a connection over IPsec/IKE (IKEv1 or IKEv2) VPN tunnel. S2S connections can be used for cross-premises and hybrid configurations. A S2S connection requires a VPN device located on-premises that has a public IP address assigned to it. For information about selecting a VPN device, see the [VPN Gateway FAQ - VPN devices](vpn-gateway-vpn-faq.md#s2s).

:::image type="content" source="./media/tutorial-site-to-site-portal/diagram.png" alt-text="Diagram of site-to-site VPN Gateway cross-premises connections." lightbox="./media/tutorial-site-to-site-portal/diagram.png":::

VPN Gateway can be configured in active-standby mode using one public IP or in active-active mode using two public IPs. In active-standby mode, one IPsec tunnel is active and the other tunnel is in standby. In this setup, traffic flows through the active tunnel, and if some issue happens with this tunnel, the traffic switches over to the standby tunnel. Setting up VPN Gateway in active-active mode is *recommended* in which both the IPsec tunnels are simultaneously active, with data flowing through both tunnels at the same time. An additional advantage of active-active mode is that customers experience higher throughputs.

You can create more than one VPN connection from your virtual network gateway, typically connecting to multiple on-premises sites. When working with multiple connections, you must use a RouteBased VPN type (known as a dynamic gateway when working with classic VNets). Because each virtual network can only have one VPN gateway, all connections through the gateway share the available bandwidth. This type of connection is sometimes referred to as a "multi-site" connection.

:::image type="content" source="./media/design/multi-site.png" alt-text="Diagram of site-to-site VPN Gateway cross-premises connections with multiple sites." lightbox="./media/design/multi-site.png":::

### Deployment models and methods for S2S

[!INCLUDE [site-to-site table](../../includes/vpn-gateway-table-site-to-site-include.md)]

## <a name="P2S"></a>Point-to-site VPN

A point-to-site (P2S) VPN gateway connection lets you create a secure connection to your virtual network from an individual client computer. A P2S connection is established by starting it from the client computer. This solution is useful for telecommuters who want to connect to Azure VNets from a remote location, such as from home or a conference. P2S VPN is also a useful solution to use instead of S2S VPN when you have only a few clients that need to connect to a VNet.

Unlike S2S connections, P2S connections don't require an on-premises public-facing IP address or a VPN device. P2S connections can be used with S2S connections through the same VPN gateway, as long as all the configuration requirements for both connections are compatible. For more information about point-to-site connections, see [About point-to-site VPN](point-to-site-about.md).

:::image type="content" source="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png" alt-text="Diagram of point-to-site connections." lightbox="./media/vpn-gateway-howto-point-to-site-rm-ps/point-to-site-diagram.png":::

### Deployment models and methods for P2S

[!INCLUDE [vpn-gateway-table-site-to-site](../../includes/vpn-gateway-table-point-to-site-include.md)]

## <a name="V2V"></a>VNet-to-VNet connections (IPsec/IKE VPN tunnel)

Connecting a virtual network to another virtual network (VNet-to-VNet) is similar to connecting a VNet to an on-premises site location. Both connectivity types use a VPN gateway to provide a secure tunnel using IPsec/IKE. You can even combine VNet-to-VNet communication with multi-site connection configurations. This lets you establish network topologies that combine cross-premises connectivity with inter-virtual network connectivity.

The VNets you connect can be:

* in the same or different regions
* in the same or different subscriptions 
* in the same or different deployment models

:::image type="content" source="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png" alt-text="Diagram of VNet-to-VNet connections." lightbox="./media/vpn-gateway-howto-vnet-vnet-resource-manager-portal/vnet-vnet-diagram.png":::

### Connections between deployment models

Azure currently has two deployment models: classic and Resource Manager. If you have been using Azure for some time, you probably have Azure VMs and instance roles running in a classic VNet. Your newer VMs and role instances may be running in a VNet created in Resource Manager. You can create a connection between the VNets to allow the resources in one VNet to communicate directly with resources in another.

### VNet peering

You may be able to use VNet peering to create your connection, as long as your virtual network meets certain requirements. VNet peering doesn't use a virtual network gateway. For more information, see [VNet peering](../virtual-network/virtual-network-peering-overview.md).

### Deployment models and methods for VNet-to-VNet

[!INCLUDE [vpn-gateway-table-vnet-to-vnet](../../includes/vpn-gateway-table-vnet-to-vnet-include.md)]

## <a name="coexisting"></a>Site-to-site and ExpressRoute coexisting connections

[ExpressRoute](../expressroute/expressroute-introduction.md) is a direct, private connection from your WAN (not over the public Internet) to Microsoft Services, including Azure. Site-to-site VPN traffic travels encrypted over the public Internet. Being able to configure site-to-site VPN and ExpressRoute connections for the same virtual network has several advantages.

You can configure a site-to-site VPN as a secure failover path for ExpressRoute, or use site-to-site VPNs to connect to sites that aren't part of your network, but that are connected through ExpressRoute. Notice that this configuration requires two virtual network gateways for the same virtual network, one using the gateway type 'Vpn', and the other using the gateway type 'ExpressRoute'.

:::image type="content" source="./media/design/expressroute-vpngateway-coexisting-connections-diagram.png" alt-text="Diagram of ExpressRoute and VPN Gateway coexisting connections." lightbox="./media/design/expressroute-vpngateway-coexisting-connections-diagram.png":::

### Deployment models and methods for S2S and ExpressRoute coexist

[!INCLUDE [vpn-gateway-table-coexist](../../includes/vpn-gateway-table-coexist-include.md)]

## <a name="highly-available"></a>Highly available connections

For planning and design for highly available connections, see [Highly available connections](vpn-gateway-highlyavailable.md).

## Next steps

* View the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md) for additional information.

* Learn more about [VPN Gateway configuration settings](vpn-gateway-about-vpn-gateway-settings.md).

* For VPN Gateway BGP considerations, see [About BGP](vpn-gateway-bgp-overview.md).

* View the [Subscription and service limits](../azure-resource-manager/management/azure-subscription-service-limits.md#networking-limits).

* Learn about some of the other key [networking capabilities](../networking/fundamentals/networking-overview.md) of Azure.
