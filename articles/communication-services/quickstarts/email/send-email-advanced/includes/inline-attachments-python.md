---
title: include file
description: Inline Attachments Python SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with inline attachments

We can add an inline attachment by defining one or more `attachments`, making sure to include a unique `contentId` for each, and adding them to our message. Read the attachment file and encode it using Base64. Decode the bytes as a string and pass it into the `attachment` object.

```python
import base64

with open("./inline-attachment.jpg", "rb") as file:
    jpg_file_bytes_b64 = base64.b64encode(file.read())

with open("./inline-attachment.png", "rb") as file:
    png_file_bytes_b64 = base64.b64encode(file.read())

inlineAttachments = [
    {
        "name": "inline-attachment.jpg",
        "contentId": "my-inline-attachment-1",
        "contentType": "image/jpeg",
        "contentInBase64": jpg_file_bytes_b64.decode()
    },
    {
        "name": "inline-attachment.png",
        "contentId": "my-inline-attachment-2",
        "contentType": "image/png",
        "contentInBase64": png_file_bytes_b64.decode()
    }
]
```

Within the HTML body of the message, we can then embed an image by referencing its `contentId` within the source of an `<img>` tag.

```python
message = {
    "content": {
        "subject": "Welcome to Azure Communication Services Email",
        "plainText": "This email message is sent from Azure Communication Services Email using the Python SDK.",
        "html": "<html><h1>HTML body inline images:</h1><img src=\"cid:my-inline-attachment-1\" /><img src=\"cid:my-inline-attachment-2\" /></html>"
    },
    "recipients": {
        "to": [
            {
                "address": "<emailalias@contoso.com>",
                "displayName": "Customer Name"
            }
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
    "attachments": inlineAttachments
}

poller = email_client.begin_send(message)
result = poller.result()
```

> [!NOTE]
> Regular attachments can be combined with inline attachments, as well. Defining a `contentId` will treat an attachment as inline, while an attachment without a `contentId` will be treated as a regular attachment.

### Allowed MIME types

Although most modern clients support inline attachments, the rendering behavior of an inline attachment is largely dependent on the recipient's email client. For this reason, it is suggested to use more common image formats inline whenever possible, such as .png, .jpg, or .gif. For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email-advanced/send-email-inline-attachments)


