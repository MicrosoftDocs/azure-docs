---
title: GenAI gateway capabilities in Azure API Management
description: Learn about policies and features in Azure API Management that support generative AI (GenAI) gateway capabilities, such as token limiting, load balancing, semantic caching, and more.
services: api-management
author: dlepow

ms.service: api-management
ms.collection: ce-skilling-ai-copilot
ms.topic: concept-article
ms.date: 07/16/2024
ms.author: danlep
---

# Overview of generative AI gateway capabilities in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

While generative AI services and their APIs provide powerful capabilities for understanding, interpreting, and generating human-like text and images, they can also impose significant management, monitoring, and security challenges for app developers. This article provides an introduction to how Azure API Management can help you manage generative AI APIs, such as those provided by [Azure OpenAI Service](../ai-services/openai/overview.md). Azure API Management provides a range of capabilities including policies, metrics, and other features to enhance security, performance, and reliability of APIs for your intelligent apps. Collectively, this set of features enables API Management to be a *generative AI (GenAI) gateway* for your applications.

## Challenges in managing generative AI APIs

One of the main resources you have in Azure OpenAI Service is tokens. Azure OpenAI assigns quota for your model deployments expressed in tokens-per-minute (TPM) which is then distributed across your model consumers - for example, different applications, developer teams, departments within the company, etc.

Azure makes it easy to connect a single app to Azure OpenAI Service. Your intelligent application connects to Azure OpenAI Service directly using an API key with a TPM limit configured directly on the model deployment level. However, when you start growing your application portfolio, you are presented with multiple apps calling single or even multiple Azure OpenAI Service endpoints deployed as pay-as-you-go or [Provisioned Throughput Units](../ai-services/openai/concepts/provisioned-throughput.md) (PTU) instances. That comes with certain challenges: 

* How is token usage tracked across multiple applications? Can cross charges be calculated for multiple applications/teams that use Azure OpenAI Service models? 
* How do you ensure that a single app doesn't consume the whole TPM quota, leaving other apps with no option to use Azure OpenAI Service models? 
* How is the API key securely distributed across multiple applications? 
* How is load distributed across multiple Azure OpenAI endpoints? Can you ensure that the committed capacity in PTUs is used first before falling back to pay-as-you-go instances?

The rest of this article describes how Azure API Management can help you address these challenges.

## Import Azure OpenAI Service resource as an API

[Import an API from an Azure OpenAI Service endpoint](azure-openai-api-from-specification.md) to Azure API management using a single-click experience. API Management streamlines the onboarding process by automatically importing the OpenAPI schema for the Azure OpenAI API and sets up authentication to the Azure OpenAI endpoint using managed identity, removing the need for manual configuration. Within the same user-friendly experience, you can preconfigure policies for [token limits](#token-limit-policy) and [emitting token metrics](#emit-token-metric-policy). 

:::image type="content" source="media/azure-openai-api-from-specification/azure-openai-api.png" alt-text="Screenshot of Azure OpenAI API tile in the portal.":::

## Token limit policy

Configure the [Azure OpenAI token limit policy](azure-openai-token-limit-policy.md) to manage and enforce limits per API consumer based on the usage of Azure OpenAI Service tokens. With this policy you can set limits, expressed in tokens-per-minute (TPM). 

:::image type="content" source="media/genai-gateway-capabilities/token-rate-limiting.png" alt-text="Diagram of limiting Azure OpenAI Service tokens in API Management.":::

This policy provides flexibility to assign token-based limits on any counter key, such as subscription key, IP address, or an arbitrary key defined through a policy expression. The policy also enables precalculation of prompt tokens on the Azure API Management side, minimizing unnecessary requests to the Azure OpenAI Service backend if the prompt already exceeds the limit. 

The following basic example demonstrates how to set a TPM limit of 500 per subscription key:

```xml
<azure-openai-token-limit counter-key="@(context.Subscription.Id)" 
    tokens-per-minute="500" estimate-prompt-tokens="false" remaining-tokens-variable-name="remainingTokens">
</azure-openai-token-limit>
```

## Emit token metric policy 

The [Azure OpenAI emit token metric](azure-openai-emit-token-metric-policy.md) policy sends metrics to Application Insights about consumption of large language model tokens through Azure OpenAI Service APIs. The policy helps provide an overview of the utilization of Azure OpenAI Service models across multiple applications or API consumers. This policy could be useful for chargeback scenarios, monitoring, and capacity planning.  

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

## Load balancer and circuit breaker

One of the challenges when building intelligent applications is to ensure that the applications' backends are resilient to backend failures and can handle high loads. By configuring your Azure OpenAI Service endpoints using [backends](backends.md) in Azure API Management, you can balance the load across them. You can also define circuit breaker rules to stop forwarding requests to the Azure OpenAI Service backends if they're not responsive.  

The backend [load balancer](backends.md#backends-in-api-management) supports round-robin, weighted, and priority-based load balancing, giving you flexibility to define a load distribution strategy that meets your specific requirements. For example, define priorities within the load balancer configuration to ensure optimal utilization of specific Azure OpenAI endpoints, particularly those purchased as PTUs. 

:::image type="content" source="media/genai-gateway-capabilities/backend-load-balancing.png" alt-text="Diagram of using backend load balancing in API Management.":::

The backend [circuit breaker](backends.md#circuit-breaker) features dynamic trip duration, applying values from the Retry-After header provided by the backend. This ensures precise and timely recovery of the backends, maximizing the utilization of your priority backends to their fullest. 

## Semantic caching policy

Configure [Azure OpenAI semantic caching](azure-openai-enable-semantic-caching.md) policies to optimize token consumption by using semantic caching, which stores completions for prompts with similar meaning. 

:::image type="content" source="media/genai-gateway-capabilities/semantic-caching.png" alt-text="Diagram of semantic caching in API Management.":::

In API Management, enable semantic caching by using Azure Redis Enterprise or another external cache compatible with RediSearch and onboarded to Azure API Management. By leveraging the Azure OpenAI Service Embeddings API, this policy identifies semantically similar prompts and stores their respective completions in the cache. This approach ensures completions reuse, resulting in reduced token consumption and improved response performance. 


## Labs and samples

* [Labs for the GenAI gateway capabilities of Azure API Management](https://github.com/Azure-Samples/AI-Gateway)
* [Azure API Management (APIM) - Azure Open AI Sample (Node.js)](https://github.com/Azure-Samples/genai-gateway-apim)
* [Python sample code for using Azure OpenAI with API Management](https://github.com/Azure-Samples/openai-apim-lb/blob/main/docs/sample-code.md)

## Related content

* [Blog: Introducing GenAI capabilities in Azure API Management](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/introducing-genai-gateway-capabilities-in-azure-api-management/ba-p/4146525)
* [Designing and implementing a gateway solution with Azure OpenAI resources](/ai/playbook/technology-guidance/generative-ai/dev-starters/genai-gateway/)
* [Smart load balancing for OpenAI endpoints and Azure API Management](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/smart-load-balancing-for-openai-endpoints-and-azure-api/ba-p/3991616)
* [Authenticate and authorize access to Azure OpenAI APIs using Azure API Management](api-management-authenticate-authorize-azure-openai.md)
