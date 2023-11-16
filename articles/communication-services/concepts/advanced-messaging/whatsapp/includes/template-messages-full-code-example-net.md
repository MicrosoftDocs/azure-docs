---
title: include file
description: include file
services: azure-communication-services
author: memontic-ms
manager: 
ms.service: azure-communication-services
ms.subservice: messages
ms.date: 07/12/2023
ms.topic: include
ms.custom: include file
ms.author: memontic
---

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Azure;
using Azure.Communication.Messages;

namespace SendTemplateMessages
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Send WhatsApp Template Messages\n");

            string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");

            NotificationMessagesClient notificationMessagesClient = new NotificationMessagesClient(connectionString);

            string channelRegistrationId = "<Your Channel ID>";
            var recipientList = new List<string> { "<Recipient's WhatsApp Phone Number>" };

            // List out available templates for a channel ID
            MessageTemplateClient messageTemplateClient = new MessageTemplateClient(connectionString);
            Pageable<MessageTemplateItem> templates = messageTemplateClient.GetTemplates(channelRegistrationId);
            foreach (MessageTemplateItem template in templates)
            {
                Console.WriteLine("Name: {0}\tLanguage: {1}\tStatus: {2}\tChannelType: {3}\nContent: {4}\n",
                    template.Name, template.Language, template.Status, template.ChannelType, template.WhatsApp.Content);
            }

            // Send Sample Template sample_template
            MessageTemplate sampleTemplate = AssembleSampleTemplate();
            var sampleTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, sampleTemplate);
            var result = await notificationMessagesClient.SendMessageAsync(sampleTemplateMessageOptions);
            PrintResponse(result);
           
            // Send sample template sample_shipping_confirmation
            MessageTemplate shippingConfirmationTemplate = AssembleSampleShippingConfirmation();
            var shippingConfirmationTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, shippingConfirmationTemplate);
            result = await notificationMessagesClient.SendMessageAsync(shippingConfirmationTemplateMessageOptions);
            PrintResponse(result);

            // Send sample template sample_movie_ticket_confirmation
            MessageTemplate movieTicketConfirmationTemplate = AssembleSampleMovieTicketConfirmation();
            var movieTicketConfirmationTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, movieTicketConfirmationTemplate);
            result = await notificationMessagesClient.SendMessageAsync(movieTicketConfirmationTemplateMessageOptions);
            PrintResponse(result);

            // Send sample template sample_happy_hour_announcement
            MessageTemplate happyHourTemplate = AssembleSampleHappyHourAnnouncement();
            var happyHourTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, happyHourTemplate);
            result = await notificationMessagesClient.SendMessageAsync(happyHourTemplateMessageOptions);
            PrintResponse(result);

            // Send sample template sample_flight_confirmation
            MessageTemplate flightConfirmationTemplate = AssembleSampleFlightConfirmation();
            var flightConfirmationTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, flightConfirmationTemplate);
            result = await notificationMessagesClient.SendMessageAsync(flightConfirmationTemplateMessageOptions);
            PrintResponse(result);

            // Send sample template sample_issue_resolution
            MessageTemplate issueResolutionTemplate = AssembleSampleIssueResolution();
            var issueResolutionTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, issueResolutionTemplate);
            result = await notificationMessagesClient.SendMessageAsync(issueResolutionTemplateMessageOptions);
            PrintResponse(result);

            // Send sample template sample_purchase_feedback
            MessageTemplate purchaseFeedbackTemplate = AssembleSamplePurchaseFeedback();
            var purchaseFeedbackTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, purchaseFeedbackTemplate);
            result = await notificationMessagesClient.SendMessageAsync(purchaseFeedbackTemplateMessageOptions);
            PrintResponse(result);

            Console.WriteLine("Press any key to exit.");
            Console.ReadKey(true);
        }

        public static MessageTemplate AssembleSampleTemplate()
        {
            string templateName = "sample_template";
            string templateLanguage = "en_us";

            return new MessageTemplate(templateName, templateLanguage);
        }

        public static MessageTemplate AssembleSampleShippingConfirmation()
        {
            string templateName = "sample_shipping_confirmation";
            string templateLanguage = "en_us";

            var threeDays = new MessageTemplateText("threeDays", "3");
            IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
            {
                threeDays
            };
            var bindings = new MessageTemplateWhatsAppBindings(
              body: new[] { threeDays.Name });

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }

        public static MessageTemplate AssembleSampleMovieTicketConfirmation()
        {
            string templateName = "sample_movie_ticket_confirmation";
            string templateLanguage = "en_us";
            var imageUrl = new Uri("https://aka.ms/acsicon1");

            var image = new MessageTemplateImage("image", imageUrl);
            var title = new MessageTemplateText("title", "Contoso");
            var time = new MessageTemplateText("time", "July 1st, 2023 12:30PM");
            var venue = new MessageTemplateText("venue", "Southridge Video");
            var seats = new MessageTemplateText("seats", "Seat 1A");

            IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
            {
                image,
                title,
                time,
                venue,
                seats
            };
            var bindings = new MessageTemplateWhatsAppBindings(
              header: new[] { image.Name },
              body: new[] { title.Name, time.Name, venue.Name, seats.Name });

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }

        public static MessageTemplate AssembleSampleHappyHourAnnouncement()
        {
            string templateName = "sample_happy_hour_announcement";
            string templateLanguage = "en_us";
            var videoUrl = new Uri("< Your .mp4 Video URL >");

            var venue = new MessageTemplateText("venue", "Fourth Coffee");
            var time = new MessageTemplateText("time", "Today 2-4PM");
            var video = new MessageTemplateVideo("video", videoUrl);

            IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
            {
                venue,
                time,
                video
            };
            var bindings = new MessageTemplateWhatsAppBindings(
                header: new[] { video.Name },
                body: new[] { venue.Name, time.Name });

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }

        public static MessageTemplate AssembleSampleFlightConfirmation()
        {
            string templateName = "sample_flight_confirmation";
            string templateLanguage = "en_us";
            var documentUrl = new Uri("< Your .pdf document URL >");

            var document = new MessageTemplateDocument("document", documentUrl);
            var firstName = new MessageTemplateText("firstName", "Kat");
            var lastName = new MessageTemplateText("lastName", "Larssen");
            var date = new MessageTemplateText("date", "July 1st, 2023");

            IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
            {
                document,
                firstName,
                lastName,
                date
            };
            var bindings = new MessageTemplateWhatsAppBindings(
                header: new[] { document.Name },
                body: new[] { firstName.Name, lastName.Name, date.Name });

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }

        public static MessageTemplate AssembleSampleIssueResolution()
        {
            string templateName = "sample_issue_resolution";
            string templateLanguage = "en_us";

            var name = new MessageTemplateText(name: "name", text: "Kat");
            var yes = new MessageTemplateQuickAction(name: "Yes", payload: "Kat said yes");
            var no = new MessageTemplateQuickAction(name: "No", payload: "Kat said no");

            IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
            {
                name,
                yes,
                no
            };
            var bindings = new MessageTemplateWhatsAppBindings(
                body: new[] { name.Name },
                button: new[] {
                    new KeyValuePair<string, MessageTemplateValueWhatsAppSubType>(yes.Name,
                        MessageTemplateValueWhatsAppSubType.QuickReply),
                    new KeyValuePair<string, MessageTemplateValueWhatsAppSubType>(no.Name,
                        MessageTemplateValueWhatsAppSubType.QuickReply)
                });

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }

        public static MessageTemplate AssembleSamplePurchaseFeedback()
        {
            string templateName = "sample_purchase_feedback";
            string templateLanguage = "en_us";
            var imageUrl = new Uri("https://aka.ms/acsicon1");

            var image = new MessageTemplateImage(name: "image", uri: imageUrl);
            var product = new MessageTemplateText(name: "product", text: "coffee");
            var urlSuffix = new MessageTemplateQuickAction(name: "text", text: "survey-code");

            IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
            {
                image,
                product,
                urlSuffix
            };
            var bindings = new MessageTemplateWhatsAppBindings(
                header: new[] { image.Name },
                body: new[] { product.Name },
                button: new[]
                {
                    new KeyValuePair<string, MessageTemplateValueWhatsAppSubType>(urlSuffix.Name,
                        MessageTemplateValueWhatsAppSubType.Url)
                });

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }

        public static void PrintResponse(Response<SendMessageResult> response)
        {
            Console.WriteLine($"Response: {response.GetRawResponse().Status} " +
                $"({response.GetRawResponse().ReasonPhrase})");
            Console.WriteLine($"Date: " +
                $"{response.GetRawResponse().Headers.First(header => header.Name == "Date").Value}");
            Console.WriteLine($"ClientRequestId: {response.GetRawResponse().ClientRequestId}");
            Console.WriteLine($"MS-CV: " +
                $"{response.GetRawResponse().Headers.First(header => header.Name == "MS-CV").Value}");
            foreach (var receipts in response.Value.Receipts)
            {
                Console.WriteLine($"MessageId: {receipts.MessageId}");
            }
            Console.WriteLine($"\n");
        }
    }
}
```
