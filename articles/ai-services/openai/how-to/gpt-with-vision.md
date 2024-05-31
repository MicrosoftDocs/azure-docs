---
title: How to use the GPT-4 Turbo with Vision model
titleSuffix: Azure OpenAI Service
description: Learn about the options for using GPT-4 Turbo with Vision
author: PatrickFarley #dereklegenzoff
ms.author: pafarley #delegenz
ms.service: azure-ai-openai
ms.topic: how-to
ms.date: 11/06/2023
manager: nitinme
---

# Use GPT-4 Turbo with Vision


GPT-4 Turbo with Vision is a large multimodal model (LMM) developed by OpenAI that can analyze images and provide textual responses to questions about them. It incorporates both natural language processing and visual understanding.

The GPT-4 Turbo with Vision model answers general questions about what's present in the images. You can also show it video if you use [Vision enhancement](#use-vision-enhancement-with-video).

> [!TIP]
> To use GPT-4 Turbo with Vision, you call the Chat Completion API on a GPT-4 Turbo with Vision model that you have deployed. If you're not familiar with the Chat Completion API, see the [GPT-4 Turbo & GPT-4 how-to guide](/azure/ai-services/openai/how-to/chatgpt?tabs=python&pivots=programming-language-chat-completions).

## GPT-4 Turbo model upgrade

[!INCLUDE [GPT-4 Turbo](../includes/gpt-4-turbo.md)]

## Call the Chat Completion APIs

The following command shows the most basic way to use the GPT-4 Turbo with Vision model with code. If this is your first time using these models programmatically, we recommend starting with our [GPT-4 Turbo with Vision quickstart](../gpt-v-quickstart.md). 

#### [REST](#tab/rest)

Send a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/chat/completions?api-version=2023-12-01-preview` where 

- RESOURCE_NAME is the name of your Azure OpenAI resource 
- DEPLOYMENT_NAME is the name of your GPT-4 Turbo with Vision model deployment 

**Required headers**: 
- `Content-Type`: application/json 
- `api-key`: {API_KEY} 



**Body**: 
The following is a sample request body. The format is the same as the chat completions API for GPT-4, except that the message content can be an array containing text and images (either a valid HTTP or HTTPS URL to an image, or a base-64-encoded image). 

> [!IMPORTANT]
> Remember to set a `"max_tokens"` value, or the return output will be cut off.

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
                        "url": "<image URL>"
                    }
                } 
           ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```

#### [Python](#tab/python)

1. Define your Azure OpenAI resource endpoint and key. 
1. Enter the name of your GPT-4 Turbo with Vision model deployment.
1. Create a client object using those values.

    ```python
    api_base = '<your_azure_openai_endpoint>' # your endpoint should look like the following https://YOUR_RESOURCE_NAME.openai.azure.com/
    api_key="<your_azure_openai_key>"
    deployment_name = '<your_deployment_name>'
    api_version = '2023-12-01-preview' # this might change in the future
    
    client = AzureOpenAI(
        api_key=api_key,  
        api_version=api_version,
        base_url=f"{api_base}openai/deployments/{deployment_name}/extensions",
    )
    ```

1. Then call the client's **create** method. The following code shows a sample request body. The format is the same as the chat completions API for GPT-4, except that the message content can be an array containing text and images (either a valid HTTP or HTTPS URL to an image, or a base-64-encoded image). 

    > [!IMPORTANT]
    > Remember to set a `"max_tokens"` value, or the return output will be cut off.
    
    ```python
    response = client.chat.completions.create(
        model=deployment_name,
        messages=[
            { "role": "system", "content": "You are a helpful assistant." },
            { "role": "user", "content": [  
                { 
                    "type": "text", 
                    "text": "Describe this picture:" 
                },
                { 
                    "type": "image_url",
                    "image_url": {
                        "url": "<image URL>"
                    }
                }
            ] } 
        ],
        max_tokens=2000 
    )
    print(response)
    ```

---

