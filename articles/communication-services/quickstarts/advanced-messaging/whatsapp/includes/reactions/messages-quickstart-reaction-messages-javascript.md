---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 1/24/2025
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

## Prerequisites

## Setting up

[!INCLUDE [Setting up for JavaScript Application](../javascript-application-setup.md)]

## Code examples

Follow these steps to add required code snippets to your `send-messages.js` file.
- [Send a Reaction messages to a WhatsApp user message](#send-a-reaction-messages-to-a-whatsapp-user-message).

### Send a Reaction messages to a WhatsApp user message

The Messages SDK enables Contoso to send reaction WhatsApp messages, when initiated by WhatsApp users. To send text messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Reaction message content.

> [!IMPORTANT]
> To send a reaction to user message, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a reaction to the user message:

```javascript
/**
 * @summary Send a reaction message
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
      kind: "reaction",
      emoji: "😍",
      messageId: "<incoming_message_id>",
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

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/communication/communication-messages-rest/samples).
