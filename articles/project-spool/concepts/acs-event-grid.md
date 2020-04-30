---
title: ACS As An Event Grid Source
description: TODO
author: mikben    
manager: jken
services: azure-project-spool

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-project-spool

---

# ACS As An Event Grid Source

This article provides the properties and schema for Azure Communication Services events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md). 

## Event Grid event schema

### Available event types

Azure Communication Services emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.CommunicationServices.SMSReceived | Published when an SMS is received by a phone number associated with the Communcation Service. |
| Microsoft.CommunicationServices.SMSDeliveryReport | Published when a delivery report is received for an SMS seny by the Communication Service. |

TODO Add more

### The contents of an event response

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoint.

This section contains an example of what that data would look like for each event emitted by Azure Communication Services.

### Microsoft.CommunicationServices.SMSReceived event

```json
[{
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{group-name}/Microsoft.CommunicationServices/{service-name}",
  "subject": "/phone_number/555-555-5555",
  "eventType": "Microsoft.Storage.SMSReceived",
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

## Tutorials and how-tos
|Title  |Description  |
|---------|---------|
| [Send email notifications about in response to SMS message using Logic Apps](todo.md) | A logic app sends a notification email every time an SMS is received by your Communication Service. |
| [React to Communication Services events by using Event Grid to trigger actions](todo.md) | Overview of integrating Azure Communication Services with Event Grid. |

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](https://docs.microsoft.com/en-us/azure/event-grid/overview)
* To learn about how Communication Services and Event Grid work together, see [React to IoT Hub events by using Event Grid to trigger actions](todo.md).

