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

Get started with Azure Communication Services by using the Communication Services C# Email client library to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
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

Use a text editor to create a file called **send-email.js** in the project root directory. You'll add all the source code for this quickstart to this file in the following sections.

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
| EmailAddress        | This class contains an email address and an option for a display name.                                                                               |
| EmailAttachment     | This class creates an email attachment by accepting a unique ID, email attachment type, and a string of content bytes.                               |
| EmailClient         | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages.                  |
| EmailClientOptions  | This class can be added to the EmailClient instantiation to target a specific API version.                                                           |
| EmailContent        | This class contains the subject and the body of the email message. The importance can also be set within the EmailContent class.                     |
| EmailCustomHeader   | This class allows for the addition of a name and value pair for a custom header.                                                                     |
| EmailMessage        | This class combines the sender, content, and recipients. Custom headers, attachments, and reply-to email addresses can optionally be added, as well. |
| EmailRecipients     | This class holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients.                |
| SendStatusResult | This class holds lists of status of the email message delivery.  

## Authenticate the client

 Import the **EmailClient** from the client library and instantiate it with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to **send-email.js**:

```javascript
const { EmailRestApiClient } = require("@azure/communication-email");
const communication_common = require("@azure/communication-common");
const core_http = require("@azure/core-http");
const uuid = require("uuid");
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
- Calling the SendEmail method:

Replace with your domain details and modify the content, recipient details as required

```javascript

async function main() {
  try {
    const { url, credential } = communication_common.parseClientArguments(connectionString);
    const options = {};
    options.userAgentOptions = {};
    options.userAgentOptions.userAgentPrefix = `azsdk-js-communication-email/1.0.0`;
    const authPolicy = communication_common.createCommunicationAuthPolicy(credential);
    const pipeline = core_http.createPipelineFromOptions(options, authPolicy);
    this.api = new EmailRestApiClient(url, pipeline);
    //send mail
    const unique_id = uuid.v4();
    const repeatabilityFirstSent = new Date().toUTCString();
    const emailMessage = {
      sender: "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
      content: {
        subject: "Welcome to Azure Communication Service Email.",
        body: {
          plainText: "<This email meessage is sent from Azure Communication Service Email using JS SDK.>"
        },
      },
      recipients: {
        toRecipients: [
          {
            email: "emailalias@emaildomain.com>",
          },
        ],
      },
    };
    var response = await this.api.email.sendEmail(
      unique_id,
      repeatabilityFirstSent,
      emailMessage
    );
  } catch (e) {
    console.log(e);
  }
}
main();
```
## Getting MessageId to track email delivery

To track the status of email delivery, you need to get the MessageId back from response and track the status. If there's no MessageId retry the request.

```javascript
 // check mail status, wait for 5 seconds, check for 60 seconds.
  const messageId = response._response.parsedHeaders.xMsRequestId;
  if (messageId === null) {
    console.log("Message Id not found.");
    return;
  }
   
```
## Getting status on email delivery
To get the delivery status of email call GetMessageStatus API with MessageId
```javascript
   
  const context = this;
  let counter = 0;
  const statusInterval = setInterval(async function () {
    counter++;
    try {
      const response = await context.api.email.getSendStatus(messageId);
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

| Status Name         | Description                                                                                                                                          |
| --------------------| -----------------------------------------------------------------------------------------------------------------------------------------------------|
| None                | An email with this messageId couldn't be found.                                                                                                     |
| Queued              | The email has been placed in the queue for delivery.                                                                                                 |
| OutForDelivery      | The email is currently en route to its recipient(s).                                                                                                 |
| InternalError       | An error occurred internally during the delivery of this message. Try again.                                                                  |
| Dropped             | The email message was dropped before the delivery could be successfully completed.                                                                   |
| InvalidEmailAddress | The sender and/or recipient email address(es) is/are not valid.                                                                                      |
| InvalidAttachments  | The content bytes string for the attachment isn't valid.                                                                                            |
| InvalidSenderDomain | The sender's email address domain isn't valid.                                                                                                      |

## Run the code

use the node command to run the code you added to the send-email.js file.

```console
node ./send-email.js
```
## Sample code

You can download the sample app from [GitHub](https://github.com/moirf/communication-services-javascript-quickstarts/tree/main/send-email)
