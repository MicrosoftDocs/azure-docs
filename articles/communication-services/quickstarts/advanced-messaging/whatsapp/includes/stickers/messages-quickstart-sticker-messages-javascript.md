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
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 are recommended).
    - In a terminal or command window, run `node --version` to check that Node.js is installed.

## Setting up

[!INCLUDE [Setting up for JavaScript Application](../javascript-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Messages SDK for JavaScript.

| Class Name | Description |
| --- | --- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.              |
| `StickerNotificationContent` |  Defines sticker content of the messages. |

> [!NOTE]
> For more information, see the Azure SDK for JavaScript reference [@Azure-rest/communication-messages package](/javascript/api/@azure-rest/communication-messages)

## Common configuration

Follow these steps to add required code snippets to your `send-messages.js` file.
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-javascript.md)]

## Code examples

Follow these steps to add required code snippets to your `send-messages.js` file.
- [Send a Sticker messages to a WhatsApp user](#send-a-sticker-messages-to-a-whatsapp-user).

### Send a sticker messages to a WhatsApp user

The Messages SDK enables Contoso to send reaction WhatsApp messages, when initiated by WhatsApp users. To send text messages:

- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- URL of a sticker.

> [!IMPORTANT]
> To send a sticker message to user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a sticker message to the user:

```javascript
/**
 * @summary Send a sticker message. Supported sticker type - (.webp)
 */

const { AzureKeyCredential } = require("@azure/core-auth");
const NotificationClient = require("@azure-rest/communication-messages").default,
  { isUnexpected } = require("@azure-rest/communication-messages");
// Load the .env file if it exists
require("dotenv").config();

async function main() {
  const credential = new AzureKeyCredential(process.env.ACS_ACCESS_KEY || "");
  const endpoint = process.env.ACS_URL || "";
  const client = NotificationClient(endpoint, credential);
  console.log("Sending message...");
  const result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
      channelRegistrationId: process.env.CHANNEL_ID || "",
      to: [process.env.RECIPIENT_PHONE_NUMBER || ""],
      kind: "sticker",
      mediaUri: "https://www.gstatic.com/webp/gallery/1.sm.webp",
    },
  });

  console.log("Response: " + JSON.stringify(result, null, 2));

  if (isUnexpected(result)) {
    throw new Error("Failed to send message");
  }

  const response = result;
  response.body.receipts.forEach((receipt) => {
    console.log("Message sent to:" + receipt.to + " with message id:" + receipt.messageId);
  });
}

main().catch((error) => {
  console.error("Encountered an error while sending message: ", error);
  throw error;
});
```

## Run the code

Use the node command to run the code you added to the send-messages.js file.

```console
node ./send-messages.js
```

## Full sample code

Find the finalized code for this sample on GitHub [JavaScript Messages SDK](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/communication/communication-messages-rest/samples).
