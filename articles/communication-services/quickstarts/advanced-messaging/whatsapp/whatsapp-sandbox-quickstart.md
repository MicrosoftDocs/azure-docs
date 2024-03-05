---
title: Try Advanced Messaging for WhatsApp sandbox
titleSuffix: An Azure Communication Services quickstart document
description: Learn about Communication Service WhatsApp sandbox.
author: shamkh
manager: camilo.ramirez
services: azure-communication-services
ms.author: shamkh
ms.date: 02/29/2024
ms.topic: quickstart
ms.service: azure-communication-services
---

# Quickstart: Try Advanced Messaging for WhatsApp sandbox

Getting started exploring the Advanced Messaging features for WhatsApp. Advanced Messaging provides a sandbox experience on the Azure portal where developers can experiment with sending template and text messages to a WhatsApp user.

## Prerequisites 

- [Create an Azure Communication Services resource](../../create-communication-resource.md)
- Mobile device with the ability to read QR codes and signed into WhatsApp app

## Set up

1. Go to your Azure Communication Service resource in the Azure portal.

:::image type="content" source="./media/whatsapp-sandbox/communication-resource.png" lightbox="./media/whatsapp-sandbox/communication-resource.png" alt-text="Screenshot that shows Azure Communication Services resource in Azure portal.":::

2. Go to the **Try Advanced Messaging** tab.  

:::image type="content" source="./media/whatsapp-sandbox/advanced-messaging-sandbox-blade.png" lightbox="./media/whatsapp-sandbox/advanced-messaging-sandbox-blade.png" alt-text="Screenshot that shows Try Advanced Messaging in the Azure portal.":::

3. Before you can send a message to a WhatsApp end user from the sandbox on Azure portal, the WhatsApp user first needs to join the sandbox. On your mobile device with WhatsApp installed, scan the QR code on the **Connect to WhatsApp** page with your mobile device. This redirects you to a WhatsApp chat with the "Advanced Messaging Sandbox by Microsoft" account.

:::image type="content" source="./media/whatsapp-sandbox/connect-to-sandbox.png" lightbox="./media/whatsapp-sandbox/connect-to-sandbox.png" alt-text="Screenshot that shows WhatsApp Connect QR code in the Azure portal.":::

4. Find the unique message code on the **Try Advanced Messaging** page (ex. "connect ABC12"). Type then send this unique message in your WhatsApp chat with `Advanced Messaging Sandbox by Microsoft`.

:::image type="content" source="./media/whatsapp-sandbox/connect-to-whatsapp-draft-message.png" lightbox="./media/whatsapp-sandbox/connect-to-whatsapp-draft-message.png" alt-text="Screenshot that shows sending the connection code to the Advanced Messaging Sandbox by Microsoft account.":::

5. Once we receive the keyword message, we reply with confirmation to you, indicating that you successfully joined the sandbox. And we also save your WhatsApp phone number, which is used as the recipient number when sending messages from the sandbox. 

:::image type="content" source="./media/whatsapp-sandbox/connection-established.png" lightbox="./media/whatsapp-sandbox/connection-established.png" alt-text="Screenshot that shows Advanced Messaging WhatsApp connection established in the Azure portal.":::

## Send text message 
Once connected, you're able to send either a template message or a text message. Here's an example of sending a text message.

:::image type="content" source="./media/whatsapp-sandbox/send-message.png" lightbox="./media/whatsapp-sandbox/send-message.png" alt-text="Screenshot that shows WhatsApp Send text message in the Azure portal.":::

## Send template message 
The sandbox also has a few preconfigured templates for you to try out. Fill in the parameters to replace the double-bracketed numbers in the template message. 

:::image type="content" source="./media/whatsapp-sandbox/send-template.png" lightbox="./media/whatsapp-sandbox/send-template.png" alt-text="Screenshot that shows WhatsApp Send template message in the Azure portal.":::

> [!NOTE]
>  There is one constraint from WhatsApp known as the 24-hour window. If a WhatsApp user has sent your application a message — whether it’s a reply to one of your outbound messages, or they have initiated communication themselves — your application has a 24-hour window (sometimes called a “24-hour session”) to send that user messages that don’t need to use a template. When your application sends a message to a WhatsApp user outside a 24-hour session, the message must use an approved template. 
 
## Next steps

In this quickstart, you tried out Advanced Messaging for WhatsApp sandbox. Next you might also want to see the following articles:

- [Get Started With Advanced Communication Messages SDK](./get-started.md)
- [AdvancedMessaging for WhatsApp Overview](../../../concepts/advanced-messaging/whatsapp/whatsapp-overview.md)
- [Advanced Messaging for WhatsApp Terms of Services](../../../concepts/advanced-messaging/whatsapp/whatsapp-terms-of-service.md)
