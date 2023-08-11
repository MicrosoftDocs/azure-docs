---
title: Send WhatsApp template messages
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

# Send WhatsApp template messages

This document provides guidance to send WhatsApp Template messages using Advanced Communication Messages SDK.   

## Why do I need to send a template message?

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

A business can only send template messages until the user sends a message to the business. Only then can the business send text or media messages to the user. Once the 24 hour conversation window has expired, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations)

Refer to the guidelines in the [WhatsApp Business Platform API reference](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates) for further requirements on templates.
Businesses must also adhere to [opt-in requirements](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) before sending messages to WhatsApp users.

## Choosing a template

When a WhatsApp Business Account is created through the Azure portal during embedded signup, a set of sample templates may be automatically available for you to try out. See the usage for a few of these sample templates at [Examples](#examples).   

### Create template

To create your own templates, use the Meta WhatsApp Manager. 
Follow the instructions in the Meta Business Help Center at [Create message templates for your WhatsApp Business account](https://www.facebook.com/business/help/2055875911147364?id=2129163877102343).

### List templates

You can view your templates in the Azure portal by going to your Azure Communication Service resource > Templates.

:::image type="content" source="./media/template-messages/list-templates-azure-portal.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Templates' tab.":::

By selecting a template, you can view the template details.   
The `content` field of the template details may include parameter bindings. The parameter bindings can be denoted as:
- A "format" field with a value such as `IMAGE`.
- Double brackets surrounding a number, such as `{{1}}`. The number, indexed started at 1, indicates the order in which the binding values must be supplied to create the message template.

:::image type="content" source="./media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" alt-text="Screenshot that shows template details.":::

Alternatively, you can view and edit all of your WhatsApp Business Account's templates in the [WhatsApp Manager](https://business.facebook.com/wa/manage/home/) > Account tools > [Message templates](https://business.facebook.com/wa/manage/message-templates/). 

To list out your templates programmatically, you can fetch all templates for your channel ID:

[!INCLUDE [List templates with .NET](./includes/template-messages-list-templates-net.md)]

## Examples

These examples utilize sample templates available to WhatsApp Business Accounts created through the Azure portal embedded signup.

[!INCLUDE [Template Examples with .NET](./includes/template-messages-examples-net.md)]

## Full code example

[!INCLUDE [Full Code Example with .NET](./includes/template-messages-full-code-example-net.md)]

## Next steps

-   [Get Started With Advanced Communication Messages SDK](../../../quickstarts/advanced-messaging/whatsapp/get-started.md)
