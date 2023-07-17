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

### Use (default) template sample_template

This template takes no parameters.

```dotnetcli
string templateName = "sample_template"; 
string templateLanguage = "en_us"; 

var shippingConfirmationTemplate = new MessageTemplate(templateName, templateLanguage); 

``````

### Use sample_shipping_confirmation template

Some templates take parameters. Only include the parameters which are required by the template. Including parameters not in the template is invalid.

```dotnetcli
string templateName = "sample_shipping_confirmation"; 
string templateLanguage = "en_us"; 

var ThreeDays = new MessageTemplateTextValue("threeDays", "3");
IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue> { ThreeDays };
MessageTemplateWhatsAppBindings bindings = new MessageTemplateWhatsAppBindings(
  body: new[] { ThreeDays.Name }
);
var shippingConfirmationTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings); 

``````

### Use sample_movie_ticket_confirmation template

```dotnetcli
string templateName = "sample_movie_ticket_confirmation"; 
string templateLanguage = "en_us"; 

var image = new MessageTemplateImageValue("image", new Uri(ImageUrl));
var title = new MessageTemplateTextValue("title", "Avengers");
var time = new MessageTemplateTextValue("time", "July 1st, 2023 12:30PM");
var venue = new MessageTemplateTextValue("venue", "Cineplex");
var seats = new MessageTemplateTextValue("seats", "Seat 1A");
values = new List<MessageTemplateValue> { image, title, time, venue, seats };
bindings = new MessageTemplateWhatsAppBindings(
  header: new[] { image.Name },
  body: new[] { title.Name, time.Name, venue.Name, seats.Name }
);
MessageTemplate movieTicketConfirmationTemplate = new MessageTemplate("sample_movie_ticket_confirmation", "en_us", values, bindings);

``````