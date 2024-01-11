---
title: Azure OpenAI Service performance & latency
titleSuffix: Azure OpenAI
description: Learn about performance and latency with Azure OpenAI
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 11/21/2023
author: mrbullwinkle 
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Performance and latency

This article will provide you with background around how latency works with Azure OpenAI and how to optimize your environment to improve performance.

## Understanding throughput vs latency
There are two key concepts to think about when sizing an application: (1) System level throughput and (2) Per-call response times (aka. Latency). We’ll walk through both separately 

### System level throughput
This looks at the overall capacity of your deployment – how many requests per minute and total tokens that can be processed.

For a standard deployment, this is set by the amount of quota assigned to your deployement. However, quota determiens the admission logic for calls to the deployment and is not directly enforcing throughput. Due to per-call latency variations, you may not be able to achieve throughput as high as your quota. [Learn more on managing quota](./quota.md).

In a provisioned deployment, we allocate a set amount of model processing capacity for your endpoint. The amount of throughput that you can achieve on the endpoint is a factor of the input size, output size, call rate and cache match rate. The number of concurrent calls and total tokens processed can vary significantly based on these values. The most accurate way to assess this for Provisioned-Managed is as follows:

1.	Use the Capacity calculator for a sizing estimate. The calculator assumes no cache match and will be a conservative estimate.

2.	Benchmark the load using real traffic workload. Measure the utilization & tokens processed metrics from Azure Monitor. Run for an extended period. We have created an initial benchmarking script which uses synthetic data and can be found on GitHub here: https://aka.ms/aoai/benchmarking. This can be extended to use your own data and workload characteristics, which will be the most accurate. 
Here are a few examples for GPT-4 0613 model:

| Prompt  Size (tokens) |	Generation size (tokens) |	Calls per minute |	PTUs required |
| -- | -- | -- | -- |
| 800	 | 150 |	30 |	100 |
| 1000 |	50 |	300	| 700 |
| 5000 |	100 | 	50 |	600 |

Once you have assessed the number of PTUs that are required for a given workload you can expect the number of PTUs to scale roughly linearly with call rate (may be slightly sub-linear ).


### Latency: The per-call response times 

The high level definition of latency in this context is the amount of time it takes to get a response back from the model. For completion and chat completion requests, latency is largely dependent on model type as well as the number of tokens generated and returned. The number of tokens sent to the model as part of the input token limit, has a much smaller overall impact on latency.

Estimating your expected per-call latency can be challenging with these models. Latency of a completion request is driven by four factors: (1) the model, (2) the number of tokens in the prompt, (3) the number of tokens generated, and (4) the overall load on the deployment & system. The overall time is driven primarily by 1 and 3. The next section goes into more details on the anatomy of a large language model inference call.

## Improve performance
There are several factors which you can control to improve per-call latency of your application.

### Model selection

