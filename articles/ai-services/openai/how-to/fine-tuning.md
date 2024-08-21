---
title: 'Customize a model with Azure OpenAI Service'
titleSuffix: Azure OpenAI
description: Learn how to create your own customized model with Azure OpenAI Service by using Python, the REST APIs, or Azure OpenAI Studio.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom: build-2023, build-2023-dataai, devx-track-python
ms.topic: how-to
ms.date: 08/02/2024
author: mrbullwinkle
ms.author: mbullwin
zone_pivot_groups: openai-fine-tuning-new
---

# Customize a model with fine-tuning

Azure OpenAI Service lets you tailor our models to your personal datasets by using a process known as *fine-tuning*. This customization step lets you get more out of the service by providing:

- Higher quality results than what you can get just from [prompt engineering](../concepts/prompt-engineering.md)
- The ability to train on more examples than can fit into a model's max request context limit.
- Token savings due to shorter prompts
- Lower-latency requests, particularly when using smaller models.

In contrast to few-shot learning, fine tuning improves the model by training on many more examples than can fit in a prompt, letting you achieve better results on a wide number of tasks. Because fine tuning adjusts the base model’s weights to improve performance on the specific task, you won’t have to include as many examples or instructions in your prompt. This means less text sent and fewer tokens processed on every API call, potentially saving cost, and improving request latency.

We use LoRA, or low rank approximation, to fine-tune models in a way that reduces their complexity without significantly affecting their performance. This method works by approximating the original high-rank matrix with a lower rank one, thus only fine-tuning a smaller subset of "important" parameters during the supervised training phase, making the model more manageable and efficient. For users, this makes training faster and more affordable than other techniques.

::: zone pivot="programming-language-studio"

[!INCLUDE [Azure OpenAI Studio fine-tuning](../includes/fine-tuning-studio.md)]

::: zone-end

::: zone pivot="programming-language-ai-studio"

[!INCLUDE [AI Studio fine-tuning](../includes/fine-tuning-openai-in-ai-studio.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK fine-tuning](../includes/fine-tuning-python.md)]

::: zone-end

::: zone pivot="rest-api"

[!INCLUDE [REST API fine-tuning](../includes/fine-tuning-rest.md)]

::: zone-end

## Troubleshooting

### How do I enable fine-tuning? Create a custom model is greyed out in Azure OpenAI Studio?

In order to successfully access fine-tuning, you need **Cognitive Services OpenAI Contributor assigned**. Even someone with high-level Service Administrator permissions would still need this account explicitly set in order to access fine-tuning. For more information, please review the [role-based access control guidance](/azure/ai-services/openai/how-to/role-based-access-control#cognitive-services-openai-contributor).

### Why did my upload fail?

If your file upload fails in Azure OpenAI Studio, you can view the error message under “data files” in Azure OpenAI Studio. Hover your mouse over where it says “error” (under the status column) and an explanation of the failure will be displayed.

:::image type="content" source="../media/fine-tuning/error.png" alt-text="Screenshot of fine-tuning error message." lightbox="../media/fine-tuning/error.png":::

### My fine-tuned model does not seem to have improved

- **Missing system message:** You need to provide a system message when you fine tune; you will want to provide that same system message when you use the fine-tuned model. If you provide a different system message, you may see different results than what you fine-tuned for.

- **Not enough data:** while 10 is the minimum for the pipeline to run, you need hundreds to thousands of data points to teach the model a new skill. Too few data points risks overfitting and poor generalization. Your fine-tuned model may perform well on the training data, but poorly on other data because it has memorized the training examples instead of learning patterns. For best results, plan to prepare a data set with hundreds or thousands of data points.

- **Bad data:** A poorly curated or unrepresentative dataset will produce a low-quality model. Your model may learn inaccurate or biased patterns from your dataset. For example, if you are training a chatbot for customer service, but only provide training data for one scenario (e.g. item returns) it will not know how to respond to other scenarios. Or, if your training data is bad (contains incorrect responses), your model will learn to provide incorrect results.

## Next steps

- Explore the fine-tuning capabilities in the [Azure OpenAI fine-tuning tutorial](../tutorials/fine-tune.md).
- Review fine-tuning [model regional availability](../concepts/models.md#fine-tuning-models)
- Learn more about [Azure OpenAI quotas](../quotas-limits.md)
