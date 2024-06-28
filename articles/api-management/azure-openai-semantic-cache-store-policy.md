---
title: Azure API Management policy reference - azure-openai-sematic-cache-store
description: Reference for the azure-openai-semantic-cache-store policy available for use in Azure API Management. Provides policy usage, settings, and examples.
services: api-management
author: dlepow

ms.service: api-management
ms.custom:
  - build-2024
ms.topic: article
ms.date: 05/10/2024
ms.author: danlep
---

# Cache responses to Azure OpenAI API requests

[!INCLUDE [api-management-availability-basicv2-standardv2](../../includes/api-management-availability-basicv2-standardv2.md)]

The `azure-openai-semantic-cache-store` policy caches responses to Azure OpenAI Chat Completion API and Completion API requests to a configured external cache. Response caching reduces bandwidth and processing requirements imposed on the backend Azure OpenAI API and lowers latency perceived by API consumers.

> [!NOTE]
> * This policy must have a corresponding [Get cached responses to Azure OpenAI API requests](azure-openai-semantic-cache-lookup-policy.md) policy. 
> * For prerequisites and steps to enable semantic caching, see [Enable semantic caching for Azure OpenAI APIs in Azure API Management](azure-openai-enable-semantic-caching.md).
> * Currently, this policy is in preview.

[!INCLUDE [api-management-policy-generic-alert](../../includes/api-management-policy-generic-alert.md)]

## Policy statement

```xml
<azure-openai-semantic-cache-store duration="seconds"/>
```


## Attributes

| Attribute         | Description                                            | Required | Default |
| ----------------- | ------------------------------------------------------ | -------- | ------- |
| duration         | Time-to-live of the cached entries, specified in seconds. Policy expressions are allowed.    | Yes      | N/A               |


## Usage

- [**Policy sections:**](./api-management-howto-policies.md#sections) outbound
- [**Policy scopes:**](./api-management-howto-policies.md#scopes) global, workspace, product, API, operation
-  [**Gateways:**](api-management-gateways-overview.md) v2

### Usage notes

- This policy can only be used once in a policy section.
- If the cache lookup fails, the API call that uses the cache-related operation doesn't raise an error, and the cache operation completes successfully. 

## Examples

### Example with corresponding azure-openai-semantic-cache-lookup policy

[!INCLUDE [api-management-semantic-cache-example](../../includes/api-management-semantic-cache-example.md)]

## Related policies

* [Caching](api-management-policies.md#caching)
* [azure-openai-semantic-cache-lookup](azure-openai-semantic-cache-lookup-policy.md)

[!INCLUDE [api-management-policy-ref-next-steps](../../includes/api-management-policy-ref-next-steps.md)]
