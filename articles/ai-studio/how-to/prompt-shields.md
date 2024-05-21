---
title: "Prompt Shields in Azure AI Studio (preview)"
titleSuffix: Azure AI services
description: Use Azure AI Studio to detect large language model input attack risks and mitigate risk with Azure AI Content Safety.
services: ai-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.topic: quickstart
ms.date: 05/10/2024
ms.author: pafarley
---

# Prompt Shields (preview)
[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Learn how to use Azure AI Content Safety Prompt Shields to check large language model (LLM) inputs for both User Prompt attacks and Document attacks.

## Prerequisites

* An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/) 
* Once you have your Azure subscription, <a href="https://aka.ms/acs-create"  title="Create a Content Safety resource"  target="_blank">create a Content Safety resource </a> in the Azure portal to get your key and endpoint. Enter a unique name for your resource, select your subscription, and select a resource group, supported region (East US or West Europe), and supported pricing tier. Then select **Create**.
* An [AI Studio hub](../how-to/create-azure-ai-resource.md) in Azure AI Studio. 

## Setting up

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select the hub you'd like to work in.
1. On the left nav menu, select **AI Services**. Select the **Content Safety** panel.
   :::image type="content" source="../media/content-safety/select-panel.png" alt-text="Screenshot of the Azure AI Studio Content Safety panel selected." lightbox="../media/content-safety/select-panel.png":::
1. Then, select **Prompt Shields**.
1. On the next page, in the drop-down menu under **Try it out**, select the **Azure AI Services** connection you want to use.

## Analyze prompt attacks

Either select a sample scenario or write your own inputs in the text boxes provided. Prompt Shields analyzes both the user prompt and any documents included with the prompt for potential attacks.

Select **Run test** to get the result.

## Next steps

Configure content filters for each provided category to match your use case.

> [!div class="nextstepaction"]
> [Content filters](../concepts/content-filtering.md)