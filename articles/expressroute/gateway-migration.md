---
title: Migrate to an availability zone-enabled ExpressRoute virtual network gateway
titleSuffix: Azure ExpressRoute
description: This article explains how to seamlessly migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: ignite-2023, devx-track-azurepowershell
ms.topic: how-to
ms.date: 04/23/2024
ms.author: duau
---

# Migrate to an availability zone-enabled ExpressRoute virtual network gateway 

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

The Standard, HighPerformance, and UltraPerformance SKUs, which are also known as nonavailability zone enabled SKUs are historically associated with Basic IPs, don't support the distribution of the gateway across multiple availability zones.  

For enhanced reliability, it's recommended to use an Availability-Zone Enabled virtual network gateway SKU. These SKUs support a zone-redundant setup and are, by default, associated with Standard IPs. This setup ensures that even if one zone experiences issues, the virtual network gateway infrastructure remains operational due to the distribution across multiple zones. For a deeper understanding of zone redundant gateways, please refer to [Availability Zone deployments.](../reliability/availability-zones-overview.md)

## Gateway migration experience

Historically, users had to use the Resize-AzVirtualNetworkGateway PowerShell command or delete and recreate the virtual network gateway to migrate between SKUs.

With the guided gateway migration experience you can deploy a second virtual network gateway in the same GatewaySubnet and Azure automatically transfers the control plane and data path configuration from the old gateway to the new one. During the migration process, there will be two virtual network gateways in operation within the same GatewaySubnet. This feature is designed to support migrations without downtime. However, users may experience brief connectivity issues or interruptions during the migration process.

## Supported migration scenarios

### Azure portal

The guided gateway migration experience supports non-Az-enabled SKU to Az-enabled SKU migration.

### Azure PowerShell

The guided gateway migration experience supports:

* Non-Az-enabled SKU on Basic IP to Non-az enabled SKU on Standard IP.
* Non-Az-enabled SKU to Az-enabled SKU.

It's recommended to migrate to an Az-enabled SKU for enhanced reliability and high availability.

### Limitations

The guided gateway migration experience doesn't support these scenarios:
* Downgrade scenarios, Az-enabled Gateway SKU to non-Az-enabled Gateway SKU.

Private endpoints (PEs) in the virtual network, connected over ExpressRoute private peering, might have connectivity problems during the migration. To understand and reduce this issue, see [Private endpoint connectivity](expressroute-about-virtual-network-gateways.md#private-endpoint-connectivity-and-planned-maintenance-events).

## Common validation errors

In the gateway migration experience, you need to validate if your resource is capable of migration. Here are some Common migration errors: 

### Virtual network 

* Gateway Subnet needs two or more prefixes for migration.
* MaxGatewayCountInVnetReached – Reached maximum number of gateways that can be created in a Virtual Network. 

### Connection 

The virtual network gateway connection resource isn't in a succeed state. 

## Migrate to a new gateway

Here are the steps to migrate to a new gateway, using the Azure portal or PowerShell.

### [**Portal**](#tab/nic-address-portal)

1. In the [Azure portal](https://portal.azure.com/), navigate to the ExpressRoute Gateway Resource that you want to migrate to.
1. the left-hand menu under *Settings*, select **Gateway SKU Migration**.

    :::image type="content" source="media/gateway-migration/gateway-sku-migration-location.png" alt-text="Screenshot of Gateway migration location.":::

1. Select **Validate** to check if the gateway is ready for migration. You'll first see a list of prerequisites that must be met before migration can begin. If these prerequisites aren't met, validation fails and you can't proceed.

    :::image type="content" source="media/gateway-migration/service-technology-image-description.png" alt-text="Alt text that describes the content of the image.":::

1. Once validation is successful, you enter the *Prepare* stage. Here, a new Virtual Network gateway is created. Under **Virtual Network Gateway Details**, enter the following information.
    
    :::image type="content" source="media/gateway-migration/gateway-prepare-stage.png" alt-text="Alt text that describes the content of the image.":::

    | Setting | Value |
    | --------| ----- |
    | **Gateway Name** | Enter a name for the new gateway. |
    | **Gateway SKU** | Select the SKU for the new gateway. |
    | **Public IP Address** | Select **Add new**, then enter a name for the new public IP, select your availability zone, and select **OK** |

    > [!NOTE]
    > Be aware that your existing Virtual Network gateway will be locked during this process, preventing any creation or modification of connections to this gateway.

1. Select **Prepare** to create the new gateway. This operation could take up to 15 minutes.

    :::image type="content" source="media/gateway-migration/service-technology-image-description.png" alt-text="Alt text that describes the content of the image.":::

1. After the new gateway is created, you'll proceed to the *Migrate* stage. Here, you choose the new ExpressRoute gateway you created. This transfers the settings from your old gateway to the new one. All network traffic, and control plane and data path connections from your old gateway, will be transferred without any interruptions. To start this process, select on *Migrate Traffic*. Note, this operation could take up to 5 minutes.

    :::image type="content" source="media/gateway-migration/service-technology-image-description.png" alt-text="Alt text that describes the content of the image.":::

1. "After the traffic migration is finished, you'll proceed to the *Commit* stage. In this stage, you finalize the migration, which involves deleting the old gateway. To do this, select on 'Commit Migration'. This final step is designed to occur without causing any downtime. 

    :::image type="content" source="media/gateway-migration/service-technology-image-description.png" alt-text="Alt text that describes the content of the image.":::


### [**PowerShell**](#tab/nic-address-powershell)

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
    

## Next steps

* Learn more about [Designing for high availability](designing-for-high-availability-with-expressroute.md).
* Plan for [Disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
