---
title: 'Quickstart: Use Azure OpenAI image generation with Azure OpenAI Studio'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI image generation in Azure OpenAI Studio. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 08/04/2023
keywords: 
---

Use this guide to get started generating images with Azure OpenAI in your browser.

> [!NOTE]
> The image generation API creates an image from a text prompt. It does not edit existing images or create variations.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to DALL-E in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Existing Azure OpenAI customers need to re-enter the form to get access to DALL-E. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource created in the East US region. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Go to the Azure OpenAI Studio

Navigate to Azure OpenAI Studio at <a href="https://oai.azure.com/" target="_blank">https://oai.azure.com/</a> and sign in with the credentials associated with your OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure OpenAI Studio landing page, select **DALL·E (Preview) playground** to use the image generation APIs.

## Try out image generation

Start exploring Azure OpenAI capabilities with a no-code approach through the DALL·E (Preview) playground. Enter your image prompt into the text box and select **Generate**. When the AI-generated image is ready, it will appear on the page.

> [!NOTE]
> The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it won't return a generated image. For more information, see the [content filter](../concepts/content-filter.md) guide.

:::image type="content" source="../media/quickstarts/dall-e-studio.png" alt-text="Screenshot of the Azure OpenAI Studio landing page." lightbox="../media/quickstarts/dall-e-studio.png":::


In the DALL·E (Preview) playground, you can also view Python and cURL code samples, which are pre-filled according to your settings. Select **View code** near the top of the page. You can use this code to write an application that completes the same task.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* [Azure OpenAI Overview](../overview.md)
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
