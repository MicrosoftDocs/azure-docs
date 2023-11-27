---
title: "Overview: Generate alt text of images with Image Analysis"
titleSuffix: Azure AI services
description: Grow your customer base by making your products and services more accessible. Generate a description of an image in human-readable language, using complete sentences. 
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 03/17/2023
ms.author: pafarley
---


# Overview: Generate image alt-text with Image Analysis

## What is alt text?

Alt text, or alternative text, is an HTML attribute added to the `<img>` tag that displays images on an application or web page. It looks like this in plain HTML code: 

`<img src="elephant.jpg" alt="An elephant in a grassland">`

Alt text enables website owners to describe an image in plain text. These image descriptions improve accessibility by enabling screen readers such as Microsoft Narrator, JAWS, and NVDA to accurately communicate image content to their visually impaired and blind users. 

Alt text is also vital for image search engine optimization (SEO). It helps search engines understand the visual content in your images. The search engine is then better able to include and rank your website in search results when users search for the content in your website.  

## Auto-generate alt text with Image Analysis  

Image Analysis offers image captioning models that generate one-sentence descriptions of image visual content. You can use these AI generated captions as alt text for your images.  

:::image type="content" source="media/use-cases/elephant.png" alt-text="An elephant in a grassland.":::

Auto-generated caption: "An elephant in a grassland."

Microsoft’s own products such as PowerPoint, Word, and Edge browser use image captioning by Image Analysis to generate alt text. 

:::image type="content" source="media/use-cases/powerpoint-alt-text.png" alt-text="Screenshot of a PowerPoint slide with alt text written on the side." lightbox="media/use-cases/powerpoint-alt-text.png" ::: 

## Benefits for your website 

- **Improve accessibility and user experience for blind and low-vision users**. Alt Text makes visual information in images available to screen readers used by blind and low-vision users. 
- **Meet legal compliance requirements**. Some websites may be legally required to remove all accessibility barriers. Using alt text for accessibility helps website owners minimize risk of legal action now and in the future. 
- **Make your website more discoverable and searchable**. Image alt text helps search engine crawlers find images on your website more easily and rank them higher in search results.  

## Frequently Asked Questions 

### What languages are image captions available in? 

Image captions are available in English, Chinese, Portuguese, Japanese, and Spanish in Image Analysis 3.2 API. In the Image Analysis 4.0 API (preview), image captions are only available in English.

### What confidence threshold should I use? 

To ensure accurate alt text for all images, you can choose to only accept captions above a certain confidence level. The right confidence level varies for each user depending on the type of images and usage scenario.  

In general, we advise a confidence threshold of `0.4` for the Image Analysis 3.2 API and of `0.0` for the Image Analysis 4.0 API (preview).

### What can I do about embarrassing or erroneous captions?  

On rare occasions, image captions can contain embarrassing errors, such as labeling a male-identifying person as a "woman" or labeling an adult woman as a "girl". We encourage users to consider using the latest Image Analysis 4.0 API (preview) which eliminates some errors by supporting gender-neutral captions.

Please report any embarrassing or offensive captions by going to the [Azure portal](https://portal.azure.com) and navigating to the **Feedback** button in the top right.

## Next Steps 
Follow a quickstart to begin automatically generating alt text by using image captioning on Image Analysis.

> [!div class="nextstepaction"]
> [Image Analysis quickstart](./quickstarts-sdk/image-analysis-client-library-40.md)
