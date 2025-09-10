---
title: AI gateway capabilities in Azure API Management
description: Learn about Azure API Management's policies and features to manage generative AI APIs, such as token rate limiting, load balancing, and semantic caching.
services: api-management
author: dlepow

ms.service: azure-api-management
ms.collection: ce-skilling-ai-copilot
ms.topic: concept-article
ms.date: 09/08/2025
ms.update-cycle: 180-days
ms.author: danlep
ms.custom:
  - build-2025
---

# Overview of AI gateway capabilities in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

This article introduces the AI gateway capabilities in Azure API Management that help you manage your AI APIs effectively. These capabilities help you secure, scale, and govern LLM model deployments, AI APIs, and MCP servers that serve your AI apps and agents, whether they're accessed from [Azure AI Foundry](/azure/ai-foundry/what-is-azure-ai-foundry), [Azure OpenAI in AI Foundry Models](/azure/ai-foundry/openai/overview), [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api), or other providers.

:::image type="content" source="media/genai-gateway-capabilities/capabilities-summary.png" alt-text="Diagram summarizing AI gateway capabilities of Azure API Management.":::

> [!NOTE]
> AI gateway capabilities, including [MCP server capabilities](mcp-server-overview.md) are features of API Management's existing API gateway, not a separate gateway. For an introduction, see [Azure API Management overview](api-management-key-concepts.md). Some related features are in [Azure API Center](../api-center/overview.md).

 
## Why use an AI gateway?

AI adoption in organizations involves several phases:

* Defining requirements and evaluating AI models
* Building AI apps and agents that need access to AI models and services
* Operationalizing and deploying AI apps and backends to production

As your AI adoption matures, the AI gateway capabilities in API Management address key challenges with operations and deployment such as:

* Authenticating and authorizing access to AI services
* Load balancing across multiple AI endpoints
* Monitoring and logging AI interactions
* Managing token usage and quotas across multiple applications
* Enabling self-service for developer teams


## Traffic mediation and control

With the AI gateway capabilities, you can:

* Quickly import and configure OpenAI-compatible or passthrough AI model endpoints as APIs
* Manage models deployed in Azure AI Foundry or providers such as Amazon Bedrock
* Govern chat completions, responses, and realtime APIs
* Expose your existing REST APIs as Model Context Protocol (MCP) servers, and support passthrough to MCP servers

For example, for models deployed in AI Foundry, API Management streamlines the onboarding process by providing a wizard to import the OpenAPI schema and set up authentication to the AI Foundry endpoint using managed identity, removing the need for manual configuration. Within the same user-friendly experience, you can preconfigure API policies for token limits, emitting token metrics, and semantic caching of LLM responses.

More information:

* [Import an AI Foundry API](azure-ai-foundry-api.md)
* [Import a language model API](openai-compatible-llm-api.md)
* [Export a REST API as an MCP server](export-rest-mcp-server.md)
* [Expose and govern an existing MCP server](mcp-server-passthrough.md)


## Security and safety

A key capability of an AI gateway is to secure and control access to your AI APIs. With API Management, you can:

* Use managed identities to authenticate to Azure AI services, avoiding use of API keys for authentication
* Configure OAuth 2.0 authorization for AI apps and agents to access APIs using API Management's credential manager
* Apply policies to automatically moderate LLM prompts using [Azure AI Content Safety](/azure/ai-services/content-safety/overview)

More information:

* [Authenticate and authorize access to Azure OpenAI APIs](api-management-authenticate-authorize-azure-openai.md)
* [About API credentials and credential manager](credentials-overview.md)
* [Enforce content safety checks on LLM requests](llm-content-safety-policy.md)

## Scalability

One of the main resources you have in generative AI services is *tokens*. Azure AI Foundry and other providers assign quotas for your model deployments expressed in tokens-per-minute (TPM) which is then distributed across your model consumers - for example, different applications, developer teams, departments within the company, etc.

