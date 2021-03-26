---
title: include file
description: include file
services: azure-communication-services
author: bertong
manager: ankita

ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 03/11/2021
ms.topic: include
ms.custom: include file
ms.author: bertong
---

Get started with Azure Communication Services by using the Communication Services JavaScript SMS SDK to send SMS messages.

Completing this quickstart incurs a small cost of a few USD cents or less in your Azure account.

<!--**TODO: update all these reference links as the resources go live**

[API reference documentation](../../../references/overview.md) | [Library source code](https://github.com/Azure/azure-sdk-for-js-pr/tree/feature/communication/sdk/communication/communication-sms) | [Package (NPM)](https://www.npmjs.com/package/@azure/communication-sms) | [Samples](#todo-samples)-->

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/) Active LTS and Maintenance LTS versions (8.11.1 and 10.14.1 recommended).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../create-communication-resource.md).
- An SMS enabled telephone number. [Get a phone number](../get-phone-number.md).

### Prerequisite check

- In a terminal or command window, run `node --version` to check that Node.js is installed.
- To view the phone numbers associated with your Communication Services resource, sign in to the [Azure portal](https://portal.azure.com/), locate your Communication Services resource and open the **phone numbers** tab from the left navigation pane.

## Setting up

### Create a new Node.js Application

First, open your terminal or command window, create a new directory for your app, and navigate to it.

```console
mkdir sms-quickstart && cd sms-quickstart
```

Run `npm init -y` to create a **package.json** file with default settings.

```console
npm init -y
```

Use a text editor to create a file called **send-sms.js** in the project root directory. You'll add all the source code for this quickstart to this file in the following sections.

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
| SmsSendResult               | This class contains the result from the SMS service.                                          |
| SmsSendOptions | This interface provides options to configure delivery reporting. If `enableDeliveryReport` is set to `true`, then an event will be emitted when delivery is successful. |
| SmsSendRequest | This interface is the model for building the sms request (eg. configure the to and from phone numbers and the sms content). |

## Authenticate the client

Import the **SmsClient** from the SDK and instantiate it with your connection string. The code below retrieves the connection string for the resource from an environment variable named `COMMUNICATION_SERVICES_CONNECTION_STRING`. Learn how to [manage you resource's connection string](../../create-communication-resource.md#store-your-connection-string).

Add the following code to **send-sms.js**:

```javascript
const { SmsClient } = require('@azure/communication-sms');

// This code demonstrates how to fetch your connection string
// from an environment variable.
const connectionString = process.env['COMMUNICATION_SERVICES_CONNECTION_STRING'];

// Instantiate the SMS client
const smsClient = new SmsClient(connectionString);
```

## Send a 1:N SMS message

To send an SMS message to a list of recipients, call the `send` function from the SmsClient with a list of recipients phone numbers (if you wish to send a message to a single recipient, only include one number in the list). Add this code to the end of the **send-sms.js**:

```javascript
async function main() {
  const sendResults = await smsClient.send({
    from: "<from-phone-number>",
    to: ["<to-phone-number-1>", "<to-phone-number-2>"],
    message: "Hello World 👋🏻 via SMS"
  });

  // individual messages can encounter errors during sending
  // use the "successful" property to verify
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
You should replace `<from-phone-number>` with an SMS-enabled phone number associated with your Communication Services resource and `<to-phone-number>` with the phone number you wish to send a message to.

## Send a 1:N SMS message with options

You may also pass in an options object to specify whether the delivery report should be enabled and to set custom tags.

```javascript

async function main() {
  await smsClient.send({
    from: "<from-phone-number>",
    to: ["<to-phone-number-1>", "<to-phone-number-2>"],
    message: "Weekly Promotion!"
  }, {
    //Optional parameter
    enableDeliveryReport: true,
    tag: "marketing"
  });

  // individual messages can encounter errors during sending
  // use the "successful" property to verify
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

The `enableDeliveryReport` parameter is an optional parameter that you can use to configure Delivery Reporting. This is useful for scenarios where you want to emit events when SMS messages are delivered. See the [Handle SMS Events](../handle-sms-events.md) quickstart to configure Delivery Reporting for your SMS messages.
`tag` is an optional parameter that you can use to apply a tag to the Delivery Report.

## Run the code

Use the `node` command to run the code you added to the **send-sms.js** file.

```console

node ./send-sms.js

```
