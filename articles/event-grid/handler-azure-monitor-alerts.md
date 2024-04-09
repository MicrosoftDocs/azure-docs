---
title: How to send Event Grid events to Azure monitor alerts
description: This article describes how Azure Event Grid delivers Azure Key Vault events as Azure Monitor alerts.
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 11/15/2023
author: robece
ms.author: robece
---

# How to send events to Azure monitor alerts (Preview)

This article describes how Azure Event Grid delivers Azure Key Vault events as Azure Monitor alerts.

> [!IMPORTANT]
> Azure Monitor alerts as a destination in Event Grid event subscriptions is currently available only for [Azure Key Vault](event-schema-key-vault.md) system events.

## Overview

[Azure Monitor alerts](../azure-monitor/alerts/alerts-overview.md) help you detect and address issues before users notice them by proactively notifying you when Azure Monitor data indicates there might be a problem with your infrastructure or application.

Azure Monitor alerts as a destination in Event Grid event subscriptions allow you to receive notification of critical events via Short Message Service (SMS), email, push notification, and more. You can leverage the low latency event delivery of Event Grid with the direct notification system of Azure Monitor alerts.

## Azure Monitor alerts

Azure Monitor alerts have three resources: [alert rules](../azure-monitor/alerts/alerts-overview.md), [alert processing rules](../azure-monitor/alerts/alerts-processing-rules.md), and [action groups](../azure-monitor/alerts/action-groups.md). Each of these resources is its own independent resource and can be mixed and matched with each other.

- **Alert rules**: defines a resource scope and conditions on the resources’ telemetry. If conditions are met, it fires an alert.
- **Alert processing rules**: modify the fired alerts as they're being fired. You can use these rules to add or suppress action groups, apply filters, or have the rule processed on a predefined schedule.
- **Action groups**: defines how the user wants to be notified. It’s possible to create alert rules without an action group if the user simply wants to see telemetry condition metrics.

Creating alerts from Event Grid events provides you with the following benefits.

- **Additional actions**: You can connect alerts to action groups with actions that aren't supported by event handlers. For example, sending notifications using email, SMS, voice call, and mobile push notifications.
- **Easier viewing experience of events/alerts**: You can view all alerts on their resources from all alert types in one place, including alerts portal experience, Azure Mobile app experience, Azure Resource Graph queries, etc.
- **Alert processing rules**: You can use alert processing rules, for example, to suppress notifications during planned maintenance.  

## How to subscribe to Azure Key Vault system events

Azure Key Vault can emit events to a system topic when a certificate, key, or secret is about to expire (30 days heads up), and other events when they do expire. For more information, see ([Azure Key Vault event schema](event-schema-key-vault.md)). You can set up alerts on these events so you can fix expiration issues before your services are affected.

### Prerequisites

Create a Key Vault resource by following instructions from [Create a key vault using the Azure portal](../key-vault/general/quick-create-portal.md).

### Create and configure the event subscription

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

### Manage fired alerts

You can manage the subscription directly in the source (e.g. Key Vault resource) by selecting the **Events** blade or by accessing to the **Event Grid system topic** resource, see the following references: [blob event quickstart](blob-event-quickstart-portal.md#subscribe-to-the-blob-storage), and [manage the system topic](create-view-manage-system-topics.md).

### Fire alert instances

Now, Key Vault events will appear as alerts and you can view them in alerts blade. See this article to learn how to
[manage alert instances](../azure-monitor/alerts/alerts-manage-alert-instances.md).

## Next steps

See the following articles:

- [Azure Monitor alerts](../azure-monitor/alerts/alerts-overview.md)
- [Manage Azure Monitor alert rules](../azure-monitor/alerts/alerts-manage-alert-rules.md)
- [Pull delivery overview](pull-delivery-overview.md)
- [Push delivery overview](push-delivery-overview.md)
- [Concepts](concepts.md)
- Quickstart: [Publish and subscribe to app events using namespace topics](publish-events-using-namespace-topics.md)
