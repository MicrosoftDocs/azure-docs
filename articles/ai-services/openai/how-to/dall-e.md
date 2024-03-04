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

## Call the Image Generation APIs

The following command shows the most basic way to use DALL-E with code. If this is your first time using these models programmatically, we recommend starting with the [DALL-E quickstart](https://learn.microsoft.com/en-us/azure/ai-services/openai/dall-e-quickstart).

what is key to know... 
studio is easy. code is easy. 


specify prompt, size, and number

dall-e 3 does prompt rewriting


DALL-E 3 is the latest image generation model from OpenAI. It features enhanced image quality, more complex scenes, and improved performance when rendering text in images. It also comes with more aspect ratio options. DALL-E 3 is available through OpenAI Studio and through the REST API. Your OpenAI resource must be in the `SwedenCentral` Azure region.

DALL-E 3 includes built-in prompt rewriting to enhance images, reduce bias, and increase natural variation.


With the release of DALL·E 3, the model now takes in the default prompt provided and automatically re-write it for safety reasons, and to add more detail (more detailed prompts generally result in higher quality images).

While it is not currently possible to disable this feature, you can use prompting to get outputs closer to your requested image by adding the following to your prompt: I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:.

The updated prompt is visible in the revised_prompt field of the data response object.


By default, images are generated at standard quality, but when using DALL·E 3 you can set quality: "hd" for enhanced detail. Square, standard quality images are the fastest to generate.

You can request 1 image at a time with DALL·E 3 (request more by making parallel requests) or up to 10 images at a time using DALL·E 2 with the n parameter.



- **DALL·E 3 Prompt transformation**: This embedded safety and quality mitigation is applied to every prompt sent to Azure OpenAI DALL·E 3. Prompt transformation enhances your prompts, which might lead to more diverse and higher-quality images.

| **Example text prompt** | **Example generated image without prompt transformation** | **Example generated image with prompt transformation** |
|---|---|---|
|"Watercolor painting of the Seattle skyline" | ![Watercolor painting of the Seattle skyline (simple).](./media/generated-seattle.png) | ![Watercolor painting of the Seattle skyline, with more detail and structure.](./media/generated-seattle-prompt-transformed.png) |

OAI HT guide https://platform.openai.com/docs/guides/images/usage

Content moderation
Prompts and images are filtered based on our content policy, returning an error when a prompt or image is flagged.

dall-e 3 features here: https://cookbook.openai.com/articles/what_is_new_with_dalle_3


also link to the handbook. https://dallery.gallery/wp-content/uploads/2022/07/The-DALL%C2%B7E-2-prompt-book-v1.02.pdf 
