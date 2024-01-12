---
title: Azure OpenAI Service provisioned throughput
description: Learn about provisioned throughput and Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 1/16/2024
ms.custom: 
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# What is provisioned throughput?

The provisioned throughput capability allows you to specify the amount of throughput you require in a deployment. The service then allocates the necessary model processing capacity and ensures it's ready for you. Throughput is defined in terms of provisioned throughput units (PTU) which is a normalized way of representing the throughput for your deployment. Each model-version pair requires different amounts of PTU to deploy and provide different amounts of throughput per PTU.

## What does the provisioned deployment type provide?

- **Predictable performance:** stable max latency and throughput for uniform workloads. 
- **Reserved processing capacity:** A deployment configures the amount of throughput. Once deployed, the throughput is available whether used or not.
- **Cost savings:** High throughput workloads might provide cost savings vs token-based consumption.

An Azure OpenAI Deployment is a unit of management for a specific OpenAI Model. A deployment provides customer access to a model for inference and integrates more features like Content Moderation ([See content moderation documentation](content-filter.md)).

> [!NOTE]
> Provisioned throughput unit(PTU) quota is different from standard quota in Azure OpenAI and are not available by default. To learn more about this offering contact your Microsoft Account Team.

## What do you get?

| Topic | Provisioned|
|---|---|
| What is it? | Provides guaranteed throughput at smaller increments than the existing provisioned offer. Deployments have a consistent max latency for a given model-version |
| Who is it for? | Customers who want guaranteed throughput with minimal latency variance. |
| Quota | Provisioned-managed throughput Units for a given model |
| Latency | Max latency constrained from the model. Overall latency is a factor of call shape.  |
| Utilization | Provisioned-managed Utilization measure provided in Azure Monitor |
| Estimating size | Provided calculator in the studio & benchmarking script |

## Key concepts

### Provisioned throughput units

Provisioned throughput Units (PTU) are units of model processing capacity that customers you can reserve and deploy for processing prompts and generating completions. The minimum PTU deployment, increments, and processing capacity associated with each unit varies by model type & version.

### Deployment types

When deploying a model in Azure OpenAI, you need to set the `sku-name` to be Provisioned-Managed. The `sku-capacity` specifies the number of PTUs assigned to the deployment. 

```azurecli
az cognitiveservices account deployment create \
--name <myResourceName> \
--resource-group  <myResourceGroupName> \
--deployment-name MyDeployment \
--model-name GPT-4 \
--model-version 0613  \
--model-format OpenAI \
--sku-capacity 100 \
--sku-name Provisioned-Managed 
```

### Quota

Provisioned throughput quota represents a specific amount of total throughput you can deploy. Quota in the Azure OpenAI Service is managed at the subscription level. All Azure OpenAI resources within the subscription share this quota. 

Quota is specific to a (deployment type, model, region) triplet and isn't interchangeable. Meaning you can't use quota for GPT-4 to deploy GPT-35-turbo. You can raise a support request to move quota across deployment types, models, or regions but the swap isn't guaranteed.

While we make every attempt to ensure that quota is deployable, quota doesn't represent a guarantee that the underlying capacity is available. The service assigns capacity during the deployment operation and if capacity is unavailable the deployment fails with an out of capacity error.


### How utilization enforcement works
Provisioned deployments provide you with an allocated amount of model processing capacity to run a given model. The `Provisioned-Managed Utilization` metric in Azure Monitor measures a given deployments utilization on 1-minute increments. Provisioned-Managed deployments are optimized to ensure that accepted calls are processed with a consistent model processing time (actual end-to-end latency is dependent on a call's characteristics). When the workload exceeds the allocated PTU capacity, the service returns a 429 HTTP status code until the utilization drops down below 100%. 


#### What should  I do when I receive a 429 response?
The 429 response isn't an error, but instead part of the design for telling users that a given deployment is fully utilized at a point in time. By providing a fast-fail response, you have control over how to handle these situations in a way that best fits your application requirements.

The  `retry-after-ms` and `retry-after` headers in the response tell you the time to wait before the next call will be accepted. How you choose to handle this response depends on your application requirements. Here are some considerations:
-	You can consider redirecting the traffic to other models, deployments or experiences. This option is the lowest-latency solution because the action can be taken as soon as you receive the 429 signal.
-	If you're okay with longer per-call latencies, implement client-side retry logic. This option gives you the highest amount of throughput per PTU. The Azure OpenAI client libraries include built-in capabilities for handling retries.

#### How does the service decide when to send a 429?
We use a variation of the leaky bucket algorithm to maintain utilization below 100% while allowing some burstiness in the traffic. The high-level logic is as follows:
1.	Each customer has a set amount of capacity they can utilize on a deployment
2.	When a request is made:

    a.	When the current utilization is above 100%, the service returns a 429 code with the `retry-after-ms` header set to the time until utilization is below 100%
     
    b.	Otherwise, the service estimates the incremental change to utilization required to serve the request by combining prompt tokens and the specified max_tokens in the call.

3.	When a request finishes, we now know the actual compute cost for the call. To ensure an accurate accounting, we correct the utilization using the following logic:

    a.	If the actual > estimated, then the difference is added to the deployment's utilization
    b.	If the actual < estimated, then the difference is subtracted. 

4.	The overall utilization is decremented down at a continuous rate based on the number of PTUs deployed. 

Since calls are accepted until utilization reaches 100%, you're allowed to burst over 100% utilization when first increasing traffic. For sizeable calls and small sized deployments, you might then be over 100% utilization for up to several minutes.


:::image type="content" source="../media/provisioned/utilization.jpg" alt-text="Diagram showing how subsequent calls are added to the utilization." lightbox="../media/provisioned/utilization.jpg":::



## Next steps

- [Learn about the onboarding steps for provisioned deployments](../how-to/provisioned-throughput-onboarding.md)
- [Provisioned Throughput Units (PTU) getting started guide](./provisioned-get-started.md) 
