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

## Set up environment

To set up an environment for sending messages, complete the steps in the following sections.

[!INCLUDE [Setting up for JavaScript Application](../javascript-application-setup.md)]

## Code examples

Follow these steps to add required code snippets to your `send-messages.js` file.
- [Send an Interactive List options message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Reply Button message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Click-to-action Url based message to a WhatsApp user](#send-an-interactive-click-to-action-url-based-message-to-a-whatsapp-user)


### Send an Interactive List options message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send a interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends an interactive shipping options message to the user.

```javascript
/**
 * @summary Send a interactive message
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

  const interactiveMessage = {
    body: {
      kind: "text",
      text: "Do you want to proceed?",
    },
    action: {
      kind: "whatsAppListAction",
      content: {
        kind: "group",
        title: "Shipping Options",
        groups: [
          {
            title: "Express Delivery",
            items: [
              {
                id: "priority_mail_express",
                title: "Priority Mail Express",
                description: "Delivered on same day!",
              },
              {
                id: "priority_mail",
                title: "Priority Mail",
                description: "Delivered in 1-2 days",
              },
            ],
          },
          {
            title: "Normal Delivery",
            items: [
              {
                id: "usps_ground_advantage",
                title: "USPS Ground Advantage",
                description: "Delivered in 2-5 days",
              },
              {
                id: "usps_mail",
                title: "Normal Mail",
                description: "Delivered in 5-8 days",
              },
            ],
          },
        ],
      },
    },
  };

  console.log("Sending message...");
  const result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
      channelRegistrationId: process.env.CHANNEL_ID || "",
      to: [process.env.RECIPIENT_PHONE_NUMBER || ""],
      kind: "interactive",
      interactiveMessage: interactiveMessage,
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

### Send an Interactive Reply Button message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send a interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a reply button message to the user.

```javascript
/**
 * @summary Send a interactive message
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

  const interactiveMessage = {
    body: {
      kind: "text",
      text: "Do you want to proceed?",
    },
    action: {
      kind: "whatsAppButtonAction",
      content: {
        kind: "buttonSet",
        buttons: [
          {
            id: "yes",
            title: "Yes",
          },
          {
            id: "no",
            title: "No",
          },
        ],
      },
    },
  };

  console.log("Sending message...");
  const result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
      channelRegistrationId: process.env.CHANNEL_ID || "",
      to: [process.env.RECIPIENT_PHONE_NUMBER || ""],
      kind: "interactive",
      interactiveMessage: interactiveMessage,
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

### Send an Interactive Click-to-action Url based message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send a interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a click to a link message to the user.

```javascript
/**
 * @summary Send a interactive message
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

  const interactiveMessage = {
    body: {
      kind: "text",
      text: "The best Guardian of Galaxy",
    },
    action: {
      kind: "whatsAppUrlAction",
      content: {
        kind: "url",
        title: "Rocket is the best!",
        url: "https://wallpapercave.com/wp/wp2163723.jpg",
      },
    },
    footer: {
      kind: "text",
      text: "Intergalactic News Ltd",
    },
  };

  console.log("Sending message...");
  const result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
      channelRegistrationId: process.env.CHANNEL_ID || "",
      to: [process.env.RECIPIENT_PHONE_NUMBER || ""],
      kind: "interactive",
      interactiveMessage: interactiveMessage,
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