> [!TIP]
> ### Use a local image
>
> If you want to use a local image, you can use the following Python code to convert it to base64 so it can be passed to the API. Alternative file conversion tools are available online.
>
> ```python
> import base64
> from mimetypes import guess_type
> 
> # Function to encode a local image into data URL 
> def local_image_to_data_url(image_path):
>     # Guess the MIME type of the image based on the file extension
>     mime_type, _ = guess_type(image_path)
>     if mime_type is None:
>         mime_type = 'application/octet-stream'  # Default MIME type if none is found
> 
>     # Read and encode the image file
>     with open(image_path, "rb") as image_file:
>         base64_encoded_data = base64.b64encode(image_file.read()).decode('utf-8')
> 
>     # Construct the data URL
>     return f"data:{mime_type};base64,{base64_encoded_data}"
> 
> # Example usage
> image_path = '<path_to_image>'
> data_url = local_image_to_data_url(image_path)
> print("Data URL:", data_url)
> ```
>
> When your base64 image data is ready, you can pass it to the API in the request body like this:
> 
> ```json
> ...
> "type": "image_url",
> "image_url": {
>    "url": "data:image/jpeg;base64,<your_image_data>"
> }
> ...
> ```

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

Every response includes a `"finish_details"` field. It has the following possible values:
- `stop`: API returned complete model output.
- `length`: Incomplete model output due to the `max_tokens` input parameter or model's token limit.
- `content_filter`: Omitted content due to a flag from our content filters.

## Detail parameter settings in image processing: Low, High, Auto  

The _detail_ parameter in the model offers three choices: `low`, `high`, or `auto`, to adjust the way the model interprets and processes images. The default setting is auto, where the model decides between low or high based on the size of the image input. 
- `low` setting: the model does not activate the "high res" mode, instead processes a lower resolution 512x512 version, resulting in quicker responses and reduced token consumption for scenarios where fine detail isn't crucial.
- `high` setting: the model activates "high res" mode. Here, the model initially views the low-resolution image and then generates detailed 512x512 segments from the input image. Each segment uses double the token budget, allowing for a more detailed interpretation of the image.''

