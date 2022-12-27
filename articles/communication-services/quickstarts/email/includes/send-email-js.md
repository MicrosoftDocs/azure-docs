---
title: include file
description: Send email.js sdk include file
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: include
ms.service: azure-communication-services
ms.custom: private_preview, event-tier1-build-2022
---

Get started with Azure Communication Services by using the Communication Services JS Email client library to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions.
- An Azure Email Communication Services resource created and ready with a provisioned domain [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Communication Services resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-resource.md)

### Prerequisite check

- In a terminal or command window, run `node --version` to check that Node.js is installed.
- To view the domains verified with your Email Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Email Communication Services resource and open the **Provision domains** tab from the left navigation pane.

## Setting up

### Create a new Node.js Application
First, open your terminal or command window, create a new directory for your app, and navigate to it.

```console
mkdir email-quickstart && cd email-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

Use a text editor to create a file called **send-email.js** in the project root directory. Change the "main" property in **package.json** to "send-email.js". You'll add all the source code for this quickstart to this file in the following sections.

### Install the package
Use the `npm install` command to install the Azure Communication Services Email client library for JavaScript.

```console
npm install @azure/communication-email --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Email Client library for JavaScript.

| Name                | Description                                                                                                                                          |
| --------------------| -----------------------------------------------------------------------------------------------------------------------------------------------------|
| EmailAddress        | This interface contains an email address and an option for a display name.                                                                               |
| EmailAttachment     | This interface creates an email attachment by accepting a unique ID, email attachment type, and a string of content bytes.                               |
| EmailClient         | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages.                  |
| EmailClientOptions  | This interface can be added to the EmailClient instantiation to target a specific API version.                                                           |
| EmailContent        | This interface contains the subject, plaintext, and html of the email message. |
| EmailCustomHeader   | This interface allows for the addition of a name and value pair for a custom header.                                                                     |
| EmailMessage        | This interface combines the sender, content, and recipients. Custom headers, importance, attachments, and reply-to email addresses can optionally be added, as well. |
| EmailRecipients     | This interface holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients.                |
| SendStatusResult | This interface holds the messageId and status of the email message delivery.

## Authenticate the client

Import the **EmailClient** from the client library and instantiate it with your connection string.

The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING` using the dotenv package. Use the `npm install` command to install the dotenv package. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

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
```
## Send an email message

To send an Email message, you need to
- Construct the email content and body using EmailContent 
- Add Recipients 
- Construct your email message with your Sender information you get your MailFrom address from your verified domain.
- Include your Email Content and Recipients and include attachments if any 
- Calling the send method:

Replace with your domain details and modify the content, recipient details as required

```javascript

async function main() {
  try {
    var client = new EmailClient(connectionString);
    //send mail
    const emailMessage = {
      sender: "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
      content: {
        subject: "Welcome to Azure Communication Service Email.",
        plainText: "<This email message is sent from Azure Communication Service Email using JS SDK.>"
      },
      recipients: {
        to: [
          {
            email: "<emailalias@emaildomain.com>",
          },
        ],
      },
    };
    var response = await client.send(emailMessage);
  } catch (e) {
    console.log(e);
  }
}
main();
```
## Getting MessageId to track email delivery

To track the status of email delivery, you need to get the MessageId back from response and track the status. If there's no MessageId, retry the request.

```javascript
  const messageId = response.messageId;
  if (messageId === null) {
    console.log("Message Id not found.");
    return;
  }
   
```
## Getting status on email delivery
To get the delivery status of email call GetMessageStatus API with MessageId
```javascript
  // check mail status, wait for 5 seconds, check for 60 seconds.
  let counter = 0;
  const statusInterval = setInterval(async function () {
    counter++;
    try {
      const response = await client.getSendStatus(messageId);
      if (response) {
        console.log(`Email status for ${messageId}: ${response.status}`);
        if (response.status.toLowerCase() !== "queued" || counter > 12) {
          clearInterval(statusInterval);
        }
      }
    } catch (e) {
        console.log(e);
    }
  }, 5000);

```

[!INCLUDE [Email Message Status](./email-message-status.md)]

## Run the code

use the node command to run the code you added to the send-email.js file.

```console
node ./send-email.js
```
## Sample code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email)

## Advanced

### Send an email message to multiple recipients

We can define multiple recipients by adding additional EmailAddresses to the EmailRecipients object. These addresses can be added as `To`, `CC`, or `BCC` recipients.

```javascript
const emailMessage = {
  sender: "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
  content: {
    subject: "Welcome to Azure Communication Service Email.",
    plainText: "<This email message is sent from Azure Communication Service Email using JS SDK.>"
  },
  recipients: {
    to: [
      { email: "<emailalias@emaildomain.com>" },
      { email: "<emailalias2@emaildomain.com>" }
    ],
    cc: [
      { 
        email: "<ccemailalias@emaildomain.com>" 
      }
    ],
    bcc: [
      { 
        email: "<bccemailalias@emaildomain.com>" }
      }
    ],
  },
};
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email-advanced/send-email-multiple-recipients)


### Send an email message with attachments

We can add an attachment by defining an EmailAttachment object and adding it to our EmailMessage object. Read the attachment file and encode it using Base64.

```javascript
const fs = require("fs");

const attachmentContent = fs.readFileSync(<your-attachment-path>).toString("base64");

const attachment = {
  name: "<your-attachment-name>",
  attachmentType: "<your-attachment-type>",
  contentBytesBase64: attachmentContent,
}

const emailMessage = {
  sender: "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
  content: {
    subject: "Welcome to Azure Communication Service Email.",
    plainText: "<This email message is sent from Azure Communication Service Email using JS SDK.>"
  },
  recipients: {
    to: [
      {
        email: "<emailalias@emaildomain.com>",
      },
    ],
  },
  attachments: [attachment]
};
```

You can download the sample app demonstrating this from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email-advanced/send-email-attachments)
