---
title: How to use the GPT-4 Turbo with Vision model
titleSuffix: Azure OpenAI Service
description: Learn about the options for using GPT-4 Turbo with Vision
author: PatrickFarley #dereklegenzoff
ms.author: pafarley #delegenz
ms.service: azure-ai-openai
ms.custom: 
ms.topic: how-to
ms.date: 11/06/2023
manager: nitinme
keywords:
---

# Use GPT-4 Turbo with Vision


GPT-4 Turbo with Vision is a large multimodal model (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them. It incorporates both natural language processing and visual understanding.

The GPT-4 Turbo with Vision model answers general questions about what's present in the images. You can also show it video, if you use Vision enhancements.

> [!TIP]
> To use GPT-4 Turbo with Vision, you call the Chat Completion API on a GPT-4 Vision model that you have deployed. If you're not familiar with the Chat Completion API, see the [GPT-4 Turbo & GPT-4 how-to guide](/azure/ai-services/openai/how-to/chatgpt?tabs=python&pivots=programming-language-chat-completions).

## Call the Chat Completion APIs

The following REST command shows the most basic way to use the GPT-4 Turbo with Vision model with code. If this is your first time using these models programmatically, we recommend starting with our [GPT-4 Turbo with Vision quickstart](../gpt-v-quickstart.md). 

Send a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2023-12-01-preview` where 

- RESOURCE_NAME is the name of your Azure OpenAI resource 
- DEPLOYMENT_NAME is the name of your GPT-4 Vision model deployment 

**Required headers**: 
- `Content-Type`: application/json 
- `api-key`: {API_KEY} 

**Body**: 
The following is a sample request body. The format is the same as the chat completions API for GPT-4, except that the message content can be an array containing strings and images (either a URL to an image, or a base-64-encoded image). 

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
                "Describe this picture:", { "image": "URL or base-64-encoded image" } 
            ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```

## Use Vision enhancement

GPT-4 Turbo with Vision provides exclusive access to Azure AI Services tailored enhancements. When combined with Azure AI Vision, it enhances your chat experience by providing the chat model with more detailed information about visible text in the image and the locations of objects.

> [!IMPORTANT]
> To use Vision enhancement, you need a Computer Vision resource, and it must be in one of the Azure regions where GPT-4 Turbo with Vision is available.
 
You use the same API call as in the above section, but you must include the `enhancements` and `dataSources` objects in the request body. `enhancements` represents the specific Vision enhancement features requested in the chat. It has a `grounding` and `ocr` property, which each have a boolean `enabled` property. Use these to request the OCR service and/or the object detection/grounding service. `dataSources` represents the Computer Vision resource data that's needed for Vision enhancement. It has a `type` property which should be `"AzureComputerVision"` and a `parameters` property. Set the `endpoint` and `key` to the endpoint URL and access key of your Computer Vision resource.

```json
{
    "enhancements": {
            "ocr": {
              "enabled": true
            },
            "grounding": {
              "enabled": true
            }
    },
    "dataSources": [
    {
        "type": "AzureComputerVision",
        "parameters": {
            "endpoint": "<your_computer_vision_endpoint>",
            "key": "<your_computer_vision_key>"
        }
    }],
    "messages": [ 
        {
            "role": "system", 
            "content": "You are a helpful assistant." 
        },
        {
            "role": "user", 
            "content": [ 
                "Describe this picture:", { "image": "URL or base-64-encoded image" } 
            ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```

The chat responses you receive from the model should now include enhanced information about the image, such as object labels and bounding boxes, and OCR results.

 ## Low or high fidelity image understanding

By controlling the _detail_ parameter, which has two options, `low` or `high`, you can control how the model processes the image and generates its textual understanding.
- `low` disables the "high res" mode. The model receives a low-res 512x512 version of the image and represents the image with a budget of 65 tokens. This allows the API to return faster responses and consume fewer input tokens for use cases that don't require high detail.
- `high` enables "high res" mode, which first allows the model to see the low res image and then creates detailed crops of input images as 512x512 squares based on the input image size. Each of the detailed crops uses twice the token budget (65 tokens) for a total of 129 tokens.

## Limitations

### Image support

- **Limitation on image enhancements per chat session**: Enhancements cannot be applied to multiple images within a single chat call.
- **Maximum input image size**: The maximum size for input images is restricted to 4 MB.
- **Object grounding in enhancement API**: When the enhancement API is used for object grounding, and the model detects duplicates of an object, it will generate one bounding box and label for all the duplicates instead of separate ones for each.
- **Low resolution accuracy**: When images are analyzed using the "low resolution" setting, it allows for faster responses and uses fewer input tokens for certain use cases. However, this could impact the accuracy of object and text recognition within the image.
- **Image chat restriction**: When uploading images in the chat playground or the API, there is a limit of 10 images per chat call.

### Video support

- **Low resolution**: Video frames are analyzed using GPT-4 Turbo with Vision's "low resolution" setting, which may affect the accuracy of small object and text recognition in the video.
- **Video file limits**: Both MP4 and MOV file types are supported. In the Azure AI Playground, videos must be less than 3 minutes long. When you use the API there is no such limitation.
- **Prompt limits**: Video prompts only contain one video and no images. In Playground, you can clear the session to try another video or images.
- **Limited frame selection**: The service selects 20 frames from the entire video, which might not capture all the critical moments or details. Frame selection can be approximately evenly spread through the video or focused by a specific video retrieval query, depending on the prompt.
- **Language support**: The service primarily supports English for grounding with transcripts. Transcripts don't provide accurate information on lyrics in songs.

## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* [GPT-4 Turbo with Vision quickstart](../gpt-v-quickstart.md)
* [GPT-4 Turbo with Vision frequently asked questions](../faq.yml#gpt-4-turbo-with-vision)
* [GPT-4 Turbo with Vision API reference](https://aka.ms/gpt-v-api-ref)
