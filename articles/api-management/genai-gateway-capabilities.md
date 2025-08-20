---
title: AI gateway capabilities in Azure API Management
description: Learn about Azure API Management's policies and features to manage generative AI APIs, such as token rate limiting, load balancing, and semantic caching.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.topic: concept-article
ms.date: 04/29/2025
ms.update-cycle: 180-days
ms.author: danlep
ms.custom:
  - build-2025
---

# Overview of AI gateway capabilities in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article introduces capabilities in Azure API Management to help you manage generative AI APIs, such as those provided by [Azure OpenAI Service](/azure/ai-services/openai/overview). Azure API Management provides a range of policies, metrics, and other features to enhance security, performance, and reliability for the APIs serving your intelligent apps. Collectively, these features are called *AI gateway capabilities* for your generative AI APIs.

> [!NOTE]
> * Use AI gateway capabilities to manage APIs exposed by Azure OpenAI Service, available through [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api), or with OpenAI-compatible models served through third-party inference providers.
> * AI gateway capabilities are features of API Management's existing API gateway, not a separate API gateway. For more information on API Management, see [Azure API Management overview](api-management-key-concepts.md).

## Challenges in managing generative AI APIs

One of the main resources you have in generative AI services is *tokens*. Azure OpenAI Service assigns quota for your model deployments expressed in tokens-per-minute (TPM) which is then distributed across your model consumers - for example, different applications, developer teams, departments within the company, etc.

Azure makes it easy to connect a single app to Azure OpenAI Service: you can connect directly using an API key with a TPM limit configured directly on the model deployment level. However, when you start growing your application portfolio, you're presented with multiple apps calling single or even multiple Azure OpenAI Service endpoints deployed as pay-as-you-go or [Provisioned Throughput Units](/azure/ai-services/openai/concepts/provisioned-throughput) (PTU) instances. That comes with certain challenges: 

* How is token usage tracked across multiple applications? Can cross-charges be calculated for multiple applications/teams that use Azure OpenAI Service models? 
* How do you ensure that a single app doesn't consume the whole TPM quota, leaving other apps with no option to use Azure OpenAI Service models? 
* How is the API key securely distributed across multiple applications? 
* How is load distributed across multiple Azure OpenAI endpoints? Can you ensure that the committed capacity in PTUs is exhausted before falling back to pay-as-you-go instances?

The rest of this article describes how Azure API Management can help you address these challenges.

## Import Azure OpenAI Service resource as an API

