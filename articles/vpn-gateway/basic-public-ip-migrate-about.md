---
title: About migrating a Basic SKU public IP address to Standard SKU
titleSuffix: Azure VPN Gateway
description: This article explains the migration process from a Basic SKU public IP address to a Standard SKU public IP address for VPN Gateway deployments that are currently using a Basic SKU public IP address. This doesn't pertain to deployments that are already using a Standard SKU public IP address.
author: raboilla
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.custom: references_regions
ms.date: 03/06/2026
ms.author: cherylmc
# Customer intent: As a network administrator, I want to migrate my VPN gateway from a Basic SKU public IP address to a Standard SKU, so that I can ensure continued service and optimize performance as Basic SKU is phased out.
---

# About migrating a Basic SKU public IP address to Standard SKU

This article explains the migration process from a Basic SKU public IP address to a Standard SKU public IP address for VPN Gateway deployments. There are separate migration timelines, depending on the VPN Gateway SKU that your gateway is currently configured to use.

> [!IMPORTANT]
> For anticipated migration timelines, see the [VPN Gateway - What's new](whats-new.md) article.

## <a name="considerations"></a>Migration considerations

To migrate your gateway, you first need to validate whether your resource is capable of migration. Here are some common situations to be aware of:

* For VPN Gateway Basic gateway SKU:

  * If your Basic SKU VPN gateway has a Basic SKU public IP reference, you don't use the migration process. You only need to remove the Basic SKU public IP reference from your gateway.
  * For steps to remove the Basic SKU public IP reference, see [Remove the Basic SKU public IP reference from a Basic SKU VPN gateway](basic-sku-public-ip-remove.md).

* For VPN Gateway SKUs VpnGw1-5 and Legacy SKUs (High-Performance SKU and Standard SKU):

  * Before your initiate migration for your VPN gateway, verify that your gateway subnet has at least **three** available IP addresses in your current prefix.
  
  * If your current gateway subnet is /28 or smaller, the migration tool might error out. You can use this to [add multiple prefixes for subnet](../virtual-network/how-to-multiple-prefixes-subnet.md) to /27 or larger before you can proceed with migration.

  * If you have ExpressRoute and VPN coexisting: We recommend considering migrating the Basic IP resources to Standard IP on **VPN** first.

## FAQ

Depending on your current VPN Gateway SKU, you might have different questions about the migration process. Here are some frequently asked questions to help you understand the migration better.

### VPN gateway SKUs VpnGw1-5

#### How long does the end-to-end migration typically take?

The entire migration process usually takes up to 2 hours, depending on the size and configuration of your deployment.

#### How long does each migration step take?

Migration step durations can vary based on environment complexity. On average:

* Prepare: Typically up to 40 minutes, with a maximum of 1 hour.
* Execute: Takes around 5–10 minutes. (This is the only step where brief downtime is expected.)
* Commit: Typically up to 30 minutes, with a maximum of 1 hour.

#### How long can I wait before committing my migration changes?

Migration validation is typically complete within a short timeframe. Customers are advised to complete validation and commit migration changes within a few days, as leaving migrations pending for extended periods isn't recommended. Actual duration varies by environment and validation needs.

#### How will my gateway SKU be impacted after the Basic SKU public IP address migration?

After you upgrade from a Basic SKU public IP address to a Standard SKU public IP address, your VPN gateway SKU VPNGW1-5 will be migrated to VPNGW1AZ-5. As a result, you might see the SKU changed from a Non-AZ to an AZ-SKU. For more information about SKU impact, see the [Gateway SKU migration](gateway-sku-consolidation.md) article.

#### Will my VPN gateway IP address change after my public IP address is migrated?

* If you use the Microsoft-provided migration experience, your gateway IP address won't change.
* If you manually delete your current VPN gateway that has a Basic SKU public IP address and create a new VPN gateway using a Standard SKU public IP address, your gateway IP address changes.

#### Will there be any downtime?

Up to 10 minutes of downtime is expected during the Microsoft-provided migration experience.

#### Do I need to take any actions to migrate?

The Microsoft-provided migration experience is a customer-initiated migration. You'll need to initiate the migration process. The migration process is expected to take up to 10 minutes.

#### Are there any migration prerequisites?

Ensure that your gateway subnet has right IP address space and subnet size. You'll need at least three available IP addresses in your current prefix before you perform the migration.

#### Can I change to a Standard SKU public IP address manually?

Yes, you can. If you choose to do this manually, you'll need to delete the old gateway and then create a new gateway in your virtual network. When you create a new gateway, your gateway will automatically use a Standard SKU public IP address. However, if you choose to use this process, you'll incur downtime while the old gateway is deleted and the new gateway is created.

#### If I delete and re-create my gateway, will my IP address change?

Yes, the IP address changes with this approach. This means that you'll have to ensure the new IP address is updated in all of your internal tooling as needed.

#### Will migrating the VPN gateway impact ExpressRoute traffic in a coexisting setup?

No. When following the recommended migration order, migrating the VPN gateway first doesn't migrate, disrupt, or impact ExpressRoute traffic. ExpressRoute connectivity remains unaffected during the VPN gateway migration. Customers shouldn't expect ExpressRoute connectivity issues when migrating the VPN gateway first.

### Active-Active VpnGw1-5 gateway SKUs 

#### How does migration behave for an Active‑Active VPN gateway using a Basic Public IP? Does it cause a full gateway outage?

No. During migration from a Basic Public IP to a Standard Public IP, the VPN gateway is transitioned as a unit and re‑establishes connectivity as part of the migration process. The migration doesn't move traffic from one gateway instance to another instance, and it doesn't result in a full gateway outage.
Short connectivity interruptions might occur during the migration as connections are re‑established, but the gateway isn't taken completely offline.

#### During migration, do only the tunnels on a specific gateway instance experience interruption while the other instance remains active?

No. VPN tunnels are expected to re‑establish as part of the migration process, but they aren't migrated or failed over on a per‑instance basis. Tunnels shouldn't flap due to individual gateway instances being migrated, and the migration isn't scoped to specific instances within an Active‑Active gateway.

#### How should downtime be described for Active‑Active VPN gateway migration?

Migration is a disruptive operation and might result in brief connectivity interruptions while the VPN gateway configuration is updated and connections are re‑established. These interruptions are typically several minutes in duration, and in most cases complete within approximately 10 minutes, though exact timings aren't guaranteed and can vary based on configuration and network conditions.
Customers should plan to perform the migration during a maintenance window and ensure applications are resilient to short connectivity interruptions.

### VPN Gateway Basic SKU

#### Can I create a Basic SKU VPN gateway with a Basic SKU public IP address?

No, you can't create a Basic SKU VPN gateway with a Basic SKU public IP address. New Basic SKU VPN gateways require a Standard public IP address SKU.

#### Do I need to migrate if I have a Basic SKU VPN gateway?

Basic SKU VPN gateways that currently show as using a Basic SKU public IP address **do not** use the migration process to move to a Standard public IP address SKU. The only action you need to take is to remove the Basic SKU public IP reference from your gateway.

For steps to remove the Basic SKU public IP reference, see [Remove the Basic SKU public IP reference from a Basic SKU VPN gateway](basic-sku-public-ip-remove.md). Your gateway continues to use the same public IP address. Only the reference to the Basic SKU public IP resource is removed from your gateway.

## Next steps

* For more information, see the [announcement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).
* For migration steps for non-Basic SKU VPN gateways, see [How to migrate a Basic SKU public IP address to Standard SKU](basic-public-ip-migrate-howto.md).
* To remove the Basic SKU public IP reference from a Basic SKU VPN gateway, see [Remove the Basic SKU public IP reference from a Basic SKU VPN gateway](basic-sku-public-ip-remove.md).
