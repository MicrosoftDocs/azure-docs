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
 
  * When configuring a third VIP in Active‑Active mode for Point‑to‑Site (P2S), a non‑zonal Public IP must be used.
  
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

#### Can I enable DDoS protection during gateway migration?
No. While the gateway is in migration (between Execute and Commit), do not make any changes to the public IP, gateway, or connections. Enabling DDoS protection or other advanced features during this phase may block migration or prevent rollback. Enable such features only after the migration is fully completed (after Commit).

#### Can I modify my IP, VPN Gateway, subnet, or connections during migration?
No. While the VPN Gateway is under migration (between Execute and Commit), you must not make any changes to the following:

Public IP address
VPN Gateway configuration
Gateway subnet
Connections

Making changes during this phase can put the gateway into an unsupported or stuck state, as the migration workflow does not handle concurrent updates. 

#### What happens if I make changes during migration and the gateway gets stuck?
If the gateway enters a stuck or unrecoverable migration state due to changes made during migration:

The system may be unable to complete or roll back the migration. 
In such cases, the only recovery option may be to delete and recreate the gateway.



### Active-Active VpnGw1-5 gateway SKUs 


#### Why does my Active‑Active VPN Gateway with Point‑to‑Site (P2S) require a third Public IP?
For Active‑Active VPN Gateways with P2S enabled, a third Public IP is required to support the P2S endpoint alongside the two IPs used for Active‑Active instances.

#### Documentation says the third Public IP must be non‑zonal. Is this still required?
Yes.  
For this scenario, the third Public IP must be configured **without zones (non‑zonal)** to ensure compatibility with the VPN Gateway configuration and future update operations.


#### When should I create the third Public IP during migration?
The third Public IP must be created and attached to the VPN Gateway **before starting the migration (Basic → Standard IP)**.

This ensures:
- The gateway configuration is complete prior to migration  
- The migration process proceeds without validation or update issues  


#### How do I create the required non‑zonal Public IP?
In regions where zone‑redundant IPs are the default, you should create the third Public IP **using Azure CLI or PowerShell** rest API Version 2020-08-01 or later that sets non-zonal / no-zone Public IP   , ensuring that **no availability zones are specified**.

This allows the Public IP to be created in a **non‑zonal configuration**, which is required for this scenario.


#### Can I use a zone‑redundant Public IP instead of a non‑zonal IP for the third P2S IP?
No.

All Public IPs associated with a VPN Gateway must use a **consistent configuration**. Using a zone‑redundant Public IP for the third IP may result in deployment or update failures.


#### Does this behavior impact all VPN Gateway migrations?
No.

This requirement specifically applies to:

- **Active‑Active VPN Gateways**  
- **With Point‑to‑Site (P2S) enabled**  

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

### Backend migration

#### When will Microsoft perform the backend migration of my VPN gateway?

Starting in August 2026, Microsoft automatically migrates eligible VPN gateways that aren't already migrated through self-service. Because this operation is Microsoft-managed, you won't receive a per-gateway migration notification before the migration occurs. Microsoft performs the migration during off-business hours based on the gateway's regional local time to help minimize customer impact.

#### Will my VPN gateway public IP address change during migration?

No. The migration upgrades the public IP resource from Basic SKU to Standard SKU, but the existing public IP address is retained. You don't need to take any action for the public IP upgrade.

#### Will the migration cause downtime or traffic disruption?

Yes. The migration will result in a brief connectivity interruption of up to 10 minutes while the gateway is transitioned to the new backend infrastructure. However, certain gateway configurations (such as custom traffic selectors, Active-Active P2S, CloudApp-based P2S, Remote RADIUS, and other identified edge cases) may require customer action and could experience connectivity impact if not remediated beforehand. 

#### Do I need to take any action before the backend migration?

Yes. Microsoft recommends completing the self-service (customer-triggered) migration before the backend migration begins. This allows you to validate your specific traffic patterns, applications, and network topology, which Microsoft cannot fully test on your behalf.
If you do not perform the self-service migration, Microsoft may automatically migrate eligible gateways during the backend migration. This migration is not reversible.
Microsoft may also perform scream tests on some gateways. Gateways determined to be inactive may be deleted as part of the retirement process.
Additionally, customers should review and remediate any known impacted configurations (such as custom traffic selectors, Active-Active P2S, CloudApp-based P2S, and Remote RADIUS) before migration to avoid potential connectivity issues.

#### What happens if I don't complete migration by June 30, 2026?

Customer-initiated migration ended on June 30, 2026. You were expected to complete migration by this date.
If you remain on the legacy platform after June 30, 2026, the VPN Gateway service SLA no longer covers you until migration is completed.
Extension requests through July 31, 2026 are automatically approved and don't require individual review.
Beginning in August 2026, Microsoft plans to migrate remaining eligible VPN Gateways that have not completed migration. Backend migrations will be performed regionally during off-business hours and may result in a brief connectivity interruption similar to the customer-initiated migration experience.


## Next steps

* For more information, see the [announcement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).
* For migration steps for non-Basic SKU VPN gateways, see [How to migrate a Basic SKU public IP address to Standard SKU](basic-public-ip-migrate-howto.md).
* To remove the Basic SKU public IP reference from a Basic SKU VPN gateway, see [Remove the Basic SKU public IP reference from a Basic SKU VPN gateway](basic-sku-public-ip-remove.md).
