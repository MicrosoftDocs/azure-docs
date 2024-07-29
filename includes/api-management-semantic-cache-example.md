---
author: dlepow
ms.service: api-management
ms.custom:
  - build-2024
ms.topic: include
ms.date: 05/09/2024
ms.author: danlep
---

```xml
<policies>
    <inbound>
        <base />
        <azure-openai-semantic-cache-lookup
            score-threshold="0.05"
            embeddings-backend-id ="azure-openai-backend"
            embeddings-backend-auth ="system-assigned" >
            <vary-by>@(context.Subscription.Id)</vary-by>
        </azure-openai-semantic-cache-lookup>
    </inbound>
    <outbound>
        <azure-openai-semantic-cache-store duration="60" />
        <base />
    </outbound>
</policies>
```
