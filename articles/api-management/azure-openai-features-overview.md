---
title: GenAI gateway capabilities in Azure API Management
description: Learn about policies and features in Azure API Management that support GenAI gateway capabilities, such as token limiting, semantic caching, and more.
services: api-management
author: dlepow

ms.service: api-management
ms.topic: concept-a
ms.date: 07/16/2024
ms.author: danlep
---

# Overview of generative AI gateway capabilities in Azure API Management

[!INCLUDE [api-management-availability-all-tiers](../../includes/api-management-availability-all-tiers.md)]

While generative AI services and their APIs provide powerful capabilities for understanding, interpreting, and generating human-like text and images, they can also impose significant management and security challenges. This article provides an introduction to how Azure API Management can help you manage generative AI APIs, such as those provided by [Azure OpenAI Service](../ai-services/openai/overview.md), and how you can use policies and other features to enhance security, performance, and reliability of your intelligent apps. Collectively, these capabilities are referred to as the *GenAI gateway*.


## Managing tokens

One of the main resources you have in Azure OpenAI Service is tokens. Azure OpenAI assigns quota for your model deployments expressed in tokens-per-minute (TPM) which is then distributed across your model consumers that can be represented by different applications, developer teams, departments within the company, etc.

Starting with a single application integration, Azure makes it easy to connect your app to Azure OpenAI Service. Your intelligent application connects to Azure OpenAI directly using an API key with a TPM limit configured directly on the model deployment level. However, when you start growing your application portfolio, you are presented with multiple apps calling single or even multiple Azure OpenAI endpoints deployed as Pay-as-you-go or Provisioned Throughput Units (PTUs) instances. That comes with certain challenges: 

* How can we track token usage across multiple applications? How can we do cross charges for multiple applications/teams that use Azure OpenAI models? 
* How can we make sure that a single app does not consume the whole TPM quota, leaving other apps with no option to use Azure OpenAI models? 
* How can we make sure that the API key is securely distributed across multiple applications? 
* How can we distribute load across multiple Azure OpenAI endpoints? How can we make sure that PTUs are used first before falling back to Pay-as-you-go instances?

## Token limit policy

Configure the [Azure OpenAI token limit policy](azure-openai-token-limit-policy.md) to manage and enforce limits per API consumer based on the usage of Azure OpenAI tokens. With this policy you can set limits, expressed in tokens-per-minute (TPM). 

This policy provides flexibility to assign token-based limits on any counter key, such as subscription key, IP address or any other arbitrary key defined through a policy expression. The policy also enables pre-calculation of prompt tokens on the Azure API Management side, minimizing unnecessary requests to the Azure OpenAI backend if the prompt already exceeds the limit. 

The following basic example demonstrates how to set a TPM limit of 500 per subscription key:

```xml
<azure-openai-token-limit counter-key="@(context.Subscription.Id)" 
    tokens-per-minute="500" estimate-prompt-tokens="false" remaining-tokens-variable-name="remainingTokens">
</azure-openai-token-limit>
```

## Emit token metric policy 

The [Azure OpenAI emit token metric](azure-openai-emit-token-metric-policy.md) policy sends metrics to Application Insights about consumption of large language model tokens through Azure OpenAI Service APIs. The policy helps provide an overview of the utilization of Azure OpenAI Service models across multiple applications or API consumers. This policy could be useful for chargeback scenarios, monitoring, and capacity planning.  

This policy captures prompt, completions, and total token usage metrics and sends them to an Application Insights namespace of your choice. Moreover, you can configure or select from predefined dimensions to split token usage metrics, enabling granular analysis by subscription ID, IP address, or a custom dimension of your choice. 

For example, the following policy sends metrics to Application Insights split by client IP address, API, and user:

```xml
<azure-openai-emit-token-metric namespace="openai">
    <dimension name="Client IP" value="@(context.Request.IpAddress)" />
    <dimension name="API ID" value="@(context.Api.Id)" />
    <dimension name="User ID" value="@(context.Request.Headers.GetValueOrDefault("x-user-id", "N/A"))" />
</azure-openai-emit-token-metric>
```

## Load balancer and circuit breaker

One of the challenges when building intelligent applications is to ensure that the application is resilient to backen failures and can handle high loads. By configuring your Azure OpenAI Service endpoints using [backends](backends.md) in Azure API Management, you can balance the load across them. You can also define circuit breaker rules to stop forwarding requests to the Azure OpenAI backends if they're not responsive.  

The backend [load balancer](backends.md#backends-in-api-management) supports round-robin, weighted, and priority-based load balancing, giving you flexibility to define a load distribution strategy that meets your specific requirements. For example, define priorities within the load balancer configuration to ensure optimal utilization of specific Azure OpenAI endpoints, particularly those purchased as PTUs. 

 

## Labs and samples

* [Labs for the GenAI gateway capabilities of Azure API Management](https://github.com/Azure-Samples/AI-Gateway)

## Related content

* [Blog: Introducing GenAI capabilities in Azure API Management](https://techcommunity.microsoft.com/t5/azure-integration-services-blog/introducing-genai-gateway-capabilities-in-azure-api-management/ba-p/4146525)
* [Designing and implementing a gateway solution with Azure OpenAI resources](/ai/playbook/technology-guidance/generative-ai/dev-starters/genai-gateway/)
* [Training: Fundamental AI concepts](/training/modules/get-started-ai-fundamentals/)
