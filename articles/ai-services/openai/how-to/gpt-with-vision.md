---
title: How to use the GPT-4 model with Vision 
titleSuffix: Azure OpenAI Service
description: Learn about the options for using GPT-4 with Vision
author: PatrickFarley #dereklegenzoff
ms.author: pafarley #delegenz
ms.service: azure-ai-openai
ms.custom: 
ms.topic: how-to
ms.date: 11/06/2023
manager: nitinme
keywords:
---

# Use GPT-4 with Vision model

The model is best at answering general questions about what is present in the images. While it does understand the relationship between objects in images, it is not yet optimized to answer detailed questions about the location of certain objects in an image. For example, you can ask it what color a car is or what some ideas for dinner might be based on what is in you fridge, but if you show it an image of a room and ask it where the chair is, it may not answer the question correctly.

It is important to note the following:

- GPT-4 with Vision is not a model that behaves differently from GPT-4, with the small exception of the system prompt we use for the model
- GPT-4 with Vision is not a different model that does worse at text tasks because it has vision, it is simply GPT-4 with Vision added
- GPT-4 with Vision is an augmentative set of capabilities for the model

## Low or high fidelity image understanding

By controlling the _detail_ parameter, which has two options, `low` or `high`, you have control over how the model processes the image and generates its textual understanding.
- `low` will disable the “high res” model. The model will receive a low-res 512 x 512 version of the image, and represent the image with a budget of 65 tokens. This allows the API to return faster responses and consume fewer input tokens for use cases that do not require high detail.
- `high` will enable “high res” mode, which first allows the model to see the low res image and then creates detailed crops of input images as 512px squares based on the input image size. Each of the detailed crops uses twice the token budget (65 tokens) for a total of 129 tokens.

## Managing images
The Chat Completions API, unlike the Assistants API, is not stateful. That means you have to manage the messages (including images) you pass to the model yourself. If you want to pass the same image to the model multiple times, you will have to pass the image each time you make a request to the API.

For long running conversations, we suggest passing images via URL's instead of base64. The latency of the model can also be improved by downsizing your images ahead of time to be less than the maximum size they are expected them to be. For low res mode, we expect a 512px x 512px image. For high rest mode, the short side of the image should be less than 768px and the long side should be less than 2,000px.

After an image has been processed by the model, it is deleted from OpenAI servers and not retained. [We do not use data uploaded via the OpenAI API to train our models](https://openai.com/enterprise-privacy).

## Call the API

Send a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2023-08-01-preview` where 

- RESOURCE_NAME is the name of your Azure OpenAI resource 
- DEPLOYMENT_NAME is the name of your gptv model deployment 

Required headers: 
- Content-Type: application/json 
- api-key: {API_KEY} 

Body: 

This is a sample request body. The format is the same as the chat completions API for GPT-4, except that the message content may be an array containing strings and images. 


```json
{
    "messages": [ 
        {
            "role": "system", 
            "content": "You are a helpful assistant." 
        },
        {
            "role": "user", 
            "content": [ 
                "Describe this picture:", { "image": "base64 encoded image" } 
            ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```