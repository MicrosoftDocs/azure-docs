---
title: Migrate to an availability zone-enabled ExpressRoute virtual network gateway (Preview)
titleSuffix: Azure ExpressRoute
description: This article explains how to seamlessly migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: duau
---

# Migrate to an availability zone-enabled ExpressRoute virtual network gateway (Preview)

A virtual network gateway requires a gateway SKU that determines its performance and capacity. Higher gateway SKUs provide more CPUs and network bandwidth for the gateway, enabling faster and more reliable network connections to the virtual network.

The following SKUs are available for ExpressRoute virtual network gateways:

* Standard
* HighPerformance
* UltraPerformance
* ErGw1Az
* ErGw2Az
* ErGw3Az

## Supported migration scenarios

To increase the performance and capacity of your gateway, you have two options: use the `Resize-AzVirtualNetworkGateway` PowerShell cmdlet or upgrade the gateway SKU in the Azure portal. The following upgrades are supported:

* Standard to HighPerformance
* Standard to UltraPerformance
* ErGw1Az to ErGw2Az
* ErGw1Az to ErGw3Az
* ErGw2Az to ErGw3Az
* Default to Standard

You can also reduce the capacity and performance of your gateway by choosing a lower gateway SKU. The supported downgrades are:

* HighPerformance to Standard
* ErGw2Az to ErGw1Az

## Availability zones

The ErGw1Az, ErGw2Az, ErGw3Az and ErGwScale (Preview) SKUs, also known as Az-Enabled SKUs, support [Availability Zone deployments](../reliability/availability-zones-overview.md). The Standard, HighPerformance and UltraPerformance SKUs, also known as Non-Az-Enabled SKUs, don't support this feature.

> [!NOTE]
> For optimal reliability, Azure suggests using an Az-Enabled virtual network gateway SKU with a [zone-redundant configuration](../reliability/availability-zones-overview.md#zonal-and-zone-redundant-services), which distributes the gateway across multiple availability zones.
>

## Gateway migration experience

The new guided gateway migration experience enables you to migrate from a Non-Az-Enabled SKU to an Az-Enabled SKU. With this feature, you can deploy a second virtual network gateway in the same GatewaySubnet and Azure automatically transfers the control plane and data path configuration from the old gateway to the new one.

### Limitations

The guided gateway migration experience doesn't support these scenarios:

* ExpressRoute/VPN coexistence
* Azure Route Server 
* FastPath connections

Private endpoints (PEs) in the virtual network, connected over ExpressRoute private peering, might have connectivity problems during the migration. To understand and reduce this issue, see [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).

## Enroll subscription to access the feature

1. To access this feature, you need to enroll your subscription by filling out the [ExpressRoute gateway migration form](https://aka.ms/ergwmigrationform).

1. After your subscription is enrolled, you'll get a confirmation e-mail with a PowerShell script for the gateway migration.

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
