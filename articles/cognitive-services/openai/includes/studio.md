---
title: 'Quickstart: Use the OpenAI Service via the Azure OpenAI Studio'
titleSuffix: Azure OpenAI
description: Walkthrough on how to get started with Azure OpenAI and make your first completions call with Azure OpenAI Studio. 
services: cognitive-services
manager: nitinme
ms.service: cognitive-services
ms.subservice: openai
ms.topic: include
ms.date: 10/06/2022
keywords: 
---

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>
- Access granted to the Azure OpenAI service in the desired Azure subscription

    Currently, access to this service is granted only by application. You can apply for access to the Azure OpenAI service by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI Service resource with a model deployed. If you don't have a resource/model, the process is documented in our [resource deployment guide](../how-to/create-resource.md)

## Go to the Azure OpenAI Studio

Navigate to the Azure OpenAI Studio: <a href="https://oai.azure.com/" target="_blank">https://oai.azure.com/</a>and sign-in with credentials that have access to the OpenAI resource you've created. During the sign-in workflow, select the appropriate Directory, Azure Subscription and Azure OpenAI resource.

## Landing page

You'll first land on our main page for the Azure OpenAI Studio and from here you can navigate to several different features highlighted in the picture below.

:::image type="content" source="../media/quickstarts/studio-start.png" alt-text="Screenshot of the landing page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/quickstarts/studio-start.png":::

- Resources without a deployment will be prompted to create one. A deployment is required to be able to inference with your models
- Get started with a few simple examples that demonstrate the capabilities of the service
- Navigate to different parts of the Studio including the **Playground** for experimentation and our fine-tuning workflow
- Find quick links to other helpful resources like documentation and community forums

From here, select the **create new deployment** button in the banner at the top. If you don't see this button, you already have a deployment and can proceed to the [Playground](#playground) step.

## Deployments

Before you can generate text or inference, you need to deploy a model. This is done by selecting the **create new deployment** on the deployments page. From here, you can select from one of our many available models. For getting started we recommend `text-davinci-002`.

Once this is complete, select the 'Playground' button on the left nav to start experimenting.

## Playground

The best way to start exploring completions is through our Playground. It's simply a text box where you can submit a prompt to generate a completion. From this page, you can easily iterate and experiment with the capabilities. The following list is an overview of the features available to you on this page:

:::image type="content" source="../media/quickstarts/playground-load.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with sections highlighted." lightbox="../media/quickstarts/playground-load.png":::

- Choose from a few pre-loaded examples to get started
- Select a deployment to use
- Enter the text you want to send to the completions API here. Generations will also be appended to this text.
- Selecting the Generate button will send the entered text to the completions API and stream the results back to the text box.
- Select the 'undo' button to undo the prior generation call
- Select the 'regenerate' button to do an undo & generation call together.
- View the code you could use to make the same call with our Python SDK, curl or other REST API client
- Configure the parameters of the completions call to improve the performance of your task. You can read more about each parameter in our [REST API](../reference.md).

1. Now that you've familiarized yourself with the playground, get started generating text by loading the **Summarize Text** example.

    :::image type="content" source="../media/quickstarts/summarize-text.png" alt-text="Screenshot of the playground page of the Azure OpenAI Studio with the Summarize Text dropdown selection visible" lightbox="../media/quickstarts/summarize-text.png":::

2. Then select `Generate`. You should get a result that looks like:

    ```
    Tl;dr A neutron star is the collapsed core of a massive supergiant star, which had a total mass of between 10 and 25 solar masses, possibly more if the star was especially metal-rich.
    ```

Keep in mind the accuracy of the response will vary depending on what model you've selected under **Deployments**. The response above was generated from a davinci based model, which is well-suited to this type of summarization whereas a Codex based model wouldn't perform as well at this particular task.

## Clean up resources

If you want to clean up and remove an OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Portal](../../cognitive-services-apis-create-account.md#clean-up-resources)
- [Azure CLI](../../cognitive-services-apis-create-account-cli.md#clean-up-resources)

## Next steps

Learn more about how to generate the best completion in our [How-to guide on completions](../how-to/completions.md).