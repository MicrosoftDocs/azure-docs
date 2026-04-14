---
title: Upgrade a VPN Gateway SKU
titleSuffix: Azure VPN Gateway
description: Learn how to upgrade a VPN Gateway SKU in Azure.
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 03/03/2026
ms.author: cherylmc

#customer intent: As an Azure network engineer, I want to understand the workflow for upgrading a VPN Gateway SKU so that I can plan properly and minimize downtime.

---
# Upgrade a VPN Gateway SKU

This article helps you upgrade an Azure VPN Gateway virtual network gateway SKU. Upgrading a gateway SKU is a relatively fast process with minimal downtime (approximately 45 minutes). You can upgrade a SKU in the Azure portal, or by using PowerShell or the Azure CLI.

When you upgrade a SKU, the public IP address assigned to your gateway SKU doesn't change. You don't need to reconfigure your VPN device or your point-to-site (P2S) clients.

## Considerations

There are many things to consider when you upgrade to a new gateway SKU. The following table helps you understand the required method to move from one SKU to another. Notice that not all gateway SKUs are eligible to be upgraded directly. Some SKUs require you to delete the existing gateway and create a new one.

| Starting SKU | Target SKU | Eligible for SKU upgrade | Delete/re-create only |
| --- | --- | --- | --- |
| Basic SKU | Any other SKU | No | Yes |
| Legacy SKU | AZ SKU | Yes (Migrate Only) | No
| Generation 1 SKU | Generation 1 AZ SKU | Yes | No |
| Generation 1 SKU | Generation 2 AZ SKU | Yes (Migrate Only) | No |
| Generation 2 SKU | Generation 2 AZ SKU | Yes | No |

In the preceding table, *AZ* stands for *availability zone*, and means that the SKU offers support for availability zones. For gateway SKU throughput and connection limits, see [About gateway SKUs](about-gateway-skus.md#benchmark).

## Limitations and restrictions

* You can't upgrade a Basic SKU to a new SKU. You must delete the gateway, and then create a new one.
* You can't downgrade a SKU without deleting the gateway and creating a new one.
* Legacy gateway SKUs (Standard and High Performance) can be upgraded to new SKU families only by migrating the Basic SKU IP address to Standard SKU IP address first. You can use the [Basic SKU IP Migration tool](basic-public-ip-migrate-howto.md?tabs=portal) to migrate your IP address and your SKU will also be upgraded to AZ SKU family as part of this migration. For more information about working with legacy gateway SKUs, see [VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md).

## Upgrade a gateway SKU by using the Azure portal

This upgrade takes about 45 minutes to complete. If you're switching to a SKU that supports availability zones within the same tier (for example, from VpnGw1 to VpnGw1AZ), there's no downtime.

1. Go to the **Configuration** page for your virtual network gateway.

1. On the right side of the page, select the dropdown arrow to show a list of available SKUs. The options listed are based on the starting SKU and SKU generation. Select the SKU that you want from the list.

1. To save your changes and begin the upgrade, select **Save**.

## Workflow for SKUs that can't be upgraded

**Basic SKUs** cannot be directly upgraded. You must delete the existing gateway and create a new one. This process incurs downtime. The public IP address assigned to your gateway SKU changes. You must also reconfigure your VPN device and P2S clients.

The high-level workflow is:

1. Remove any connections to the virtual network gateway.

1. Delete the old VPN gateway.

1. Create the new VPN gateway.

1. Update your on-premises VPN devices with the new VPN gateway IP address (for site-to-site connections).

1. Update the gateway IP address value for any network-to-network local network gateways that connect to this gateway.

1. Download new client VPN configuration packages for point-to-site clients that connect to the virtual network through this VPN gateway.

1. Re-create the connections to the virtual network gateway.

**Legacy SKUs** cannot be directly upgraded. All legacy SKUs use Basic IP address and you must migrate your Basic SKU IP address to Standard SKU IP address first. As part of Basic IP migration, your legacy SKU will also be migrated to AZ SKU family. See, the detailed instructions listed for [migrating your Basic IP address](basic-public-ip-migrate-howto.md?tabs=portal). For more information about working with legacy gateway SKUs, see [VPN Gateway legacy SKUs](vpn-gateway-about-skus-legacy.md).

**Gen2 SKUs** cannot be upgraded directly.

* If your gateway uses a Basic IP address, migrating to a Standard public IP will automatically upgrade your gateway to Gen2.
* If your gateway already uses a Standard IP address, it will be seamlessly upgraded to Gen2 during regular service updates before September 2026.

No separate customer action is required to migrate your gateway to Gen2 beyond required Basic IP address migration.

## Related content

* For more information about gateway SKUs, see [About gateway SKUs](about-gateway-skus.md).
