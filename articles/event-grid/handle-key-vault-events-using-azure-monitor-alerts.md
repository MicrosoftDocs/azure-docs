---
title: Key Vault Event Alerts with Azure Monitor
description: Learn how to configure Azure Monitor alerts to handle Azure Key Vault events, such as when a certificate, key, or secret is about to expire or expires.
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 08/27/2026
author: robece
ms.author: robece
ai-usage: ai-assisted
---

# Handle Azure Key Vault system events by using Azure Monitor alerts

Azure Key Vault can emit events to a system topic when a certificate, key, or secret is about to expire (30 days in advance), and other events when they do expire. By routing these events to Azure Monitor alerts, you can detect and fix expiration issues before they affect your services.

This article shows you how to create an event subscription that sends Key Vault events to Azure Monitor alerts, and how to view and manage the resulting alerts. For more information about the available events, see [Azure Key Vault event schema](event-schema-key-vault.md).

## Prerequisites

- Create a Key Vault resource. For instructions, see [Create a key vault using the Azure portal](/azure/key-vault/general/quick-create-portal).
- To learn about Azure Monitor alerts, see [How to send events to Azure Monitor alerts](handler-azure-monitor-alerts.md).

## Create and configure the event subscription

When creating an event subscription, follow these steps:

1. Enter a **name** for the event subscription.
1. For **Event Schema**, select **Cloud Events Schema v1.0**. It's the only schema type that the Azure Monitor alerts destination supports.
1. Set the **Topic Type** to **Key Vault**.
1. For **Source Resource**, select the Key Vault resource.
1. Enter a name for the Event Grid system topic.
1. For **Filter to Event Types**, select the event types that you're interested in.
1. For **Endpoint Type**, select **Azure Monitor Alert** as a destination.
1. Select the **Configure an endpoint** link.
1. On the **Select Monitor Alert Configuration** page, follow these steps.
    1. Select the alert **severity**.
    1. Select the **action group** (optional), see [Create an action group in the Azure portal](/azure/azure-monitor/alerts/action-groups).
    1. Enter a **description** for the alert.
    1. Select **Confirm Selection**.

        :::image type="content" source="media/handler-azure-monitor-alerts/event-subscription.png" alt-text="Screenshot that shows Azure Monitor alerts event subscription creation." border="false" lightbox="media/handler-azure-monitor-alerts/event-subscription.png":::
1. On the **Create Event Subscription** page, select **Create** to create the event subscription. For detailed steps, see [subscribe to events through portal](subscribe-through-portal.md).

## Manage fired alerts

Manage the subscription directly in the source (for example, the Key Vault resource) by selecting the **Events** page or by accessing the **Event Grid system topic** resource. For more information, see the following references: [blob event quickstart](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage) and [manage the system topic](create-view-manage-system-topics.md).

## View alert instances

Key Vault events appear as alerts, and you can view them on the alerts page. To learn how to view and manage these alerts, see [manage alert instances](/azure/azure-monitor/alerts/alerts-manage-alert-instances).

## Next steps

See the following articles:

- [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview)
- [Manage Azure Monitor alert rules](/azure/azure-monitor/alerts/alerts-manage-alert-rules)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
- [Concepts](concepts.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
