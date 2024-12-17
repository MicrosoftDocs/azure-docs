---
author: dlepow
ms.service: azure-api-management
ms.custom:
  - build-2024
ms.topic: include
ms.date: 08/21/2024
ms.author: danlep
---

```xml
<policies>
    <inbound>
        <base />
        <llm-semantic-cache-lookup
            score-threshold="0.05"
            embeddings-backend-id ="llm-backend"
            embeddings-backend-auth ="system-assigned" >
            <vary-by>@(context.Subscription.Id)</vary-by>
        </llm-semantic-cache-lookup>
    </inbound>
    <outbound>
        <llm-semantic-cache-store duration="60" />
        <base />
    </outbound>
</policies>
```
