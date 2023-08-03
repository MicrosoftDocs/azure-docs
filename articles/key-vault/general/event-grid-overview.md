---
title: Monitoring Key Vault with Azure Event Grid
description: Use Azure Event Grid to subscribe to Key Vault events
services: key-vault
author: msmbaldwin

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 01/11/2023
ms.author: mbaldwin
---
 
# Monitoring Key Vault with Azure Event Grid

Key Vault integration with Event Grid allows users to be notified when the status of a secret stored in key vault has changed. A status change is defined as a secret that is about to expire (30 days before expiration), a secret that has expired, or a secret that has a new version available. Notifications for all three secret types (key, certificate, and secret) are supported.

Applications can react to these events using modern serverless architectures, without the need for complicated code or expensive and inefficient polling services. Events are pushed through [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to event handlers such as [Azure Functions](https://azure.microsoft.com/services/functions/), [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/), or even to your own Webhook, and you only pay for what you use. For information about pricing, see [Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/).

## Key Vault events and schemas

Event Grid uses [event subscriptions](../../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers. Key Vault events contain all the information you need to respond to changes in your data. You can identify a Key Vault event because the eventType property starts with "Microsoft.KeyVault".

For more information, see the [Key Vault event schema](../../event-grid/event-schema-key-vault.md).

> [!WARNING]
> Notification events are triggered only on new versions of secrets, keys and certificates, and you must first subscribe to the event on your key vault in order to receive these notifications.

## Practices for consuming events

Applications that handle Key Vault events should follow a few recommended practices:

* Multiple subscriptions can be configured to route events to the same event handler. It's important not to assume events are from a particular source, but to check the topic of the message to ensure that it comes from the key vault you're expecting.
* Similarly, check that the eventType is one you're prepared to process, and do not assume that all events you receive will be the types you expect.
* Ignore fields you don't understand.  This practice will help keep you resilient to new features that might be added in the future.
* Use the "subject" prefix and suffix matches to limit events to a particular event.

## Next steps

- [Azure Key Vault overview](overview.md)
- [Azure Event Grid overview](../../event-grid/overview.md)
- How to: [Route Key Vault Events to Automation Runbook](event-grid-tutorial.md).
- How to: [Receive email when a key vault secret changes](event-grid-logicapps.md)
- [Azure Event Grid event schema for Azure Key Vault](../../event-grid/event-schema-key-vault.md)
- [Azure Automation overview](../../automation/index.yml)
