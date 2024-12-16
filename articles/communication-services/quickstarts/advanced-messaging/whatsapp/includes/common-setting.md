---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 07/15/2024
ms.topic: include
ms.custom: include file
ms.author: shamkh
---  

### Authenticate the client 

Messages sending is done using NotificationMessagesClient. NotificationMessagesClient is authenticated using your connection string acquired from Azure Communication Services resource in the Azure portal. For more information on connection strings, see [access-your-connection-strings-and-service-endpoints](../../../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

[!INCLUDE [Authenticate the client ](./authenticate-notification-messages-client-net.md)]

#### Set channel registration ID   

The Channel Registration ID GUID was created during [channel registration](../connect-whatsapp-business-account.md). You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../media/get-started/get-messages-channel-id.png" lightbox="../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId.
```python
    channelRegistrationId = os.getenv("WHATSAPP_CHANNEL_ID_GUID")
```

#### Set recipient list

You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account receives the template, text, and media messages sent in this quickstart.
For this quickstart, this phone number may be your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number should include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> [!NOTE]
> Only one phone number is currently supported in the recipient list.

Set the recipient list like this:
```python
    phone_number = os.getenv("RECIPIENT_WHATSAPP_PHONE_NUMBER")
```

Usage Example:
```python
    # Example only
    to=[self.phone_number],
```

#### Start sending messages between a business and a WhatsApp user

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

For Interactive messages, Only after the user sends a message to the business, the business is allowed to send interactive messages to the user during the active conversation. Once the 24 hour conversation window expires, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations).

To initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.
To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../media/get-started/user-initiated-conversation.png" lightbox="../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::