For details on how the image parameters impact tokens used and pricing please see - [What is OpenAI? Image Tokens with GPT-4 Turbo with Vision](../overview.md#image-tokens-gpt-4-turbo-with-vision)

## Use Vision enhancement with images

GPT-4 Turbo with Vision provides exclusive access to Azure AI Services tailored enhancements. When combined with Azure AI Vision, it enhances your chat experience by providing the chat model with more detailed information about visible text in the image and the locations of objects.

The **Optical character recognition (OCR)** integration allows the model to produce higher quality responses for dense text, transformed images, and number-heavy financial documents. It also covers a wider range of languages.

The **object grounding** integration brings a new layer to data analysis and user interaction, as the feature can visually distinguish and highlight important elements in the images it processes.

> [!IMPORTANT]
> To use the Vision enhancement with an Azure OpenAI resource, you need to specify a Computer Vision resource. It must be in the paid (S1) tier and in the same Azure region as your GPT-4 Turbo with Vision resource. If you're using an Azure AI Services resource, you don't need an additional Computer Vision resource.

> [!CAUTION]
> Azure AI enhancements for GPT-4 Turbo with Vision will be billed separately from the core functionalities. Each specific Azure AI enhancement for GPT-4 Turbo with Vision has its own distinct charges. For details, see the [special pricing information](../concepts/gpt-with-vision.md#special-pricing-information).

#### [REST](#tab/rest)

Send a POST request to `https://{RESOURCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}/extensions/chat/completions?api-version=2023-12-01-preview` where 

- RESOURCE_NAME is the name of your Azure OpenAI resource 
- DEPLOYMENT_NAME is the name of your GPT-4 Turbo with Vision model deployment 

**Required headers**: 
- `Content-Type`: application/json 
- `api-key`: {API_KEY} 

**Body**: 

The format is similar to that of the chat completions API for GPT-4, but the message content can be an array containing strings and images (either a valid HTTP or HTTPS URL to an image, or a base-64-encoded image).

You must also include the `enhancements` and `dataSources` objects. `enhancements` represents the specific Vision enhancement features requested in the chat. It has a `grounding` and `ocr` property, which both have a boolean `enabled` property. Use these to request the OCR service and/or the object detection/grounding service. `dataSources` represents the Computer Vision resource data that's needed for Vision enhancement. It has a `type` property which should be `"AzureComputerVision"` and a `parameters` property. Set the `endpoint` and `key` to the endpoint URL and access key of your Computer Vision resource. 

> [!IMPORTANT]
> Remember to set a `"max_tokens"` value, or the return output will be cut off.


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
                        "url":"<image URL>" 
                    }
                }
           ] 
        }
    ],
    "max_tokens": 100, 
    "stream": false 
} 
```

#### [Python](#tab/python)

You call the same method as in the previous step, but include the new *extra_body* parameter. It contains the `enhancements` and `dataSources` fields. 

`enhancements` represents the specific Vision enhancement features requested in the chat. It has a `grounding` and `ocr` field, which both have a boolean `enabled` property. Use these to request the OCR service and/or the object detection/grounding service. 

`dataSources` represents the Computer Vision resource data that's needed for Vision enhancement. It has a `type` field which should be `"AzureComputerVision"` and a `parameters` field. Set the `endpoint` and `key` to the endpoint URL and access key of your Computer Vision resource. R

> [!IMPORTANT]
> Remember to set a `"max_tokens"` value, or the return output will be cut off.


```python
response = client.chat.completions.create(
    model=deployment_name,
    messages=[
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": [  
            { 
                "type": "text", 
                "text": "Describe this picture:" 
            },
            { 
                "type": "image_url",
                "image_url": {
                    "url": "<image URL>"
                }
            }
        ] } 
    ],
    extra_body={
        "dataSources": [
            {
                "type": "AzureComputerVision",
                "parameters": {
                    "endpoint": "<your_computer_vision_endpoint>",
                    "key": "<your_computer_vision_key>"
                }
            }],
        "enhancements": {
            "ocr": {
                "enabled": True
            },
            "grounding": {
                "enabled": True
            }
        }
    },
    max_tokens=2000
)
print(response)
```


---

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
            "finish_details": {
                "type": "stop",
                "stop": "<|fim_suffix|>"
            },
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

Every response includes a `"finish_details"` field. It has the following possible values:
- `stop`: API returned complete model output.
- `length`: Incomplete model output due to the `max_tokens` input parameter or model's token limit.
- `content_filter`: Omitted content due to a flag from our content filters.

## Use Vision enhancement with video

GPT-4 Turbo with Vision provides exclusive access to Azure AI Services tailored enhancements. The **video prompt** integration uses Azure AI Vision video retrieval to sample a set of frames from a video and create a transcript of the speech in the video. It enables the AI model to give summaries and answers about video content.

Follow these steps to set up a video retrieval system and integrate it with your AI chat model.

> [!IMPORTANT]
> To use the Vision enhancement with an Azure OpenAI resource, you need to specify a Computer Vision resource. It must be in the paid (S1) tier and in the same Azure region as your GPT-4 Turbo with Vision resource. If you're using an Azure AI Services resource, you don't need an additional Computer Vision resource.

> [!CAUTION]
> Azure AI enhancements for GPT-4 Turbo with Vision will be billed separately from the core functionalities. Each specific Azure AI enhancement for GPT-4 Turbo with Vision has its own distinct charges. For details, see the [special pricing information](../concepts/gpt-with-vision.md#special-pricing-information).

> [!TIP]
> If you prefer, you can carry out the below steps using a Jupyter notebook instead: [Video chat completions notebook](https://github.com/Azure-Samples/azureai-samples/blob/main/scenarios/GPT-4V/video/video_chatcompletions_example_restapi.ipynb). 

### Upload videos to Azure Blob Storage

You need to upload your videos to an Azure Blob Storage container. [Create a new storage account](https://ms.portal.azure.com/#create/Microsoft.StorageAccount) if you don't have one already.

Once your videos are uploaded, you can get their SAS URLs, which you use to access them in later steps.

#### Ensure proper read access

Depending on your authentication method, you may need to do some extra steps to grant access to the Azure Blob Storage container. If you're using an Azure AI Services resource instead of an Azure OpenAI resource, you need to use Managed Identities to grant it **read** access to Azure Blob Storage:

#### [using System assigned identities](#tab/system-assigned)

Enable System assigned identities on your Azure AI Services resource by following these steps:
1. From your AI Services resource in Azure portal select **Resource Management** -> **Identity** and toggle the status to **ON**.
1. Assign **Storage Blob Data Read** access to the AI Services resource: From the **Identity** page, select **Azure role assignments**, and then **Add role assignment** with the following settings:
    - scope: storage
    - subscription: {your subscription}
    - Resource: {select the Azure Blob Storage resource}
    - Role: Storage Blob Data Reader
1. Save your settings.

#### [using User assigned identities](#tab/user-assigned)

To use a User assigned identity on your Azure AI Services resource, follow these steps:
1. Create a new Managed Identity resource in the Azure portal.
1. Navigate to the new resource, then to **Azure Role Assignments**.
1. Add a **New Role Assignment** with the following settings:
    - scope: storage
    - subscription: {your subscription}
    - Resource: {select the Azure Blob Storage resource}
    - Role: Storage Blob Data Reader
1. Save your new configuration.
1. Navigate to your AI Services resource's **Identity** page.
1. Select the **User Assigned** Tab, then click **+Add** to select the newly created Managed Identity.
1. Save your configuration.

---

### Create a video retrieval index

1. Get an Azure AI Vision resource in the same region as the Azure OpenAI resource you're using.
1. Create an index to store and organize the video files and their metadata. The example command below demonstrates how to create an index named `my-video-index` using the **[Create Index](/azure/ai-services/computer-vision/reference-video-search)** API. Save the index name to a temporary location; you'll need it in later steps. 

    > [!TIP]
    > For more detailed instructions on creating a video index, see [Do video retrieval using vectorization](/azure/ai-services/computer-vision/how-to/video-retrieval).
        
    ```bash
    curl.exe -v -X PUT "https://<YOUR_ENDPOINT_URL>/computervision/retrieval/indexes/my-video-index?api-version=2023-05-01-preview" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY>" -H "Content-Type: application/json" --data-ascii "
    {
      'metadataSchema': {
        'fields': [
          {
            'name': 'cameraId',
            'searchable': false,
            'filterable': true,
            'type': 'string'
          },
          {
            'name': 'timestamp',
            'searchable': false,
            'filterable': true,
            'type': 'datetime'
          }
        ]
      },
      'features': [
        {
          'name': 'vision',
          'domain': 'surveillance'
        },
        {
          'name': 'speech'
        }
      ]
    }"
    ```

1. Add video files to the index with their associated metadata. The example below demonstrates how to add two video files to the index using SAS URLs with the **[Create Ingestion](/azure/ai-services/computer-vision/reference-video-search)** API. Save the SAS URLs and `documentId` values to a temporary location; you'll need them in later steps.
    
    ```bash
    curl.exe -v -X PUT "https://<YOUR_ENDPOINT_URL>/computervision/retrieval/indexes/my-video-index/ingestions/my-ingestion?api-version=2023-05-01-preview" -H "Ocp-Apim-Subscription-Key: <YOUR_SUBSCRIPTION_KEY>" -H "Content-Type: application/json" --data-ascii "
    {
      'videos': [
        {
          'mode': 'add',
          'documentId': '02a504c9cd28296a8b74394ed7488045',
          'documentUrl': 'https://example.blob.core.windows.net/videos/02a504c9cd28296a8b74394ed7488045.mp4?sas_token_here',
          'metadata': {
            'cameraId': 'camera1',
            'timestamp': '2023-06-30 17:40:33'
          }
        },
        {
          'mode': 'add',
          'documentId': '043ad56daad86cdaa6e493aa11ebdab3',
          'documentUrl': '[https://example.blob.core.windows.net/videos/043ad56daad86cdaa6e493aa11ebdab3.mp4?sas_token_here',
          'metadata': {
            'cameraId': 'camera2'
          }
        }
      ]
    }"
    ```

1. After you add video files to the index, the ingestion process starts. It might take some time depending on the size and number of files. To ensure the ingestion is complete before performing searches, you can use the **[Get Ingestion](/en-us/azure/ai-services/computer-vision/reference-video-search)** API to check the status. Wait for this call to return `"state" = "Completed"` before proceeding to the next step. 
    
    ```bash
    curl.exe -v -X GET "https://<YOUR_ENDPOINT_URL>/computervision/retrieval/indexes/my-video-index/ingestions?api-version=2023-05-01-preview&$top=20" -H "ocp-apim-subscription-key: <YOUR_SUBSCRIPTION_KEY>"
    ```

### Integrate your video index with GPT-4 Turbo with Vision

#### [REST](#tab/rest)

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
                            "type": "acv_document_id",
                            "acv_document_id": "<your_video_ID>"
                        },
                        {
                            "type": "text",
                            "text": "Describe this video:"
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

#### [Python](#tab/python)

In your Python script, call the client's **create** method as in the previous sections, but include the *extra_body* parameter. Here, it contains the `enhancements` and `data_sources` fields. `enhancements` represents the specific Vision enhancement features requested in the chat. It has a `video` field, which has a boolean `enabled` property. Use this to request the video retrieval service. 

`data_sources` represents the external resource data that's needed for Vision enhancement. It has a `type` field which should be `"AzureComputerVisionVideoIndex"` and a `parameters` field. 

Set the `computerVisionBaseUrl` and `computerVisionApiKey` to the endpoint URL and access key of your Computer Vision resource. Set `indexName` to the name of your video index. Set `videoUrls` to a list of SAS URLs of your videos. 

> [!IMPORTANT]
> Remember to set a `"max_tokens"` value, or the return output will be cut off.

```python
response = client.chat.completions.create(
    model=deployment_name,
    messages=[
        { "role": "system", "content": "You are a helpful assistant." },
        { "role": "user", "content": [  
            {
                "type": "acv_document_id",
                "acv_document_id": "<your_video_ID>"
            },
            { 
                "type": "text", 
                "text": "Describe this video:" 
            }
        ] } 
    ],
    extra_body={
        "data_sources": [
            {
                "type": "AzureComputerVisionVideoIndex",
                "parameters": {
                    "computerVisionBaseUrl": "<your_computer_vision_endpoint>", # your endpoint should look like the following https://YOUR_RESOURCE_NAME.cognitiveservices.azure.com/computervision
                    "computerVisionApiKey": "<your_computer_vision_key>",
                    "indexName": "<name_of_your_index>",
                    "videoUrls": ["<your_video_SAS_URL>"]
                }
            }],
        "enhancements": {
            "video": {
                "enabled": True
            }
        }
    },
    max_tokens=100
)

