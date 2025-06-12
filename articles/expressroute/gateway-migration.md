---
title: About migrating to an availability zone-enabled ExpressRoute virtual network gateway
titleSuffix: Azure ExpressRoute
description: This article explains how to migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom:
  - ignite-2023
  - build-2025
ms.topic: concept-article
ms.date: 05/19/2025
ms.author: duau
---

# About ExpressRoute Gateway Migration

This article explains the ExpressRoute gateway migration process, enabling you to move from non-Availability Zone (non-Az)-enabled SKUs to Az-enabled SKUs, and from Basic IP to Standard IP. Migrating to Az-enabled SKUs and Standard IPs improves the reliability and high availability of your ExpressRoute virtual network gateways.

For guidance on upgrading Basic SKU public IP addresses for other networking services, see [Upgrading Basic to Standard SKU](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md#steps-to-complete-the-upgrade).

> [!IMPORTANT]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you're currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. 

## Gateway SKUs
The **ErGw1Az**, **ErGw2Az**, **ErGw3Az**, and **ErGwScale** (Preview) SKUs are known as Availability Zone (Az)-enabled SKUs. These SKUs allow deployment across multiple availability zones, increasing resiliency and high availability by distributing gateway resources across zones.

By comparison, the **Standard**, **HighPerformance**, and **UltraPerformance** SKUs are non-Az-enabled. They're typically used with Basic public IP addresses and don't support availability zone distribution.

## Gateway migration experience

The gateway migration experience allows you to deploy a second virtual network gateway in the same GatewaySubnet. Azure migrates your configurations from the old gateway to the new one. Both gateways run simultaneously during migration, minimizing disruption – though brief connectivity interruptions may still occur.

After migration, the old gateway and its connections are deleted, and the new gateway is tagged with **CreatedBy: GatewaySKUMigration** to identify it as a migrated resource and shouldn’t be deleted.
## Supported Migration Scenarios

The guided gateway migration experience supports the following scenarios:

- Migrating from a non-Az-enabled SKU with a Basic IP to a non-Az-enabled SKU with a Standard IP.
- Migrating from a non-Az-enabled SKU with a Basic IP to an Az-enabled SKU with a Standard IP.

 Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).  
Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).

For enhanced reliability and high availability, we recommend migrating to an Az-enabled SKU.

## Steps to migrate to a new gateway

1. **Validate**: Check that all resources are in a succeeded state. If any prerequisites aren't met, validation fails and migration can't proceed.
2. **Prepare**: Azure creates a new virtual network gateway, public IP, and connections. This step can take up to 45 minutes. You can specify a name for the new gateway, or Azure will add **_migrated** to the original name by default. During preparation, the existing gateway is locked to prevent changes. If you need to stop the migration, you can **abort** at this stage, which deletes the new gateway and connections.

> [!NOTE]
> The new gateway is created in the same region as the existing one. To change regions, you must delete the current gateway and create a new one in the desired region.

3. **Migrate**: Switch traffic from the old gateway to the new one. This step can take up to 15 minutes and may cause brief connectivity interruptions.
4. **Commit**: Complete the migration by deleting the old gateway and its connections. If necessary, you can abort and revert to the old gateway before committing.

> [!IMPORTANT]
> After migration, validate your connectivity to ensure everything is functioning as expected. You can revert to the old gateway by selecting **Abort** after the prepare step, which will delete the new gateway and connections.

## Limitations

The guided gateway migration experience has the following limitations:

- **ExpressRoute Only**: The migration tool is designed for **ExpressRoute virtual network gateways**. It does **not** support VPN gateways or other gateway types.
-**Same Virtual Network Requirement**: Migration is only supported within the same **virtual network**. Cross-subscription, cross-region, or cross-gateway-type migrations (for example, to/from VPN gateways) aren't supported.
- **No Downgrades**: Downgrading from an **Az-enabled SKU** to a **non-Az-enabled SKU** is **not** supported.
- **GatewaySubnet Size**: The GatewaySubnet must have a /27 prefix or longer to proceed with migration. For more information, see [Create multiple prefixes for a subnet](../virtual-network/virtual-network-manage-subnet.md) for more information.
- **Private Endpoint Connectivity**: Private endpoints (PEs) connected via ExpressRoute private peering may experience **connectivity issues** during migration. Refer to guidance on mitigating these issues in the Private endpoint connectivity documentation. [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).
- **Legacy Gateways**: ExpressRoute gateways created or connected to circuits in **2017 or earlier** aren't supported.
- **Unsupported SKUs**: Gateways using the **"default" SKU** aren't eligible for migration. To check the migration eligibility of your Gateway, there should be an Advisor notification.

For detailed troubleshooting errors and best practices, see [Troubleshooting Gateway Migration](gateway-migration-error-messaging.md).

## FAQ

### How do I add a second prefix to the GatewaySubnet?

Adding multiple prefixes to the GatewaySubnet is currently in Public Preview and supported only via PowerShell. For instructions, see [Create multiple prefixes for a subnet](../virtual-network/virtual-network-manage-subnet.md).

### How do I monitor the health of the new gateway?

Monitoring for the new gateway is the same as for the old gateway. The new gateway is a separate resource with its own metrics. During migration, you can also observe traffic patterns using the migration tool.

After migration, if you had existing monitoring, alerting, customer-defined maintenance windows, or diagnostic settings configured, you'll need to reconfigure these on the newly created gateway.

### Will migration cause downtime?

Migration may cause a few minutes of downtime. Plan to perform the migration during a maintenance window to minimize impact.

### How long can I wait before committing to the new gateway?

You have up to 15 days to commit after migration preparation. Use this time to validate connectivity and ensure all requirements are met before finalizing the migration.

### How do I check if my gateway SKU is eligible for migration?

Azure Advisor notifications will alert you if your gateway requires migration. Attempting to migrate an ineligible gateway will result in an error. For more details, see [Troubleshooting Gateway Migration](gateway-migration-error-messaging.md).

## Next Steps

- Troubleshoot migration  issues with [Troubleshooting Gateway Migration](gateway-migration-error-messaging.md).
- Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).
- Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).
