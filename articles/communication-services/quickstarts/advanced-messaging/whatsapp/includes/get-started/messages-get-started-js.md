---
title: Include file
description: Include file
services: azure-communication-services
author: arifibrahim4
ms.service: azure-communication-services
ms.date: 02/29/2024
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
   ```javascript
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
The following classes and interfaces handle some of the major features of the Azure Communication Services Advance Messaging SDK for JavaScript.

| Name            | Description                                                                                            |
|-----------------|--------------------------------------------------------------------------------------------------------|
| MessageClient   | This class connects to your Azure Communication Services resource. It sends the messages.              |
| MessageTemplate | This class defines which template you use and the content of the template properties for your message. |

## Code examples

Follow these steps to add the necessary code snippets to the main function of your *send-messages.js* file.

- [Authenticate the client](#authenticate-the-client)
- [Set channel registration ID](#set-channel-registration-id)
- [Set recipient list](#set-recipient-list)
- [Start sending messages between a business and a WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user)
  - [Send a template message to a WhatsApp User](#option-1-initiate-conversation-from-business---send-a-template-message)
  - [Initiate conversation from user](#option-2-initiate-conversation-from-user)
- [Send a text message to a WhatsApp user](#send-a-text-message-to-a-whatsapp-user)
- [Send a media message to a WhatsApp user](#send-a-media-message-to-a-whatsapp-user)

### Authenticate the client

#### [Connection String](#tab/connection-string)

The following code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING` using the dotenv package. 

For simplicity, this quickstart uses a connection string to authenticate. In production environments, we recommend using [service principals](../../../../identity/service-principal.md).

Get the connection string from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Connection string` field for the `Primary key`. The connection string is in the format `endpoint=https://{your Azure Communication Services resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../../media/get-started/get-communication-resource-connection-string.png" lightbox="../../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<your connection string>"
```

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).


To instantiate a MessageClient, add the following code to the `Main` method:
```javascript
const MessageClient = require("@azure-rest/communication-messages").default;

// Set Connection string
const connectionString = process.env["COMMUNICATION_SERVICES_CONNECTION_STRING"];

// Instantiate the client
const client = MessageClient(connectionString);
```

<a name='azure-active-directory'></a>

#### [Microsoft Entra ID](#tab/aad)

You can also authenticate with Microsoft Entra ID using the [Azure Identity library](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity). 

The [`@azure/identity`](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity) package provides various credential types that your application can use to authenticate. You can choose from the various options to authenticate the identity client detailed at [Azure Identity - Credential providers](/javascript/api/overview/azure/identity-readme#credentials) and [Azure Identity - Authenticate the client](/javascript/api/overview/azure/identity-readme#authenticate-the-client). This option walks through one way of using the [`DefaultAzureCredential`](/javascript/api/overview/azure/identity-readme#defaultazurecredential). 

The `DefaultAzureCredential` attempts to authenticate via [`several mechanisms`](/javascript/api/overview/azure/identity-readme#defaultazurecredential) and it might be able to find its authentication credentials if you're signed into Visual Studio or Azure CLI. However, this option walks you through setting up with environment variables.    

To create a `DefaultAzureCredential` object:
1. To set up your service principle app, follow the instructions at [Creating a Microsoft Entra registered Application](../../../../identity/service-principal.md?pivots=platform-azcli#creating-a-microsoft-entra-registered-application).

1. Set the environment variables `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID` using the output of your app's creation.    
    Open a console window and enter the following commands:
    ```console
    setx AZURE_CLIENT_ID "<your app's appId>"
    setx AZURE_CLIENT_SECRET "<your app's password>"
    setx AZURE_TENANT_ID "<your app's tenant>"
    ```
    After you add the environment variables, you might need to restart any running programs that will need to read the environment variables, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

1. To use the [`DefaultAzureCredential`](/javascript/api/overview/azure/identity-readme#defaultazurecredential) provider, or other credential providers provided with the Azure SDK, install the `@azure/identity` package.
    ```bash
    npm install @azure/identity
    ```

1. To instantiate a `MessageClient`, add the following code to the `Main` method.
    ```javascript
    const DefaultAzureCredential = require("@azure/identity").DefaultAzureCredential;
    const MessageClient = require("@azure-rest/communication-messages").default;
    
    // Configure authentication
    const endpoint = "https://<resource name>.communication.azure.com";
    let credential = new DefaultAzureCredential();
    
    // Instantiate the client
    const client = MessageClient(endpoint, credential);
    ```

#### [AzureKeyCredential](#tab/azurekeycredential)

You can also authenticate with an AzureKeyCredential.

Get the endpoint and key from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Endpoint` and the `Key` field for the primary key.

:::image type="content" source="../../media/get-started/get-communication-resource-endpoint-and-key.png" lightbox="../../media/get-started/get-communication-resource-endpoint-and-key.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_KEY` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_KEY "<your key>"
```
After you add the environment variable, you might need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).

To instantiate a `MessageClient`, add the following code to the `Main` method:
```javascript
const AzureKeyCredential = require("@azure/core-auth").AzureKeyCredential;
const MessageClient = require("@azure-rest/communication-messages").default;

// Configure authentication
const endpoint = "https://<resource name>.communication.azure.com";
const credential = new AzureKeyCredential("<your key credential>");

