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
Azure Communication Services lets you easily send and receive SMS messages. In this quick start, learn how to use Communication Services to send SMS messages using the SDK in Javascript.

You can receive SMS messages and Delivery Reports by using ACS' EventGrid integration to subscribe to webhooks, and have ACS call your service when an SMS message is received. See the [EventGrid concept for more information.](../concepts/acs-event-grid.md)

## Prerequisites

This quick start also requires:
- **Deployed Azure Communication Service resource.** Check out the quick start for making an ACS resource in the Azure portal. [create an Azure Communication Resource](./create-a-communication-resource).
- **An ACS configured telephone number.** Sending SMS messages requires a telephone number, which ACS can help you obtain easily. Check out the quick start for telephone number management for more information. **NOTE:** For private preview, please contact Nikolay Muravlyannikov (nmurav@microsoft.com) or Phone@microsoft.com to aquire telephone numbers for your resource.
- **Download SMS SDK.** Download `CommunicationServices-SMS` Javascript SDK to send an SMS. **NOTE:** For private preview, sdk can be downloaded using npm by installing module @ic3/communicationservices-sms. 

## Obtain a connection string
Connection strings provide addressing and key information necessary for service clients to connect and authenticate to Azure Communication Services to drive activity. You can get connection strings from the Azure portal or programmatically with Azure Resource Management (ARM) APIs.

In the Azure Portal, use the `Keys` page in `Settings` to generate keys.

![Screenshot of Key page](../media/keys.png)

## Authenticate the SMS client and send a SMS message
Once the module has been installed, we are ready to implement a few lines of code to create an SMS client and send a message.

```javascript
var sms = require('@ic3/communicationservices-sms');

let connectionString = <ConnectionString>;
let smsClient = new sms.SmsClient(connectionString);

smsClient.send(
    "+15551111111", //To, phone number aquired by your account
    "+15552222222", //From
    "Hello World 👋🏻 via Sms", //Message
);

```

Step by step:
1. Include the necessary module that contains the Azure Communication Services SMS SDK.
2. Define the connection string based on the string you got from the step before.
2. Initialize the `SmsClient` using the connection string retrieved in the Azure Portal. It is important to protect connection strings, they should only be used by trusted services and devices.
3. Use the `SmsClient.Send()` API to send an SMS message using a number allocated to the Azure Communication Service resource, in this case `+15551111111`, to a destination phone number `+15552222222`. To programmatically list allocated phoned numbers and acquire new ones, check out the allocate phone number quick start.

## Send a SMS message and enable Delivery Reports

Lets modify above code to enable Delivery Report for the message sent.

### Prerequisites
-- Setup EventGrid subscription to receive Sms Delivery Report Event, `Microsoft.CommunicationServices.SMSDeliveryReport` **Refer:** [EventGrid concept for more information.](../concepts/acs-event-grid.md)

TODO No support on the SDK yet.
