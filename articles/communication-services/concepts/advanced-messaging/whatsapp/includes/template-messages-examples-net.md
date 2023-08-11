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

### Use sample template sample_template

The sample template named `sample_template` takes no parameters.

:::image type="content" source="./../media/template-messages/sample-template-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_template.":::

Assemble the `MessageTemplate` by referencing the target template's name and language.

```csharp
string templateName = "sample_template"; 
string templateLanguage = "en_us"; 

var sampleTemplate = new MessageTemplate(templateName, templateLanguage); 
``````

### Use sample template sample_shipping_confirmation

Some templates take parameters. Only include the parameters that the template requires. Including parameters not in the template is invalid.

:::image type="content" source="./../media/template-messages/sample-shipping-confirmation-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_shipping_confirmation.":::

In this sample, the body of the template has one parameter:
```
{
  "type": "BODY",
  "text": "Your package has been shipped. It will be delivered in {{1}} business days."
},
```

Parameters are defined with the `MessageTemplateValue` values and `MessageTemplateWhatsAppBindings` bindings. Use the values and bindings to assemble the `MessageTemplate`.

```csharp
string templateName = "sample_shipping_confirmation"; 
string templateLanguage = "en_us"; 

var ThreeDays = new MessageTemplateText("threeDays", "3");
IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue> { ThreeDays };
MessageTemplateWhatsAppBindings bindings = new MessageTemplateWhatsAppBindings(
  body: new[] { ThreeDays.Name }
);
var shippingConfirmationTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings); 
``````

### Use sample template sample_movie_ticket_confirmation

Templates can require various types of parameters such as text and images.

:::image type="content" source="./../media/template-messages/sample-movie-ticket-confirmation-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_movie_ticket_confirmation.":::

In this sample, the header of the template requires an image:
```
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

And the body of the template requires four text parameters:
```
{
  "type": "BODY",
  "text": "Your ticket for *{{1}}*\n*Time* - {{2}}\n*Venue* - {{3}}\n*Seats* - {{4}}"
},
```

Create one `MessageTemplateImage` and four `MessageTemplateText` variables. Then, assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content.

```csharp
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
MessageTemplate movieTicketConfirmationTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````