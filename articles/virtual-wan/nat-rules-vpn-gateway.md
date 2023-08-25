---
title: 'Configure VPN NAT rules for your gateway'
titleSuffix: Azure Virtual WAN
description: Learn how to configure NAT rules for your VWAN VPN gateway.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc

---

# Configure NAT rules for your Virtual WAN VPN gateway

You can configure your Virtual WAN VPN gateway with static one-to-one NAT rules. A NAT rule provides a mechanism to set up one-to-one translation of IP addresses. NAT can be used to interconnect two IP networks that have incompatible or overlapping IP addresses. A typical scenario is branches with overlapping IPs that want to access Azure VNet resources.

This configuration uses a flow table to route traffic from an external (host) IP Address to an internal IP address associated with an endpoint inside a virtual network (virtual machine, computer, container, etc.).

:::image type="content" source="./media/nat-rules-vpn-gateway/diagram.png" alt-text="Diagram showing architecture." lightbox="./media/nat-rules-vpn-gateway/diagram.png":::

To use NAT, VPN devices need to use any-to-any (wildcard) traffic selectors. Policy Based (narrow) traffic selectors aren't supported in conjunction with NAT configuration.

## <a name="rules"></a>Configure NAT rules

You can configure and view NAT rules on your VPN gateway settings at any time.

## <a name="type"></a>NAT type: static & dynamic

NAT on a gateway device translates the source and/or destination IP addresses, based on the NAT policies or rules to avoid address conflict. There are different types of NAT translation rules:

* **Static NAT**: Static rules define a fixed address mapping relationship. For a given IP address, it will be mapped to the same address from the target pool. The mappings for static rules are stateless because the mapping is fixed. For example, a NAT rule created to map 10.0.0.0/24 to 192.168.0.0/24 will have a fixed 1-1 mapping. 10.0.0.0 is translated to 192.168.0.0, 10.0.0.1 is translated to 192.168.0.1, and so on.

* **Dynamic NAT**: For dynamic NAT, an IP address can be translated to different target IP addresses and TCP/UDP port based on availability, or with a different combination of IP address and TCP/UDP port. The latter is also called NAPT, Network Address and Port Translation. Dynamic rules will result in stateful translation mappings depending on the traffic flows at any given time. Due to the nature of Dynamic NAT and the ever-changing IP/Port combinations, flows that make use of Dynamic NAT rules have to be initiated from the **Internal Mapping** (Pre-NAT) IP Range. The dynamic mapping is released once the flow is disconnected or gracefully terminated.

Another consideration is the address pool size for translation. If the target address pool size is the same as the original address pool, use static NAT rule to define a 1:1 mapping in a sequential order. If the target address pool is smaller than the original address pool, use dynamic NAT rule to accommodate the differences.

> [!NOTE]
> Site-to-site NAT is not supported with site-to-site VPN connections where policy-based traffic selectors are used.

   :::image type="content" source="./media/nat-rules-vpn-gateway/edit-rules.png" alt-text="Screenshot showing how to edit rules."lightbox="./media/nat-rules-vpn-gateway/edit-rules.png":::

1. Navigate to your virtual hub.
1. Select **VPN (Site to site)**.
1. Select **NAT rules (Edit)**.
1. On the **Edit NAT Rule** page, you can **Add/Edit/Delete** a NAT rule using the following values:

   * **Name:** A unique name for your NAT rule.
   * **Type:** Static or Dynamic. Static one-to-one NAT establishes a one-to-one relationship between an internal address and an external address while Dynamic NAT assigns an IP and port based on availability.
   * **IP Configuration ID:** A NAT rule must be configured to a specific VPN gateway instance. This is applicable to Dynamic NAT only. Static NAT rules are automatically applied to both VPN gateway instances.
   * **Mode:** IngressSnat or EgressSnat.
      * IngressSnat mode (also known as Ingress Source NAT) is applicable to traffic entering the Azure hub’s site-to-site VPN gateway.
      * EgressSnat mode (also known as Egress Source NAT) is applicable to traffic leaving the Azure hub’s site-to-site VPN gateway.
   * **Internal Mapping:** An address prefix range of source IPs on the inside network that will be mapped to a set of external IPs. In other words, your pre-NAT address prefix range.
   * **External Mapping:** An address prefix range of destination IPs on the outside network that source IPs will be mapped to. In other words, your post-NAT address prefix range.
   * **Link Connection:** Connection resource that virtually connects a VPN site to the Azure Virtual WAN hub's site-to-site VPN gateway.

