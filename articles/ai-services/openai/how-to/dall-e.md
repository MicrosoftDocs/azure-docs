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
- Access granted to DALL-E in the desired Azure subscription.
- An Azure OpenAI resource created in the `SwedenCentral` region.
- Then, you need to deploy a `dalle3` model with your Azure resource. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

#### [DALL-E 2](#tab/dalle2)

- An Azure subscription. <a href="https://azure.microsoft.com/free/ai-services" target="_blank">Create one for free</a>.
- Access granted to DALL-E in the desired Azure subscription.
- An Azure OpenAI resource created in the East US region. For more information, see [Create a resource and deploy a model with Azure OpenAI](../how-to/create-resource.md).

---

## Call the Image Generation APIs

The following command shows the most basic way to use DALL-E with code. If this is your first time using these models programmatically, we recommend starting with the [DALL-E quickstart](/azure/ai-services/openai/dall-e-quickstart).


#### [DALL-E 3](#tab/dalle3)

TBD create a deployment. 

Send a POST request to:

```
https://<your_resource_name>.openai.azure.com/openai/images/generations:submit?api-version=<api_version>
```

where:
- `<your_resource_name>` is the name of your Azure OpenAI resource.
- `<api_version>` is the version of the API you want to use. For example, `2022-02-16`.

**Required headers**:
- `Content-Type`: `application/json`
- `api-key`: `<your_API_key>`

**Body**:

The following is a sample request body. You specify the text prompt, output image size, and number of images to generate. TBD n must =1

```json
{
    "prompt": "A multi-colored umbrella on the beach, disposable camera",
    "size": "1024x1024", 
    "n": 1,
    "quality": "hd", 
    "style": "vivid"
}
```


#### [DALL-E 2](#tab/dalle2)


```json
{
    "prompt": "a multi-colored umbrella on the beach, disposable camera",  
    "size": "1024x1024",
    "n": 1
}
```
---



## Output

The output from a successful image generation API call looks like the following example. The `url` field contains a URL where you can download the generated image. The URL stays active for 24 hours.


```json
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

#### [DALL-E 2](#tab/dalle2)

```json
{
    "created": 1685130482,
    "expires": 1685216887,
    "id": "088e4742-89e8-4c38-9833-c294a47059a3",
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




## Writing prompts

TBD When authoring prompts, consider the following:

also link to the handbook. https://dallery.gallery/wp-content/uploads/2022/07/The-DALL%C2%B7E-2-prompt-book-v1.02.pdf 

The image generation APIs come with a content moderation filter. If the service recognizes your prompt as harmful content, it doesn't generate an image. For more information, see [Content filtering](../concepts/content-filter.md).

### Prompt transformation
DALL-E 3 includes built-in prompt rewriting to enhance images, reduce bias, and increase natural variation.

With the release of DALL·E 3, the model now takes in the default prompt provided and automatically re-write it for safety reasons, and to add more detail (more detailed prompts generally result in higher quality images).

While it is not currently possible to disable this feature, you can use prompting to get outputs closer to your requested image by adding the following to your prompt: I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:.

The updated prompt is visible in the revised_prompt field of the data response object.


**DALL·E 3 Prompt transformation**: This embedded safety and quality mitigation is applied to every prompt sent to Azure OpenAI DALL·E 3. Prompt transformation enhances your prompts, which might lead to more diverse and higher-quality images.

| **Example text prompt** | **Example generated image without prompt transformation** | **Example generated image with prompt transformation** |
|---|---|---|
|"Watercolor painting of the Seattle skyline" | ![Watercolor painting of the Seattle skyline (simple).](./media/generated-seattle.png) | ![Watercolor painting of the Seattle skyline, with more detail and structure.](./media/generated-seattle-prompt-transformed.png) |


### Rejected images

Content moderation
Prompts and images are filtered based on our content policy, returning an error when a prompt or image is flagged.

The system returns an operation status of `Failed` and the `error.code` value in the message is set to `contentFilter`. Here's an example:


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

#### [DALL-E 2](#tab/dalle2)

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

#### [DALL-E 2](#tab/dalle2)

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


## Specify options

### Size

The size of the generated images. Must be one of 256x256, 512x512, or 1024x1024 for DALL·E-2 models. Must be one of 1024x1024, 1792x1024, or 1024x1792 for DALL·E-3 models.

square images are faster to generate
### Style

DALL·E-3 introduces two new styles: natural and vivid. The natural style is more similar to the DALL·E-2 style in its 'blander' realism, while the vivid style is a new style that leans towards generating hyper-real and cinematic images. For reference, all DALL·E generations in ChatGPT are generated in the 'vivid' style.

The natural style is specifically useful in cases where DALL·E-3 over-exaggerates or confuses a subject that's supposed to be more simple, subdued, or realistic. I've often used it for logo generation, stock photos, or other cases where I'm trying to match a real-world object.

Here's an example of the same prompt as above in the vivid style. The vivid is far more cinematic (and looks great), but might pop too much if you're not looking for that.


The style of the generated images. Must be one of vivid or natural. Vivid causes the model to lean towards generating hyper-real and dramatic images. Natural causes the model to produce more natural, less hyper-real looking images. Defaults to ‘vivid’.


### Quality

 The quality of the image that will be generated. ‘hd’ creates images with finer details and greater consistency across the image. Defaults to ‘standard’.

By default, images are generated at standard quality, but when using DALL·E 3 you can set quality: "hd" for enhanced detail. Square, standard quality images are the fastest to generate.

### Number
You can request 1 image at a time with DALL·E 3 (request more by making parallel requests) or up to 10 images at a time using DALL·E 2 with the n parameter.

### Response format
The format in which the generated images are returned. Must be one of "url" or "b64_json". Defaults to "url".


-----

OAI HT guide https://platform.openai.com/docs/guides/images/usage


dall-e 3 features here: https://cookbook.openai.com/articles/what_is_new_with_dalle_3


