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

var threeDays = new MessageTemplateText("threeDays", "3");
IEnumerable<MessageTemplateValue> values = 
    new List<MessageTemplateValue> { threeDays };
MessageTemplateWhatsAppBindings bindings = new MessageTemplateWhatsAppBindings(
    body: new[] { threeDays.Name });
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
MessageTemplate movieTicketConfirmationTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

### Use sample template sample_happy_hour_announcement

This sample template uses a video in the header and two text parameters in the body.

:::image type="content" source="./../media/template-messages/sample-happy-hour-announcement-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_happy_hour_announcement.":::

Here, the header of the template requires a video:
```
{
  "type": "HEADER",
  "format": "VIDEO"
},
```
The video should be a URL to hosted mp4 video.
For more information on supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 

And the body of the template requires two text parameters:
```
{
  "type": "BODY",
  "text": "Happy hour is here! 🍺😀🍸\nPlease be merry and enjoy the day. 🎉\nVenue: {{1}}\nTime: {{2}}"
},
```

Create one `MessageTemplateVideo` and two `MessageTemplateText` variables. Then, assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content.
```csharp
string templateName = "sample_happy_hour_announcement";
string templateLanguage = "en_us";
var videoUrl = new Uri("< Your .mp4 Video URL >");

var video = new MessageTemplateVideo("video", videoUrl);
var venue = new MessageTemplateText("venue", "Fourth Coffee");
var time = new MessageTemplateText("time", "Today 2-4PM");

IEnumerable<MessageTemplateValue> values = new List<MessageTemplateValue>
{
    video,
    venue,
    time
};
var bindings = new MessageTemplateWhatsAppBindings(
    header: new[] { video.Name },
    body: new[] { venue.Name, time.Name });

var happyHourAnnouncementTemplate = MessageTemplate(templateName, templateLanguage, values, bindings);
``````

### Use sample template sample_flight_confirmation

This sample template uses a document in the header and three text parameters in the body.

:::image type="content" source="./../media/template-messages/sample-flight-confirmation-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_flight_confirmation.":::

Here, the header of the template requires a document:
```
{
  "type": "HEADER",
  "format": "DOCUMENT"
},
```
The document should be a URL to hosted pdf document.
For more information on supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 

And the body of the template requires three text parameters:
```
{
  "type": "BODY",
  "text": "This is your flight confirmation for {{1}}-{{2}} on {{3}}."
},
```

Create one `MessageTemplateDocument` and three `MessageTemplateText` variables. Then, assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content.
```csharp
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

var flightConfirmationTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

### Use sample template sample_issue_resolution

This sample template adds two prefilled reply buttons to the message. It also includes one text parameter in the body.

:::image type="content" source="./../media/template-messages/sample-issue-resolution-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_issue_resolution.":::

Here, the body of the template requires one text parameter:
```
{
  "type": "BODY",
  "text": "Hi {{1}}, were we able to solve the issue that you were facing?"
},
```

And the template includes two prefilled reply buttons, `Yes` and `No`.
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

Quick reply buttons are defined as `MessageTemplateQuickAction` objects and have three attributes:
- `name`   
The `name` is used to look up the value in `MessageTemplateWhatsAppBindings`.   
- `text`   
Using the quick reply buttons, the `text` attribute isn't used.
- `payload`   
The `payload` assigned to a button is available in a message reply if the user selects the button.

For more information on buttons, see WhatsApp's documentation for [Button Parameter Object](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#button-parameter-object).

Create one `MessageTemplateText` and two `MessageTemplateQuickAction` variables. Then, assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content. The order also matters when defining your binding's buttons.
```csharp
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

var issueResolutionTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````

### Use sample template sample_purchase_feedback

This sample template adds a button with a dynamic URL link to the message. It also uses an image in the header and a text parameter in the body.

If using the precreated sample template `sample_purchase_feedback`, you need to modify the URL Type of its button from `Static` to `Dynamic`.   
Go to your [Message templates in the WhatsApp manager](https://business.facebook.com/wa/manage/message-templates/) and edit the template for `sample_purchase_feedback`. In the dropdown for URL Type, change it from `Static` to `Dynamic`. Include a sample URL if necessary.

:::image type="content" source="./../media/template-messages/edit-sample-purchase-feedback-whatsapp-manager.png" alt-text="Screenshot that shows editing URL Type in the WhatsApp manager.":::

Now, if you view the template details in the Azure portal, you see:
:::image type="content" source="./../media/template-messages/sample-purchase-feedback-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_purchase_feedback.":::

In this sample, the header of the template requires an image:
```
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

Here, the body of the template requires one text parameter:
```
{
  "type": "BODY",
  "text": "Thank you for purchasing {{1}}! We value your feedback and would like to learn more about your experience."
},
```

And the template includes a dynamic URL button with one parameter:
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

Call to action buttons for website links are defined as `MessageTemplateQuickAction` objects and have three attributes:
- `name`   
The `name` is used to look up the value in `MessageTemplateWhatsAppBindings`.
- `text`   
Using the call to action button for website links, the `text` attribute defines the text that is appended to the URL.   
For this example, our `text` value is `survey-code`. In the message received by the user, they're presented with a button that links them to the URL `https://www.example.com/survey-code`.
- `payload`   
Using the call to action button for website links, the `payload` attribute isn't required.

For more information on buttons, see WhatsApp's documentation for [Button Parameter Object](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#button-parameter-object).

Create one `MessageTemplateImage`, one `MessageTemplateText`, and one `MessageTemplateQuickAction` variable. Then, assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content. The order also matters when defining your binding's buttons.
```csharp
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

var purchaseFeedbackTemplate = new MessageTemplate(templateName, templateLanguage, values, bindings);
``````
