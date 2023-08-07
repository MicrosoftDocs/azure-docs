---
title: 'How to customize a model with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.custom: build-2023, build-2023-dataai, devx-track-python
ms.topic: how-to
ms.date: 04/05/2023
author: ChrisHMSFT
ms.author: chrhoder
zone_pivot_groups: openai-fine-tuning
keywords: 
---
# Learn how to customize a model for your application

Azure OpenAI Service lets you tailor our models to your personal datasets using a process known as *fine-tuning*. This customization step will let you get more out of the service by providing:

- Higher quality results than what you can get just from prompt design
- The ability to train on more examples than can fit into a prompt
- Lower-latency requests
 
A customized model improves on the few-shot learning approach by training the model's weights on your specific prompts and structure. The customized model lets you achieve better results on a wider number of tasks without needing to provide examples in your prompt. The result is less text sent and fewer tokens processed on every API call, saving cost and improving request latency.

> [!NOTE]
> There is a breaking change in the `create` fine tunes command in the latest 12-01-2022 GA API. For the latest command syntax consult the [reference documentation](/rest/api/cognitiveservices/azureopenaistable/fine-tunes/create)

::: zone pivot="programming-language-studio"

[!INCLUDE [Studio fine-tuning](../includes/fine-tuning-studio.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK fine-tuning](../includes/fine-tuning-python.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API fine-tuning](../includes/fine-tuning-rest.md)]

::: zone-end
