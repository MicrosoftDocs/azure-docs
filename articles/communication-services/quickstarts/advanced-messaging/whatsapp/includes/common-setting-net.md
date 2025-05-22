---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 05/01/2025
ms.topic: include
ms.custom: include file
ms.author: shamkh
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---  

### Authenticate the client 

The Messages SDK uses the `NotificationMessagesClient` to send messages. The `NotificationMessagesClient` method authenticates using your connection string acquired from Azure Communication Services resource in the Azure portal. For more information about connection strings, see [access-your-connection-strings-and-service-endpoints](../../../create-communication-resource.md#access-your-connection-strings-and-service-endpoints).

[!INCLUDE [Authenticate the client](./authenticate-notification-messages-client-net.md)]

### Set channel registration ID   

You created the Channel Registration ID GUID during [channel registration](../connect-whatsapp-business-account.md). Find it in the portal on the **Channels** tab of your Azure Communication Services resource.

:::image type="content" source="../media/get-started/get-messages-channel-id.png" lightbox="../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId.
```csharp
var channelRegistrationId = new Guid("<your channel registration ID GUID>");
```

### Set recipient list

You need to supply an active phone number associated with a WhatsApp account. This WhatsApp account receives the template, text, and media messages sent in this quickstart.

For this example, you can use your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number must include the country code. For more information about phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> [!NOTE]
> Only one phone number is currently supported in the recipient list.

Create the recipient list like this:
```csharp
var recipientList = new List<string> { "<to WhatsApp phone number>" };
```

Example:
```csharp
// Example only
var recipientList = new List<string> { "+14255550199" };
```

### Start sending messages between a business and a WhatsApp user

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:

- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

A business can't initiate an interactive conversation. A business can only send an interactive message after receiving a message from the user. The business can only send interactive messages to the user during the active conversation. Once the 24 hour conversation window expires, only the user can restart the interactive conversation. For more information about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations).

To initiate an interactive conversation from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../media/get-started/user-initiated-conversation.png" lightbox="../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::