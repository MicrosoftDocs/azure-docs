---
title: Event Handling 
description: Use Azure Event Grid to trigger processes based on actions that happen in a Communication Service.
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

--- 

# Reacting to Communication Services events 

Azure Communication Services allow applications to react to events such as SMSReceived, InstantMessageReceived and allow the you to integrate with Azure Event Grid so that you can send event notifications to other services and trigger downstream processes. You can configure your business applications to listen for Communication Services events so that you can react to critical events in a reliable, scalable, and secure manner. For example, build an application that updates a database, creates a work ticket, and delivers an email notification every time an SMS is delivered to your Communication Service.

All Communication Services events are pushed using [Azure Event Grid](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/overview.md) to subscribers such as Azure Functions, Azure Logic Apps, or even to your own http listener. Event Grid provides reliable event delivery to your applications through rich retry policies and dead-lettering. Event Grid has built-in support for Azure services like [Azure Functions](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/azure-functions/functions-overview.md) and [Azure Logic Apps](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/logic-apps/logic-apps-what-are-logic-apps.md), and can deliver event alerts to non-Azure services using webhooks. For a complete list of the event handlers that Event Grid supports, see [An introduction to Azure Event Grid](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/overview.md).

## The event model
Event Grid uses event subscriptions to route event messages to subscribers. This image illustrates the relationship between event publishers, event subscriptions, and event handlers.