print(response)
```
---

> [!IMPORTANT]
> The `"data_sources"` object's content varies depending on which Azure resource type and authentication method you're using. See the following reference:
> 
> #### [Azure OpenAI resource](#tab/resource)
> 
> ```json
> "data_sources": [
> {
>     "type": "AzureComputerVisionVideoIndex",
>     "parameters": {
>     "endpoint": "<your_computer_vision_endpoint>",
>     "computerVisionApiKey": "<your_computer_vision_key>",
>     "indexName": "<name_of_your_index>",
>     "videoUrls": ["<your_video_SAS_URL>"]
>     }
> }],
> ```
> 
> #### [Azure AIServices resource + SAS authentication](#tab/resource-sas)
> 
> ```json
> "data_sources": [
> {
>     "type": "AzureComputerVisionVideoIndex",
>     "parameters": {
>     "indexName": "<name_of_your_index>",
>     "videoUrls": ["<your_video_SAS_URL>"]
>     }
> }],
> ```	
> 
> #### [Azure AIServices resource + Managed Identities](#tab/resource-mi)
> 
> ```json
> "data_sources": [
> {
>     "type": "AzureComputerVisionVideoIndex",
>     "parameters": {
>         "indexName": "<name_of_your_index>",
>         "documentAuthenticationKind": "managedidentity",
>     }
> }],
> ```	
> ---

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

Every response includes a `"finish_details"` field. It has the following possible values:
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
- Transactions: $0.25 per 1000 queries of the Video Retrieval

## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* [GPT-4 Turbo with Vision quickstart](../gpt-v-quickstart.md)
* [GPT-4 Turbo with Vision frequently asked questions](../faq.yml#gpt-4-turbo-with-vision)
* [GPT-4 Turbo with Vision API reference](https://aka.ms/gpt-v-api-ref)
