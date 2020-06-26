---
title: ACS As An Event Grid Source
description: Use Azure Event Grid to trigger processes based on actions that happen in a Communication Service.
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

--- 

# React to Communication Services events by using Event Grid to trigger actions

Azure Communication Services integrates with Azure Event Grid so that you can send event notifications to other services and trigger downstream processes. Configure your business applications to listen for Communication Services events so that you can react to critical events in a reliable, scalable, and secure manner. For example, build an application that updates a database, creates a work ticket, and delivers an email notification every time an SMS is delivered to your Communication Service.

[Azure Event Grid](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/overview.md) is a fully managed event routing service that uses a publish-subscribe model. Event Grid has built-in support for Azure services like [Azure Functions](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/azure-functions/functions-overview.md) and [Azure Logic Apps](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/logic-apps/logic-apps-what-are-logic-apps.md), and can deliver event alerts to non-Azure services using webhooks. For a complete list of the event handlers that Event Grid supports, see [An introduction to Azure Event Grid](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/overview.md).

![Azure Event Grid architecture](https://github.com/MicrosoftDocs/azure-docs/raw/master/articles/iot-hub/media/iot-hub-event-grid/event-grid-functional-model.png)

## Regional availability

The Event Grid integration is available for Azure Communication services located in the regions where Event Grid is supported. For the latest list of regions, see [An introduction to Azure Event Grid](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/overview.md).

## Event Grid event schema

This article provides the properties and schema for Azure Communication Services events. For an introduction to event schemas, see [Azure Event Grid event schema](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/event-schema.md).

### Available event types

Azure Communication Services emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.CommunicationServices.SMSReceived | Published when an SMS is received by a phone number associated with the Communcation Service. |
| Microsoft.CommunicationServices.SMSDeliveryReport | Published when a delivery report is received for an SMS sent by the Communication Service. |
| Microsoft.CommunicationServices.ChatReceived | Published when a chat messaged is received by a Communication Services user. |
| Microsoft.CommunicationServices.IncomingCall | Published when a call is received by a Communication Services user. |
| Microsoft.CommunicationServices.CallEnded | Published when a call is terminated by a Communication Services user. |


TODO Add more

Use either the Azure portal or Azure CLI to configure which events to publish from each Communication Service. For an example, try the [tutorial Send email notifications about SMS Events events using Logic Apps](https://docs.microsoft.com/en-us/azure/event-grid/publish-iot-hub-events-to-logic-apps).

## Event Schema

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints. Communication Services events contain all the information you need to respond to events in your service. You can identify an Communication Services event by checking that the eventType property starts with Microsoft.CommunicationServices. For more information about how to use Event Grid event properties, see the Event Grid event schema.

### Event Subjects

The subject field of all Communication Services events identify the user, phone number or entity that is targeted by the event. The events are designed to allow simple [Event Grid Filtering](https://docs.microsoft.com/en-us/azure/event-grid/event-filtering).

|Subject|Communication Service Entity|
|---------|---------|
|`phonenumber/555-555-5555`|PSTN phone number|
|`user/831e1650-001e-001b-66ab-eeb76e069631`|ACS User|
|`space/831e1650-001e-001b-66ab-eeb76e069631`|ACS Space|

The following example shows a filter for all SMS messages and delivery reports sent to all 604 area code phone numbers owned by an ACS resource:

```json
"filter": {
  "includedEventTypes": [
    "Microsoft.Resources.SMSReceived",
    "Microsoft.Resources.SMSDeliveryReport"
  ],
  "subjectBeginsWith": "phonenumber/604",
}
```

### Microsoft.CommunicationServices.SMSReceived event

The following example shows the schema of an SMS arrived event:

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/Microsoft.CommunicationServices/{service-name}",
  "subject": "/phone_number/555-555-5555",
  "eventType": "Microsoft.CommunicationServices.SMSReceived",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "messageId": "831e1650-001e-001b-66ab-eeb76e000000",
    "sender": "555-555-1234",
    "recepient": "555-555-5555",
    "content": "This is a message",
    "receivedTimeStamp": "2020-4-20T17:02:19.6069787Z"
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

The following example shows the schema of an SMS deliver report event:

```json
TODO
```

The following example shows the schema of a chat received event:

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/Microsoft.CommunicationServices/{service-name}",
  "subject": "/user/621e5550-001e-001b-66af-eeb76e000000",
  "eventType": "Microsoft.CommunicationServices.ChatReceived",
  "eventTime": "2017-06-26T18:41:00.9584103Z",
  "id": "831e1650-001e-001b-66ab-eeb76e069631",
  "data": {
    "id": "1f4e632b-ecbd-4bbd-afbb-25b5b9a06643",
    "messageType":"text?",
    "clientMessageId": "a6e761ea-9e50-4704-98dd-54d178e0b853",
    "priority": "Normal",
    "content": "This is a message.",
    "senderDisplayName": "Bob",
    "composedAt": 1588308562 ,
    "arrivedAt": 1588308562 ,
    "composedBy": "b6d7de05-aac0-4138-9c43-4b3e87ca7646",
  },
  "dataVersion": "",
  "metadataVersion": "1"
}]
```

The following example shows the schema of an incoming call event:

```json
TODO
```

The following example shows the schema of a call cancelled event:

```json
TODO
```

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [Send email notifications about in response to SMS message using Logic Apps](todo.md) | A logic app sends a notification email every time an SMS is received by your Communication Service. |
| [React to Communication Services events by using Event Grid to trigger actions](todo.md) | Overview of integrating Azure Communication Services with Event Grid. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](https://docs.microsoft.com/en-us/azure/event-grid/overview)
* To learn about how Communication Services and Event Grid work together, see [React to Communication Services events by using Event Grid to trigger actions](todo.md).

