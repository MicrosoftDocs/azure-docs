---
author: AaronMaxwell
ms.author: aaronmax
ms.service: azure-monitor
ms.topic: include
ms.date: 10/16/2023
---

Connection string and role name are the most common settings you need to get started:

```json
{
  "connectionString": "...",
  "role": {
    "name": "my cloud role name"
  }
}
```

Connection string is required. Role name is important anytime you're sending data from different applications to the same Application Insights resource.