> [!NOTE]
> If you want the site-to-site VPN gateway to advertise translated (**External Mapping**) address prefixes via BGP, click the **Enable BGP Translation** button, due to which on-premises will automatically learn the post-NAT range of Egress Rules and Azure (Virtual WAN hub, connected virtual networks, VPN and ExpressRoute branches) will automatically learn the post-NAT range of Ingress rules. The new POST NAT ranges will be shown on the Effective Routes table in a virtual hub. The **Enable Bgp Translation** setting is applied to all NAT rules on the Virtual WAN hub site-to-site VPN gateway.

## <a name="examples"></a>Example configurations

### Ingress SNAT (BGP-enabled VPN site)

**Ingress SNAT rules** are applied on packets that are entering Azure through the Virtual WAN site-to-site VPN gateway. In this scenario, you want to connect two site-to-site VPN branches to Azure. VPN Site 1 connects via Link A, and VPN Site 2 connects via Link B. Each site has the same address space 10.30.0.0/24.

In this example, we'll NAT site1 to 172.30.0.0.0/24. The Virtual WAN spoke virtual networks and branches other will automatically learn this post-NAT address space.

The following diagram shows the projected result:

:::image type="content" source="./media/nat-rules-vpn-gateway/diagram-bgp.png" alt-text="Diagram showing Ingress mode NAT for Sites that are BGP-enabled." lightbox="./media/nat-rules-vpn-gateway/diagram-bgp.png":::

1. Specify a NAT rule.

   Specify a NAT rule to ensure the site-to-site VPN gateway can distinguish between the two branches with overlapping address spaces (such as 10.30.0.0/24). In this example, we focus on Link A for VPN Site 1.

   The following NAT rule can be set up and associated with Link A. Because this is a static NAT rule, the address spaces of the **Internal Mapping** and **External Mapping** contain the same number of IP addresses.

   * **Name:** ingressRule01
   * **Type:** Static
   * **Mode:** IngressSnat
   * **Internal Mapping:** 10.30.0.0/24
   * **External Mapping:** 172.30.0.0/24
   * **Link Connection:** Link A

1. Toggle **BGP Route Translation** to 'Enable'.

   :::image type="content" source="./media/nat-rules-vpn-gateway/enable-bgp.png" alt-text="Screenshot showing how to enable BGP translation.":::

1. Ensure the site-to-site VPN gateway can peer with the on-premises BGP peer.

   In this example, the **Ingress NAT Rule** will need to translate 10.30.0.132 to 172.30.0.132. To do that, click 'Edit VPN site' to configure VPN site Link A BGP address to reflect this translated BGP peer address (172.30.0.132).

   :::image type="content" source="./media/nat-rules-vpn-gateway/edit-site-bgp.png" alt-text="Screenshot showing how to change the BGP peering IP."lightbox="./media/nat-rules-vpn-gateway/edit-site-bgp.png":::

### <a name="considerations"></a>Considerations if the VPN site connects via BGP

