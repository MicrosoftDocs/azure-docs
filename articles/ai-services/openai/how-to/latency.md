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

## What is latency?

The high level definition of latency in this context is the amount of time it takes to get a response back from the model. For completion and chat completion requests, latency is largely dependent on model type as well as the number of tokens generated and returned.The number of tokens sent to the model as part of the input token limit, has a much smaller overall impact on latency.

## Completions and chat completions

### Model selection

Latency varies based on what model you are using. For an identical request, it is expected that different models will have a different latency. If your use case requires the lowest latency models with the fastest response times we recommend the latest models in the [GPT-3.5 Turbo model series](../concepts/models.md#gpt-35-models).

### Max tokens

When you send a completion request to the Azure OpenAI endpoint your input text is converted to tokens which are then sent to your deployed model. The model receives the input tokens and then begins generating a response. It's an iterative sequential process, one token at a time. Another way to think of it is like a for loop with `n tokens = n iterations`.

So another important factor when evaluating latency is how many tokens are being generated. This is controlled largely via the `max_tokens` parameter. Reducing the number of tokens generated per request will reduce the latency of each request.

### Streaming

**Examples when to use streaming**:

Chat bots and conversational interfaces.

Streaming impacts preceived latency. If you have streaming enabled you'll receive tokens back in chunks as soon as they're available. From a user perspective this can feel like the model is responding faster even though the overall time to complete the request remains the same.

**Examples when streaming is less important**:

Sentiment analysis, language translation, content generation.

There are many use cases where you are performing some bulk task where you only care about the finished result, not the real-time response. If streaming is disabled, you won't receive any tokens until the model has finished the entire response. While you do have the ability to choose to enable or disable streaming from an API to client response perspective, technically the model itself is always streaming its response.

### Content filtering

Azure OpenAI includes a [content filtering system](./content-filters.md) that works alongside core models. This system works by running both the prompt and completion through an ensemble of classification models aimed at detecting and preventing the output of harmful content.

The content filtering system detects and takes action on specific categories of potentially harmful content in both input prompts and output completions.

The addition of content filtering comes with an increase in safety, but also latency.There are many applications where this tradeoff in performance is necessary, however there are certain lower risk use cases where disabling the content filters to improve performance might be worth exploring.

Learn more about requesting modifications to the default, [content filtering policies](./content-filters.md).

## Summary

* **Model latency**: If model latency is important to you we recommend trying out our latest latest models in the [GPT-3.5 Turbo model series](../concepts/models.md).

* **Lower max tokens**: OpenAI has found that even in cases where the total number of tokens generated is similar the request with the higher value set for the max token parameter will have more latency.

* **Lower total tokens generated**: The fewer tokens generated the faster the overall response will be. Remember this is like having a for loop with `n tokens = n iterations`. Lower the number of tokens generated and overall response time will improve accordingly.

* **Streaming**: Enabling streaming can be useful in managing user expectations in certain situations by allowing the user to see the model response as it is being generated rather than having to wait until the last token is ready.

* **Content Filtering** improves safety, but it also impacts latency. Evaluate if any of your workloads would benefit from [modified content filtering policies](./content-filters.md).