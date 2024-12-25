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
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
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

## Types of WhatsApp Templates Supported

| Template Type   | Description |
|----------|---------------------------|
| Text-based message templates  | WhatsApp message templates are specific message formats with or without parameters.    |
| Media-based message templates    | WhatsApp message templates with media parameters for header components.   |
| Interactive message templates | Interactive message templates expand the content you can send recipients, by  including interactive buttons using the components object. Both Call-to-Action and Quick Reply are supported.|
| Location-based message templates |  WhatsApp message templates with location parameters in terms Longitute and Lantitude for header components.|


## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Python.

| Name                        | Description                                                                                            |
|-----------------------------|--------------------------------------------------------------------------------------------------------|
| NotificationMessagesClient  | This class connects to your Azure Communication Services resource. It sends the messages.              |
| MessageTemplate             | This class defines which template you use and the content of the template properties for your message. |
| TemplateNotificationContent | This class defines the "who" and the "what" of the template message you intend to send.                |

> [!NOTE]
> Please find the SDK reference [here](/python/api/azure-communication-messages/azure.communication.messages).

## Common configuration
Follow these steps to add the necessary code snippets to the messages-quickstart.py python program.

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)

[!INCLUDE [Common setting for using Advanced Messages SDK](./includes/common-setting.md)]

##  Code examples
Follow these steps to add the necessary code snippets to the messages-quickstart.py python program.
- [Send Template message with no parameters](#send-template-message-with-no-parameters)
- [Send Template message with text parameters in the body](#send-template-message-with-text-parameters-in-the-body)
- [Send Template message with media parameter in the header](#send-template-message-with-media-parameter-in-the-header)
- [Send Template message with location in the header](#send-template-message-with-location-in-the-header)
- [Send Template message with quick reply buttons](#send-template-message-with-quick-reply-buttons)
- [Send Template message with call to action buttons](#send-template-message-with-call-to-action-buttons)

::: zone pivot="programming-language-csharp"
[!INCLUDE [Template usage quick reference with .NET](./includes/templates/template-messages-quick-reference-net.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Send WhatsApp Messages with Java](./includes/templates/messages-quickstart-template-messages-java.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Send WhatsApp Messages JavaScript SDK](./includes/templates/messages-quickstart-template-messages-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Send WhatsApp Messages Python SDK](./includes/templates/messages-quickstart-template-messages-python.md)]
::: zone-end

## Next steps

-   [Do more with Advanced Messages SDK](../../../quickstarts/advanced-messaging/whatsapp/get-started.md)