Latency varies based on what model you are using. For an identical request, it is expected that different models will have a different latency. If your use case requires the lowest latency models with the fastest response times we recommend the latest models in the [GPT-3.5 Turbo model series](../concepts/models.md#gpt-35-models).

### Generation size and Max tokens

When you send a completion request to the Azure OpenAI endpoint your input text is converted to tokens which are then sent to your deployed model. The model receives the input tokens and then begins generating a response. It's an iterative sequential process, one token at a time. Another way to think of it is like a for loop with `n tokens = n iterations`. For most models, generating the response is the slowest step in the process.  

At the time of the request the requested generation size (max_tokens parameter) is used as an initial estimate of the generation size. The compute-time for generating the full size is then reserved by the model as the request is processed. Once the generation is completed, the remaining quota is released. Ways to reduce the number of tokens:
o	Set the `max_token` parameter on each call as small as possible.
o	Include stop sequences to prevent generating extra content. 
o	Generate fewer responses: best_of & n: parameters can greatly increase latency if they're configured to generate multiple outputs, which occurs when these parameters are set to values greater than 1.

Reducing the number of tokens generated per request will reduce the latency of each request.

### Streaming

**Examples of when to use streaming**:

Chat bots and conversational interfaces.

Streaming impacts perceived latency. If you have streaming enabled you'll receive tokens back in chunks as soon as they're available. From a user perspective, this often feels like the model is responding faster even though the overall time to complete the request remains the same.

**Examples of when streaming is less important**:

Sentiment analysis, language translation, content generation.

There are many use cases where you are performing some bulk task where you only care about the finished result, not the real-time response. If streaming is disabled, you won't receive any tokens until the model has finished the entire response.

### Content filtering

Azure OpenAI includes a [content filtering system](./content-filters.md) that works alongside the core models. This system works by running both the prompt and completion through an ensemble of classification models aimed at detecting and preventing the output of harmful content.

The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.

The addition of content filtering comes with an increase in safety, but also latency. There are many applications where this tradeoff in performance is necessary, however there are certain lower risk use cases where disabling the content filters to improve performance might be worth exploring.

Learn more about requesting modifications to the default, [content filtering policies](./content-filters.md).


### Separation of workloads
Mixing different workloads on the same endpoint can negatively impact latency. This is because (1) they are batched together during inference and short calls can be waiting for longer completions and (2) mixing the calls can reduce your cache hit rate as they are both competing for the same space. When possible, it is recommended to have separate deployments for each workload.

### Prompt Size
While prompt size has smaller impact to latency than the gereration size it will impact the overall time, especially when the size grows very large. 

### Batching
If you are sending multiple requests to the same endpoint, you can batch the requests into a single call. This will reduce the number of requests you need to make and depending on the scenario it may improve overall response time. We recommend testing this method to see if it helps. 

## How to measure your throughput
We recommend measuring your overall throughput on a deployment with two measures:
-	Calls per minute: The number of API inference calls you are making per minute. This can be measured in Azure-monitor using the Azure OpenAI Requests metric and splitting by the ModelDeploymentName
-	Total Tokens per minute: The total number of tokens being processed per minute by your deployment. This includes prompt & generated tokens. This is often further split into measuring both for a deeper understanding of deployment performance. This can be measured in Azure-Monitor using the Processed Inference tokens metric. 

You can learn more about [Monitoring the Azure OpenAI Service](./monitoring.md).

## How to measure per-call latency
The time it takes for each call depends on how long it takes to read the model, generate the output, and apply content filters. The way you measure the time will vary if you are using streaming or not. We suggest a different set of measures for each case. 

You can learn more about [Monitoring the Azure OpenAI Service](./monitoring.md).

### Non-Streaming:
-	 End-to-end Request Time: The total time taken to generate the entire response for non-streaming requests, as measured by the API gateway. This number increases as prompt and generation size increases.

### Streaming:
-	Time to Response: Recommended latency (responsiveness) measure for streaming requests. Applies to PTU and PTU-managed deployments. Calculated as time taken for the first response to appear after a user sends a prompt, as measured by the API gateway. This number increases as the prompt size increases and/or 	 hit size reduces.
-	Average Token Generation Rate
Time from the first token to the last token, divided by the number of generated tokens, as measured by the API gateway. This measures the speed of response generation and increases as the system load increases. Recommended latency measure for streaming requests.



## Summary

* **Model latency**: If model latency is important to you we recommend trying out our latest models in the [GPT-3.5 Turbo model series](../concepts/models.md).

* **Lower max tokens**: OpenAI has found that even in cases where the total number of tokens generated is similar the request with the higher value set for the max token parameter will have more latency.

* **Lower total tokens generated**: The fewer tokens generated the faster the overall response will be. Remember this is like having a for loop with `n tokens = n iterations`. Lower the number of tokens generated and overall response time will improve accordingly.

* **Streaming**: Enabling streaming can be useful in managing user expectations in certain situations by allowing the user to see the model response as it is being generated rather than having to wait until the last token is ready.

* **Content Filtering** improves safety, but it also impacts latency. Evaluate if any of your workloads would benefit from [modified content filtering policies](./content-filters.md).