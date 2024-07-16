---
title: Azure OpenAI Service dynamic quota
titleSuffix: Azure AI services
description: Learn how to use Azure OpenAI dynamic quota
#services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 06/27/2024
ms.author: mbullwin
---


# Azure OpenAI Dynamic quota (Preview)

Dynamic quota is an Azure OpenAI feature that enables a standard (pay-as-you-go) deployment to opportunistically take advantage of more quota when extra capacity is available. When dynamic quota is set to off, your deployment will be able to process a maximum throughput established by your Tokens Per Minute (TPM) setting. When you exceed your preset TPM, requests will return HTTP 429 responses. When dynamic quota is enabled, the deployment has the capability to access higher throughput before returning 429 responses, allowing you to perform more calls earlier. The extra requests are still billed at the [regular pricing rates](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/).

Dynamic quota can only temporarily *increase* your available quota: it will never decrease below your configured value.

## When to use dynamic quota

Dynamic quota is useful in most scenarios, particularly when your application can use extra capacity opportunistically or the application itself is driving the rate at which the Azure OpenAI API is called.

Typically, the situation in which you might prefer to avoid dynamic quota is when your application would provide an adverse experience if quota is volatile or increased.

For dynamic quota, consider scenarios such as:

* Bulk processing,
* Creating summarizations or embeddings for Retrieval Augmented Generation (RAG),
* Offline analysis of logs for generation of metrics and evaluations,
* Low-priority research,
* Apps that have a small amount of quota allocated.

### When does dynamic quota come into effect?

The Azure OpenAI backend decides if, when, and how much extra dynamic quota is added or removed from different deployments. It isn't forecasted or announced in advance, and isn't predictable. To take advantage of dynamic quota, your application code must be able to issue more requests as HTTP 429 responses become infrequent. Azure OpenAI lets your application know when you've hit your quota limit by responding with an HTTP 429 and not letting more API calls through.

### How does dynamic quota change costs?

* Calls that are done above your base quota have the same costs as regular calls.

* There's no extra cost to turn on dynamic quota on a deployment, though the increased throughput could ultimately result in increased cost depending on the amount of traffic your deployment receives.

> [!NOTE]
> With dynamic quota, there is no call enforcement of a "ceiling" quota or throughput. Azure OpenAI will process as many requests as it can above your baseline quota. If you need to control the rate of spend even when quota is less constrained, your application code needs to hold back requests accordingly.

## How to use dynamic quota

To use dynamic quota, you must:

* Turn on the dynamic quota property in your Azure OpenAI deployment.
* Make sure your application can take advantage of dynamic quota.

### Enable dynamic quota

To activate dynamic quota for your deployment, you can go to the advanced properties in the resource configuration, and switch it on:

:::image type="content" source="../media/how-to/dynamic-quota/dynamic-quota.png" alt-text="Screenshot of advanced configuration UI for deployments." lightbox="../media/how-to/dynamic-quota/dynamic-quota.png":::

Alternatively, you can enable it programmatically with Azure CLI's [`az rest`](/cli/azure/reference-index?view=azure-cli-latest#az-rest&preserve-view=true):

Replace the `{subscriptionId}`, `{resourceGroupName}`, `{accountName}`, and `{deploymentName}` with the relevant values for your resource. In this case, `accountName` is equal to Azure OpenAI resource name.

```azurecli
az rest --method patch --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.CognitiveServices/accounts/{accountName}/deployments/{deploymentName}?2023-10-01-preview" --body '{"properties": {"dynamicThrottlingEnabled": true} }'
```

### How do I know how much throughput dynamic quota is adding to my app?

To monitor how it's working, you can track the throughput of your application in Azure Monitor. During the Preview of dynamic quota, there's no specific metric or log to indicate if quota has been dynamically increased or decreased.
dynamic quota is less likely to be engaged for your deployment if it runs in heavily utilized regions, and during peak hours of use for those regions.

## Next steps

* Learn more about how [quota works](./quota.md).
* Learn more about [monitoring Azure OpenAI](./monitoring.md).


