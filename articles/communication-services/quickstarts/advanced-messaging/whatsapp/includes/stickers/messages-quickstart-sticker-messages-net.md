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
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- Active WhatsApp phone number to receive messages.
- .NET development environment, such as [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/Download), or [.NET CLI](https://dotnet.microsoft.com/download).

## Set up environment

[!INCLUDE [Set up environment for .NET Application](../dot-net-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for .NET.

| Class Name | Description |
| --- | --- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `StickerNotificationContent` |  Defines sticker content of the messages. |

> [!NOTE]
> For more information, see the Azure SDK for .NET reference [Azure.Communication.Messages Namespace](/dotnet/api/azure.communication.messages).

## Common configuration

Follow these steps to add the required code snippets to the Main method in your `Program.cs` file.

- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-net.md)]

## Code examples

Follow these steps to add required code snippets to the Main function of your `Program.cs` file.
- [Send a Sticker messages to a WhatsApp user](#send-a-sticker-messages-to-a-whatsapp-user)

> [!IMPORTANT]
> To send a sticker message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

### Send a sticker messages to a WhatsApp user

The Messages SDK enables Contoso to send sticker WhatsApp messages, when initiated by WhatsApp users. To send sticker messages:

- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- [WhatsApp channel ID](#set-channel-registration-id).
- [Recipient phone number in E16 format](#set-recipient-list).
- URI of the sticker media.

In this example, the business sends sticker message to the WhatsApp user:

Assemble the sticker content:

```csharp
var stickerLink = new Uri("https://example.com/sticker.webp");
var stickerNotificationContent = new StickerNotificationContent(channelRegistrationId, recipientList, stickerLink);
```

Send the sticker message:

```csharp
var stickerResponse = await notificationMessagesClient.SendAsync(stickerNotificationContent);
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
            Console.WriteLine("Azure Communication Services - Send WhatsApp Messages\n");

            string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
            NotificationMessagesClient notificationMessagesClient = 
                new NotificationMessagesClient(connectionString);

            var channelRegistrationId = new Guid("<Your Channel ID>");
            var recipientList = new List<string> { "<Recipient's WhatsApp Phone Number>" };

            // Send a sticker message
            var stickerLink = new Uri("https://example.com/sticker.webp");
            var stickerNotificationContent = new StickerNotificationContent(channelRegistrationId, recipientList, stickerLink);
            var stickerResponse = await notificationMessagesClient.SendAsync(stickerNotificationContent);

            Console.WriteLine("Sticker message sent.\nPress any key to exit.\n");
            Console.ReadKey();
        }
    }
}
```