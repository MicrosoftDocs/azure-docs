---
title: Advertised gateway prefixes for route advertisement
description: Learn about advertised gateway prefixes (summarizedGatewayPrefixes), which let you specify summarized CIDR prefixes that Azure hybrid gateways advertise to on-premises networks.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 03/31/2026
ms.custom: template-concept
#CustomerIntent: As a network engineer, I want to configure summarized gateway prefixes so that I can reduce the number of routes advertised from Azure to my on-premises network.
---

# Advertised gateway prefixes overview

Advertised gateway prefixes let you specify summarized (aggregated) CIDR prefixes that Azure hybrid gateways advertise to on-premises networks instead of advertising all individual virtual network and spoke CIDRs. This feature helps reduce the number of advertised routes in large hub-and-spoke designs.

Azure virtual networks support a property named `summarizedGatewayPrefixes` that allows you to provide a list of CIDR prefixes to be advertised in place of the default advertisement behavior. This feature minimizes the number of routes advertised to on-premises.

## When should I use advertised gateway prefixes?

Use advertised gateway prefixes when:

- You have a hub-and-spoke topology where the default behavior would advertise many spoke prefixes to on-premises.

- You want to advertise a summarized CIDR (for example, a /16) instead of many smaller CIDRs (for example, multiple /24s) to reduce the number of advertised prefixes.

- You're approaching ExpressRoute advertised-prefix limits (for example, 1,000 IPv4 prefixes and 100 IPv6 prefixes).

## How it works

### Default behavior (without advertised gateway prefixes)

By default, Azure VPN Gateway and ExpressRoute Gateway advertise all address spaces of the hub virtual network and all address spaces of peered virtual networks to on-premises.

### Behavior when summarizedGatewayPrefixes is set

When `summarizedGatewayPrefixes` is populated:

- Azure VPN Gateway and ExpressRoute Gateway ignore the address space of the virtual network with the gateway (hub) and publish the summarized prefixes instead.

- For each peered virtual network (spoke), Azure VPN Gateway and ExpressRoute Gateway check whether the spoke's address space is covered by the summarized space. If it's covered, the spoke address space isn't advertised.

## Prerequisites and applicability

The `summarizedGatewayPrefixes` property can be set even if there's no gateway subnet or gateway at the moment, but it won't have effect until a gateway subnet and gateway exist in the virtual network.

## Important considerations

### Prefix list rules and shape

- The advertised gateway prefixes list is an independent value. It can be outside what is specified as the virtual network's address space.

- Overlap shouldn't be used among prefixes within the list.

- Overlap with peered virtual networks is allowed and is expected in hub-and-spoke designs.

## FAQ

### Can I set this property before I create a gateway subnet?

Yes. The `summarizedGatewayPrefixes` property can be set, but it won't have effect until a gateway subnet and gateway exist in the virtual network.

### What happens if I set this value on a spoke virtual network?

The `summarizedGatewayPrefixes` property is only read from the hub virtual network that contains the gateway subnet. If this property is set on spoke (peered) virtual networks, it's ignored.

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
