---
title: Download WhatsApp message media
titleSuffix: An Azure Communication Services Messages article
description: In this quickstart, you learn how to download the media received in a WhatsApp message with Azure Communication Services Messages.
author: Shamkh
manager: camilo.ramirez
services: azure-communication-services
ms.author: shamkh
ms.date: 05/01/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Download WhatsApp message media

Azure Communication Services enables you to send and receive WhatsApp messages. This article describes how to download the media payload received in a WhatsApp message. 

**Use case:** A business receives a WhatsApp message from their customer that contains an image. The business needs to download the image from WhatsApp in order to view the image.

Incoming messages to the business are published as [Microsoft.Communication.AdvancedMessageReceived](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event) Event Grid events. This example uses the media ID and media MIME type in the `AdvancedMessageReceived` event to download the media payload.

An example of an `AdvancedMessageReceived` event with media content:

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

::: zone pivot="programming-language-csharp"
[!INCLUDE [Download WhatsApp media messages with .NET SDK](./includes/download-media/download-media-net.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Download WhatsApp media messages with Java SDK](./includes/download-media/download-media-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Download WhatsApp media messages with JavaScript SDK](./includes/download-media/download-media-javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Download WhatsApp media messages with Python SDK](./includes/download-media/download-media-python.md)]
::: zone-end

## Next steps

- [More samples](/samples/azure/azure-sdk-for-js/communication-messages-javascript)
- [Send WhatsApp Messages using Advanced Messages](../../../quickstarts/advanced-messaging/whatsapp/get-started.md)
- [Handle Advanced Messaging Events](./handle-advanced-messaging-events.md)
- [Send WhatsApp template messages](../../../quickstarts/advanced-messaging/whatsapp/send-template-messages.md)