// Instantiate the client
const client = MessageClient(endpoint, credential);
```

---

### Set channel registration ID  

The Channel Registration ID GUID was created during [channel registration](../../connect-whatsapp-business-account.md). You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../../media/get-started/get-messages-channel-id.png" lightbox="../../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

Assign it to a variable called channelRegistrationId.
```javascript
const channelRegistrationId = "<your channel registration id GUID>";
```

### Set recipient list

You need to supply a real phone number that has a WhatsApp account associated with it. This WhatsApp account receives the template, text, and media messages sent in this quickstart.
For this quickstart, this phone number may be your personal phone number.   

The recipient phone number can't be the business phone number (Sender ID) associated with the WhatsApp channel registration. The Sender ID appears as the sender of the text and media messages sent to the recipient.

The phone number should include the country code. For more information on phone number formatting, see WhatsApp documentation for [Phone Number Formats](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers#phone-number-formats).

> [!NOTE]
> Only one phone number is currently supported in the recipient list.

Create the recipient list like this:
```json
const recipientList = ["<to WhatsApp phone number>"];
```

Example:
```javascript
// Example only
const recipientList = ["+14255550199"];
```

### Start sending messages between a business and a WhatsApp user

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

Regardless of how the conversation was started, **a business can only send template messages until the user sends a message to the business.** Only after the user sends a message to the business, the business is allowed to send text or media messages to the user during the active conversation. Once the 24 hour conversation window expires, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations).

#### (Option 1) Initiate conversation from business - Send a template message
Initiate a conversation by sending a template message.

First, create a MessageTemplate using the values for a template. 
> [!NOTE]
> To check which templates you have available, see the instructions at [List templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md#list-templates).
> If you don't have a template to use, proceed to [Option 2](#option-2-initiate-conversation-from-user).

Here's MessageTemplate creation using a default template, `sample_template`.   
If `sample_template` isn't available to you, skip to [Option 2](#option-2-initiate-conversation-from-user). For advanced users, see the page [Templates](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md) to understand how to send a different template with Option 1.

Messages SDK allows Contoso to send templated WhatsApp messages to WhatsApp users. To send template messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Template details
    - Name like 'sample_template'
    - Language like 'en_us'
    - Parameters if any
    
```javascript
// Assemble the template content
const template = {
    name: "sample_template",
    language: "en_US"
};
```

For more examples of how to assemble your MessageTemplate and how to create your own template, refer to the following resource:
- [Send WhatsApp Template Messages](../../../../../concepts/advanced-messaging/whatsapp/template-messages.md) 
   
For further WhatsApp requirements on templates, refer to the WhatsApp Business Platform API references:
- [Create and Manage Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/)
- [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components)
- [Sending Template Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-message-templates)

```javascript
// Send template message
const templateMessageResult = await client.path("/messages/notifications:send").post({
    contentType: "application/json",
    body: {
        channelRegistrationId: channelRegistrationId,
        to: recipientList,
        kind: "template",
        template: template
    }
});

// Process result
if (templateMessageResult.status === "202") {
    templateMessageResult.body.receipts.forEach((receipt) => {
        console.log("Message sent to:"+receipt.to+" with message id:"+receipt.messageId);
    });
} else {
    throw new Error("Failed to send message");
}
```

Now, the user needs to respond to the template message. From the WhatsApp user account, reply to the template message received from the WhatsApp Business Account. The content of the message is irrelevant for this scenario.

> [!IMPORTANT]
> The recipient must respond to the template message to initiate the conversation before text or media message can be delivered to the recipient.

#### (Option 2) Initiate conversation from user

The other option to initiate a conversation between a WhatsApp Business Account and a WhatsApp user is to have the user initiate the conversation.
To do so, from your personal WhatsApp account, send a message to your business number (Sender ID).

:::image type="content" source="../../media/get-started/user-initiated-conversation.png" lightbox="../../media/get-started/user-initiated-conversation.png" alt-text="A WhatsApp conversation viewed on the web showing a user message sent to the WhatsApp Business Account number.":::

### Send a text message to a WhatsApp user

Messages SDK allows Contoso to send text WhatsApp messages, which initiated WhatsApp users initiated. To send text messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- Message body/text to be sent

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

In this example, we reply to the WhatsApp user with the text "Thanks for your feedback.\n From Notification Messaging SDK".

Assemble and send the media message:
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

### Send a media message to a WhatsApp user

Messages SDK allows Contoso to send Image WhatsApp messages to WhatsApp users. To send Image embedded messages below details are required:
- [WhatsApp Channel ID](#set-channel-registration-id)
- [Recipient Phone Number in E16 format](#set-recipient-list)
- MediaUri of the Image

> [!IMPORTANT]
> To send a text message to a WhatsApp user, the WhatsApp user must first send a message to the WhatsApp Business Account. For more information, see [Start sending messages between business and WhatsApp user](#start-sending-messages-between-a-business-and-a-whatsapp-user).

To send a media message, provide a URL to an image. As an example,
```javascript
const url = "https://aka.ms/acsicon1";
```

Assemble and send the media message:
```javascript
// Send media message
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

## Run the code

Use the node command to run the code you added to the send-messages.js file.

```console
node ./send-messages.js
```

## Full sample code

You can download the sample app from [GitHub](https://github.com/Azure/azure-sdk-for-js/tree/7efc61a0414c6f898409e355d0ba8d228882625f/sdk/communication/communication-messages-rest/samples-dev).

