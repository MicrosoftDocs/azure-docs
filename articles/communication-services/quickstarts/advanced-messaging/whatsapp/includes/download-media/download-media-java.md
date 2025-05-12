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
- [Event subscription and handling of Advanced Message Received events](./../../handle-advanced-messaging-events.md#subscribe-to-advanced-messaging-events).
- [Java Development Kit (JDK)](/java/azure/jdk/) version 8 or later.
- [Apache Maven](https://maven.apache.org/download.cgi).

## Set up environment

To set up an environment for sending messages, complete the following steps.

[!INCLUDE [Setting up for Java Application](../java-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for Java.

| Name | Description |
| --- | --- |
| [NotificationMessagesClient](/java/api/com.azure.communication.messages.notificationmessagesclient)          | This class connects to your Azure Communication Services resource. It sends the messages.                   |
| [DownloadMediaAsync](/java/api/com.azure.communication.messages)  | Download the media payload from a User to Business message asynchronously, writing the content to a stream. |
| [Microsoft.Communication.AdvancedMessageReceived](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event) | Event Grid event that is published when Advanced Messaging receives a message. |

> [!NOTE]
> For more information, see the Azure SDK for Java reference at [com.azure.communication.messages Package](/java/api/com.azure.communication.messages).

## Common configuration

Follow these steps to add the necessary code snippets to the main function of your `App.java` file.

- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-java.md)]

## Code examples

Follow these steps to add required code snippets to the main function of `App.java`.
- [Download the media payload to a stream](#download-the-media-payload-to-a-stream)

### Download the media payload to a stream

The Messages SDK enables Contoso to download the media in received WhatsApp media messages from WhatsApp users. To download the media payload to a stream, you need:
- [Authenticated NotificationMessagesClient](#authenticate-the-client).
- The media ID GUID of the media (Received from an incoming message in an [AdvancedMessageReceived event](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event)).

```java
    public static void main(String[] args) throws IOException {

        NotificationMessagesClient messagesClient = new NotificationMessagesClientBuilder()
            .connectionString(connectionString)
            .buildClient();

        BinaryData data = messagesClient.downloadMedia("<MEDIA_ID>");
        BufferedImage image = ImageIO.read(data.toStream());
        ImageIcon icon = new ImageIcon(image);
        JLabel label  = new JLabel(icon);
        JFrame frame = new JFrame();
        frame.add(label);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);
    }
```

### Run the code

1. Open the directory that contains the `pom.xml` file and compile the project using the `mvn` command.

   ```console
   mvn compile
   ```

1. Run the app by executing the following `mvn` command.

   ```console
   mvn exec:java -D"exec.mainClass"="com.communication.quickstart.App" -D"exec.cleanupDaemonThreads"="false"
   ```

## Full sample code

Find the finalized code on GitHub at [Java Messages SDK](https://github.com/Azure/azure-sdk-for-java/tree/d668cb44f64d303e71d2ee72a8b0382896aa09d5/sdk/communication/azure-communication-messages/src/samples/java/com/azure/communication/messages/DownloadMediaSample.java).
