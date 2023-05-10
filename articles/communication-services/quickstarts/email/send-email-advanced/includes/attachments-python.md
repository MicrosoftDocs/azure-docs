---
title: include file
description: Attachments Python SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message with attachments

We can add an attachment by defining an `attachment` and adding it to the `attachments` of our `message` object. Read the attachment file and encode it using Base64. Decode the bytes as a string and pass it into the `attachment` object.

```python
import base64

with open("<path-to-your-attachment>", "rb") as file:
    file_bytes_b64 = base64.b64encode(file.read())

message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {
                "address": "<recipient1@emaildomain.com>",
                "displayName": "Customer Name"
            }
        ]
    },
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>",
    "attachments": [
        {
            "name": "<your-attachment-name>",
            "contentType": "<your-attachment-mime-type>",
            "contentInBase64": file_bytes_b64.decode()
        }
    ]
}

poller = email_client.begin_send(message)
result = poller.result()
```

### Allowed MIME types

For more information on acceptable MIME types for email attachments, see the [allowed MIME types](../../../../concepts/email/email-attachment-allowed-mime-types.md) documentation.

### Sample code

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email-advanced)


