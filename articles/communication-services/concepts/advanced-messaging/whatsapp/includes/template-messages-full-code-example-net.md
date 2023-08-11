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
            await notificationMessagesClient.SendMessageAsync(sampleTemplateMessageOptions);

            // Send Sample Template sample_shipping_confirmation
            MessageTemplate shippingConfirmationTemplate = AssembleSampleShippingConfirmation();
            var shippingConfirmationTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, shippingConfirmationTemplate);
            await notificationMessagesClient.SendMessageAsync(shippingConfirmationTemplateMessageOptions);

            // Send Sample Template sample_movie_ticket_confirmation
            MessageTemplate movieTicketConfirmationTemplate = AssembleSampleMovieTicketConfirmation();
            var movieTicketConfirmationTemplateMessageOptions = new SendMessageOptions(channelRegistrationId, recipientList, movieTicketConfirmationTemplate);
            await notificationMessagesClient.SendMessageAsync(movieTicketConfirmationTemplateMessageOptions);

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

            var ThreeDays = new MessageTemplateText("threeDays", "3");
            IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue> { ThreeDays };
            MessageTemplateWhatsAppBindings bindings = new MessageTemplateWhatsAppBindings(
              body: new[] { ThreeDays.Name }
            );

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }

        public static MessageTemplate AssembleSampleMovieTicketConfirmation()
        {
            string templateName = "sample_movie_ticket_confirmation";
            string templateLanguage = "en_us";

            var image = new MessageTemplateImage("image", new Uri("https://aka.ms/acsicon1"));
            var title = new MessageTemplateText("title", "Contoso");
            var time = new MessageTemplateText("time", "July 1st, 2023 12:30PM");
            var venue = new MessageTemplateText("venue", "Southridge Video");
            var seats = new MessageTemplateText("seats", "Seat 1A");
            var values = new List<MessageTemplateValue> { image, title, time, venue, seats };
            var bindings = new MessageTemplateWhatsAppBindings(
              header: new[] { image.Name },
              body: new[] { title.Name, time.Name, venue.Name, seats.Name }
            );

            return new MessageTemplate(templateName, templateLanguage, values, bindings);
        }
    }
}
```
