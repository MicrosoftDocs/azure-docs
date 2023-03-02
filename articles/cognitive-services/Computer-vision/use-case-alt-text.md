---
title: "Overview: Generate alt text of images with Image Analysis"
titleSuffix: Azure Cognitive Services
description: Grow your customer base by making your products and services more accessible. Generate a description of an image in human-readable language, using complete sentences. 
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 07/22/2022
ms.author: pafarley
---


# Overview: Generate alt text of images with Image Analysis

Grow your customer base by making your products and services more accessible. Generate a description of an image in human-readable language, using complete sentences. Computer Vision's algorithms generate various descriptions based on the objects identified in the image. The descriptions are each evaluated, and a confidence score is generated. You then get the list of descriptions, ordered from highest confidence score to lowest.

## Image captioning example 

The following screenshot is an example of automatically generated alt text for an image.

:::image type="content" source="media/use-cases/studio-alt-text.png" alt-text="Screenshot of Vision Studio with a caption generated for an image of cows.":::

## Adding alt text to images 

Alternative text (alt text) is descriptive text that conveys the meaning and context of a visual item in a digital setting, such as on an app or web page. When screen readers such as Microsoft Narrator, JAWS, and NVDA reach digital content with alt text, they read the alt text aloud, allowing people to better understand what is on the screen. Well written, descriptive alt text dramatically reduces ambiguity and improves the user experience. Alt text needs to convey the purpose and meaning of an image, which requires understanding and interpretation in addition to object detection.

## Key features  

- Human-readable captions with confidence: Generate a description of an entire image in human-readable language, using complete sentences. Computer Vision's algorithms generate various descriptions based on the objects identified in the image. The descriptions are each evaluated and a confidence score generated. A list is then returned ordered from highest confidence score to lowest. 
- Multiple captions available: You can specify the number of possible captions it will generate and choose the one that works best for your business.

## Benefits for your business 

Accessibility is the design of products, devices, services, vehicles, or environments to be usable by people with disabilities. Accessibility has been an increasingly important topic in product and service development as it makes digital experiences available to more people in the world. Accessibility will boost your business in multiple ways: 

- **Improve user experience**: by adding alt text, you make the information in images available to users who are blind or have low vision, as well as users who can't load the images due to internet connection. 
- **Make images more discoverable and searchable**: adding captions and tags to images will help search engine crawlers find your images and rank them higher in search results.
- **Meet legal compliance**: there may potentially be legal repercussions for business that aren't accessibility-compliant. Building products with higher accessibility helps the business avoid potential risks of legal action now and in the future.

 

## Next Steps 
The following tutorial provides a complete solution to generate alternative text of images on web applications.

> [!div class="nextstepaction"]
> [Tutorial: Use Computer Vision to generate image metadata](./Tutorials/storage-lab-tutorial.md)



