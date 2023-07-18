---
title: Try Whatsapp Sandbox
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

# Quickstart: Try AdvancedMessaging For Whatsapp Sandbox

To enable Contoso developers to try out the Advanced Messaging for Whatsapp quickly, Advanced Messaging is providing Whatsapp Business Account enabled sandbox. This WhatsApp Sandbox will be available on the Azure portal and Contoso developers can play around the Advanced Messaging functionalities including sending template messages and text messages.  

## Prerequisites 

- [Create an Azure Communication Services resource](../../create-communication-resource.md).
- [Whatsapp enabled phonenumber]()

## Task

Send text and template message to WhatsApp phonenumber using Azure Communication Services Advanced Messaging for Whatsapp.

### Steps

1. Go to the Azure Communication Service Resource in the Azure portal.

:::image type="content" source="./media/whatsapp-sandbox/acs-resource.png" alt-text="Screenshot that shows Azure Communication Service Resource in Azure portal.":::

2. Select "Try Advanced Messaging".  

:::image type="content" source="./media/whatsapp-sandbox/advancedmessaging-sandbox-blade.png" alt-text="Screenshot that shows Advanced Messaging Sandbox option in the Azure portal.":::

3. Before you can send a message to a WhatsApp end user from the sandbox on Azure Portal, you will first need to join the sandbox. You can scan the QR code on the **Connect to WhatsApp** page with your mobile device, it will take you to our pre-configured WhatsApp business account.

:::image type="content" source="./media/whatsapp-sandbox/connect-to-whatsapp.png" alt-text="Screenshot that shows WhatsApp Connect QR code in the Azure portal.":::

4. You will be asked to send a unique keyword message to that phone number. Once we receive the keyword message, we will reply with confirmation to you that you have successfully joined the Sandbox. And we will also be able to obtain your WhatsApp phone number, which will be used as the recipient number when sending messages from the sandbox. 

:::image type="content" source="./media/whatsapp-sandbox/connection-established.png" alt-text="Screenshot that shows Advanced Messaging Whatsapp connection established in the Azure portal.":::
 
5. Once connected, you will be able to send either a template message or a text message. Below is example of text message.

:::image type="content" source="./media/whatsapp-sandbox/send-message.png" alt-text="Screenshot that shows WhatsApp Send text message in the Azure portal.":::
 
6. Our sandbox will have a few pre-configured templates for you to try out. Simply fill in the parameters and they will replace the double-bracketed numbers in the template message. 

:::image type="content" source="./media/whatsapp-sandbox/send-template.png" alt-text="Screenshot that shows WhatsApp Send template message in the Azure portal.":::

```md
   **Note**:There is one constraint from WhatsApp known as the 24-hour window. If a WhatsApp user has sent your application a message — whether it’s a reply to one of your outbound messages, or they have initiated communication themselves — your application has a 24-hour window (sometimes called a “24-hour session”) to send that user messages that don’t need to use a template. When your application sends a message to a WhatsApp user outside a 24-hour session, the message must use an approved template. 
``` 
## Next Steps

In this quickstart, you have learned how is registered with Azure Communication Services your WhatsApp Business Account, you are ready to send and receive messages.

> [!div class="nextstepaction"]
> [Get Started With AdvancedMessages](../../../quickstarts//advancedmessaging/whatsapp/get-started.md)

You might also want to see the following articles: 

-    [AdvancedMessaging For Whatsapp Overview](../../../concepts/advancedmessaging/whatsapp/whatsapp-overview.md)

-    [Advanced Messaging for WhatsApp Terms of Services](../../../concepts/advancedmessaging/whatsapp/whatsapp-termsof-service.md)
