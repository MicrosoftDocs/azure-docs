---
title: 'About forced tunneling for site-to-site'
description: Learn about forced tunneling and split tunneling via UDRs for VPN Gateway site-to-site connections
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 08/04/2023
ms.author: cherylmc
---

# About forced tunneling for site-to-site configurations

This article helps you understand how forced tunneling works for site-to-site (S2S) IPsec connections. By default, Internet-bound traffic from your workloads and VMs within a virtual network is sent directly to the Internet.

Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via S2S VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches.

In some cases, you may want specific subnets to send and receive Internet traffic directly, without going through an on-premises location for inspection and auditing. One way to achieve this is to specify routing behavior using [custom user-defined routes](../virtual-network/virtual-networks-udr-overview.md#user-defined) (UDRs). After configuring forced tunneling, specify a custom UDR for the subnet(s) for which you want to send Internet traffic directly to the Internet (not to the on-premises location). In this type of configuration, only the subnets that have a specified UDR send Internet traffic directly to the Internet. Other subnets continue to have Internet traffic force-tunneled to the on-premises location.

You can also create this type of configuration when working with peered VNets. A custom UDR can be applied to a subnet of a peered VNet that traverses through the VNet containing the VPN Gateway S2S connection.

## Considerations

Forced tunneling is configured using Azure PowerShell. You can't configure forced tunneling using the Azure portal.

* Each virtual network subnet has a built-in, system routing table. The system routing table has the following three groups of routes:
  
  * **Local VNet routes:** Directly to the destination VMs in the same virtual network.
  * **On-premises routes:** To the Azure VPN gateway.
  * **Default route:** Directly to the Internet. Packets destined to the private IP addresses not covered by the previous two routes are dropped.

* In this scenario, forced tunneling must be associated with a VNet that has a route-based VPN gateway. Your forced tunneling configuration overrides the default route for any subnet in its VNet. You need to set a "default site" among the cross-premises local sites connected to the virtual network. Also, the on-premises VPN device must be configured using 0.0.0.0/0 as traffic selectors.

* ExpressRoute forced tunneling isn't configured via this mechanism, but instead, is enabled by advertising a default route via the ExpressRoute BGP peering sessions. For more information, see the [ExpressRoute Documentation](../expressroute/index.yml).

## Forced tunneling

The following example shows all Internet traffic being forced through the VPN gateway back to the on-premises location for inspection and auditing. Configure [forced tunneling](site-to-site-tunneling.md) by specifying a default site.

**Forced tunneling example**

:::image type="content" source="./media/about-site-to-site-tunneling/forced-tunnel.png" alt-text="Diagram shows forced tunneling." lightbox="./media/about-site-to-site-tunneling/forced-tunnel-high-res.png":::

## Forced tunneling and UDRs

You may want Internet-bound traffic from certain subnets (but not all subnets) to traverse from the Azure network infrastructure directly out to the Internet. This scenario can be configured using a combination of forced tunneling and virtual network custom user-defined routes. For steps, see [Forced tunneling and UDRs](site-to-site-tunneling.md).

**Forced tunneling and UDRs example**

:::image type="content" source="./media/about-site-to-site-tunneling/tunnel-user-defined-routing.png" alt-text="Diagram shows split tunneling." lightbox="./media/about-site-to-site-tunneling/tunnel-user-defined-routing-high-res.png":::

* **Frontend subnet**: Internet-bound traffic is tunneled directly to the Internet using a custom UDR that specifies this setting. The workloads in the Frontend subnet can accept and respond to customer requests from the Internet directly.

* **Mid-tier and Backend subnets**: These subnets continue to be force tunneled because a default site has been specified for the VPN gateway. Any outbound connections from these two subnets to the Internet are forced or redirected back to an on-premises site via S2S VPN tunnels through the VPN gateway.

## Next steps

* See [How to configure forced tunneling for VPN Gateway S2S connections](site-to-site-tunneling.md).

* For more information about virtual network traffic routing, see [VNet traffic routing](../virtual-network/virtual-networks-udr-overview.md).