---
title: About migrating a Basic SKU public IP address to Standard SKU
titleSuffix: Azure VPN Gateway
description: This article explains the migration process from a Basic SKU public IP address to a Standard SKU public IP address for VPN Gateway deployments that are currently using a Basic SKU public IP address. This doesn't pertain to deployments that are already using a Standard SKU public IP address.
author: raboilla
ms.service: azure-vpn-gateway
ms.topic: concept-article
ms.custom: references_regions
ms.date: 04/09/2025
ms.author: cherylmc
---

# About migrating a Basic SKU public IP address to Standard SKU

This article explains the migration process from a Basic SKU public IP address to a Standard SKU public IP address for VPN Gateway deployments. For more information, see the [announcement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).

## <a name="scenarios"></a>Supported migration scenarios

There are separate migration timelines, depending on the VPN Gateway SKU that your gateway is currently configured to use.

* For the VPN Gateway Basic SKU, see the [VPN Gateway Basic SKU](#basicsku-timeline) section.
* For other supported VPN Gateway SKUs, see the [Gateway SKUs VpnGw1-5](#skus-timeline) section.

> [!NOTE]
> Timelines are subject to change.

### <a name="skus-timeline"></a>Gateway SKUs VpnGw1-5

This section applies to the following VPN Gateway SKUs that are supported for migration from a Basic SKU public IP address to a Standard SKU public IP address:

* VpnGw1
* VpnGw2
* VpnGw3
* VpnGw4
* VpnGw5

|Considerations | Anticipated timelines | Customer action/ prerequisites | Documentation | Announcement links |
|---|---|---|---|---|
|- New [pricing changes](https://azure.microsoft.com/pricing/details/ip-addresses/).<br>- Customers will have three months to migrate after the release of the migration tool.|- **Apr/May 2025**: Basic SKU public IP address-to-Standard SKU public IP address migration tool is available for for active-passive gateways.<br>- **Jul/Aug 2025**: Basic SKU public IP address-to-Standard SKU public IP address migration tool is available for for active-active gateways.<br>- **May 2025 to Sep 2025**: Customer-controlled migration can be initiated after tool availability.<br>- **Sep 2025**: Basic SKU public IP addresses are deprecated. |- Ensure you have the correct gateway IP address space and subnet size.<br>- If your VPN gateway is using a Basic SKU public IP address, migrate it to a Standard SKU public IP address.<br> - If your VPN gateway is already using a Standard SKU public IP address, no action is required.|[Migration steps](basic-public-ip-migrate-howto.md) |[Basic SKU public IP address retirement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired) |

### <a name="basicsku-timeline"></a>Basic gateway SKU

Migration plans for VPN gateways that use a Basic gateway SKU with a Basic SKU public IP address will be announced by **June 15, 2025**.

## <a name="considerations"></a>Migration considerations

To migrate your gateway, you first need to validate whether your resource is capable of migration. Here are some common situations to be aware of:

* If your current gateway subnet is /28 or smaller, the migration tool will error out. You need to [resize the gateway subnet](../virtual-network/virtual-network-manage-subnet.md#change-subnet-settings) to /27 or larger before you can proceed with migration.

* Before your initiate migration for your VPN gateway, verify that your gateway subnet has at least *three* available IP addresses in your current prefix.

## FAQ

### How will my gateway SKU be impacted after the Basic SKU public IP address migration?

After you upgrade from a Basic SKU public IP address to a Standard SKU public IP address, your VPN gateway SKU VPNGW1-5 will be migrated to VPNGW1AZ-5. As a result, you might see the SKU changed from a Non-AZ to an AZ-SKU. For more information about SKU impact, see the [Gateway SKU migration](gateway-sku-consolidation.md) article.

### Will my VPN gateway IP address change after my public IP address is migrated?

* If you use the Microsoft-provided migration experience, your gateway IP address won't change.
* If you manually delete your current VPN gateway that has a Basic SKU public IP address and create a new VPN gateway using a Standard SKU public IP address, your gateway IP address changes.

### Will there be any downtime?

Up to 10 minutes of downtime is expected during the Microsoft-provided migration experience.

### Do I need to take any actions to migrate?

The Microsoft-provided migration experience is a customer-initiated migration. You'll need to initiate the migration process. The migration process is expected to take up to 10 minutes.

### Are there any migration prerequisites?

Ensure that your gateway subnet has right IP address space and subnet size. You'll need at least three available IP addresses in your current prefix before you perform the migration.

### Can I create a Basic SKU VPN gateway with a Basic SKU public IP address after March 31, 2025?

Yes, you can create a VPN gateway using the gateway Basic SKU and a Basic SKU public IP address until June 2025.

### When will I be able to create a Basic SKU VPN gateway with a Standard SKU public IP address?

The Standard SKU public IP address parameter for the VPN Gateway Basic SKU is currently being rolled out and will be completed in April 2025. After this date, you'll be able to create a Basic SKU VPN gateway with a Standard SKU public IP address.

### Can I change to a Standard SKU public IP address manually?

Yes, you can. If you choose to do this manually, you'll need to delete the old gateway and then create a new gateway in your virtual network. When you create a new gateway, your gateway will automatically use a Standard SKU public IP address. However, if you choose to use this process, you'll incur downtime while the old gateway is deleted and the new gateway is created. For more information, see [Change a gateway SKU](gateway-sku-change.md).

### If I delete and re-create my gateway, will my IP address change?

Yes, the IP address will change with this approach. This means that you'll have to ensure the new IP address is updated in all of your internal tooling as needed.

## Next steps

* For more information, see the [announcement](https://azure.microsoft.com/updates?id=upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired).

* For migration steps, see [How to migrate a Basic SKU public IP address to Standard SKU](basic-public-ip-migrate-howto.md).
