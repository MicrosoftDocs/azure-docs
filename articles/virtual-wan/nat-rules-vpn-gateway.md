---
title: 'Configure VPN NAT rules for your gateway'
titleSuffix: Azure Virtual WAN
description: Learn how to configure NAT rules for your VWAN VPN gateway.
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 03/05/2021
ms.author: cherylmc

---

# Configure NAT Rules for your Virtual WAN VPN gateway

You can configure your Virtual WAN VPN gateway with static one-to-one NAT rules. A NAT rule provides a mechanism to set up one-to-one translation of IP addresses. NAT can be used to interconnect two IP networks that have incompatible or overlapping IP addresses. A typical scenario is branches with overlapping IPs that want to access Azure VNet resources.

This configuration uses a flow table to route traffic from an external (host) IP Address to an internal IP address associated with an endpoint inside a virtual network (virtual machine, computer, container, etc.).

   :::image type="content" source="./media/nat-rules-vpn-gateway/diagram.png" alt-text="Diagram showing architecture.":::
   
In order to use NAT, VPN devices need to use any-to-any (wildcard) traffic selectors. Policy Based (narrow) traffic selectors are not supported in conjunction with NAT configuration.

## <a name="rules"></a>Configure NAT rules

You can configure and view NAT rules on your VPN gateway settings at any time.

> [!NOTE]
> Site-to-site NAT is not supported with Site-to-site VPN connections where policy based traffic selectors are used.

   :::image type="content" source="./media/nat-rules-vpn-gateway/edit-rules.png" alt-text="Screenshot showing how to edit rules."lightbox="./media/nat-rules-vpn-gateway/edit-rules.png":::
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
   * **Link Connection:** Connection resource that virtually connects a VPN site to the Azure Virtual WAN Hub's Site-to-site VPN gateway.
 
> [!NOTE]
> If you want the Site-to-site VPN Gateway to advertise translated (**ExternalMapping**) address prefixes via BGP, click the **Enable BGP Translation** button, due to which on-premises will automatically learn the post-NAT range of Egress Rules and Azure (Virtual WAN Hub, connected Virtual Networks, VPN and ExpressRoute branches) will automatically learn the post-NAT range of Ingress rules. 
> Please note that the **Enable Bgp Translation** setting is applied to all NAT rules on the Virtual WAN Hub Site-to-site VPN Gateway. 

## <a name="examples"></a>Example configurations

### Ingress SNAT (BGP-Enabled VPN Site)

**Ingress SNAT rules** are applied on packets that are entering Azure through the Virtual WAN Site-to-site VPN gateway. In this scenario, you want to connect two Site-to-site VPN branches to Azure. VPN Site 1 connects via Link A, and VPN Site 2 connects via Link B. Each site has the same address space 10.30.0.0/24.

In this example, we will NAT site1 to 127.30.0.0.0/24. The Virtual WAN spoke Virtual Networks and branches other will automatically learn this post-NAT address space. 

The following diagram shows the projected end result:

:::image type="content" source="./media/nat-rules-vpn-gateway/diagram-bgp.png" alt-text="Diagram showing Ingress mode NAT for Sites that are BGP-enabled.":::

1. Specify a NAT rule.

   Specify a NAT rule to ensure the Site-to-site VPN gateway is able to distinguish between the two branches with overlapping address spaces (such as 10.30.0.0/24). In this example, we focus on Link A for VPN Site 1.

   The following NAT rule can be set up and associated to Link A. Because this is a static NAT rule, the address spaces of the **InternalMapping** and **ExternalMapping** contain the same number of IP addresses.

   * **Name:** ingressRule01
   * **Type:** Static
   * **Mode:** IngressSnat
   * **InternalMapping:** 10.30.0.0/24
   * **ExternalMapping:** 172.30.0.0/24
   * **Link Connection:** Link A

 2.  Toggle **BGP Route Translation** to 'Enable'.

       :::image type="content" source="./media/nat-rules-vpn-gateway/enable-bgp.png" alt-text="Screenshot showing how to enable BGP translation.":::


