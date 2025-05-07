---
title: include file
description: Inline Attachments JavaScript SDK
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with inline attachments

We can add an inline attachment by defining one or more attachment objects. Make sure to include a unique `contentId` for each, and add them to our message. Read the attachment file and encode it using Base64.

```javascript
const jpgFilePath = "./inline-attachment.jpg";
const pngFilePath = "./inline-attachment.png";

const inlineAttachments = [
    {
        name: path.basename(jpgFilePath),
        contentId: "my-inline-attachment-1"
        contentType: "image/jpeg",
        contentInBase64: readFileSync(jpgFilePath, "base64"),
    },
    {
        name: path.basename(pngFilePath),
        contentId: "my-inline-attachment-2"
        contentType: "image/png",
        contentInBase64: readFileSync(pngFilePath, "base64"),
    }
];
```

Within the HTML body of the message, embed an image by referencing its `contentId` within the source of an `<img>` tag.

```javascript
const message = {
  sender: "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
  content: {
    subject: "Welcome to Azure Communication Services Email",
    plainText: "This email message is sent from Azure Communication Services Email using the JavaScript SDK.",
    html: "<html><h1>HTML body inline images:</h1><img src=\"cid:my-inline-attachment-1\" /><img src=\"cid:my-inline-attachment-2\" /></html>"
  },
  recipients: {
    to: [
      {
        address: "<emailalias@contoso.com>",
        displayName: "Customer Name",
      }
    ]
  },
  attachments: inlineAttachments
};

const poller = await emailClient.beginSend(message);
const response = await poller.pollUntilDone();
```

> [!NOTE]
> You can combine regular attachments with inline attachments. Define a `contentId` to treat an attachment as inline. An attachment without a `contentId` is treated as a regular attachment.

### Allowed MIME types

Although most modern clients support inline attachments, the rendering behavior of an inline attachment is largely dependent on the recipient's email client. For this reason, we recommend using more common image formats inline whenever possible, such as `.png`, `.jpg`, or `.gif`. For more information on acceptable MIME types for email attachments, see the [Supported MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from GitHub Azure Samples [Send email inline attachments using JavaScript](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/send-email-advanced/send-email-inline-attachments)
