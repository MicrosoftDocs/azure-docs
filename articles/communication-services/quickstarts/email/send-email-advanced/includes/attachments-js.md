---
title: include file
description: Attachments JS SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with attachments

We can add an attachment by defining an attachment object and adding it to our message. Read the attachment file and encode it using Base64.

```javascript
const filePath = "<path-to-your-file>";

const message = {
  sender: "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
  content: {
    subject: "Welcome to Azure Communication Service Email.",
    plainText: "<This email message is sent from Azure Communication Service Email using JavaScript SDK.>"
  },
  recipients: {
    to: [
      {
        address: "<emailalias@emaildomain.com>",
        displayName: "Customer Name",
      }
    ]
  },
  attachments: [
    {
      name: path.basename(filePath),
      contentType: "<mime-type-for-your-file>",
      contentInBase64: readFileSync(filePath, "base64"),
    }
  ]
};

const poller = await emailClient.beginSend(message);
const response = await poller.pollUntilDone();
```

### Allowed MIME types

For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email-advanced/send-email-attachments)
