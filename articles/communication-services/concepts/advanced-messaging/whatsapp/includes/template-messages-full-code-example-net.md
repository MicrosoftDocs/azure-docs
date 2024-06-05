---
title: Include file
description: Include file
services: azure-communication-services
author: glorialimicrosoft
ms.service: azure-communication-services
ms.subservice: messages
ms.date: 02/02/2024
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
using Azure.Communication.Messages.Models.Channels;

namespace SendTemplateMessages
{
    class Program
    {
        public static async Task Main(string[] args)
        {
            Console.WriteLine("Azure Communication Services - Send WhatsApp Template Messages\n");

            string connectionString = Environment.GetEnvironmentVariable("COMMUNICATION_SERVICES_CONNECTION_STRING");

            NotificationMessagesClient notificationMessagesClient = new NotificationMessagesClient(connectionString);

            var channelRegistrationId = new Guid("<Your Channel ID>");
            var recipientList = new List<string> { "<Recipient's WhatsApp Phone Number>" };

            // List out available templates for a channel ID
            MessageTemplateClient messageTemplateClient = new MessageTemplateClient(connectionString);
            Pageable<MessageTemplateItem> templates = messageTemplateClient.GetTemplates(channelRegistrationId);
            foreach (WhatsAppMessageTemplateItem template in templates)
            {
                Console.WriteLine("Name: {0}\tLanguage: {1}\tStatus: {2}\tContent: {3}\n",
                    template.Name, template.Language, template.Status, template.Content);
            }

            // Send Sample Template sample_template
            MessageTemplate sampleTemplate = AssembleSampleTemplate();
            var sampleTemplateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, sampleTemplate);
            var result = await notificationMessagesClient.SendAsync(sampleTemplateContent);
            PrintResponse(result);
           
            // Send sample template sample_shipping_confirmation
            MessageTemplate shippingConfirmationTemplate = AssembleSampleShippingConfirmation();
            var shippingConfirmationTemplateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, shippingConfirmationTemplate);
            result = await notificationMessagesClient.SendAsync(shippingConfirmationTemplateContent);
            PrintResponse(result);

