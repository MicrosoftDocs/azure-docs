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

* **[Quickstarts](./quickstart-text.md)** are getting-started instructions to guide you through making requests to the service.  
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

## Content Safety Studio

[Azure Content Safety Studio](https://contentsafety.cognitive.azure.com) is an online tool designed to handle potentially offensive, risky, or undesirable content using cutting-edge content moderation ML models. It provides templates and customized workflows, enabling users to choose and build their own content moderation system. Users can upload their own content or try it out with sample content.

Content Safety Studio not only contains the out-of-the-box AI models, but also uses Microsoft's built-in terms lists to flag profanities and stay up to date with new trends. You can also upload your own custom blocklists to enhance the coverage of harmful content that's specific to your industry. 

The Studio also lets you set up a moderation workflow, where you can continuously monitor and improve content moderation performance. It can help you meet content requirements from all kinds of industries like gaming, media, education, E-commerce, and more. Businesses can easily connect their services to the Studio and have their content moderated in real time, whether user-generated or AI-generated.

All of these capabilities are handled by the Studio and its backend; customers don’t need to worry about model development. You can onboard your data for quick validation and monitor your KPIs accordingly, like technical metrics (latency, accuracy, recall), or business metrics (like block rate, block volume, category proportions, language proportions and more). With simple operations and configurations, customers can test different solutions quickly and find the best fit, instead of spending time experimenting with custom models or doing moderation manually. 

> [!div class="nextstepaction"]
> [Content Safety Studio](https://contentsafety.cognitive.azure.com)


### Content Safety Studio features

In Content Safety Studio, the following Content Safety service features are available:

* [Moderate Text Content](https://contentsafety.cognitive.azure.com/text): With the text moderation tool, you can easily run tests on text content. Whether you want to test a simple sentence or an entire dataset, our tool offers a user-friendly interface that lets you to assess the test results directly in the portal. You can experiment with different sensitivity levels to configure your content filters and blocklist management, ensuring that your content is always moderated to your exact specifications. Plus, with the ability to export the code, you can implement the tool directly in your application, streamlining your workflow and saving time.

* [Moderate Image Content](https://contentsafety.cognitive.azure.com/image): With the image moderation tool, you can easily run tests on images to ensure that they meet your content standards. Our user-friendly interface allows you to evaluate the test results directly in the portal, and you can experiment with different sensitivity levels to configure your content filters. Once you've customized your settings, you can easily export the code to implement the tool in your application.

* [Monitor Online Activity](https://contentsafety.cognitive.azure.com/monitor): The powerful monitoring page allows you to easily track your moderation API usage and trends across different modalities. With this feature, you can access detailed response information, including category and severity distribution, latency, error, and blocklist detection. This information provides you with a complete overview of your content moderation performance, enabling you to optimize your workflow and ensure that your content is always moderated to your exact specifications. With our user-friendly interface, you can quickly and easily navigate the monitoring page to access the information you need to make informed decisions about your content moderation strategy. You'll have the tools you need to stay on top of your content moderation performance and achieve your content goals.

## Input requirements

The default maximum length for text submissions is 1000 characters. If you need to analyze longer blocks of text, you can split the input text (for example, by punctuation or spacing) across multiple related submissions.

The maximum size for image submissions is 4MB, and image dimensions must be between 50 x 50 pixels and 2,048 x 2,048 pixels. Images can be in JPEG, PNG, GIF, or BMP formats.

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
> [Content Safety quickstart](./quickstart-text.md)