![Azure Event Grid architecture](https://github.com/MicrosoftDocs/azure-docs/raw/master/articles/iot-hub/media/iot-hub-event-grid/event-grid-functional-model.png)

First, subscribe an endpoint to listen to event. Then, when an event is triggered, the Event Grid service will send data about that event to the endpoint.

## Regional availability

The Event Grid integration is available for Azure Communication services located in the regions where Event Grid is supported. For the latest list of regions, see [An introduction to Azure Event Grid](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/overview.md).

## Event Grid event schema

This article provides the properties and schema for Azure Communication Services events. For an introduction to event schemas, see [Azure Event Grid event schema](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/event-grid/event-schema.md).

### Available event types

Azure Communication Services emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Communication.SMSReceived | Published when an SMS is received by a phone number associated with the Communication Service. |
| Microsoft.Communication.SMSDeliveryReportReceived | Published when a delivery report is received for an SMS sent by the Communication Service. |
| Microsoft.Communication.InstantMessageReceived | Published when a chat instant messaged is received by a Communication Services user. |
| Microsoft.Communication.InstantMessageEdited | Published when a chat instant messaged is edited by a Communication Services user. |
| Microsoft.CommunicationServices.InstantMessageDeleted | Published when a chat instant messaged is deleted by a Communication Services user. |

Use either the Azure portal or Azure CLI to configure which events to publish from each Communication Service. For an example, try the [tutorial Send email notifications about SMS Events events using Logic Apps](https://docs.microsoft.com/en-us/azure/event-grid/publish-iot-hub-events-to-logic-apps).

## Filtering events

When an event is triggered, the Event Grid service sends the data about that event to subscribing endpoints. Communication Services events contain the information you need to respond to events in your service. You can identify an Communication Services event by checking that the eventType property starts with Microsoft.Communication. For more information about how to use Event Grid event properties, see the Event Grid event schema.

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

## Event Schema



### Microsoft.Communication.SMSReceived event

The following example shows the schema of an SMS arrived event:

```json
[{
    "id":"6a49a9bf-418f-44b6-81e7-e503686b4a74",
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{Acs-resource-name}",
    "subject":"SMS Event Test",
    "data":
    {
        "from":"+19991234567",
        "to":"+14259991234",
        "messageId":"917c9ec0-a50a-4515-a626-16825d8318e1",
        "message":"SMS Message",
        "receivedTimestamp":"2020-07-16T22:10:00.048727Z"
    },
        "eventType":"Microsoft.Communication.SMSReceived",
        "dataVersion":"1.0",
        "metadataVersion":"1",
        "eventTime":"2020-07-16T22:10:00.0490828Z"
}]
```
### Microsoft.Communication.SMSDeliveryReportReceived event

The following example shows the schema of an SMS deliver report event:

```json
[{
    "id":"9b1768b4-1c90-4766-9491-c75a4592b34e",
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{Acs-resource-name}",
    "subject":"SMS Event Test",
    "data":{
        "messageId":"1021620f-7174-4ef7-b9b8-f55cd3a945b1",
        "from":"+19991234567",
        "to":"+14259991234",
        "deliveryStatus":"Success",
        "deliveryStatusDetails":"Message sent successfully",
        "deliveryAttempts":[
            {
            "timestamp":"2020-07-16T22:10:22.224789Z",
            "segmentsSucceeded":1,
            "segmentsFailed":2
            },
            {
                "timestamp":"2020-07-16T22:10:22.2250078Z",
                "segmentsSucceeded":1,
                "segmentsFailed":0
            }
        ]
    },
    "eventType":"Microsoft.Communication.SMSDeliveryReportReceived",
    "dataVersion":"1.0",
    "metadataVersion":"1",
    "eventTime":"2020-07-16T22:10:22.2250704Z"
}]
```
### Microsoft.Communication.InstantMessageReceived event

The following example shows the schema of a chat instant message received event:

```json
[{
    "id":"c89b02d1-f78d-430d-8db2-8e4de1876d4c",
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{Acs-resource-name}",
    "subject":"IM Event Test",
    "data":{
        "messageBody":"Instant Message Received",
        "senderId":"testSenderId",
        "senderDisplayName":"TestClient",
        "recipientId":"testRecipientId",
        "transactionId":"transaction id",
        "groupId":"test group",
        "collapseId":"collapseId",
        "messageId":"08ecddc3-d441-4fec-a347-24780cc731e1",
        "messageType":"MIME"
    },
    "eventType":"Microsoft.Communication.InstantMessageReceived",
    "dataVersion":"1.0",
    "metadataVersion":"1",
    "eventTime":"2020-07-16T22:10:43.09717Z"
}]
```
### Microsoft.Communication.InstantMessageEdited event

The following example shows the schema of a chat instant message edited event:

```json
[{
    "id":"961d310d-75ec-4bfd-a021-367a0d104ed1",
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{Acs-resource-name}",
    "subject":"IM Event Test",
    "data":{
        "messageBody":"Instant Message Edited",
        "version":"1.0",
        "ComposeTime":"2020-07-16T22:11:04.0172485Z",
        "editTime":"2020-07-16T22:11:04.017254Z",
        "senderId":"testSenderId",
        "senderDisplayName":"TestClient",
        "recipientId":"testRecipientId",
        "transactionId":"transaction id",
        "groupId":"test group",
        "collapseId":"collapseId",
        "messageId":"3a6f523c-bb65-49ee-a4fb-4a125b653a0f",
        "messageType":"MIME"
    },
    "eventType":"Microsoft.Communication.InstantMessageEdited",
    "dataVersion":"1.0",
    "metadataVersion":"1",
    "eventTime":"2020-07-16T22:11:04.0172575Z"
}]
```

### Microsoft.Communication.InstantMessageDeleted event

The following example shows the schema of a chat instant message deleted event:

```json
[{
    "id":"4cedf460-a578-4e49-870c-2323a4e98ed9",
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{Acs-resource-name}",
    "subject":"IM Event Test",
    "data":
    {
        "messageBody":"Instant Message Deleted",
        "version":"1.0",
        "ComposeTime":"2020-07-16T22:11:25.3945866Z",
        "deleteTime":"2020-07-16T22:11:25.3947649Z",
        "senderId":"testSenderId",
        "senderDisplayName":"TestClient",
        "recipientId":"testRecipientId",
        "transactionId":"transaction id",
        "groupId":"test group",
        "collapseId":"collapseId",
        "messageId":"ebe7ab09-c741-42fb-946f-447f9d3adb3b",
        "messageType":"MIME"
    },
    "eventType":"Microsoft.Communication.InstantMessageDeleted",
    "dataVersion":"1.0","metadataVersion":"1",
    "eventTime":"2020-07-16T22:11:25.3948833Z"
}]
```

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [Send email notifications about in response to SMS message using Logic Apps](todo.md) | A logic app sends a notification email every time an SMS is received by your Communication Service. |
| [React to Communication Services events by using Event Grid to trigger actions](todo.md) | Overview of integrating Azure Communication Services with Event Grid. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](https://docs.microsoft.com/en-us/azure/event-grid/overview)
* To learn about how Communication Services and Event Grid work together, see [React to Communication Services events by using Event Grid to trigger actions](todo.md).

