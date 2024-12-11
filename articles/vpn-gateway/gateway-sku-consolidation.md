---
title: Gateway SKU mappings
titleSuffix: Azure VPN Gateway
description: Learn about the changes for virtual network gateway SKUs for VPN Gateway.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.custom: references_regions
ms.date: 09/26/2024

ms.author: cherylmc

---
# VPN Gateway SKU consolidation and migration

We're simplifying our VPN Gateway SKU portfolio. Due to the lack of redundancy, lower availability, and potential higher costs associated with additional failover solutions, we're transitioning all non availability zone (AZ) supported SKUs to AZ supported SKUs. This article helps you understand the upcoming changes for VPN Gateway virtual network gateway SKUs. This article expands on the [official announcement.](https://azure.microsoft.com/updates/v2/vpngw1-5-non-az-skus-will-be-retired-on-30-september-2026)

* **Effective January 1, 2025**: Creation of new VPN gateways using VpnGw1-5 SKUs (non-AZ) will no longer be possible.
* **Migration period**: From April 2025 to September 2026, all existing VPN gateways using VpnGw1-5 SKUs (non-AZ SKUs) will be seamlessly migrated to VpnGw1-5 SKUs (AZ).

To support this migration, we're reducing the prices on AZ SKUs. Refer to the [FAQ](#faq) section of this article for more information about SKUs and pricing.

> [!NOTE]
> This article doesn't apply to the following legacy gateway SKUs: Standard or High Performance. For information legacy SKUS, including legacy SKU migration, see [Working with VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md).

## Mapping old SKUs to new SKUs

The following diagram shows current SKUs and the new SKUs they'll automatically be migrated to.

:::image type="content" source="./media/gateway-sku-consolidation/sku-mapping.png" alt-text="Diagram of gateway SKU mapping." lightbox="./media/gateway-sku-consolidation/sku-mapping-expand.png":::

## FAQ

### What actions do I need to take?

There are no actions that you need to take. If your gateway currently uses one of the SKUs listed in previous section, we'll migrate the gateway for you. When we perform the migration, the migration is seamless. There's no downtime expected. You'll be notified in advance about migration for your gateway. We recommend that you don't change your SKU manually in anticipation of SKU migration unless you want to upgrade to a higher SKU.

### What is the timeline?

Migration will begin after March 2025. You'll be notified when your gateway will be migrated.

### Can I create new gateways using the older SKUs?

No. You can't create a new gateway using VpnGw1-5 SKUs (non-AZ SKUs) after January 2025.

### How long will my existing gateway SKUs be supported?

The existing gateway SKUs are supported until they're migrated to AZ SKUs. The targeted deprecation for non-AZ SKUs is September 16, 2026. There will be no impact to existing AZ SKUs.

### Will there be any pricing differences for my gateways after migration?

Yes. On January 1, 2025 you can see the new [Pricing](https://azure.microsoft.com/pricing/details/vpn-gateway). Until that date, the pricing changes won't show on the pricing page.

### When does new AZ pricing take effect?

Yes. The new pricing timeline is:

* If your existing gateway uses a VpnGw1-5 SKU, new pricing starts after your gateway is migrated.
* If your existing gateway uses a VpnGw1AZ-5AZ SKU, new pricing starts January 1, 2025.

### Can I deploy VpnGw 1-5 AZ SKUs in all regions?

Yes, you can deploy AZ SKUs in all regions. If a region doesn't currently support availability zones, you can still create VPN Gateway AZ SKUs, but the deployment will remain regional. When the region supports availability zones, we'll enable zone redundancy for the gateways

### Can I migrate my Gen 1 gateway to Gen 2 gateway?

* For gateways using Basic IP, you will need to migrate your gateway to use Standard IP when the migration tool becomes available. As part of the Basic IP to Standard IP migration, the gateways will be upgraded to Gen2 with no further action needed. 
* For gateways already using Standard IP, we will migrate them to Gen2 separately before Sep 30, 2026. This will be done seamlessly during regular updates, with no downtime involved. 

### Will there be downtime during migrating my Non-AZ gateways?

No. This migration is seamless and there's no expected downtime during migration.

### Will there be any performance impact on my gateways with this migration?

Yes. AZ SKUs get the benefits of Zone redundancy for VPN gateways in [Azure regions with availability zones](../reliability/availability-zones-region-support.md). If the region doesn't support zone redundancy, the gateway is regional until the region it's deployed to supports zone redundancy.

### Is VPN Gateway Basic SKU retiring?

No, the VPN Gateway Basic SKU isn't retiring. You can create a VPN gateway using the Basic gateway SKU via [PowerShell](create-gateway-basic-sku-powershell.md) or CLI. Currently, the VPN Gateway Basic SKU supports only the Basic SKU public IP address resource (which is on a path to retirement). We're working on adding support for the Standard SKU public IP address resource to the VPN Gateway Basic SKU.

### When will my Standard and HighPerformance gateway be migrated?

Standard and HighPerformance gateway will be migrated to AZ gateways in CY26. For more information, see this [announcement](https://azure.microsoft.com/updates/standard-and-highperformance-vpn-gateway-skus-will-be-retired-on-30-september-2025/) and [Working with VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md).

## Next steps

For more information about SKUs, see [About gateway SKUs](about-gateway-skus.md).
