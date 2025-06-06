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
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (We recommend 8.11.1 and 10.14.1).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 are recommended)
    - In a terminal or command window, run `node --version` to check that Node.js is installed

## Setting up

[!INCLUDE [Setting up for JavaScript Application](../javascript-application-setup.md)]

## Code examples

Follow these steps to add required code snippets to the main function of your `send-messages.js` file.
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user).
- [Send an image media message to a WhatsApp user](#send-an-image-media-message-to-a-whatsapp-user).
- [Send a document media message to a WhatsApp user](#send-a-document-media-message-to-a-whatsapp-user).
- [Send an audio media message to a WhatsApp user](#send-an-audio-media-message-to-a-whatsapp-user).
- [Send a video media message to a WhatsApp user](#send-a-video-media-message-to-a-whatsapp-user).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-javascript.md)]

> [!IMPORTANT]
> To send a message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

### Send a text message to a WhatsApp user

The Messages SDK enables Contoso to send text WhatsApp messages, when initiated by a WhatsApp users. To send text messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Message body/text to be sent.

In this example, we reply to the WhatsApp user with the text `"Thanks for your feedback.\n From Notification Messaging SDK."`

Assemble and send the text message:
```javascript
// Send text message
const textMessageResult = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: channelRegistrationId,
        to: recipientList,
        kind: "text",
        content: "Thanks for your feedback.\n From Notification Messaging SDK"
    }
});

// Process result
if (textMessageResult.status === "202") {
    textMessageResult.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

### Send an image media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of the Image media.

> [!IMPORTANT]
> As of SDK version 2.0.0, `MediaNotificationContent` is being deprecated for images. We encourage you to use `ImageNotificationContent` to send images. Explore other content-specific classes for other media types like `DocumentNotificationContent`, `VideoNotificationContent`, and `AudioNotificationContent`.

To send an image message, provide a URL to an image. For example:

```javascript
const url = "https://example.com/image.jpg";
```

Assemble and send the media message:

```javascript
// Send image message
const mediaMessageResult = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: channelRegistrationId,
        to: recipientList,
        kind: "image",
        mediaUri: url
    }
});

// Process result
if (mediaMessageResult.status === "202") {
    mediaMessageResult.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

### Send a video media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of the video.

To send a video message, provide a URL to a video. As an example,
```javascript
const url = "https://example.com/video.mp4";
```

Assemble and send the video message:
```javascript
// Send video message
const mediaMessageResult = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: channelRegistrationId,
        to: recipientList,
        kind: "video",
        mediaUri: url
    }
});

// Process result
if (mediaMessageResult.status === "202") {
    mediaMessageResult.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

### Send an audio media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of the Audio media.

To send an audio message, provide a URL to an audio file. As an example:

```javascript
const url = "https://example.com/audio.mp3";
```

Assemble and send the audio message:
```javascript
// Send audio message
const mediaMessageResult = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: channelRegistrationId,
        to: recipientList,
        kind: "audio",
        mediaUri: url
    }
});

// Process result
if (mediaMessageResult.status === "202") {
    mediaMessageResult.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

### Send a document media message to a WhatsApp user

The Messages SDK enables Contoso to send media (image, video, audio, or document) messages to WhatsApp users. To send an embedded media message, you need:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of the  Document media.

To send a document message, provide a URL to a document. As an example,
```javascript
const url = "https://example.com/document.pdf";
```

Assemble and send the document message:
```javascript
// Send document message
const mediaMessageResult = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: channelRegistrationId,
        to: recipientList,
        kind: "document",
        mediaUri: url
    }
});

// Process result
if (mediaMessageResult.status === "202") {
    mediaMessageResult.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

### Run the code

Use the node command to run the code you added to the `send-messages.js` file.

```console
node ./send-messages.js
```

## Full sample code

Find the finalized code on GitHub [Messages Services client library samples for JavaScript](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/communication/communication-messages-rest/samples).