If you have a single app connecting to an AI service backend, you can manage token consumption with a TPM limit configured directly on the model deployment level. However, when you start growing your application portfolio, you're presented with multiple apps calling single or even multiple AI service endpoints deployed as pay-as-you-go or[Provisioned Throughput Units](/aure/ai-services/openai/concepts/provisioned-throughput) (PTU) instances. That comes with challenges you ensure that a single app doesn't consume the whole TPM quota, leaving other apps with no option to use related models. THere are also challenges with [tracking token usage](#observability-and-governance) across multiple applications, and [distributing load](#resiliency) across multiple AI service endpoints.


### Token rate limiting and quotas

Configure the [LLM token limit policy](llm-token-limit-policy.md) on your AI APIs to manage and enforce limits per API consumer based on the usage of AI service tokens. With this policy you can set a rate limit, expressed in tokens-per-minute (TPM). You can also set a token quota over a specified period, such as hourly, daily, weekly, monthly, or yearly. 

<!-- Update image for LLM token limit policy and generic/Foundry backend? -->

:::image type="content" source="media/genai-gateway-capabilities/token-rate-limiting.png" alt-text="Diagram of limiting Azure OpenAI Service tokens in API Management.":::

This policy provides flexibility to assign token-based limits on any counter key, such as subscription key, originating IP address, or an arbitrary key defined through a policy expression. The policy also enables precalculation of prompt tokens on the Azure API Management side, minimizing unnecessary requests to the AI service backend if the prompt already exceeds the limit. 

The following basic example demonstrates how to set a TPM limit of 500 per subscription key:

```xml
<llm-token-limit counter-key="@(context.Subscription.Id)" 
    tokens-per-minute="500" estimate-prompt-tokens="false" remaining-tokens-variable-name="remainingTokens">
</llm-token-limit>
```

### Semantic caching

Semantic caching is a technique that can be used to improve the performance of AI services by caching the results of previous requests and reusing them for similar requests. This can help reduce the number of calls made to the AI service backend and improve response times for end users.

In API Management, enable semantic caching by using Azure Redis Enterprise, Azure Managed Redis, or another [external cache](api-management-howto-cache-external.md) compatible with RediSearch and onboarded to Azure API Management. By using the AI Embeddings API, the [llm-semantic-cache-store](llm-semantic-cache-store-policy.md) and [llm-semantic-cache-lookup](llm-cache-lookup-policy.md) policies store and retrieve semantically similar prompt completions from the cache. This approach ensures completions reuse, resulting in reduced token consumption and improved response performance. 

:::image type="content" source="media/genai-gateway-capabilities/semantic-caching.png" alt-text="Diagram of semantic caching in API Management.":::

More information:

* [Enable semantic caching for AI APIs in Azure API Management](azure-openai-enable-semantic-caching.md)

<!--Update article for generic LLM backends? For example, use Azure AI Foundry Embeddings API? -->

### Native scaling features in API Management

API Management also provides built-in scaling features to help the gateway handle high volumes of requests to your AI APIs, including automatic or manual addition of gateway *scale units* and addition of regional gateways for multi-region deployments. Specific capabilities depend on the API Management service tier.
 
More information:

* [Upgrade and scale an API Management instance](upgrade-and-scale.md)
* [Deploy an API Management instance in multiple regions](api-management-howto-deploy-multi-region.md)

> [!NOTE]
> While API Management can scale gateway capacity, you also need to scale and distribute traffic to you AI backends to accommodate increased load (see [Resiliency](#resiliency)). For example, to take advantage of geographical distribution of your system in a multi-region configuration, you should deploy backend AI services in the same regions as your API Management gateways.

<!-- Link to next section? -->

## Resiliency

One of the challenges when building intelligent applications is to ensure that the applications are resilient to backend failures and can handle high loads. By configuring your LLM endpoints using [backends](backends.md) in Azure API Management, you can balance the load across them. You can also define circuit breaker rules to stop forwarding requests to AI service backends if they're not responsive. 

### Load balancer 

The backend [load balancer](backends.md#backends-in-api-management) supports round-robin, weighted, priority-based, and session-aware load balancing, giving you flexibility to define a load distribution strategy that meets your specific requirements. For example, define priorities within the load balancer configuration to ensure optimal utilization of specific Azure AI Foundry endpoints, particularly those purchased as PTU instances. 

<!-- Update image for generic/Foundry backends? -->

:::image type="content" source="media/genai-gateway-capabilities/backend-load-balancing.png" alt-text="Diagram of using backend load balancing in API Management.":::

### Circuit breaker

The backend [circuit breaker](backends.md#circuit-breaker) features dynamic trip duration, applying values from the `Retry-After` header provided by the backend. This ensures precise and timely recovery of the backends, maximizing the utilization of your priority backends.

:::image type="content" source="media/genai-gateway-capabilities/backend-circuit-breaker.png" alt-text="Diagram of using backend circuit breaker in API Management.":::


<!--
## MCP server support

API Management can expose AI APIs as MCP servers, enabling:
* Standardized API access across different AI providers
* Self-registration of MCP servers in API Center
* Passthrough to other MCP servers
* Private MCP server registry in API Center

-->

## Observability and governance

Monitor, analyze, and control AI API usage:

* Log prompts and completions to Azure Monitor
* Track token metrics per consumer in Application Insights
* View the built-in monitoring dashboard
* Configure policies with custom expressions
* Manage token quotas across applications

Example of emitting token metrics with the [llm-emit-token-metric](llm-emit-token-metric-policy.md) policy:

```xml
<llm-emit-token-metric namespace="llm-metrics">
    <dimension name="Client IP" value="@(context.Request.IpAddress)" />
    <dimension name="API ID" value="@(context.Api.Id)" />
    <dimension name="User ID" value="@(context.Request.Headers.GetValueOrDefault("x-user-id", "N/A"))" />
</llm-emit-token-metric>
```

:::image type="content" source="media/genai-gateway-capabilities/emit-token-metrics.png" alt-text="Diagram of emitting token metrics using API Management.":::

More information: 

* [Logging token usage, prompts, and completions](api-management-howto-llm-logs.md)

## Developer experience

Streamline development and deployment of you AI APIs and MCP servers with:

* Wizard-based policy configuration for common AI scenarios
* Self-service API/MCP server access through developer portals in API Management and API Center
* API Management policy toolkit for customization
* API Center Copilot Studio connector
* Latest features through the AI Gateway release channel

More information:

* [Configure service update settings for your API Management instances](configure-service-update-settings.md)
* [Azure API Management policy toolkit](https://github.com/Azure/azure-api-management-policy-toolkit/)
* [API Center Copilot Studio connector](../api-center/export-to-copilot-studio.yml)


## Getting started

To start using AI gateway capabilities:

1. [Import an API from Azure OpenAI Service](azure-openai-api-from-specification.md)
2. Configure security and token management policies
3. Set up monitoring and logging
4. Enable semantic caching if needed
5. Configure MCP server support through API Center

## Code samples and hands-on learning

* [AI gateway capabilities labs](https://github.com/Azure-Samples/ai-gateway)
* [AI gateway workshop](https://aka.ms/ai-gateway/workshop)
* [Azure OpenAI with API Management (Node.js)](https://github.com/Azure-Samples/genai-gateway-apim)
* [Python sample code](https://github.com/Azure-Samples/openai-apim-lb/blob/main/docs/sample-code.md)

## Architecture and design

* [AI gateway reference architecture using API Management](/ai/playbook/technology-guidance/generative-ai/dev-starters/genai-gateway/reference-architectures/apim-based)
* [AI hub gateway landing zone accelerator](https://github.com/Azure-Samples/ai-hub-gateway-solution-accelerator)
* [Designing and implementing a gateway solution with Azure OpenAI resources](/ai/playbook/technology-guidance/generative-ai/dev-starters/gemonitoring API Management with Azurenai-gateway/)
* [Use a gateway in front of multiple Azure OpenAI deployments](/azure/architecture/ai-ml/guide/azure-openai-gateway-multi-backend)

## Related content

* [Blog: Introducing AI capabilities in Azure API Management](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/introducing-genai-gateway-capabilities-in-azure-api-management/ba-p/4146525)
* [Blog: Integrating Azure Content Safety with API Management](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/integrating-azure-content-safety-with-api-management-for-azure/ba-p/4202505)
* [Training: Manage your generative AI APIs](/training/modules/api-management)
* [Smart load balancing for OpenAI endpoints](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/smart-load-balancing-for-openai-endpoints-and-azure-api/ba-p/3991616)
* [Authenticate and authorize access to Azure OpenAI APIs](api-management-authenticate-authorize-azure-openai.md)