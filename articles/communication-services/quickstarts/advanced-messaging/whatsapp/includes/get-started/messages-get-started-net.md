---
title: Include file
description: Include file
services: azure-communication-services
author: memontic
ms.service: azure-communication-services
ms.subservice: messages
ms.date: 07/15/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md)
- Active WhatsApp phone number to receive messages

- .NET development environment (such as [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/Download), or [.NET CLI](https://dotnet.microsoft.com/download))

## Setting up

### Create the .NET project

#### [Visual Studio](#tab/visual-studio)

To create your project, follow the tutorial at [Create a .NET console application using Visual Studio](/dotnet/core/tutorials/with-visual-studio).

To compile your code, press <kbd>Ctrl</kbd>+<kbd>F7</kbd>.

#### [Visual Studio Code](#tab/vs-code)

To create your project, follow the tutorial at [Create a .NET console application using Visual Studio Code](/dotnet/core/tutorials/with-visual-studio-code).

Build and run your program by running the following commands in the Visual Studio Code Terminal (View > Terminal).
```console
dotnet build
dotnet run
```

#### [.NET CLI](#tab/dotnet-cli)

First, create your project.
```console
dotnet new console -o AdvancedMessagingQuickstart
```

Next, navigate to your project directory and build your project.

```console
cd AdvancedMessagingQuickstart
dotnet build
```

---

### Install the package

Install the Azure.Communication.Messages NuGet package to your C# project.

#### [Visual Studio](#tab/visual-studio)
 
1. Open the NuGet Package Manager at `Project` > `Manage NuGet Packages...`.   
2. Search for the package `Azure.Communication.Messages`.   
3. Install the latest release.

#### [Visual Studio Code](#tab/vs-code)

1. Open the Visual Studio Code terminal ( `View` > `Terminal` ).
2. Install the package by running the following command.
```console
dotnet add package Azure.Communication.Messages
```

#### [.NET CLI](#tab/dotnet-cli)

Install the package by running the following command.
```console
dotnet add package Azure.Communication.Messages
```

---

### Set up the app framework

Open the *Program.cs* file in a text editor.   

Replace the contents of your *Program.cs* with the following code:

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

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for .NET.

| Name                        | Description                                                                                            |
|-----------------------------|--------------------------------------------------------------------------------------------------------|
| NotificationMessagesClient  | This class connects to your Azure Communication Services resource. It sends the messages.              |
| MessageTemplate             | This class defines which template you use and the content of the template properties for your message. |
| TemplateNotificationContent | This class defines the "who" and the "what" of the template message you intend to send.                |
| TextNotificationContent     | This class defines the "who" and the "what" of the text message you intend to send.                    |
| MediaNotificationContent    | This class defines the "who" and the "what" of the media message you intend to send.                   |

## Code examples

Follow these steps to add the necessary code snippets to the Main function of your *Program.cs* file.

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user)
  - [Send a template message to a WhatsApp User](#option-1-initiate-conversation-from-business---send-a-template-message)
  - [Initiate conversation from user](#option-2-initiate-conversation-from-user)
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user)
- [Send a media message to a WhatsApp user](#send-a-media-message-to-a-whatsapp-user)

### Authenticate the client   

The `NotificationMessagesClient` is used to connect to your Azure Communication Services resource.   

[!INCLUDE [Authenticate the NotificationMessagesClient](./../authenticate-notification-messages-client-net.md)]

### Set channel registration ID   

The Channel Registration ID GUID was created during [channel registration](../../connect-whatsapp-business-account.md). You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" lightbox="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId.
```csharp
var channelRegistrationId = new Guid("<your channel registration ID GUID>");
```

### Set recipient list

You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account receives the template, text, and media messages sent in this quickstart.
For this quickstart, this phone number may be your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number should include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

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

Regardless of how the conversation was started, **a business can only send template messages until the user sends a message to the business.** Only after the user sends a message to the business, the business is allowed to send text or media messages to the user during the active conversation. Once the 24 hour conversation window expires, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations).

#### (Option 1) Initiate conversation from business - Send a template message
Initiate a conversation by sending a template message.

First, create a MessageTemplate using the values for a template. 
> [!NOTE]
> To check which templates you have available, see the instructions at [List templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md#list-templates).
> If you don't have a template to use, proceed to [Option 2](#option-2-initiate-conversation-from-user).

Here's MessageTemplate creation using a default template, `sample_template`.   
If `sample_template` isn't available to you, skip to [Option 2](#option-2-initiate-conversation-from-user). For advanced users, see the page [Templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md) to understand how to send a different template with Option 1.

The Messages SDK allows Contoso to send templated WhatsApp messages to WhatsApp users. To send a template message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Template details
    - Name like 'sample_template'
    - Language like 'en_us'
    - Parameters if any
    
```csharp
// Assemble the template content
string templateName = "sample_template";
string templateLanguage = "en_us";
var messageTemplate = new MessageTemplate(templateName, templateLanguage);
```

For more examples of how to assemble your MessageTemplate and how to create your own template, refer to the following resource:
- [Send WhatsApp Template Messages](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md) 
   
For further WhatsApp requirements on templates, refer to the WhatsApp Business Platform API references:
- [Create and Manage Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/)
- [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components)
- [Sending Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

Assemble then send the template message:
```csharp
// Assemble template message
var templateContent = 
    new TemplateNotificationContent(channelRegistrationId, recipientList, messageTemplate);

// Send template message
Response<SendMessageResult> sendTemplateMessageResult = 
    await notificationMessagesClient.SendAsync(templateContent);
```

Now, the user needs to respond to the template message. From the WhatsApp user account, reply to the template message received from the WhatsApp Business Account. The content of the message is irrelevant for this scenario.

> [!IMPORTANT]
> The recipient must respond to the template message to initiate the conversation before text or media message can be delivered to the recipient.

#### (Option 2) Initiate conversation from user

The other option to initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.
To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" lightbox="../../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::

### Send a text message to a WhatsApp user

The Messages SDK allows Contoso to send WhatsApp text messages, which initiated WhatsApp users initiated. To send a text message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- [WhatsApp channel ID](#set-channel-registration-id)
- [Recipient phone number in E16 format](#set-recipient-list)
- Message body/text to be sent

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, we reply to the WhatsApp user with the text "Thanks for your feedback.\n From Notification Messaging SDK".

Assemble then send the text message:
```csharp
// Assemble text message
var textContent = 
    new TextNotificationContent(channelRegistrationId, recipientList, "Thanks for your feedback.\n From Notification Messaging SDK");

// Send text message
Response<SendMessageResult> sendTextMessageResult = 
    await notificationMessagesClient.SendAsync(textContent);
```

### Send a media message to a WhatsApp user

The Messages SDK allows Contoso to send WhatsApp media messages to WhatsApp users. To send an embedded media message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- [WhatsApp channel ID](#set-channel-registration-id)
- [Recipient phone number in E16 format](#set-recipient-list)
- MediaUri of the Image

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

As an example, create a URI:
```csharp
var uri = new Uri("https://aka.ms/acsicon1");
```

Assemble then send the media message:
```csharp
// Assemble media message
var mediaContent = 
    new MediaNotificationContent(channelRegistrationId, recipientList, uri);

// Send media message
Response<SendMessageResult> sendMediaMessageResult = 
    await notificationMessagesClient.SendAsync(mediaContent);
```

## Run the code

Build and run your program.  

To send a text or media message to a WhatsApp user, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user.  
If you don't have an active conversation, for the purposes of this quickstart, you should add a wait between sending the template message and sending the text message. This added delay gives you enough time to reply to the business on the user's WhatsApp account. For reference, the full example at [Sample code](#full-sample-code) prompts for manual user input before sending the next message.
  
If successful, you receive three messages on the user's WhatsApp account.

#### [Visual Studio](#tab/visual-studio)

1. To compile your code, press <kbd>Ctrl</kbd>+<kbd>F7</kbd>.
1. To run the program without debugging, press <kbd>Ctrl</kbd>+<kbd>F5</kbd>.

#### [Visual Studio Code](#tab/vs-code)

Build and run your program by running the following commands in the Visual Studio Code Terminal (View > Terminal).
```console
dotnet build
dotnet run
```

#### [.NET CLI](#tab/dotnet-cli)

Build and run your program.
```console
dotnet build
dotnet run
```

---

## Full sample code

[!INCLUDE [Full code example with .NET](./messages-get-started-full-example-net.md)]
