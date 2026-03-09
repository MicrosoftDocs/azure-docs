---
title: Gateway SKU Mappings
titleSuffix: Azure VPN Gateway
description: Learn about the changes for virtual network gateway SKUs for VPN Gateway.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.custom: references_regions
ms.date: 02/03/2026

ms.author: cherylmc

#customer intent: As a network administrator, I want to understand the migration process and benefits of VPN Gateway SKUs transitioning to availability zone support, so that I can ensure my organization's VPN solutions are optimized for reliability and cost-efficiency.
---
# VPN Gateway SKU consolidation and migration

We're simplifying our Azure VPN Gateway SKU portfolio. Due to the lack of redundancy, lower availability, and potential higher costs associated with failover solutions, SKUs that aren't supported by an availability zone are migrating to SKUs that are supported by an availability zone.

This article helps you understand the changes for VPN Gateway SKUs. This article expands on the [official announcement](https://azure.microsoft.com/updates/v2/vpngw1-5-non-az-skus-will-be-retired-on-30-september-2026).

* *Effective November 1, 2025*: You can no longer create new VPN gateways (VpnGw1-5 SKUs) that aren't supported by an availability zone.
* *Migration period*: From September 2025 to September 2026, all existing VPN gateways (VpnGw1-5 SKUs) that aren't supported by an availability zone can be manually upgraded to VpnGw1-5 SKUs that are supported.

To support this migration, we're reducing the prices on SKUs supported by availability zones. For more information about SKUs and pricing, see the [FAQs](#faqs) section of this article.

> [!NOTE]
> This article doesn't apply to the following legacy gateway SKUs: Standard or High Performance. For more information, see [Working with VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md).

## Mapping old SKUs to new SKUs

The following diagram shows current SKUs and the new SKUs that they'll automatically be migrated to.

:::image type="content" source="./media/gateway-sku-consolidation/sku-mapping.png" alt-text="Diagram of gateway SKU mapping." lightbox="./media/gateway-sku-consolidation/sku-mapping-expand.png":::

## FAQs

### What actions do I need to take?

* We recommend that you [manually upgrade](gateway-sku-upgrade.md) gateway SKUs that aren't supported by availability zones to those that are. You can use the Azure portal, PowerShell, or the Azure CLI. There's no downtime expected to manually upgrade SKUs that currently use Standard public IP addresses. If you're still using a Basic IP address, upgrade to a Standard IP address.
* If your gateway currently uses legacy SKUs, see [Working with VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md).

### How long will my existing gateway SKUs be supported?

The existing gateway SKUs are supported until they're migrated to the new SKUs. The old SKUs are currently scheduled for deprecation on September 16, 2026. There will be no impact to existing SKUs that are supported by availability zones.

### Will there be any pricing differences for my gateways after migration?

Yes. For more information, see the new [pricing](https://azure.microsoft.com/pricing/details/vpn-gateway).

### When does new pricing take effect?

* If your existing gateway uses a VpnGw1-5 SKU, new pricing starts after your gateway is migrated.
* If your existing gateway uses a VpnGw1AZ-5AZ SKU, new pricing is already in effect.

### Can I deploy availability zone SKUs in all regions?

Yes. If a region doesn't currently support availability zones, you can still create VPN Gateway SKUs supported by availability zones, but the deployment will remain regional. When the region supports availability zones, we'll enable zone redundancy for the gateways.

### Is Gen1 gateway SKU being retired?

There is no announced retirement date for Gen1 SKUs. 

### Can I migrate my gateway from one generation to another?

Customers **do not** need to run any separate migration to move to Generation 2. The only required action is upgrading from a Basic to a Standard public IP address (if applicable). There is no retirement date announced for Generation 1 SKUs.

* *For gateways that use a Basic public IP address*: You'll need to migrate your Basic IP address to a Standard public IP address using the [migration tool for VPN Gateway](basic-public-ip-migrate-howto.md?tabs=portal). As part of this IP address upgrade, your gateway is automatically upgraded to the next generation (Generation 2). **No separate Gen2 migration or additional steps are required.**
* *For gateways that already use a Standard public IP address*: **No customer action is required.** These gateways will be automatically upgraded to the next generation (Generation 2) as part of regular service updates, prior to September 2026. This process is seamless and does not involve downtime.

### Will there be downtime during migration?

No. This migration is seamless, and there's no expected downtime during migration.

### Will there be any performance impact on my gateways with this migration?

Yes. SKUs get the benefits of zone redundancy for VPN gateways in [Azure regions with availability zones](/azure/reliability/availability-zones-region-support). If the region doesn't support zone redundancy, the gateway is regional until the region where it's deployed supports zone redundancy.

### Is the VPN Gateway Basic SKU retiring?

No, the VPN Gateway Basic SKU isn't retiring. You can create a gateway with this SKU by using [PowerShell](create-gateway-basic-sku-powershell.md) or the Azure CLI.

### Can I create a new Basic SKU VPN gateway by using a Basic SKU public IP address?

No. Use a Standard SKU public IP address when you create a Basic SKU VPN gateway.

### When will my legacy gateway be migrated?

See [this announcement](https://azure.microsoft.com/updates/standard-and-highperformance-vpn-gateway-skus-will-be-retired-on-30-september-2025/) and [Working with VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md).

### I have an existing VPN gateway not supported by an availability zone. What changes after this rollout?

Existing VPN gateways not supported by an availability zone will no longer allow configuration changes. If you attempt any management or configuration operation, you'll get an error message. This is expected behavior after the rollout.

### What action is required to resolve this error?

You must migrate your VPN gateway from a SKU not supported by an availability zone to one that is supported.  

### Will migrating cause downtime?

No, not if you're migrating from a SKU that's unsupported by an availability zone to one that is supported in the same SKU family. If you're upgrading in addition to migrating, you might experience downtime consistent with existing VPN Gateway resize behavior. This is called *cross-family migration*.

### Are SKUs that are supported by availability zones automatically zone redundant?

These SKUs become zone redundant only in regions that support availability zones, as described in [this section](gateway-sku-consolidation.md#will-there-be-any-performance-impact-on-my-gateways-with-this-migration) of the article.

## Related content

* For more information about SKUs, see [About gateway SKUs](about-gateway-skus.md).
