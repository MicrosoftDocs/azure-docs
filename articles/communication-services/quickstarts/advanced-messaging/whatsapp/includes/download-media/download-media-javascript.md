---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 05/01/2025
ms.topic: include
ms.custom: include file
ms.author: shamkh
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md).
- Active WhatsApp phone number to receive messages.
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (recommended versions: 8.11.1 and 10.14.1).

   In a terminal or command window, verify that Node.js is installed by running:

   ```console
   node --version
   ```

## Set up environment

To set up an environment for sending messages, complete the following steps.

[!INCLUDE [Setting up for JavaScript Application](../javascript-application-setup.md)]

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for JavaScript.

| Name | Description                                                          |
| --- | --- |
| [NotificationClient](/javascript/api/@azure-rest/communication-messages/messagesserviceclient) | This class connects to your Azure Communication Services resource. It sends the messages.                   |
| [DownloadMediaAsync](/javascript/api/@azure-rest/communication-messages/getmedia) | Download the media payload from a User to Business message asynchronously, writing the content to a stream. |
| [Microsoft.Communication.AdvancedMessageReceived](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event) | Event Grid event that is published when Advanced Messaging receives a message. |

> [!NOTE]
> For more information, see the Azure SDK for JavaScript reference [@Azure-rest/communication-messages package](/javascript/api/@azure-rest/communication-messages)

## Common configuration

Follow these steps to add required code snippets to the main function of your `DownloadMedia.js` file.

- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).
- [Authenticate the client](#authenticate-the-client).
- [Set channel registration ID](#set-channel-registration-id).
- [Set recipient list](#set-recipient-list).

[!INCLUDE [Common setting for using Advanced Messages SDK](../common-setting-javascript.md)]

## Code examples

Follow these steps to add required code snippets to the main function of your `DownloadMedia.js` file.
- [Download the media payload to a stream](#download-the-media-payload-to-a-stream)

### Download the media payload to a stream

The Messages SDK enables Contoso to respond with WhatsApp text messages when initiated by a WhatsApp users. To send text messages, complete the following steps:
- [Authenticated NotificationMessagesClient](#authenticate-the-client)
- The media ID GUID of the media (Received from an incoming message in an [AdvancedMessageReceived event](/azure/event-grid/communication-services-advanced-messaging-events#microsoftcommunicationadvancedmessagereceived-event))

In this example, we reply to the WhatsApp user with the text: `"Thanks for your feedback.\n From Notification Messaging SDK."`

Assemble and send the media message:

```javascript
const credential = new AzureKeyCredential(process.env.ACS_ACCESS_KEY || "");
const endpoint = process.env.ACS_URL || "";
const client = NotificationClient(endpoint, credential);
console.log("Downloading...");
await client
.path("/messages/streams/{id}", "<MEDIA_ID>")
.get()
.asNodeStream()
.then((resp) => {
    resp.body?.pipe(fs.createWriteStream("downloadedMedia.jpeg"));
    return;
});
```
### Run the code

Use the node command to run the code you added to the `send-messages.js` file.

```console
node ./send-messages.js
```

## Full sample code

Download media received by advanced messaging events.

```javascript
/**
 * @summary Download a media file
 */

const NotificationClient = require("@azure-rest/communication-messages").default;
const { AzureKeyCredential } = require("@azure/core-auth");
const fs = require("fs");

// Load the .env file if it exists
require("dotenv").config();

async function main() {
  const credential = new AzureKeyCredential(process.env.ACS_ACCESS_KEY || "");
  const endpoint = process.env.ACS_URL || "";
  const client = NotificationClient(endpoint, credential);
  console.log("Downloading...");
  await client
    .path("/messages/streams/{id}", "<MEDIA_ID>")
    .get()
    .asNodeStream()
    .then((resp) => {
      resp.body?.pipe(fs.createWriteStream("downloadedMedia.jpeg"));
      return;
    });
}

main().catch((error) => {
  console.error("Encountered an error while sending message: ", error);
  throw error;
});
```