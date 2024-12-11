---
title: Send WhatsApp Template Messages
titleSuffix: An Azure Communication Services Advanced Messaging concept
description: In this concept, you learn the various ways to send WhatsApp template messages with Advanced Messaging.
author: Shamkh
manager: camilo.ramirez
services: azure-communication-services
ms.author: shamkh
ms.date: 02/29/2024
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: advanced-messaging
---

# Quickstart: Send WhatsApp Template messages using Advanced Messages

This document provides guidance to send WhatsApp Template messages using Advanced Communication Messages SDK.   

## Create and manage WhatsApp template message

WhatsApp message templates are specific message formats that businesses use to send out notifications or customer care messages to people that have opted in to notifications. Messages can include appointment reminders, shipping information, issue resolution or payment updates.

For further WhatsApp requirements on templates, refer to the WhatsApp Business Platform API references:
- [Create and Manage Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/)
- [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components)
- [Sending Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)
- Businesses must also adhere to [opt-in requirements](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) before sending messages to WhatsApp users

## List WhatsApp templates in Azure Portal

You can view your templates in the Azure portal by going to your Azure Communication Service resource > Advanced Messaging -> Templates.

:::image type="content" source="./media/template-messages/list-templates-azure-portal.png" lightbox="./media/template-messages/list-templates-azure-portal.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Templates' tab.":::

By selecting a template, you can view the template details.   
The `content` field of the template details may include parameter bindings. The parameter bindings can be denoted as:
- A "format" field with a value such as `IMAGE`.
- Double brackets surrounding a number, such as `{{1}}`. The number, indexed started at 1, indicates the order in which the binding values must be supplied to create the message template.

:::image type="content" source="./media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" lightbox="./media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" alt-text="Screenshot that shows template details.":::

Alternatively, you can view and edit all of your WhatsApp Business Account's templates in the [WhatsApp Manager](https://business.facebook.com/wa/manage/home/) > Account tools > [Message templates](https://business.facebook.com/wa/manage/message-templates/). 

To list out your templates programmatically, you can fetch all templates for your channel ID:

[!INCLUDE [List templates with .NET](./includes/templates/template-messages-list-templates-net.md)]

## Types of WhatsApp Templates

[!INCLUDE [Template usage quick reference with .NET](./includes/templates/template-messages-quick-reference-net.md)]

## Full code example

[!INCLUDE [Full code example with .NET](./includes/templates/template-messages-full-code-example-net.md)]

## More Examples

These examples utilize sample templates available to WhatsApp Business Accounts created through the Azure portal embedded signup.

[!INCLUDE [Template examples with .NET](./includes/templates/template-messages-examples-net.md)]

## Next steps

-   [Do more with Advanced Messages SDK](../../../quickstarts/advanced-messaging/whatsapp/get-started.md)
