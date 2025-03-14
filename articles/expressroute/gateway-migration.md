---
title: About migrating to an availability zone-enabled ExpressRoute virtual network gateway
titleSuffix: Azure ExpressRoute
description: This article explains how to migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom: ignite-2023
ms.topic: concept-article
ms.date: 04/26/2024
ms.author: duau
---

# About migrating to an availability zone-enabled ExpressRoute virtual network gateway 

When you create an ExpressRoute virtual network gateway, you need to choose the [gateway SKU](expressroute-about-virtual-network-gateways.md#gateway-types). If you choose a higher-level SKU, more CPUs and network bandwidth are allocated to the gateway. As a result, the gateway can support higher network throughput and more dependable network connections to the virtual network. 

The following SKUs are available for ExpressRoute virtual network gateways:

* Standard
* HighPerformance
* UltraPerformance
* ErGw1Az
* ErGw2Az
* ErGw3Az
* ErGwScale (Preview)

## Availability zone enabled SKUs

The ErGw1Az, ErGw2Az, ErGw3Az, and ErGwScale (Preview) SKUs, also known as Az-Enabled SKUs, support Availability zone deployments. This feature provides high availability and resiliency to the gateway by distributing the gateway across multiple availability zones.  

The Standard, HighPerformance, and UltraPerformance SKUs, which are also known as nonavailability zone enabled SKUs are historically associated with Basic IPs, don't support the distribution of the gateway across multiple availability zones.  

For enhanced reliability, we recommend using an Availability-Zone Enabled virtual network gateway SKU. These SKUs support a zone-redundant setup and are, by default, associated with Standard IPs. This setup ensures that even if one zone experiences an issue, the virtual network gateway infrastructure remains operational due to the distribution across multiple zones. For a deeper understanding of zone redundant gateways, refer to [Availability Zone deployments.](../reliability/availability-zones-overview.md)

## Gateway migration experience

Historically, users had to use the Resize-AzVirtualNetworkGateway PowerShell command or delete and recreate the virtual network gateway to migrate between SKUs.

With the guided gateway migration experience you can deploy a second virtual network gateway in the same GatewaySubnet and Azure automatically transfers the control plane and data path configuration from the old gateway to the new one. During the migration process, there will be two virtual network gateways in operation within the same GatewaySubnet. This feature is designed to support migrations without disruption. However, users may experience brief connectivity issues or interruptions during the migration process.

After completing the gateway migration and deleting the older gateway and its connections, the newly created gateway will be tagged with "CreatedBy : GatewaySKUMigration". This tag serves as a key differentiator from your other gateways that haven't been migrated and shouldn't be deleted.


### Steps to migrate to a new gateway

1. **Validate**: Ensure all resources are in a succeeded state to confirm the gateway is ready for migration. If prerequisites aren't met, validation fails, and you can't proceed.
2. **Prepare**: Create a new Virtual Network gateway, Public IP, and connections. This operation can take up to 45 minutes. You can choose a preferred name for the new gateway and connections. If you don't change the name, the tag **_migrate** is appended by default. During this process, the existing Virtual Network gateway is locked, preventing any creation or modification of connections.
3. **Migrate**: Select the new gateway to transfer traffic from the old gateway to the new one. This operation can take up to 15 minutes and may cause brief interruptions.
4. **Commit**: Finalize the migration by deleting the old gateway and connections.

> [!IMPORTANT]
> After migration, validate your connectivity to ensure everything is functioning as expected. You can revert to the old gateway by selecting **Abort** after the prepare step, which will delete the new gateway and connections.


| Migrate from Non-Az-enabled Gateway SKU     | Migrate to Az-enabled Gateway SKU              |
|---------------------------------------------|------------------------------------------------|
| Standard, HighPerformance, UltraPerformance | ErGw1Az, ErGw2Az, ErGw3Az, ErGwScale (Preview) |
| Basic IP                                    | Standard IP                                    |

## Supported migration scenarios

### Azure portal & Azure PowerShell

The guided gateway migration experience supports:

* Non-Az-enabled SKU on Basic IP to Non-az-enabled SKU on Standard IP.
* Non-Az-enabled SKU on Basic IP to Az-enabled SKU on Standard IP.
* Non-Az-enabled SKU on Standard IP to Az-enabled SKU on Standard IP.

We recommend migrating to an Az-enabled SKU for enhanced reliability and high availability. To learn more, see [Migrate to an availability zone-enabled ExpressRoute virtual network gateway using PowerShell](expressroute-howto-gateway-migration-powershell.md).

### Limitations

The guided gateway migration experience doesn't support downgrade scenarios, Az-enabled Gateway SKU to non-Az-enabled Gateway SKU.

To proceed with migration, a /27 prefix or longer is required in the GatewaySubnet.

Private endpoints (PEs) in the virtual network, connected over ExpressRoute private peering, might have connectivity problems during the migration. To understand and reduce this issue, see [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).

## Common validation errors

In the gateway migration experience, you need to validate if your resource is capable of migration. Here are some Common migration errors: 

### Virtual network 

MaxGatewayCountInVnetReached – Reached maximum number of gateways that can be created in a Virtual Network. 

## Next steps

* Learn how to [Migrate using the Azure portal](expressroute-howto-gateway-migration-portal.md).
* Learn how to [Migrate using PowerShell](expressroute-howto-gateway-migration-powershell.md).
* Learn more about [Designing for high availability](designing-for-high-availability-with-expressroute.md).
* Plan for [Disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
