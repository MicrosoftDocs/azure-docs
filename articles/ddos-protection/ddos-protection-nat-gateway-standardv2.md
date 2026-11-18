---
title: Azure DDoS Protection for NAT Gateway StandardV2 (preview)
description: Learn how Azure DDoS Protection protects StandardV2 public IP addresses used by NAT Gateway StandardV2, including preview scope and limitations.
author: asudbring
ms.author: allensu
ms.service: azure-ddos-protection
ms.topic: concept-article
ms.date: 11/02/2026
# Customer intent: As a network administrator, I want to understand DDoS protection for NAT Gateway StandardV2, so that I can choose a supported protection model for my outbound public IP addresses.
---

# Azure DDoS Protection for NAT Gateway StandardV2 (preview)

Azure DDoS Protection helps protect StandardV2 public IP addresses used by Azure NAT Gateway StandardV2 against network-layer DDoS attacks. Configure protection on the associated virtual network or an individual StandardV2 public IP address, not on the NAT gateway resource.

> [!IMPORTANT]
> DDoS Protection support for NAT Gateway StandardV2 is in public preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for the applicable legal terms.

Standard SKU NAT Gateway doesn't support this capability.

## What's new

The public preview adds DDoS Network Protection and IP Protection support for NAT Gateway StandardV2 deployments that use StandardV2 IPv4 or IPv6 public IP addresses. DDoS custom policies aren't supported in this preview.

## Why use DDoS protection

- Help protect the public IP endpoints that your workloads use for outbound internet connectivity.
- Choose virtual-network-level protection or protection for an individual public IP address.
- Use the existing DDoS configuration and monitoring workflows without a separate NAT gateway-specific DDoS API or appliance.

## Prerequisites and supported configurations

Use a StandardV2 NAT gateway with StandardV2 public IP addresses or public IP prefixes. Confirm availability of the required NAT Gateway, public IP, and DDoS platform capabilities in your target region and cloud. NAT Gateway availability alone doesn't establish that all required DDoS components are available.

| Configuration | Public preview scope |
| --- | --- |
| NAT Gateway StandardV2 | Supported |
| Standard SKU NAT Gateway | Not supported |
| StandardV2 IPv4 public IP address | Supported |
| StandardV2 IPv6 public IP address | Supported |
| DDoS Network Protection | Supported |
| DDoS IP Protection | Supported |
| DDoS custom policy | Not supported |
| Public IP prefixes | Supported through DDoS Network Protection inherited from the virtual network. Direct DDoS IP Protection on the prefix isn't supported. |

