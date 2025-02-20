---
title: Include file
description: Include file
services: azure-communication-services
author: glorialimicrosoft
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 02/29/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
---

### Use sample template sample_happy_hour_announcement

This sample template uses a video in the header and two text parameters in the body.

:::image type="content" source="../../media/template-messages/sample-happy-hour-announcement-details-azure-portal.png" lightbox="../../media/template-messages/sample-happy-hour-announcement-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_happy_hour_announcement.":::

The header of the template requires a video:

```
{
  "type": "HEADER",
  "format": "VIDEO"
},
```

The video must be a URL to hosted mp4 video.

For more information about supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 

The body of the template requires two text parameters:

```
{
  "type": "BODY",
  "text": "Happy hour is here! 🍺😀🍸\nPlease be merry and enjoy the day. 🎉\nVenue: {{1}}\nTime: {{2}}"
},
```

Create one `MessageTemplateVideo` and two `MessageTemplateText` variables. Then assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content.

```csharp
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
```

### Use sample template sample_flight_confirmation

This sample template uses a document in the header and three text parameters in the body.

:::image type="content" source="../../media/template-messages/sample-flight-confirmation-details-azure-portal.png" lightbox="../../media/template-messages/sample-flight-confirmation-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_flight_confirmation.":::

The header of the template requires a document:

```
{
  "type": "HEADER",
  "format": "DOCUMENT"
},
```

The document must be a URL to hosted PDF document.

For more information about supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 

The body of the template requires three text parameters:

```
{
  "type": "BODY",
  "text": "This is your flight confirmation for {{1}}-{{2}} on {{3}}."
},
```

Create one `MessageTemplateDocument` and three `MessageTemplateText` variables. Then assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content.

```csharp
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
```
