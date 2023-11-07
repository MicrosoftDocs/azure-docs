---
title: include file
description: Advanced send email JavaScript SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

Get started with Azure Communication Services by using the Communication Services JS Email client library to send Email messages.

> [!TIP]
> Jump-start your email sending experience with Azure Communication Services by skipping straight to the [Basic Email Sending](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email) and [Advanced Email Sending](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email-advanced) sample code on GitHub.

## Understanding the email object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Email Client library for JavaScript.

| Name | Description |
| ---- |-------------|
| EmailAddress | This class contains an email address and an option for a display name. |
| EmailAttachment | This class creates an email attachment by accepting a unique ID, email attachment [MIME type](../../../../concepts/email/email-attachment-allowed-mime-types.md) string, and binary data for content. |
| EmailClient | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages. |
| EmailClientOptions | This class can be added to the EmailClient instantiation to target a specific API version. |
| EmailContent | This class contains the subject and the body of the email message. You have to specify at least one of PlainText or Html content. |
| EmailCustomHeader | This class allows for the addition of a name and value pair for a custom header. Email importance can also be specified through these headers using the header name 'x-priority' or 'x-msmail-priority'. |
| EmailMessage | This class combines the sender, content, and recipients. Custom headers, attachments, and reply-to email addresses can optionally be added, as well. |
| EmailRecipients | This class holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients. |
| EmailSendResult | This class holds the results of the email send operation. It has an operation ID, operation status and error object (when applicable). |
| EmailSendStatus | This class represents the set of statuses of an email send operation. |

EmailSendResult returns the following status on the email operation performed.

| Status Name | Description |
| ----------- | ------------|
| isStarted | Returns true if the email send operation is currently in progress and being processed. |
| isCompleted | Returns true if the email send operation has completed without error and the email is out for delivery. Any detailed status about the email delivery beyond this stage can be obtained either through Azure Monitor or through Azure Event Grid. [Learn how to subscribe to email events](../../handle-email-events.md) |
| result | Property that exists if the email send operation has concluded. |
| error | Property that exists if the email send operation wasn't successful and encountered an error. The email wasn't sent. The result contains an error object with more details on the reason for failure. |

## Prerequisites

- [Node.js (~14)](https://nodejs.org/download/release/v14.19.1/).
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An Azure Email Communication Services resource created and ready with a provisioned domain. [Get started with creating an Email Communication Resource](../../create-email-communication-resource.md).
- An active Azure Communication Services resource connected to an Email Domain and its connection string. [Get started by connecting an Email Communication Resource with a Azure Communication Resource](../../../create-communication-resource.md).

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> We can also send an email from our own verified domain. [Add custom verified domains to Email Communication Service](../../add-azure-managed-domains.md).

### Prerequisite check

- In a terminal or command window, run `node --version` to check that Node.js is installed.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Set up the application environment

### Create a new Node.js Application
First, open your terminal or command window, create a new directory for your app, and navigate to it.

```console
mkdir email-quickstart && cd email-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

Use a text editor to create a file called **send-email.js** in the project root directory. Change the "main" property in **package.json** to "send-email.js". The following section demonstrates how to add the source code for this quickstart to the newly created file.

### Install the package
Use the `npm install` command to install the Azure Communication Services Email client library for JavaScript.

```console
npm install @azure/communication-email --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

## Creating the email client with authentication

There are a few different options available for authenticating an email client:

#### [Connection String](#tab/connection-string)

Import the **EmailClient** from the client library and instantiate it with your connection string.

The following code retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING` using the dotenv package. Use the `npm install` command to install the dotenv package. Learn how to [manage your resource's connection string](../../../create-communication-resource.md#store-your-connection-string).

```console
npm install dotenv
```

Add the following code to **send-email.js**:

```javascript
const { EmailClient } = require("@azure/communication-email");
require("dotenv").config();

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
const emailClient = new EmailClient(connectionString);
```

<a name='azure-active-directory'></a>

#### [Microsoft Entra ID](#tab/aad)

You can also authenticate with Microsoft Entra ID using the [Azure Identity library](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity). To use the [DefaultAzureCredential](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity#defaultazurecredential) provider in the following snippet, or other credential providers provided with the Azure SDK, install the [`@azure/identity`](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity) package:

```bash
npm install @azure/identity
```

The [`@azure/identity`](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/identity/identity) package provides various credential types that your application can use to authenticate. The README for `@azure/identity` provides more details and samples to get you started.
`AZURE_CLIENT_SECRET`, `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` environment variables are needed to create a `DefaultAzureCredential` object.

```typescript
import { DefaultAzureCredential } from "@azure/identity";
import { EmailClient } from "@azure/communication-email";

const endpoint = "https://<resource-name>.communication.azure.com";
let credential = new DefaultAzureCredential();

const emailClient = new EmailClient(endpoint, credential);
```

#### [AzureKeyCredential](#tab/azurekeycredential)

Email clients can also be authenticated using an [AzureKeyCredential](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-core/latest/azure.core.html#azure.core.credentials.AzureKeyCredential). Both the `key` and the `endpoint` can be founded on the "Keys" pane under "Settings" in your Communication Services Resource.

```javascript
const { EmailClient, KnownEmailSendStatus } = require("@azure/communication-email");
const { AzureKeyCredential } = require("@azure/core-auth");
require("dotenv").config();

var key = new AzureKeyCredential("<your-key-credential>");
var endpoint = "<your-endpoint-uri>";

const emailClient = new EmailClient(endpoint, key);
```

---

For simplicity, this quickstart uses connection strings, but in production environments, we recommend using [service principals](../../../../quickstarts/identity/service-principal.md).
