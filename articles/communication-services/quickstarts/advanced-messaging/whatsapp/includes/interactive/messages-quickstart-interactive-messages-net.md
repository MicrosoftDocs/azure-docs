---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
manager: camilo.ramirez
ms.service: azure-communication-services
ms.subservice: azure-communication-services
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

## Set up the environment

[!INCLUDE [Setting up for .NET Application](../dot-net-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for .NET.

| Class Name | Description |
| --- |--- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `InteractiveNotificationContent`  | Defines the interactive message business can send to user. |
| `InteractiveMessage` | Defines interactive message content.|
| `WhatsAppListActionBindings` | Defines WhatsApp List interactive message properties binding. |
| `WhatsAppButtonActionBindings`| Defines WhatsApp Button interactive message properties binding.|
| `WhatsAppUrlActionBindings` | Defines WhatsApp Url interactive message properties binding.|
| `TextMessageContent`     | Defines the text content for Interactive message body, footer, header. |
| `VideoMessageContent`   | Defines the video content for Interactive message header.  |
| `DocumentMessageContent` | Defines the document content for Interactive message header. |
| `ImageMessageContent` | Defines the image content for Interactive message header.|
| `ActionGroupContent` | Defines the ActionGroup or ListOptions content for Interactive message.|
| `ButtonSetContent` | Defines the Reply Buttons content for Interactive message. |
| `LinkContent` | Defines the Url or Click-To-Action content for Interactive message. |

## Common configuration

Follow these steps to add required code snippets to your .NET program.

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-net.md)]

## Code examples

The Messages SDK supports the following WhatsApp Interactive messages:

