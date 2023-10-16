---
title: include file
description: Multiple recipients JS SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message to multiple recipients

To send an email message to multiple recipients, add an object for each recipient type and an object for each recipient. These addresses can be added as `To`, `CC`, or `BCC` recipients. Optionally, add an email address to the `replyTo` property if you want to receive any replies.

```javascript
const message = {
  senderAddress: "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
  content: {
    subject: "Welcome to Azure Communication Service Email.",
    plainText: "<This email message is sent from Azure Communication Service Email using JS SDK.>"
  },
  recipients: {
    to: [
      {
        address: "customer1@domain.com",
        displayName: "Customer Name 1",
      },
      {
        address: "customer2@domain.com",
        displayName: "Customer Name 2",
      }
    ],
    cc: [
      {
        address: "ccCustomer1@domain.com",
        displayName: " CC Customer 1",
      },
      {
        address: "ccCustomer2@domain.com",
        displayName: "CC Customer 2",
      }
    ],
    bcc: [
      {
        address: "bccCustomer1@domain.com",
        displayName: " BCC Customer 1",
      },
      {
        address: "bccCustomer2@domain.com",
        displayName: "BCC Customer 2",
      }
    ]
  },
  replyTo: [
    {
      address: "replyToCustomer1@domain.com",
      displayName: "ReplyTo Customer 1",
    }
  ]
};

const poller = await emailClient.beginSend(message);
const response = await poller.pollUntilDone();

```

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email-advanced/send-email-multiple-recipients)
