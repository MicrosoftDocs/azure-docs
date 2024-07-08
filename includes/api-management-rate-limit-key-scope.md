---
author: dlepow
ms.service: api-management
ms.topic: include
ms.date: 05/23/2024
ms.author: danlep
---
API Management uses a single counter for each `counter-key` value that you specify in the policy. The counter is updated at all scopes at which the policy is configured with that key value. If you want to configure separate counters at different scopes (for example, a specific API or product), specify different key values at the different scopes. For example, append a string that identifies the scope to the value of an expression.