- [Send an Interactive List options message to a WhatsApp user](#send-an-interactive-list-options-message-to-a-whatsapp-user).
- [Send an Interactive Reply Button message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Click-to-action URL-based message to a WhatsApp user](#send-an-interactive-call-to-action-url-based-message-to-a-whatsapp-user).

### Send an Interactive List options message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages when initiated by WhatsApp users. To send list messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E.164 format](#set-recipient-list).
- List Message can be created using the given properties:

   | Action type | Description |
   | --- | --- |
   | `ActionGroupContent`    | This class defines the title of the group content and array of the group.    |
   | `ActionGroup`    | This class defines the title of the group and array of the group items.   |
   | `ActionGroupItem` | This class defines ID, Title, and description of the group Item. |
   | `WhatsAppListActionBindings`| This class defines the `ActionGroupContent` binding with the interactive message. |

> [!IMPORTANT]
> To send an interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends an interactive shipping options message to the user:

```csharp
using Azure.Communication.Messages;
using Azure.Communication.Messages.Models;

public async Task SendWhatsAppListMessage()
{
    var actionItemsList1 = new List<ActionGroupItem>
    {
        new ActionGroupItem("priority_express", "Priority Mail Express", "Next Day to 2 Days"),
        new ActionGroupItem("priority_mail", "Priority Mail", "1–3 Days")
    };

    var actionItemsList2 = new List<ActionGroupItem>
    {
        new ActionGroupItem("usps_ground_advantage", "USPS Ground Advantage", "2-5 Days"),
        new ActionGroupItem("media_mail", "Media Mail", "2-8 Days")
    };

    var groups = new List<ActionGroup>
    {
        new ActionGroup("I want it ASAP!", actionItemsList1),
        new ActionGroup("I can wait a bit", actionItemsList2)
    };

    var actionGroupContent = new ActionGroupContent("Shipping Options", groups);

    var interactionMessage = new InteractiveMessage(
        new TextMessageContent("Test Body"),
        new WhatsAppListActionBindings(actionGroupContent)
    );
    interactionMessage.Header = new TextMessageContent("Test Header");
    interactionMessage.Footer  = new TextMessageContent("Test Footer");

    var interactiveMessageContent = new InteractiveNotificationContent(
        channelRegistrationId,
        recipientList,
        interactionMessage
    );

    SendMessageResult response = await notificationMessagesClient.SendAsync(interactiveMessageContent);
    Console.WriteLine($"Message with ID {response.Receipts[0].MessageId} was successfully sent.");
}
```

### Send an interactive reply button message to a WhatsApp user

To send reply button messages:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E.164 format](#set-recipient-list).

Create reply button messages using the following properties:

   | Action type | Description |
   | --- | --- |
   | `ButtonSetContent`    | This class defines button set content for reply button messages.  |
   | `ButtonContent`    | This class defines ID and title of the reply buttons.  |
   | `WhatsAppButtonActionBindings`| This class defines the `ButtonSetContent` binding with the interactive message. |

```csharp
public async Task SendWhatsAppReplyButtonMessage()
{
    var replyButtonActionList = new List<ButtonContent>
    {
        new ButtonContent("cancel", "Cancel"),
        new ButtonContent("agree", "Agree")
    };

    var buttonSet = new ButtonSetContent(replyButtonActionList);

    var interactionMessage = new InteractiveMessage(
        new TextMessageContent("Test Body"),
        new WhatsAppButtonActionBindings(buttonSet)
    );
    interactionMessage.Header = new TextMessageContent("Test Header");
    interactionMessage.Footer  = new TextMessageContent("Test Footer");

    var interactiveMessageContent = new InteractiveNotificationContent(
        channelRegistrationId,
        recipientList,
        interactionMessage
    );

    SendMessageResult response = await notificationMessagesClient.SendAsync(interactiveMessageContent);
    Console.WriteLine($"Message with ID {response.Receipts[0].MessageId} was successfully sent.");
}
```

### Send an interactive call-to-action URL-based message to a WhatsApp user

To send click-to-action or URL-based messages:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E.164 format](#set-recipient-list).
- Call-To-Action Messages can be created using the following properties:

| Action type   | Description |
| --- | --- |
| `LinkContent`    | This class defines URL or link content for a message.  |
| `WhatsAppUrlActionBindings` | This class defines the `LinkContent` binding with the interactive message. |

```csharp
public async Task SendWhatsAppClickToActionMessage()
{
    var urlAction = new LinkContent("Test Url", new Uri("https://example.com/audio.mp3"));

    var interactionMessage = new InteractiveMessage(
        new TextMessageContent("Test Body"),
        new WhatsAppUrlActionBindings(urlAction)
    );
    interactionMessage.Header = new TextMessageContent("Test Header");
    interactionMessage.Footer  = new TextMessageContent("Test Footer");

    var interactiveMessageContent = new InteractiveNotificationContent(
        channelRegistrationId,
        recipientList,
        interactionMessage
    );

    SendMessageResult response = await notificationMessagesClient.SendAsync(interactiveMessageContent);
    Console.WriteLine($"WhatsApp CTA Message with ID {response.Receipts[0].MessageId} was successfully sent.");
}
```

### Run the code

To run the code:

#### [Visual Studio](#tab/visual-studio)
1. Build your solution by pressing **Ctrl+Shift+B**.
2. Run the program by pressing **Ctrl+F5**.

#### [.NET CLI](#tab/dotnet-cli)

Build and run your program.

```console
dotnet build
dotnet run
```

---

## Full sample code

```csharp
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Azure.Communication.Messages;
using Azure.Communication.Messages.Models;

namespace InteractiveMessagesQuickstart
{
    public class Program
    {
        private static Guid channelRegistrationId = new Guid("<Your Channel ID>");
        private static List<string> recipientList = new List<string> { "<Recipient's WhatsApp Phone Number>" };
        private static NotificationMessagesClient notificationMessagesClient = new NotificationMessagesClient("<Your Connection String>");

        public static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Send WhatsApp Interactive Messages");

            var program = new Program();
            await program.SendWhatsAppListMessage();
            await program.SendWhatsAppReplyButtonMessage();
            await program.SendWhatsAppClickToActionMessage();

            Console.WriteLine("All messages sent. Press any key to exit.");
            Console.ReadKey();
        }

        public async Task SendWhatsAppListMessage()
        {
            var actionItemsList1 = new List<ActionGroupItem>
            {
                new ActionGroupItem("priority_express", "Priority Mail Express", "Next Day to 2 Days"),
                new ActionGroupItem("priority_mail", "Priority Mail", "1–3 Days")
            };

            var actionItemsList2 = new List<ActionGroupItem>
            {
                new ActionGroupItem("usps_ground_advantage", "USPS Ground Advantage", "2-5 Days"),
                new ActionGroupItem("media_mail", "Media Mail", "2-8 Days")
            };

            var groups = new List<ActionGroup>
            {
                new ActionGroup("I want it ASAP!", actionItemsList1),
                new ActionGroup("I can wait a bit", actionItemsList2)
            };

            var actionGroupContent = new ActionGroupContent("Shipping Options", groups);

            var interactionMessage = new InteractiveMessage(
                new TextMessageContent("Test Body"),
                new WhatsAppListActionBindings(actionGroupContent)
            );
            interactionMessage.Header = new TextMessageContent("Test Header");
            interactionMessage.Footer  = new TextMessageContent("Test Footer");

            var interactiveMessageContent = new InteractiveNotificationContent(
                channelRegistrationId,
                recipientList,
                interactionMessage
            );

            SendMessageResult response = await notificationMessagesClient.SendAsync(interactiveMessageContent);
            Console.WriteLine($"Message with ID {response.Receipts[0].MessageId} was successfully sent.");
        }

        public async Task SendWhatsAppReplyButtonMessage()
        {
            var replyButtonActionList = new List<ButtonContent>
            {
                new ButtonContent("cancel", "Cancel"),
                new ButtonContent("agree", "Agree")
            };

            var buttonSet = new ButtonSetContent(replyButtonActionList);

            var interactionMessage = new InteractiveMessage(
                new TextMessageContent("Test Body"),
                new WhatsAppButtonActionBindings(buttonSet)
            );
            interactionMessage.Header = new TextMessageContent("Test Header");
            interactionMessage.Footer  = new TextMessageContent("Test Footer");

            var interactiveMessageContent = new InteractiveNotificationContent(
                channelRegistrationId,
                recipientList,
                interactionMessage
            );

            SendMessageResult response = await notificationMessagesClient.SendAsync(interactiveMessageContent);
            Console.WriteLine($"Message with ID {response.Receipts[0].MessageId} was successfully sent.");
        }

        public async Task SendWhatsAppClickToActionMessage()
        {
            var urlAction = new LinkContent("Test Url", new Uri("https://example.com/audio.mp3"));

            var interactionMessage = new InteractiveMessage(
                new TextMessageContent("Test Body"),
                new WhatsAppUrlActionBindings(urlAction)
            );
            interactionMessage.Header = new TextMessageContent("Test Header");
            interactionMessage.Footer  = new TextMessageContent("Test Footer");

            var interactiveMessageContent = new InteractiveNotificationContent(
                channelRegistrationId,
                recipientList,
                interactionMessage
            );

            SendMessageResult response = await notificationMessagesClient.SendAsync(interactiveMessageContent);
            Console.WriteLine($"WhatsApp CTA Message with ID {response.Receipts[0].MessageId} was successfully sent.");
        }
    }
}
```

