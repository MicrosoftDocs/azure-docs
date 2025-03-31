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
When creating an ExpressRoute virtual network gateway, selecting the appropriate [gateway SKU](expressroute-about-virtual-network-gateways.md#gateway-types) is crucial. Higher-level SKUs allocate more CPUs and network bandwidth to the gateway, enabling higher network throughput and more reliable connections to the virtual network.

### Available SKUs for ExpressRoute Virtual Network Gateways

The following SKUs are available:

- **Standard**
- **HighPerformance**
- **UltraPerformance**
- **ErGw1Az**
- **ErGw2Az**
- **ErGw3Az**
- **ErGwScale** (Preview)

### Availability Zone-Enabled SKUs

The SKUs **ErGw1Az**, **ErGw2Az**, **ErGw3Az**, and **ErGwScale** (Preview) are referred to as Availability Zone (Az)-Enabled SKUs. These SKUs support deployment across multiple availability zones, providing enhanced resiliency and high availability by distributing the gateway infrastructure across zones.

In contrast, the **Standard**, **HighPerformance**, and **UltraPerformance** SKUs, also known as non-Az-enabled SKUs, are typically associated with Basic IPs and do not support distribution across availability zones.

### Recommendation for enhanced reliability

For improved reliability, we recommend using an Az-enabled virtual network gateway SKU. These SKUs support zone-redundant configurations and are associated with Standard IPs by default. A zone-redundant setup ensures that the gateway infrastructure remains operational even if one availability zone encounters an issue. To learn more about zone-redundant gateways, see [Availability Zone deployments](../reliability/availability-zones-overview.md).

## Gateway migration experience

Previously, migrating between SKUs required using the `Resize-AzVirtualNetworkGateway` PowerShell command or manually deleting and recreating the virtual network gateway.

The guided gateway migration experience simplifies this process by allowing you to deploy a second virtual network gateway within the same GatewaySubnet. Azure automatically transfers the control plane and data path configurations from the old gateway to the new one. During the migration, both gateways operate simultaneously within the same GatewaySubnet. While this feature minimizes disruption, brief connectivity interruptions may still occur.

Once the migration is complete and the old gateway along with its connections are deleted, the newly created gateway will be tagged with `"CreatedBy : GatewaySKUMigration"`. This tag helps distinguish migrated gateways from others that haven't undergone migration and should not be deleted.


### Steps to Migrate to a New Gateway

1. **Validate**: Confirm that all resources are in a succeeded state to ensure the gateway is ready for migration. If prerequisites are not met, the validation process will fail, and migration cannot proceed.
2. **Prepare**: Create a new virtual network gateway, public IP, and connections. This step can take up to 45 minutes. You can specify a preferred name for the new gateway and connections. If no name is provided, the system appends the tag **_migrate** by default. During this step, the existing virtual network gateway is locked, preventing any creation or modification of connections.
3. **Migrate**: Transfer traffic from the old gateway to the new one by selecting the new gateway. This operation may take up to 15 minutes and could result in brief connectivity interruptions.
4. **Commit**: Finalize the migration by deleting the old gateway and its connections.

> [!IMPORTANT]
> After completing the migration, validate your connectivity to ensure everything is functioning as expected. If needed, you can revert to the old gateway by selecting **Abort** after the prepare step. This action will delete the new gateway and its connections.

| Migration source (Non-Az-enabled gateway SKU) | Migration target (Az-enabled gateway SKU) |
|--|--|
| Standard, HighPerformance, UltraPerformance | ErGw1Az, ErGw2Az, ErGw3Az, ErGwScale (Preview) |
| Basic IP | Standard IP |

## Supported Migration Scenarios

### Using Azure Portal and Azure PowerShell

The guided gateway migration experience supports the following scenarios:

- Migrating from a non-Az-enabled SKU with a Basic IP to a non-Az-enabled SKU with a Standard IP.
- Migrating from a non-Az-enabled SKU with a Basic IP to an Az-enabled SKU with a Standard IP.
- Migrating from a non-Az-enabled SKU with a Standard IP to an Az-enabled SKU with a Standard IP.

For enhanced reliability and high availability, we recommend migrating to an Az-enabled SKU. For detailed steps, see [Migrate to an availability zone-enabled ExpressRoute virtual network gateway using PowerShell](expressroute-howto-gateway-migration-powershell.md).

### Limitations

The guided gateway migration experience has the following limitations:

- Downgrade scenarios, such as migrating from an Az-enabled SKU to a non-Az-enabled SKU, are not supported.
- The GatewaySubnet must have a prefix of /27 or longer to proceed with the migration.
- Private endpoints (PEs) in the virtual network connected via ExpressRoute private peering may experience connectivity issues during migration. For guidance on mitigating these issues, see [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).

## Common Validation Errors

During the gateway migration process, it is essential to validate whether your resources are ready for migration. Below are some common validation errors you may encounter:

### Virtual Network

- **MaxGatewayCountInVnetReached**: This error indicates that the maximum number of gateways allowed in the virtual network has been reached.

## Next Steps

- Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).
- Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).
- Explore best practices for [designing for high availability](designing-for-high-availability-with-expressroute.md).
- Plan for [disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
