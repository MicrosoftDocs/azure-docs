---
title: Get started using GPT-4 Turbo with Vision on your images and videos in Azure AI Studio
titleSuffix: Azure AI Studio
description: Get started using GPT-4 Turbo with Vision on your images and videos in Azure AI Studio.
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: quickstart
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: pafarley
author: PatrickFarley
---

# Quickstart: Get started using GPT-4 Turbo with Vision on your images and videos in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

Use this article to get started using [Azure AI Studio](https://ai.azure.com) to deploy and test the GPT-4 Turbo with Vision model. 

GPT-4 Turbo with Vision and [Azure AI Vision](../../ai-services/computer-vision/overview.md) offer advanced functionality including:

- Optical Character Recognition (OCR): Extracts text from images and combines it with the user's prompt and image to expand the context. 
- Object grounding: Complements the GPT-4 Turbo with Vision text response with object grounding and outlines salient objects in the input images.
- Video prompts: GPT-4 Turbo with Vision can answer questions by retrieving the video frames most relevant to the user's prompt.

Extra usage fees might apply when using GPT-4 Turbo with Vision and Azure AI Vision functionality.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.
    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- Once you have your Azure subscription, <a href="/azure/ai-services/openai/how-to/create-resource?pivots=web-portal"  title="Create an Azure OpenAI resource."  target="_blank">create an Azure OpenAI resource </a>.
- An [AI Studio hub](../how-to/create-azure-ai-resource.md) with your Azure OpenAI resource added as a connection. 

## Prepare your media

You need an image to complete the image quickstarts. You can use this sample image or any other image you have available. 

:::image type="content" source="../media/quickstarts/multimodal-vision/car-accident.png" alt-text="Photo of a car accident that can be used to complete the quickstart." lightbox="../media/quickstarts/multimodal-vision/car-accident.png":::

For video prompts, you need a video that's under three minutes in length.

## Deploy a GPT-4 Turbo with Vision model

1. Sign in to [Azure AI Studio](https://ai.azure.com) and select the hub you'd like to work in.
1. On the left nav menu, select **AI Services**. Select the **Try out GPT-4 Turbo** panel.
1. On the gpt-4 page, select **Deploy**. In the window that appears, select your Azure OpenAI resource. Select `vision-preview` as the model version.
1. Select **Deploy**.
1. Next, go to your new model's page and select **Open in playground**. In the chat playground, the GPT-4 deployment you created should be selected in the **Deployment** dropdown.
    
# [Image prompts](#tab/image-chat)

In this chat session, you instruct the assistant to aid in understanding images that you input.

1. In the **System message** text box on the **System message** tab, provide this prompt to guide the assistant: `"You're an AI assistant that helps people find information."` You can tailor the prompt to your image or scenario.
1. Select **Apply changes** to save your changes. 
1. In the chat session pane, select the attachment button and then **Upload image**. Choose your image.
1. Add the following question in the chat field: `"Describe this image"`, and then select the right arrow icon to send.
1. The right arrow icon is replaced by a Stop button. If you select it, the assistant stops processing your request. For this quickstart, let the assistant finish its reply.
1. The assistant replies with a description of the image.
    <!--:::image type="content" source="../media/quickstarts/multimodal-vision/chat-car-accident-reply-license.png" alt-text="Screenshot of the chat playground with the assistant's reply for basic image analysis." lightbox="../media/quickstarts/multimodal-vision/chat-car-accident-reply-license.png":::-->
1. Ask a follow-up question related to the analysis of your image. You could enter, `"What should I highlight about this image to my insurance company?"`.
1. You should receive a relevant response similar to what's shown here:
    ```
    When reporting the incident to your insurance company, you should highlight the following key points from the image:  
       
    1. **Location of Damage**: Clearly state that the front end of the car, particularly the driver's side, is damaged. Mention the crumpled hood, broken front bumper, and the damaged left headlight.  
       
    2. **Point of Impact**: Indicate that the car has collided with a guardrail, which may suggest that no other vehicles were involved in the accident.  
       
    3. **Condition of the Car**: Note that the damage seems to be concentrated on the front end, and there is no visible damage to the windshield or rear of the car from this perspective.  
       
    4. **License Plate Visibility**: Mention that the license plate is intact and can be used for identification purposes.  
       
    5. **Environment**: Report that the accident occurred near a roadside with a guardrail, possibly in a rural or semi-rural area, which might help in establishing the accident location and context.  
       
    6. **Other Observations**: If there were any other circumstances or details not visible in the image that may have contributed to the accident, such as weather conditions, road conditions, or any other relevant information, be sure to include those as well.  
       
    Remember to be factual and descriptive, avoiding speculation about the cause of the accident, as the insurance company will conduct its own investigation.
    ```

# [Image prompt enhancements](#tab/enhanced-image-chat)

In this chat session, you instruct the assistant to aid in understanding images that you input. Try out the capabilities of the augmented vision model.  

1. In the **Enhancements** pane on the left side of the chat window, turn on the option for **Vision**. In the window that appears, select your Azure Computer Vision resource.
1. In the **System message** text box on the **System message** tab, provide this prompt to guide the assistant: `"You're an AI assistant that helps people find information."` You can tailor the prompt to your image or scenario. Select **Apply changes** to save your changes. 
1. In the chat session pane, select the attachment button and then **Upload image**. Choose your image.
1. Add the following question in the chat field: `"Describe this image"`, and then select the right arrow icon to send.
1. The right arrow icon is replaced by a Stop button. If you select it, the assistant stops processing your request. For this quickstart, let the assistant finish its reply.
1. The assistant replies with a description of the image. It uses the Azure AI Vision service to extract more detail from the image you uploaded.
    <!--:::image type="content" source="../media/quickstarts/multimodal-vision/chat-image-read-text.png" alt-text="Screenshot of the chat playground with the model output where the text in the image is read and returned." lightbox="../media/quickstarts/multimodal-vision/chat-image-read-text.png":::-->
1. Ask a follow-up question related to the analysis of your image. Enter, `"What should I highlight about this image to my insurance company?" `and then select the right arrow icon to send.
1. You should receive a relevant response similar to what's shown here:
    ```
    When reporting the incident to your insurance company, you should highlight the following key points from the image:  
       
    1. **Location of Damage**: Clearly state that the front end of the car, particularly the driver's side, is damaged. Mention the crumpled hood, broken front bumper, and the damaged left headlight.  
       
    2. **Point of Impact**: Indicate that the car has collided with a guardrail, which may suggest that no other vehicles were involved in the accident.  
       
    3. **Condition of the Car**: Note that the damage seems to be concentrated on the front end, and there is no visible damage to the windshield or rear of the car from this perspective.  
       
    4. **License Plate Visibility**: Mention that the license plate is intact and can be used for identification purposes.  
       
    5. **Environment**: Report that the accident occurred near a roadside with a guardrail, possibly in a rural or semi-rural area, which might help in establishing the accident location and context.  
       
    6. **Other Observations**: If there were any other circumstances or details not visible in the image that may have contributed to the accident, such as weather conditions, road conditions, or any other relevant information, be sure to include those as well.  
       
    Remember to be factual and descriptive, avoiding speculation about the cause of the accident, as the insurance company will conduct its own investigation.
    ```

# [Video prompt enhancements](#tab/video-chat)

In this chat session, you are instructing the assistant to aid in understanding videos that you input. The assistant extracts several frames from the video and uses them to answer your questions.

1. In the **Enhancements** pane on the left side of the chat window, turn on the option for **Vision**. In the window that appears, select your Azure Computer Vision resource.
1. In the **System message** text box on the **System message** tab, provide this prompt to guide the assistant: `"You're an AI assistant that helps people find information."` You can tailor the prompt to your image or scenario.
1. Select **Apply changes** to save your changes. 
1. In the chat session pane, select the attachment button and then **Upload video**. Choose your video.
1. Enter a text prompt like, `"Provide details about this video"`, and then select the right arrow icon to send.
1. The right arrow icon is replaced by a Stop button. If you select it, the assistant stops processing your request. For this quickstart, let the assistant finish its reply.
1. The assistant should reply with a description of the video.
1. Feel free to ask any follow-up questions related to the analysis of your video.

## Limitations

Below are the known limitations of the video prompt enhancements.

- **Low resolution:** The frames are analyzed using GPT-4 Turbo with Vision's "low resolution" setting, which may affect the accuracy of small object and text recognition in the video.
- **Video file limits:** Both MP4 and MOV file types are supported. In the Azure AI Studio Playground, videos must be less than 3 minutes long. When you use the API there is no such limitation.
- **Prompt limits:** Video prompts only contain one video and no images. In Playground, you can clear the session to try with another video or images.
- **Limited frame selection:** Currently the system selects 20 frames from the entire video, which might not capture all critical moments or details. Frame selection can either be evenly spread through the video or focused by a specific Video Retrieval query, depending on the prompt.
- **Language support:** Currently, the system primarily supports English for grounding with transcripts. Transcripts don't provide accurate information on lyrics from songs.

---

## View and export code

At any point in the chat session, you can enable the **Show raw JSON** switch at the top of the chat window to see the conversation formatted as JSON. Heres' what it looks like at the beginning of the quickstart chat session:

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

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this quickstart if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

## Next steps

- [Create a project](../how-to/create-projects.md)
- Learn more about [Azure AI Vision](../../ai-services/computer-vision/overview.md).
- Learn more about [Azure OpenAI models](../../ai-services/openai/concepts/models.md).
