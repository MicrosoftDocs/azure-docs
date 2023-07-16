---
title: include file
description: include file
services: azure-communication-services
author: memontic-ms
manager: 
ms.service: azure-communication-services
ms.date: 06/20/2023
ms.topic: include
ms.custom: include file
ms.author: memontic
---

::: zone pivot="platform-visualstudio"
[!INCLUDE [Setup project with Visual Studio](./messages-get-started-net-vs-setup.md)]
::: zone-end

::: zone pivot="platform-vscode"
[!INCLUDE [Setup project with VS Code](./messages-get-started-net-vscode-setup.md)]
::: zone-end

3. Include the package in your C# project   
Add the directive to include the Messages package.

```dotnetcli
using Azure.Communication.Messages;
```

## Initalize APIs
### 1. Set Connection String   
Get the Connection String from your ACS resource in the portal. From the `Keys` blade, copy the `Connection string` field for the `Primary key`.

:::image type="content" source="../../media/get-started/get-acs-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure Portal, viewing the 'Keys' blade. Attention is placed on the copy action of the 'Connection string' field in the 'Primary key' section.":::

```dotnetcli
string connectionString = "{your connection string}";
```

For example:
```dotnetcli
string connectionString = 
    "endpoint=https://{your ACS resource name}.communication.azure.com/;accesskey={secret key}";
```

### 2. Create NotificationMessagesClient   
Using connectionString, create a NotificationMessagesClient.
```dotnetcli
NotificationMessagesClient notificationMessagesClient = 
    new NotificationMessagesClient(connectionString);
```

### 3. Set Channel Registration ID   
The Channel Registration ID GUID was created during channel registration. You can look it up in the portal on the Channels tab of your ACS resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure Portal, viewing the 'Channels' blade. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId   
```dotnetcli
string channelRegistrationId = "{your channel registration id GUID}";
```

### 4. Set Recipient List   
You will need to supply a real phone number that has a WhatsApp account associated with it. This may be your personal phone number.
Note: Only one phone number is currently supported in the recipient list.

The phone number must include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

Create the recipient list like this:
```dotnetcli
var recipientList = new List<string> { "{your WhatsApp number}" };
```

Example:
```dotnetcli
var recipientList = new List<string> { "14255550000" };
```

## Initiate Conversation between Business and WhatsApp User

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

Here is how to send 

### Option 1: Initiate Conversation from Business - Send a Template Message

Initiate a conversation by sending a template message.

#### 1. Set Template   
Create a MessageTemplate using the values for a template. 
You can create a MessageTemplate using the template you created during HandsOn Lab - WhatsApp Template Creation.docx
If you do not have a template to use, proceed to step 7.

Here is MessageTemplate creation using a default template, sample_template.
```dotnetcli
string templateName = "sample_template";
string templateLanguage = "en_us";
var templateParameters = new List<string> {};
MessageTemplate messageTemplate = 
    new MessageTemplate(templateName, templateLanguage, templateParameters);
```

#### 2. Send a Template Message   

Assemble the template message:
```dotnetcli
SendMessageOptions sendTemplateMessageOptions = 
    new SendMessageOptions(channelRegistrationId, recipientList, messageTemplate);
```

Then send the template message:
```dotnetcli
Response<SendMessageResult> templateResponse = 
    await notificationMessagesClient.SendMessageAsync(sendTemplateMessageOptions);
```

#### 3. User responds to template message

From the WhatsApp user account, reply to the template message recieved from the WhatsApp Business Account. The content of the message is irrelevant for this scenario.

The recipient must respond to the template message to initiate the conversation before text or media message will be delivered to the recipient.

### Option 2: Initiate Conversation from User

The other option to initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.

To do so, from your personal WhatsApp account, send a message to your business number.

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number. The user messages reads 'Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways: 1. The business sends a template message to the WhatsApp user. 2. The WhatsApp user sends any message to the business number.'":::


## Send a Text Message to WhatsApp User
> To send a text message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. See [Initiate Conversation between Business and User](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages) for more details

In the text message, provide text to send to the recipient. In this example, we will reply to the WhatsApp user with the text “Thanks for your feedback”.

Assemble the text message:
```dotnetcli
SendMessageOptions sendTextMessageOptions = 
    new SendMessageOptions(channelRegistrationId, recipientList, "Thank you for your feedback.");
```

Then send the text message:
```dotnetcli
Response<SendMessageResult> textResponse = 
    await notificationMessagesClient.SendMessageAsync(sendTextMessageOptions);
```

## Send a Media Message to WhatsApp User
> To send a Media message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. See [Initiate Conversation between Business and User](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages) for more details

To send a media message, we will provide a URI to an image.
As an example, create your URI:
```dotnetcli
Uri uri = new Uri("https://aka.ms/acsicon1");
```

Assemble the media message:
```dotnetcli
SendMessageOptions sendMediaMessageOptions = 
    new SendMessageOptions(channelRegistrationId, recipientList, uri);
```

Then send the media message:
```dotnetcli
Response<SendMessageResult> mediaResponse = 
    await notificationMessagesClient.SendMessageAsync(sendMediaMessageOptions);
```
