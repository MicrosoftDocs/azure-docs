---
title: Include file
description: Include file
services: azure-communication-services
author: memontic
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 07/15/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
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
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `MessageTemplate`             | Defines which template you use and the content of the template properties for your message. |
| `TemplateNotificationContent` | Defines the "who" and the "what" of the template message you intend to send.                |
| `TextNotificationContent`     | Defines the "who" and the "what" of the text message you intend to send.                    |
| `ImageNotificationContent`    | Defines the "who" and the "what" of the image media message you intend to send.             |
| `DocumentNotificationContent` | Defines the "who" and the "what" of the Document media message you intend to send.          |
| `VideoNotificationContent`    | Defines the "who" and the "what" of the Video media message you intend to send.             |
| `AudioNotificationContent`    | Defines the "who" and the "what" of the Audio media message you intend to send.             |


> [!NOTE]
> For more information, see the Azure SDK for .NET reference [Azure.Communication.Messages Namespace](/dotnet/api/azure.communication.messages).

## Common configuration

Follow these steps to add required code snippets to the messages-quickstart.py python program.

- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-net.md)]

## Code examples

Follow these steps to add required code snippets to the Main function of your `Program.cs` file.
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user).
- [Send an image media message to a WhatsApp user](#send-an-image-media-message-to-a-whatsapp-user).
- [Send a document media message to a WhatsApp user](#send-a-document-media-message-to-a-whatsapp-user).
- [Send an audio media message to a WhatsApp user](#send-an-audio-media-message-to-a-whatsapp-user).
- [Send a video media message to a WhatsApp user](#send-a-video-media-message-to-a-whatsapp-user).

> [!IMPORTANT]
> To send a text or media message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

### Send a text message to a WhatsApp user

The Messages SDK allows Contoso to send WhatsApp text messages, which initiated WhatsApp users initiated. To send a text message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- [WhatsApp channel ID](#set-channel-registration-id)
- [Recipient phone number in E16 format](#set-recipient-list)
- Message body/text to be sent

In this example, we reply to the WhatsApp user with the text: `"Thanks for your feedback.\n From Notification Messaging SDK."`

Assemble and send the text message:
```csharp
// Assemble text message
var textContent = 
    new TextNotificationContent(channelRegistrationId, recipientList, "Thanks for your feedback.\n From Notification Messaging SDK");

// Send text message
Response<SendMessageResult> sendTextMessageResult = 
    await notificationMessagesClient.SendAsync(textContent);
```

### Send an image media message to a WhatsApp user

The Messages SDK enables Contoso to send WhatsApp media messages to WhatsApp users. To send an embedded media message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- [WhatsApp channel ID](#set-channel-registration-id).
- [Recipient phone number in E16 format](#set-recipient-list).
- URI of the image Media.

> [!IMPORTANT]
> As of SDK version 1.1.0, `MediaNotificationContent` is being deprecated for images. We encourage you to use `ImageNotificationContent` for sending images. Explore other content-specific classes for other media types like `DocumentNotificationContent`, `VideoNotificationContent`, and `AudioNotificationContent`.

Assemble the image message:

```csharp
var imageLink = new Uri("https://example.com/image.jpg");
var imageNotificationContent = new ImageNotificationContent(channelRegistrationId, recipientList, imageLink)  
{  
    Caption = "Check out this image."  
};
```

Send the image message:

```csharp
var imageResponse = await notificationMessagesClient.SendAsync(imageNotificationContent);
```

### Send a document media message to a WhatsApp user

The Messages SDK enables Contoso to send WhatsApp media messages to WhatsApp users. To send an embedded media message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- [WhatsApp channel ID](#set-channel-registration-id).
- [Recipient phone number in E16 format](#set-recipient-list).
- URI of the document Media.

Assemble the document content:

```csharp
var documentLink = new Uri("https://example.com/document.pdf");
var documentNotificationContent = new DocumentNotificationContent(channelRegistrationId, recipientList, documentLink)  
{  
    Caption = "Check out this document.",  
    FileName = "document.pdf"  
};
```

Send the document message:

```csharp
var documentResponse = await notificationMessagesClient.SendAsync(documentNotificationContent);
```

### Send a video media message to a WhatsApp user

The Messages SDK enables Contoso to send WhatsApp media messages to WhatsApp users. To send an embedded media message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- [WhatsApp channel ID](#set-channel-registration-id).
- [Recipient phone number in E16 format](#set-recipient-list).
- URI of the video media.

Assemble the video message:

```csharp
var videoLink = new Uri("https://example.com/video.mp4");
var videoNotificationContent = new VideoNotificationContent(channelRegistrationId, recipientList, videoLink)  
{  
    Caption = "Check out this video."  
};
```

Send the video message:

```csharp
var videoResponse = await notificationMessagesClient.SendAsync(videoNotificationContent);
```

### Send an audio media message to a WhatsApp user

The Messages SDK enables Contoso to send WhatsApp media messages to WhatsApp users. To send an embedded media message, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- [WhatsApp channel ID](#set-channel-registration-id).
- [Recipient phone number in E16 format](#set-recipient-list).
- URI of the audio media.

Assemble the audio message:

```csharp
var audioLink = new Uri("https://example.com/audio.mp3");
var audioNotificationContent = new AudioNotificationContent(channelRegistrationId, recipientList, audioLink);
```

Send the audio message:

```csharp
var audioResponse = await notificationMessagesClient.SendAsync(audioNotificationContent);
```

### Run the code

Build and run your program.  

To send a text or media message to a WhatsApp user, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user.

If you don't have an active conversation, for this example add a wait between sending the template message and sending the text message. This added delay gives you enough time to reply to the business on the user's WhatsApp account. For reference, the full example at [Sample code](#full-sample-code) prompts for manual user input before sending the next message.
  
If successful, you receive three messages on the user's WhatsApp account.

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

[!INCLUDE [Full code example with .NET](./messages-get-started-full-example-net.md)]