* The subnet size for both internal and external mapping must be the same for static one-to-one NAT.
* If **BGP Translation** is enabled, the site-to-site VPN gateway will automatically advertise the **External Mapping** of **Egress NAT rules** to on-premises as well as **External Mapping** of **Ingress NAT rules** to Azure (virtual WAN hub, connected spoke virtual networks, connected VPN/ExpressRoute). If **BGP Translation** is disabled, translated routes aren't automatically advertised to the on-premises. As such, the on-premises BGP speaker must be configured to advertise the post-NAT (**External Mapping**) range of **Ingress NAT** rules associated to that VPN site link connection. Similarly, a route for the post-NAT (**External Mapping**) range of **Egress NAT Rules** must be applied on the on-premises device.
* The site-to-site VPN gateway automatically translates the on-premises BGP peer IP address **if** the on-premises BGP peer IP address is contained within the **Internal Mapping** of an **Ingress NAT Rule**. As a result, the VPN site's **Link Connection BGP address** must reflect the NAT-translated address (part of the External Mapping).

   For instance, if the on-premises BGP IP address is 10.30.0.133 and there is an **Ingress NAT Rule** that translates 10.30.0.0/24 to 172.30.0.0/24, the VPN site's **Link Connection BGP Address** must be configured to be the translated address (172.30.0.133).
* In Dynamic NAT, on-premises BGP peer IP can't be part of the pre-NAT address range (**Internal Mapping**) as IP and port translations aren't fixed. If there is a need to translate the on-premises BGP peering IP, please create a separate **Static NAT Rule** that translates BGP Peering IP address only.

   For instance, if the on-premises network has an address space of 10.0.0.0/24 with an on-premises BGP peer IP of 10.0.0.1 and there is an **Ingress Dynamic NAT Rule** to translate 10.0.0.0/24 to 192.198.0.0/32, a separate **Ingress Static NAT Rule** translating 10.0.0.1/32 to 192.168.0.02/32 is required and the corresponding VPN site's **Link Connection BGP address** must be updated to the NAT-translated address (part of the External Mapping).

### Ingress SNAT (VPN site with statically configured routes)

**Ingress SNAT rules** are applied on packets that are entering Azure through the Virtual WAN site-to-site VPN gateway. In this scenario, you want to connect two site-to-site VPN branches to Azure. VPN Site 1 connects via Link A, and VPN Site 2 connects via Link B. Each site has the same address space 10.30.0.0/24.

In this example, we'll NAT VPN site 1 to 172.30.0.0.0/24. However, because the VPN Site isn't connected to the site-to-site VPN gateway via BGP, the configuration steps are slightly different than the BGP-enabled example.

   :::image type="content" source="./media/nat-rules-vpn-gateway/diagram-static.png" alt-text="Screenshot showing diagram configurations for VPN sites that use static routing.":::

1. Specify a NAT rule.

    Specify a NAT rule to ensure the site-to-site VPN gateway can distinguish between the two branches with the same address space 10.30.0.0/24. In this example, we focus on Link A for VPN Site 1.

    The following NAT rule can be set up and associated with Link A of one of VPN site 1. Because this is a static NAT rule, the address spaces of the **Internal Mapping** and **External Mapping** contain the same number of IP addresses.

    * **Name**: IngressRule01
    * **Type**: Static
    * **Mode**: IngressSnat
    * **Internal Mapping**: 10.30.0.0/24
    * **External Mapping**: 172.30.0.0/24
    * **Link Connection**: Link A

1. Edit the 'Private Address space' field of VPN Site 1 to ensure the site-to-site VPN gateway learns the post-NAT range (172.30.0.0/24).

   * Go to the virtual hub resource that contains the site-to-site VPN gateway. On the virtual hub page, under Connectivity, select **VPN (Site-to-site)**.

   * Select the VPN site that is connected to the Virtual WAN hub via Link A. Select **Edit Site** and input 172.30.0.0/24 as the private address space for the VPN site.

     :::image type="content" source="./media/nat-rules-vpn-gateway/vpn-site-static.png" alt-text="Screenshot showing how to edit the Private Address space of a VPN site" lightbox="./media/nat-rules-vpn-gateway/vpn-site-static.png":::

### <a name="considerationsnobgp"></a>Considerations if VPN sites are statically configured (not connected via BGP)

