---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 12/29/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

## Prerequisites

- [Register WhatsApp Business Account with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- [Create WhatsApp template message](#create-and-manage-whatsapp-template-message).
- Active WhatsApp phone number to receive messages.

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Java.

| Class Name | Description |
| --- | --- |
| `NotificationMessagesClient` | Connects to your Azure Communication Services resource. It sends the messages. |
| `MessageTemplate` | Defines which template you use and the content of the template properties for your message. |
| `TemplateNotificationContent` | Defines the "who" and the "what" of the template message you intend to send. |

> [!NOTE]
> For more information, see the Azure SDK for Java reference at [com.azure.communication.messages Package](/java/api/com.azure.communication.messages).

### Supported WhatsApp template types

| Template type | Description |
| --- | --- |
| Text-based message templates | WhatsApp message templates are specific message formats with or without parameters. |
| Media-based message templates | WhatsApp message templates with media parameters for header components. |
| Interactive message templates | Interactive message templates expand the content you can send recipients, by  including interactive buttons using the components object. Both Call-to-Action and Quick Reply are supported. |
| Location-based message templates | WhatsApp message templates with location parameters in terms Longitude and Latitude for header components.|

## Common configuration

Follow these steps to add the necessary code snippets to the main function of your `App.java` file.
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
- [Adhere to opt-in requirements](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) before sending messages to WhatsApp users.

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-java.md)]

## Set up environment
To set up an environment for sending messages, complete the steps in the following sections.

### Prerequisite
- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- Active WhatsApp phone number to receive messages.
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).

[!INCLUDE [Setting up for Java Application](../java-application-setup.md)]

## Code examples

