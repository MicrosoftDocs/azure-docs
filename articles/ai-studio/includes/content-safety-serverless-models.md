---
title: include file
description: include file
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

For language models deployed to MaaS, we implement a default configuration of [Azure AI Content Safety](/azure/ai-services/content-safety/overview) text moderation filters that detect harmful content such as hate, self-harm, sexual, and violent content. To learn more about content filtering (preview), see [harm categories in Azure AI Content Safety](/azure/ai-services/content-safety/concepts/harm-categories).

Content filtering (preview) occurs synchronously as the service processes prompts to generate content, and you might be billed separately as per [AACS pricing](https://azure.microsoft.com/pricing/details/cognitive-services/content-safety/) for such use. You can disable content filtering (preview) for individual serverless endpoints either at the time when you first deploy a language model or later in the deployment details page by selecting the content filtering toggle. If you use a model in MaaS via an API other than the [Azure AI Model Inference API](/azure/ai-studio/reference/reference-model-inference-api), content filtering isn't enabled. You have to implement it separately by using Azure AI Content Safety. For more information on how to get started with content safety, see [QuickStart: Analyze text content](/azure/ai-services/content-safety/quickstart-text). If you use a model in MaaS without content filtering, you run a higher risk of exposing users to harmful content. 