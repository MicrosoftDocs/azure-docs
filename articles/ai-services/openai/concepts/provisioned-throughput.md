---
title: Azure OpenAI Service provisioned throughput
description: Learn about provisioned throughput and Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 07/23/2024 
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

#### Model independent quota

Provisioned quota is granted on a per subscription/region basis, and unlike Standard offering quota, is model-independent.  Each quota item per subscription and region limits the total number of PTUs that can be deployed across all supported models and versions.

:::image type="content" source="../media/provisioned/model-independent-quota.png" alt-text="Diagram of model independent quota with one pool of PTUs available to multiple Azure OpenAI models." lightbox="../media/provisioned/model-independent-quota.png":::

The new quota shows up in the AI Studio and Azure OpenAI Studio as a quota item named **Provisioned Managed Throughput Unit**.  In the Studio Quota pane, expanding the quota item will show the deployments contributing to usage of the quota.

:::image type="content" source="../media/provisioned/quota.png" alt-text="Screenshot of quota UI for Azure OpenAI provisioned." lightbox="../media/provisioned/quota.png":::

## Capacity transparency and quota definitions

Azure OpenAI is a highly sought-after service where customer demand may exceed service GPU capacity. While Microsoft strives to provide capacity for all in-demand regions and models, selling out a region is always a possibility. This can impact some customers’ ability to create a deployment of the desired model, version, PTU count in a desired region. For existing customers, there is a negotiation about regional availability during the quota allocation process that results in a region selection. With the release of the self-service quota changes, this process changes in a few ways:

- Quota is a limit on the maximum number of PTUs that can be deployed but is not a guarantee of capacity availability. This is the same quota meaning as for other Azure services, such as VMs.
- Capacity is allocated to a customer at deployment time and is held by that customer for as long as the deployment exists. It isn't released unless the customer deletes or scales down the deployment.
- Quota won't be considered an implicit commitment to pay, and it will not be reclaimed if not used.
- Customers use real-time information on quota/capacity availability to choose for themselves an appropriate region for their scenario that can support the deployment they require.

## Regional capacity transparency

To assist users to find the capacity needed for their deployments, customers will use a new API and Studio experience to provide real-time information on.

In AI Studio and Azure OpenAI Studio, the deployment experience will identify when a region lacks the capacity to support the desired model, version and number of PTUs, and will direct the user to a select an alternative region when needed.

:::image type="content" source="../media/provisioned/check-capacity.png" alt-text="Screenshot of the check capacity experience for quota for Azure OpenAI provisioned." lightbox="../media/provisioned/check-capacity.png":::

Details on the new deployment experience can be found in the updated Azure OpenAI [provisioned onboarding guide](../how-to/provisioned-throughput-onboarding.md).

The new [model capacities API](/rest/api/aiservices/accountmanagement/model-capacities/list?view=rest-aiservices-accountmanagement-2024-04-01-preview&tabs=HTTP&preserve-view=true) can also be used to programmatically identify the maximum sized deployment of a specified model that can be created in each region based on the availability of both quota in the subscription and service capacity in the region.

If an acceptable region isn't available to support the desire model, version and/or PTUs, customers can also try the following steps:

- Attempt the deployment with a smaller number of PTUs.
- Attempt the deployment at a different time. Capacity availability changes dynamically based on customer demand and more capacity may become available later.
- Ensure that quota is available in all acceptable regions. The [model capacities API](/rest/api/aiservices/accountmanagement/model-capacities/list?view=rest-aiservices-accountmanagement-2024-04-01-preview&tabs=HTTP&preserve-view=true) and Studio experience consider quota availability in returning alternative regions for creating a deployment.

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
