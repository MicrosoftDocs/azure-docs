---
title: Configure geo-disaster recovery for Azure Event Hubs
description: Set up geo-disaster recovery pairing between Event Hubs namespaces, initiate failover during regional outages, and manage pairing configurations.
ms.topic: how-to
ms.date: 05/05/2026
#customer intent: As an IT administrator, I want to configure geo-disaster recovery for my Event Hubs namespace so that I can fail over during regional outages.
---

# Configure geo-disaster recovery for Azure Event Hubs

This article shows you how to set up geo-disaster recovery pairing between Event Hubs namespaces and initiate failover. For conceptual information about this feature, see [Geo-disaster recovery overview](event-hubs-geo-dr.md).

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/) before you begin.
- An Event Hubs namespace (Standard, Premium, or Dedicated tier). The Basic tier doesn't support geo-disaster recovery.

## Set up geo-disaster recovery pairing

To set up geo-disaster recovery, you create or use an existing primary namespace, create a secondary namespace in a different region, and then pair the two. This pairing gives you an alias that you can use to connect. Because you use an alias, you don't have to change connection strings.

> [!NOTE]
> Only new namespaces can be added to your failover pairing.

:::image type="content" source="./media/event-hubs-geo-dr/geo1.png" alt-text="Diagram showing the overview of geo-disaster recovery failover process.":::

1. Create the primary namespace.
1. Create the secondary namespace in a different region. This step is optional. You can create the secondary namespace while creating the pairing in the next step.
1. In the Azure portal, navigate to your primary namespace.
1. Select **Geo-recovery** on the left menu, and select **Initiate pairing** on the toolbar.

    :::image type="content" source="./media/event-hubs-geo-dr/primary-namspace-initiate-pairing-button.png" alt-text="Screenshot that shows the Geo-recovery page for an Event Hubs namespace with Initiate Pairing button selected." lightbox="./media/event-hubs-geo-dr/primary-namspace-initiate-pairing-button.png":::
1. On the **Initiate pairing** page, follow these steps:
    1. Select an existing secondary namespace or create one in a different region.
    1. For **Alias**, enter an alias for the geo-dr pairing.
    1. Select **Create**.

    :::image type="content" source="./media/event-hubs-geo-dr/initiate-pairing-page.png" alt-text="Screenshot that shows the selection of the secondary namespace for pairing.":::
1. On the **Geo-DR Alias** page, select **Shared access policies** on the left menu to access the primary connection string for the alias. Use this connection string instead of using the connection string to the primary or secondary namespace directly.

    :::image type="content" source="./media/event-hubs-geo-dr/geo-dr-alias-page.png" alt-text="Screenshot that shows the Geo-DR Alias page showing both the primary and secondary namespaces." lightbox="./media/event-hubs-geo-dr/geo-dr-alias-page.png":::

Finally, add monitoring to detect if a failover is necessary. In most cases, the service is one part of a large ecosystem, and automatic failovers are rarely possible because failovers must often be performed in sync with the remaining subsystem or infrastructure.

## Initiate failover

When you initiate the failover, two steps are required:

1. Set up another passive namespace and update the pairing so you can fail over again if another outage occurs.
1. Pull messages from the former primary namespace once it's available again. After that, use that namespace for regular messaging outside of your geo-recovery setup, or delete the old primary namespace.

> [!NOTE]
> Only *fail-forward* semantics are supported. When you initiate a failover with geo-disaster recovery, you can optionally re-pair with a new namespace after failover completes. Failing back to the previous primary replica isn't supported.

:::image type="content" source="./media/event-hubs-geo-dr/geo2.png" alt-text="Diagram showing the failover flow." lightbox="./media/event-hubs-geo-dr/geo2.png":::

# [Azure portal](#tab/portal)

1. In the Azure portal, navigate to your primary namespace.
1. Select **Geo-recovery** on the left menu.
1. Select **Failover** on the toolbar.

    > [!WARNING]
    > Failing over activates the secondary namespace and removes the primary namespace from the geo-disaster recovery pairing. Create another namespace to have a new geo-disaster recovery pair.

# [Azure CLI](#tab/cli)

Use the [`az eventhubs georecovery-alias fail-over`](/cli/azure/eventhubs/georecovery-alias#az-eventhubs-georecovery-alias-fail-over) command.

# [Azure PowerShell](#tab/powershell)

Use the [`Set-AzEventHubGeoDRConfigurationFailOver`](/powershell/module/az.eventhub/set-azeventhubgeodrconfigurationfailover) cmdlet.

# [C#](#tab/csharp)

Use the [`DisasterRecoveryConfigsOperationsExtensions.FailOverAsync`](/dotnet/api/microsoft.azure.management.eventhub.disasterrecoveryconfigsoperationsextensions.failoverasync) method.

For sample code that uses this method, see the [`GeoDRClient`](https://github.com/Azure/azure-event-hubs/blob/3cb13d5d87385b97121144b0615bec5109415c5a/samples/Management/DotNet/GeoDRClient/GeoDRClient/GeoDisasterRecoveryClient.cs#L137) sample in GitHub.

---

## Break pairing

If you made a mistake (for example, you paired the wrong regions during the initial setup), you can break the pairing of the two namespaces at any time.

1. In the Azure portal, navigate to your primary namespace.
1. Select **Geo-recovery** on the left menu.
1. Select **Break pairing** on the toolbar.

    :::image type="content" source="./media/event-hubs-geo-dr/break-pairing-fail-over-menu.png" alt-text="Screenshot that shows the Break Pairing and Failover menus on the Event Hubs Geo-DR Alias page." lightbox="./media/event-hubs-geo-dr/break-pairing-fail-over-menu.png":::

If you want to use the paired namespaces as regular namespaces, delete the alias.

## Related content

- [Geo-disaster recovery overview](event-hubs-geo-dr.md)
- [Geo-replication](geo-replication.md)
- [.NET GeoDR sample](https://github.com/Azure/azure-event-hubs/tree/master/samples/Management/DotNet/GeoDRClient)
- [Java GeoDR sample](https://github.com/Azure-Samples/eventhub-java-manage-event-hub-geo-disaster-recovery)
