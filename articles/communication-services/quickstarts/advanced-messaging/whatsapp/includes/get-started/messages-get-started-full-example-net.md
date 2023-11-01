---
title: include file
description: include file
services: azure-communication-services
author: memontic-ms
manager: 
ms.service: azure-communication-services
ms.subservice: messages
ms.date: 08/22/2023
ms.topic: include
ms.custom: include file
ms.author: memontic
---

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

            string channelRegistrationId = "<Your Channel ID>";
            var recipientList = new List<string> { "<Recipient's WhatsApp Phone Number>" };

            // Send sample template sample_template
            string templateName = "sample_template";
            string templateLanguage = "en_us";
            MessageTemplate sampleTemplate = new MessageTemplate(templateName, templateLanguage);
            SendMessageOptions sampleTemplateMessageOptions = 
                new SendMessageOptions(channelRegistrationId, recipientList, sampleTemplate);
            Response<SendMessageResult> sendTemplateMessageResult = 
                await notificationMessagesClient.SendMessageAsync(sampleTemplateMessageOptions);

            PrintResult(sendTemplateMessageResult);
            Console.WriteLine("Template message sent.\nWait until the WhatsApp user responds " +
                "to the template message, then press any key to continue.\n");
            Console.ReadKey();

            // Send a text message
            string messageText = "Thanks for your feedback.";
            SendMessageOptions sendTextMessageOptions =
                new SendMessageOptions(channelRegistrationId, recipientList, messageText);
            Response<SendMessageResult> sendTextMessageResult =
                await notificationMessagesClient.SendMessageAsync(sendTextMessageOptions);

            PrintResult(sendTextMessageResult);
            Console.WriteLine($"Text message sent to my phoneNumber.\nPress any key to continue.\n");
            Console.ReadKey();

            // Send a media message
            Uri uri = new Uri("https://aka.ms/acsicon1");
            SendMessageOptions sendMediaMessageOptions =
                new SendMessageOptions(channelRegistrationId, recipientList, uri);
            Response<SendMessageResult> sendMediaMessageResult =
                await notificationMessagesClient.SendMessageAsync(sendMediaMessageOptions);

            PrintResult(sendMediaMessageResult);
            Console.WriteLine("Media message sent.\nPress any key to exit.\n");
            Console.ReadKey();
        }

        public static void PrintResult(Response<SendMessageResult> result)
        {
            Console.WriteLine($"Response: {result.GetRawResponse().Status} " +
                $"({result.GetRawResponse().ReasonPhrase})");
            Console.WriteLine($"Date: " +
                $"{result.GetRawResponse().Headers.First(header => header.Name == "Date").Value}");
            Console.WriteLine($"ClientRequestId: {result.GetRawResponse().ClientRequestId}");
            Console.WriteLine($"MS-CV: " +
                $"{result.GetRawResponse().Headers.First(header => header.Name == "MS-CV").Value}");
            foreach (var receipts in result.Value.Receipts)
            {
                Console.WriteLine($"MessageId: {receipts.MessageId}");
            }
            Console.WriteLine($"\n");
        }
    }
}
```