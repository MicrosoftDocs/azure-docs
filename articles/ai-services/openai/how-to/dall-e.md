---
title: How to work with DALL-E models 
titleSuffix: Azure OpenAI Service
description: Learn about the options for how to use the DALL-E image generation models.
author: PatrickFarley
ms.author: pafarley 
ms.service: azure-ai-openai
ms.custom: 
ms.topic: how-to
ms.date: 03/04/2024
manager: nitinme
keywords: 
zone_pivot_groups: 
# Customer intent: as an engineer or hobbyist, I want to know how to use DALL-E image generation models to their full capability.
---

# Learn how to work with the DALL-E models

OpenAI's DALL-E models generate images based on user-provided text prompts. This guide demonstrates how to use the DALL-E models and configure their options through REST API calls.


## Prerequisites

#### [DALL-E 3](#tab/dalle3)

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- An Azure OpenAI resource created in the `SwedenCentral` region.
- Then, you need to deploy a `dalle3` model with your Azure resource. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

#### [DALL-E 2 (preview)](#tab/dalle2)

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- An Azure OpenAI resource created in the East US region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

---

## Call the Image Generation APIs

The following command shows the most basic way to use DALL-E with code. If this is your first time using these models programmatically, we recommend starting with the [DALL-E quickstart](/azure/ai-services/openai/dall-e-quickstart).


#### [DALL-E 3](#tab/dalle3)


Send a POST request to:

```
https://<your_resource_name>.openai.azure.com/openai/deployments/<your_deployment_name>/images/generations?api-version=<api_version>
```

where:
- `<your_resource_name>` is the name of your Azure OpenAI resource.
- `<your_deployment_name>` is the name of your DALL-E 3 model deployment.
- `<api_version>` is the version of the API you want to use. For example, `2024-02-01`.

**Required headers**:
- `Content-Type`: `application/json`
- `api-key`: `<your_API_key>`

**Body**:

The following is a sample request body. You specify a number of options, defined in later sections.

```json
{
    "prompt": "A multi-colored umbrella on the beach, disposable camera",
    "size": "1024x1024", 
    "n": 1,
    "quality": "hd", 
    "style": "vivid"
}
```


#### [DALL-E 2 (preview)](#tab/dalle2)

Image generation with DALL-E 2 is asynchronous and requires two API calls.

First, send a POST request to:

```
https://<your_resource_name>.openai.azure.com/openai/images/generations:submit?api-version=<api_version>
```

where:
- `<your_resource_name>` is the name of your Azure OpenAI resource.
- `<api_version>` is the version of the API you want to use. For example, `2023-06-01-preview`.

**Required headers**:
- `Content-Type`: `application/json`
- `api-key`: `<your_API_key>`

**Body**:

The following is a sample request body. You specify a number of options, defined in later sections.

```json
{
    "prompt": "a multi-colored umbrella on the beach, disposable camera",  
    "size": "1024x1024",
    "n": 1
}
```

The operation returns a `202` status code and a JSON object containing the ID and status of the operation

```json
{
  "id": "f508bcf2-e651-4b4b-85a7-58ad77981ffa",
  "status": "notRunning"
}
```

To retrieve the image generation results, make a GET request to:

```
GET https://<your_resource_name>.openai.azure.com/openai/operations/images/<operation_id>?api-version=<api_version>
```

where:
- `<your_resource_name>` is the name of your Azure OpenAI resource.
- `<operation_id>` is the ID of the operation returned in the previous step.
- `<api_version>` is the version of the API you want to use. For example, `2023-06-01-preview`.

**Required headers**:
- `Content-Type`: `application/json`
- `api-key`: `<your_API_key>`

The response from this API call contains your generated image.

---


## Output

The output from a successful image generation API call looks like the following example. The `url` field contains a URL where you can download the generated image. The URL stays active for 24 hours.


#### [DALL-E 3](#tab/dalle3)

```json
{ 
    "created": 1698116662, 
    "data": [ 
        { 
            "url": "<URL_to_generated_image>",
            "revised_prompt": "<prompt_that_was_used>" 
        }
    ]
} 
```

#### [DALL-E 2 (preview)](#tab/dalle2)

