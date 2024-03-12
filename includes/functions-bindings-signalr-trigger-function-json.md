---
author: Y-Sindo
ms.service: azure-functions
ms.topic: include
ms.date: 07/02/2024
ms.author: zityang
---

Here's binding data in the *function.json* file:

```json
{
    "type": "signalRTrigger",
    "name": "invocation",
    "hubName": "SignalRTest",
    "category": "messages",
    "event": "SendMessage",
    "parameterNames": [
        "message"
    ],
    "direction": "in"
}
```