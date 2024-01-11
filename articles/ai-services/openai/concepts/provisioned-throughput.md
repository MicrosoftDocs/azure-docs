---
title: Azure OpenAI Service provisioned throughput
description: Learn about provisioned throughput and Azure OpenAI. 
ms.service: azure-ai-openai
ms.topic: conceptual 
ms.date: 11/20/2023
ms.custom: 
manager: nitinme
author: mrbullwinkle #ChrisHMSFT
ms.author: mbullwin #chrhoder
recommendations: false
keywords: 
---

# What is provisioned throughput?

The provisioned throughput capability allows you to specify the amount of throughput you require for your deployment. The service then provisions the necessary model processing capacity and ensures it is ready for you. Throughput is defined in terms of provisioned throughput units (PTU) which is a normalized way of representing an amount of throughput for your deployment. Each model-version pair requires different amounts of PTU to deploy and provide different amounts of throughput per PTU.

## What does the provisioned deployment type provide?

- **Predictable performance:** stable max latency and throughput for uniform workloads. 
- **Reserved processing capacity:** A deployment configures the amount of throughput. Once deployed, the throughput is available whether used or not.
- **Cost savings:** High throughput workloads may provide cost savings vs token-based consumption.

An Azure OpenAI Deployment is a unit of management for a specific OpenAI Model. A deployment provides customer access to a model for inference and integrates additional features like Content Moderation ([See content moderation documentation](content-filter.md)).

> [!NOTE]
> Provisioned throughput unit(PTU) quota is different from standard quota in Azure OpenAI and are not available by default. To learn more about this offering contact your Microsoft Account Team.

## What do you get?

|Topic | Provisioned|
|---|---|
| What is it? | Provides guaranteed throughput at smaller increments than the existing provisioned offer. Deployments will have a consistent max latency for a given model-version |
| Who is it for? | Customers who want guaranteed throughput with minimal latency variance. |
| Quota | Provisioned-managed throughput Units for a given model |
| Latency | Max latency constrained from the model. Overall latency is a factor of call shape.  |
| Utilization | Provisioned-managed Utilization measure provided in Azure Monitor |
| Estimating size | Provided calculator in the studio & benchmarking script |

## Key concepts

### Provisioned throughput units

Provisioned throughput Units (PTU) are units of model processing capacity that customers you can reserve and deploy for processing prompts and generating completions. The minimum PTU deployment, increments, and processing capacity associated with each unit varies by model type & version.

### Deployment types

We introduced a new deployment type called **ProvisionedManaged** which provides smaller increments of PTU per deployment. Both types have their own quota, and you will only see the options you have been enabled for.

### Quota

Provisioned throughput quota represents a specific amount of total throughput you can deploy. Quota in the Azure OpenAI Service is managed at the subscription level meaning that it can be consumed by different resources within that subscription.

Quota is specific to a (deployment type, mode, region) triplet and isn't interchangeable. Meaning you can't use quota for GPT-4 to deploy GPT-35-turbo. Customers can raise a support request to move the quota across deployment types, models, or regions but we can't guarantee that it will be possible.

While we make every attempt to ensure that quota is always deployable, quota does not represent a guarantee that the underlying capacity is available for the customer to use. The service assigns capacity to the customer at deployment time and if capacity is unavailable the deployment will fail with an out of capacity error.


### How utilization enforcement works
Provisioned deployments provide customers with an allocated amount of compute capacity to run a given model. The utilization of the deployment is measured by the ‘Provisioned-Managed Utilization’ metric in Azure Mmonitor. Provisioned-Managed deployments are also optimized to ensure so that calls accepted are met processed with a consistent per-call max latency. When the workload exceeds their its allocated capacity, the service we will return a 429 HTTP status code until the utilization drops down below 100%. The time before retrying is provided in the retry-after and retry-after-ms response headers which provide the time in seconds and milliseconds respectively.  This maintains ensures the per-call latency targets are maintained while giving the developer control over how to handle high-load situations – for example retry or divert to another experience/endpoint. 


#### What should  I do when I receive a 429 response?
When a 429 response indicates that is sent back it is because the allocated PTUs are fully consumed. The response includes the retry-after-ms and retry-after headers which tell you the time to wait before the next call will be accepted. How you choose to handle this depends on your application requirements. Here are some considerations:
-	You could consider re-directing the traffic to other models, deployments or experiences. This is the lowest-latency solution because this action can be taken as soon as you receive as you will get the 429 signal back right away.
-	If you are okay with longer per-call latencies, implement client-side retry logic to wait the retry-after-ms time and retry. This will provide you thelet you maximize your  highest amount of throughput per PTU.
The 429 signals is not an error signal, but instead part of the our design for how customers should managinge queuing and high load for provisioned deployments. Our goal with this approach is to enable the developers power over how to handle these situations in a way that best fits their application requirements. Any call accepted, will aim to be served within the per-call latency  targets outlined in the latency section below. When the deployed PTUs is fully utilized we will fast-respond with the 429 error response so that the client can make an decision on how to best handle.

The client libraries for the Azure OpenAI service include built-in capabilities for handling retries. 


#### How does the service decide when to send a 429?
We use a variation of the leaky bucket algorithm to maintain utilization below 100% while allowing some burstiness in the traffic. The high-level logic is as follows:
1.	Each customer has a set amount of capacity they can utilize on a deployment
2.	When a request is made:

    a.	If the current utilization is above 100% then a 429 signal will be sent with the `retry-after-ms` header set to the time until utilization is below 100%
     
    b.	Otherwise, the service estimates the additional capacity required to serve the request by combining prompt tokens and the specified max_tokens in the call. 

    d.	Otherwise, then the request will be processed and the estimated capacity is added to the current utilization.

3.	When a request finishes, we now know the actual compute cost for the call. To ensure an accurate accounting, we correct the utilization using the following logic:

    a.	If the actual > estimated, then the difference will be added to utilization
    b.	If the actual < estimated, then the difference will be subtracted. This effectively increases the throughput allowed by lowering the overall utilization

4.	The overall utilization is decremented down at a continuous rate based based on the amount of PTUs deployed. 

Since calls are accepted until utilization reaches 100% you are allowed to burst over 100% utilization when first increasing traffic. For sizeable calls and small sized deployments, you may then be over 100% utilization for up to several minutes.


:::image type="content" source="../media/provisioned/utilization.jpg" alt-text="Diagram showing how subsequent calls are added to the utilization." lightbox="../media/provisioned/utilization.jpg":::



## Next steps

- [Learn about the onboarding steps for provisioned deployments](../how-to/provisioned-throughput-onboarding.md)
- [Provisioned Throughput Units (PTU) getting started guide](./provisioned-get-started.md) 
