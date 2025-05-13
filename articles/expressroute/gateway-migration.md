---
title: About migrating to an availability zone-enabled ExpressRoute virtual network gateway
titleSuffix: Azure ExpressRoute
description: This article explains how to migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom: ignite-2023
ms.topic: concept-article
ms.date: 03/31/2025
ms.author: duau
---

# About migrating to an availability zone-enabled ExpressRoute virtual network gateway 
When you create an ExpressRoute virtual network gateway, selecting the appropriate [gateway SKU](expressroute-about-virtual-network-gateways.md#gateway-types) is crucial. Higher-level SKUs allocate more CPUs and network bandwidth to the gateway, enabling higher network throughput and more reliable connections to the virtual network.

### Availability Zone-Enabled SKUs

The SKUs **ErGw1Az**, **ErGw2Az**, **ErGw3Az**, and **ErGwScale** (Preview) are referred to as Availability Zone (Az)-Enabled SKUs. These SKUs support deployment across multiple availability zones, providing enhanced resiliency and high availability by distributing the gateway infrastructure across zones.

In contrast, the **Standard**, **HighPerformance**, and **UltraPerformance** SKUs, also known as non-Az-enabled SKUs, are typically associated with Basic IPs and don't support distribution across availability zones.

>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. 

This article will help guide you through the migration process of a Non-Az Gateway with Basic SKU Public IP Address to Az-enabled Gateway with Standard SKU Public IP Address.

For other Networking services with Basic SKU Public IP Address, see [Upgrading Basic to Standard SKU](../virtual-network/ip-services/public-ip-basic-upgrade-guidance.md#steps-to-complete-the-upgrade)

### Recommendation for enhanced reliability

For improved reliability, we recommend using an Az-enabled virtual network gateway SKU. These SKUs support zone-redundant configurations and are associated with Standard IPs by default. A zone-redundant setup ensures that the gateway infrastructure remains operational even if one availability zone encounters an issue. To learn more about zone-redundant gateways, see [Availability Zone deployments](../reliability/availability-zones-overview.md).

## Gateway migration experience

Previously, migrating between SKUs required using the `Resize-AzVirtualNetworkGateway` PowerShell command or manually deleting and recreating the virtual network gateway.

The guided gateway migration experience simplifies this process by allowing you to deploy a second virtual network gateway within the same GatewaySubnet. Azure automatically transfers the control plane and data path configurations from the old gateway to the new one. During the migration, both gateways operate simultaneously within the same GatewaySubnet. While this feature minimizes disruption, brief connectivity interruptions might still occur.

Once the migration is complete and the old gateway along with its connections are deleted, the newly created gateway is tagged with `"CreatedBy : GatewaySKUMigration"`. This tag helps distinguish migrated gateways from others that haven't undergone migration and shouldn't be deleted.

### Steps to migrate to a new gateway

1. **Validate**: Ensure all resources are in a succeeded state to confirm the gateway is ready for migration. If prerequisites aren't met, validation fails, and you can't proceed.
2. **Prepare**: Create a new Virtual Network gateway, Public IP, and connections. This operation can take up to 45 minutes. You can choose a preferred name for the new gateway and connections. If you don't change the name, the tag **_migrate** will be appended by default. During this process, the existing Virtual Network gateway will be locked, preventing any creation or modification of connections.
3. **Migrate**: Select the new gateway to transfer traffic from the old gateway to the new one. This operation can take up to 15 minutes and may cause brief interruptions.
4. **Commit**: Finalize the migration by deleting the old gateway and connections.

> [!IMPORTANT]
> After migration, validate your connectivity to ensure everything is functioning as expected. You can revert to the old gateway by selecting **Abort** after the prepare step, which will delete the new gateway and connections.

| Migration source (Non-Az-enabled gateway SKU) | Migration target (Az-enabled gateway SKU) |
|--|--|
| Standard, HighPerformance, UltraPerformance | ErGw1Az, ErGw2Az, ErGw3Az, ErGwScale (Preview) |
| Basic IP | Standard IP |

## Supported Migration Scenarios

### Using Azure portal and Azure PowerShell

The guided gateway migration experience supports the following scenarios:

- Migrating from a non-Az-enabled SKU with a Basic IP to a non-Az-enabled SKU with a Standard IP.
- Migrating from a non-Az-enabled SKU with a Basic IP to an Az-enabled SKU with a Standard IP.

For enhanced reliability and high availability, we recommend migrating to an Az-enabled SKU. For detailed steps, see [Migrate to an availability zone-enabled ExpressRoute virtual network gateway using PowerShell](expressroute-howto-gateway-migration-powershell.md).

### Limitations

The guided gateway migration experience has the following limitations:

- The migration tool is exclusively designed for ExpressRoute virtual network gateways. It does not support migration for VPN gateways or other gateway types.
- The migration tool only supports gateway migration within the same virtual network. It does not allow migration across different subscriptions, regions, or gateway types such as VPN gateways.
- Downgrade scenarios, such as migrating from an Az-enabled SKU to a non-Az-enabled SKU, aren't supported.
- The GatewaySubnet must have a prefix of /27 or longer to proceed with the migration.
- Private endpoints (PEs) in the virtual network connected through ExpressRoute private peering can experience connectivity issues during migration. For guidance on mitigating these issues, see [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).
- ExpressRoute Gateways that were established or connected to circuits in 2017 or earlier.
- ExpressRoute Gateways with the SKU named "default" are not supported for migration.

For detailed troubleshooting errors and best practices, see [Troubleshooting Gateway Migration](gateway-migration-error-messaging.md)

## Next Steps

- Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).
- Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).
- Explore best practices for [designing for high availability](designing-for-high-availability-with-expressroute.md).
- Plan for [disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
