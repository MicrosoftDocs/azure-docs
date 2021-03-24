---
title: 'Configure VPN NAT rules for your gateway'
titleSuffix: Azure Virtual WAN
description: Learn how to configure NAT rules for your VWAN VPN gateway
services: virtual-wan
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 03/05/2021
ms.author: cherylmc

---

# Configure NAT Rules for your Virtual WAN VPN gateway - Preview

> [!IMPORTANT]
> NAT rules are currently in public preview.
> This preview version is provided without a service level agreement and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

You can configure your Virtual WAN VPN gateway with static one-to-one NAT rules. A NAT rule provides a mechanism to set up one-to-one translation of IP addresses. NAT can be used to interconnect two IP networks that have incompatible or overlapping IP addresses. A typical scenario is branches with overlapping IPs that want to access Azure VNet resources.

This configuration uses a flow table to route traffic from an external (host) IP Address to an internal IP address associated with an endpoint inside a virtual network (virtual machine, computer, container, etc.).

   :::image type="content" source="./media/nat-rules-vpn-gateway/diagram.png" alt-text="Diagram showing architecture.":::

## <a name="rules"></a>Configure NAT rules

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

### <a name="considerations"></a>Configuration considerations

* The subnet size for both internal and external mapping must be the same for static one-to-one NAT.
* Be sure to edit the VPN site in the Azure portal to add **ExternalMapping** prefixes in the 'Private Address Space' field. Currently, sites that have BGP enabled need to ensure that the on-premises BGP announcer (device BGP settings) include an entry for the external mapping prefixes.

## <a name="examples"></a>Examples and verification

### Ingress mode NAT

Ingress mode NAT rules are applied on packets that are entering Azure through the Virtual WAN Site-to-site VPN gateway. In this scenario, you want to connect two Site-to-site VPN branches to Azure. VPN Site 1 connects via Link1, and VPN Site 2 connects via Link 2. Each site has the address space 192.169.1.0/24.

The following diagram shows the projected end result:

:::image type="content" source="./media/nat-rules-vpn-gateway/ingress.png" alt-text="Diagram showing Ingress mode NAT.":::

1. Specify a NAT rule.

   Specify a NAT rule to ensure the Site-to-site VPN gateway is able to distinguish between the two branches with overlapping address spaces (such as 192.168.1.0/24). In this example, we focus on Link1 for VPN Site 1.

   The following NAT rule can be set up and associated to Link 1 of one of the branches. Because this is a static NAT rule, the address spaces of the InternalMapping and ExternalMapping contain the same number of IP addresses.

   * **Name:** IngressRule01
   * **Type:** Static
   * **Mode:** IngressSnat
   * **InternalMapping:** 192.168.1.0/24
   * **ExternalMapping:** 10.1.1.0/24
   * **Link Connection:** Link 1

1. Advertise the correct ExternalMapping.

   In this step, ensure that your Site-to-site VPN gateway advertises the correct ExternalMapping address space to the rest of your Azure resources. There are different instructions, depending on whether BGP is enabled, or not.

   **Example 1: BGP is enabled**

   * Ensure that the on-premises BGP speaker located at VPN Site 1 is configured to advertise the 10.1.1.0/24 address space.
   * During this preview, sites that have BGP enabled need to ensure that the on-premises BGP announcer (device BGP settings) include an entry for the external mapping prefixes.

   **Example 2: BGP is not enabled**

   * Navigate to the Virtual hub resource that contains the Site-to-site VPN gateway. On the virtual hub page, under **Connectivity**, select **VPN (Site-to-site)**.
   * Select the VPN site that is connected to the Virtual WAN hub via Link 1. Select **Edit Site** and input 10.1.1.0/24 as the private address space for the VPN site.

     :::image type="content" source="./media/nat-rules-vpn-gateway/edit-site.png" alt-text="Screenshot showing Edit VPN site page.":::

### Packet flow

In this example, an on-premises device wants to reach a spoke virtual network. The packet flow is as follows, with the NAT translations in bold.

1. Traffic from on-premises is initiated.
   * Source IP Address: **192.168.1.1**
   * Destination IP Address: 30.0.0.1
1. Traffic enters Site-to-site gateway and is translated using the NAT rule and then sent to the Spoke.
   * Source IP Address: **10.1.1.1**
   * Destination IP Address: 30.0.0.1
1. Reply from Spoke is initiated.
   * Source IP Address: 30.0.0.1
   * Destination IP Address: **10.1.1.1**
1. Traffic enters the Site-to-site VPN gateway and the translation is reversed and sent to on-premises.
   * Source IP Address: 30.0.0.1
   * Destination IP Address: **192.168.1.1**

### Verification checks

This section shows checks to verify that your configuration is set up properly.

#### Validate DefaultRouteTable, rules, and routes

Branches in Virtual WAN associate to the **DefaultRouteTable**, implying all branch connections learn routes that are populated within the DefaultRouteTable. You will see the NAT rule with the external mapping prefix in the effective routes of the DefaultRouteTable.

Example:

* **Prefix:** 10.1.1.0/24  
* **Next Hop Type:** VPN_S2S_Gateway
* **Next Hop:** VPN_S2S_Gateway Resource

#### Validate address prefixes

This example applies to resources in virtual networks that are associated to the DefaultRouteTable.

The **Effective Routes** on the Network Interface Cards (NIC) of any virtual machine that is sitting in a Spoke virtual network connected to the Virtual WAN hub should also contain the address prefixes of the NAT rules **ExternalMapping**.

#### Validate BGP advertisements

If you have BGP configured on the VPN site connection, check the on-premises BGP speaker to make sure it is advertising an entry for the external mapping prefixes.

## Next steps

For more information about Site-to-site configurations, see [Configure a Virtual WAN Site-to-site connection](virtual-wan-site-to-site-portal.md).
