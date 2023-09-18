---
title: Azure Communication Services as an Event Grid source - Overview
description: This article describes how to use Azure Communication Services as an Event Grid event source.
ms.topic: conceptual
ms.date: 06/11/2021
ms.author: mikben
---

# Event Handling in Azure Communication Services

Azure Communication Services integrates with [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to deliver real-time event notifications in a reliable, scalable and secure manner. The purpose of this article is to help you configure your applications to listen to Communication Services events. For example, you may want to update a database, create a work item and deliver a push notification whenever an SMS message is received by a phone number associated with your Communication Services resource.

Azure Event Grid is a fully managed event routing service, which uses a publish-subscribe model. Event Grid has built-in support for Azure services like [Azure Functions](../azure-functions/functions-overview.md) and [Azure Logic Apps](../azure-functions/functions-overview.md). It can deliver event alerts to non-Azure services using webhooks. For a complete list of the event handlers that Event Grid supports, see [An introduction to Azure Event Grid](overview.md).

:::image type="content" source="./media/overview/functional-model.png" alt-text="Diagram showing Azure Event Grid's event model.":::

> [!NOTE]
> To learn more about how data residency relates to event handling, visit the [Data Residency conceptual documentation](../communication-services/concepts/privacy.md)

## Events types

Event grid uses [event subscriptions](concepts.md#event-subscriptions) to route event messages to subscribers.

Azure Communication Services emits the following event types:

* [Chat Events](./communication-services-chat-events.md)
* [Telephony and SMS Events](./communication-services-telephony-sms-events.md)
* [Voice and Video Calling Events](./communication-services-voice-video-events.md)
* [Presence Events](./communication-services-presence-events.md)
* [Email Events](./communication-services-email-events.md)
* [Job Router Events](./communication-services-router-events.md)

You can use the Azure portal or Azure CLI to subscribe to events emitted by your Communication Services resource. 

## Event subjects

The `subject` field of all Communication Services events identifies the user, phone number or entity that is targeted by the event. Common prefixes are used to allow simple [Event Grid Filtering](event-filtering.md).

| Subject Prefix                              | Communication Service Entity |
| ------------------------------------------- | ---------------------------- |
| `phonenumber/`                              | PSTN phone number            |
| `user/`                                     | Communication Services User  |
| `thread/`                                   | Chat thread.                 |

The following example shows a filter for all SMS messages and delivery reports sent to all 555 area code phone numbers owned by a Communication Services resource:

```json
"filter": {
  "includedEventTypes": [
    "Microsoft.Communication.SMSReceived",
    "Microsoft.Communication.SMSDeliveryReportReceived"
  ],
  "subjectBeginsWith": "phonenumber/1555",
}
```

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](./overview.md)
* For an introduction to Azure Event Grid Concepts, see [Concepts in Event Grid?](./concepts.md)
* For an introduction to Azure Event Grid SystemTopics, see [System topics in Azure Event Grid?](./system-topics.md)
