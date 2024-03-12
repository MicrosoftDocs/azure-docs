---
author: Y-Sindo
ms.service: azure-functions
ms.topic: include
ms.date: 07/02/2024
ms.author: zityang
---

Here's binding data in the *function.json* file:

Example function.json:

```json
{
  "type": "signalR",
  "name": "signalRMessages",
  "hubName": "<hub_name>",
  "connectionStringSetting": "<name of setting containing SignalR Service connection string>",
  "direction": "out"
}
```