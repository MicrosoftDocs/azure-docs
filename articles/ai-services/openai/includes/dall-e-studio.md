---
title: 'Quickstart: Use Azure OpenAI Service image generation in Azure OpenAI Studio'
titleSuffix: Azure OpenAI
description: Learn how to get started with Azure OpenAI image generation in Azure OpenAI Studio. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 08/08/2023
keywords: 
---

Use this guide to get started generating images with Azure OpenAI in your browser.

> [!NOTE]
> The image generation API creates an image from a text prompt. It doesn't edit existing images or create variations.

## Prerequisites

- An Azure subscription. You can [create a free account](https://azure.microsoft.com/free/cognitive-services).
- Access granted to DALL-E in the desired Azure subscription.
    Currently, you must submit an application to access Azure OpenAI Service. To apply for access, complete [this form](https://aka.ms/oai/access). Existing Azure OpenAI customers need to resubmit the form to receive access to DALL-E. If you need assistance, open an issue on this repo to contact Microsoft.
- An Azure OpenAI resource created in the East US region. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Go to Azure OpenAI Studio

To access Azure OpenAI Studio, browse to https://oai.azure.com/ and sign in with the credentials associated with your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure OpenAI Studio landing page, select **DALL·E (Preview) playground** to use the image generation APIs.

## Try out image generation

Start exploring Azure OpenAI capabilities with a no-code approach through the DALL·E (Preview) playground. Enter your image prompt into the text box and select **Generate**. When the AI-generated image is ready, it appears on the page.

> [!NOTE]
> The image generation APIs come with a content moderation filter. If Azure OpenAI recognizes your prompt as harmful content, it doesn't return a generated image. For more information, see the [content filter](../concepts/content-filter.md) guide.

:::image type="content" source="../media/quickstarts/dall-e-studio.png" alt-text="Screenshot of the Azure OpenAI Studio landing page showing the DALL·E (Preview) playground with generated images of polar bears." lightbox="../media/quickstarts/dall-e-studio.png":::

In the DALL·E (Preview) playground, you can also view Python and cURL code samples, which are prefilled according to your settings. Select **View code** near the top of the page. You can use this code to write an application that completes the same task.

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in this [Azure OpenAI overview](../overview.md).
* Try examples in the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
