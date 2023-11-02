---
title: Get started using GPT-4V on your images and video with the Azure AI Studio 
titleSuffix: Azure AI services
description: Get started using GPT-4V on your images and video with the Azure AI Studio 
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: quickstart
ms.date: 10/1/2023
ms.author: eur
---


# Quickstart: Get started using GPT-4V on your images and video with the Azure AI Studio 

Use this article to get started using Azure AI Studio to deploy and test the GPT-4(V)ision model. 

GPT-4V and Azure AI Vision offer advanced functionality including:

- Optical character recognition (OCR): Extracts text from images and combines it with the user's prompt and image to expand the context. 
- Object visualization: Complements the GPT-4V text response with object grounding and outlines salient objects in the input images.
- Video chat: GPT-4V can answer questions by retrieving the video frames most relevant to the user's prompt.

Additional usage fees may apply for using GPT-4V with Azure AI Vision functionality.


## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- An Azure OpenAI resource with the GPT-4V models deployed in one of these regions: East US, Switzerland North, Sweden Central, Central US, West US, and Australia East. 
- For video chat you *also* need an Azure AI Vision resource in the East US region. 

You also need an image to complete the quickstart. You can use the following image or any other image you have available. 

:::image type="content" source="../media/quickstarts/playground/car-accident.png" alt-text="Screenshot of the image that's used in the quickstart." lightbox="../media/quickstarts/playground/car-accident.png":::
 
## Start a chat session to analyze images 

In this chat session, you instruct the assistant to aid in understanding images that you input. 

1. Sign in to [Azure AI Studio](https://aka.ms/aistudio).
1. Select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. Make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT-4V model from the **Deployment** dropdown. Under the chat session text box, you should now see the option to select a file.

    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-land.png" alt-text="Screenshot of the chat playground with the select deployment and file options in view." lightbox="../media/quickstarts/playground/chat-multi-modal-land.png":::

1. In the chat session pane, select a file and upload an image. 

    :::image type="content" source="../media/quickstarts/playground/chat-car-accident.png" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-car-accident.png":::

1. Enter enter the following question: "Describe this image", and then select the send arrow icon to the far right of the file upload button.

    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-prompt.png" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-car-accident-prompt.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-reply-license.png" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-car-accident-reply-license.png":::

    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-follow-up-question.png" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-car-accident-follow-up-question.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-reply-insurance-long.png" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-car-accident-reply-insurance-long.png":::




    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-file-selectpng" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-multi-modal-file-select.png":::



    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-image-select.png" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-multi-modal-image-select.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-land-focus.png" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-multi-modal-land-focus.png":::






To start, provide this prompt to guide the assistant: “You are an AI assistant that helps people find information." You can tailor the prompt the image or scenario that you are uploading. 

Save your changes, and when prompted to see if you want to update the system message, select Continue. 


A car with a damaged front end

Description automatically generated 
 

Analyze the output provided. Consider asking follow up questions related to the analysis of your image to learn more. See below for an example. 
 

A screenshot of a chat

Description automatically generated 
 

Try an augmented vision chat session 

In this chat session, you will try out the capabilities of the augmented vision model.  

To start, in the Configurations tab on the right side of the chat experience, turn on the option for Vision under the Enhancement section 
A screenshot of a computer

Description automatically generated 
 

You will be required to select a Computer Vision resource to try the enhanced Vision API. This resource must be in the East US region to try video, but for image only can be in any of the GPT-4V supported regions, including East US, Switzerland North, Sweden Central, Central US, West US, and Australia East. Select your resource, and “Save". 

Provide this prompt to guide the assistant: “You are an AI assistant that helps people find information." You can tailor the prompt the image or scenario that you are uploading. 

Save your changes, and when prompted to see if you want to update the system message, select Continue. 

In the chat session pane, enter the following question: "Describe this image", and upload an image. Then select Send.  

You should receive a response similar to: 

A car with a broken front end

Description automatically generated 
 

Enter a follow-up question such as: “What should I highlight about this image to my insurance company?" 
A screenshot of a phone

Description automatically generated 
 

Now that you have a basic conversation select View code from under Assistant setup and you'll have a replay of the code behind the entire conversation so far. 

 

## Try a chat session to analyze video 

In this chat session, you will be instructing the assistant to aid in understanding videos that you input. 

You will be required to select a Computer Vision resource to try the enhanced Vision API. This resource must be in the East US region to try video, but for image only can be in any of the GPT-4V supported regions, including East US, Switzerland North, Sweden Central, Central US, West US, and Australia East. Select your resource, and “Save". 

1. Upload a video using the “Add media" button and then select Send. 

    > [!NOTE]
    > The playground supports video up to three minutes in length.

1. Provide this prompt to guide the assistant: “You are a car insurance and accident expert. Extract detailed information about the car's make, model, damage extent, license plate, airbag deployment status, mileage, and any other observations." You can tailor the prompt the image or scenario that you are uploading. 

In the chat session pane, enter a question about the video like: "Provide details from this car accident video.", and upload a video using the “Add media" button and then select Send. 
 

    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-file-selectpng" alt-text="Screenshot of the chat playground." lightbox="../media/quickstarts/playground/chat-multi-modal-file-select.png":::


  

 
 

You'll receive a response similar to:  


You can ask a follow-up question like “How does the AI4Bharat app work?"  

  

  

  

Now that you have a basic conversation select View code from under Assistant setup and you'll have a replay of the code behind the entire conversation so far. 

 

This has been a walkthrough of GPT-4V in the Azure AI Studio chat playground experience.  

 

 