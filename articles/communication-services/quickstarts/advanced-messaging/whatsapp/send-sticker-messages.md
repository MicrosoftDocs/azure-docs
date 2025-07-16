---
title: Send sticker WhatsApp messages
titleSuffix: An Azure Communication Services Advanced Messages article
description: This article describes how to send WhatsApp sticker messages using Azure Communication Services Advanced Messages SDK.
author: shamkh
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

# Send sticker WhatsApp messages using Advanced Messages

Azure Communication Services enables you to send and receive WhatsApp messages. This article describes how to integrate your app with Azure Communication Advanced Messages SDK to start sending and receiving WhatsApp sticker messages. Completing this article incurs a small cost of a few USD cents or less in your Azure account.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Send WhatsApp Messages with .NET](./includes/stickers/messages-quickstart-sticker-messages-net.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Send WhatsApp Messages with Java](./includes/stickers/messages-quickstart-sticker-messages-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Send WhatsApp Messages JavaScript SDK](./includes/stickers/messages-quickstart-sticker-messages-javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Send WhatsApp Messages Python SDK](./includes/stickers/messages-quickstart-sticker-messages-python.md)]
::: zone-end

## Working with WhatsApp Stickers FAQ

### What are supported sticker format and size limits?

| Sticker Type | Extension | MIME Type | Max Size |
|----------------|------------|------------|-----------|
|Animated sticker | .webp | image/webp | 500 KB |
|Static sticker | .webp | image/webp | 100 KB |

### What is Sticker correct dimension to be uploaded?

Sticker dimension should be 512 x 512 pixels.

## Next steps

For more information, see:

- [Handle Advanced Messaging events](./handle-advanced-messaging-events.md).
- [Send WhatsApp template messages](../../../quickstarts/advanced-messaging/whatsapp/send-template-messages.md).
- [Send WhatsApp media messages](../../../quickstarts/advanced-messaging/whatsapp/get-started.md).
