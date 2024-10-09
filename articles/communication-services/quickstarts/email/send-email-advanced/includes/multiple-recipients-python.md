---
title: include file
description: Multiple recipients Python SDK include file
author: natekimball-msft
manager: koagbakp
services: azure-communication-services
ms.author: natekimball
ms.date: 04/07/2023
ms.topic: include
ms.service: azure-communication-services
---

## Send an email message to multiple recipients

We can define multiple recipients by adding more email addresses to the `recipients` object. These addresses can be added as `to`, `cc`, or `bcc` recipient lists accordingly. Optionally, we can also add a `ReplyTo` email address to receive any replies.

```python
message = {
    "content": {
        "subject": "This is the subject",
        "plainText": "This is the body",
        "html": "html><h1>This is the body</h1></html>"
    },
    "recipients": {
        "to": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ],
        "cc": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ],
        "bcc": [
            {"address": "<recipient1@emaildomain.com>", "displayName": "Customer Name"},
            {"address": "<recipient2@emaildomain.com>", "displayName": "Customer Name 2"}
        ]
    },
    "replyTo": [
        {"address": "<replytoemail@emaildomain.com>", "displayName": "Display Name"}
    ],
    "senderAddress": "<donotreply@xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.azurecomm.net>"
}

poller = email_client.begin_send(message)
result = poller.result()
```

### Sample code 

You can download the sample app demonstrating this action from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/send-email-advanced)
