---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 05/01/25
ms.topic: include
ms.custom: include file
ms.author: shamkh
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- Active WhatsApp phone number to receive messages.
- .NET development environment, such as [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/Download), or [.NET CLI](https://dotnet.microsoft.com/download).

## Set up environment

[!INCLUDE [Set up environment for .NET Application](../dot-net-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Advanced Messaging SDK for .NET.

| Class Name | Description |
| --- | --- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages. |
| `ReactionNotificationContent` | Defines reaction message content. |

> [!NOTE]
> For more information, see the Azure SDK for .NET reference [Azure.Communication.Messages Namespace](/dotnet/api/azure.communication.messages).

## Common configuration

To configure your application, complete the following steps:

- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-net.md)]

## Code examples

Follow these steps to add the required code snippets to the Main method in your `Program.cs` file.

### Send a reaction message to a WhatsApp user

The Azure Communication Services SDK enables Contoso to send reaction messages to WhatsApp users when initiated by the users. To send a reaction message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- [WhatsApp channel ID](#set-channel-registration-id).
- [Recipient phone number in E.164 format](#set-recipient-list).
- Emoji representing the reaction.
- Message ID of the original message being reacted to.

| Action Type                     | Description                                       |
|---------------------------------|---------------------------------------------------|
| `ReactionNotificationContent`   | Class defining the reaction message content.      |
| `Emoji`                         | Specifies the emoji reaction, such as 😄.         |
| `MessageId`                     | ID of the message being replied to.              |

In this example, the business sends a reaction message to the WhatsApp user:

Assemble the reaction content:

```csharp
var reactionNotificationContent = new ReactionNotificationContent(channelRegistrationId, recipientList, "\uD83D\uDE00", "<ReplyMessageIdGuid>");
```

Send the reaction message:

```csharp
var reactionResponse = await notificationMessagesClient.SendAsync(reactionNotificationContent);
```

### Run the code

#### [Visual Studio](#tab/visual-studio)

1. To compile your code, press **Ctrl**+**F7**.
1. To run the program without debugging, press **Ctrl**+**F5**.

#### [Visual Studio Code](#tab/vs-code)

Build and run your program using the following commands in the Visual Studio Code Terminal (**View** > **Terminal**).

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

> [!NOTE]
> Replace all placeholder variables in the code with your values.


```csharp
using Azure;
using Azure.Communication.Messages;

namespace AdvancedMessagingQuickstart
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Send WhatsApp Reaction Messages\n");

            string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
            NotificationMessagesClient notificationMessagesClient = 
                new NotificationMessagesClient(connectionString);

            var channelRegistrationId = new Guid("<Your Channel ID>");
            var recipientList = new List<string> { "<Recipient's WhatsApp Phone Number>" };

            // Send a reaction message
            var emojiReaction = "\uD83D\uDE00"; // 😄 emoji
            var replyMessageId = "<ReplyMessageIdGuid>"; // Message ID of the original message
            var reactionNotificationContent = new ReactionNotificationContent(channelRegistrationId, recipientList, emojiReaction, replyMessageId);
            var reactionResponse = await notificationMessagesClient.SendAsync(reactionNotificationContent);

            Console.WriteLine("Reaction message sent.\nPress any key to exit.\n");
            Console.ReadKey();
        }
    }
}

```
