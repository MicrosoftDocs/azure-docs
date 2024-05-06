---
title: Azure OpenAI Service provisioned throughput
description: Learn about provisioned throughput and Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 05/02/2024 
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
---

# What is provisioned throughput?

The provisioned throughput capability allows you to specify the amount of throughput you require in a deployment. The service then allocates the necessary model processing capacity and ensures it's ready for you. Throughput is defined in terms of provisioned throughput units (PTU) which is a normalized way of representing the throughput for your deployment. Each model-version pair requires different amounts of PTU to deploy and provide different amounts of throughput per PTU.

## What does the provisioned deployment type provide?

- **Predictable performance:** stable max latency and throughput for uniform workloads. 
- **Reserved processing capacity:** A deployment configures the amount of throughput. Once deployed, the throughput is available whether used or not.
- **Cost savings:** High throughput workloads might provide cost savings vs token-based consumption.

An Azure OpenAI Deployment is a unit of management for a specific OpenAI Model. A deployment provides customer access to a model for inference and integrates more features like Content Moderation ([See content moderation documentation](content-filter.md)).

> [!NOTE]
> Provisioned throughput unit (PTU) quota is different from standard quota in Azure OpenAI and is not available by default. To learn more about this offering contact your Microsoft Account Team.

## What do you get?

| Topic | Provisioned|
|---|---|
| What is it? | Provides guaranteed throughput at smaller increments than the existing provisioned offer. Deployments have a consistent max latency for a given model-version. |
| Who is it for? | Customers who want guaranteed throughput with minimal latency variance. |
| Quota | Provisioned-managed throughput Units for a given model. |
| Latency | Max latency constrained from the model. Overall latency is a factor of call shape.  |
| Utilization | Provisioned-managed Utilization measure provided in Azure Monitor. |
| Estimating size | Provided calculator in the studio & benchmarking script. |

## How do I get access to Provisioned?

You need to speak with your Microsoft sales/account team to acquire provisioned throughput. If you don't have a sales/account team, unfortunately at this time, you cannot purchase provisioned throughput.

## What models and regions are available for provisioned throughput?

[!INCLUDE [Provisioned](../includes/model-matrix/provisioned-models.md)]

> [!NOTE]
> The provisioned version of `gpt-4` **Version:** `turbo-2024-04-09` is currently limited to text only.

## Key concepts

### Provisioned throughput units

Provisioned throughput units (PTU) are units of model processing capacity that you can reserve and deploy for processing prompts and generating completions. The minimum PTU deployment, increments, and processing capacity associated with each unit varies by model type & version.

### Deployment types

When deploying a model in Azure OpenAI, you need to set the `sku-name` to be Provisioned-Managed. The `sku-capacity` specifies the number of PTUs assigned to the deployment. 

```azurecli
az cognitiveservices account deployment create \
--name <myResourceName> \
--resource-group  <myResourceGroupName> \
--deployment-name MyDeployment \
--model-name gpt-4 \
--model-version 0613  \
--model-format OpenAI \
--sku-capacity 100 \
--sku-name ProvisionedManaged 
```

### Quota

Provisioned throughput quota represents a specific amount of total throughput you can deploy. Quota in the Azure OpenAI Service is managed at the subscription level. All Azure OpenAI resources within the subscription share this quota.

Quota is specified in Provisioned throughput units and is specific to a (deployment type, model, region) triplet. Quota isn't interchangeable. Meaning you can't use quota for GPT-4 to deploy GPT-3.5-Turbo.

While we make every attempt to ensure that quota is deployable, quota doesn't represent a guarantee that the underlying capacity is available. The service assigns capacity during the deployment operation and if capacity is unavailable the deployment fails with an out of capacity error.

### Determining the number of PTUs needed for a workload

