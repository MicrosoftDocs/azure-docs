---
title: 'Configure VPN NAT rules for your gateway'
titleSuffix: Azure Virtual WAN
description: Learn how to configure NAT rules for your VWAN VPN gateway
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 02/17/2021
ms.author: cherylmc

---

# Configure NAT Rules for your Virtual WAN VPN gateway - Preview

> [!IMPORTANT]
> NAT rules are currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can configure your Virtual WAN VPN gateway with static one-to-one NAT rules. A NAT rule provides a mechanism to set up one-to-one translation of IP addresses. NAT can be used to interconnect two IP networks that have incompatible or overlapping IP addresses. A typical scenario is branches with overlapping IPs that want to access Azure VNet resources.

This configuration uses a flow table to route traffic from an external (host) IP Address to an internal IP address associated with an endpoint inside a virtual network (virtual machine, computer, container, etc.).

   :::image type="content" source="./media/nat-rules-vpn-gateway/diagram.png" alt-text="Diagram showing architecture.":::

## <a name="view"></a>Configure and view rules

You can configure and view NAT rules on your VPN gateway settings at any time.

   :::image type="content" source="./media/nat-rules-vpn-gateway/edit-rules.png" alt-text="Screenshot showing edit rules.":::

1. Navigate to your virtual hub.
1. Select **VPN (Site to site)**.
1. Select **NAT rules (Edit)**.
1. On the **Edit NAT Rule** page, you can **Add/Edit/Delete** a NAT rule using the following values:

   * **Name:** A unique name for your NAT rule.
   * **Type:** Static. Static one-to-one NAT establishes a one-to-one relationship between an internal address and an external address.
   * **Mode:** IngressSnat or EgressSnat.  
      * IngressSnat mode (also known as Ingress Source NAT) is applicable to traffic entering the Azure hub’s Site-to-site VPN gateway.
      * EgressSnat mode (also known as Egress Source NAT) is applicable to traffic leaving the Azure hub’s Site-to-site VPN gateway.
   * **InternalMapping:** An address prefix range of source IPs on the inside network that will be mapped to a set of external IPs. In other words, your pre-NAT address prefix range.
   * **ExternalMapping:** An address prefix range of destination IPs on the outside network that source IPs will be mapped to. In other words, your post-NAT address prefix range.
   * **Link Connection:** Connection resource that virtually connects a VPN site to the Azure hub’s Site-to-site VPN gateway.

### Configuration considerations

* The subnet size for both internal and external mapping must be the same for Static one-to-one NAT.
* Be sure to edit the VPN site in the Azure portal to add **ExternalMapping** prefixes in the 'Private Address Space' field. Currently, sites that have BGP enabled need to ensure that the on-premises BGP announcer (device BGP settings) include an entry for the external mapping prefixes.

## Next steps

For more information about Site-to-site configurations, see [Configure a Virtual WAN Site-to-site connection](virtual-wan-site-to-site-portal.md).