[Import an API from an Azure OpenAI Service endpoint](azure-openai-api-from-specification.md) to Azure API management using a single-click experience. API Management streamlines the onboarding process by automatically importing the OpenAPI schema for the Azure OpenAI API and sets up authentication to the Azure OpenAI endpoint using managed identity, removing the need for manual configuration. Within the same user-friendly experience, you can preconfigure policies for [token limits](#token-limit-policy), [emitting token metrics](#emit-token-metric-policy), and [semantic caching](#semantic-caching-policy). 

:::image type="content" source="media/azure-openai-api-from-specification/azure-openai-api.png" alt-text="Screenshot of Azure OpenAI API tile in the portal.":::

## Token limit policy

Configure the [Azure OpenAI token limit policy](azure-openai-token-limit-policy.md) to manage and enforce limits per API consumer based on the usage of Azure OpenAI Service tokens. With this policy you can set a rate limit, expressed in tokens-per-minute (TPM). You can also set a token quota over a specified period, such as hourly, daily, weekly, monthly, or yearly. 

:::image type="content" source="media/genai-gateway-capabilities/token-rate-limiting.png" alt-text="Diagram of limiting Azure OpenAI Service tokens in API Management.":::

This policy provides flexibility to assign token-based limits on any counter key, such as subscription key, originating IP address, or an arbitrary key defined through a policy expression. The policy also enables precalculation of prompt tokens on the Azure API Management side, minimizing unnecessary requests to the Azure OpenAI Service backend if the prompt already exceeds the limit. 

The following basic example demonstrates how to set a TPM limit of 500 per subscription key:

```xml
<azure-openai-token-limit counter-key="@(context.Subscription.Id)" 
    tokens-per-minute="500" estimate-prompt-tokens="false" remaining-tokens-variable-name="remainingTokens">
</azure-openai-token-limit>
```

> [!TIP]
> To manage and enforce token limits for other LLM APIs, API Management provides the equivalent [llm-token-limit](llm-token-limit-policy.md) policy.


## Emit token metric policy 

The [Azure OpenAI emit token metric](azure-openai-emit-token-metric-policy.md) policy sends metrics to Application Insights about consumption of LLM tokens through Azure OpenAI Service APIs. The policy helps provide an overview of the utilization of Azure OpenAI Service models across multiple applications or API consumers. This policy could be useful for chargeback scenarios, monitoring, and capacity planning.  

:::image type="content" source="media/genai-gateway-capabilities/emit-token-metrics.png" alt-text="Diagram of emitting Azure OpenAI Service token metrics using API Management.":::

This policy captures prompt, completions, and total token usage metrics and sends them to an Application Insights namespace of your choice. Moreover, you can configure or select from predefined dimensions to split token usage metrics, so you can analyze metrics by subscription ID, IP address, or a custom dimension of your choice. 

For example, the following policy sends metrics to Application Insights split by client IP address, API, and user:

```xml
<azure-openai-emit-token-metric namespace="openai">
    <dimension name="Client IP" value="@(context.Request.IpAddress)" />
    <dimension name="API ID" value="@(context.Api.Id)" />
    <dimension name="User ID" value="@(context.Request.Headers.GetValueOrDefault("x-user-id", "N/A"))" />
</azure-openai-emit-token-metric>
```

> [!TIP]
> To send metrics for other LLM APIs, API Management provides the equivalent [llm-emit-token-metric](llm-emit-token-metric-policy.md) policy.

## Backend load balancer and circuit breaker

One of the challenges when building intelligent applications is to ensure that the applications are resilient to backend failures and can handle high loads. By configuring your Azure OpenAI Service endpoints using [backends](backends.md) in Azure API Management, you can balance the load across them. You can also define circuit breaker rules to stop forwarding requests to the Azure OpenAI Service backends if they're not responsive.  

The backend [load balancer](backends.md#backends-in-api-management) supports round-robin, weighted, and priority-based load balancing, giving you flexibility to define a load distribution strategy that meets your specific requirements. For example, define priorities within the load balancer configuration to ensure optimal utilization of specific Azure OpenAI endpoints, particularly those purchased as PTUs. 

:::image type="content" source="media/genai-gateway-capabilities/backend-load-balancing.png" alt-text="Diagram of using backend load balancing in API Management.":::

The backend [circuit breaker](backends.md#circuit-breaker) features dynamic trip duration, applying values from the Retry-After header provided by the backend. This ensures precise and timely recovery of the backends, maximizing the utilization of your priority backends. 

:::image type="content" source="media/genai-gateway-capabilities/backend-circuit-breaker.png" alt-text="Diagram of using backend circuit breaker in API Management.":::

## Semantic caching policy

Configure [Azure OpenAI semantic caching](azure-openai-enable-semantic-caching.md) policies to optimize token use by storing completions for similar prompts.

:::image type="content" source="media/genai-gateway-capabilities/semantic-caching.png" alt-text="Diagram of semantic caching in API Management.":::

In API Management, enable semantic caching by using Azure Redis Enterprise, Azure Managed Redis, or another [external cache](api-management-howto-cache-external.md) compatible with RediSearch and onboarded to Azure API Management. By using the Azure OpenAI Service Embeddings API, the [azure-openai-semantic-cache-store](azure-openai-semantic-cache-store-policy.md) and [azure-openai-semantic-cache-lookup](azure-openai-semantic-cache-lookup-policy.md) policies store and retrieve semantically similar prompt completions from the cache. This approach ensures completions reuse, resulting in reduced token consumption and improved response performance. 

> [!TIP]
> To enable semantic caching for other LLM APIs, API Management provides the equivalent [llm-semantic-cache-store-policy](llm-semantic-cache-store-policy.md) and [llm-semantic-cache-lookup-policy](llm-semantic-cache-lookup-policy.md) policies.

## Logging token usage, prompts, and completions

Enable a [diagnostic setting](monitor-api-management.md#enable-diagnostic-setting-for-azure-monitor-logs) in your API Management instance to log requests processed by the gateway for large language model REST APIs. For each request, data is sent to Azure Monitor including token usage (prompt tokens, completion tokens, and total tokens), name of the model used, and optionally the request and response messages (prompt and completion). Large requests and responses are split into multiple log entries that are sequentially numbered for later reconstruction if needed.

The API Management administrator can use LLM gateway logs along with API Management gateway logs for scenarios such as the following:

* **Calculate usage for billing** - Calculate usage metrics for billing based on the number of tokens consumed by each application or API consumer (for example, segmented by subscription ID or IP address).
* **Inspect messages** - To help with debugging or auditing, inspect and analyze prompts and completions.

Learn more about [monitoring API Management with Azure Monitor](monitor-api-management.md).

## Content safety policy

To help safeguard users from harmful, offensive, or misleading content, you can automatically moderate all incoming requests to an LLM API by configuring the [llm-content-safety](llm-content-safety-policy.md) policy. The policy enforces content safety checks on LLM prompts by transmitting them first to the [Azure AI Content Safety](/azure/ai-services/content-safety/overview) service before sending to the backend LLM API. 

:::image type="content" source="media/genai-gateway-capabilities/content-safety.png" alt-text="Diagram of moderating prompts by Azure AI Content Safety in an API Management policy.":::

## Labs and samples

* [Labs for the AI gateway capabilities of Azure API Management](https://github.com/Azure-Samples/ai-gateway)
* [AI gateway workshop](https://aka.ms/ai-gateway/workshop)
* [Azure API Management (APIM) - Azure OpenAI Sample (Node.js)](https://github.com/Azure-Samples/genai-gateway-apim)
* [Python sample code for using Azure OpenAI with API Management](https://github.com/Azure-Samples/openai-apim-lb/blob/main/docs/sample-code.md)

## Architecture and design considerations

* [AI gateway reference architecture using API Management](/ai/playbook/technology-guidance/generative-ai/dev-starters/genai-gateway/reference-architectures/apim-based)
* [AI hub gateway landing zone accelerator](https://github.com/Azure-Samples/ai-hub-gateway-solution-accelerator)
* [Designing and implementing a gateway solution with Azure OpenAI resources](/ai/playbook/technology-guidance/generative-ai/dev-starters/genai-gateway/)
* [Use a gateway in front of multiple Azure OpenAI deployments or instances](/azure/architecture/ai-ml/guide/azure-openai-gateway-multi-backend)

## Related content

* [Blog: Introducing AI capabilities in Azure API Management](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/introducing-genai-gateway-capabilities-in-azure-api-management/ba-p/4146525)
* [Blog: Integrating Azure Content Safety with API Management for Azure OpenAI Endpoints](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/integrating-azure-content-safety-with-api-management-for-azure/ba-p/4202505)
* [Training: Manage your generative AI APIs with Azure API Management](/training/modules/api-management)
* [Smart load balancing for OpenAI endpoints and Azure API Management](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/smart-load-balancing-for-openai-endpoints-and-azure-api/ba-p/3991616)
* [Authenticate and authorize access to Azure OpenAI APIs using Azure API Management](api-management-authenticate-authorize-azure-openai.md)
