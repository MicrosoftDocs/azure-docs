---
title: Migrate to an availability zone-enabled ExpressRoute virtual network gateway (Preview)
titleSuffix: Azure ExpressRoute
description: This article explains how to seamlessly migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: ignite-2023, devx-track-azurepowershell
ms.topic: how-to
ms.date: 11/15/2023
ms.author: duau
---

# Migrate to an availability zone-enabled ExpressRoute virtual network gateway (Preview)

When you create an ExpressRoute virtual network gateway, you need to specify the gateway SKU that you want to use. When you select a higher gateway SKU, more CPUs and network bandwidth are allocated to the gateway, and as a result, the gateway can support higher network throughput and more dependable network connections to the virtual network. 

The following SKUs are available for ExpressRoute virtual network gateways:

* Standard
* HighPerformance
* UltraPerformance
* ErGw1Az
* ErGw2Az
* ErGw3Az
* ErGwScale (Preview)

## Availability zone enabled SKUs
The ErGw1Az, ErGw2Az, ErGw3Az and ErGwScale (Preview) SKUs, also known as Az-Enabled SKUs, support Availability zone deployments. This feature provides high availability and resiliency to the gateway by distributing the gateway across multiple availability zones.  

The Standard, HighPerformance, and UltraPerformance SKUs, which are also known as non-availability zone enabled SKUs are historically associated with Basic IPs, don't support the distribution of the gateway across multiple availability zones.  

For enhanced reliability, it's recommended to use an Availability-Zone Enabled virtual network gateway SKU. These SKUs support a zone-redundant setup and are, by default, associated with Standard IPs. This setup ensures that even if one zone experiences issues, the virtual network gateway infrastructure remains operational due to the distribution across multiple zones. For a deeper understanding of zone redundant gateways, please refer to [Availability Zone deployments.](../reliability/availability-zones-overview.md)

## Gateway migration experience
Historically, users had to use the Resize-AzVirtualNetworkGateway PowerShell command or delete and recreate the virtual network gateway to migrate between SKUs.

With the guided gateway migration experience you can deploy a second virtual network gateway in the same GatewaySubnet and Azure automatically transfers the control plane and data path configuration from the old gateway to the new one. During the migration process, there will be two virtual network gateways in operation within the same GatewaySubnet. This feature is designed to support migrations without downtime. However, users may experience brief connectivity issues or interruptions during the migration process.
## Supported migration scenarios
The guided gateway migration experience supports any-to-any SKU migration. However, it's recommended to migrate to an Az-enabled SKU. 

### Limitations

The guided gateway migration experience doesn't support these scenarios:
* Migration to a virtual network gateway SKU configured with a Basic IP

Private endpoints (PEs) in the virtual network, connected over ExpressRoute private peering, might have connectivity problems during the migration. To understand and reduce this issue, see [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).

## Common validation errors
In the gateway migration experience, you'll need to validate if your resource is capable of migration. Here are some Common migration errors: 

### Virtual network 
* Gateway Subnet needs two or more prefixes for migration.
* MaxGatewayCountInVnetReached – Reached maximum number of gateways that can be created in a Virtual Network. 

### Connection 
The virtual network gateway connection resource isn't in a succeed state. 

## Enroll subscription to access the feature

1. To access this feature, you need to enroll your subscription by filling out the [ExpressRoute gateway migration form](https://aka.ms/ergwmigrationform).

1. After your subscription is enrolled, you'll get a confirmation e-mail with a PowerShell script or a link to the Azure portal for the gateway migration.

## Migrate to a new gateway

1. First, update the `Az.Network` module to the latest version by running this PowerShell command:

    ```powershell-interactive
    Update-Module -Name Az.Network -Force
    ```

1. Then, add a second prefix to the **GatewaySubnet** by running these PowerShell commands:

    ```powershell-interactive
    $vnet = Get-AzVirtualNetwork -Name $vnetName -ResourceGroupName $resourceGroup
    $subnet = Get-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet
    $prefix = "Enter new prefix"
    $subnet.AddressPrefix.Add($prefix)
    Set-AzVirtualNetworkSubnetConfig -Name GatewaySubnet -VirtualNetwork $vnet -AddressPrefix $subnet.AddressPrefix
    Set-AzVirtualNetwork -VirtualNetwork $vnet
    ```

1. Next, run the **PrepareMigration.ps1** script to prepare the migration. This script creates a new ExpressRoute virtual network gateway on the same GatewaySubnet and connects it to your existing ExpressRoute circuits.

1. After that, run the **Migration.ps1** script to perform the migration. This script transfers the configuration from the old gateway to the new one.

1. Finally, run the **CommitMigration.ps1** script to complete the migration. This script deletes the old gateway and its connections.

    >[!IMPORTANT]
    > Before running this step, verify that the new virtual network gateway has a working ExpressRoute connection.
    >

## Next steps

* Learn more about [Designing for high availability](designing-for-high-availability-with-expressroute.md).
* Plan for [Disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
