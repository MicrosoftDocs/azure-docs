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

In contrast, the **Standard**, **HighPerformance**, and **UltraPerformance** SKUs, also known as non-Az-enabled SKUs, are typically associated with Basic IPs and don't support distribution across availability zones.

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
>[!Important]
>On September 30, 2025, Basic SKU public IPs will be retired. For more information, see the [official announcement](https://azure.microsoft.com/updates/upgrade-to-standard-sku-public-ip-addresses-in-azure-by-30-september-2025-basic-sku-will-be-retired/). If you are currently using Basic SKU public IPs, make sure to upgrade to Standard SKU public IPs prior to the retirement date. 

### Limitations

The guided gateway migration experience has the following limitations:

- **ExpressRoute Only**: The migration tool is designed for **ExpressRoute virtual network gateways**. It does **not** support VPN gateways or other gateway types.
-**Same Virtual Network Requirement**: Migration is only supported within the same **virtual network**. Cross-subscription, cross-region, or cross-gateway-type migrations (for example, to/from VPN gateways) aren't supported.
- **No Downgrades**: Downgrading from an **Az-enabled SKU** to a **non-Az-enabled SKU** is **not** supported.
- **GatewaySubnet Size**: The GatewaySubnet must have a /27 prefix or longer to proceed with migration. For more information, see [Create multiple prefixes for a subnet](https://learn.microsoft.com/en-us/azure/virtual-network/how-to-multiple-prefixes-subnet) for more information.
- **Private Endpoint Connectivity**: Private endpoints (PEs) connected via ExpressRoute private peering may experience **connectivity issues** during migration. Refer to guidance on mitigating these issues in the Private endpoint connectivity documentation. [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).
- **Legacy Gateways**: ExpressRoute gateways created or connected to circuits in **2017 or earlier** aren't supported.
- **Unsupported SKUs**: Gateways using the **"default" SKU** aren't eligible for migration. To check the migration eligibility of your Gateway, there should be an Advisor notification.

For detailed troubleshooting errors and best practices, see [Troubleshooting Gateway Migration](gateway-migration-error-messaging).
## Gateway migration experience

The gateway migration experience allows you to deploy a second virtual network gateway in the same GatewaySubnet. Azure migrates your configurations from the old gateway to the new one. Both gateways run simultaneously during migration, minimizing disruption – though brief connectivity interruptions may still occur.

After migration, the old gateway and its connections are deleted, and the new gateway is tagged with **CreatedBy: GatewaySKUMigration** to identify it as a migrated resource and shouldn’t be deleted.



1. **Validate**: Check that all resources are in a succeeded state. If any prerequisites aren't met, validation fails and migration can't proceed.
2. **Prepare**: Azure creates a new virtual network gateway, public IP, and connections. This step can take up to 45 minutes. You can specify a name for the new gateway, or Azure will add **_migrate** to the original name by default. During preparation, the existing gateway is locked to prevent changes. If you need to stop the migration, you can **abort** at this stage, which deletes the new gateway and connections.
    - **Note**: The new gateway is created in the same region as the existing one. To change regions, you must delete the current gateway and create a new one in the desired region.
3. **Migrate**: Switch traffic from the old gateway to the new one. This step can take up to 15 minutes and may cause brief connectivity interruptions.
4. **Commit**: Complete the migration by deleting the old gateway and its connections. If necessary, you can abort and revert to the old gateway before committing.


> [!IMPORTANT]
> After migration, validate your connectivity to ensure everything is functioning as expected. You can revert to the old gateway by selecting **Abort** after the prepare step, which will delete the new gateway and connections.

| Migration source (Non-Az-enabled gateway SKU) | Migration target (Az-enabled gateway SKU) |
|--|--|
| Basic IP | Standard IP |

## Common Validation Errors

During the gateway migration process, it's essential to validate whether your resources are ready for migration. Below are some common validation errors you can encounter:

### Virtual Network

- **MaxGatewayCountInVnetReached**: This error indicates that the maximum number of gateways allowed in the virtual network was reached.

## Next Steps

- Learn how to [migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).
- Learn how to [migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).
- Explore best practices for [designing for high availability](designing-for-high-availability-with-expressroute.md).
- Plan for [disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
