---
title: Adult, racy, gory content - Azure AI Vision
titleSuffix: Azure AI services
description: Concepts related to detecting adult content in images using the Azure AI Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 12/27/2022
ms.author: pafarley
ms.custom: seodec18, ignite-2022
---

# Adult content detection

Azure AI Vision can detect adult material in images so that developers can restrict the display of these images in their software. Content flags are applied with a score between zero and one so developers can interpret the results according to their own preferences.

Try out the adult content detection features quickly and easily in your browser using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

## Content flag definitions

The "adult" classification contains several different categories:

- **Adult** images are explicitly sexual in nature and often show nudity and sexual acts.
- **Racy** images are sexually suggestive in nature and often contain less sexually explicit content than images tagged as **Adult**.
- **Gory** images show blood/gore.

## Use the API

You can detect adult content with the [Analyze Image 3.2](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) API. When you add the value of `Adult` to the **visualFeatures** query parameter, the API returns three boolean properties&mdash;`isAdultContent`, `isRacyContent`, and `isGoryContent`&mdash;in its JSON response. The method also returns corresponding properties&mdash;`adultScore`, `racyScore`, and `goreScore`&mdash;which represent confidence scores between zero and one for each respective category.

- [Quickstart: Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)
