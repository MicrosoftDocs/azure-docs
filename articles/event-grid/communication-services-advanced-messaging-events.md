---
title: Azure Communication Services - Advanced Messaging events
description: This article describes how to use Azure Communication Services as an Event Grid event source for Advanced Messaging Events.
ms.topic: conceptual
ms.date: 09/30/2022
author: shamkh
ms.author: shamkh
---

# Azure Communication Services - Advanced Messaging events

This article provides the properties and schema for communication services advanced messaging events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Event types

Azure Communication Services emits the following Advanced Messaging event types:

| Event type                                                  | Description                                                                                    |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Microsoft.Communication.AdvancedMessageReceived                      | Published when Communication Service receives a WhatsApp message. |
| Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated             |    Published when the WhatsApp sends status of message notification as sent/read/failed.  |

## Event responses

When an event is triggered, the Event Grid service sends data about that event to subscribing endpoints.

This section contains an example of what that data would look like for each event.

### Microsoft.Communication.AdvancedMessageReceived  event

```json
[{
  "id": "fdc64eca-390d-4974-abd6-1a13ccbe3160",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/acsxplatmsg-test",
  "subject": "advancedMessage/sender/{sender@id}/recipient/00000000-0000-0000-0000-000000000000",
  "data": {
    "content": "Hello",
    "channelType": "whatsapp",
    "from": "{sender@id}",
    "to": "00000000-0000-0000-0000-000000000000",
    "receivedTimestamp": "2023-07-06T18:30:19+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:30:22.1921716Z"
}]
```

### Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated  event

```json
[{
  "id": "48cd6446-01dd-479f-939c-171c86c46700",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/acsxplatmsg-test",
  "subject": "advancedMessage/00000000-0000-0000-0000-000000000000/status/Failed",
  "data": {
    "messageId": "00000000-0000-0000-0000-000000000000",
    "status": "Sent",
    "channelType": "whatsapp",
    "from": "{sender@id}",
    "to": "{receiver@id}",
    "receivedTimestamp": "2023-07-06T18:42:28+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:42:28.8454662Z"
}]
```

```json
[{
  "id": "48cd6446-01dd-479f-939c-171c86c46700",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/acsxplatmsg-test",
  "subject": "advancedMessage/00000000-0000-0000-0000-000000000000/status/Failed",
  "data": {
    "messageId": "00000000-0000-0000-0000-000000000000",
    "status": "Failed",
    "channelType": "whatsapp",
    "from": "{sender@id}",
    "to": "{receiver@id}",
    "receivedTimestamp": "2023-07-06T18:42:28+00:00",
    "error": {
      "channelCode": "131026",
      "channelMessage": "Message Undeliverable."
    }
  },
  "eventType": "Microsoft.Communication.AdvancedMessageDeliveryStatusUpdated",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:42:28.8454662Z"
}]
```

> [!NOTE]
> Possible values for `Status` are `Sent`, `Delivered`, `Read` and `Failed`.


## Quickstart
For a quickstart that shows how to subscribe for Advanced Messaging events using web hooks, see [Quickstart: Handle Advanced Messaging events](../communication-services/quickstarts/advanced-messaging/whatsapp/handle-advanced-messaging-events.md). 
