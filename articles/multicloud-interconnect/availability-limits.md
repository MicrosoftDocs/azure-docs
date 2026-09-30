---
title: Azure Multicloud Interconnect Preview availability and limits
description: Review supported cloud providers, regions, bandwidth, routing requirements, pricing, and known limitations for Azure Multicloud Interconnect Preview.
author: duongau
ms.author: duau
ms.service: azure
ms.custom: references_regions
ms.topic: concept-article
ms.date: 09/07/2026
---

# Azure Multicloud Interconnect Preview availability and limits

This article describes what Azure Multicloud Interconnect supports during preview, along with the limitations that apply while the service is in preview.

> [!IMPORTANT]
> Azure Multicloud Interconnect is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Supported cloud providers

Azure Multicloud Interconnect supports Amazon Web Services (AWS) during preview. Support for other cloud service providers is announced separately.

## Supported regions

You can create an interconnect in the following Azure regions during preview:

- Australia East
- East US
- Germany West Central
- West US

Region availability is subject to change during preview.

## Supported bandwidth

Azure Multicloud Interconnect supports 1 Gbps during preview.

## Supported virtual network gateway connections

Azure Multicloud Interconnect supports one gateway connection per Azure Multicloud Interconnect.

## Routing requirements

Microsoft reserves the following resources for internal use:

- ASN range: 65515–65520
- IPv4 prefix: 169.254.255.0/24
- IPv6 prefix: fc00:ffff:ffff:ffff/120
 
When you configure connectivity between Microsoft and other cloud providers, use ASNs and IP addresses outside of these reserved ranges.

## Pricing

No Azure service charge and no Azure egress charge apply to Azure Multicloud Interconnect during preview.

## Service-level agreement

Azure Multicloud Interconnect doesn't have a service-level agreement during preview. For the terms that apply to Azure previews, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

To use Azure Multicloud Interconnect, you need:

- An Azure subscription.
- An account with the supported cloud service provider.
- An ExpressRoute virtual network gateway.
- Non-overlapping address spaces between your Azure virtual networks and your cloud provider virtual networks.

## Known limitations

The following limitations apply during preview:

- Connectivity is supported to Amazon Web Services only.
- Bandwidth is limited to 1 Gbps.
- Azure Multicloud Interconnect supports private connectivity only. Microsoft peering doesn't apply to Azure Multicloud Interconnect.
- Region availability is limited to the regions listed in [Supported regions](#supported-regions).

## Related content

- [What is Azure Multicloud Interconnect Preview?](overview.md)
- [Create an Azure Multicloud Interconnect Preview resource](create-interconnect.md)
- [Redeem an Azure Multicloud Interconnect Preview activation key](redeem-activation-key.md)
- [Azure Multicloud Interconnect Preview FAQ](faq.yml)
