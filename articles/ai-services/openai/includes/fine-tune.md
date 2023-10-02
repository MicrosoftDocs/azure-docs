---
title: Fine-tuning inactivity guidance
titleSuffix: Azure OpenAI
description: Describes the fine-tuning guidance for a model deployment that's inactive for more than 15 days.
author: mrbullwinkle 
ms.author: mbullwin 
ms.service: cognitive-services
ms.topic: include
ms.date: 09/01/2023
manager: nitinme
keywords: ChatGPT

---

> [!IMPORTANT]
> After you deploy a customized model, if at any time the deployment remains inactive for greater than fifteen (15) days,
> the deployment is deleted. The deployment of a customized model is _inactive_ if the model was deployed more than fifteen (15) days ago
> and no completions or chat completions calls were made to it during a continuous 15-day period.
>
> The deletion of an inactive deployment doesn't delete or affect the underlying customized model,
> and the customized model can be redeployed at any time.
> As described in [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/),
> each customized (fine-tuned) model that's deployed incurs an hourly hosting cost regardless of whether completions
> or chat completions calls are being made to the model. To learn more about planning and managing costs with Azure OpenAI,
> refer to the guidance in [Plan to manage costs for Azure OpenAI Service](../how-to/manage-costs.md#base-series-and-codex-series-fine-tuned-models).