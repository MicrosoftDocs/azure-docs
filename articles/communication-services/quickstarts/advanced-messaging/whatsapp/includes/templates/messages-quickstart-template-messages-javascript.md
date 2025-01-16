---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 12/20/2024
ms.topic: include
ms.custom: include file
ms.author: shamkh
---

## Set up environment

To set up an environment for sending messages, complete the steps in the following sections.

[!INCLUDE [Setting up for JavaScript Application](../javascript-application-setup.md)]

## Code examples

Follow these steps to add required code snippets to the main function of your `App.java` file.
- [List WhatsApp templates in the Azure portal](#list-whatsapp-templates-in-the-azure-portal).
- [Send template message with text parameters in the body](#send-template-message-with-text-parameters-in-the-body).

### List WhatsApp templates in the Azure portal

To view your templates in the Azure portal, go to your Azure Communication Services resource > **Advanced Messaging** > **Templates**.

:::image type="content" source="../../media/template-messages/list-templates-azure-portal.png" lightbox="../../media/template-messages/list-templates-azure-portal.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the advanced messaging templates tab.":::

Selecting a template to view the template details.

The **Content** field of the template details can include parameter bindings. The parameter bindings can be denoted as:
- A `"format"` field with a value such as `IMAGE`.
- Double brackets surrounding a number, such as `{{1}}`. The number, index started at 1, indicates the order in which the binding values must be supplied to create the message template.

:::image type="content" source="../../media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" lightbox="../../media/template-messages/sample-movie-ticket-confirmation-azure-portal.png" alt-text="Screenshot that shows template details.":::

Alternatively, you can view and edit all of your WhatsApp Business Account templates in the [WhatsApp Manager](https://business.facebook.com/wa/manage/home/) > Account tools > [Message templates](https://business.facebook.com/wa/manage/message-templates/). 

To list out your templates programmatically, you can fetch all templates for your channel ID using the following code:

```javascript
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @summary Get Template list for a channel
 */

const MessageTemplateClient = require("@azure-rest/communication-messages").default,
  { isUnexpected } = require("@azure-rest/communication-messages");

// Load the .env file if it exists
require("dotenv").config();

async function main() {
  const connectionString = process.env.COMMUNICATION_LIVETEST_STATIC_CONNECTION_STRING || "";
  const client = MessageTemplateClient(connectionString);
  console.log("Fetch Templates...");
  const response = await client
    .path("/messages/channels/{channelId}/templates", process.env.CHANNEl_ID || "")
    .get({
      queryParameters: { maxPageSize: 2 },
    });

  if (isUnexpected(response)) {
    throw new Error("Failed to get template for the channel.");
  }

  // The paginate helper creates a paged async iterator using metadata from the first page.
  const items = paginate(client, response);

  // We get an PageableAsyncIterator so we need to do `for await`.
  for await (const item of items) {
    console.log(JSON.stringify(item, null, 2));
  }
}

main().catch((error) => {
  console.error("Encountered an error while sending message: ", error);
  throw error;
});
```

### Send template message with text parameters in the body

To define parameters in the body denoted with double brackets surrounding a number, such as `{{1}}`. The number, index started at 1, indicates the order in which the binding values must be supplied to create the message template. Including parameters not in the template is invalid.

Template definition with two parameters:
```json
{
  "type": "BODY",
  "text": "Message with two parameters: {{1}} and {{2}}"
}
```

#### Examples

`sample_shipping_confirmation` template:

:::image type="content" source="../../media/template-messages/sample-shipping-confirmation-details-azure-portal.png" lightbox="../../media/template-messages/sample-shipping-confirmation-details-azure-portal.png" alt-text="Screenshot that shows template details for template named sample_shipping_confirmation.":::

In this sample, the body of the template has one parameter:

```json
{
  "type": "BODY",
  "text": "Your package has been shipped. It will be delivered in {{1}} business days."
},
```

Parameters are defined with the `values` values and `bindings` bindings. Use the values and bindings to assemble the `template` object.

```javascript
 /*
    * This sample shows how to send template message with below details
    * Name: sample_shipping_confirmation, Language: en_US
    *  [
          {
            "type": "BODY",
            "text": "Your package has been shipped. It will be delivered in {{1}} business days."
          },
          {
            "type": "FOOTER",
            "text": "This message is from an unverified business."
          }
        ]
* */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @summary Use AAD token credentials when sending a whatsapp template message.
 */

const { isNode } = require("@azure/core-util");
const { ClientSecretCredential, DefaultAzureCredential } = require("@azure/identity");
const NotificationClient = require("@azure-rest/communication-messages").default,
  { isUnexpected } = require("@azure-rest/communication-messages");

// Load the .env file if it exists
require("dotenv").config();

async function main() {
  // You will need to set this environment variable or edit the following values
  const endpoint = process.env.ACS_URL || "";

  // Azure AD Credential information is required to run this sample:
  if (
    !process.env.AZURE_TENANT_ID ||
    !process.env.AZURE_CLIENT_ID ||
    !process.env.AZURE_CLIENT_SECRET
  ) {
    console.error(
      "Azure AD authentication information not provided, but it is required to run this sample. Exiting.",
    );
    return;
  }

  // get credentials
  const credential = isNode
    ? new DefaultAzureCredential()
    : new ClientSecretCredential(
        process.env.AZURE_TENANT_ID,
        process.env.AZURE_CLIENT_ID,
        process.env.AZURE_CLIENT_SECRET,
      );

  const client = NotificationClient(endpoint, credential);

  const DaysTemplateValue = {
    kind: "text",
    name: "Days",
    text: "5",
  };

  const templateBindings = {
    kind: "whatsApp",
    body: [
      {
        refValue: "Days",
      },
    ],
  };

  const template = {
    name: "sample_shipping_confirmation",
    language: "en_US",
    bindings: templateBindings,
    values: [DaysTemplateValue],
  };

  const result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
      channelRegistrationId: process.env.CHANNEL_ID || "",
      to: [process.env.RECIPIENT_PHONE_NUMBER || ""],
      kind: "template",
      template: template,
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

module.exports = { main };
```

## Run the code
Use the node command to run the code you added to the send-messages.js file.

```console
node ./send-messages.js
```

## Full sample code

Find the finalized code for this quickstart on [GitHub](https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/communication/communication-messages-rest/samples/v2/javascript/).