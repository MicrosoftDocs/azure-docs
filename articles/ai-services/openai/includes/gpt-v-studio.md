---
title: 'Quickstart: Use GPT-4V on your images and videos with the Azure Open AI Service'
titleSuffix: Azure OpenAI
description: Use this article to get started using Azure OpenAI to deploy and use the GPT-4V (Visual) model.  
services: cognitive-services
manager: nitinme
ms.service: azure-ai-openai
ms.topic: include
ms.date: 11/02/2023
---

Use this article to get started using Azure OpenAI to deploy and use the GPT-4V (Visual) model. 

## Prerequisites

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription. Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at https://aka.ms/oai/access. Open an issue on this repo to contact us if you have an issue. 
- An Azure OpenAI Service resource with the GPT-4V models deployed. The resource must be in the `SwedenCentral` or  `SwitzerlandNorth` Azure region. For more information about model deployment, see [the resource deployment guide](/azure/ai-services/openai/how-to/create-resource).  

## Go to Azure OpenAI Studio

Browse to [Azure OpenAI Studio](https://oai.azure.com/) and sign in with the credentials associated with your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource.

From the Azure OpenAI Studio landing page, select **Chat playground**.

## Playground

Start exploring OpenAI capabilities with a no-code approach through the Azure OpenAI Studio Chat playground. From this page, you can quickly iterate and experiment with the capabilities. 

tbd Screenshot


For help with assistant setup, chat sessions, settings, and panels, refer to the [Chat quickstart](/azure/ai-services/openai/chatgpt-quickstart?tabs=command-line&pivots=programming-language-studio). 

 
## Start a chat session to analyze images 

In this chat session, you will be instructing the assistant to aid in understanding images that you input. 
1. To start, provide this prompt to guide the assistant: "You are an AI assistant that helps people find information." You can tailor the prompt the image or scenario that you are uploading. 
1. Save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, enter the following question: "Describe this image", and upload an image. Then select **Send**. 
    1. tbd image
1. Analyze the output provided. Consider asking follow up questions related to the analysis of your image to learn more. See below for an example. 
    1. tbd image 

## Try an augmented vision chat session

In this chat session, you will try out the capabilities of the augmented vision model.  
1. To start, in the **Configurations** tab on the right side of the chat experience, turn on the option for **Vision** under the **Enhancement** section 
    1. tbd A screenshot of a computer
1. Provide this prompt to guide the assistant: "You are an AI assistant that helps people find information." You can tailor the prompt the image or scenario that you are uploading. 
1. Save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, enter the following question: "Describe this image", and upload an image. Then select **Send**.  
1. You should receive a response similar to: 
    1. tbd A car with a broken front end
1. Enter a follow-up question such as: "What should I highlight about this image to my insurance company?" 
    1.  tbd A screenshot of a phone
1. Now that you have a basic conversation select **View code** from under **Assistant setup** and you'll have a replay of the code behind the entire conversation so far. 

## Try a chat session to analyze video

In this chat session, you will be instructing the assistant to aid in understanding videos that you input. 
1. To start, provide this prompt to guide the assistant: "You are an AI assistant that summarizes video, paying attention to important events, people, and objects in the video." You can tailor the prompt the image or scenario that you are uploading. 
1. In the chat session pane, enter a question about the video like: "Describe this video in detail. Focus on brands, technology and people", and upload a video using the "Add media" button and then select **Send**. 

    > [!NOTE]
    > Currently the chat playground supports videos that are less than 3 minutes long.

    tbd image

1. You'll receive a response similar to:  
    tbd A screenshot of a chat
1. You can ask a follow-up question like "How does the AI4Bharat app work?"  
    tbd A screenshot of a chat
1. now that you have a basic conversation select **View code** from under **Assistant setup** and you'll have a replay of the code behind the entire conversation so far. 

## Clean up resources

If you want to clean up and remove an Azure OpenAI resource, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it.

- [Azure portal](../../multi-service-resource.md?pivots=azportal#clean-up-resources)
- [Azure CLI](../../multi-service-resource.md?pivots=azcli#clean-up-resources)

## Next steps

* Learn more in this [Azure OpenAI overview](../overview.md).
* Try examples in the [Azure OpenAI Samples GitHub repository](https://github.com/Azure/openai-samples).
