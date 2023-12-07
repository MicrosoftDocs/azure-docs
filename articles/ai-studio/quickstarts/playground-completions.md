---
title: Generate product name ideas in the Azure AI Studio playground
titleSuffix: Azure OpenAI
description: Use this article to generate product name ideas in the Azure AI Studio playground.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: quickstart
ms.date: 11/15/2023
ms.author: eur
---

# Quickstart: Generate product name ideas in the Azure AI Studio playground

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Use this article to get started making your first calls to Azure OpenAI.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with a model deployed. For more information about model deployment, see the [resource deployment guide](../../ai-services/openai/how-to/create-resource.md).


### Try text completions

To use the Azure OpenAI for text completions in the playground, follow these steps:

1. Sign in to [Azure AI Studio](https://ai.azure.com) with credentials that have access to your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource. You should be on the Azure AI Studio **Home** page.
1. From the Azure AI Studio Home page, select **Build** > **Playground**.
1. Select your deployment from the **Deployments** dropdown. 
1. Select **Completions** from the **Mode** dropdown menu.
1. Select **Generate product name ideas** from the **Examples** dropdown menu. The system prompt is prepopulated with something resembling the following text:

    ```
    Generate product name ideas for a yet to be launched wearable health device that will allow users to monitor their health and wellness in real-time using AI and share their health metrics with their friends and family. The generated product name ideas should reflect the product's key features, have an international appeal, and evoke positive emotions.
    
    Seed words: fast, healthy, compact
    
    Example product names: 
    1. WellnessVibe
    2. HealthFlux
    3. VitalTracker
    ```

    :::image type="content" source="../media/quickstarts/playground-completions-generate-before.png" alt-text="Screenshot of the Azure AI Studio playground with the Generate product name ideas dropdown selection visible." lightbox="../media/quickstarts/playground-completions-generate-before.png":::

1. Select `Generate`. Azure OpenAI generates product name ideas based on. You should get a result that resembles the following list:

    ```
    Product names:
    1. VitalFlow
    2. HealthSwift
    3. BodyPulse
    4. HealthPulse
    5. VitalTracker
    6. WellMate
    7. HealthMate
    8. BodyMate
    9. VitalWear
    10. HealthWear 
    11. BodyTrack
    12. Health
    ```

    :::image type="content" source="../media/quickstarts/playground-completions-generate-after.png" alt-text="Screenshot of the playground page of the Azure AI Studio with the generated completion." lightbox="../media/quickstarts/playground-completions-generate-after.png":::

## Playground options

You've now successfully generated product name ideas using Azure OpenAI. You can experiment with the configuration settings such as temperature and preresponse text to improve the performance of your task. You can read more about each parameter in the [Azure OpenAI REST API documentation](../../ai-services/openai/reference.md).

- Selecting the **Generate** button sends the entered text to the completions API and stream the results back to the text box.
- Select the **Undo** button to undo the prior generation call.
- Select the **Regenerate** button to complete an undo and generation call together.

Azure OpenAI also performs content moderation on the prompt inputs and generated outputs. The prompts or responses can be filtered if harmful content is detected. For more information, see the [content filter](../../ai-services/openai/concepts/content-filter.md) article.

In the playground you can also view python, json, C#, and curl code samples prefilled according to your selected settings. Just select **View code** next to the examples dropdown. You can write an application to complete the same task with the OpenAI Python SDK, curl, or other REST API client.

:::image type="content" source="../media/quickstarts/playground-completions-sample-python.png" alt-text="Screenshot of the playground page of the Azure AI Studio with python sample code in view." lightbox="../media/quickstarts/playground-completions-sample-python.png":::

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this quickstart if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

## Next steps

- [Create a project in Azure AI Studio](../how-to/create-projects.md)
- [Deploy a web app for chat on your data](../tutorials/deploy-chat-web-app.md)