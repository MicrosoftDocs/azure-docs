---
title: Include file
description: Include file
services: azure-communication-services
author: memontic-ms
ms.service: azure-communication-services
ms.subservice: messages
ms.date: 07/15/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
---

```csharp
using System;
using System.Collections.Generic;
using System.IO;
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

            // Authenticate the client
            string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");
            NotificationMessagesClient notificationMessagesClient =
                new NotificationMessagesClient(connectionString);

            await DownloadMediaWithStreamAsync(notificationMessagesClient);
            await DownloadMediaToFileAsync(notificationMessagesClient);

            Console.WriteLine("\n\nPress any key to exit.");
            Console.ReadKey();
        }

        public static async Task DownloadMediaWithStreamAsync(NotificationMessagesClient notificationMessagesClient)
        {
            // MediaId GUID of the media received in an incoming message.
            // Ex. "00000000-0000-0000-0000-000000000000"
            var mediaId = "<MediaId>";

            Response<Stream> fileResponse;
            try
            {
                // Download media to stream
                fileResponse = await notificationMessagesClient.DownloadMediaAsync(mediaId);

                Console.WriteLine(fileResponse.ToString());
            }
            catch (RequestFailedException e)
            {
                Console.WriteLine(e);
                return;
            }

            // File extension derived from the MIME type in the response headers.
            // Ex. A MIME type of "image/jpeg" would mean the fileExtension should be ".jpg"
            var contentType = fileResponse.GetRawResponse().Headers.ContentType;
            string fileExtension = GetFileExtension(contentType);

            // File location to write the media. 
            // Ex. @"c:\temp\media.jpg"
            string filePath = @"<FilePath>" + "<FileName>" + fileExtension;
            Console.WriteLine(filePath);

            // Write the media stream to the file
            using (Stream outStream = File.OpenWrite(filePath))
            {
                fileResponse.Value.CopyTo(outStream);
            }
        }

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

        public static async Task DownloadMediaToFileAsync(NotificationMessagesClient notificationMessagesClient)
        {
            // MediaId GUID of the media received in an incoming message.
            // Ex. "00000000-0000-0000-0000-000000000000"
            var mediaId = "<MediaId>";

            // File extension derived from the MIME type received in an incoming message
            // Ex. A MIME type of "image/jpeg" would mean the fileExtension should be ".jpg"
            string fileExtension = "<FileExtension>";

            // File location to write the media. 
            // Ex. @"c:\temp\media.jpg"
            string filePath = @"<FilePath>" + "<FileName>" + fileExtension;
            Console.WriteLine(filePath);

            try
            {
                // Download media to file
                Response response = await notificationMessagesClient.DownloadMediaToAsync(mediaId, filePath);

                Console.WriteLine(response.ToString());
            }
            catch (RequestFailedException e)
            {
                Console.WriteLine(e);
                return;
            }
        }
    }
}
```
