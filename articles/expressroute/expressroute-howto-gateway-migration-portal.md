---
title: Migrate to an availability zone-enabled ExpressRoute virtual network gateway in Azure portal
titleSuffix: Azure ExpressRoute
description: This article explains how to seamlessly migrate from Standard/HighPerf/UltraPerf SKUs to ErGw1/2/3AZ SKUs in Azure portal.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.custom: ignite-2023, devx-track-azurepowershell
ms.topic: how-to
ms.date: 04/22/2025
ms.author: duau
---

# Migrate to an availability zone-enabled ExpressRoute virtual network gateway in Azure portal

When creating an ExpressRoute virtual network gateway, you must select a [gateway SKU](expressroute-about-virtual-network-gateways.md#gateway-types). Higher-level SKUs allocate more CPUs and network bandwidth, enabling the gateway to support higher throughput and more reliable connections to the virtual network.

## Prerequisites

- Review the [gateway migration](gateway-migration.md) article before starting.
- Ensure you have an existing [ExpressRoute virtual network gateway](expressroute-howto-add-gateway-portal-resource-manager.md) in your Azure subscription.

> [!TIP]
> You can now deploy two ExpressRoute gateways within the same virtual network. To do this, create a second ExpressRoute gateway with its admin state set to **disabled**. Once the second gateway is deployed, initiate the *Prepare* step in the migration tool. This step establishes the connection without redeploying the gateway, as it's already in place. Finally, run the *Migrate* step, which will change the new gateway's admin state to **_enabled_**, completing the migration process. This method minimizes the migration or maintenance window, significantly reducing downtime when transitioning from a non-zonal to a zone-redundant gateway.

## Steps to migrate to a new gateway in Azure portal

Follow these steps to migrate to a new gateway using the Azure portal:

1. Navigate to your **Virtual Network Gateway** resource in the [Azure portal](https://portal.azure.com/).

1. In the left-hand menu under **Settings**, select **Gateway SKU Migration**.

1. Select **Validate** to check if the gateway is ready for migration. A list of prerequisites will be displayed. If any prerequisites are unmet, validation fails, and migration can't proceed.

    :::image type="content" source="media/gateway-migration/validate-step.png" alt-text="Screenshot of the validate step for migrating a virtual network gateway." lightbox="media/gateway-migration/validate-step.png":::

1. Once validation succeeds, proceed to the **Prepare** stage. A new virtual network gateway is created. Under **Virtual Network Gateway Details**, provide the following information:

    :::image type="content" source="media/gateway-migration/gateway-prepare-stage.png" alt-text="Screenshot of the Prepare stage for migrating a virtual network gateway." lightbox="media/gateway-migration/gateway-prepare-stage.png":::

    | Setting | value |
    |--|--|
    | **Gateway name** | Enter a name for the new gateway. |
    | **Gateway SKU** | Select the SKU for the new gateway. |
    | **Public IP address** | Select **Add new**, provide a name for the new public IP, choose an availability zone, and select **OK**. |

    > [!NOTE]
    > During this process, your existing virtual network gateway is locked, preventing the creation or modification of connections.

1. Select **Prepare** to create the new gateway. This operation can take up to 45 minutes.

1. After the new gateway is created, proceed to the **Migrate** stage. Select the new gateway (for example, **myERGateway_migrated**) to transfer settings from the old gateway to the new one. All network traffic and data path connections transfer. Select **Migrate Traffic** to start the process. This step can take up to 5 minutes.

    :::image type="content" source="media/gateway-migration/migrate-traffic-step.png" alt-text="Screenshot of migrating traffic for migrating a virtual network gateway." lightbox="media/gateway-migration/migrate-traffic-step.png":::

1. Once traffic migration is complete, proceed to the **Commit** stage. Finalize the migration by deleting the old gateway. Select **Commit Migration** to complete this step.

    :::image type="content" source="media/gateway-migration/commit-step.png" alt-text="Screenshot of the commit step for migrating a virtual network gateway." lightbox="media/gateway-migration/commit-step.png":::

> [!IMPORTANT]
> - Before committing, verify that the new virtual network gateway has a working ExpressRoute connection and confirm traffic is flowing through the new connection.
> - Expect a possible interruption of up to 3 minutes during migration.
> - Once committed, the connection name can't be changed. To rename the connection, it must be deleted and recreated. Contact Azure support for assistance if needed.

## Next steps

* Learn more about [designing for high availability](designing-for-high-availability-with-expressroute.md).
* Plan for [disaster recovery](designing-for-disaster-recovery-with-expressroute-privatepeering.md) and [using VPN as a backup](use-s2s-vpn-as-backup-for-expressroute-privatepeering.md).
