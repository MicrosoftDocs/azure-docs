---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 05/01/2025
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- Active WhatsApp phone number to receive messages.
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Set up environment

To set up an environment for sending messages, complete the steps in the following sections.

[!INCLUDE [Setting up for Java Application](../java-application-setup.md)]


## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK.

| Class Name | Description |
| --- |--- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `InteractiveNotificationContent`  | Defines the interactive message business can send to user. |
| `InteractiveMessage` | Defines interactive message content.|
| `WhatsAppListActionBindings` | Defines WhatsApp List interactive message properties binding. |
| `WhatsAppButtonActionBindings`| Defines WhatsApp Button interactive message properties binding.|
| `WhatsAppUrlActionBindings` | Defines WhatsApp Url interactive message properties binding.|
| `TextMessageContent`     | Defines the text content for Interactive message body, footer, header. |
| `VideoMessageContent`   | Defines the video content for Interactive message header.  |
| `DocumentMessageContent` | Defines the document content for Interactive message header. |
| `ImageMessageContent` | Defines the image content for Interactive message header.|
| `ActionGroupContent` | Defines the ActionGroup or ListOptions content for Interactive message.|
| `ButtonSetContent` | Defines the Reply Buttons content for Interactive message. |
| `LinkContent` | Defines the Url or Click-To-Action content for Interactive message. |

> [!NOTE]
> For more information, see the Azure SDK for Java reference at [com.azure.communication.messages Package](/java/api/com.azure.communication.messages).

## Common configuration

Follow these steps to add required code snippets to the main function of your `App.java` file.

- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-java.md)]

## Code examples

Follow these steps to add required code snippets to the main function of your `App.java` file.
- [Send an Interactive List options message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Reply Button message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Click-to-action Url based message to a WhatsApp user](#send-an-interactive-call-to-action-url-based-message-to-a-whatsapp-user).

### Send an interactive list options message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send an interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends an interactive shipping options message to the user.

```java

// Create Express Shipping options group
List<ActionGroupItem> group1 = new ArrayList<>();
group1.add(new ActionGroupItem("priority_express", "Priority Mail Express", "Delivered on same day!"));
group1.add(new ActionGroupItem("priority_mail", "Priority Mail", "Delivered in 1-2 days"));

// Create Normal Shipping options group
List<ActionGroupItem> group2 = new ArrayList<>();
group2.add(new ActionGroupItem("usps_ground_advantage", "USPS Ground Advantage", "Delivered in 2-5 days"));
group2.add(new ActionGroupItem("normal_mail", "Normal Mail", "Delivered in 5-8 days"));

// Add Shipping options
List<ActionGroup> options = new ArrayList<>();
options.add(new ActionGroup("Express Delivery", group1));
options.add(new ActionGroup("Normal Delivery", group2));
ActionGroupContent actionGroupContent = new ActionGroupContent("Shipping Options", options);

// Build interactive message with body, header (optional), footer (optional)
InteractiveMessage interactiveMessage = new InteractiveMessage(
    new TextMessageContent("Which shipping option do you want?"), new WhatsAppListActionBindings(actionGroupContent));
interactiveMessage.setFooter(new TextMessageContent("Logistic Ltd"));
interactiveMessage.setHeader(new TextMessageContent("Shipping Options"));

InteractiveNotificationContent interactiveMessageContent new InteractiveNotificationContent("<CHANNEL_ID>", recipients, interactiveMessage);

// Send an interactive message
SendMessageResult textMessageResult = notificationClient.send(interactiveMessageContent);

// Process result
for (MessageReceipt messageReceipt : textMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Send an interactive reply button message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send an interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends an interactive reply button message to the user.

```java
// Assemble interactive reply button
List<ButtonContent> buttonActions =  new ArrayList<>();
buttonActions.add(new ButtonContent("no",  "No"));
buttonActions.add(new ButtonContent("yes",  "Yes"));
ButtonSetContent buttonSet = new ButtonSetContent(buttonActions);
InteractiveMessage interactiveMessage = new InteractiveMessage(new TextMessageContent("Do you want to proceed?"), new WhatsAppButtonActionBindings(buttonSet));

InteractiveNotificationContent interactiveMessageContent new InteractiveNotificationContent("<CHANNEL_ID>", recipients, interactiveMessage);

// Send an interactive message
SendMessageResult textMessageResult = notificationClient.send(interactiveMessageContent);

// Process result
for (MessageReceipt messageReceipt : textMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Send an interactive call-to-action URL based message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send an interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a click to a link message to the user.

```java
LinkContent urlAction = new LinkContent("Click here to find out", "https://wallpapercave.com/wp/wp2163723.jpg");
InteractiveMessage interactiveMessage = new InteractiveMessage(
    new TextMessageContent("The best Guardian of Galaxy"), new WhatsAppUrlActionBindings(urlAction));
interactiveMessage.setFooter(new TextMessageContent("Intergalactic New Ltd"));

InteractiveNotificationContent interactiveMessageContent new InteractiveNotificationContent("<CHANNEL_ID>", recipients, interactiveMessage);

// Send an interactive message
SendMessageResult textMessageResult = notificationClient.send(interactiveMessageContent);

// Process result
for (MessageReceipt messageReceipt : textMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Run the code

1. Open to the directory that contains the `pom.xml` file and compile the project using the `mvn` command.

   ```console
   mvn compile
   ```

1. Run the app by executing the following `mvn` command.

   ```console
   mvn exec:java -D"exec.mainClass"="com.communication.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
   ```

## Full sample code

Find the finalized code for this sample on GitHub at [Azure Messages client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages).
