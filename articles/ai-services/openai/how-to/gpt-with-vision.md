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

The GPT-4 Turbo with Vision model answers general questions about what's present in the images. You can also show it video if you use [Vision enhancement](#use-vision-enhancement-with-video).

> [!TIP]
> To use GPT-4 Turbo with Vision, you call the Chat Completion API on a GPT-4 Turbo with Vision model that you have deployed. If you're not familiar with the Chat Completion API, see the [GPT-4 Turbo & GPT-4 how-to guide](/azure/ai-services/openai/how-to/chatgpt?tabs=python&pivots=programming-language-chat-completions).

## Call the Chat Completion APIs

The following REST command shows the most basic way to use the GPT-4 Turbo with Vision model with code. If this is your first time using these models programmatically, we recommend starting with our [GPT-4 Turbo with Vision quickstart](../gpt-v-quickstart.md). 

Send a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2023-12-01-preview` where 

- RESOURCE_NAME is the name of your Azure OpenAI resource 
- DEPLOYMENT_NAME is the name of your GPT-4 Turbo with Vision model deployment 

**Required headers**: 
- `Content-Type`: application/json 
- `api-key`: {API_KEY} 

**Body**: 
The following is a sample request body. The format is the same as the chat completions API for GPT-4, except that the message content can be an array containing strings and images (either a valid HTTP or HTTPS URL to an image, or a base-64-encoded image). Remember to set a `"max_tokens"` value, or the return output will be cut off.

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
	            {
	                "type": "text",
	                "text": "Describe this picture:"
	            },
	            {
	                "type": "image_url",
	                "image_url": {
                        "url": "<URL or base-64-encoded image>"
                    }
                } 
           ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```

### Output

The API response should look like the following.

```json
{
    "id": "chatcmpl-8VAVx58veW9RCm5K1ttmxU6Cm4XDX",
    "object": "chat.completion",
    "created": 1702439277,
    "model": "gpt-4",
    "prompt_filter_results": [
        {
            "prompt_index": 0,
            "content_filter_results": {
                "hate": {
                    "filtered": false,
                    "severity": "safe"
                },
                "self_harm": {
                    "filtered": false,
                    "severity": "safe"
                },
                "sexual": {
                    "filtered": false,
                    "severity": "safe"
                },
                "violence": {
                    "filtered": false,
                    "severity": "safe"
                }
            }
        }
    ],
    "choices": [
        {
            "finish_reason":"stop",
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "The picture shows an individual dressed in formal attire, which includes a black tuxedo with a black bow tie. There is an American flag on the left lapel of the individual's jacket. The background is predominantly blue with white text that reads \"THE KENNEDY PROFILE IN COURAGE AWARD\" and there are also visible elements of the flag of the United States placed behind the individual."
            },
            "content_filter_results": {
                "hate": {
                    "filtered": false,
                    "severity": "safe"
                },
                "self_harm": {
                    "filtered": false,
                    "severity": "safe"
                },
                "sexual": {
                    "filtered": false,
                    "severity": "safe"
                },
                "violence": {
                    "filtered": false,
                    "severity": "safe"
                }
            }
        }
    ],
    "usage": {
        "prompt_tokens": 1156,
        "completion_tokens": 80,
        "total_tokens": 1236
    }
}
```

Every response includes a `"finish_reason"` field. It has the following possible values:
- `stop`: API returned complete model output.
- `length`: Incomplete model output due to the `max_tokens` input parameter or model's token limit.
- `content_filter`: Omitted content due to a flag from our content filters.

## Detail parameter settings in image processing: Low, High, Auto  

The detail parameter in the model offers three choices: `low`, `high`, or `auto`, to adjust the way the model interprets and processes images. The default setting is auto, where the model decides between low or high based on the size of the image input. 
- `low` setting: the model does not activate the "high res" mode, instead processes a lower resolution 512x512 version, resulting in quicker responses and reduced token consumption for scenarios where fine detail isn't crucial.
- `high` setting: the model activates "high res" mode. Here, the model initially views the low-resolution image and then generates detailed 512x512 segments from the input image. Each segment uses double the token budget, allowing for a more detailed interpretation of the image.''

