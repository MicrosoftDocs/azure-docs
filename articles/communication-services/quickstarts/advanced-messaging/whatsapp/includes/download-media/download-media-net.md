---
title: Include file
description: Include file
services: azure-communication-services
author: memontic
ms.service: azure-communication-services
ms.date: 07/15/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md)
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
dotnet new console -o AdvancedMessagingDownloadMediaQuickstart
```

Next, navigate to your project directory and build your project.

```console
cd AdvancedMessagingDownloadMediaQuickstart
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

namespace AdvancedMessagingDownloadMediaQuickstart
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Download WhatsApp message media");

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

| Name                                                                                                             | Description                                                                                                 |
|------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| [NotificationMessagesClient](/dotnet/api/azure.communication.messages.notificationmessagesclient)                | This class connects to your Azure Communication Services resource. It sends the messages.                   |
| [DownloadMediaAsync](/dotnet/api/azure.communication.messages.notificationmessagesclient.downloadmediaasync)     | Download the media payload from a User to Business message asynchronously, writing the content to a stream. |
| [DownloadMediaToAsync](/dotnet/api/azure.communication.messages.notificationmessagesclient.downloadmediatoasync) | Download the media payload from a User to Business message asynchronously, writing the content to a file.   |

## Code examples

Follow these steps to add the necessary code snippets to the Main function of your *Program.cs* file.

- [Authenticate the client](#authenticate-the-client)
- [Download the media payload to a stream](#download-the-media-payload-to-a-stream)
- [Download the media payload to a file](#download-the-media-payload-to-a-file)

### Authenticate the client   

The `NotificationMessagesClient` is used to connect to your Azure Communication Services resource.    

[!INCLUDE [Authenticate the NotificationMessagesClient](./../authenticate-notification-messages-client-net.md)]

### Download the media payload to a stream   

The Messages SDK allows Contoso to download the media in received WhatsApp media messages from WhatsApp users. To download the media payload to a stream, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- The media ID GUID of the media (Received in an incoming message)


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

Download the media to the destination stream:
```csharp
// Download media to stream
Response<Stream> fileResponse = await notificationMessagesClient.DownloadMediaAsync(mediaId);
```

The media payload is now available in the response stream.    
Continue on with this example to write the stream to a file.

The media ID and MIME type of the payload are available in the AdvancedMessageReceived event. However, when downloading media to a stream, the MIME type is again available to you in the `Response<Stream>`.
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

Define the file location of where you want to write the media.
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

The Messages SDK allows Contoso to download the media in WhatsApp media messages received from WhatsApp users. To download the media payload to a file, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- The media ID GUID of the media (Received in an incoming message)
- The media file extension (Derived from the MIME type received in an incoming message)
- The destination file name (Generated name of your choosing)
- The destination file path (File path of your choosing)

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

Download the media to the destination path:
```csharp
// Download media to file
Response response = await notificationMessagesClient.DownloadMediaToAsync(mediaId, filePath);
```

## Run the code

Build and run your program.  

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

[!INCLUDE [Full code example with .NET](./download-media-full-example-net.md)]
