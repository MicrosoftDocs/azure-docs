---
title: include file
description: include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.date: 03/07/2024
ms.topic: include
ms.custom: include file
ms.author: armohamed
---

## Prerequisites

- [WhatsApp Business Account registered with your Azure Communication Services resource](../../connect-whatsapp-business-account.md)
- Active WhatsApp phone number to receive messages

- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 are recommended)
- In a terminal or command window, run `node --version` to check that Node.js is installed

## Setting up

To set up an environment for sending messages, take the steps in the following sections.

### Create a new Node.js application

1. Create a new directory for your app and navigate to it by opening your terminal or command window, then run the following command.

   ```console
   mkdir advance-messages-quickstart && cd advance-messages-quickstart
   ```

1. Run the following command to create a **package.json** file with default settings.

   ```console
   npm init -y
   ```

1. Use a text editor to create a file called **send-messages.js** in the project root directory.
1. Add the following code snippet to the file **send-messages.js**.
   ```typescript
   async function main() {
       // Quickstart code goes here.
   }

   main().catch((error) => {
       console.error("Encountered an error while sending message: ", error);
       process.exit(1);
   });
   ```
   

In the following sections, you added all the source code for this quickstart to the **send-messages.js** file that you created.

### Install the package

Use the `npm install` command to install the Azure Communication Services Advance Messaging SDK for JavaScript.

```console
npm install @azure-rest/communication-messages --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

## Object model
The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for .NET.

TODO:
| Name                                        | Description                                                                                           |
| --------------------------------------------|------------------------------------------------------------------------------------------------------ |
|                                         |                                                                                            |

## Code examples

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)
- [Send a template message to a WhatsApp user](#send-a-template-message-to-a-whatsapp-user)
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user)
- [Send a media message to a WhatsApp user](#send-a-media-message-to-a-whatsapp-user)

### Authenticate the client

#### [Connection String](#tab/connection-string)

The following code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING` using the dotenv package. Use the `npm install` command to install the dotenv package. Learn how to [manage your resource's connection string](../../../../create-communication-resource.md#store-your-connection-string).


```typescript
import MessageClient, { MessagesServiceClient } from "@azure-rest/communication-messages";

// Load the .env file if it exists
import * as dotenv from "dotenv";
dotenv.config();

// Quickstart code
const connectionString = process.env["COMMUNICATION_CONNECTION_STRING"];
const client:MessagesServiceClient = MessageClient(connectionString);
```

<a name='azure-active-directory'></a>

#### [Microsoft Entra ID](#tab/aad)

You can also authenticate with Microsoft Entra ID using the [Azure Identity library](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity). To use the [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential) provider in the following snippet, or other credential providers provided with the Azure SDK, install the [`@azure/identity`](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity) package:

```bash
npm install @azure/identity
```

The [`@azure/identity`](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity) package provides various credential types that your application can use to authenticate. The README for `@azure/identity` provides more details and samples to get you started.
`AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID`, and `AZURE_TENANT_ID` environment variables are needed to create a `DefaultAzureCredential` object.

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import MessageClient, { MessagesServiceClient } from "@azure-rest/communication-messages";

// Quickstart code
const endpoint = "https://<resource-name>.communication.azure.com";
let credential = new DefaultAzureCredential();
const client:MessagesServiceClient = MessageClient(endpoint, credential);
```

#### [AzureKeyCredential](#tab/azurekeycredential)

MessagesService clients can also be authenticated using an [AzureKeyCredential](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-core/latest/azure.core.html#azure.core.credentials.AzureKeyCredential). Both the `key` and the `endpoint` can be founded on the "Keys" pane under "Settings" in your Communication Services Resource.

```typescript
import { AzureKeyCredential } from "@azure/core-auth";
import MessageClient, { MessagesServiceClient } from "@azure-rest/communication-messages";

// Quickstart code
const endpoint = "https://<resource-name>.communication.azure.com";
const credential = new AzureKeyCredential("<your-key-credential>");
const client:MessagesServiceClient = MessageClient(endpoint, credential);
```

---

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../../identity/service-principal.md).

### Set channel registration ID  

TODO

### Set recipient list

TODO

### Send a template message to a WhatsApp user

Template definition:
```json
{ 
    Name: sample_shipping_confirmation,
    Language: en_US
    [
        {
        "type": "BODY",
        "text": "Your package has been shipped. It will be delivered in {{1}} business days."
        },
        {
        "type": "FOOTER",
        "text": "This message is from an unverified business."
        }
    ]
}
```

```typescript
// Quickstart code
const dayValue:MessageTemplateValue = {
    kind: "text",
    name: "Days",
    text: "5"
};

const templateBindings:MessageTemplateBindings = {
    kind: "whatsApp",
    body: [
        {
            refValue: "Days"
        }
    ]
};

const template:MessageTemplate = {
    name: "sample_shipping_confirmation",
    language: "en_US",
    bindings: templateBindings,
    values: [dayValue]
};

const  result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: "<CHANNEl_ID>",
        to: ["<to-phone-number-1>"],
        kind: "template",
        template: template
    }
});
if (result.status === "202") {
    const response:Send202Response = result as Send202Response;
    response.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

### Send a text message to a WhatsApp user

> [!NOTE]
> Business can't start a conversation with a text message. It needs to be user initiated.

```typescript
const  result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: "<CHANNEl_ID>",
        to: ["<to-phone-number-1>"],
        kind: "text",
        content: "Hello World!!"
    }
});

if (result.status === "202") {
    const response:Send202Response = result as Send202Response;
    response.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

### Send a media message to a WhatsApp user

> [!NOTE]
> Business can't start a conversation with a media message. It needs to be user initiated.

```typescript
const  result = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: "<CHANNEl_ID>",
        to: ["<to-phone-number-1>"],
        kind: "image",
        mediaUri: "https://wallpapercave.com/wp/wp2163723.jpg"
    }
});

if (result.status === "202") {
    const response:Send202Response = result as Send202Response;
    response.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

TODO - Move this to Templates page
### Get template list

```typescript
const response = 
    await client.path("/messages/channels/{channelId}/templates", "<CHANNEl_ID>").get();

if (response.status == "200") {
    // The paginate helper creates a paged async iterator using metadata from the first page.
    const items = paginate(client, response);

    // We get an PageableAsyncIterator so we need to do `for await`.
    for await (const item of items) {
        console.log(JSON.stringify(item, null, 2));
    }
} 
```

## Run the code

Use the node command to run the code you added to the send-messages.js file.

```console
node ./send-messages.js
```

## Sample code

You can download the sample app from [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/7efc61a0414c6f898409e355d0ba8d228882625f/sdk/communication/communication-messages-rest/samples-dev).

