---
title: 'Quickstart: Use GPT-4 Turbo with Vision on your images and videos with the Azure Open AI Service'
titleSuffix: Azure OpenAI
description: Use this article to get started using Azure OpenAI Studio to deploy and use the GPT-4 Turbo with Vision model.  
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/02/2023
---

Start exploring GPT-4 Turbo with Vision capabilities with a no-code approach through Azure OpenAI Studio.

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription. Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue. 
- An Azure OpenAI Service resource. The resource must be in the `SwitzerlandNorth`, `SwedenCentral`, `WestUS`, or `AustraliaEast` Azure region. For more information about resource creation, see the [resource deployment guide](/azure/ai-services/openai/how-to/create-resource). 
- For Vision enhancement (optional): An Azure Computer Vision resource in one of the supported regions above.


## Go to Azure OpenAI Studio

Browse to [Azure OpenAI Studio](https://oai.azure.com/) and sign in with the credentials associated with your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

Under the **Management** section select **Deployments** and create a `gpt-4v` deployment. For more information about model deployment, see the [resource deployment guide](/azure/ai-services/openai/how-to/create-resource).  

Under the **Playground** section select **Chat**.

## Playground

From this page, you can quickly iterate and experiment with the model's capabilities. 

For general help with assistant setup, chat sessions, settings, and panels, refer to the [Chat quickstart](/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line&pivots=programming-language-studio). 


## Start a chat session to analyze images or video

#### [Image prompts](#tab/image)

In this chat session, you're instructing the assistant to aid in understanding images that you input. 
1. In the **Assistant setup** pane, provide this System Message to guide the assistant: "You are an AI assistant that helps people find information." You can tailor the System Message to the image or scenario that you're uploading. 
1. Save your changes, and when prompted to confirm updating the system message, select **Continue**.
1. In the **Chat session** pane, enter a text prompt like "Describe this image," and upload an image with the attachment button. You can use a different text prompt for your use case. Then select **Send**. 
1. Observe the output provided. Consider asking follow-up questions related to the analysis of your image to learn more.

:::image type="content" source="../media/quickstarts/studio-vision.png" lightbox="../media/quickstarts/studio-vision.png" alt-text="Screenshot of OpenAI studio chat playground.":::

#### [Enhanced image prompts](#tab/enhanced)

In this chat session, you try out the capabilities of the enhanced Vision model. 
1. To start, in the **Configuration** tab on the right side of the chat experience, turn on the option for **Vision** under the **Enhancements** section.
1. You're required to select a Computer Vision resource to try the enhanced Vision API. This resource must be in one of the GPT-4 Turbo with Vision supported regions:  `SwitzerlandNorth`, `SwedenCentral`, `WestUS`, or `AustraliaEast`. Select your resource, and **Save**. 
1. Provide this System Message to guide the assistant: "You are an AI assistant that helps people find information." You can tailor the prompt the image or scenario that you're uploading. 
1. Save your changes, and when prompted to confirm updating the system message, select **Continue**.
1. In the **Chat session** pane, enter a text prompt like "Describe this image," and upload an image with the attachment button. You can use a different text prompt for your use case. Then select **Send**.  
1. You should receive a response with more detailed information about visible text in the image and the locations of objects. Consider asking follow-up questions related to the analysis of your image to learn more.

:::image type="content" source="../media/quickstarts/studio-vision-enhanced.png" lightbox="../media/quickstarts/studio-vision-enhanced.png" alt-text="Screenshot of OpenAI studio chat playground with Enhancements turned on and the Computer Vision resource selection box.":::

#### [Video prompts](#tab/video)

In this chat session, you're instructing the assistant to aid in understanding videos that you input. Video prompts uses Azure AI Vision video retrieval to sample a set of frames from a video and create a transcript of the speech in the video. The frames and transcripts are added as context to the user's query.
1. To start, in the **Configuration** tab on the right side of the chat experience, turn on the option for **Vision** under the **Enhancements** section.
1. You're required to select a Computer Vision resource to try the enhanced Vision API. This resource must be in one of the GPT-4 Turbo with Vision supported regions: `SwitzerlandNorth`, `SwedenCentral`, `WestUS`, or `AustraliaEast`. Select your resource, and **Save**. 
1. Provide this System Message to guide the assistant: "You are an AI assistant that summarizes video, paying attention to important events, people, and objects in the video." You can tailor the prompt the image or scenario that you're uploading. 
1. Save your changes, and when prompted to confirm updating the system message, select **Continue**.
1. In the chat session pane, enter a question about the video like: "Describe this video in detail. Focus on brands, technology and people." You can use a different text prompt for your use case. Upload a video using the attachment button and then select **Send**. 

    > [!NOTE]
    > Currently the chat playground only supports videos that are less than 3 minutes long.

1. You should receive a response describing the video. Consider asking follow-up questions related to the analysis of your video to learn more.


:::image type="content" source="../media/quickstarts/studio-vision-enhanced-video.png" alt-text="Screenshot of OpenAI studio chat playground with Enhancements turned on and the Computer Vision resource selection box. Video-specific text prompt." lightbox="../media/quickstarts/studio-vision-enhanced-video.png":::

---

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in the [Azure OpenAI overview](../overview.md).
