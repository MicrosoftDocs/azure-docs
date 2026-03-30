---
title: Include file
description: Include file
services: azure-communication-services
author: memontic
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 05/01/2025
ms.topic: include
ms.custom: include file
ms.author: memontic
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- .NET development environment, such as [Visual Studio](https://visualstudio.microsoft.com/downloads/), [Visual Studio Code](https://code.visualstudio.com/Download), or [.NET CLI](https://dotnet.microsoft.com/download).
- Event subscription and handling of [Advanced Message Received events](./../../handle-advanced-messaging-events.md#subscribe-to-advanced-messaging-events).

## Set up environment

[!INCLUDE [Setting up for .NET Application](../dot-net-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for .NET.

| Name | Description |
| --- | --- |
| [NotificationMessagesClient](/dotnet/api/azure.communication.messages.notificationmessagesclient)                | This class connects to your Azure Communication Services resource. It sends the messages.                   |
| [DownloadMediaAsync](/dotnet/api/azure.communication.messages.notificationmessagesclient.downloadmediaasync)     | Download the media payload from a User to Business message asynchronously, writing the content to a stream. |
| [DownloadMediaToAsync](/dotnet/api/azure.communication.messages.notificationmessagesclient.downloadmediatoasync) | Download the media payload from a User to Business message asynchronously, writing the content to a file.   |
| [Microsoft.Communication.AdvancedMessageReceived](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event) | Event Grid event that is published when Advanced Messaging receives a message. |

## Common configuration

Follow these steps to add required code snippets to the messages-quickstart.py python program.

- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-net.md)]

## Code examples

Follow these steps to add required code snippets to the Main function of your `Program.cs` file.
- [Download the media payload to a stream](#download-the-media-payload-to-a-stream)
- [Download the media payload to a file](#download-the-media-payload-to-a-file)

### Download the media payload to a stream   

The Messages SDK enables Contoso to download the media in received WhatsApp media messages from WhatsApp users. To download the media payload to a stream, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- The media ID GUID of the media, received from an incoming message in an [AdvancedMessageReceived event](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event).


Define the media ID of the media you want to fetch.

```csharp
// MediaId GUID of the media received in an incoming message.
// Ex. "00000000-0000-0000-0000-000000000000"
var mediaId = "<MediaId>";
```

Download the media to the destination stream.

```csharp
// Download media to stream
Response<Stream> fileResponse = await notificationMessagesClient.DownloadMediaAsync(mediaId);
```

The media payload is now available in the response stream.

Continue with this example to write the stream to a file.

The media ID and MIME type of the payload are available in the [media content](/azure/event-grid/communication-services-advanced-messaging-events#mediacontent) of the [AdvancedMessageReceived event](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event). However, when downloading media to a stream, the MIME type is again available to you in the response headers in the `Response<Stream>`.

In either case, you need to convert the MIME type into a file type. Define this helper for the conversion.

```csharp
private static string GetFileExtension(string contentType)
{
    return MimeTypes.TryGetValue(contentType, out var extension) ? extension : string.Empty;
}

private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>
{
    { "application/pdf", ".pdf" },
    { "image/jpeg", ".jpg" },
    { "image/png", ".png" },
    { "video/mp4", ".mp4" },
    // Add more mappings as needed
};
```

Define the file location where you want to write the media. This example uses the MIME type returned in the response headers from `DownloadMediaAsync`.

```csharp
// File extension derived from the MIME type in the response headers.
// Ex. A MIME type of "image/jpeg" would mean the fileExtension should be ".jpg"
var contentType = fileResponse.GetRawResponse().Headers.ContentType;
string fileExtension = GetFileExtension(contentType);

// File location to write the media. 
// Ex. @"c:\temp\media.jpg"
string filePath = @"<FilePath>" + "<FileName>" + fileExtension;
```

Write the stream to the file.

```csharp
 // Write the media stream to the file
using (Stream outStream = File.OpenWrite(filePath))
{
    fileResponse.Value.CopyTo(outStream);
}
```

### Download the media payload to a file   

The Messages SDK enables Contoso to download the media in WhatsApp media messages received from WhatsApp users. To download the media payload to a file, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- The media ID GUID of the media, received from an incoming message in an [AdvancedMessageReceived event](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event).
- The media file extension, derived from the MIME type received in an incoming message with [media content](/azure/event-grid/communication-services-advanced-messaging-events#mediacontent).
- The destination file name of your choosing.
- The destination file path of your choosing.

Define the media ID of the media you want to fetch and the file location of where you want to write the media.

```csharp
// MediaId GUID of the media received in an incoming message.
// Ex. "00000000-0000-0000-0000-000000000000"
var mediaId = "<MediaId>";

// File extension derived from the MIME type received in an incoming message
// Ex. A MIME type of "image/jpeg" would mean the fileExtension should be ".jpg"
string fileExtension = "<FileExtension>";
// File location to write the media. 
// Ex. @"c:\temp\media.jpg"
string filePath = @"<FilePath>" + "<FileName>" + fileExtension; 
```

Download the media to the destination path.

```csharp
// Download media to file
Response response = await notificationMessagesClient.DownloadMediaToAsync(mediaId, filePath);
```

### Run the code

Build and run your program.  

#### [Visual Studio](#tab/visual-studio)

1. To compile your code, press **Ctrl**+**F7**.
1. To run the program without debugging, press **Ctrl**+**F5**.

#### [Visual Studio Code](#tab/vs-code)

Build and run your program in the Visual Studio Code Terminal (**View** > **Terminal**).

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

[!INCLUDE [Full code example with .NET](./download-media-full-example-net.md)]
