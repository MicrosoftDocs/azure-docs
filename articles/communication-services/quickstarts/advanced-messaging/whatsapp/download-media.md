---
title: Download WhatsApp message media
titleSuffix: An Azure Communication Services Messages quickstart
description: In this quickstart, you learn how to download the media received in a WhatsApp message with Azure Communication Services Messages.
author: Shamkh
manager: camilo.ramirez
services: azure-communication-services
ms.author: shamkh
ms.date: 07/24/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: advanced-messaging
---

# Quickstart: Download WhatsApp message media

Azure Communication Services enables you to send and receive WhatsApp messages. In this quickstart, you learn how to download the media payload received in a WhatsApp message. 

Use case: A business receives a WhatsApp message from their customer that contains an image. The business needs to download the image from WhatsApp in order to view the image.

Incoming messages to the business are published as [Microsoft.Communication.AdvancedMessageReceived](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event) Event Grid events. This quickstart uses the media ID and media MIME type in the AdvancedMessageReceived event to download the media payload.

Here's an example of an AdvancedMessageReceived event with media content:
```json
[{
  "id": "00000000-0000-0000-0000-000000000000",
  "topic": "/subscriptions/{subscription-id}/resourcegroups/{resourcegroup-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
  "subject": "advancedMessage/sender/{sender@id}/recipient/11111111-1111-1111-1111-111111111111",
  "data": {
    "channelType": "whatsapp",
    "media": {
      "mimeType": "image/jpeg",
      "id": "22222222-2222-2222-2222-222222222222"
    },
    "from": "{sender@id}",
    "to": "11111111-1111-1111-1111-111111111111",
    "receivedTimestamp": "2023-07-06T18:30:19+00:00"
  },
  "eventType": "Microsoft.Communication.AdvancedMessageReceived",
  "dataVersion": "1.0",
  "metadataVersion": "1",
  "eventTime": "2023-07-06T18:30:22.1921716Z"
}]
```

[!INCLUDE [Download WhatsApp media messages with .NET](./includes/download-media/download-media-net.md)]

## Next steps

In this quickstart, you tried out the Advanced Messaging for WhatsApp SDK. Next you might also want to see the following articles:

- [Send WhatsApp Messages using Advanced Messages](../../../quickstarts/advanced-messaging/whatsapp/get-started.md)
- [Handle Advanced Messaging Events](./handle-advanced-messaging-events.md)
- [Send WhatsApp Template Messages](../../../concepts/advanced-messaging/whatsapp/template-messages.md)
