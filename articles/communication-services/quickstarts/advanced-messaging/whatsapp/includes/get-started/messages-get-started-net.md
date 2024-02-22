---
title: include file
description: include file
services: azure-communication-services
author: glorialimicrosoft
ms.service: azure-communication-services
ms.date: 02/02/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md)
- Active WhatsApp phone number to receive messages

## Setting up

### Create the .NET project

#### [Visual Studio](#tab/visual-studio)

In Visual Studio, create a new project, then select `Console App (.NET Framework) for C#`.

#### [VS Code](#tab/vs-code)

To create your project, follow the steps at [Create a .NET console application using Visual Studio Code](/dotnet/core/tutorials/with-visual-studio-code?pivots=dotnet-7-0).

---

### Install the package

Install the Azure.Communication.Messages NuGet package to your C# project.

# [Visual Studio](#tab/visual-studio)
 
1. Open the NuGet Package Manager at `Project` > `Manage NuGet Packages...`.   
2. Search for the package `Azure.Communication.Messages`.   
3. Install the latest release.

# [VS Code](#tab/vs-code)

1. Open the VS Code terminal ( `View` > `Terminal` )
2. Install the package by running the following command:
```console
dotnet add package Azure.Communication.Messages
```

---

### Set up the app framework

Open the *Program.cs* file in a text editor.   

Replace the contents of your Program.cs with the following code:

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

To use the Advanced Messaging features, we add a `using` directive to include the `Azure.Communication.Messages` namespace.

```csharp
using Azure.Communication.Messages;
```

### Configure environment variables

In this section, you set up an Environment Variable for Azure Communication Service Resource Connection.    
Get the connection string from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Connection string` field for the `Primary key`. The connection string is in the format `endpoint=https://{your Azure Communication Services resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../../media/get-started/get-communication-resource-connection-string.png" lightbox="../../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).   

#### [Windows](#tab/windows)

Open a console window and enter the following command:

```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<yourConnectionString>"
```

After you add the environment variable, you may need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

#### [Linux](#tab/linux)

Edit your **`.bash_profile`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.bash_profile` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

#### [macOS](#tab/macOS)
Edit your **`.zshrc`**, and add the environment variable:

```bash
export COMMUNICATION_SERVICES_CONNECTION_STRING="<yourConnectionString>"
```

After you add the environment variable, run `source ~/.zshrc` from your console window to make the changes effective. If you created the environment variable with your IDE open, you may need to close and reopen the editor, IDE, or shell in order to access the variable.

---

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for .NET.

| Name                                        | Description                                                                                           |
| --------------------------------------------|------------------------------------------------------------------------------------------------------ |
| NotificationMessagesClient | This class connects to your Azure Communication Services resource. It is used to send the messages. |
| MessageTemplate | This class defines which template you will use and the content of the template properties for your message. |
| TemplateNotificationContent | This class defines the "who" and the "what" of the template message you intend to send. |
| TextNotificationContent | This class defines the "who" and the "what" of the text message you intend to send. |
| MediaNotificationContent | This class defines the "who" and the "what" of the media message you intend to send. |

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user)
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user)
- [Send a media message to a WhatsApp user](#send-a-media-message-to-a-whatsapp-user)

### Authenticate the client   

The NotificationMessagesClient is used to connect to your Azure Communication Services resource.    
Use the connection string to authenticate.

```csharp
// Retrieve connection string from environment variable
string connectionString = 
    Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");

// Instantiate the client
var notificationMessagesClient = new NotificationMessagesClient(connectionString);
```

### Set channel registration ID   

The Channel Registration ID GUID was created during channel registration. You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId.
```csharp
var channelRegistrationId = new Guid("<your channel registration id GUID>");
```

### Set recipient list

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

### Start sending messages between a business and a WhatsApp user

Communication between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

#### (Option 1) Initiate conversation from business - Send a templated message
Initiate a conversation by sending a template message.

First, create a MessageTemplate using the values for a template. 
> [!NOTE]
> To check which templates you have available, see the instructions at [List templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md#list-templates).
> If you don't have a template to use, proceed to [Option 2](#option-2-initiate-conversation-from-user).

Here's MessageTemplate creation using a default template, `sample_template`:
```csharp
string templateName = "sample_template";
string templateLanguage = "en_us";
var messageTemplate = new MessageTemplate(templateName, templateLanguage);
```

For more examples of how to assemble your MessageTemplate and how to create your own template, see [Send WhatsApp Template Messages](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md).    
For further requirements on templates, refer to the guidelines in the WhatsApp Business Platform API references [Create and Manage Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/), [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components), and [Sending Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates). 


Assemble then send the template message:
```csharp
var templateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, messageTemplate);

Response<SendMessageResult> sendTemplateMessageResult = await notificationMessagesClient.SendAsync(templateContent);
```

Now, the user needs to respond to template message. From the WhatsApp user account, reply to the template message received from the WhatsApp Business Account. The content of the message is irrelevant for this scenario.

> [!NOTE]
> The recipient must respond to the template message to initiate the conversation before text or media message can be delivered to the recipient.

#### (Option 2) Initiate conversation from user

The other option to initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.
To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::


### Send a text message to a WhatsApp user
 To send a text message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-business-and-a-whatsapp-user).

In the text message, provide text to send to the recipient. In this example, we reply to the WhatsApp user with the text “Thanks for your feedback.”.

Assemble then send the text message:
```csharp
var textContent = 
    new TextNotificationContent(channelRegistrationId, recipientList, "Thanks for your feedback.");

Response<SendMessageResult> sendTextMessageResult = 
    await notificationMessagesClient.SendAsync(textContent);
```

### Send a media message to a WhatsApp user
To send a media message, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-business-and-a-whatsapp-user).

To send a media message, provide a URI to an image.
As an example, create a URI:
```csharp
var uri = new Uri("https://aka.ms/acsicon1");
```

Assemble then send the media message:
```csharp
var mediaContent = 
    new MediaNotificationContent(channelRegistrationId, recipientList, uri);

Response<SendMessageResult> sendMediaMessageResult = 
    await notificationMessagesClient.SendMessageAsync(mediaContent);
```

## Run the code

Build and run your program.  

To send a text or media message to a WhatsApp user, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user.  
If you do not have an active conversation, for the purposes of this quickstart, it is suggested to add a wait between sending the template message and sending the text message. This will give you enough time to reply to the business on the user's WhatsApp account. For reference, the full example at [Sample code](#sample-code) prompts for manual user input before sending the next message.
  
If successful, you will recieve 3 messages on the user's WhatsApp account.

## Sample code

[!INCLUDE [Full code example with .NET](./messages-get-started-full-example-net.md)]
