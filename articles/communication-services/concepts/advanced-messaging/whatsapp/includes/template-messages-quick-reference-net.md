---
title: include file
description: include file
services: azure-communication-services
author: memontic-ms
manager: 
ms.service: azure-communication-services
ms.subservice: messages
ms.date: 10/02/2023
ms.topic: include
ms.custom: include file
ms.author: memontic
---
### Templates with no parameters

If the template takes no parameters, you don't need to supply the values or bindings when creating the `MessageTemplate`.

```csharp
var messageTemplate = new MessageTemplate(templateName, templateLanguage); 
``````

#### Example
- [Use sample template sample_template](#use-sample-template-sample_template)

### Templates with text parameters in the body

Use `MessageTemplateText` to define parameters in the body denoted with double brackets surrounding a number, such as `{{1}}`. The number, indexed started at 1, indicates the order in which the binding values must be supplied to create the message template.

Template definition body:
```
{
  "type": "BODY",
  "text": "Message with two parameters: {{1}} and {{2}}"
},
```

Message template assembly:
```csharp
var param1 = new MessageTemplateText(name: "first", text: "First Parameter");
var param2 = new MessageTemplateText(name: "second", text: "Second Parameter");
IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    param1,
    param2
};
var bindings = new MessageTemplateWhatsAppBindings(
    body: new[] { param1.Name, param2.Name });
var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings); 
``````

#### Examples
- [Use sample template sample_shipping_confirmation](#use-sample-template-sample_shipping_confirmation)
- [Use sample template sample_movie_ticket_confirmation](#use-sample-template-sample_movie_ticket_confirmation)
- [Use sample template sample_happy_hour_announcement](#use-sample-template-sample_happy_hour_announcement)
- [Use sample template sample_flight_confirmation](#use-sample-template-sample_flight_confirmation)
- [Use sample template sample_issue_resolution](#use-sample-template-sample_issue_resolution)
- [Use sample template sample_purchase_feedback](#use-sample-template-sample_purchase_feedback)

### Templates with media in the header

Use `MessageTemplateImage`, `MessageTemplateVideo`, or `MessageTemplateDocument` to define the media parameter in a header.

Template definition header requiring image media:
```
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

The "format" can require different media types. In the .NET SDK, each media type uses a corresponding MessageTemplateValue type.

| Format   | MessageTemplateValue Type | File Type |
|----------|---------------------------|-----------|
| IMAGE    | `MessageTemplateImage`    | png, jpg  |
| VIDEO    | `MessageTemplateVideo`    | mp4       |
| DOCUMENT | `MessageTemplateDocument` | pdf       |

For more information on supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 

Message template assembly for image media:
```csharp
var url = new Uri("< Your media URL >");

var media = new MessageTemplateImage("image", url);
IEnumerable<MessageTemplateValue> values =  new List<MessageTemplateValue>
{
    media
};
var bindings = new MessageTemplateWhatsAppBindings(
    header: new[] { media.Name });

var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

#### Examples
- IMAGE: [Use sample template sample_movie_ticket_confirmation](#use-sample-template-sample_movie_ticket_confirmation)
- IMAGE: [Use sample template sample_purchase_feedback](#use-sample-template-sample_purchase_feedback)
- VIDEO: [Use sample template sample_happy_hour_announcement](#use-sample-template-sample_happy_hour_announcement)
- DOCUMENT: [Use sample template sample_flight_confirmation](#use-sample-template-sample_flight_confirmation)

### Templates with quick reply buttons

Use `MessageTemplateQuickAction` to define the payload for quick reply buttons.

`MessageTemplateQuickAction` objects and have the following three attributes.   
 **Specifically for quick reply buttons**, follow these guidelines to create your `MessageTemplateQuickAction` object.
- `name`   
The `name` is used to look up the value in `MessageTemplateWhatsAppBindings`.
- `text`   
The `text` attribute isn't used.
- `payload`   
The `payload` assigned to a button is available in a message reply if the user selects the button.

Template definition buttons:
```
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "QUICK_REPLY",
      "text": "Yes"
    },
    {
      "type": "QUICK_REPLY",
      "text": "No"
    }
  ]
}
```

The order that the buttons appear in the template definition should match the order in which the buttons are defined when creating the bindings with `MessageTemplateWhatsAppBindings`.

Message template assembly:
```csharp
var yes = new MessageTemplateQuickAction(name: "Yes", payload: "User said yes");
var no = new MessageTemplateQuickAction(name: "No", payload: "User said no");

IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    yes,
    no
};
var bindings = new MessageTemplateWhatsAppBindings(
    button: new[] {
        new KeyValuePair<string, MessageTemplateValueWhatsAppSubType>(yes.Name,
            MessageTemplateValueWhatsAppSubType.QuickReply),
        new KeyValuePair<string, MessageTemplateValueWhatsAppSubType>(no.Name,
            MessageTemplateValueWhatsAppSubType.QuickReply)
    });

var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

For more information on the payload in quick reply responses from the user, see WhatsApp's documentation for [Received Callback from a Quick Reply Button](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#received-callback-from-a-quick-reply-button).

#### Example
- [Use sample template sample_issue_resolution](#use-sample-template-sample_issue_resolution)

### Templates with call to action buttons

Use `MessageTemplateQuickAction` to define the url suffix for call to action buttons.   

`MessageTemplateQuickAction` objects and have the following three attributes.   
 **Specifically for call to action buttons**, follow these guidelines to create your `MessageTemplateQuickAction` object.
- `name`   
The `name` is used to look up the value in `MessageTemplateWhatsAppBindings`.
- `text`   
The `text` attribute defines the text that is appended to the URL.   
- `payload`   
The `payload` attribute isn't required.

Template definition buttons:
```
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "URL",
      "text": "Take Survey",
      "url": "https://www.example.com/{{1}}"
    }
  ]
}
```

The order that the buttons appear in the template definition should match the order in which the buttons are defined when creating the bindings with `MessageTemplateWhatsAppBindings`.

Message template assembly:
```csharp
var urlSuffix = new MessageTemplateQuickAction(name: "text", text: "url-suffix-text");

IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    urlSuffix
};
var bindings = new MessageTemplateWhatsAppBindings(
    button: new[]
    {
        new KeyValuePair<string, MessageTemplateValueWhatsAppSubType>(urlSuffix.Name,
            MessageTemplateValueWhatsAppSubType.Url)
    });

var messageTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

#### Example
- [Use sample template sample_purchase_feedback](#use-sample-template-sample_purchase_feedback)