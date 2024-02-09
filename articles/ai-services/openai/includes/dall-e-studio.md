---
title: 'Quickstart: Generate images with Azure OpenAI Service and Azure OpenAI Studio'
titleSuffix: Azure OpenAI
description: Learn how to generate images with Azure OpenAI Service in the DALL-E playground (Preview) in Azure OpenAI Studio.
#services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 08/08/2023
keywords:
---

Use this guide to get started generating images with Azure OpenAI in your browser.

## Prerequisites

#### [DALL-E 3](#tab/dalle3)

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to DALL-E in the desired Azure subscription.
- An Azure OpenAI resource created in the `SwedenCentral` region.
- Then, you need to deploy a `dalle3` model with your Azure resource. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

#### [DALL-E 2](#tab/dalle2)

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to DALL-E in the desired Azure subscription.
- An Azure OpenAI resource created in the `EastUS` region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

---

> [!NOTE]
> Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). If you need assistance, open an issue on this repo to contact Microsoft.

## Go to Azure OpenAI Studio

Browse to [Azure OpenAI Studio](https://oai.azure.com/) and sign in with the credentials associated with your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

#### [DALL-E 3](#tab/dalle3)

From the Azure OpenAI Studio landing page, select **DALL·E playground (Preview)** to use the image generation APIs. Select **Settings** near the top of the page and confirm that the **Deployment** dropdown has your DALL-E 3 deployment selected.

#### [DALL-E 2](#tab/dalle2)

From the Azure OpenAI Studio landing page, select **DALL·E playground (Preview)** to use the image generation APIs. Select **Settings** near the top of the page and confirm that the **Deployment** dropdown has the default **DALL-E 2** choice selected.

---

## Try out image generation

Start exploring Azure OpenAI capabilities with a no-code approach through the **DALL·E playground (Preview)**. Enter your image prompt into the text box and select **Generate**. When the AI-generated image is ready, it appears on the page.

> [!NOTE]
> The image generation APIs come with a content moderation filter. If Azure OpenAI recognizes your prompt as harmful content, it doesn't return a generated image. For more information, see [Content filtering](../concepts/content-filter.md).

:::image type="content" source="../media/quickstarts/dall-e-studio.png" alt-text="Screenshot of the Azure OpenAI Studio landing page showing the DALL-E playground (Preview) with generated images of polar bears." lightbox="../media/quickstarts/dall-e-studio.png":::

In the **DALL·E playground (Preview)**, you can also view Python and cURL code samples, which are prefilled according to your settings. Select **View code** near the top of the page. You can use this code to write an application that completes the same task.

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in this [Azure OpenAI overview](../overview.md).
* Try examples in the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
* See the [API reference](../reference.md#image-generation)