For details on how the image parameters impact tokens used and pricing please see - [What is OpenAI? Image Tokens with GPT-4 Turbo with Vision](../overview.md#image-tokens-gpt-4-turbo-with-vision)

## Use Vision enhancement with images

GPT-4 Turbo with Vision provides exclusive access to Azure AI Services tailored enhancements. When combined with Azure AI Vision, it enhances your chat experience by providing the chat model with more detailed information about visible text in the image and the locations of objects.

The **Optical character recognition (OCR)** integration allows the model to produce higher quality responses for dense text, transformed images, and number-heavy financial documents. It also covers a wider range of languages.

The **object grounding** integration brings a new layer to data analysis and user interaction, as the feature can visually distinguish and highlight important elements in the images it processes.

> [!IMPORTANT]
> To use Vision enhancement, you need a Computer Vision resource, and it must be in the same Azure region as your GPT-4 Turbo with Vision resource.

> [!CAUTION]
> Azure AI enhancements for GPT-4 Turbo with Vision will be billed separately from the core functionalities. Each specific Azure AI enhancement for GPT-4 Turbo with Vision has its own distinct charges.

Send a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/extensions/chat/completions?api-version=2023-12-01-preview` where 

- RESOURCE_NAME is the name of your Azure OpenAI resource 
- DEPLOYMENT_NAME is the name of your GPT-4 Turbo with Vision model deployment 

**Required headers**: 
- `Content-Type`: application/json 
- `api-key`: {API_KEY} 

**Body**: 

The format is similar to that of the chat completions API for GPT-4, but the message content can be an array containing strings and images (either a valid HTTP or HTTPS URL to an image, or a base-64-encoded image).

You must also include the `enhancements` and `dataSources` objects. `enhancements` represents the specific Vision enhancement features requested in the chat. It has a `grounding` and `ocr` property, which each have a boolean `enabled` property. Use these to request the OCR service and/or the object detection/grounding service. `dataSources` represents the Computer Vision resource data that's needed for Vision enhancement. It has a `type` property which should be `"AzureComputerVision"` and a `parameters` property. Set the `endpoint` and `key` to the endpoint URL and access key of your Computer Vision resource. Remember to set a `"max_tokens"` value, or the return output will be cut off.

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
	            {
	                "type": "text",
	                "text": "Describe this picture:"
	            },
	            {
	                "type": "image_url",
	                "image_url": {
                        "url":"<URL or base-64-encoded image>" 
                    }
                }
           ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```

### Output

The chat responses you receive from the model should now include enhanced information about the image, such as object labels and bounding boxes, and OCR results. The API response should look like the following.

```json
{
    "id": "chatcmpl-8UyuhLfzwTj34zpevT3tWlVIgCpPg",
    "object": "chat.completion",
    "created": 1702394683,
    "model": "gpt-4",
    "choices":
    [
        {
            "finish_reason":"stop",
            "index": 0,
            "message":
            {
                "role": "assistant",
                "content": "The image shows a close-up of an individual with dark hair and what appears to be a short haircut. The person has visible ears and a bit of their neckline. The background is a neutral light color, providing a contrast to the dark hair."
            },
            "enhancements":
            {
                "grounding":
                {
                    "lines":
                    [
                        {
                            "text": "The image shows a close-up of an individual with dark hair and what appears to be a short haircut. The person has visible ears and a bit of their neckline. The background is a neutral light color, providing a contrast to the dark hair.",
                            "spans":
                            [
                                {
                                    "text": "the person",
                                    "length": 10,
                                    "offset": 99,
                                    "polygon": [{"x":0.11950000375509262,"y":0.4124999940395355},{"x":0.8034999370574951,"y":0.4124999940395355},{"x":0.8034999370574951,"y":0.6434999704360962},{"x":0.11950000375509262,"y":0.6434999704360962}]
                                }
                            ]
                        }
                    ],
                    "status": "Success"
                }
            }
        }
    ],
    "usage":
    {
        "prompt_tokens": 816,
        "completion_tokens": 49,
        "total_tokens": 865
    }
}
```

Every response includes a `"finish_reason"` field. It has the following possible values:
- `stop`: API returned complete model output.
- `length`: Incomplete model output due to the `max_tokens` input parameter or model's token limit.
- `content_filter`: Omitted content due to a flag from our content filters.

## Use Vision enhancement with video

GPT-4 Turbo with Vision provides exclusive access to Azure AI Services tailored enhancements. The **video prompt** integration uses Azure AI Vision video retrieval to sample a set of frames from a video and create a transcript of the speech in the video. It enables the AI model to give summaries and answers about video content.

> [!IMPORTANT]
> To use Vision enhancement, you need a Computer Vision resource, and it must be in the same Azure region as your GPT-4 Turbo with Vision resource.

> [!CAUTION]
> Azure AI enhancements for GPT-4 Turbo with Vision will be billed separately from the core functionalities. Each specific Azure AI enhancement for GPT-4 Turbo with Vision has its own distinct charges. For details, see the [special pricing information](../concepts/gpt-with-vision.md#special-pricing-information).

Follow these steps to set up a video retrieval system and integrate it with your AI chat model:
1. Get an Azure AI Vision resource in the same region as the Azure OpenAI resource you're using.
1. Follow the instructions in  [Do video retrieval using vectorization](/azure/ai-services/computer-vision/how-to/video-retrieval) to create a video retrieval index. Return to this guide once your index is created.
1. Save the index name, the `documentId` values of your videos, and the blob storage SAS URLs of your videos to a temporary location. You'll need these values the next steps.
1. Prepare a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/extensions/chat/completions?api-version=2023-12-01-preview` where 

    - RESOURCE_NAME is the name of your Azure OpenAI resource 
    - DEPLOYMENT_NAME is the name of your GPT-4 Vision model deployment 
        
    **Required headers**: 
    - `Content-Type`: application/json 
    - `api-key`: {API_KEY} 
1. Add the following JSON structure in the request body:
    ```json
    {
        "enhancements": {
                "video": {
                  "enabled": true
                }
        },
        "dataSources": [
        {
            "type": "AzureComputerVisionVideoIndex",
            "parameters": {
                "computerVisionBaseUrl": "<your_computer_vision_endpoint>",
                "computerVisionApiKey": "<your_computer_vision_key>",
                "indexName": "<name_of_your_index>",
                "videoUrls": ["<your_video_SAS_URL>"]
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
                        {
                            "type": "text",
                            "text": "Describe this video:"
                        }
                    ]
            },
            {
                "role": "user",
                "content": [
                        {
                            "type": "acv_document_id",
                            "acv_document_id": "<your_video_ID>"
                        }
                    ]
            }
        ],
        "max_tokens": 100, 
    } 
    ```

    The request includes the `enhancements` and `dataSources` objects. `enhancements` represents the specific Vision enhancement features requested in the chat. `dataSources` represents the Computer Vision resource data that's needed for Vision enhancement. It has a `type` property which should be `"AzureComputerVisionVideoIndex"` and a `parameters` property which contains your AI Vision and video information.
1. Fill in all the `<placeholder>` fields above with your own information: enter the endpoint URLs and keys of your OpenAI and AI Vision resources where appropriate, and retrieve the video index information from the earlier step.
1. Send the POST request to the API endpoint. It should contain your OpenAI and AI Vision credentials, the name of your video index, and the ID and SAS URL of a single video.


### Output

The chat responses you receive from the model should include information about the video. The API response should look like the following.


```json
{
    "id": "chatcmpl-8V4J2cFo7TWO7rIfs47XuDzTKvbct",
    "object": "chat.completion",
    "created": 1702415412,
    "model": "gpt-4",
    "choices":
    [
        {
            "finish_reason":"stop",
            "index": 0,
            "message":
            {
                "role": "assistant",
                "content": "The advertisement video opens with a blurred background that suggests a serene and aesthetically pleasing environment, possibly a workspace with a nature view. As the video progresses, a series of frames showcase a digital interface with search bars and prompts like \"Inspire new ideas,\" \"Research a topic,\" and \"Organize my plans,\" suggesting features of a software or application designed to assist with productivity and creativity.\n\nThe color palette is soft and varied, featuring pastel blues, pinks, and purples, creating a calm and inviting atmosphere. The backgrounds of some frames are adorned with abstract, organically shaped elements and animations, adding to the sense of innovation and modernity.\n\nMidway through the video, the focus shifts to what appears to be a browser or software interface with the phrase \"Screens simulated, subject to change; feature availability and timing may vary,\" indicating the product is in development and that the visuals are illustrative of its capabilities.\n\nThe use of text prompts continues with \"Help me relax,\" followed by a demonstration of a 'dark mode' feature, providing a glimpse into the software's versatility and user-friendly design.\n\nThe video concludes by revealing the product name, \"Copilot,\" and positioning it as \"Your everyday AI companion,\" implying the use of artificial intelligence to enhance daily tasks. The final frames feature the Microsoft logo, associating the product with the well-known technology company.\n\nIn summary, the advertisement video is for a Microsoft product named \"Copilot,\" which seems to be an AI-powered software tool aimed at improving productivity, creativity, and organization for its users. The video conveys a message of innovation, ease, and support in daily digital interactions through a visually appealing and calming presentation."
            }
        }
    ],
    "usage":
    {
        "prompt_tokens": 2068,
        "completion_tokens": 341,
        "total_tokens": 2409
    }
}
```

Every response includes a `"finish_reason"` field. It has the following possible values:
- `stop`: API returned complete model output.
- `length`: Incomplete model output due to the `max_tokens` input parameter or model's token limit.
- `content_filter`: Omitted content due to a flag from our content filters.

### Pricing example for Video prompts
The pricing for GPT-4 Turbo with Vision is dynamic and depends on the specific features and inputs used. For a comprehensive view of Azure OpenAI pricing see [Azure OpenAI Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/).

The base charges and additional features are outlined below:

Base Pricing for GPT-4 Turbo with Vision is:
- Input: $0.01 per 1000 tokens
- Output: $0.03 per 1000 tokens
  
Video prompt integration with Video Retrieval Add-on:
- Ingestion: $0.05 per minute of video
- Transactions: $0.25 per 1000 queries of the Video Retrieval indexer

## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* [GPT-4 Turbo with Vision quickstart](../gpt-v-quickstart.md)
* [GPT-4 Turbo with Vision frequently asked questions](../faq.yml#gpt-4-turbo-with-vision)
* [GPT-4 Turbo with Vision API reference](https://aka.ms/gpt-v-api-ref)
