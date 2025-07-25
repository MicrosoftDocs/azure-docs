---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 07/24/2025
ms.author: danlep
---


We recommend configuring a [rate-limit](../articles/api-management/rate-limit-policy.md) policy (or [rate-limit-by-key](../articles/api-management/rate-limit-by-key-policy.md) policy) immediately after any cache lookup. This helps keep your backend service from getting overloaded if the cache isn't available.
