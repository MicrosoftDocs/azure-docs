---
title: Azure OpenAI Service performance & latency
titleSuffix: Azure OpenAI
description: Learn about performance and latency with Azure OpenAI
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: how-to
ms.date: 11/21/2023
author: mrbullwinkle 
ms.author: mbullwin
recommendations: false
ms.custom:
---

# Performance and latency

This article will provide you with background around how latency works with Azure OpenAI and how to optimize your environment to improve performance.

## What is latency?

The high level definition of latency in this context is the amount of time it takes to get a response back from the model. For completion and chat completion requests, latency is largely dependent on model type as well as the number of tokens generated and returned.The number of tokens sent to the model as part of the input token limit, has a much smaller overall impact on latency.

## Completions and chat completions

### Model selection

Latency varies based on what model you are using. For an identical request, it is expected that `gpt-35-turbo` models will have a faster response, and therefore less latency than the first generation of `gpt-4` models.

|Model|Relative Latency (fastest🚀 to slowest🐢)|
|---|:---|
|`babbage-002` (fine-tuned)|🚀🚀🚀🚀🚀🚀🚀🚀  |
| `gpt-35-turbo` (1106) |  🚀🚀🚀🚀🚀🚀🚀   |
| `gpt-4` (1106-preview) | 🚀🚀🚀🚀🚀🚀 |
| `gpt-35-turbo-instruct`| 🚀🚀🚀🚀🚀  |
| `gpt-35-turbo` (0314-0613) |🚀🚀🚀🚀  |
| `davinci-002`(fine-tuned) |🚀🚀🚀 
| `gpt-35-turbo-16k` | 🚀🚀🚀 |
| `gpt-4` (0314-0613) | 🚀🚀 |
| `gpt-4-32k` (0314-0613) |🐢🚀 |

If you are concerned about latency model selection is extremely important. You need to balance your needs around model capabilities, quality of response, cost, and overall latency. Depending on your use case a smaller well trained fine-tuned model like `babbage-002` may be able to offer the best overall experience. But creating a high quality fine-tuned model comes with additional costs as well as complexity.  

<!--
Questions:
1. Can we provide an ordered list of models from fastest to slowest from a latency perspective? 
2. Is it possible to have noticable regional differences between model latency in the sense of in Region A model is running on A100s, whereas in Region B the identical model is running on H100's. Is each class of model always running on the same speed underlying hardware? 
 -->

### Max tokens and stop sequences

When you send a completion request to the Azure OpenAI endpoint your input text is converted to tokens which are then sent to your deployed model. The model receives the input tokens and then begins generating a response. It's an iterative sequential process, one token at a time. Another way to think of it is like a for loop with `n tokens = n iterations`.

So another important factor when evaluating latency is how many tokens are being generated. This is controlled largely via the `max_tokens` parameter as well as with `stop` sequences. Reducing the number of tokens generated per request will reduce the latency of each request.
<!--
Question:
1. What is the default max_token value for each model spec says 16 is default but does this vary?
 -->

### Streaming

Streaming impacts preceived latency. If you have streaming enabled you'll receive tokens back in chunks as soon as they're available. From a user perspective this can feel like the model is responding faster even though the overall time to complete the request remains the same.

If streaming is disabled, you won't receive any tokens until the model has finished the entire response. While you do have the ability to choose to enable or disable streaming from an API to client response perspective, technically the model itself is always streaming its response.

### Content filtering

[Content filtering](../concepts/content-filter.md) and other content safety related features within Azure OpenAI increase latency. There are many applications where this tradeoff in performance is necessary, however there are certain lower risk use cases where modifying the content filters to improve performance might be worth exploring.

Learn more about requesting modifications to the default, [content filtering policies](./content-filters.md).

<!--
Question:

1. I have heard about deferred safety in shiproom? (Is this released for Azure OpenAI 3P, how do customers access this?)
2. If I set content filtering to high only does this improve latency or is this ultimately the same whereby latency is only improved if content filtering is off altogether or deferred safety is used?
 -->

### best_of & n parameters

**best_of** & **n**: parameters can greatly increase latency if they're configured to generate multiple outputs. Setting these parameters to values greater than 1, creates increased latency.

### Quota and rate limits

[Quota and rate limits](./quota.md) can play a huge role in the overall request latency you experience.

If you have insufficient [quota](./quota.md) to meet your peak usage requirements this creates a situation where it appears that the model is taking longer to respond, when in reality the model response time itself is remaining the same, but some percentage of calls to the model are not being delivered and are then retried until your traffic drops back below the rate limit thresholds.

The default behavior for the `0.28.1` OpenAI Python API library was to generate a failure message when the rate limit was reached. Whereas the new `1.x` Python API library, and the Azure OpenAI SDK's for C#, Java, JavaScript, and Go, will initially all fail silently when `HTTP 429 (Too many requests)` errors occur and then retry sending the request multiple times.

This means that if you are measuring overall latency of your Azure OpenAI requests, but not also measuring how many `HTTP 429`'s are occuring you are getting an incomplete picture of what is creating latency in your application.

<!--
Question:
1. I was told by Mona don't use blocked calls this metric is inaccurate, but when I test blocked calls is the only thing recording 429's
2. New Metric is not recording 429's?
 -->

If you find that maxing out standard quota is not sufficient for your performance needs, you may need to explore [provisioned throughout](../concepts/provisioned-throughput.md) which provides a more stable latency experience.

### Regional availabilty

Azure OpenAI models are available in datacenters around the world. While the geographic distance between client and endpoint is not a major contributor to latency different regions have different max quota allocations available and so it may be possible to [reduce latency by migrating to a different region](../quotas-limits.md).

## Summary

* **Model latency**: Some models are faster than others. Experiment with using different models to see if a faster model is appropriate for your use case.

* **Lower max tokens**: OpenAI has found that even in cases where the total number of tokens generated is similar the request with the higher value set for the max token parameter will have more latency.

* **Lower total tokens generated**: The fewer tokens generated the faster the overall response will be. Remember this is like having a for loop with `n tokens = n iterations`. Lower the number of tokens generated and overall response time will improve accordingly.

* **Streaming**: Enabling streaming can be useful in managing user expectations in certain situations by allowing the user to see the model response as it is being generated rather than having to wait until the last token is ready. While the last token will still take just as long to be generated.

* **Regional availability**: Azure OpenAI is available in multiple regions globally. Evaluate which regions best fit your needs based both on [region specific default TPM/RPM limits](../quotas-limits.md) as well as the round trip latency between your client traffic and a given endpoint.  

* **Content Filtering** impacts latency. Evaluate if any of your workloads would benefit from [modified content filtering policies](./content-filters.md).

* **best_of** & **n**: parameters can greatly increase latency if they're configured to generate multiple outputs, which occurs when these parameters are set to values greater than 1.

* **Audit blocked call** frequency in **Metrics**. Split by **RatelimitKey** and **Region** to identify specific model deployments that are impacted.

* **Configure [Diagnostic Settings](/azure/ai-services/openai/how-to/monitoring#configure-diagnostic-settings)** across your Azure OpenAI resources to enable consolidated in-depth reporting with Log Analytics workspaces.

* **Use [quota management](/azure/ai-services/openai/how-to/quota?tabs=rest)** to increase TPM on deployments with high traffic, and to reduce TPM on deployments with limited needs.

* **Implement retry logic in your application** if it is not already present. But when diagnosing performance issues, you should also take into account your client SDK's currently configured retry behavior as it may improve the user experience while masking an underlying rate limit issue.

* **Avoid sharp changes in the workload**. Increase the workload gradually.

* **Test different load increase patterns**.
