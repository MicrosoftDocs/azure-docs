---
title: 'Quickstart: Use ChatGPT (Preview) via the Azure OpenAI Studio'
titleSuffix: Azure OpenAI Service
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with Azure OpenAI Studio. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 02/02/2023
keywords: 
---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI Service resource with the `gpt-3.5` model deployed. This model is currently available in East US and South Central US. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

## Go to Azure OpenAI Studio

Navigate to Azure OpenAI Studio at <a href="https://oai.azure.com/" target="_blank">https://oai.azure.com/</a> and sign-in with credentials that have access to your OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure OpenAI Studio landing page select **ChatGPT playground (Preview)**

:::image type="content" source="../media/quickstarts/chatgpt-playground.png" alt-text="Screenshot of the Azure OpenAI Studio landing page." lightbox="../media/quickstarts/chatgpt-playground.png":::

## Playground

Start exploring OpenAI capabilities with a no-code approach through the Azure OpenAI Studio ChatGPT playground. From this page, you can quickly iterate and experiment with the capabilities.

:::image type="content" source="../media/quickstarts/chatgpt-playground-load.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/quickstarts/chatgpt-playground-load.png":::

You can use the Chatbot setup dropdown to select a few pre-loaded System message examples to get started. System messages give the model instructions about how it should behave and any context it should reference when generating a response. You can describe the chatbot’s personality, tell it what it should and shouldn’t answer, and tell it how to format responses.

- Selecting the **Send** button will send the entered text to the completions API and stream the results back to the text box.
- Select the **Clear chat** button to delete the current conversation history.

Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filter](../concepts/content-filter.md) article.

In the ChatGPT playground you can also view Python, curl, and json code samples pre-filled based on your current chat session and settings. Just select **View code** from Chatbot setup panel. You can write an application to complete the same task with the OpenAI Python SDK, curl, or other REST API clients.

## Try text summarization

To use Azure OpenAI service for text summarization in the GPT-3 Playground, follow these steps:

1. Sign in to [Azure OpenAI Studio](https://oai.azure.com).
1. Select the subscription and OpenAI resource to work with.
1. Select **GPT-3 Playground** at the top of the landing page.
1. Select your deployment from the **Deployments** dropdown. If your resource doesn't have a deployment, select **Create a deployment** and then revisit this step.
1. Select **Summarize Text** from the **Examples** dropdown.

    :::image type="content" source="../media/quickstarts/summarize-text.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with the Summarize Text dropdown selection visible" lightbox="../media/quickstarts/summarize-text.png":::

1. Select `Generate`. OpenAI will grasp the context of text and rephrase it succinctly. You should get a result that resembles the following text:

    ```
    Tl;dr A neutron star is the collapsed core of a supergiant star. These incredibly dense objects are incredibly fascinating due to their strange properties and their potential for phenomena such as extreme gravitational forces and a strong magnetic field.
    ```

The accuracy of the response can vary per model. The Davinci based model in this example is well-suited to this type of summarization, whereas a Codex based model wouldn't perform as well at this particular task.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

Learn more about how to work with ChatGPT and the new `gpt-3.5` model with the [ChatGPT how-to guide](../how-to/chatgpt.md).