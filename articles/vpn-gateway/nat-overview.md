---
title: 'About NAT (Network Address Translation) on VPN Gateway'
titleSuffix: Azure VPN Gateway
description: Learn about NAT (Network Address Translation) in Azure VPN to connect networks with overlapping address spaces.
author: cherylmc
ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 05/02/2023
ms.author: cherylmc
ms.custom: template-concept
---
# About NAT on Azure VPN Gateway

This article provides an overview of NAT (Network Address Translation) support in Azure VPN Gateway. NAT defines the mechanisms to translate one IP address to another in an IP packet. There are multiple scenarios for NAT:

* Connect multiple networks with overlapping IP addresses
* Connect from networks with private IP addresses (RFC1918) to the Internet (Internet breakout)
* Connect IPv6 networks to IPv4 networks (NAT64)

> [!IMPORTANT]
> Azure VPN Gateway NAT supports the first scenario to connect on-premises networks or branch offices to an Azure virtual network with overlapping IP addresses. Internet breakout and NAT64 are **NOT** supported.

## <a name="why"></a>Overlapping address spaces

Organizations commonly use private IP addresses defined in RFC1918 for internal communication in their private networks. When these networks are connected using VPN over the Internet or across private WAN, the address spaces **must not** overlap otherwise the communication would fail. To connect two or more networks with overlapping IP addresses, NAT is deployed on the gateway devices connecting the networks.

## <a name="type"></a>NAT type: static & dynamic

NAT on a gateway device translates the source and/or destination IP addresses, based on the NAT policies or rules to avoid address conflict. There are different types of NAT translation rules:

* **Static NAT**: Static rules define a fixed address mapping relationship. For a given IP address, it will be mapped to the same address from the target pool. The mappings for static rules are stateless because the mapping is fixed.

* **Dynamic NAT**: For dynamic NAT, an IP address can be translated to different target IP addresses based on availability, or with a different combination of IP address and TCP/UDP port. The latter is also called NAPT, Network Address and Port Translation. Dynamic rules will result in stateful translation mappings depending on the traffic flows at any given time.

> [!NOTE]
> When Dynamic NAT rules are used, traffic is unidirectional which means communication must be initiated from the site that is represented in the Internal Mapping field of the rule. If traffic is initiated from the External Mapping, the connection will not be established. If you require bidirectional traffic initiation, then use a static NAT rule to define a 1:1 mapping.

Another consideration is the address pool size for translation. If the target address pool size is the same as the original address pool, use static NAT rule to define a 1:1 mapping in a sequential order. If the target address pool is smaller than the original address pool, use dynamic NAT rule to accommodate the differences.

> [!IMPORTANT]
> * NAT is supported on the following SKUs: VpnGw2~5, VpnGw2AZ~5AZ.
> * NAT is supported on IPsec cross-premises connections only. VNet-to-VNet connections or P2S connections are not supported.
> * Every Dynamic NAT rule can be assigned to a single connection.

## <a name="mode"></a>NAT mode: ingress & egress

Each NAT rule defines an address mapping or translating relationship for the corresponding network address space:

* Ingress: An **IngressSNAT** rule maps an on-premises network address space to a translated address space to avoid address overlap.

* Egress: An **EgressSNAT** rule maps the Azure VNet address space to another translated address space. 

For each NAT rule, the following two fields specify the address spaces before and after the translation:

* **Internal Mappings**: The address space **before** the translation. For an ingress rule, this field corresponds to the original address space of the on-premises network. For an egress rule, this is the original VNet address space.

* **External Mappings**: The address space **after** the translation for on-premises networks (ingress) or VNet (egress). For different networks connected to an Azure VPN gateway, the address spaces for all **External Mappings** must not overlap with each other and with the networks connected without NAT.

## <a name="routing"></a>NAT and routing

Once a NAT rule is defined for a connection, the effective address space for the connection will change with the rule. If BGP is enabled on the Azure VPN gateway, select the "Enable BGP Route Translation" to automatically convert the routes learned and advertised on connections with NAT rules:

