---
title: Reacting to Azure Key Vault events | Microsoft Docs
description: Use Azure Event Grid to subscribe to Key Vault events
services: media-services
documentationcenter: ''
author: msmbaldwin
manager: rkarlin
editor: ''

ms.service: key-vault
ms.workload: 
ms.topic: article
ms.date: 09/18/2019
ms.author: mbaldwin
---
 
# Monitoring Key Vault with Azure Event Grid (preview)

Key Vault integration with Event Grid is currently in preview. It allows users to be notified when the status of a secret stored in key vault has changed. A status change is defined as a secret that is about to expire (within 30 days of expiration), a secret that has expired, or a secret that has a new version available. Notifications for all three secret types (key, certificate, and secret) are supported.

Applications can react to these events using modern serverless architectures, without the need for complicated code or expensive and inefficient polling services. Instead, events are pushed through [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to event handlers such as [Azure Functions](https://azure.microsoft.com/services/functions/), [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/), or even to your own Webhook, and you only pay for what you use. For information about pricing, see [Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/).

## Key Vault events and schemas

Event grid uses [event subscriptions](../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. Key Vault events contain all the information you need to respond to changes in your data. You can identify a Key Vault event because the eventType property starts with "Microsoft.KeyVault".

For more information, see the [Key Vault event schema](../event-grid/event-schema-key-vault.md).

> [!NOTE]
> Events are triggered only for secrets versions (all three types) created after subscription is set
> For existing secrets generating new versions is required

## Practices for consuming events

Applications that handle Key Vault events should follow a few recommended practices:

* As multiple subscriptions can be configured to route events to the same event handler, it is important not to assume events are from a particular source, but to check the topic of the message to ensure that it comes from the key vault you are expecting.
* Similarly, check that the eventType is one you are prepared to process, and do not assume that all events you receive will be the types you expect.
* Ignore fields you don’t understand.  This practice will help keep you resilient to new features that might be added in the future.
* Use the "subject" prefix and suffix matches to limit events to a particular event.

## Next steps

* [Tutorial: Enable Key Vault monitoring with Azure Event Grid](event-grid-tutorial.md)
* [Azure Event Grid schema for Azure Key Vault](../event-grid/event-schema-key-vault.md)
