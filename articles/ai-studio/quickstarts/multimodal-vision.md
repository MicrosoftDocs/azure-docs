---
title: Get started using GPT-4 Turbo with Vision on your images and video with the Azure AI Studio 
titleSuffix: Azure AI Studio
description: Get started using GPT-4 Turbo with Vision on your images and video with the Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 11/15/2023
ms.author: eur
---

# Quickstart: Get started using GPT-4 Turbo with Vision on your images and video with the Azure AI Studio 

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Use this article to get started using [Azure AI Studio](https://ai.azure.com) to deploy and test the GPT-4 Turbo with Vision model. 

GPT-4 Turbo with Vision and [Azure AI Vision](../../ai-services/computer-vision/overview.md) offer advanced functionality including:

- Optical character recognition (OCR): Extracts text from images and combines it with the user's prompt and image to expand the context. 
- Object visualization: Complements the GPT-4 Turbo with Vision text response with object grounding and outlines salient objects in the input images.
- Video chat: GPT-4 Turbo with Vision can answer questions by retrieving the video frames most relevant to the user's prompt.

Extra usage fees might apply for using GPT-4 Turbo with Vision and Azure AI Vision functionality.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

You need:
- An [Azure OpenAI resource](https://portal.azure.com/?microsoft_azure_marketplace_ItemHideKey=microsoft_openai_tip#create/Microsoft.CognitiveServicesOpenAI) with the GPT-4 Turbo with Vision models deployed in one of the regions that support GPT-4 Turbo with Vision: Australia East, Switzerland North, Sweden Central, West US, and East US.
- For enhanced image and video chat, you also need an [Azure AI Vision resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision) in one of the regions that support GPT-4 Turbo with Vision: Australia East, Switzerland North, Sweden Central, West US, and East US.

## Start a chat session to analyze images or video

You need an image to complete the image quickstarts. You can use the following image or any other image you have available. 

:::image type="content" source="../media/quickstarts/multimodal-vision/car-accident.png" alt-text="Photo of a car accident that can be used to complete the quickstart." lightbox="../media/quickstarts/multimodal-vision/car-accident.png":::

You need a video up to three minutes in length to complete the video quickstart. 

# [Image analysis chat](#tab/image-chat)

In this chat session, you instruct the assistant to aid in understanding images that you input. 

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. Make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT-4 Turbo with Vision model from the **Deployment** dropdown. Under the chat session text box, you should now see the option to select a file.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-multi-modal-image-select.png" alt-text="Screenshot of the chat playground with mode and deployment highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-multi-modal-image-select.png":::

1. In the **System message** text box on the **Assistant setup** pane, provide this prompt to guide the assistant: "You're an AI assistant that helps people find information." You can tailor the prompt the image or scenario that you're uploading. 
1. Select **Apply changes** to save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, select an image file and then select the right arrow icon to upload the image. 

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident.png" alt-text="Screenshot of the chat playground with the selected image highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident.png":::

1. Enter enter the following question: "Describe this image", and then select the right arrow icon to send.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-prompt.png" alt-text="Screenshot of the chat playground with the image and prompt selected." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-prompt.png":::

1. The square icon replaces the right arrow icon. If you select the square icon, the assistant stops processing your request. For this quickstart, let the assistant finish its reply. Don't select the square icon.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-stop.png" alt-text="Screenshot of the chat playground with the square stop button highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-stop.png":::

1. The assistant should reply with a description of the image.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-reply-license.png" alt-text="Screenshot of the chat playground with the assistant's reply for basic image analysis." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-reply-license.png":::

1. Ask a follow-up question related to the analysis of your image. Enter "What should I highlight about this image to my insurance company" and then select the right arrow icon to send.
1. You should receive a relevant response similar to what's shown here:

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-reply-insurance-long.png" alt-text="Screenshot of the chat playground with the assistant's follow-up reply for basic image analysis." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-reply-insurance-long.png":::
 
# [Enhanced image analysis chat](#tab/enhanced-image-chat)

In this chat session, you instruct the assistant to aid in understanding images that you input. Try out the capabilities of the augmented vision model.  

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. In the **Configuration** pane on the right side of the chat experience, turn on the option for **Vision** under **Enhancements**.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-enhanced-settings.png" alt-text="Screenshot of the vision enhancement settings in the chat playground." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-enhanced-settings.png":::

    > [!NOTE]
    > You might need to select **Vision** enhancement button again to apply the changes.

1. Make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT-4 Turbo with Vision model from the **Deployment** dropdown. Under the chat session text box, you should now see the option to select a file.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-multi-modal-image-select.png" alt-text="Screenshot of the chat playground with mode and deployment and upload image button highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-multi-modal-image-select.png":::

1. In the **System message** text box on the **Assistant setup** pane, provide this prompt to guide the assistant: "You're an AI assistant that helps people find information." You can tailor the prompt the image or scenario that you're uploading. 
1. Select **Apply changes** to save your changes, and when prompted to see if you want to update the system message, select **Continue**. 

1. In the chat session pane, select an image file and then select the right arrow icon to upload the image. 

1. Enter enter the following question: "Describe this image", and then select the right arrow icon to send.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-enhanced.png" alt-text="Screenshot of the prompt for enhanced image analysis in the chat playground." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-enhanced.png":::

1. The square icon replaces the right arrow icon. If you select the square icon, the assistant stops processing your request. For this quickstart, let the assistant finish its reply. Don't select the square icon.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-stop.png" alt-text="Screenshot of the chat playground with the square stop button visible." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-stop.png":::

1. The assistant should reply with a description of the image.
1. Ask a follow-up question related to the analysis of your image. Enter "What should I highlight about this image to my insurance company" and then select the right arrow icon to send.
1. You should receive a relevant response similar to what's shown here:

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-follow-up-reply.png" alt-text="Screenshot of the chat playground with the assistant's follow-up reply for enhanced image analysis." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-follow-up-reply.png":::
 

# [Video analysis chat](#tab/video-chat)

In this chat session, you'll be instructing the assistant to aid in understanding videos that you input. The assistant extracts several frames from the video and uses them to answer your questions.

1. Sign in to [Azure AI Studio](https://ai.azure.com).
1. Select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. In the **Configuration** pane on the right side of the chat experience, turn on the option for **Vision** under **Enhancements**.
1. In the **Vision enhancements settings** dialog, select an Azure AI Vision resource and then select **Save**. 

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-enhanced-settings.png" alt-text="Screenshot of the vision enhancement settings for video analysis in the chat playground." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-enhanced-settings.png":::

    > [!NOTE]
    > You might need to select **Vision** enhancement button again to apply the changes.

1. Make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT-4 Turbo with Vision model from the **Deployment** dropdown. Under the chat session text box, you should now see the option to select a file.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-multi-modal-video-select.png" alt-text="Screenshot of the chat playground with mode and deployment and upload video button highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-multi-modal-video-select.png":::

1. In the **System message** text box on the **Assistant setup** pane, provide this prompt to guide the assistant: "You're a car insurance and accident expert. Extract detailed information about the car's make, model, damage extent, license plate, airbag deployment status, mileage, and any other observations" You can tailor the prompt for the video or scenario. 
1. Select **Apply changes** to save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, select a video file and then select the right arrow icon to upload the video. 
1. Enter enter the following question: "Provide details from this car accident video", and then select the right arrow icon to send.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-video-car-prompt.png" alt-text="Screenshot of the chat playground with the system message and prompt highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-video-car-prompt.png":::


1. The square icon replaces the right arrow icon. If you select the square icon, the assistant stops processing your request. For this quickstart, let the assistant finish its reply. Don't select the square icon.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-stop.png" alt-text="Screenshot of the chat playground with the stop button highlighted." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-prompt-stop.png":::

1. The assistant should reply with a description of the video.

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-video-car-reply.png" alt-text="Screenshot of the chat playground with the assistant's reply for video analysis." lightbox="../media/quickstarts/multimodal-vision/chat-video-car-reply.png":::

1. Ask a follow-up question related to the analysis of your video. Enter "What should I highlight about this video to my insurance company" and then select the right arrow icon to send.


1. You should receive a relevant response similar to what's shown here:

    :::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-video-reply-insurance.png" alt-text="Screenshot of the chat playground with the assistant's follow-up reply for video analysis." lightbox="../media/quickstarts/multimodal-vision/chat-car-video-reply-insurance.png":::
 
 ---


At any point in the chat session, you can select the **Show raw JSON** option to see the conversation formatted as JSON. Heres' what it looks like at the beginning of the quickstart chat session:

:::image type="content" source="../media/quickstarts/multimodal-vision/chat-session-json.png" alt-text="Screenshot of the chat session with show raw json selected." lightbox="../media/quickstarts/multimodal-vision/chat-session-json.png":::


```json
[
	{
		"role": "system",
		"content": [
			"You are an AI assistant that helps people find information."
		]
	},
]
```

This has been a walkthrough of GPT-4 Turbo with Vision in the Azure AI Studio chat playground experience.  

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this quickstart if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

## Next steps

- [Create an Azure AI project](../how-to/create-projects.md)
- Learn more about [Azure AI Vision](../../ai-services/computer-vision/overview.md).
- Learn more about [Azure OpenAI models](../../ai-services/openai/concepts/models.md).


