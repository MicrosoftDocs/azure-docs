---
title: Azure Content Safety Studio (preview)
titleSuffix: Azure Cognitive Services
description: Learn about Azure Content Safety Studio, the no-code web portal where you can try out Content Safety features.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: overview
ms.date: 04/23/2023
ms.author: pafarley

---

# What is Azure Content Safety Studio?

[Azure Content Safety Studio](https://contentsafety.cognitive.azure.com) is an online tool designed to handle potentially offensive, risky, or undesirable content using cutting-edge content moderation ML models. It provides templates and customized workflows, enabling users to choose and build their own content moderation system. Users can upload their own content or try it out with sample content.

Content Safety Studio not only contains the out-of-the-box AI models, but also uses Microsoft's built-in terms lists to flag profanities and stay up to date with new trends. You can also upload your own blocklists to enhance the coverage of harmful content that's specific to your industry. 

The Studio also lets you set up a moderation workflow, where you can continuously monitor and improve content moderation performance. It can help you meet content requirements from all kinds of industries like gaming, media, education, E-commerce, and more. Businesses can easily connect their services to the Studio and have their content moderated in real time, whether user-generated or AI-generated.

All of these capabilities are handled by the Studio and its backend; customers don’t need to worry about model development. You can onboard your data for quick validation and monitor your KPIs accordingly, like technical metrics (latency, accuracy, recall), or business metrics (like block rate, block volume, category proportions, language proportions and more). With simple operations and configurations, customers can test different solutions quickly and find the best fit, instead of spending time experimenting with custom models or doing moderation manually. 

## Prerequisites for new users

* An active Azure account. If you don't have one, you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).
* A [Content Safety](https://aka.ms/acs-create) Azure resource.

## Content Safety Studio features

In Content Safety Studio, the following Content Safety service features are available:

* [Moderate Text Content](https://contentsafety.cognitive.azure.com/text): With the text moderation tool, you can easily run tests on text content. Whether you want to test a simple sentence or an entire dataset, our tool offers a user-friendly interface that lets you to assess the test results directly in the portal. You can experiment with different sensitivity levels to configure your content filters and blocklist management, ensuring that your content is always moderated to your exact specifications. Plus, with the ability to export the code, you can implement the tool directly in your application, streamlining your workflow and saving time.

* [Moderate Image Content](https://contentsafety.cognitive.azure.com/image): With the image moderation tool, you can easily run tests on images to ensure that they meet your content standards. Our user-friendly interface allows you to evaluate the test results directly in the portal, and you can experiment with different sensitivity levels to configure your content filters. Once you've customized your settings, you can easily export the code to implement the tool in your application.

* [Monitor Online Activity](https://contentsafety.cognitive.azure.com/monitor): The powerful monitoring page allows you to easily track your moderation API usage and trends across different modalities. With this feature, you can access detailed response information, including category and severity distribution, latency, error, and blocklist detection. This information provides you with a complete overview of your content moderation performance, enabling you to optimize your workflow and ensure that your content is always moderated to your exact specifications. With our user-friendly interface, you can quickly and easily navigate the monitoring page to access the information you need to make informed decisions about your content moderation strategy. You'll have the tools you need to stay on top of your content moderation performance and achieve your content goals.

## Next steps

Go to [Content Safety Studio](https://contentsafety.cognitive.azure.com/text) to begin using features offered by the service.
- For more information on the features offered, see the [Content Safety Overview](./overview.md).