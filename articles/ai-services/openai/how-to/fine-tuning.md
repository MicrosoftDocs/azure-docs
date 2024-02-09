---
title: 'Customize a model with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI Service by using Python, the REST APIs, or Azure OpenAI Studio.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: build-2023, build-2023-dataai, devx-track-python
ms.topic: how-to
ms.date: 10/12/2023
author: mrbullwinkle
ms.author: mbullwin
zone_pivot_groups: openai-fine-tuning
keywords: 
---

# Customize a model with fine-tuning

Azure OpenAI Service lets you tailor our models to your personal datasets by using a process known as *fine-tuning*. This customization step lets you get more out of the service by providing:

- Higher quality results than what you can get just from [prompt engineering](../concepts/prompt-engineering.md)
- The ability to train on more examples than can fit into a model's max request context limit.
- Lower-latency requests, particularly when using smaller models.

A fine-tuned model improves on the few-shot learning approach by training the model's weights on your own data. A customized model lets you achieve better results on a wider number of tasks without needing to provide examples in your prompt. The result is less text sent and fewer tokens processed on every API call, potentially saving cost and improving request latency.

::: zone pivot="programming-language-studio"

[!INCLUDE [Studio fine-tuning](../includes/fine-tuning-studio.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK fine-tuning](../includes/fine-tuning-python.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API fine-tuning](../includes/fine-tuning-rest.md)]

::: zone-end
