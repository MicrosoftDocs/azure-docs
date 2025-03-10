---
title: Include file
description: Include file
services: azure-communication-services
author: shamkh
ms.service: azure-communication-services
ms.subservice: advanced-messaging
ms.date: 07/15/2024
ms.topic: include
ms.custom: include file
ms.author: shamkh
ms.custom: devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---  

### Start sending messages between a business and a WhatsApp user

Conversations between a WhatsApp Business Account and a WhatsApp user can be initiated in one of two ways:
- The business sends a template message to the WhatsApp user.
- The WhatsApp user sends any message to the business number.

Regardless of how the conversation was started, **a business can only send template messages until the user sends a message to the business.** Only after the user sends a message to the business, the business is allowed to send text or media messages to the user during the active conversation. Once the 24 hour conversation window expires, the conversation must be reinitiated. To learn more about conversations, see the definition at [WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing#conversations).

### Authenticate the client

#### [Connection String](#tab/connection-string)

The following code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING` using the dotenv package. 

For simplicity, this quickstart uses a connection string to authenticate. In production environments, we recommend using [service principals](../../../identity/service-principal.md).

Get the connection string from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Connection string` field for the `Primary key`. The connection string is in the format `endpoint=https://{your Azure Communication Services resource name}.communication.azure.com/;accesskey={secret key}`.

:::image type="content" source="../media/get-started/get-communication-resource-connection-string.png" lightbox="../media/get-started/get-communication-resource-connection-string.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_CONNECTION_STRING` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_CONNECTION_STRING "<your connection string>"
```

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).


To instantiate a NotificationClient, add the following code to the `Main` method:
```javascript
const NotificationClient = require("@azure-rest/communication-messages").default;

// Set Connection string
const connectionString = process.env["COMMUNICATION_SERVICES_CONNECTION_STRING"];

// Instantiate the client
const client = NotificationClient(connectionString);
```

<a name='azure-active-directory'></a>

#### [Microsoft Entra ID](#tab/aad)

You can also authenticate with Microsoft Entra ID using the [Azure Identity library](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity). 

The [`@azure/identity`](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity) package provides various credential types that your application can use to authenticate. You can choose from the various options to authenticate the identity client detailed at [Azure Identity - Credential providers](/javascript/api/overview/azure/identity-readme#credentials) and [Azure Identity - Authenticate the client](/javascript/api/overview/azure/identity-readme#authenticate-the-client). This option walks through one way of using the [`DefaultAzureCredential`](/javascript/api/overview/azure/identity-readme#defaultazurecredential). 

The `DefaultAzureCredential` attempts to authenticate via [`several mechanisms`](/javascript/api/overview/azure/identity-readme#defaultazurecredential) and it might be able to find its authentication credentials if you're signed into Visual Studio or Azure CLI. However, this option walks you through setting up with environment variables.    

To create a `DefaultAzureCredential` object:
1. To set up your service principle app, follow the instructions at [Creating a Microsoft Entra registered Application](../../../identity/service-principal.md?pivots=platform-azcli#creating-a-microsoft-entra-registered-application).

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

1. To instantiate a `NotificationClient`, add the following code to the `Main` method.
    ```javascript
    const DefaultAzureCredential = require("@azure/identity").DefaultAzureCredential;
    const NotificationClient = require("@azure-rest/communication-messages").default;
    
    // Configure authentication
    const endpoint = "https://<resource name>.communication.azure.com";
    let credential = new DefaultAzureCredential();
    
    // Instantiate the client
    const client = NotificationClient(endpoint, credential);
    ```

#### [AzureKeyCredential](#tab/azurekeycredential)

You can also authenticate with an AzureKeyCredential.

Get the endpoint and key from your Azure Communication Services resource in the Azure portal. On the left, navigate to the `Keys` tab. Copy the `Endpoint` and the `Key` field for the primary key.

:::image type="content" source="../media/get-started/get-communication-resource-endpoint-and-key.png" lightbox="../media/get-started/get-communication-resource-endpoint-and-key.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Connection string' field in the 'Primary key' section.":::

Set the environment variable `COMMUNICATION_SERVICES_KEY` to the value of your connection string.   
Open a console window and enter the following command:
```console
setx COMMUNICATION_SERVICES_KEY "<your key>"
```
After you add the environment variable, you might need to restart any running programs that will need to read the environment variable, including the console window. For example, if you're using Visual Studio as your editor, restart Visual Studio before running the example.

For more information on how to set an environment variable for your system, follow the steps at [Store your connection string in an environment variable](../../../create-communication-resource.md#store-your-connection-string-in-an-environment-variable).

To instantiate a `NotificationClient`, add the following code to the `Main` method:
```javascript
const AzureKeyCredential = require("@azure/core-auth").AzureKeyCredential;
const NotificationClient = require("@azure-rest/communication-messages").default;

// Configure authentication
const endpoint = "https://<resource name>.communication.azure.com";
const credential = new AzureKeyCredential("<your key credential>");

// Instantiate the client
const client = NotificationClient(endpoint, credential);
```

---

### Set channel registration ID  

The Channel Registration ID GUID was created during [channel registration](../connect-whatsapp-business-account.md). You can look it up in the portal on the Channels tab of your Azure Communication Services resource.

:::image type="content" source="../media/get-started/get-messages-channel-id.png" lightbox="../media/get-started/get-messages-channel-id.png" alt-text="Screenshot that shows an Azure Communication Services resource in the Azure portal, viewing the 'Channels' tab. Attention is placed on the copy action of the 'Channel ID' field.":::

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