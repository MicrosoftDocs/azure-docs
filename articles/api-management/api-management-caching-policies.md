---
title: Azure API Management caching policies | Microsoft Docs
description: Caching policies available for use in Azure API Management. 
services: api-management
author: dlepow

ms.service: api-management
ms.topic: reference
ms.date: 12/07/2022
ms.author: danlep
---

# API Management caching policies

The following API Management policies are used for caching responses. 

[!INCLUDE [api-management-cache-volatile](../../includes/api-management-cache-volatile.md)]

## Response caching policies
- [Get from cache](cache-lookup-policy.md) - Perform cache lookup and return a valid cached response when available.
- [Store to cache](cache-store-policy.md) - Caches responses according to the specified cache control configuration.

## Value caching policies
- [Get value from cache](cache-lookup-value-policy.md) - Retrieve a cached item by key.
- [Store value in cache](cache-store-value-policy.md) - Store an item in the cache by key.
- [Remove value from cache](cache-remove-value-policy.md) - Remove an item in the cache by key.

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