```json
{
    "created": 1685130482,
    "expires": 1685216887,
    "id": "<operation_id>",
    "result":
    {
        "data":
        [
            {
                "url": "<URL_to_generated_image>"
            }
        ]
    },
    "status": "succeeded"
}
```

---



### API call rejection

Prompts and images are filtered based on our content policy, returning an error when a prompt or image is flagged.

If your prompt is flagged, the `error.code` value in the message is set to `contentFilter`. Here's an example:

#### [DALL-E 3](#tab/dalle3)

```json
{
    "created": 1698435368,
    "error":
    {
        "code": "contentFilter",
        "message": "Your task failed as a result of our safety system."
    }
}
```

#### [DALL-E 2 (preview)](#tab/dalle2)

```json
{
   "created": 1589478378,
   "error": {
       "code": "contentFilter",
       "message": "Your task failed as a result of our safety system."
   },
   "id": "9484f239-9a05-41ba-997b-78252fec4b34",
   "status": "failed"
}
```

---

It's also possible that the generated image itself is filtered. In this case, the error message is set to `Generated image was filtered as a result of our safety system.`. Here's an example:

#### [DALL-E 3](#tab/dalle3)

```json
{
    "created": 1698435368,
    "error":
    {
        "code": "contentFilter",
        "message": "Generated image was filtered as a result of our safety system."
    }
}
```

#### [DALL-E 2 (preview)](#tab/dalle2)

```json
{
   "created": 1589478378,
   "expires": 1589478399,
   "id": "9484f239-9a05-41ba-997b-78252fec4b34",
   "lastActionDateTime": 1589478378,
   "data": [
       {
           "url": "<URL_TO_IMAGE>"
       },
       {
           "error": {
               "code": "contentFilter",
               "message": "Generated image was filtered as a result of our safety system."
           }
       }
   ],
   "status": "succeeded"
}
```

---

## Writing image prompts

Your image prompts should describe the content you want to see in the image, as well as the visual style of image. 

When writing prompts, consider that the image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it doesn't generate an image. For more information, see [Content filtering](../concepts/content-filter.md).

> [!TIP]
> For a thorough look at how you can tweak your text prompts to generate different kinds of images, see the [Image prompt engineering guide](/azure/ai-services/openai/concepts/gpt-4-v-prompt-engineering).


## Specify API options

The following API body parameters are available for DALL-E image generation.

#### [DALL-E 3](#tab/dalle3)

### Size

Specify the size of the generated images. Must be one of `1024x1024`, `1792x1024`, or `1024x1792` for DALL-E 3 models. Square images are faster to generate.


### Style

DALL-E 3 introduces two style options: `natural` and `vivid`. The `natural` style is more similar to the DALL-E 2 default style, while the `vivid` style generates more hyper-real and cinematic images.

The `natural` style is useful in cases where DALL-E 3 over-exaggerates or confuses a subject that's meant to be more simple, subdued, or realistic.

The default value is `vivid`.

### Quality

There are two options for image quality: `hd` and `standard`. `hd` creates images with finer details and greater consistency across the image. `standard` images can be generated faster.

The default value is `standard`.

### Number

With DALL-E 3, you cannot generate more than one image in a single API call: the _n_ parameter must be set to `1`. If you need to generate multiple images at once, make parallel requests.

### Response format

The format in which the generated images are returned. Must be one of `url` (a URL pointing to the image) or `b64_json` (the base 64-byte code in JSON format). The default is `url`.

#### [DALL-E 2 (preview)](#tab/dalle2)

### Size

Specify the size of the generated images. Must be one of `256x256`, `512x512`, or `1024x1024` for DALL-E 2 models.

### Number

Set the _n_ parameter to an integer between 1 and 10 to generate multiple images at the same time using DALL-E 2. The images will share an operation ID; you receive them all with the same retrieval API call.

---

## Next steps

* [Learn more about Azure OpenAI](../overview.md).
* [DALL-E quickstart](../dall-e-quickstart.md)
* [Image generation API reference](/azure/ai-services/openai/reference#image-generation)


<!-- OAI HT guide https://platform.openai.com/docs/guides/images/usage
dall-e 3 features here: https://cookbook.openai.com/articles/what_is_new_with_dalle_3 -->


