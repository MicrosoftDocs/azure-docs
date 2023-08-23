---
title: include file
description: include file
services: azure-communication-services
author: bertong
manager: ankita

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/25/2022
ms.topic: include
ms.custom: include file
ms.author: bertong
---

Get started with Azure Communication Services by using the Communication Services JavaScript SMS SDK to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

> [!NOTE]
> Find the finalized code for this quickstart on [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-sms).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 are recommended).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS-enabled telephone number. [Get a phone number](../../telephony/get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run `node --version` to check that Node.js is installed.
- To view the phone numbers that are associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/) and locate your Communication Services resource. In the navigation pane on the left, select **Phone numbers**.

## Set up the application environment

To set up an environment for sending messages, take the steps in the following sections.

### Create a new Node.js application

1. Open your terminal or command window, and then run the following command to create a new directory for your app and navigate to it.

   ```console
   mkdir sms-quickstart && cd sms-quickstart
   ```

1. Run the following command to create a **package.json** file with default settings.

   ```console
   npm init -y
   ```

1. Use a text editor to create a file called **send-sms.js** in the project root directory.

In the following sections, you'll add all the source code for this quickstart to the **send-sms.js** file that you just created.

### Install the package

Use the `npm install` command to install the Azure Communication Services SMS SDK for JavaScript.

```console
npm install @azure/communication-sms --save
```

The `--save` option lists the library as a dependency in your **package.json** file.

## Object model

The following classes and interfaces handle some of the major features of the Azure Communication Services SMS SDK for Node.js.

| Name                                  | Description                                                  |
| ------------------------------------- | ------------------------------------------------------------ |
| SmsClient | This class is needed for all SMS functionality. You instantiate it with your subscription information, and use it to send SMS messages. |
| SmsSendRequest | This interface is the model for building the SMS request. You use it to configure the to and from phone numbers and the SMS content. |
| SmsSendOptions | This interface provides options for configuring delivery reporting. If `enableDeliveryReport` is set to `true`, an event is emitted when delivery is successful. |
| SmsSendResult               | This class contains the result from the SMS service.                                          |

## Authenticate the client

To authenticate a client, you import the **SmsClient** from the SDK and instantiate it with your connection string. You can retrieve the connection string for the resource from an environment variable. For instance, the code in this section retrieves the connection string from the `COMMUNICATION_SERVICES_CONNECTION_STRING` environment variable. Learn how to [manage your resource's connection string](../../create-communication-resource.md#store-your-connection-string).

To import the client and instantiate it:

1. Create a file named **send-sms.js**.

1. Add the following code to **send-sms.js**.

```javascript
const { SmsClient } = require('@azure/communication-sms');

// This code retrieves your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the SMS client.
const smsClient = new SmsClient(connectionString);
```

## Send a 1:N SMS message

To send an SMS message to a list of recipients, call the `send` function from the SmsClient with a list of recipient phone numbers. If you'd like to send a message to a single recipient, include only one number in the list. Add this code to the end of **send-sms.js**:

```javascript
async function main() {
  const sendResults = await smsClient.send({
    from: "<from-phone-number>",
    to: ["<to-phone-number-1>", "<to-phone-number-2>"],
    message: "Hello World 👋🏻 via SMS"
  });

  // Individual messages can encounter errors during sending.
  // Use the "successful" property to verify the status.
  for (const sendResult of sendResults) {
    if (sendResult.successful) {
      console.log("Success: ", sendResult);
    } else {
      console.error("Something went wrong when trying to send this message: ", sendResult);
    }
  }
}

main();
```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number that's associated with your Communication Services resource.
- Replace `<to-phone-number-1>` and `<to-phone-number-2>` with the phone numbers that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<from-phone-number>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.

## Send a 1:N SMS message with options

You can also provide an options object to specify whether the delivery report should be enabled and to set custom tags.

```javascript

async function main() {
  const sendResults = await smsClient.send({
    from: "<from-phone-number>",
    to: ["<to-phone-number-1>", "<to-phone-number-2>"],
    message: "Weekly Promotion!"
  }, {
    // Optional parameters
    enableDeliveryReport: true,
    tag: "marketing"
  });

  // Individual messages can encounter errors during sending.
  // Use the "successful" property to verify the status.
  for (const sendResult of sendResults) {
    if (sendResult.successful) {
      console.log("Success: ", sendResult);
    } else {
      console.error("Something went wrong when trying to send this message: ", sendResult);
    }
  }
}

main();
```

Make these replacements in the code:

- Replace `<from-phone-number>` with an SMS-enabled phone number that's associated with your Communication Services resource.
- Replace `<to-phone-number-1>` and `<to-phone-number-2>` with phone numbers that you'd like to send a message to.

> [!WARNING]
> Provide phone numbers in E.164 international standard format, for example, +14255550123. The value for `<from-phone-number>` can also be a short code, for example, 23456 or an alphanumeric sender ID, for example, CONTOSO.

The `enableDeliveryReport` parameter is an optional parameter that you can use to configure delivery reporting. This functionality is useful when you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure delivery reporting for your SMS messages.
The `tag` parameter is optional. You can use it to apply a tag to the delivery report.

## Run the code

Use the `node` command to run the code that you added to the **send-sms.js** file.

```console

node ./send-sms.js

```
