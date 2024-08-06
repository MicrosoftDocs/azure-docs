---
title: Handle Azure Key Vault events using Monitor alerts
description: This article describes how to handle Azure Key Vault events using Azure Monitor alerts.
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 04/25/2024
author: robece
ms.author: robece
---

# Handle Azure Key Vault system events using Azure Monitor alerts
Azure Key Vault can emit events to a system topic when a certificate, key, or secret is about to expire (30 days heads up), and other events when they do expire. For more information, see ([Azure Key Vault event schema](event-schema-key-vault.md)). You can set up alerts on these events so you can fix expiration issues before your services are affected.

## Prerequisites

- Create a Key Vault resource by following instructions from [Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).
- To learn about Azure Monitor alerts, see [How to send events to Azure monitor alerts](handler-azure-monitor-alerts.md)


## Create and configure the event subscription

When creating an event subscription, follow these steps:

1. Enter a **name** for event subscription.
1. For **Event Schema**, select the event schema as **Cloud Events Schema v1.0**. It's the only schema type that's supported for Azure Monitor alerts destination).
1. Select the **Topic Type** to **Key Vault**.
1. For **Source Resource**, select the Key Vault resource.
1. Enter a name for the Event Grid system topic to be created.
1. For **Filter to Event Types**, select the event types that you're interested in.
1. For **Endpoint Type**, select **Azure Monitor Alert** as a destination.
1. Select **Configure an endpoint** link.
1. On the **Select Monitor Alert Configuration** page, follow these steps.
    1. Select the alert **severity**.
    1. Select the **action group** (optional), see [Create an action group in the Azure portal](../azure-monitor/alerts/action-groups.md).
    1. Enter a **description** for the alert.
    1. Select **Confirm Selection**.

        :::image type="content" source="media/handler-azure-monitor-alerts/event-subscription.png" alt-text="Screenshot that shows Azure Monitor alerts event subscription creation." border="false" lightbox="media/handler-azure-monitor-alerts/event-subscription.png":::
1. Now, on the **Create Event Subscription** page, select **Create** to create the event subscription. For detailed steps, see [subscribe to events through portal](subscribe-through-portal.md).

## Manage fired alerts

You can manage the subscription directly in the source (for example, Key Vault resource) by selecting the **Events** page or by accessing to the **Event Grid system topic** resource, see the following references: [blob event quickstart](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage), and [manage the system topic](create-view-manage-system-topics.md).

## Fire alert instances

Now, Key Vault events appear as alerts and you can view them in alerts page. See this article to learn how to
[manage alert instances](../azure-monitor/alerts/alerts-manage-alert-instances.md).

## Next steps

See the following articles:

- [Azure Monitor alerts](../azure-monitor/alerts/alerts-overview.md)
- [Manage Azure Monitor alert rules](../azure-monitor/alerts/alerts-manage-alert-rules.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
- [Concepts](concepts.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
