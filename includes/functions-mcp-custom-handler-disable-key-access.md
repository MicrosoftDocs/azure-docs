---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/03/2026
ms.author: glenga
---

To disable host-based authentication for self-hosted MCP servers, add the following code in the `customHandler` section of the `host.json` file:

```json
"customHandler": {
    ...
    "http": {
        "DefaultAuthorizationLevel": "anonymous"
    }
}
```