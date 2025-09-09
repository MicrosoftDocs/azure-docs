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

This article introduces the AI gateway capabilities in Azure API Management that help you operationalize and manage AI model deployments and AI APIs. These capabilities help you secure, scale, and manage models, APIs, and MCP servers that serve your AI apps and agents, whether they're accessed from [Azure AI Foundry](/azure/ai-foundry/what-is-azure-ai-foundry), [Azure OpenAI in AI Foundry Models](/azure/ai-foundry/openai/overview), [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api), or other AI providers.

:::image type="content" source="media/genai-gateway-capabilities/capabilities-summary.png" alt-text="Diagram summarizing AI gateway capabilities of Azure API Management.":::

## Why use an AI gateway?

AI adoption involves several phases:
* Defining requirements and evaluating models
* Building AI apps and agents
* Operationalizing and deploying to production

An AI gateway particularly helps with operationalizing and deployment, addressing key challenges such as:
* Managing token usage and quotas across multiple applications
* Authenticating and authorizing access to AI services
* Load balancing across multiple AI endpoints
* Monitoring and logging AI interactions
* Enabling self-service for developer teams

> [!NOTE]
> AI gateway capabilities are features of API Management's existing API gateway, not a separate gateway. For more information, see [Azure API Management overview](api-management-key-concepts.md).

## Traffic mediation and control

Manage and control AI API traffic effectively:

* Support models from Azure OpenAI, Azure AI Foundry, and OpenAI-compatible providers
* Handle chat completions, responses, and realtime APIs
* Expose REST APIs as Model Context Protocol (MCP) servers, and support passthrough to MCP servers

## Security and safety

Protect and control access to your AI APIs:

* Use keyless managed identities to authenticate to Azure AI services
* Configure OAuth 2.0 authorization for AI apps and agents to access APIs using API Management's credential manager
* Apply content safety policies to automatically moderate prompts using [Azure AI Content Safety](/azure/ai-services/content-safety/overview)

## Resiliency and scalability

Ensure your AI APIs are resilient and can handle high loads:

* Configure backend features for AI endpoints:
  * Weight/priority/session-aware load balancing across different backend pools
  * Circuit breaker policies to handle failures gracefully
* Manage token usage with:
  * Token quotas and rate limits per API consumer
  * Semantic caching to reuse similar prompt completions
  * Model load balancing across multiple endpoints
* Deploy across multiple regions for enhanced availability

Here's an example of setting a token rate limit:

```xml
<llm-token-limit counter-key="@(context.Subscription.Id)" 
    tokens-per-minute="500" estimate-prompt-tokens="false">
</llm-token-limit>
```

:::image type="content" source="media/genai-gateway-capabilities/token-rate-limiting.png" alt-text="Diagram of limiting tokens in API Management.":::


* Configure backend load balancing and circuit breakers

:::image type="content" source="media/genai-gateway-capabilities/backend-load-balancing.png" alt-text="Diagram of using backend load balancing in API Management.":::

The [backend load balancer](backends.md#backends-in-api-management) supports:
* Round-robin, weighted, and priority-based load balancing
* Optimal utilization of provisioned throughput units (PTUs)
* Circuit breaker patterns for resilient operations

:::image type="content" source="media/genai-gateway-capabilities/backend-circuit-breaker.png" alt-text="Diagram of using backend circuit breaker in API Management.":::

### MCP server support

API Management can expose AI APIs as MCP servers, enabling:
* Standardized API access across different AI providers
* Self-registration of MCP servers in API Center
* Passthrough to other MCP servers
* Private MCP server registry in API Center

## Developer experience

Streamline development and deployment with:

* Wizard-based policy configuration for common AI scenarios
* Self-service API/MCP server access through APIM/APIC developer portals
* API Management policy toolkit for customization
* API Center Copilot Studio connector
* Latest features through the AI Gateway release channel

For example, enable semantic caching to optimize token usage:

:::image type="content" source="media/genai-gateway-capabilities/semantic-caching.png" alt-text="Diagram of semantic caching in API Management.":::

```xml
<llm-semantic-cache-lookup similarity-threshold="0.9" />
<llm-semantic-cache-store />
```

## Observability and governance

Monitor, analyze, and control AI API usage:

* Log prompts and completions to Azure Monitor
* Track token metrics per consumer in Application Insights
* View the built-in monitoring dashboard
* Configure policies with custom expressions
* Manage token quotas across applications

Example of emitting token metrics:

```xml
<llm-emit-token-metric namespace="llm-metrics">
    <dimension name="Client IP" value="@(context.Request.IpAddress)" />
    <dimension name="API ID" value="@(context.Api.Id)" />
    <dimension name="User ID" value="@(context.Request.Headers.GetValueOrDefault("x-user-id", "N/A"))" />
</llm-emit-token-metric>
```

:::image type="content" source="media/genai-gateway-capabilities/emit-token-metrics.png" alt-text="Diagram of emitting token metrics using API Management.":::

Learn more about [logging token usage, prompts, and completions](api-management-howto-llm-logs.md).

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
