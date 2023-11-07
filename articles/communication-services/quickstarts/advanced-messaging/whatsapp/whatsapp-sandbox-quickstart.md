---
title: Try Advanced Messaging for WhatsApp sandbox
titleSuffix: An Azure Communication Services quickstart document
description: Learn about Communication Service WhatsApp sandbox
author: shamkh
manager: camilo.ramirez
services: azure-communication-services
ms.author: shamkh
ms.date: 06/26/2023
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: Try Advanced Messaging for WhatsApp sandbox

[!INCLUDE [Public Preview Disclaimer](../../../includes/public-preview-include-document.md)]

Getting started to enable Contoso developers to try out the Advanced Messaging for WhatsApp quickly, Advanced Messaging is providing WhatsApp Business Account enabled sandbox. This WhatsApp Sandbox is available on the Azure portal and Contoso developers can play around the Advanced Messaging functionalities including sending template messages and text messages.  

## Prerequisites 

- [Create an Azure Communication Services resource](../../create-communication-resource.md).
- WhatsApp enabled phone number.

## Set up

1. Go to the Azure Communication Service Resource in the Azure portal.

:::image type="content" source="./media/whatsapp-sandbox/communication-resource.png" alt-text="Screenshot that shows Azure Communication Services Resource in Azure portal.":::

2. Select **Try Advanced Messaging**.  

:::image type="content" source="./media/whatsapp-sandbox/advanced-messaging-sandbox-blade.png" alt-text="Screenshot that shows Advanced Messaging Sandbox option in the Azure portal.":::

3. Before you can send a message to a WhatsApp end user from the sandbox on Azure portal, you first need to join the sandbox. You can scan the QR code on the **Connect to WhatsApp** page with your mobile device, it takes you to our preconfigured WhatsApp business account.

:::image type="content" source="./media/whatsapp-sandbox/connect-to-whatsapp.png" alt-text="Screenshot that shows WhatsApp Connect QR code in the Azure portal.":::

4. You're asked to send a unique keyword message to that phone number. Once we receive the keyword message, we reply with confirmation to you, that you have successfully joined the Sandbox. And we also save your WhatsApp phone number, which is used as the recipient number when sending messages from the sandbox. 

:::image type="content" source="./media/whatsapp-sandbox/connection-established.png" alt-text="Screenshot that shows Advanced Messaging WhatsApp connection established in the Azure portal.":::

## Send text message 
Once connected, you're able to send either a template message or a text message. Here's an example of text message.

:::image type="content" source="./media/whatsapp-sandbox/send-message.png" alt-text="Screenshot that shows WhatsApp Send text message in the Azure portal.":::

## Send template message 
Our sandbox also have a few preconfigured templates for you to try out. Fill in the parameters and they replace the double-bracketed numbers in the template message. 

:::image type="content" source="./media/whatsapp-sandbox/send-template.png" alt-text="Screenshot that shows WhatsApp Send template message in the Azure portal.":::

> [!NOTE]
>  There is one constraint from WhatsApp known as the 24-hour window. If a WhatsApp user has sent your application a message — whether it’s a reply to one of your outbound messages, or they have initiated communication themselves — your application has a 24-hour window (sometimes called a “24-hour session”) to send that user messages that don’t need to use a template. When your application sends a message to a WhatsApp user outside a 24-hour session, the message must use an approved template. 
 
## Next steps

In this quickstart, you have tried out Advanced Messaging for WhatsApp sandbox. Next you might also want to see the following articles:

- [Get Started With Advanced Communication Messages SDK](./get-started.md)
- [AdvancedMessaging for WhatsApp Overview](../../../concepts/advanced-messaging/whatsapp/whatsapp-overview.md)
- [Advanced Messaging for WhatsApp Terms of Services](../../../concepts/advanced-messaging/whatsapp/whatsapp-terms-of-service.md)
