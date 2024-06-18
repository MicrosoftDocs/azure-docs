---
title: Detect Adult, racy, or gory content - Azure AI Vision
titleSuffix: Azure AI services
description: Concepts related to detecting adult content in images using the Azure AI Vision API.
#services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: conceptual
ms.date: 01/19/2024
ms.author: pafarley
---

# Adult content detection

Azure AI Vision can detect adult material in images so that developers can restrict the display of these images in their software. Content flags are applied with a score between zero and one so developers can interpret the results according to their own preferences.

Try out the adult content detection features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

> [!TIP]
> Azure AI Content Safety is the latest offering in AI content moderation. For more information, see the [Azure AI Content Safety overview](/azure/ai-services/content-safety/overview).

## Content flag definitions

The "adult" classification contains several different categories:

- **Adult** images are explicitly sexual in nature and often show nudity and sexual acts.
- **Racy** images are sexually suggestive in nature and often contain less sexually explicit content than images tagged as **Adult**.
- **Gory** images show blood/gore.

## Use the API

You can detect adult content with the [Analyze Image 3.2](/rest/api/computervision/analyze-image?view=rest-computervision-v3.2) API. When you add the value of `Adult` to the **visualFeatures** query parameter, the API returns three boolean properties&mdash;`isAdultContent`, `isRacyContent`, and `isGoryContent`&mdash;in its JSON response. The method also returns corresponding properties&mdash;`adultScore`, `racyScore`, and `goreScore`&mdash;which represent confidence scores between zero and one for each respective category.

- [Quickstart: Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)
