---
ms.service: api-management
ms.topic: include
author: dlepow
ms.author: danlep
ms.date: 08/04/2022
ms.custom: 
---

Specifically, the gateway:

* Acts as a facade to backend services by accepting API calls and routing them to appropriate backends
* Verifies [API keys](../articles/api-management/api-management-subscriptions.md) and other credentials such as [JWT tokens and certificates](../articles/api-management/api-management-access-restriction-policies.md) presented with requests
* Enforces [usage quotas and rate limits](../articles/api-management/api-management-access-restriction-policies.md)
* Optionally transforms requests and responses as specified in [policy statements](../articles/api-management/api-management-howto-policies.md)
* If configured, [caches responses](../articles/api-management/api-management-howto-cache.md) to improve response latency and minimize the load on backend services
* Emits logs, metrics, and traces for [monitoring, reporting, and troubleshooting](../articles/api-management/observability.md) 