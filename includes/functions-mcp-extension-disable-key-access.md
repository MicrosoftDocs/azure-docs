---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/03/2026
ms.author: glenga
---

To disable host-based authentication in your MCP server, set `system.webhookAuthorizationLevel` to `Anonymous` in the `host.json` file:

```json
{
  "version": "2.0",
  "extensions": {
    "mcp": {
      ...
      "system": {
        "webhookAuthorizationLevel": "Anonymous"
      }
    }    
  }
}
```