---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 07/24/2025
ms.author: danlep
---


Add a [rate-limit](../articles/api-management/rate-limit-policy.md) policy (or [rate-limit-by-key](../articles/api-management/rate-limit-by-key-policy.md) policy) after the cache lookup to help limit the number of calls and prevent overload on the backend service in case the cache isn't available.