Follow these steps to add required code snippets to the main function of your `App.java` file.
- [List WhatsApp templates in the Azure portal](#list-whatsapp-templates-in-the-azure-portal).
- [Send template message with text parameters in the body](#send-template-message-with-text-parameters-in-the-body).
- [Send template message with media parameter in the header](#send-template-message-with-media-parameter-in-the-header).
- [Send template message with quick reply buttons](#send-template-message-with-quick-reply-buttons).
- [Send Template message with call to action buttons and dynamic link](#send-template-message-with-call-to-action-buttons-and-dynamic-link).

### List WhatsApp templates in the Azure portal

To view your templates in the Azure portal, go to your Azure Communication Services resource > **Advanced Messaging** > **Templates**.

:::image type="content" source="../../media/template-messages/list-templates-azure-portal.png" lightbox="../../media/template-messages/list-templates-azure-portal.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the advanced messaging templates tab.":::

Selecting a template to view the template details.

The **Content** field of the template details can include parameter bindings. The parameter bindings can be denoted as:
- A `"format"` field with a value such as `IMAGE`.
- Double brackets surrounding a number, such as `{{1}}`. The number, index started at 1, indicates the order in which the binding values must be supplied to create the message template.

:::image type="content" source="../../media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" lightbox="../../media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" alt-text="Screenshot that shows template details.":::

Alternatively, you can view and edit all of your WhatsApp Business Account templates in the [WhatsApp Manager](https://business.facebook.com/wa/manage/home/) > Account tools > [Message templates](https://business.facebook.com/wa/manage/message-templates/). 

To list out your templates programmatically, you can fetch all templates for your channel ID using the following code:

```java
public static void getMessageTemplateWithConnectionString() {
    MessageTemplateClient templateClient =
        new MessageTemplateClientBuilder()
            .connectionString(connectionString)
            .buildClient();

    PagedIterable<MessageTemplateItem> response = templateClient.listTemplates(channelRegistrationId);

    response.stream().forEach(t -> {
        WhatsAppMessageTemplateItem template = (WhatsAppMessageTemplateItem) t ;
        System.out.println("===============================");
        System.out.println("Template Name :: "+template.getName());
        System.out.println("Template Language :: "+template.getLanguage());
        System.out.println("Template Status :: "+template.getStatus());
        System.out.println("Template Content :: "+template.getContent());
        System.out.println("===============================");
    });
    }
```

### Send template message with text parameters in the body

If the template takes no parameters, you don't need to supply any values or bindings when creating the `MessageTemplate`.

```java
 /*
    * This sample shows how to send template message with below details
    * Name: sample_shipping_confirmation, Language: en_US
    *  [
          {
            "type": "BODY",
            "text": "Your package has been shipped. It will be delivered in {{1}} business days."
          },
          {
            "type": "FOOTER",
            "text": "This message is from an unverified business."
          }
        ]
* */
private static void sendTemplateMessage() {

    //Update Template Name and language according your template associate to your channel.
    MessageTemplate template = new MessageTemplate("sample_shipping_confirmation", "en_US");

    //Update template parameter type and value
    List<MessageTemplateValue> messageTemplateValues = new ArrayList<>();
    messageTemplateValues.add(new MessageTemplateText("Days", "5"));
    template.setValues(messageTemplateValues);

    //Update template parameter binding
    List<WhatsAppMessageTemplateBindingsComponent> components = new ArrayList<>();
    components.add(new WhatsAppMessageTemplateBindingsComponent("Days"));
    MessageTemplateBindings bindings =new WhatsAppMessageTemplateBindings()
        .setBody(components);
    template.setBindings(bindings);

    NotificationMessagesClient client = createClientWithTokenCredential();
    SendMessageResult result = client.send(
        new TemplateNotificationContent(CHANNEL_ID, recipients, template));

    result.getReceipts().forEach(r -> System.out.println("Message sent to:"+r.getTo() + " and message id:"+ r.getMessageId()));
    }
```

### Send template message with media parameter in the header

Use `MessageTemplateImage`, `MessageTemplateVideo`, or `MessageTemplateDocument` to define the media parameter in a header.

Template definition with image media parameter in the header:

```json
{
  "type": "HEADER",
  "format": "VIDEO"
},
```

The `"format"` can be on of four different media types supported by WhatsApp. In the .NET SDK, each media type uses a corresponding `MessageTemplateValue` type.

| Format   | MessageTemplateValue Type | File Type |
|----------|---------------------------|-----------|
| IMAGE    | `MessageTemplateImage`    | png, jpg  |
| VIDEO    | `MessageTemplateVideo`    | mp4       |
| DOCUMENT | `MessageTemplateDocument` | pdf       |

For more information about supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 


#### Example

`sample_happy_hour_announcement` template:

:::image type="content" source="../../media/template-messages/sample-happy-hour-announcement-details-azure-portal.png" lightbox="../../media/template-messages/sample-happy-hour-announcement-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_happy_hour_announcement.":::

Here, the header of the template requires a video:

```
{
  "type": "HEADER",
  "format": "VIDEO"
},
```

The video must be a URL to a hosted mp4 video.

For more information about supported media types and size limits, see [WhatsApp's documentation for message media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media#supported-media-types). 

The body of the template requires two text parameters:

```
{
  "type": "BODY",
  "text": "Happy hour is here! 🍺😀🍸\nPlease be merry and enjoy the day. 🎉\nVenue: {{1}}\nTime: {{2}}"
},
```

Create one `MessageTemplateVideo` and four `MessageTemplateText` variables. Then, assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content.

```java
 /*
    * This sample shows how to send template message with below details
    * Name: sample_happy_hour_announcement, Language: en_US
    *  [
          {
            "type": "HEADER",
            "format": "VIDEO"
          },
          {
            "type": "BODY",
            "text": "Happy hour is here! 🍺😀🍸\nPlease be merry and enjoy the day. 🎉\nVenue: {{1}}\nTime: {{2}}"
          },
          {
            "type": "FOOTER",
            "text": "This message is from an unverified business."
          }
        ]
* */
private static void sendTemplateMessageWithVideo() {

    //Update Template Name and language according your template associate to your channel.
    MessageTemplate template = new MessageTemplate("sample_happy_hour_announcement", "en_US");

    //Add template parameter type with value in a list
    List<MessageTemplateValue> messageTemplateValues = new ArrayList<>();
    messageTemplateValues.add(new MessageTemplateVideo("HeaderVideo", "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"));
    messageTemplateValues.add(new MessageTemplateText("VenueInfoInBody", "Starbucks"));
    messageTemplateValues.add(new MessageTemplateText("TimeInfoInBody", "Today 2-4PM"));

    // Add parameter binding for template header in a list
    List<WhatsAppMessageTemplateBindingsComponent> templateHeaderBindings = new ArrayList<>();
    templateHeaderBindings.add(new WhatsAppMessageTemplateBindingsComponent("HeaderVideo"));

    // Add parameter binding for template body in a list
    List<WhatsAppMessageTemplateBindingsComponent> templateBodyBindings = new ArrayList<>();
    templateBodyBindings.add(new WhatsAppMessageTemplateBindingsComponent("VenueInfoInBody"));
    templateBodyBindings.add(new WhatsAppMessageTemplateBindingsComponent("TimeInfoInBody"));

    MessageTemplateBindings templateBindings = new WhatsAppMessageTemplateBindings()
        .setHeaderProperty(templateHeaderBindings) // Set the parameter binding for template header
        .setBody(templateBodyBindings); // Set the parameter binding for template body

    template
        .setBindings(templateBindings)
        .setValues(messageTemplateValues);

    NotificationMessagesClient client = createClientWithConnectionString();
    SendMessageResult result = client.send(
        new TemplateNotificationContent(CHANNEL_ID, recipients, template));

    result.getReceipts().forEach(r -> System.out.println("Message sent to:"+r.getTo() + " and message id:"+ r.getMessageId()));
}
```

### Send template message with quick reply buttons

Use `MessageTemplateQuickAction` to define the payload for quick reply buttons and `MessageTemplateQuickAction` objects have the following three attributes. 

|  Properties   | Description |  Type |
| --- | --- | --- |
| Name  | The `name` used to look up the value in `MessageTemplateWhatsAppBindings`. | string |
| Text  | The option quick action `text`. | string |
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

For more information about the payload in quick reply responses from the user, see WhatsApp's documentation for [Received Callback from a Quick Reply Button](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#received-callback-from-a-quick-reply-button).

#### Example

`sample_issue_resolution` template:

:::image type="content" source="../../media/template-messages/sample-issue-resolution-details-azure-portal.png" lightbox="../../media/template-messages/sample-issue-resolution-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_issue_resolution.":::

The body of the template requires one text parameter:

```java
/*
    * This sample shows how to send template message with below details
    * Name: sample_issue_resolution, Language: en_US
    *  [
          {
            "type": "BODY",
            "text": "Hi {{1}}, were we able to solve the issue that you were facing?"
          },
          {
            "type": "FOOTER",
            "text": "This message is from an unverified business."
          },
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
        ]
* */
private static void sendTextTemplateMessageWithQuickReply() {

    //Add template parameter type with value in a list
    List<MessageTemplateValue> messageTemplateValues = new ArrayList<>();
    messageTemplateValues.add(new MessageTemplateText("Name", "Arif"));
    messageTemplateValues.add(new MessageTemplateQuickAction("Yes").setPayload("Yes"));
    messageTemplateValues.add(new MessageTemplateQuickAction("No").setPayload("No"));

    // Add parameter binding for template body in a list
    List<WhatsAppMessageTemplateBindingsComponent> templateBodyBindings = new ArrayList<>();
    templateBodyBindings.add(new WhatsAppMessageTemplateBindingsComponent("Name"));

    // Add parameter binding for template buttons in a list
    List<WhatsAppMessageTemplateBindingsButton> templateButtonBindings = new ArrayList<>();
    templateButtonBindings.add( new WhatsAppMessageTemplateBindingsButton(WhatsAppMessageButtonSubType.QUICK_REPLY, "Yes"));
    templateButtonBindings.add( new WhatsAppMessageTemplateBindingsButton(WhatsAppMessageButtonSubType.QUICK_REPLY, "No"));

    MessageTemplateBindings templateBindings = new WhatsAppMessageTemplateBindings()
        .setBody(templateBodyBindings) // Set the parameter binding for template body
        .setButtons(templateButtonBindings); // Set the parameter binding for template buttons

    MessageTemplate messageTemplate = new MessageTemplate("sample_issue_resolution", "en_US")
        .setBindings(templateBindings)
        .setValues(messageTemplateValues);

    NotificationMessagesClient client = createClientWithConnectionString();
    SendMessageResult result = client.send(
        new TemplateNotificationContent(CHANNEL_ID, recipients, messageTemplate));

    result.getReceipts().forEach(r -> System.out.println("Message sent to:"+r.getTo() + " and message id:"+ r.getMessageId()));
}
```

### Send Template message with call to action buttons and dynamic link

Use `MessageTemplateQuickAction` to define the URL suffix for call to action buttons and `MessageTemplateQuickAction` object have the following two attributes.

| Properties | Description | Type |
| --- | --- | --- |
| Name  | The `name` used to look up the value in `MessageTemplateWhatsAppBindings`. | string |
| Text  | The  `text` appended to the URL.  | string |

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

:::image type="content" source="../../media/template-messages/edit-sample-purchase-feedback-whatsapp-manager.png" lightbox="../../media/template-messages/edit-sample-purchase-feedback-whatsapp-manager.png" alt-text="Screenshot that shows editing URL Type in the WhatsApp manager.":::

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

Create one `MessageTemplateImage`, one `MessageTemplateText`, and one `MessageTemplateQuickAction` variable. Then, assemble your list of `MessageTemplateValue` and your `MessageTemplateWhatsAppBindings` by providing the parameters in the order that the parameters appear in the template content. The order also matters when defining your bindings' buttons.

```java
/*
* This sample shows how to send template message with below details
* Name: sample_purchase_feedback, Language: en_US
*  [
        {
        "type": "HEADER",
        "format": "IMAGE"
        },
        {
        "type": "BODY",
        "text": "Thank you for purchasing {{1}}! We value your feedback and would like to learn more about your experience."
        },
        {
        "type": "FOOTER",
        "text": "This message is from an unverified business."
        },
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
    ]
* */
private static void sendTemplateMessageWithImage() {

    //Update Template Name and language according your template associate to your channel.
    MessageTemplate template = new MessageTemplate("sample_purchase_feedback", "en_US");

    //Add template parameter type with value in a list
    List<MessageTemplateValue> messageTemplateValues = new ArrayList<>();
    messageTemplateValues.add(new MessageTemplateImage("HeaderImage", "https://upload.wikimedia.org/wikipedia/commons/3/30/Building92microsoft.jpg"));
    messageTemplateValues.add(new MessageTemplateText("ProductInfoInBody", "Microsoft Office"));

    // Add parameter binding for template header in a list
    List<WhatsAppMessageTemplateBindingsComponent> templateHeaderBindings = new ArrayList<>();
    templateHeaderBindings.add(new WhatsAppMessageTemplateBindingsComponent("HeaderImage"));

    // Add parameter binding for template body in a list
    List<WhatsAppMessageTemplateBindingsComponent> templateBodyBindings = new ArrayList<>();
    templateBodyBindings.add(new WhatsAppMessageTemplateBindingsComponent("ProductInfoInBody"));

    MessageTemplateBindings templateBindings = new WhatsAppMessageTemplateBindings()
        .setHeaderProperty(templateHeaderBindings) // Set the parameter binding for template header
        .setBody(templateBodyBindings); // Set the parameter binding for template body

    template
        .setBindings(templateBindings)
        .setValues(messageTemplateValues);

    NotificationMessagesClient client = createClientWithConnectionString();
    SendMessageResult result = client.send(
        new TemplateNotificationContent(CHANNEL_ID, recipients, template));

    result.getReceipts().forEach(r -> System.out.println("Message sent to:"+r.getTo() + " and message id:"+ r.getMessageId()));
}
```

## Run the code

1. Open the directory that contains the `pom.xml` file and compile the project by using the `mvn` command.

   ```console
   mvn compile
   ```

1. Run the app by executing the following `mvn` command.

   ```console
   mvn exec:java -D"exec.mainClass"="com.communication.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
   ```

## Full sample code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages).
