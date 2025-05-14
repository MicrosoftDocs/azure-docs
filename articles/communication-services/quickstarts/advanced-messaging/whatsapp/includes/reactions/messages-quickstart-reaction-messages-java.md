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

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for Java.

| Class Name | Description  |
| --- | --- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `ReactionNotificationContent` | Defines the reaction content of the messages with emoji and reply message ID.|

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
- [Send a Reaction messages to a WhatsApp user message](#send-a-reaction-messages-to-a-whatsapp-user-message).

### Send a Reaction messages to a WhatsApp user message

The Messages SDK enables Contoso to send reaction WhatsApp messages, when initiated by WhatsApp users. To send text messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Unicode escape sequence of the emoji.
- Message ID of message you want to apply the emoji to.

> [!IMPORTANT]
> To send a reaction to user message, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

Assemble and send the reaction to a message:

```java
// Assemble reaction to a message
String emoji = "\uD83D\uDE00";
ReactionNotificationContent reaction = new ReactionNotificationContent("<CHANNEL_ID>", recipients, emoji, "<REPLY_MESSAGE_ID>");

// Send reaction to a message
SendMessageResult textMessageResult = notificationClient.send(reaction);

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

Find the finalized code for this sample on GitHub at [Java Messages SDK](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages).
