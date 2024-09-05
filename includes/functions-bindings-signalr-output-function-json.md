---
author: Y-Sindo
ms.service: azure-functions
ms.topic: include
ms.date: 03/20/2024
ms.author: zityang
---

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalROutput",
  "hubName": "hubName1",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```