            // Send sample template sample_movie_ticket_confirmation
            MessageTemplate movieTicketConfirmationTemplate = AssembleSampleMovieTicketConfirmation();
            var movieTicketConfirmationTemplateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, movieTicketConfirmationTemplate);
            result = await notificationMessagesClient.SendAsync(movieTicketConfirmationTemplateContent);
            PrintResponse(result);

            // Send sample template sample_happy_hour_announcement
            MessageTemplate happyHourTemplate = AssembleSampleHappyHourAnnouncement();
            var happyHourTemplateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, happyHourTemplate);
            result = await notificationMessagesClient.SendAsync(happyHourTemplateContent);
            PrintResponse(result);

            // Send sample template sample_flight_confirmation
            MessageTemplate flightConfirmationTemplate = AssembleSampleFlightConfirmation();
            var flightConfirmationTemplateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, flightConfirmationTemplate);
            result = await notificationMessagesClient.SendAsync(flightConfirmationTemplateContent);
            PrintResponse(result);

            // Send sample template sample_issue_resolution
            MessageTemplate issueResolutionTemplate = AssembleSampleIssueResolution();
            var issueResolutionTemplateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, issueResolutionTemplate);
            result = await notificationMessagesClient.SendAsync(issueResolutionTemplateContent);
            PrintResponse(result);

            // Send sample template sample_purchase_feedback
            MessageTemplate purchaseFeedbackTemplate = AssembleSamplePurchaseFeedback();
            var purchaseFeedbackTemplateContent = new TemplateNotificationContent(channelRegistrationId, recipientList, purchaseFeedbackTemplate);
            result = await notificationMessagesClient.SendAsync(purchaseFeedbackTemplateContent);
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

            WhatsAppMessageTemplateBindings bindings = new();
            bindings.Body.Add(new(threeDays.Name));

            MessageTemplate shippingConfirmationTemplate = new(templateName, templateLanguage);
            shippingConfirmationTemplate.Bindings = bindings;
            shippingConfirmationTemplate.Values.Add(threeDays);

            return shippingConfirmationTemplate;
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

            WhatsAppMessageTemplateBindings bindings = new();
            bindings.Header.Add(new(image.Name));
            bindings.Body.Add(new(title.Name));
            bindings.Body.Add(new(time.Name));
            bindings.Body.Add(new(venue.Name));
            bindings.Body.Add(new(seats.Name));

            MessageTemplate movieTicketConfirmationTemplate = new(templateName, templateLanguage);
            movieTicketConfirmationTemplate.Values.Add(image);
            movieTicketConfirmationTemplate.Values.Add(title);
            movieTicketConfirmationTemplate.Values.Add(time);
            movieTicketConfirmationTemplate.Values.Add(venue);
            movieTicketConfirmationTemplate.Values.Add(seats);
            movieTicketConfirmationTemplate.Bindings = bindings;

            return movieTicketConfirmationTemplate;
        }

        public static MessageTemplate AssembleSampleHappyHourAnnouncement()
        {
            string templateName = "sample_happy_hour_announcement";
            string templateLanguage = "en_us";
            var videoUrl = new Uri("< Your .mp4 Video URL >");

            var video = new MessageTemplateVideo("video", videoUrl);
            var venue = new MessageTemplateText("venue", "Fourth Coffee");
            var time = new MessageTemplateText("time", "Today 2-4PM");
            WhatsAppMessageTemplateBindings bindings = new();
            bindings.Header.Add(new(video.Name));
            bindings.Body.Add(new(venue.Name));
            bindings.Body.Add(new(time.Name));

            MessageTemplate happyHourAnnouncementTemplate = new(templateName, templateLanguage);
            happyHourAnnouncementTemplate.Values.Add(venue);
            happyHourAnnouncementTemplate.Values.Add(time);
            happyHourAnnouncementTemplate.Values.Add(video);
            happyHourAnnouncementTemplate.Bindings = bindings;

            return happyHourAnnouncementTemplate;
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

            WhatsAppMessageTemplateBindings bindings = new();
            bindings.Header.Add(new(document.Name));
            bindings.Body.Add(new(firstName.Name));
            bindings.Body.Add(new(lastName.Name));
            bindings.Body.Add(new(date.Name));

            MessageTemplate flightConfirmationTemplate = new(templateName, templateLanguage);
            flightConfirmationTemplate.Values.Add(document);
            flightConfirmationTemplate.Values.Add(firstName);
            flightConfirmationTemplate.Values.Add(lastName);
            flightConfirmationTemplate.Values.Add(date);
            flightConfirmationTemplate.Bindings = bindings;

            return flightConfirmationTemplate;
        }

        public static MessageTemplate AssembleSampleIssueResolution()
        {
            string templateName = "sample_issue_resolution";
            string templateLanguage = "en_us";

            var name = new MessageTemplateText(name: "name", text: "Kat");
            var yes = new MessageTemplateQuickAction(name: "Yes"){ Payload =  "Kat said yes" };
            var no = new MessageTemplateQuickAction(name: "No") { Payload = "Kat said no" };

            WhatsAppMessageTemplateBindings bindings = new();
            bindings.Body.Add(new(name.Name));
            bindings.Buttons.Add(new(WhatsAppMessageButtonSubType.QuickReply.ToString(), yes.Name));
            bindings.Buttons.Add(new(WhatsAppMessageButtonSubType.QuickReply.ToString(), no.Name));

            MessageTemplate issueResolutionTemplate = new(templateName, templateLanguage);
            issueResolutionTemplate.Values.Add(name);
            issueResolutionTemplate.Values.Add(yes);
            issueResolutionTemplate.Values.Add(no);
            issueResolutionTemplate.Bindings = bindings;

            return issueResolutionTemplate;
        }

        public static MessageTemplate AssembleSamplePurchaseFeedback()
        {
            
            string templateName = "sample_purchase_feedback";
            string templateLanguage = "en_us";
            var imageUrl = new Uri("https://aka.ms/acsicon1");

            var image = new MessageTemplateImage(name: "image", uri: imageUrl);
            var product = new MessageTemplateText(name: "product", text: "coffee");
            var urlSuffix = new MessageTemplateQuickAction(name: "text") { Text = "survey-code"};
            
            WhatsAppMessageTemplateBindings bindings = new();
            bindings.Header.Add(new(image.Name));
            bindings.Body.Add(new(product.Name));
            bindings.Buttons.Add(new(WhatsAppMessageButtonSubType.Url.ToString(), urlSuffix.Name));

            MessageTemplate purchaseFeedbackTemplate = new(templateName, templateLanguage);
            purchaseFeedbackTemplate.Values.Add(image);
            purchaseFeedbackTemplate.Values.Add(product);
            purchaseFeedbackTemplate.Values.Add(urlSuffix);
            purchaseFeedbackTemplate.Bindings = bindings;

            return purchaseFeedbackTemplate;
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