Review [NAT Gateway SKU limitations](../nat-gateway/nat-sku.md#known-limitations). Government-cloud portal availability follows a separate rollout; don't assume that public-cloud portal availability establishes Government-cloud portal support.

### Public IP requirements

The DDoS preview requires StandardV2 public IP addresses or public IP prefixes associated with a StandardV2 NAT gateway. Standard and Basic public IP addresses aren't compatible with StandardV2 NAT gateways.

### IPv4 and IPv6

StandardV2 IPv4 and IPv6 public IP addresses are supported.

## Architecture and protection scope

Workloads in an associated subnet use the NAT gateway's public IP addresses for outbound internet connectivity. DDoS Protection uses the existing virtual-network or public-IP protection model. It doesn't add a separate DDoS appliance to the outbound path.

:::image type="content" source="./media/nat-gateway-standardv2/ddos-protection-nat-gateway-standardv2.svg" alt-text="Diagram showing workloads in a subnet using a StandardV2 NAT gateway and a StandardV2 public IP for outbound internet connectivity. Dashed lines distinguish virtual-network protection from individual public-IP configuration." lightbox="./media/nat-gateway-standardv2/ddos-protection-nat-gateway-standardv2.svg":::

Solid arrows show outbound connectivity. Dashed lines show configuration scope, not a traffic path.

Enabling DDoS protection doesn't enable unsolicited inbound connections, change routing or source network address translation (SNAT) behavior, or provide Layer 7 protection. Continue to use an appropriate application-layer protection architecture for web applications.

## Protection models

Choose Network Protection for virtual-network-level protection or IP Protection for an individual StandardV2 public IP address.

| Protection model | Configuration scope | Requirements |
| --- | --- | --- |
| DDoS Network Protection | Virtual network | Enable Network Protection on the virtual network and associate the StandardV2 NAT gateway with a subnet in that virtual network. Supported gateway public IP addresses and prefixes inherit the virtual-network protection state. |
| DDoS IP Protection | Individual public IP address | Enable IP Protection directly on a StandardV2 public IP address associated with the StandardV2 NAT gateway. |

## Enable DDoS protection

Use the existing DDoS workflows. NAT Gateway DDoS support doesn't require a separate customer-facing NAT gateway API version, DDoS feature registration, Azure CLI command, or Azure PowerShell cmdlet.

### Use Network Protection

1. Configure a StandardV2 NAT gateway with StandardV2 public IP addresses or public IP prefixes.
1. Associate the gateway with a workload subnet in the virtual network.
1. [Enable DDoS Network Protection](manage-ddos-protection.md) on that virtual network.
1. Verify the protection state of the supported public IP addresses and validate outbound connectivity.

### Use IP Protection

1. Select an individual StandardV2 public IP address.
1. [Enable DDoS IP Protection](manage-ddos-ip-protection-portal.md) on the address.
1. Attach the address to a StandardV2 NAT gateway and associate the gateway with a workload subnet.
1. Verify the public IP's protection state and validate outbound connectivity.

## Monitor protection

Use the existing [DDoS monitoring experience](monitor-ddos-protection.md) on the protected public IP address to view mitigation metrics, configure diagnostics and alerts, and investigate attacks. DDoS telemetry isn't a separate NAT gateway metric surface.

Continue to use [NAT Gateway metrics](../nat-gateway/nat-metrics.md) to monitor outbound connectivity and SNAT behavior. Check both the public IP's protection state and the gateway's connectivity after configuration changes.

## Limitations

- DDoS protection doesn't provide Layer 7 protection or enable unsolicited inbound internet connections.
- Region and cloud availability depend on the rollout of all required platform components.

### Custom detection thresholds

DDoS custom policies aren't supported for NAT Gateway StandardV2 public IP addresses in this release. This exclusion applies to all management interfaces. Use Network Protection or IP Protection without a custom-policy association.

### Public IP prefixes

Azure NAT Gateway StandardV2 supports public IP prefixes for outbound connectivity. When you enable DDoS Network Protection on the associated virtual network, the public IP prefix automatically inherits protection. You can't independently enable, disable, or modify DDoS protection for individual IP addresses within the prefix.

DDoS IP Protection isn't supported for public IP prefixes. To use IP Protection, configure an eligible individual StandardV2 public IP address instead. DDoS custom policies aren't supported for public IP prefixes.

### Subnet association

Associate the gateway with a workload subnet before relying on virtual-network-level protection inheritance or active outbound connectivity. Without a subnet association, the gateway has no active workload using it for outbound connectivity and doesn't inherit Network Protection through that subnet relationship.

You can configure IP Protection on a supported public IP independently of the gateway's subnet association. This independent configuration doesn't make an unattached NAT gateway operational.

## Plan migration

When migrating from Standard NAT Gateway, deploy a StandardV2 gateway and confirm the following:

- The gateway and public IP SKUs meet the prerequisites.
- StandardV2 public IP addresses or public IP prefixes are available.
- The selected Network Protection or IP Protection model applies to the resulting configuration.
- Diagnostics and alerts are configured on the appropriate resource. Don't associate a DDoS custom policy with the NAT gateway's public IP addresses.
- Outbound connectivity and the protection state are validated after migration.

For NAT gateway migration steps and connection-impact guidance, see [Migrate Azure NAT Gateway from Standard to StandardV2](../nat-gateway/nat-gateway-v2-migrate.md). Don't assume that the gateway SKU can be upgraded in place or that an existing public IP can always be retained.

## Frequently asked questions

### Is DDoS protection enabled directly on the NAT gateway?

No. Configure Network Protection on the associated virtual network or IP Protection on an eligible individual public IP address. The attached gateway uses the resulting protection state.

### Can I use Standard SKU NAT Gateway?

No. This capability requires StandardV2 NAT Gateway and StandardV2 public IP addresses.

### Does protection allow inbound internet connections?

No. NAT Gateway continues to provide outbound connectivity. It accepts return traffic for outbound-originated connections, not unsolicited inbound connections.

### Do I need NAT gateway-specific DDoS commands?

No. Use the existing supported DDoS configuration workflows for the virtual network or individual public IP address.

### Can I configure a custom policy on a public IP prefix?

No. Custom policy isn't supported for NAT Gateway StandardV2 in this release, and the prefix resource doesn't expose the individual public IP's custom-policy association.

## Related content

- [Compare Azure DDoS Protection tiers](ddos-protection-sku-comparison.md).
- [Monitor Azure DDoS Protection](monitor-ddos-protection.md).
- [Compare Azure NAT Gateway SKUs](../nat-gateway/nat-sku.md).
- [Migrate Azure NAT Gateway from Standard to StandardV2](../nat-gateway/nat-gateway-v2-migrate.md).