3. Ensure the Site-to-site VPN Gateway is able to peer with the on-premises BGP peer.

      In this example, the **Ingress NAT Rule** will need to translate 10.30.0.132 to 127.30.0.132. In order to do that, click 'Edit VPN site' to configure VPN site Link A BGP address to reflect this translated BGP peer address (127.30.0.132). 

   :::image type="content" source="./media/nat-rules-vpn-gateway/edit-site-bgp.png" alt-text="Screenshot showing how to change the BGP peering IP."lightbox="./media/nat-rules-vpn-gateway/edit-site-bgp.png":::

 

### <a name="considerations"></a>Considerations if the VPN site connects via BGP
* The subnet size for both internal and external mapping must be the same for static one-to-one NAT.
* If **BGP Translation** is enabled, the Site-to-site VPN Gateway will automatically advertise the **External Mapping** of **Egress NAT rules** to on-premises as well as **External Mapping** of **Ingress NAT rules** to Azure (Virtual WAN Hub, connected Spoke Virtual Networks, connected VPN/ExpresRoute). If **BGP Translation** is disabled, translated routes are not automatically advertised to the on-premises. As such, the on-premises BGP speaker must be configured to advertise the post-NAT (**ExternalMapping**) range of **Ingress NAT** rules associated to that VPN site link connection. Similarly, a route for the post-NAT (**ExternalMapping**) range of **Egress NAT Rules** must be applied on the on-premises device.
* The Site-to-site VPN Gateway automatically translates the on-premises BGP peer IP address **if** the on-premises BGP peer IP address is contained within the **Internal Mapping** of an **Ingress NAT Rule**. As a result, the VPN site's **Link Connection BGP address** must reflect the NAT-translated address (part of the External Mapping). 

    For instance, if the on-premises BGP IP address is 10.30.0.133 and there is an **Ingress NAT Rule** that translates 10.30.0.0/24 to 127.30.0.0/24, the VPN Site's **Link Connection BGP Address** must be configured to be the translated address (127.30.0.133).

 
### Ingress SNAT (VPN site with statically configured routes)

**Ingress SNAT rules** are applied on packets that are entering Azure through the Virtual WAN Site-to-site VPN gateway. In this scenario, you want to connect two Site-to-site VPN branches to Azure. VPN Site 1 connects via Link A, and VPN Site 2 connects via Link B. Each site has the same address space 10.30.0.0/24.

In this example, we will NAT VPN site 1 to 127.30.0.0.0/24. However, because the VPN Site is not connected to the Site-to-site VPN Gateway via BGP, the configuration steps are slightly different than the BGP-enabled example. 

   :::image type="content" source="./media/nat-rules-vpn-gateway/diagram-static.png" alt-text="Screenshot showing diagram configurations for VPN sites that use static routing.":::


1. Specify a NAT rule.

    Specify a NAT rule to ensure the Site-to-site VPN gateway is able to distinguish between the two branches with the same address space 10.30.0.0/24. In this example, we focus on Link A for VPN Site 1.

    The following NAT rule can be set up and associated to Link A of one of VPN site 1. Because this is a static NAT rule, the address spaces of the **InternalMapping** and **ExternalMapping** contain the same number of IP addresses.

    * **Name**: IngressRule01
    * **Type**: Static
    * **Mode**: IngressSnat
    * **InternalMapping**: 10.30.0.0/24
    * **ExternalMapping**: 172.30.0.0/24
    * **Link Connection**: Link A

2. Edit the 'Private Address space' field of VPN Site 1 to ensure the Site-to-site VPN Gateway learns the post-NAT range (172.30.0.0/24)

   * Navigate to the Virtual hub resource that contains the Site-to-site VPN gateway. On the virtual hub page, under Connectivity, select VPN (Site-to-site).

   * Select the VPN site that is connected to the Virtual WAN hub via Link A. Select Edit Site and input 172.30.0.0/24 as the private address space for the VPN site. 

   :::image type="content" source="./media/nat-rules-vpn-gateway/vpn-site-static.png" alt-text="Screenshot showing how to edit the Private Address space of a VPN site" lightbox="./media/nat-rules-vpn-gateway/vpn-site-static.png":::

