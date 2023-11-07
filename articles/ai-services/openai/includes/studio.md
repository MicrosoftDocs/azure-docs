---
title: 'Quickstart: Use Azure OpenAI Service via the Azure OpenAI Studio'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with Azure OpenAI Studio. 
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 03/01/2023
keywords: 
---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

> [!div class="nextstepaction"]
> [I ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Prerequisites)

## Go to the Azure OpenAI Studio

Navigate to Azure OpenAI Studio at <a href="https://oai.azure.com/" target="_blank">https://oai.azure.com/</a> and sign-in with credentials that have access to your OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure OpenAI Studio landing page navigate further to explore examples for prompt completion, manage your deployments and models, and find learning resources such as documentation and community forums. 

:::image type="content" source="../media/quickstarts/studio-start.png" alt-text="Screenshot of the Azure OpenAI Studio landing page." lightbox="../media/quickstarts/studio-start.png":::

Go to the [Playground](#playground) for experimentation and fine-tuning workflow. 

## Playground

Start exploring Azure OpenAI capabilities with a no-code approach through the GPT-3 Playground. It's simply a text box where you can submit a prompt to generate a completion. From this page, you can quickly iterate and experiment with the capabilities. 

:::image type="content" source="../media/quickstarts/playground-load.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/quickstarts/playground-load.png":::

You can select a deployment and choose from a few pre-loaded examples to get started. If your resource doesn't have a deployment, select **Create a deployment** and follow the instructions provided by the wizard. For more information about model deployment, see the [resource deployment guide](../how-to/create-resource.md).

You can experiment with the configuration settings such as temperature and pre-response text to improve the performance of your task. You can read more about each parameter in the [REST API](../reference.md).

- Selecting the **Generate** button will send the entered text to the completions API and stream the results back to the text box.
- Select the **Undo** button to undo the prior generation call.
- Select the **Regenerate** button to complete an undo and generation call together.

Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses may be filtered if harmful content is detected. For more information, see the [content filter](../concepts/content-filter.md) article.

In the GPT-3 playground you can also view Python and curl code samples pre-filled according to your selected settings. Just select **View code** next to the examples dropdown. You can write an application to complete the same task with the OpenAI Python SDK, curl, or other REST API client.

### Try text summarization

To use the Azure OpenAI for text summarization in the GPT-3 Playground, follow these steps:

1. Sign in to [Azure OpenAI Studio](https://oai.azure.com).
1. Select the subscription and OpenAI resource to work with. 
1. Select **GPT-3 Playground** at the top of the landing page.
1. Select your deployment from the **Deployments** dropdown. If your resource doesn't have a deployment, select **Create a deployment** and then revisit this step.
1. Select **Summarize Text** from the **Examples** dropdown. 

    :::image type="content" source="../media/quickstarts/summarize-text.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with the Summarize Text dropdown selection visible" lightbox="../media/quickstarts/summarize-text.png":::

1. Select `Generate`. Azure OpenAI will attempt to capture the context of text and rephrase it succinctly. You should get a result that resembles the following text:

    ```
    Tl;dr A neutron star is the collapsed core of a supergiant star. These incredibly dense objects are incredibly fascinating due to their strange properties and their potential for phenomena such as extreme gravitational forces and a strong magnetic field.
    ```

The accuracy of the response can vary per model. The Davinci based model in this example is well-suited to this type of summarization, whereas a Codex based model wouldn't perform as well at this particular task.

> [!div class="nextstepaction"]
> [I ran into an issue with the playground.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=STUDIO&Pillar=AOAI&Product=gpt&Page=quickstart&Section=Set-up)

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).
* For more examples check out the [Azure OpenAI Samples GitHub repository](https://aka.ms/AOAICodeSamples).