PTUs represent an amount of model processing capacity. Similar to your computer or databases, different workloads or requests to the model will consume different amounts of underlying processing capacity. The conversion from call shape characteristics (prompt size, generation size and call rate) to PTUs is complex and non-linear. To simplify this process, you can use the [Azure OpenAI Capacity calculator](https://oai.azure.com/portal/calculator) to size specific workload shapes. 

A few high-level considerations:
- Generations require more capacity than prompts
- Larger calls are progressively more expensive to compute. For example, 100 calls of with a 1000 token prompt size will require less capacity than 1 call with 100,000 tokens in the prompt. This also means that the distribution of these call shapes is important in overall throughput. Traffic patterns with a wide distribution that includes some very large calls may experience lower throughput per PTU than a narrower distribution with the same average prompt & completion token sizes.

### How utilization performance works

Provisioned deployments provide you with an allocated amount of model processing capacity to run a given model.

In Provisioned-Managed deployments, when capacity is exceeded, the API will immediately return a 429 HTTP Status Error. This enables the user to make decisions on how to manage their traffic. Users can redirect requests to a separate deployment, to a standard pay-as-you-go instance, or leverage a retry strategy to manage a given request. The service will continue to return the 429 HTTP status code until the utilization drops below 100%.

### How can I monitor capacity?

The [Provisioned-Managed Utilization V2 metric](../how-to/monitoring.md#azure-openai-metrics) in Azure Monitor measures a given deployments utilization on 1-minute increments. Provisioned-Managed deployments are optimized to ensure that accepted calls are processed with a consistent model processing time (actual end-to-end latency is dependent on a call's characteristics).  

#### What should  I do when I receive a 429 response?
The 429 response isn't an error, but instead part of the design for telling users that a given deployment is fully utilized at a point in time. By providing a fast-fail response, you have control over how to handle these situations in a way that best fits your application requirements.

The  `retry-after-ms` and `retry-after` headers in the response tell you the time to wait before the next call will be accepted. How you choose to handle this response depends on your application requirements. Here are some considerations:
-	You can consider redirecting the traffic to other models, deployments or experiences. This option is the lowest-latency solution because the action can be taken as soon as you receive the 429 signal. For ideas on how to effectively implement this pattern see this [community post](https://github.com/Azure/aoai-apim).
-	If you're okay with longer per-call latencies, implement client-side retry logic. This option gives you the highest amount of throughput per PTU. The Azure OpenAI client libraries include built-in capabilities for handling retries.

#### How does the service decide when to send a 429?

In the Provisioned-Managed offering, each request is evaluated individually according to its prompt size, expected generation size, and model to determine its expected utilization. This is in contrast to pay-as-you-go deployments which have a [custom rate limiting behavior](../how-to/quota.md) based on the estimated traffic load. For pay-as-you-go deployments this can lead to HTTP 429s being generated prior to defined quota values being exceeded if traffic is not evenly distributed.

For Provisioned-Managed, we use a variation of the leaky bucket algorithm to maintain utilization below 100% while allowing some burstiness in the traffic. The high-level logic is as follows:
1.	Each customer has a set amount of capacity they can utilize on a deployment
2.	When a request is made:

    a.	When the current utilization is above 100%, the service returns a 429 code with the `retry-after-ms` header set to the time until utilization is below 100%
     
    b.	Otherwise, the service estimates the incremental change to utilization required to serve the request by combining prompt tokens and the specified `max_tokens` in the call. If the `max_tokens` parameter is not specified, the service will estimate a value. This estimation can lead to lower concurrency than expected when the number of actual generated tokens is small.  For highest concurrency, ensure that the `max_tokens` value is as close as possible to the true generation size. 

3.	When a request finishes, we now know the actual compute cost for the call. To ensure an accurate accounting, we correct the utilization using the following logic:

    a.	If the actual > estimated, then the difference is added to the deployment's utilization
    b.	If the actual < estimated, then the difference is subtracted. 

4.	The overall utilization is decremented down at a continuous rate based on the number of PTUs deployed. 

> [!NOTE]
> Calls are accepted until utilization reaches 100%. Bursts just over 100% maybe permitted in short periods, but over time, your traffic is capped at 100% utilization.


:::image type="content" source="../media/provisioned/utilization.jpg" alt-text="Diagram showing how subsequent calls are added to the utilization." lightbox="../media/provisioned/utilization.jpg":::

#### How many concurrent calls can I have on my deployment?

The number of concurrent calls you can achieve depends on each call's shape (prompt size, max_token parameter, etc.). The service will continue to accept calls until the utilization reach 100%. To determine the approximate number of concurrent calls you can model out the maximum requests per minute for a particular call shape in the [capacity calculator](https://oai.azure.com/portal/calculator). If the system generates less than the number of samplings tokens like max_token, it will accept more requests.

## Next steps

- [Learn about the onboarding steps for provisioned deployments](../how-to/provisioned-throughput-onboarding.md)
- [Provisioned Throughput Units (PTU) getting started guide](../how-to//provisioned-get-started.md) 
