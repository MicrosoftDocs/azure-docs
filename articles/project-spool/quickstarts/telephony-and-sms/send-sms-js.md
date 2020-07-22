---
title: Get Started With SMS (JS)
description: Setting up the SMS SDK for ACS in Javascript
author: dademath    
manager: nimag
services: azure-project-spool

ms.author: dademath
ms.date: 07/09/2020
ms.topic: quickstart
ms.service: azure-project-spool

---
# Quickstart: Send an SMS message with Javascript
Azure Communication Services lets you easily send and receive SMS messages. In this quickstart, learn how to use Communication Services to send SMS messages using the SDK in Javascript.

You can receive SMS messages and Delivery Reports by using ACS' EventGrid integration to subscribe to webhooks, and have ACS call your service when an SMS message is received. See the [EventGrid concept for more information.](../concepts/acs-event-grid.md)

## Prerequisites

This quickstart also requires:
- **Deployed Azure Communication Service resource.** Check out the quick start for making an ACS resource in the Azure portal. [create an Azure Communication Resource](./create-a-communication-resource).
- **An ACS configured telephone number.** Sending SMS messages requires a telephone number, which ACS can help you obtain easily. Check out the quick start for telephone number management for more information. **NOTE:** For private preview, please contact Nikolay Muravlyannikov (nmurav@microsoft.com) or Phone@microsoft.com to aquire telephone numbers for your resource.
- **Download SMS SDK.** Download `Communication-SMS` Javascript SDK to send an SMS from Communication-Preview [Releases](https://github.com/Azure/communication-preview/releases).

## Installing local npm tarballs
For this quickstart you will need the tarballs for packages: sms, common and configuration.

After you've downloaded and unzipped a Release from the communication-preview repo ([here](https://github.com/Azure/communication-preview/releases)) you need to install the contained packages. Run `npm install <package>.tgz` to install a package.

Install `@azure/communication-common ` first because packages need to be installed in dependency order in order to succeed.

Navigate to the installed package in your `node_modules` folder to find a **README.md** for each package that explains usage with examples.

## Obtain a connection string
Connection strings provide addressing and key information necessary for service clients to connect and authenticate to Azure Communication Services to drive activity. You can get connection strings from the Azure portal or programmatically with Azure Resource Management (ARM) APIs.

In the Azure Portal, use the `Keys` page in `Settings` to generate keys.

![Screenshot of Key page](../media/keys.png)

## Authenticate the SMS client and send a SMS message
Once the module has been installed, we are ready to implement a few lines of code to create an SMS client and send a message.

```javascript
var sms = require('@azure/communication-sms');

let connectionString = <ConnectionString>;
let smsClient = new sms.SmsClient(connectionString);

smsClient.send(
    from: "+15551111111", //From, phone number aquired by your account
    to: ["+15552222222"], //To, user's phone number. This is passed as an array of numbers, so multiple recipients can be added
    message: "Hello World 👋🏻 via Sms", //Message
);

```

Step by step:
1. Include the necessary module that contains the Azure Communication Services SMS SDK.
2. Define the connection string based on the string you got from the step before.
2. Initialize the `SmsClient` using the connection string retrieved in the Azure Portal. It is important to protect connection strings, they should only be used by trusted services and devices.
3. Use the `SmsClient.Send()` API to send an SMS message using a number allocated to the Azure Communication Service resource, in this case `+15551111111`, to a destination phone number `+15552222222`. To programmatically list allocated phoned numbers and acquire new ones, check out the allocate phone number quick start.

## Send a SMS message and enable Delivery Reports

Lets modify above code to enable Delivery Report for the message sent.

```javascript
smsClient.send(
    //Send Request
    {
    to: ["+18143216323"], //To, phone number aquired by your account
    from: "+18444020839", //From
    message: "Hello World 👋🏻 via Sms"
    },
    //Send Options
    {
        enableDeliveryReport: true
    }
);
```

### Prerequisites
-- Setup EventGrid subscription to receive Sms Delivery Report Event, `Microsoft.CommunicationServices.SMSDeliveryReport` **Refer:** [EventGrid concept for more information.](../concepts/acs-event-grid.md)

TODO No support on the SDK yet.
