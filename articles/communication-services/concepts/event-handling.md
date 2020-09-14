---
title: Event Handling 
titleSuffix: An Azure Communication Services concept document
description: Use Azure Event Grid to trigger processes based on actions that happen in a Communication Service.
author: mikben
manager: jken
services: azure-communication-services

ms.author: mikben
ms.date: 03/10/2020
ms.topic: overview
ms.service: azure-communication-services
---
# Event Handling in Azure Communication Services

[!INCLUDE [Public Preview Notice](../includes/public-preview-include.md)]

> [!WARNING]
> This document is under construction and needs the following items to be addressed: 
> - Reference content needs to be isolated and moved into Event Grid docs like this -> https://docs.microsoft.com/azure/event-grid/event-schema-blob-storage
> - Needs to be staged into the public preview branch
> - Needs updates screenshots with diagram including ACS
> - Remove regional availability section, feels weird right now

Azure Communication Services allows applications to react to events such `SMSReceived` and `ChatMessageReceived` by sending notifications and triggering workflows when events using [Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview). For example, you may want your application to update a database, create a work item, and deliver an email notification every time an SMS message is sent to a phone number that you've provisioned using Communication Services. Event Grid provides reliable event delivery to your applications through rich retry policies and dead-lettering.

Communication Services events can be emitted to subscribers such as [Azure Functions](https://docs.microsoft.com/azure/azure-functions/functions-overview), [Azure Logic Apps](https://docs.microsoft.com/azure/logic-apps/logic-apps-overview), or even to your own HTTP listener. Event Grid can also deliver event alerts to non-Azure services using webhooks. For a complete list of the event handlers that Event Grid supports, see [An introduction to Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview).

## Event model

Event Grid uses event subscriptions to route event messages to subscribers. This image illustrates the relationship between event publishers, event subscriptions, and event handlers.

<!-- NEEDS TO BE UPDATED TO IMAGE SHOWING ACS ![Diagram showing Azure Event Grid's event model.](https://docs.microsoft.com/azure/event-grid/media/overview/functional-model.png) -->

Event handlers subscribe to events and the, when an event is triggered, the Event Grid service will send data about that event to the handler endpoint.

## Regional availability

Communication Services Event Grid integration is available globally.

> [!WARNING]
> Is this impacted by the fact that Communication Services is being offered as a global service?
>
> Removing this: The Event Grid integration is available for Azure Communication services located in the regions where Event Grid is supported. For the latest list of regions, see [An introduction to Azure Event Grid](https://docs.microsoft.com/azure/event-grid/overview).

## Events types

This article provides the properties and schema for Azure Communication Services events. For an introduction to event schemas, see [Azure Event Grid event schema](https://docs.microsoft.com/azure/event-grid/event-schema).

Azure Communication Services emits the following event types:

| Event type                                                  | Description                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Microsoft.Communication.SMSReceived                         | Published when an SMS is received by a phone number associated with the Communication Service. |
| Microsoft.Communication.SMSDeliveryReportReceived           | Published when a delivery report is received for an SMS sent by the Communication Service.     |
| Microsoft.Communication.ChatMessageReceived                 | Published when a message is received for a user in a chat thread that she is member of.        |
| Microsoft.Communication.ChatMessageEdited                   | Published when a message is edited in a chat thread that the user is member of.                |
| Microsoft.Communication.ChatMessageDeleted                  | Published when a message is deleted in a chat thread that the user is member of.               |
| Microsoft.Communication.ChatThreadCreatedWithUser           | Published when the user is added as member at the time of creation of a chat thread.           |
| Microsoft.Communication.ChatThreadWithUserDeleted           | Published when a chat thread is deleted which the user is member of.                           |
| Microsoft.Communication.ChatThreadPropertiesUpdatedPerUser  | Published when a chat thread's properties are updated that the user is member of.              |
| Microsoft.Communication.ChatMemberAddedToThreadWithUser     | Published when the user is added as member to a chat thread.                                   |
| Microsoft.Communication.ChatMemberRemovedFromThreadWithUser | Published when the user is removed from a chat thread.                                         |

Use either the Azure portal or Azure CLI to configure which events to publish from each Communication Service. Get started with handling events by looking at [How do handle SMS Events in Communication Services](../quickstarts/telephony-sms/handle-sms-events.md)

## Filtering events

When an event is triggered, the Event Grid service sends the data about that event to any subscribing endpoints. Communication Services events contain the information you need to respond to events in your service. You can identify a Communication Services event by checking that the `eventType` property starts with `Microsoft.Communication`. For more information about how to use Event Grid event properties, see the [Azure Event Grid event schema](https://docs.microsoft.com/azure/event-grid/event-schema).

### Event subjects

The `subject` field of all Communication Services events identifies the user, phone number or entity that is targeted by the event. The events are designed to allow simple [Event Grid Filtering](https://docs.microsoft.com/azure/event-grid/event-filtering).

| Subject                                     | Communication Service Entity |
| ------------------------------------------- | ---------------------------- |
| `phonenumber/555-555-5555`                  | PSTN phone number            |
| `user/831e1650-001e-001b-66ab-eeb76e069631` | Communication Services User  |

The following example shows a filter for all SMS messages and delivery reports sent to all 604 area code phone numbers owned by a Communication Services resource:

```json
"filter": {
  "includedEventTypes": [
    "Microsoft.Communication.SMSReceived",
    " Microsoft.Communication.SMSDeliveryReportReceived"
  ],
  "subjectBeginsWith": "phonenumber/604",
}
```

## Sample event responses

### Microsoft.Communication.SMSReceived event

The following example shows the schema of an SMS arrived event:

```json
[{
    "id":"6a49a9bf-418f-44b6-81e7-e503686b4a74",
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
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
    "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
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

### Microsoft.Communication.ChatMessageReceived event
```json
[{
  "id": "bf9c95b1-8f9d-46ce-9363-384b9a99488a",
   "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2/sender/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
  "data": {
    "messageBody": "Come on guys, lets go explore Azure Communication Services.",
    "messageId": "1598995171765",
    "senderId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da",
    "senderDisplayName": "Bob(Admin)",
    "composeTime": "2020-09-01T21:19:31.765Z",
    "type": "Text",
    "version": 1598995171765,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
    "transactionId": "0hEh1z4VsUqNLbMCBWOYAA.1.1.1.1.3166109874.1.2",
    "threadId": "19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-09-01T21:19:31.8343381Z"
}
]
```

### Microsoft.Communication.ChatMessageEdited event
```json
[{
  "id": "137764e1-d1cc-474b-83da-5baea96312aa",
  "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2/sender/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
  "data": {
    "editTime": "2020-09-01T21:25:14.34Z",
    "messageBody": "Let's go for dinner together.",
    "messageId": "1598995443109",
    "senderId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da",
    "senderDisplayName": "Bob(Admin)",
    "composeTime": "2020-09-01T21:24:03.109Z",
    "type": "Text",
    "version": 1598995514340,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
    "transactionId": "kOuVozupKEyirzWebFElTQ.1.1.2.1.3179544590.1.2",
    "threadId": "19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatMessageEdited",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-09-01T21:25:14.4984406Z"
}]
```

### Microsoft.Communication.ChatMessageDeleted event
```json
[{
  "id": "96a2e1e7-eed0-4f3d-8c6d-7e93cafc5f55",
  "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2/sender/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
  "data": {
    "deleteTime": "2020-09-01T21:19:31.765Z",
    "messageId": "1598995171765",
    "senderId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da",
    "senderDisplayName": "Bob(Admin)",
    "composeTime": "2020-09-01T21:19:31.765Z",
    "type": "Text",
    "version": 1598995319667,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
    "transactionId": "0sOR3rGs7EGVlSHjXaMx4A.1.1.2.1.3171942426.1.2",
    "threadId": "19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatMessageDeleted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-09-01T21:21:59.8442061Z"
}]
```

### Microsoft.Communication.ChatThreadCreatedWithUser event 
```json
[{
  "id": "c185a2c8-8788-4f40-83a7-f2d63919765a",
  "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:ddf2dec732b14eac86b48444edf2ce76@thread.v2/createdBy/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_fe0135-9c008910dc/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_230135-9d00bb50dd",
  "data": {
    "createdBy": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_fe0135-9c008910dc",
    "properties": {
      "topic": "Dinner Thread",
    },
    "members": [
      {
        "displayName": "Bob",
        "memberId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_fe0135-9c008910dc"
      },
      {
        "displayName": "John",
        "memberId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_230135-9d00bb50dd"
      }
    ],
    "createTime": "2020-08-29T00:33:19.056Z",
    "version": 1598661199056,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_230135-9d00bb50dd",
    "transactionId": "NUddWfl5gUm97PEJabMoGg.1.1.1.1.3005218817.1.0",
    "threadId": "19:ddf2dec732b14eac86b48444edf2ce76@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatThreadCreatedWithUser",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-08-29T00:33:19.5701786Z"
}]
```

### Microsoft.Communication.ChatThreadWithUserDeleted event
```json
[{
  "id": "18aea9eb-6d87-4545-b6b2-5fb9f5e5a18d",
  "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:ddf2dec732b14eac86b48444edf2ce76@thread.v2/deletedBy/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_fe0135-9c008910dc/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_230135-9d00bb50dd",
  "data": {
    "deletedBy": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_fe0135-9c008910dc",
    "deleteTime": "2020-08-29T00:41:05.2464857Z",
    "createTime": "2020-08-29T00:33:19.056Z",
    "version": 1598661506307,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_230135-9d00bb50dd",
    "transactionId": "LmRWHAGfUkenZyG4lTu+tg.1.1.2.1.3023438077.1.0",
    "threadId": "19:ddf2dec732b14eac86b48444edf2ce76@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatThreadWithUserDeleted",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-08-29T00:41:05.3391087Z"
}]
```

### Microsoft.Communication.ChatThreadPropertiesUpdatedPerUser event 
```json
[{
  "id": "f602b159-e2b2-4a89-9aa8-5e3edd4803e8",
  "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:ddf2dec732b14eac86b48444edf2ce76@thread.v2/editedBy/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_fe0135-9c008910dc/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_230135-9d00bb50dd",
  "data": {
    "editedBy": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_fe0135-9c008910dc",
    "editTime": "2020-08-29T00:38:26.3518623Z",
    "properties": {
      "topic": "Breakfast thread"
    },
    "createTime": "2020-08-29T00:33:19.056Z",
    "version": 1598661506306,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_230135-9d00bb50dd",
    "transactionId": "i0OklCIFBUCVKxMS2KrSwg.1.1.1.1.3017212106.1.0",
    "threadId": "19:ddf2dec732b14eac86b48444edf2ce76@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatThreadPropertiesUpdatedPerUser",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-08-29T00:38:26.4354084Z"
}]
```

### Microsoft.Communication.ChatMemberAddedToThreadWithUser event
```json
[{
  "id": "3ada9422-1501-446d-add6-156fc0e789ee",
  "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2/memberAdded/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
  "data": {
    "time": "2020-08-25T00:37:45.6854529Z",
    "addedBy": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_7e013a-b6009050de",
    "memberAdded": {
      "displayName": "John",
      "memberId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_82013a-97009dd0da"
    },
    "createTime": "2020-08-25T00:37:45.6852914Z",
    "version": 2,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_24013a-9400a2d0da",
    "transactionId": "aOuWozupKEyirzWebFElTQ.1.1.2.1.3179544590.1.2",
    "threadId": "19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatMemberAddedToThreadWithUser",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-08-25T00:37:45.685538Z"
}]
```

### Microsoft.Communication.ChatMemberRemovedFromThreadWithUser event
```json
[{
  "id": "3ada9422-1501-446d-add6-156fc0e789ee",
  "topic":"/subscriptions/{subscription-id}/resourceGroups/{group-name}/providers/Microsoft.Communication/communicationServices/{communication-services-resource-name}",
  "subject": "thread/19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2/memberRemoved/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_3d013a-9900e310df/recipient/8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_55013a-9a00c790df",
  "data": {
    "time": "2020-09-16T00:37:45.6854529Z",
    "removedBy": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_ae013a-ce00d290df",
    "memberRemoved": {
      "displayName": "John",
      "memberId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_3d013a-9900e310df"
    },
    "createTime": "2020-07-29T00:37:45.6852914Z",
    "version": 3,
    "recipientId": "8:spool:d7cf594f-e21d-4c80-bcf1-c7dbeb40e226_55013a-9a00c790df",
    "transactionId": "aOuWozupKEyirzWebFElTQ.1.1.2.1.3179544590.1.2",
    "threadId": "19:2e76d94ee2e445cf922d4a75db9a4d07@thread.v2"
  },
  "eventType": "Microsoft.Communication.ChatMemberRemovedFromThreadWithUser",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2020-08-25T00:37:45.685538Z"
}]
```

## Quickstarts and how-tos
| Title                                                                                                       | Description                                                                   |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [How do handle SMS Events in Communication Services](../quickstarts/telephony-sms/handle-sms-events.md) | Handling all SMS events received by your Communication Service using WebHook. |


## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](https://docs.microsoft.com/azure/event-grid/overview)
* For an introduction to Azure Event Grid Concepts, see [Concepts in Event Grid?](https://docs.microsoft.com/azure/event-grid/concepts)
* For an introduction to Azure Event Grid SystemTopics, see [System topics in Azure Event Grid?](https://docs.microsoft.com/azure/event-grid/system-topics)
