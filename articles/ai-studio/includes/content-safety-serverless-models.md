---
title: Include file
description: Include file
ms.service: azure-ai-studio
ms.topic: include
ms.date: 07/12/2024
ms.author: mopeakande
author: msakande
ms.reviewer: osiotugo
reviewer: ositanachi
ms.custom: include file

# Also used in Azure Machine Learning documentation
---

For language models deployed via serverless APIs, Azure AI implements a default configuration of [Azure AI Content Safety](/azure/ai-services/content-safety/overview) text moderation filters that detect harmful content such as hate, self-harm, sexual, and violent content. To learn more about content filtering (preview), see [Harm categories in Azure AI Content Safety](/azure/ai-services/content-safety/concepts/harm-categories).

> [!TIP]
> Content filtering (preview) is not available for certain model types that are deployed via serverless APIs. These model types include embedding models and time series models.

Content filtering (preview) occurs synchronously as the service processes prompts to generate content. You might be billed separately according to [Azure AI Content Safety pricing](https://azure.microsoft.com/pricing/details/cognitive-services/content-safety/) for such use. You can disable content filtering (preview) for individual serverless endpoints either:

- At the time when you first deploy a language model
- Later, by selecting the content filtering toggle on the deployment details page

Suppose you decide to use an API other than the [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api) to work with a model that's deployed via a serverless API. In such a situation, content filtering (preview) isn't enabled unless you implement it separately by using Azure AI Content Safety.

To get started with Azure AI Content Safety, see [Quickstart: Analyze text content](/azure/ai-services/content-safety/quickstart-text). If you don't use content filtering (preview) when working with models that are deployed via serverless APIs, you run a higher risk of exposing users to harmful content.
