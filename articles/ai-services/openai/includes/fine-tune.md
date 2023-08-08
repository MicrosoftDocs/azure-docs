---
title: Fine-tuning inactivity guidance
titleSuffix: Azure OpenAI
description: Fine-tuning inactivity guidance
author: mrbullwinkle 
ms.author: mbullwin 
ms.service: cognitive-services
ms.topic: include
ms.date: 04/05/2023
manager: nitinme
keywords: ChatGPT

---

> [!IMPORTANT]
> After a customized model is deployed, if at any time the deployment remains inactive for greater than fifteen (15) days, the deployment will automatically be deleted. The deployment of a customized model is “inactive” if the model was deployed more than fifteen (15) days ago and no completions or chat completions calls were made to it during a continuous 15-day period. The deletion of an inactive deployment does **NOT** delete or affect the underlying customized model, and the customized model can be redeployed at any time. As described in [Azure OpenAI Service pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/), each customized (fine-tuned) model that is deployed incurs an hourly hosting cost regardless of whether completions or chat completions calls are being made to the model. To learn more about planning and managing costs with Azure OpenAI, refer to our [cost management guide](../how-to/manage-costs.md#base-series-and-codex-series-fine-tuned-models). 
