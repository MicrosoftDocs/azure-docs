---
title: 'About forced tunneling for site-to-site'
description: Learn about forced tunneling methods for VPN Gateway site-to-site connections.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 09/22/2023
ms.author: cherylmc
---

# About forced tunneling for site-to-site configurations

This article helps you understand how forced tunneling works for site-to-site (S2S) IPsec connections. By default, Internet-bound traffic from your workloads and VMs within a virtual network is sent directly to the Internet.

Forced tunneling lets you redirect or "force" all Internet-bound traffic back to your on-premises location via S2S VPN tunnel for inspection and auditing. This is a critical security requirement for most enterprise IT policies. Unauthorized Internet access can potentially lead to information disclosure or other types of security breaches.

The following example shows all Internet traffic being forced through the VPN gateway back to the on-premises location for inspection and auditing.

:::image type="content" source="./media/about-site-to-site-tunneling/forced-tunnel.png" alt-text="Diagram shows forced tunneling." lightbox="./media/about-site-to-site-tunneling/forced-tunnel-high-res.png":::

## Configuration methods for forced tunneling

There are a few different ways that you can configure forced tunneling.

### Configure using BGP

You can configure forced tunneling for VPN Gateway via BGP. You  need to advertise a default rout of 0.0.0.0/0 via BGP from your on-premises location to Azure so that all your Azure traffic is sent via the VPN Gateway S2S tunnel.

### Configure using Default Site

You can configure forced tunneling by setting the Default Site for your route-based VPN gateway. For steps, see [Forced tunneling via Default Site](site-to-site-tunneling.md).

* You assign a Default Site for the virtual network gateway using PowerShell.
* The on-premises VPN device must be configured using 0.0.0.0/0 as traffic selectors.

## Routing Internet-bound traffic for specific subnets

By default, all Internet-bound traffic goes directly to the Internet if you don't have forced tunneling configured. When forced tunneling is configured, all Internet-bound traffic is sent to your on-premises location.

In some cases, you may want Internet-bound traffic only from certain subnets (but not all subnets) to traverse from the Azure network infrastructure directly out to the Internet, rather than to your on-premises location. This scenario can be configured using a combination of forced tunneling and virtual network custom user-defined routes (UDRs). For steps, see [Route Internet-bound traffic for specific subnets](site-to-site-tunneling.md#udr).

## Next steps

* See [How to configure forced tunneling via Default Site for VPN Gateway S2S connections](site-to-site-tunneling.md).

* For more information about virtual network traffic routing, see [VNet traffic routing](../virtual-network/virtual-networks-udr-overview.md).