---
title: How to send Event Grid events to Azure monitor alerts
description: This article describes how Azure Event Grid delivers Azure Key Vault events as Azure Monitor alerts.
ms.topic: conceptual
ms.custom:
  - ignite-2023
  - build-2024
ms.date: 04/25/2024
author: robece
ms.author: robece
---

# How to send events to Azure monitor alerts (Preview)

This article describes how Azure Event Grid delivers Azure Key Vault events as Azure Monitor alerts.

> [!IMPORTANT]
> Azure Monitor alerts as a destination in Event Grid event subscriptions is currently available only for [Azure Key Vault](event-schema-key-vault.md) system events.

## Overview

[Azure Monitor alerts](../azure-monitor/alerts/alerts-overview.md) help you detect and address issues before users notice them by proactively notifying you when Azure Monitor data indicates there might be a problem with your infrastructure or application.

Azure Monitor alerts as a destination in Event Grid event subscriptions allow you to receive notification of critical events via Short Message Service (SMS), email, push notification, and more. You can use the low latency event delivery of Event Grid with the direct notification system of Azure Monitor alerts.

## Azure Monitor alerts

Azure Monitor alerts have three resources: [alert rules](../azure-monitor/alerts/alerts-overview.md), [alert processing rules](../azure-monitor/alerts/alerts-processing-rules.md), and [action groups](../azure-monitor/alerts/action-groups.md). Each of these resources is its own independent resource and can be mixed and matched with each other.

- **Alert rules**: defines a resource scope and conditions on the resources’ telemetry. If conditions are met, it fires an alert.
- **Alert processing rules**: modify the fired alerts as they're being fired. You can use these rules to add or suppress action groups, apply filters, or have the rule processed on a predefined schedule.
- **Action groups**: defines how the user wants to be notified. It’s possible to create alert rules without an action group if the user simply wants to see telemetry condition metrics.

Creating alerts from Event Grid events provides you with the following benefits.

- **Additional actions**: You can connect alerts to action groups with actions that aren't supported by event handlers. For example, sending notifications using email, SMS, voice call, and mobile push notifications.
- **Easier viewing experience of events/alerts**: You can view all alerts on their resources from all alert types in one place, including alerts portal experience, Azure Mobile app experience, Azure Resource Graph queries, etc.
- **Alert processing rules**: You can use alert processing rules, for example, to suppress notifications during planned maintenance.  

## Related content
See the following How-to articles to learn how to handle Azure Key Vault and Health Resources events using Azure Monitor alerts. 

- [Handle Azure Key Vault events using Azure Monitor alerts](handle-key-vault-events-using-azure-monitor-alerts.md)
- [Handle Health Resources events using Azure Monitor alerts](handle-health-resources-events-using-azure-monitor-alerts.md)
