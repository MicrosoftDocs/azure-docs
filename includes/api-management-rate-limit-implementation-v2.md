---
author: dlepow
ms.service: azure-api-management
ms.topic: include
ms.date: 11/14/2025
ms.author: danlep
---

The v2 tiers use a [token bucket algorithm for rate limiting](../articles/api-management/api-management-sample-flexible-throttling.md#rate-limits), which differs from the sliding window algorithm in classic tiers. Because of this implementation difference, when you configure token limits in the v2 tiers at multiple scopes by using the same `counter-key`, make sure that the `tokens-per-minute` value is consistent across all policy instances. Inconsistent values can cause unpredictable behavior.  