* Learned routes: The destination prefixes of the routes learned over a connection with the IngressSNAT rules will be translated from the Internal Mapping prefixes (pre-NAT) to the External Mapping prefixes (post-NAT) of those rules.

* Advertised routes: Azure VPN gateway will advertise the External Mapping (post-NAT) prefixes of the EgressSNAT rules for the VNet address space, and the learned routes with post-NAT address prefixes from other connections.

* BGP peer IP address consideration for a NAT'ed on-premises network:
   * APIPA (169.254.0.1 to 169.254.255.254) address: NAT isn't supported with BGP APIPA addresses.
   * Non-APIPA address: Exclude the BGP Peer IP addresses from the NAT range.

> [!NOTE]
> The learned routes on connections without IngressSNAT rules will not be converted. The VNet routes advertised to connections without EgressSNAT rules will also not be converted.
>

## <a name="example"></a>NAT example

The following diagram shows an example of Azure VPN NAT configurations:

:::image type="content" source="./media/nat-overview/vpn-nat.png" alt-text="Diagram showing NAT configuration and rules." lightbox="./media/nat-overview/vpn-nat.png":::

The diagram shows an Azure VNet and two on-premises networks, all with address space of 10.0.1.0/24. To connect these two networks to the Azure VNet and VPN gateway, create the following rules:

* IngressSNAT rule 1: This rule translates the on-premises address space 10.0.1.0/24 to 100.0.2.0/24.

* IngressSNAT rule 2: This rule translates the on-premises address space 10.0.1.0/24 to 100.0.3.0/24.

* EgressSNAT rule 1: This rule translates the VNet address space 10.0.1.0/24 to 100.0.1.0/24.

In the diagram, each connection resource has the following rules:

* Connection 1 (VNet-Branch1):
  * IngressSNAT rule 1
  * EgressSNAT rule 1

* Connection 2 (VNet-Branch2)
  * IngressSNAT rule 2
  * EgressSNAT rule 1

Based on the rules associated with the connections, here are the address spaces for each network:

| Network  | Original    | Translated   |
| ---      | ---         | ---          |
| VNet     | 10.0.1.0/24 | 100.0.1.0/24 |
| Branch 1 | 10.0.1.0/24 | 100.0.2.0/24 |
| Branch 2 | 10.0.1.0/24 | 100.0.3.0/24 |

The following diagram shows an IP packet from Branch 1 to VNet, before and after the NAT translation:

:::image type="content" source="./media/nat-overview/nat-packet.png" alt-text="Diagram showing before and after NAT translation." lightbox="./media/nat-overview/nat-packet.png" border="false":::

> [!IMPORTANT]
> A single SNAT rule defines the translation for **both** directions of a particular network:
>
> * An IngressSNAT rule defines the translation of the source IP addresses coming **into** the Azure VPN gateway from the on-premises network. It also handles the translation of the destination IP addresses leaving from the VNet to the same on-premises network.
> * An EgressSNAT rule defines the translation of the source IP addresses leaving the Azure VPN gateway to on-premises networks. It also handles the translation of the destination IP addresses for packets coming into the VNet via those connections with the EgressSNAT rule.
> * In either case, no **DNAT** rules are needed.

## <a name="config"></a>NAT configuration

To implement the NAT configuration shown in the previous section, first create the NAT rules in your Azure VPN gateway, then create the connections with the corresponding NAT rules associated. See [Configure NAT on Azure VPN gateways](nat-howto.md) for steps to configure NAT for your cross-premises connections.

## NAT limitations and considerations

[!INCLUDE [NAT limitations](../../includes/vpn-gateway-nat-limitations.md)]

## <a name="faq"></a>NAT FAQ

[!INCLUDE [vpn-gateway-faq-nat-include](../../includes/vpn-gateway-faq-nat-include.md)]

## Next steps

See [Configure NAT on Azure VPN gateways](nat-howto.md) for steps to configure NAT for your cross-premises connections.
