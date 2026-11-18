---
title: Azure Multicloud Interconnect availability and limits
description: Review supported cloud providers, regions, bandwidth, routing requirements, pricing, and known limitations for Azure Multicloud Interconnect Preview.
author: duongau
ms.author: duau
ms.service: azure
ms.custom: references_regions
ms.topic: concept-article
ms.date: 11/16/2026
---

# Azure Multicloud Interconnect availability and limits

This article describes what Azure Multicloud Interconnect supports, along with the limitations for supported cloud service providers.

## Supported cloud providers

Azure Multicloud Interconnect supports Amazon Web Services (AWS) during preview. Support for other cloud service providers is announced separately.

| Provider | Release stage | Supported bandwidth  | 
|---------------|-----|-----|
| Amazon Web Services | Generally available | 1G, 2G, 5G, 10G, 20G, 50G, 100G |
| Google Cloud | Public preview | 1G |

> [!IMPORTANT]
> Azure Multicloud Interconnect is currently in preview with Google Cloud.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


## Supported regions

You can create an interconnect in the following Azure regions during preview:

| Peering locations | Zone | Cloud providers |
|--|--|--|
| Australia East | 1 | Amazon Web Services |
| East US | 1 | Amazon Web Services, Google Cloud |
| Germany West Central | 1 | Amazon Web Services, Google Cloud |
| West US | 1 | Google Cloud |

Region availability is subject to change during preview.

> [!NOTE]
> Amazon Web Services (AWS) connectivity in West US isn't supported at general availability (GA). 

## Supported SKUs

Azure Multicloud Interconnect supports Local and Premium SKUs for generally available connectivity. 
Local provides connectivity to Azure regions associated with the selected Multicloud Interconnect location, while Premium provides connectivity to Azure regions globally.

| SKU  | Connectivity scope |
|---------------|-----|
| Local | Local Azure regions | 
| Premium | All Azure regions | 

## Supported Azure network connections

You can connect Azure Multicloud Interconnect to Azure virtual networks by using an ExpressRoute virtual network gateway or Azure Virtual WAN.

### ExpressRoute virtual network gateway
Azure Multicloud Interconnect supports up to 10 virtual network gateway connections per interconnect.
You can connect the interconnect to an existing compatible ExpressRoute virtual network gateway or to a new ExpressRoute virtual network gateway.

### Azure Virtual WAN
Azure Multicloud Interconnect supports connections to an Azure Virtual WAN hub that has an ExpressRoute gateway.
Currently, you must use the authorization key workflow to associate an Azure Multicloud Interconnect with an ExpressRoute gateway in a Virtual WAN hub.
To create the association, generate an authorization key for the Azure Multicloud Interconnect circuit and use the authorization key and circuit resource URI when you connect the circuit to the Virtual WAN hub.

> [!NOTE]
> Direct circuit selection isn't currently supported for Azure Multicloud Interconnect connections to Virtual WAN. Use the authorization key workflow to create the connection.

> [!IMPORTANT]
> Each connection supports a maximum of 250 prefixes. Before you add a virtual network gateway connection, review the routes that the connected virtual network and its peered virtual networks advertise.
> 
> If a connection advertises more than 250 prefixes, the Azure Multicloud Interconnect connection goes down and connectivity is interrupted.
> 
> Plan your address spaces so that routes can be summarized where possible. For large hub-and-spoke networks, use summarized prefixes to reduce the number of routes advertised from the virtual network gateway.
> 
> Also review the route limits for the participating cloud service provider. End-to-end connectivity depends on staying within the routing limits on both sides of the interconnect.

For information about route summarization and managing the number of routes advertised by an ExpressRoute virtual network gateway, see [Manage route scale for ExpressRoute virtual network gateways](/azure/expressroute/expressroute-connection-manage-advertised-routes).

## Routing requirements

Microsoft reserves the following resources for internal use:

- ASN range: 65515–65520
- IPv4 prefix: 169.254.255.0/24
- IPv6 prefix: fc00:ffff:ffff:ffff/120
 
When you configure connectivity between Microsoft and other cloud providers, use ASNs and IP addresses outside of these reserved ranges.

## Pricing

Pricing depends on the location, SKU, and bandwidth. See [Azure Multicloud Interconnect pricing](https://azure.microsoft.com/pricing) for current Azure charges. The participating provider can charge separately. 

Preview pricing can differ from GA pricing. Review the terms for the provider before you deploy.

> [!NOTE]
> The price listed for 40 Gbps applies to the 50 Gbps bandwidth option.

## Service-level agreement

For GA connectivity, use the official [Azure Multicloud Interconnect SLA](https://www.microsoft.com/licensing/docs/view/Service-Level-Agreements-SLA-for-Online-Services?azure-portal=true) page for the current uptime commitment, terms, and exclusions. Public preview connectivity doesn't have an Azure Multicloud Interconnect SLA. 

## Prerequisites

To use Azure Multicloud Interconnect, you need:

- An Azure subscription.
- An account with the supported cloud service provider.
- An ExpressRoute virtual network gateway.
- Non-overlapping address spaces between your Azure virtual networks and your cloud provider virtual networks.

## Known limitations

The following limitations apply during preview:

- Bandwidth is limited to 1 Gbps.
- Azure Multicloud Interconnect supports private connectivity only. Microsoft peering doesn't apply to Azure Multicloud Interconnect.
- Region availability is limited to the regions listed in [Supported regions](#supported-regions).

## Related content

- [What is Azure Multicloud Interconnect Preview?](overview.md)
- [Create an Azure Multicloud Interconnect Preview resource](create-interconnect.md)
- [Redeem an Azure Multicloud Interconnect Preview activation key](redeem-activation-key.md)
- [Azure Multicloud Interconnect Preview FAQ](faq.yml)
- [About ExpressRoute virtual network gateways](/azure/expressroute/expressroute-about-virtual-network-gateways)
- [Advertised gateway prefixes in Azure virtual networks](/azure/virtual-network/advertised-gateway-prefixes-overview)
- [Configure advertised gateway prefixes for a virtual network](/azure/virtual-network/how-to-advertised-gateway-prefixes)
- [About Route-maps for Azure Virtual WAN](/azure/virtual-wan/route-maps-about)
- [Configure Route-maps for Azure Virtual WAN](/azure/virtual-wan/route-maps-how-to)
- [Summarize routes leaving your Virtual WAN](/azure/virtual-wan/route-maps-how-to-summarize-routes-leaving-your-virtual-wan)
- [About route maps for Azure Route Server](/azure/route-server/route-maps-about)
- [Configure route maps for Azure Route Server](/azure/route-server/route-maps-how-to)