### <a name="considerationsnobgp"></a>Considerations if VPN sites are statically configured (not connected via BGP)
* The subnet size for both internal and external mapping must be the same for static one-to-one NAT.
* Edit the VPN site in Azure portal to add the prefixes in the **ExternalMapping** of **Ingress NAT Rules** in the 'Private Address Space' field. 
* For configurations involving **Egress NAT Rules**, a Route Policy or Static Route with the **ExternalMapping** of the **Egress NAT rule** needs to be applied on the on-premises device.

### Packet flow

In the preceding examples, an on-premises device wants to reach a resource in a Spoke Virtual Network. The packet flow is as follows, with the NAT translations in bold.

1. Traffic from on-premises is initiated.
   * Source IP Address: **10.30.0.4**
   * Destination IP Address: 10.200.0.4
1. Traffic enters Site-to-site gateway and is translated using the NAT rule and then sent to the Spoke.
   * Source IP Address: **172.30.0.4**
   * Destination IP Address: 10.200.0.4
1. Reply from Spoke is initiated.
   * Source IP Address: 10.200.0.4
   * Destination IP Address: **172.30.0.4**
1. Traffic enters the Site-to-site VPN gateway and the translation is reversed and sent to on-premises.
   * Source IP Address: 10.200.0.4
   * Destination IP Address: **10.30.0.4**

### Verification checks

This section shows checks to verify that your configuration is set up properly. 

#### Validate DefaultRouteTable, rules, and routes

Branches in Virtual WAN associate to the **DefaultRouteTable**, implying all branch connections learn routes that are populated within the DefaultRouteTable. You will see the NAT rule with the translated prefix in the effective routes of the DefaultRouteTable.

From the previous example:

* **Prefix:** 172.30.0.0/24  
* **Next Hop Type:** VPN_S2S_Gateway
* **Next Hop:** VPN_S2S_Gateway Resource

#### Validate address prefixes

This example applies to resources in Virtual Networks that are associated to the DefaultRouteTable.

The **Effective Routes** on the Network Interface Cards (NIC) of any virtual machine that is sitting in a Spoke Virtual Network connected to the Virtual WAN hub should also contain the address prefixes of the **ExternalMapping** specified in the **Ingress NAT rule** . 

The on-premises device should also contain routes for prefixes contained within the **External Mapping** of **Egress NAT Rules**. 

####  Common configuration patterns 

> [!NOTE]
> Site-to-site NAT is not supported with Site-to-site VPN connections where policy based traffic selectors are used.

The following table shows common configuration patterns that arise when configuring different types of NAT rules on the Site-to-site VPN Gateway.  

| Type of VPN Site | Ingress NAT Rules | Egress NAT Rules
|--- |--- | ---|
|VPN Site with Statically Configured Routes |Edit 'Private Address Space' in the VPN Site to contain the **ExternalMapping** of the NAT rule| Apply routes for the **ExternalMapping** of the NAT Rule on the on-premises device.|
|VPN Site (BGP Translation Enabled)|Put the **ExternalMapping** address of the BGP peer in the VPN site Link Connection's BGP address.  | No special considerations. |
| VPN Site (BGP Translation Disabled) | Ensure the on-premises BGP Speaker advertises the prefixes in the **ExternalMapping** of the NAT Rule. Also put the ExternalMapping address of the BGP peer in the VPN site Link Connection's BGP address.| Apply routes for the **ExternalMapping** of the NAT rule on the on-premises device.|

## Next steps

For more information about Site-to-site configurations, see [Configure a Virtual WAN Site-to-site connection](virtual-wan-site-to-site-portal.md).
