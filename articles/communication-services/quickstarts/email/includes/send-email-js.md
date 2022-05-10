---
title: include file
description: Send email.js sdk include file
services: azure-communication-services
author: bashan-git
manager: sphenry
services: azure-communication-services
ms.author: bashan
ms.date: 04/15/2022
ms.topic: include
ms.service: azure-communication-services
ms.custom: private_preview
---
> [!IMPORTANT]
> Functionality described on this document is currently in private preview. Private preview includes access to SDKs and documentation for testing purposes that are not yet available publicly.
> Apply to become an early adopter by filling out the form for [preview access to Azure Communication Services](https://aka.ms/ACS-EarlyAdopter).

Get started with Azure Communication Services by using the Communication Services C# Email client library to send Email messages.

Completing this quick start incurs a small cost of a few USD cents or less in your Azure account.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An Azure Email Communication Services Resource created and ready with a provisioned domains [Get started with Creating Email Communication Resource](../create-email-communication-resource.md)
- An active Communication Services resource connected with Email Domain and a Connection String. [Get started by Connecting Email Resource with a Communication Resource](../connect-email-communication-acs-resource.md)

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
Use the `npm install` command to install the Azure Communication Services SMS client library for JavaScript.

```console
npm install @azure/communication-sms --save
```

The `--save` option lists the library as a dependency in your **package.json** file.



## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services Email Client library for C#.

| Name                | Description                                                                                                                                          |
| --------------------| -----------------------------------------------------------------------------------------------------------------------------------------------------|
| EmailAddress        | This class contains an email address and an option for a display name.                                                                               |
| EmailAttachment     | This class creates an email attachment by accepting a unique ID, email attachment type, and a string of content bytes.                               |
| EmailBody           | This class contains the plain text and/or HTML content of the email body.                                                                            |
| EmailClient         | This class is needed for all email functionality. You instantiate it with your connection string and use it to send email messages.                  |
| EmailClientOptions  | This class can be added to the EmailClient instantiation to target a specific API version.                                                           |
| EmailContent        | This class contains the subject and the body of the email message. The importance can also be set within the EmailContent class.                     |
| EmailCustomHeader   | This class allows for the addition of a name and value pair for a custom header.                                                                     |
| EmailMessage        | This class combines the sender, content, and recipients. Custom headers, attachments, and reply-to email addresses can optionally be added, as well. |
| EmailRecipients     | This class holds lists of EmailAddress objects for recipients of the email message, including optional lists for CC & BCC recipients.                |
| StatusFoundResponse | This class holds lists of email addresses for recipients of the email message, including optional CC & .                                             |

## Authenticate the client

 Import the **EmailClient** from the client library and instantiate it with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to **send-email.js**:

```javascript
const { EmailClient } = require('@azure/communication-email');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];
```
## Send an Email message

To send an Email message, you need to
- Construct the email content and body using EmailContent 
- Add Recipients 
- Construct your email message with your Sender information you get your MailFrom address from your verified domain.
- Include your Email Content and Recipients and include attachments if any 
- Calling the SendEmail method:

Please replace with your domain details and modify the content, recipient details as required

```javascript

// Instantiate the Email client
  const emailClient = new EmailClient(connectionString);

//Replace with your domain and modify the content, recipient details as required

  const repeatabilityRequestId = uuidv4();
  const repeatabilityFirstSent = new Date().toUTCString();

  const emailMessage: EmailMessage = {
            sender: 'emailalias@emaildomain.com',
            content: {
                subject: 'Your Email Subject Goes Here',
                body: {
                    plainText: 'Your Email body Goes Here',
                    html: 'html content'
                }
            },
            recipients: {
                toRecipients: [
                    {
                        email: 'emailalias@emaildomain.com'
                    }
                ]
            }

  emailClient.sendEmail(repeatabilityRequestId, repeatabilityFirstSent, emailMessage);
```
## Getting MessageId to track Email Delivery

To track the status of email delivery you need to get the MessageId back from response and track the status. if there is no MessageId retry the request.

```javascript

```
## Getting Status on Email Delivery
To get the delivery status of email call GetMessageStatus API with MessageId
```javascript

```

| Status Name         | Description                                                                                                                                          |
| --------------------| -----------------------------------------------------------------------------------------------------------------------------------------------------|
| None                | An email with this messageId could not be found.                                                                                                     |
| Queued              | The email has been placed in the queue for delivery.                                                                                                 |
| OutForDelivery      | The email is currently en route to its recipient(s).                                                                                                 |
| InternalError       | An error occurred internally during the delivery of this message. Please try again.                                                                  |
| Dropped             | The email message was dropped before the delivery could be successfully completed.                                                                   |
| InvalidEmailAddress | The sender and/or recipient email address(es) is/are not valid.                                                                                      |
| InvalidAttachments  | The content bytes string for the attachment is not valid.                                                                                            |
| InvalidSenderDomain | The sender's email address domain is not valid.                                                                                                      |

## Run the code

use the node command to run the code you added to the send-email.js file.

```console
node ./send-email.js
```
## Sample Code

You can download the sample app from [GitHub](https://github.com/Azure-Samples/communication-services-dotnet-quickstarts/tree/main/SendEmail)
