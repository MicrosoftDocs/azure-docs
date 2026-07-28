---
title: Advertised gateway prefixes in Azure virtual networks
titleSuffix: Azure Virtual Network
description: Learn about advertised gateway prefixes (summarizedGatewayPrefixes), which let Azure VPN Gateway and ExpressRoute gateways advertise summarized CIDR prefixes to on-premises networks.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 03/31/2026
ms.custom: template-concept
#CustomerIntent: As a network engineer, I want to configure summarized gateway prefixes so that I can reduce the number of routes advertised from Azure to my on-premises network.
---

# Advertised gateway prefixes in Azure virtual networks

Advertised gateway prefixes let you specify summarized (aggregated) CIDR prefixes that Azure hybrid gateways advertise to on-premises networks instead of advertising all individual virtual network and spoke CIDRs. This feature helps reduce the number of advertised routes in large hub-and-spoke designs.

Azure virtual networks support a property named `summarizedGatewayPrefixes` that you use to provide a list of CIDR prefixes to advertise in place of the default advertisement behavior. This feature minimizes the number of routes advertised to on-premises.

## When should I use advertised gateway prefixes?

Use advertised gateway prefixes when all the following conditions are true:

- You have a hub-and-spoke topology where the default behavior would advertise many spoke prefixes to on-premises.

- You want to advertise a summarized CIDR (for example, a /16) instead of many smaller CIDRs (for example, multiple /24s) to reduce the number of advertised prefixes.

- You're approaching ExpressRoute advertised-prefix limits (for example, 1,000 IPv4 prefixes and 100 IPv6 prefixes).

## How it works

### Default behavior (without advertised gateway prefixes)

By default, Azure VPN Gateway and ExpressRoute Gateway advertise all address spaces of the hub virtual network and all address spaces of peered virtual networks to on-premises.

### Behavior when summarizedGatewayPrefixes is set

When you set `summarizedGatewayPrefixes`:

- Azure VPN Gateway and ExpressRoute Gateway ignore the address space of the virtual network with the gateway (hub) and publish the summarized prefixes instead.

- When configuring summarized CIDRs, ensure that the summarized prefix includes the gateway virtual network address space.

- For each peered virtual network (spoke), Azure VPN Gateway and ExpressRoute Gateway check whether the spoke's address space is covered by the summarized space. If it's covered, the spoke address space isn't advertised.

## Prerequisites and applicability

You can set the `summarizedGatewayPrefixes` property even if the virtual network doesn't have a gateway subnet or gateway. However, this property doesn't take effect until the virtual network has a gateway subnet and gateway.

## Important considerations

### Prefix list rules and shape

- The advertised gateway prefixes list is an independent value. It can be outside the virtual network's specified address space.

- Don't use overlapping prefixes within the list.

- Overlap with peered virtual networks is allowed and expected in hub-and-spoke designs.

## FAQ

### Can I set this property before I create a gateway subnet?

Yes. You can set the `summarizedGatewayPrefixes` property, but it doesn't take effect until the virtual network has a gateway subnet and gateway.

### What happens if I set this value on a spoke virtual network?

The hub virtual network that contains the gateway subnet is the only virtual network that reads the `summarizedGatewayPrefixes` property. If you set this property on spoke (peered) virtual networks, it's ignored.

### What happens to spoke virtual networks that are covered by my summarized prefixes?

Their address spaces are suppressed from advertisement when covered by the summarized space.

### Does summarization require Azure Route Server?

No. Summarization doesn't require Azure Route Server.

## Related content

- [Azure virtual network peering](virtual-network-peering-overview.md)
- [Azure virtual network traffic routing](virtual-networks-udr-overview.md)
- [About ExpressRoute virtual network gateways](../expressroute/expressroute-about-virtual-network-gateways.md)
- [ExpressRoute FAQ](../expressroute/expressroute-faqs.md)
- [VPN Gateway FAQ](../vpn-gateway/vpn-gateway-vpn-faq.md)