* The subnet size for both internal and external mapping must be the same for static one-to-one NAT.
* Edit the VPN site in Azure portal to add the prefixes in the **External Mapping** of **Ingress NAT Rules** in the 'Private Address Space' field.
* For configurations involving **Egress NAT Rules**, a Route Policy or Static Route with the **External Mapping** of the **Egress NAT rule** needs to be applied on the on-premises device.

### Packet flow

In the preceding examples, an on-premises device wants to reach a resource in a spoke virtual network. The packet flow is as follows, with the NAT translations in bold.

1. Traffic from on-premises is initiated.
   * Source IP Address: **10.30.0.4**
   * Destination IP Address: 10.200.0.4

1. Traffic enters site-to-site gateway and is translated using the NAT rule and then sent to the Spoke.
   * Source IP Address: **172.30.0.4**
   * Destination IP Address: 10.200.0.4

1. Reply from Spoke is initiated.
   * Source IP Address: 10.200.0.4
   * Destination IP Address: **172.30.0.4**

1. Traffic enters the site-to-site VPN gateway, and the translation is reversed and sent to on-premises.
   * Source IP Address: 10.200.0.4
   * Destination IP Address: **10.30.0.4**

### Verification checks

This section shows checks to verify that your configuration is set up properly.

#### Validate Dynamic NAT Rules

* Use Dynamic NAT Rules if the target address pool is smaller than the original address pool.
* As IP/Port combinations aren't fixed in a Dynamic NAT Rule, the on-premises BGP Peer IP can't be part of the pre-NAT (**Internal Mapping**) address range. Create a specific Static NAT Rule that translates the BGP Peering IP address only.

   For example:

   * **On-premises address range:** 10.0.0.0/24
   * **On-premises BGP IP:** 10.0.0.1
   * **Ingress Dynamic NAT rule:** 192.168.0.1/32
   * **Ingress Static NAT rule:** 10.0.0.1 -> 192.168.0.2

#### Validate DefaultRouteTable, rules, and routes

Branches in Virtual WAN associate to the **DefaultRouteTable**, implying all branch connections learn routes that are populated within the DefaultRouteTable. You'll see the NAT rule with the translated prefix in the effective routes of the DefaultRouteTable.

From the previous example:

* **Prefix:** 172.30.0.0/24
* **Next Hop Type:** VPN_S2S_Gateway
* **Next Hop:** VPN_S2S_Gateway Resource

#### Validate address prefixes

This example applies to resources in virtual networks that are associated with the DefaultRouteTable.

The **Effective Routes** on Network Interface Cards (NIC) of any virtual machine that is sitting in a spoke virtual network connected to the virtual WAN hub should also contain the address prefixes of the **External Mapping** specified in the **Ingress NAT rule**.

The on-premises device should also contain routes for prefixes contained within the **External Mapping** of **Egress NAT rules**.

#### Common configuration patterns

> [!NOTE]
> Site-to-site NAT is not supported with site-to-site VPN connections where policy-based traffic selectors are used.

The following table shows common configuration patterns that arise when configuring different types of NAT rules on the site-to-site VPN gateway.

| Type of VPN site | Ingress NAT rules | Egress NAT rules
|--- |--- | ---|
|VPN site with statically configured routes |Edit 'Private Address Space' in the VPN Site to contain the **External Mapping** of the NAT rule. | Apply routes for the **External Mapping** of the NAT rule on the on-premises device. |
|VPN site (BGP translation enabled) |Put the **External Mapping** address of the BGP peer in the VPN site Link Connection's BGP address. | No special considerations. |
| VPN site (BGP translation disabled) | Ensure the on-premises BGP Speaker advertises the prefixes in the **External Mapping** of the NAT rule. Also put the External Mapping address of the BGP peer in the VPN site Link Connection's BGP address. | Apply routes for the **External Mapping** of the NAT rule on the on-premises device.|

## Next steps

For more information about site-to-site configurations, see [Configure a Virtual WAN site-to-site connection] (virtual-wan-site-to-site-portal.md).
