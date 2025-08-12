---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 02/29/2024
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

## Code examples

Follow these steps to add required code snippets to the main function of your `App.java` file.
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user)
- [Send an image media message to a WhatsApp user](#send-an-image-media-message-to-a-whatsapp-user)
- [Send a document media message to a WhatsApp user](#send-a-document-media-message-to-a-whatsapp-user)
- [Send an audio media message to a WhatsApp user](#send-an-audio-media-message-to-a-whatsapp-user)
- [Send a video media message to a WhatsApp user](#send-a-video-media-message-to-a-whatsapp-user)

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-java.md)]

### Send a text message to a WhatsApp user

Messages SDK allows Contoso to send text WhatsApp messages, which initiated WhatsApp users initiated. To send text messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Message body/text to be sent

In this example, we reply to the WhatsApp user with the text `"Thanks for your feedback.\n From Notification Messaging SDK."`

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

Assemble and send the text message:

```java
// Assemble text message
TextNotificationContent textContent = new TextNotificationContent(channelRegistrationId, recipientList, "“Thanks for your feedback.\n From Notification Messaging SDK");

// Send text message
SendMessageResult textMessageResult = notificationClient.send(textContent);

// Process result
for (MessageReceipt messageReceipt : textMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Send an image media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- URL of the Image media

> [!IMPORTANT]
> As of SDK version 1.1.0, `MediaNotificationContent` is being deprecated for images. We encourage you to use `ImageNotificationContent` to send images. Explore other content-specific classes for other media types like `DocumentNotificationContent`, `VideoNotificationContent`, and `AudioNotificationContent`.

> [!IMPORTANT]
> To send an image message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

Assemble and send the image message:

```java
// Assemble image message
String imageUrl = "https://example.com/image.jpg";
ImageNotificationContent imageContent = new ImageNotificationContent(channelRegistrationId, recipientList, imageUrl);

// Send image message
SendMessageResult imageMessageResult = notificationClient.send(imageContent);

// Process result
for (MessageReceipt messageReceipt : imageMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Send a video media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of the Video media.

> [!IMPORTANT]
> To send a video message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

Assemble and send the video message:

```java
// Assemble video message
String videoUrl = "https://example.com/video.mp4";
VideoNotificationContent videoContent = new VideoNotificationContent(channelRegistrationId, recipientList, videoUrl);

// Send video message
SendMessageResult videoMessageResult = notificationClient.send(videoContent);

// Process result
for (MessageReceipt messageReceipt : videoMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Send an audio media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of the Audio media.

> [!IMPORTANT]
> To send an audio message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

Assemble and send the audio message:

```java
// Assemble audio message
String audioUrl = "https://example.com/audio.mp3";
AudioNotificationContent audioContent = new AudioNotificationContent(channelRegistrationId, recipientList, audioUrl);

// Send audio message
SendMessageResult audioMessageResult = notificationClient.send(audioContent);

// Process result
for (MessageReceipt messageReceipt : audioMessageResult.getReceipts()) {
    System.out.println("Message sent to:" + messageReceipt.getTo() + " and message id:" + messageReceipt.getMessageId());
}
```

### Send a document media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of the Document media.

> [!IMPORTANT]
> To send a document message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

Assemble and send the document message:

```java
// Assemble document message
String docUrl = "https://example.com/document.pdf";
DocumentNotificationContent docContent = new DocumentNotificationContent(channelRegistrationId, recipientList, docUrl);

// Send document message
SendMessageResult docMessageResult = notificationClient.send(docContent);

// Process result
for (MessageReceipt messageReceipt : docMessageResult.getReceipts()) {
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

Find the finalized on GitHub at [Azure Messages client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages).
