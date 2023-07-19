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
zone_pivot_groups: acs-dev-environment-vs-vscode
---

::: zone pivot="development-environment-vs"
[!INCLUDE [Setup project with Visual Studio](./messages-get-started-net-vs-setup.md)]
::: zone-end

::: zone pivot="development-environment-vscode"
[!INCLUDE [Setup project with VS Code](./messages-get-started-net-vscode-setup.md)]
::: zone-end

3. Set up your Project.cs

Open the *Program.cs* file in a text editor.   

Add a `using` directive to include the `Azure.Communication.Messages` namespace.   

```csharp
using Azure.Communication.Messages;
```

Update the `Main` method declaration to support async code.   
```csharp
public static async Task Main(string[] args)
```

4. Include the package in your C# project   
Add the directive to include the Messages package.

```csharp
using Azure.Communication.Messages;
```

Or, you can replace your Program.cs with the following code:

```csharp
using System;
using Azure;
using Azure.Communication.Messages;

namespace AdvancedMessagesQuickstart
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Send Advanced Messages");

            // Quickstart code goes here
        }
    }
}
```

## Initialize APIs
### 1. Set connection String
Get the connection string from your ACS resource in the Azure portal. On the left, navigate to the `Keys` tab, copy the `Connection string` field for the `Primary key`.   
The connection string is in the format `endpoint=https://{your ACS resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../../media/get-started/get-acs-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Keys' tab. Attention is placed on the copy action of the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
For more information, see the "Store your connection string" section of [Create and manage Communication Services resources](../../../../create-communication-resource.md).   
To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourconnectionstring>` with your actual connection string.

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [macOS](#tab/unix)

Edit your **`.zshrc`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

Add the following code to retrieve the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. 

```csharp
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
```

### 2. Create NotificationMessagesClient   

Initialize `NotificationMessagesClient` with your connection string. 

Using connectionString, create a NotificationMessagesClient.
```csharp
NotificationMessagesClient notificationMessagesClient = new NotificationMessagesClient(connectionString);
```

### 3. Set channel registration ID   
The Channel Registration ID GUID was created during channel registration. You can look it up in the portal on the Channels tab of your ACS resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId   
```csharp
string channelRegistrationId = "<your channel registration id GUID>";
```

### 4. Set recipient list
You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account will receive the text and media messages sent in this quickstart.
For the purpose of this quickstart, this phone number may be your personal phone number.   

The recipient phone number cannot be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID will appear as the sender of the text and media messages sent to the recipient.

The phone number must include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> Only one phone number is currently supported in the recipient list.

Create the recipient list like this:
```csharp
var recipientList = new List<string> { "<your WhatsApp number>" };
```

Example:
```csharp
var recipientList = new List<string> { "+14250000000" };
```

## Initiate Conversation between Business and WhatsApp User

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

### Option 1: Initiate Conversation from Business - Send a Template Message

Initiate a conversation by sending a template message.

#### 1. Set template
Create a MessageTemplate using the values for a template. 

If you don't have a template to use, proceed to [Option 2](#option-2-initiate-conversation-from-user).

Here's MessageTemplate creation using a default template, sample_template.
```csharp
string templateName = "sample_template";
string templateLanguage = "en_us";
var messageTemplate = new MessageTemplate(templateName, templateLanguage);
```

For more examples of how to assemble your MessageTemplate and how to create your own template, see [Send WhatsApp Template Messages](../../../../../concepts/advancedmessaging/whatsapp/template-messages.md)

#### 2. Send a template message

Assemble the template message:
```csharp
var sendTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, messageTemplate);
```

Then send the template message:
```csharp
Response<SendMessageResult> templateResponse = await notificationMessagesClient.SendMessageAsync(sendTemplateMessageOptions);
```

#### 3. User responds to template message

From the WhatsApp user account, reply to the template message received from the WhatsApp Business Account. The content of the message is irrelevant for this scenario.

The recipient must respond to the template message to initiate the conversation before text or media message can be delivered to the recipient.

### Option 2: Initiate Conversation from User

The other option to initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.

To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number. The user messages reads 'Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways: 1. The business sends a template message to the WhatsApp user. 2. The WhatsApp user sends any message to the business number.'":::


## Send a Text Message to WhatsApp User
> To send a text message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. For more information, see [Initiate Conversation between Business and User](#initiate-conversation-between-business-and-whatsapp-user).

In the text message, provide text to send to the recipient. In this example, we reply to the WhatsApp user with the text “Thanks for your feedback.”.

Assemble the text message:
```csharp
var sendTextMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, "Thanks for your feedback.");
```

Then send the text message:
```csharp
Response<SendMessageResult> textResponse = await notificationMessagesClient.SendMessageAsync(sendTextMessageOptions);
```

## Send a Media Message to WhatsApp User
> To send a text message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. For more information, see [Initiate Conversation between Business and User](#initiate-conversation-between-business-and-whatsapp-user).

To send a media message, provide a URI to an image.
As an example, create a URI:
```csharp
var uri = new Uri("https://aka.ms/acsicon1");
```

Assemble the media message:
```csharp
var sendMediaMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, uri);
```

Then send the media message:
```csharp
Response<SendMessageResult> mediaResponse = await notificationMessagesClient.SendMessageAsync(sendMediaMessageOptions);
```
