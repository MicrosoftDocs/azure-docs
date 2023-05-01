---
title: What is Azure Content Safety? (preview)
titleSuffix: Azure Cognitive Services
description: Learn how to use Content Safety to track, flag, assess, and filter inappropriate material in user-generated content.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: overview
ms.date: 04/02/2023
ms.author: pafarley
keywords: content safety, azure content safety, online content safety, content filtering software, content moderation service, content moderation
ms.custom: references_regions

#Customer intent: As a developer of content management software, I want to find out whether Azure Content Safety is the right solution for my moderation needs.
---

# What is Azure Content Safety? (preview)

The Azure Content Safety Public Preview service is a Cognitive Service that detects material that is potentially offensive, risky, or otherwise undesirable. This service offers state-of-the-art text and image models that detect problematic content. Azure Content Safety helps make applications and services safer from harmful user-generated and AI-generated content.

Azure Content Safety can be accessed through RESTful APIs.

You may want to build content filtering software into your app to comply with regulations or maintain the intended environment for your users.

This documentation contains the following article types:  

* **[Quickstarts](./quickstart.md)** are getting-started instructions to guide you through making requests to the service.  
* **[How-to guides](./how-to/use-custom-blocklist.md)** contain instructions for using the service in more specific or customized ways.  
* **[Concepts](concepts/content-flags.md)** provide in-depth explanations of the service functionality and features.  

## Where it's used

The following are a few scenarios in which a software developer or team would require a content moderation service:

- Online marketplaces that moderate product catalogs and other user-generated content.
- Gaming companies that moderate user-generated game artifacts and chat rooms.
- Social messaging platforms that moderate images and text added by their users.
- Enterprise media companies that implement centralized moderation for their content.
- K-12 education solution providers filtering out content that is inappropriate for students and educators.

> [!IMPORTANT]
> You cannot use Content Safety to detect illegal child exploitation images.

## Product types

There are different types of analysis available from this service. The following table describes the currently available API.

| Type                        | Functionality           |
| :-------------------------- | :---------------------- |
| Text Detection API          | Scans text for sexual content, violence, hate, and self harm with multi-severity levels. |
| Image Detection API         | Scans images for sexual content, violence, hate, and self harm with multi-severity levels. |

## Input requirements

The default maximum length for text submissions is 1000 characters. If you need to analyze longer blocks of text, you can split the input text (for example, by punctuation or spacing) across multiple related submissions.

The default maximum size for image submissions is 4MB, and image dimensions must be between 50 x 50 pixels and 10,000 px x 10,000 pixels. Images can be in JPEG, PNG, GIF, or BMP formats.

## Pricing

Currently, the public preview features are available in the **F0 and S0** pricing tier.

## Service limits

### Language availability

This API supports eight languages: English, German, Japanese, Spanish, French, Italian, Portuguese, Chinese.

You don't need to specify a language code for text analysis. we'll automatically detect your input language.

### Region / location

To use the preview APIs, you must create your Azure Content Safety resource in a supported region. Currently, the public preview features are available in the following Azure regions: 

- East US
- West Europe

Feel free to [contact us](mailto:acm-team@microsoft.com) if you need other regions for your business.

### Query rates

| Pricing Tier | Requests per second (RPS) |
| :----------- | :--------------------- |
| F0           | 5                      |
| S0           | 10                     |

If you need a faster rate, please [contact us](mailto:acm-team@microsoft.com) to request.


## Contact us

If you get stuck, [email us](mailto:acm-team@microsoft.com) or use the feedback widget on the upper right of any docs page.

## Next steps

Follow a quickstart to get started.

> [!div class="nextstepaction"]
> [Content Safety quickstart](./quickstart.md)
