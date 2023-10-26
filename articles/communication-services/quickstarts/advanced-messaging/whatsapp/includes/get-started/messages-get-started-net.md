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
zone_pivot_groups: acs-dev-environment-vs-vscode,client-operating-system
---

## Setting up
::: zone pivot="development-environment-vs"
[!INCLUDE [Setup project with Visual Studio](./messages-get-started-net-vs-setup.md)]
::: zone-end

::: zone pivot="development-environment-vscode"
[!INCLUDE [Setup project with VS Code](./messages-get-started-net-vscode-setup.md)]
::: zone-end

Update your Project.cs

Open the *Program.cs* file in a text editor.   

Add a `using` directive to include the `Azure.Communication.Messages` namespace.   

```csharp
using Azure.Communication.Messages;
```

For this quickstart, you need the following includes:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure;
```

Update the `Main` method declaration to support async code.   
```csharp
public static async Task Main(string[] args)
```

Include the package in your C# project   
Add the directive to include the Messages package.

```csharp
using Azure.Communication.Messages;
```

Or, you can replace your Program.cs with the following code:

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure;
using Azure.Communication.Messages;

namespace AdvancedMessagingQuickstart
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Send WhatsApp Messages");

            // Quickstart code goes here
        }
    }
}
```

### Configure environment variables

In this section, you set up an Environment Variable for Azure Communication Service Resource Connection.
Get the connection string from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab, copy the `Connection string` field for the `Primary key`. The connection string is in the format `endpoint=https://{your ACS resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
For more information, see the "Store your connection string" section of [Create and manage Communication Services resources](../../../../create-communication-resource.md).   
To configure an environment variable, open a console window and select your operating system from the below tabs. Replace `<yourconnectionstring>` with your actual connection string.

::: zone pivot="client-operating-system-windows"
Open a console window and enter the following command:

```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.
::: zone-end

::: zone pivot="client-operating-system-macos"
Edit your **`.zshrc`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.
::: zone-end

::: zone pivot="client-operating-system-linux"
Edit your **`.bash_profile`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.
::: zone-end

**Using ConnectionString Environment Variable**

Add the following code to retrieve the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. 

```csharp
string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
```

## Create NotificationMessagesClient   

Initialize `NotificationMessagesClient` with your connection string. 

Using connectionString, create a NotificationMessagesClient.
```csharp
NotificationMessagesClient notificationMessagesClient = new NotificationMessagesClient(connectionString);
```

## Set channel registration ID   
The Channel Registration ID GUID was created during channel registration. You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId   
```csharp
string channelRegistrationId = "<your channel registration id GUID>";
```

## Set recipient list
You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account receives the text and media messages sent in this quickstart.
For this quickstart, this phone number may be your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number should include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> [!NOTE]
> Only one phone number is currently supported in the recipient list.

Create the recipient list like this:
```csharp
var recipientList = new List<string> { "<your WhatsApp number>" };
```

Example:
```csharp
var recipientList = new List<string> { "+14255550199" };
```

## Start sending messages between business and WhatsApp user

Communication between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

### (Option 1) Initiate conversation from business - Send a templated message
Initiate a conversation by sending a template message.

First, create a MessageTemplate using the values for a template. 
> [!NOTE]
> To check which templates you have available, see the instructions at [List templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md#list-templates).
> If you don't have any template to use, proceed to [Option 2](#option-2-initiate-conversation-from-user).

Here's MessageTemplate creation using a default template, `sample_template`:
```csharp
string templateName = "sample_template";
string templateLanguage = "en_us";
var messageTemplate = new MessageTemplate(templateName, templateLanguage);
```

For more examples of how to assemble your MessageTemplate and how to create your own template, see [Send WhatsApp Template Messages](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md).    
For further requirements on templates, refer to the guidelines in the WhatsApp Business Platform API references [Create and Manage Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/), [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components), and [Sending Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates). 


Assemble the template message:
```csharp
var sendTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, messageTemplate);
```

Then send the template message:
```csharp
Response<SendMessageResult> sendTemplateMessageResult = await notificationMessagesClient.SendMessageAsync(sendTemplateMessageOptions);
```

Now, the user needs to respond to template message. From the WhatsApp user account, reply to the template message received from the WhatsApp Business Account. The content of the message is irrelevant for this scenario.

> [!NOTE]
> The recipient must respond to the template message to initiate the conversation before text or media message can be delivered to the recipient.

### (Option 2) Initiate conversation from user

The other option to initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.
To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::


## Send a text message to WhatsApp user
 To send a text message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-business-and-whatsapp-user).

In the text message, provide text to send to the recipient. In this example, we reply to the WhatsApp user with the text “Thanks for your feedback.”.

Assemble the text message:
```csharp
var sendTextMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, "Thanks for your feedback.");
```

Then send the text message:
```csharp
Response<SendMessageResult> sendTextMessageResult = await notificationMessagesClient.SendMessageAsync(sendTextMessageOptions);
```

## Send a media message to WhatsApp user
To send a media message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-business-and-whatsapp-user).

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
Response<SendMessageResult> sendMediaMessageResult = await notificationMessagesClient.SendMessageAsync(sendMediaMessageOptions);
```

## Full code example

[!INCLUDE [Full code example with .NET](./messages-get-started-full-example-net.md)]
