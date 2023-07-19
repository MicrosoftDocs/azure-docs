---
title: Send WhatsApp Template Messages
titleSuffix: An Azure Communication Services Advanced Messaging concept
description: In this concept, you learn the various ways to send WhatsApp template messages with Advanced Messaging.
author: memontic-ms
manager: camilo.ramirez
services: azure-communication-services

ms.author: memontic
ms.date: 07/12/2023
ms.topic: conceptual
ms.service: azure-communication-services
---

# Send WhatsApp Template Messages

This document goes over general information about WhatsApp template messages and the syntax to send varies messages templates.   

## Why do I need to send a template message?

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

A business can only send template messages until the user sends a message to the business. Only then can the business send text or media messages to the user. Once the 24 hour conversation window has expired, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations)

Refer to the guidelines in the [WhatsApp Business Platform API reference](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates) for further requirements on templates.
Businesses must also adhere to [opt-in requirements](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) before sending messages to WhatsApp users.

## Choosing a template

When a WhatsApp business account is created, a default template may be automatically available for you to try out. See the example [Use (default) template sample_template](#use-default-template-sample_template).   

To create your own templates, use the Meta WhatsApp Manager. 
Follow the instructions in the Meta Business Help Center at [Create message templates for your WhatsApp Business account](https://www.facebook.com/business/help/2055875911147364?id=2129163877102343).

### List templates

You can view your templates in the [WhatsApp Manager](https://business.facebook.com/wa/manage/home/) > Account tools > [Message templates](https://business.facebook.com/wa/manage/message-templates/). 

You can also view your templates by listing all templates for your channelID:

[!INCLUDE [List templates with .NET](./includes/template-messages-list-templates-net.md)]

## Examples

[!INCLUDE [Template examples with .NET](./includes/template-messages-examples-net.md)]

