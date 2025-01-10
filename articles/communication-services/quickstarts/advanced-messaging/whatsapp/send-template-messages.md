---
title: Send WhatsApp Template Messages
titleSuffix: An Azure Communication Services Advanced Messaging concept
description: In this concept, you learn the various ways to send WhatsApp template messages with Advanced Messaging.
author: Shamkh
manager: camilo.ramirez
services: azure-communication-services
ms.author: shamkh
ms.date: 01/15/2025
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---

# Quickstart: Send WhatsApp Template messages using Advanced Messages

This document provides guidance to send WhatsApp Template messages using Advanced Communication Messages SDK.   

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](./connect-whatsapp-business-account.md).
- [Create WhatsApp template](#create-and-manage-whatsapp-template-message).
- Active WhatsApp phone number to receive messages.

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Python.

| Name                        | Description                                                                                            |
|-----------------------------|--------------------------------------------------------------------------------------------------------|
| NotificationMessagesClient  | This class connects to your Azure Communication Services resource. It sends the messages.              |
| MessageTemplate             | This class defines which template you use and the content of the template properties for your message. |
| TemplateNotificationContent | This class defines the "who" and the "what" of the template message you intend to send.                |

> [!NOTE]
> Please find the SDK reference [here](/python/api/azure-communication-messages/azure.communication.messages).

### Types of WhatsApp Templates Supported

| Template Type   | Description |
|----------|---------------------------|
| Text-based message templates  | WhatsApp message templates are specific message formats with or without parameters.    |
| Media-based message templates    | WhatsApp message templates with media parameters for header components.   |
| Interactive message templates | Interactive message templates expand the content you can send recipients, by  including interactive buttons using the components object. Both Call-to-Action and Quick Reply are supported.|
| Location-based message templates |  WhatsApp message templates with location parameters in terms Longitute and Lantitude for header components.|

## Common configuration
Follow these steps to add the necessary code snippets to the messages-quickstart.py python program.
- [Create and manage WhatsApp template message](#create-and-manage-whatsapp-template-message)
- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)

### Create and manage WhatsApp template message

WhatsApp message templates are specific message formats that businesses use to send out notifications or customer care messages to people that have opted in to notifications. Messages can include appointment reminders, shipping information, issue resolution or payment updates. **Before start using Advanced messaging SDK to send templated messages, user needs to create required templates in the WhatsApp Business Platform**.

For further WhatsApp requirements on templates, refer to the WhatsApp Business Platform API references:
- [Create and Manage Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/)
- [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components)
- [Sending Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)
- Businesses must also adhere to [opt-in requirements](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) before sending messages to WhatsApp users

[!INCLUDE [Common setting for using Advanced Messages SDK](./includes/common-setting.md)]

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
