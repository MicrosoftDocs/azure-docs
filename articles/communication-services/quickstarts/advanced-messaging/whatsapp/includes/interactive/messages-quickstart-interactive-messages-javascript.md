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
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 are recommended)
    - In a terminal or command window, run `node --version` to check that Node.js is installed

## Setting up

[!INCLUDE [Setting up for JavaScript Application](../javascript-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for JavaScript.

| Class Name | Description |
| --- |--- |
| `NotificationMessagesClient`  | Connects to your Azure Communication Services resource. It sends the messages.  |
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
> For more information, see the Azure SDK for JavaScript reference [@azure-rest/communication-messages package](/javascript/api/@azure-rest/communication-messages)

## Common configuration

Follow these steps to add required code snippets to your `send-messages.js` file.
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-javascript.md)]

## Code examples

Follow these steps to add required code snippets to your `send-messages.js` file.
- [Send an Interactive List options message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Reply Button message to a WhatsApp user](#send-an-interactive-reply-button-message-to-a-whatsapp-user).
- [Send an Interactive Click-to-action Url based message to a WhatsApp user](#send-an-interactive-call-to-action-url-based-message-to-a-whatsapp-user)


### Send an Interactive List options message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send an interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends an interactive shipping options message to the user.

```javascript
/**
 * @summary Send an interactive message
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
      text: "Which shipping option do you want?",
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
> To send an interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a reply button message to the user.

```javascript
/**
 * @summary Send an interactive message
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

### Send an Interactive Call-To-Action Url based message to a WhatsApp user

The Messages SDK enables Contoso to send interactive WhatsApp messages, when initiated by a WhatsApp users. To send interactive messages:
- [WhatsApp Channel ID](#set-channel-registration-id).
- [Recipient Phone Number in E16 format](#set-recipient-list).
- Interactive message to be sent.

> [!IMPORTANT]
> To send an interactive message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, the business sends a click to a link message to the user.

```javascript
/**
 * @summary Send an interactive message
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

Find the finalized code for this sample on GitHub at [JavaScript Messages SDK](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/communication/communication-messages-rest/samples).