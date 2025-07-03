---
title: Include file
description: Include file
services: azure-communication-services
author: glorialimicrosoft
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 02/02/2024
ms.topic: include
ms.custom: include file
ms.author: memontic
---

## Prerequisites

- [Register WhatsApp Business Account with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- [Create WhatsApp template message](#create-and-manage-whatsapp-template-message).
- Active WhatsApp phone number to receive messages.

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for .NET.

| Class Name | Description |
| --- | --- |
| `NotificationMessagesClient` | Connects to your Azure Communication Services resource. It sends the messages. |
| `MessageTemplate` | Defines which template you use and the content of the template properties for your message. |
| `TemplateNotificationContent` | Defines the "who" and the "what" of the template message you intend to send. |

> [!NOTE]
> For more information, see the Azure SDK for .NET reference [Azure.Communication.Messages Namespace](/dotnet/api/azure.communication.messages).

### Supported WhatsApp template types

| Template type | Description |
| --- | --- |
| Text-based message templates | WhatsApp message templates are specific message formats with or without parameters. |
| Media-based message templates | WhatsApp message templates with media parameters for header components. |
| Interactive message templates | Interactive message templates expand the content you can send recipients, by  including interactive buttons using the components object. Both Call-to-Action and Quick Reply are supported. |
| Location-based message templates | WhatsApp message templates with location parameters in terms Longitude and Latitude for header components.|

## Common configuration

Follow these steps to add the necessary code snippets to the Main function of your `Program.cs` file.
- [Create and manage WhatsApp template message](#create-and-manage-whatsapp-template-message).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).

### Create and manage WhatsApp template message

WhatsApp message templates are specific message formats that businesses use to send out notifications or customer care messages to people that opted in to notifications. Messages can include appointment reminders, shipping information, issue resolution, or payment updates. **Before start using Advanced messaging SDK to send templated messages, user needs to create required templates in the WhatsApp Business Platform**.

For more information about WhatsApp requirements for templates, see the WhatsApp Business Platform API references:
- [Create and Manage Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/).
- [View Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components).
- [Send Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates).
- Businesses must also adhere to [opt-in requirements](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) before sending messages to WhatsApp users.

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-net.md)]

## Set up environment

[!INCLUDE [Setting up for .NET Application](../dot-net-application-setup.md)]

##  Code examples

Follow these steps to add required code snippets to the Main function of your `Program.cs` file.
- [List WhatsApp templates](#list-whatsapp-templates).
- [Send Template message with no parameters](#send-template-message-with-no-parameters).
- [Send Template message with text parameters in the body](#send-template-message-with-text-parameters-in-the-body).
- [Send Template message with media parameter in the header](#send-template-message-with-media-parameter-in-the-header).
- [Send Template message with location in the header](#send-template-message-with-location-in-the-header).
- [Send Template message with quick reply buttons](#send-template-message-with-quick-reply-buttons).
- [Send Template message with call to action buttons with dynamic link](#send-template-message-with-call-to-action-buttons-with-dynamic-link).
- [Send Template message with call to action buttons with static link](#send-template-message-with-call-to-action-buttons-with-static-link).
- [Send Authentication Template message](#send-authentication-template-message).

### List WhatsApp templates

List of templates can be viewed in Azure portal or In WhatsApp Manager or Using SDK. All options are listed as follows:

You can view your templates in the Azure portal by going to your Azure Communication Service resource > **Advanced Messaging** > **Templates**.

:::image type="content" source="../../media/template-messages/list-templates-azure-portal.png" lightbox="../../media/template-messages/list-templates-azure-portal.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the Advanced Messaging > Templates tab.":::

Select a template to view the details.

The `content` field of the template details can include parameter bindings. The parameter bindings can be denoted as:
- A `format` field with a value such as `IMAGE`.
- Double brackets surrounding a number, such as `{{1}}`. The number, indexed started at 1, indicates the order in which the binding values must be supplied to create the message template.
- Double brackets surrounding a name, such as `{{movie_name}}`. The named parameters allow developers to reference parameters by name instead of position.
  > [!IMPORTANT]
  > When using named parameters, you must ensure that the name you use when sending the message **exactly matches** the name defined in the template you created in the Meta WhatsApp Manager.

:::image type="content" source="../../media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" lightbox="../../media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" alt-text="Screenshot that shows template details.":::

Alternatively, you can view and edit all of your WhatsApp Business Account templates in the [WhatsApp Manager](https://business.facebook.com/wa/manage/home/) > Account tools > [Message templates](https://business.facebook.com/wa/manage/message-templates/).

To list out your templates programmatically, you can fetch all templates for your channel ID as follows:

[!INCLUDE [List templates with .NET](./template-messages-list-templates-net.md)]

### Send template message with no parameters

If the template doesn't require parameters, you don't need to supply any values or bindings when creating the `MessageTemplate`.

```csharp
var messageTemplate = new MessageTemplate(templateName, templateLanguage); 
```

#### Example

The `sample_template` takes no parameters.

:::image type="content" source="../../media/template-messages/sample-template-details-azure-portal.png" lightbox="../../media/template-messages/sample-template-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_template.":::

Assemble the `MessageTemplate` by referencing the target template name and language.

```csharp
string templateName = "sample_template"; 
string templateLanguage = "en_us"; 

var sampleTemplate = new MessageTemplate(templateName, templateLanguage); 
```

### Send Template message with text parameters in the body

Use `MessageTemplateText` to define parameters in the body denoted with double brackets surrounding a number, such as `{{1}}`. The number, index started at 1, indicates the order in which the binding values must be supplied to create the message template. Including parameters not in the template is invalid.

Template definition with two parameters:
```json
{
  "type": "BODY",
  "text": "Message with two parameters: {{1}} and {{2}}"
}
```

#### Examples

`sample_shipping_confirmation` template:

:::image type="content" source="../../media/template-messages/sample-shipping-confirmation-details-azure-portal.png" lightbox="../../media/template-messages/sample-shipping-confirmation-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_shipping_confirmation.":::

In this sample, the body of the template has one parameter:

```json
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

WhatsAppMessageTemplateBindings bindings = new();
bindings.Body.Add(new(threeDays.Name));

MessageTemplate shippingConfirmationTemplate  = new(templateName, templateLanguage);
shippingConfirmationTemplate.Bindings = bindings;
shippingConfirmationTemplate.Values.Add(threeDays);
```

### Send Template message with media parameter in the header

Use `MessageTemplateImage`, `MessageTemplateVideo`, or `MessageTemplateDocument` to define the media parameter in a header.

Template definition with image media parameter in header:

```json
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

The `format` can have different media types supported by WhatsApp. In the .NET SDK, each media type uses a corresponding MessageTemplateValue type.

| Format | MessageTemplateValue Type | File Type |
| --- | --- | --- |
| `IMAGE`    | `MessageTemplateImage`    | png, jpg  |
| `VIDEO`    | `MessageTemplateVideo`    | mp4       |
| `DOCUMENT` | `MessageTemplateDocument` | pdf       |

For more information on supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 

Message template assembly for image media:

```csharp
var url = new Uri("< Your media URL >");

var media = new MessageTemplateImage("image", url);
WhatsAppMessageTemplateBindings bindings = new();
bindings.Header.Add(new(media.Name));

var messageTemplate = new MessageTemplate(templateName, templateLanguage);
template.Bindings = bindings;
template.Values.Add(media);
```

#### Examples

`sample_movie_ticket_confirmation` template:

:::image type="content" source="../../media/template-messages/sample-movie-ticket-confirmation-details-azure-portal.png" lightbox="../../media/template-messages/sample-movie-ticket-confirmation-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_movie_ticket_confirmation.":::

In this sample, the header of the template requires an image:

```
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

The body of the template requires four text parameters:

```json
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
```

#### More Examples

- VIDEO: [Use sample template sample_happy_hour_announcement](#use-sample-template-sample_happy_hour_announcement)
- DOCUMENT: [Use sample template sample_flight_confirmation](#use-sample-template-sample_flight_confirmation)

### Send template message with location in the header

Use `MessageTemplateLocation` to define the location parameter in a header.

Template definition for header component requiring location as:

```json
{
  "type": "header",
  "parameters": [
    {
      "type": "location",
      "location": {
        "latitude": "<LATITUDE>",
        "longitude": "<LONGITUDE>",
        "name": "<NAME>",
        "address": "<ADDRESS>"
      }
    }
  ]
}
```

The `format` can require different media types. In the .NET SDK, each media type uses a corresponding MessageTemplateValue type.

| Properties | Description | Type |
| --- | --- | --- |
| `ADDRESS` | Address that appears after the `NAME` value, below the generic map at the top of the message. | string |
| `LATITUDE` | Location latitude. | double  |
| `LONGITUDE`| Location longitude. | double |
| `LOCATIONNAME` | Text that appears immediately below the generic map at the top of the message. | string |

For more information about location based templates, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates#location). 

#### Example

`sample_movie_location` template:

:::image type="content" source="../../media/template-messages/sample-location-based-template.jpg" lightbox="../../media/template-messages/sample-location-based-template.jpg" alt-text="Screenshot that shows template details for template named sample_location_template.":::

Location based Message template assembly:

```csharp
 var location = new MessageTemplateLocation("location");
 location.LocationName = "Pablo Morales";
 location.Address = "1 Hacker Way, Menlo Park, CA 94025";
 location.Position = new Azure.Core.GeoJson.GeoPosition(longitude: 122.148981, latitude: 37.483307);

 WhatsAppMessageTemplateBindings location_bindings = new();
 location_bindings.Header.Add(new(location.Name));

 var messageTemplateWithLocation = new MessageTemplate(templateNameWithLocation, templateLanguage);
 messageTemplateWithLocation.Values.Add(location);
 messageTemplateWithLocation.Bindings = location_bindings;
```

### Send template message with quick reply buttons

Use `MessageTemplateQuickAction` to define the payload for quick reply buttons and `MessageTemplateQuickAction` objects have the following three attributes. 

| Properties | Description | Type |
| --- | --- | --- |
| Name | The `name` used to look up the value in `MessageTemplateWhatsAppBindings`. | string |
| Text | The optional quick action `text`. | string|
| Payload | The `payload` assigned to a button available in a message reply if the user selects the button. | string |
 
Template definition with quick reply buttons:

```json
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

The order that the buttons appear in the template definition must match the order in which the buttons are defined when creating the bindings with `MessageTemplateWhatsAppBindings`.

For more information about the payload in quick reply responses from the user, see WhatsApp documentation for [Received Callback from a Quick Reply Button](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#received-callback-from-a-quick-reply-button).

#### Example

`sample_issue_resolution` template:

:::image type="content" source="../../media/template-messages/sample-issue-resolution-details-azure-portal.png" lightbox="../../media/template-messages/sample-issue-resolution-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_issue_resolution.":::

The body of the template requires one text parameter:

```json
{
  "type": "BODY",
  "text": "Hi {{1}}, were we able to solve the issue that you were facing?"
},
```

The template includes two prefilled reply buttons, `Yes` and `No`.

```json
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

Create one `MessageTemplateText` and two `MessageTemplateQuickAction` variables. Then assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content. The order also matters when defining your bindings' buttons.

```csharp
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
```

### Send Template message with call to action buttons with dynamic link
Use `MessageTemplateQuickAction` to define the URL suffix for call to action buttons and `MessageTemplateQuickAction` object have the following two attributes.

|  Properties   | Description |  Type |
|----------|---------------------------|-----------|
| Name  | The `name` is used to look up the value in `MessageTemplateWhatsAppBindings`. | string|
| Text  | The  `text` that is appended to the URL.  | string|

Template definition buttons:
```json
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

The order that the buttons appear in the template definition must match the order in which the buttons are defined when creating the bindings with `MessageTemplateWhatsAppBindings`.

#### Example

`sample_purchase_feedback` template:

This sample template adds a button with a dynamic URL link to the message. It also uses an image in the header and a text parameter in the body.

:::image type="content" source="../../media/template-messages/edit-sample-purchase-feedback-whatsapp-manager.png" lightbox="../../media/template-messages/edit-sample-purchase-feedback-whatsapp-manager.png" alt-text="Screen capture of the WhatsApp manager Buttons editor Call to action panel that shows the URL Type button you can use to choose between Static and Dynamic.":::

In this sample, the header of the template requires an image:

```json
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

The body of the template requires one text parameter:

```json
{
  "type": "BODY",
  "text": "Thank you for purchasing {{1}}! We value your feedback and would like to learn more about your experience."
},
```

The template includes a dynamic URL button with one parameter:

```json
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

Create one `MessageTemplateImage`, one `MessageTemplateText`, and one `MessageTemplateQuickAction` variable. Then assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content. The order also matters when defining your bindings' buttons.

```csharp
string templateName = "sample_purchase_feedback";
string templateLanguage = "en_us";
var imageUrl = new Uri("https://aka.ms/acsicon1");

var image = new MessageTemplateImage(name: "image", uri: imageUrl);
var product = new MessageTemplateText(name: "product", text: "coffee");
var urlSuffix = new MessageTemplateQuickAction(name: "text") { Text = "survey-code" };

WhatsAppMessageTemplateBindings bindings = new();
bindings.Header.Add(new(image.Name));
bindings.Body.Add(new(product.Name));
bindings.Buttons.Add(new(WhatsAppMessageButtonSubType.Url.ToString(), urlSuffix.Name));

MessageTemplate purchaseFeedbackTemplate = new("sample_purchase_feedback", "en_us");
purchaseFeedbackTemplate.Values.Add(image);
purchaseFeedbackTemplate.Values.Add(product);
purchaseFeedbackTemplate.Values.Add(urlSuffix);
purchaseFeedbackTemplate.Bindings = bindings;
```

### Send Template message with call to action buttons with static link

For static links, you don't need to include `MessageTemplateQuickAction` model because the WhatsApp template has a static `CallToAction` link with no input required from the user.

Template definition buttons:
```json
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

#### Example

`purchase_feedback_static` template:

This sample template adds a button with a static URL link to the message. It also uses an image in the header and a text parameter in the body.

:::image type="content" source="../../media/template-messages/purchase-feedback-static-link-template.png" lightbox="../../media/template-messages/purchase-feedback-static-link-template.png" alt-text="Screen capture that shows details for the purchase-feedback-static-template.":::

In this sample, the header of the template requires an image:

```json
{
  "type": "HEADER",
  "format": "IMAGE"
},
```

The body of the template requires one text parameter:

```json
{
  "type": "BODY",
  "text": "Hello {{1}}, \nHope you are great day!.\n Please click on given link to explore about our program.."
},
```

The template includes a dynamic URL button with one parameter:

```json
{
  "type": "BUTTONS",
  "buttons": [
    {
      "type": "URL",
      "text": "Take Survey",
      "url": "https://www.example.com/"
    }
  ]
}
```

Create one `MessageTemplateImage`, one `MessageTemplateText`. Then assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content. The order also matters when defining your bindings' buttons.

```csharp
// Send sample template sample_template
string templateNameWithcta = "purchase_feedback_static";
var bodyParam1 = new MessageTemplateText(name: "customer", text: "Joe");
var image = new MessageTemplateImage("image", new Uri("https://aka.ms/acsicon1"));

WhatsAppMessageTemplateBindings cta_bindings = new();
cta_bindings.Body.Add(new(bodyParam1.Name));
cta_bindings.Header.Add(new(image.Name));

var messageTemplateWithcta = new MessageTemplate(templateNameWithcta, templateLanguage);
messageTemplateWithcta.Values.Add(bodyParam1);
messageTemplateWithcta.Values.Add(image);
messageTemplateWithcta.Bindings = cta_bindings;

TemplateNotificationContent templateContent4 =
    new TemplateNotificationContent(channelRegistrationId, recipientList, messageTemplateWithcta);
Response<SendMessageResult> sendTemplateMessageResult4 =
    notificationMessagesClient.Send(templateContent4);
```

### Send Authentication Template message
This sample template sends authentication template message with one-time password buttons. For more information, see the Facebook Auth Template API article [Sending Authentication Templates](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates/auth-otp-template-messages).

#### Example

`auth_sample_template` template in the Azure portal:

:::image type="content" source="../../media/template-messages/sample-authentication-based-template.jpeg" lightbox="../../media/template-messages/sample-authentication-based-template.jpeg" alt-text="Screen capture that shows details for the authentication-template.":::

The template json looks like this:

```json
[
  {
    "type": "BODY",
    "text": "*{{1}}* is your verification code.",
    "add_security_recommendation": false,
    "example": {
      "body_text": [
        [
          "123456"
        ]
      ]
    }
  },
  {
    "type": "BUTTONS",
    "buttons": [
      {
        "type": "URL",
        "text": "Copy code",
        "url": "https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code=otp{{1}}",
        "example": [
          "https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code=otp123456"
        ]
      }
    ]
  }
]
```

Create one `MessageTemplateText`, one `MessageTemplateQuickAction` params. Then assemble your list of params values and your `WhatsAppMessageTemplateBindingsButton` by providing the parameters in the order that the parameters appear in the template content. The order also matters when defining your bindings' buttons.

```csharp
  // Send auth sample template message
  string templateNameWithauth = "auth_sample_template";
  string oneTimePassword = "3516517";
  var messageTemplateWithAuth = new MessageTemplate(templateNameWithauth, templateLanguage);
  WhatsAppMessageTemplateBindings auth_bindings = new();
  var bodyParam2 = new MessageTemplateText(name: "code", text: oneTimePassword);
  var uri_to_copy = new MessageTemplateQuickAction("url") { Text = oneTimePassword };

  auth_bindings.Body.Add(new(bodyParam2.Name));
  auth_bindings.Buttons.Add(new WhatsAppMessageTemplateBindingsButton(WhatsAppMessageButtonSubType.Url.ToString(), uri_to_copy.Name));
  messageTemplateWithAuth.Values.Add(bodyParam2);
  messageTemplateWithAuth.Values.Add(uri_to_copy);
  messageTemplateWithAuth.Bindings = auth_bindings;

  TemplateNotificationContent templateContent5 =
      new TemplateNotificationContent(channelRegistrationId, recipientList, messageTemplateWithAuth);
  Response<SendMessageResult> sendTemplateMessageResult5 =
      notificationMessagesClient.Send(templateContent5);
```

## Run the code

Build and run your program.  

To send a text or media message to a WhatsApp user, there must be an active conversation between the WhatsApp Business Account and the WhatsApp user.

If you don't have an active conversation, for the purposes of this example you can add a wait between sending the template message and sending the text message. This added delay gives you enough time to reply to the business on the user's WhatsApp account. For reference, the given example prompts for manual user input before sending the next message. For more information, see the full example at [Sample code](#full-code-example). If successful, you receive three messages on the user's WhatsApp account.

### [.NET CLI](#tab/dotnet-cli)

Build and run your program.
```console
dotnet build
dotnet run
```

### [Visual Studio](#tab/visual-studio)

1. To compile your code, press **Ctrl**+**F7**.
1. To run the program without debugging, press **Ctrl**+**F5**.

### [Visual Studio Code](#tab/vs-code)

Build and run your program using the following commands in the Visual Studio Code Terminal (**View** > **Terminal**).

```console
dotnet build
dotnet run
```
---

## Full code example

[!INCLUDE [Full code example with .NET](./template-messages-full-code-example-net.md)]

## More Examples

These examples use sample templates available to WhatsApp Business Accounts created through the Azure portal embedded signup.

[!INCLUDE [Template examples with .NET](./template-messages-examples-net.md)]
