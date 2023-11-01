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

Use this article to get started making your first calls to Azure OpenAI.

GPT-4V and Azure AI Vision offer advanced functionality including:

•Optical character recognition (OCR): Extracts text from images and combines it with the user's prompt and image to expand the context.
•Object visualization: Complements GPT-4V’s text response with object grounding and outlines salient objects in the input images
•Video chat: Enables GPT-4V to answer questions by retrieving the video frames most relevant to the user's prompt

Additional usage fees may apply for using GPT-4V with Azure AI Vision functionality.


## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.
- An Azure OpenAI resource with the GPT-4V models deployed in one of these regions: Australia East, Switzerland North, Sweden Central, or West US. For more information about model deployment, see the [resource deployment guide](../../openai/how-to/create-resource.md).

> [!NOTE]
> Supported regions for GPT-4V include: Australia East, Switzerland North, Sweden Central, West US 





Use this article to get started using Azure AI Studio to deploy and test the GPT-4(V)ision model. 

## Prerequisites 

An Azure subscription - Create one for free. 

Access granted to Azure AI Studio in the desired Azure subscription. 

Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access.  

An Azure AI resource with the GPT-4V models deployed. For more information about model deployment, see the resource deployment guide. 

NOTE: Supported regions for GPT-4V include: Australia East, Switzerland North, Sweden Central, West US 
 

Go to Azure AI Studio 

Navigate to Azure AI Studio at https://ml.azure.com/ and sign-in with credentials that have access to your Azure AI resource. During or after the sign-in workflow, select the appropriate directory and Azure subscription. Follow the steps below to create your project, or refer to [Create an Azure AI Project in Azure AI Studio]( Create an Azure AI project in Azure AI Studio - Azure AI services | Microsoft Learn) for more information. 

From the Azure AI Studio landing page, select Build in the top left corner. 

A screenshot of a computer

Description automatically generated 

From the Build tab, select “Create project”.  

Give your project a friendly name and select the Azure AI resource that you created in the prerequisites. 

Once your project is created, select the “Playground” tab under the “Tools” section in the left-hand navigation to get started.  

 
## Playground 

Start exploring Azure AI capabilities with a no-code approach through the Azure AI Studio Chat playground. From this page, you can quickly iterate and experiment with the capabilities. 

 

For help with assistant setup, chat sessions, settings, and panels, refer to [Get started using GPT-35-Turbo and GPT-4 with Azure OpenAI Service] (How to work with the GPT-35-Turbo and GPT-4 models - Azure OpenAI Service | Microsoft Learn). 

 
## Start a chat session to analyze images 

In this chat session, you will be instructing the assistant to aid in understanding images that you input. 

1. Sign in to [Azure AI Studio](https://aka.ms/aistudio).
1. Select **Build** from the top menu and then select **Playground**.
1. In the chat session pane, enter the following question: "Describe this image”, and upload an image. Then select Send.  

    :::image type="content" source="../media/quickstarts/playground/car-accident.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/car-accident.png":::



    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-follow-up-question.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-car-accident-follow-up-question.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-prompt.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-car-accident-prompt.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-reply-insurance-long.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-car-accident-reply-insurance-long.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-car-accident-reply-license.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-car-accident-reply-license.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-car-accident.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-car-accident.png":::



    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-file-selectpng" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-multi-modal-file-select.png":::



    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-image-select.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-multi-modal-image-select.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-land-focus.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-multi-modal-land-focus.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-land.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-multi-modal-land.png":::


    :::image type="content" source="../media/quickstarts/playground/chat-multi-modal-mic-select.png" alt-text="Screenshot of the playground." lightbox="../media/quickstarts/playground/chat-multi-modal-mic-select.png":::




To start, provide this prompt to guide the assistant: “You are an AI assistant that helps people find information.” You can tailor the prompt the image or scenario that you are uploading. 

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
 

You will be required to select a Computer Vision resource to try the enhanced Vision API. This resource must be in the East US region to try video, but for image only can be in any of the GPT-4V supported regions, including East US, Switzerland North, Sweden Central, Central US, West US, and Australia East. Select your resource, and “Save”. 

Provide this prompt to guide the assistant: “You are an AI assistant that helps people find information.” You can tailor the prompt the image or scenario that you are uploading. 

Save your changes, and when prompted to see if you want to update the system message, select Continue. 

In the chat session pane, enter the following question: "Describe this image”, and upload an image. Then select Send.  

You should receive a response similar to: 

A car with a broken front end

Description automatically generated 
 

Enter a follow-up question such as: “What should I highlight about this image to my insurance company?” 
A screenshot of a phone

Description automatically generated 
 

Now that you have a basic conversation select View code from under Assistant setup and you'll have a replay of the code behind the entire conversation so far. 

 

Try a chat session to analyze video 

In this chat session, you will be instructing the assistant to aid in understanding videos that you input. 

You will be required to select a Computer Vision resource to try the enhanced Vision API. This resource must be in the East US region to try video, but for image only can be in any of the GPT-4V supported regions, including East US, Switzerland North, Sweden Central, Central US, West US, and Australia East. Select your resource, and “Save”. 

Provide this prompt to guide the assistant: “You are an AI assistant that summarizes video, paying attention to important events, people, and objects in the video.” You can tailor the prompt the image or scenario that you are uploading. 

In the chat session pane, enter a question about the video like: "Describe this video in detail. Focus on brands, technology and people”, and upload a video using the “Add media” button and then select Send. 
 
Note: Currently the chat playground supports videos that are less than 3 minutes in length.   

 
 

You'll receive a response similar to:  
 

You can ask a follow-up question like “How does the AI4Bharat app work?”  

  

  

  

Now that you have a basic conversation select View code from under Assistant setup and you'll have a replay of the code behind the entire conversation so far. 

 

This has been a walkthrough of GPT-4V in the Azure AI Studio chat playground experience.  

 

 