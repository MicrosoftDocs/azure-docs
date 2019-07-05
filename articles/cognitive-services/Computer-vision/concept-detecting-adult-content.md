---
title: Describe adult and racy content - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to detecting adult and racy content in images using the Computer Vision APi.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 02/08/2019
ms.author: pafarley
ms.custom: seodec18
---

# Detect adult and racy content

Computer Vision can detect adult material in images so that developers can restrict the display of such images in their software. Content flags are applied with a score between zero and one so that developers can interpret the results according to their own preferences. 

> [!NOTE]
> This feature is also offered by the [Azure Content Moderator](https://docs.microsoft.com/azure/cognitive-services/content-moderator/overview) service. See this alternative for solutions to more rigorous content moderation scenarios, such as text moderation and human review workflows.

## Content flag definitions

**Adult** images are defined as those which are pornographic in nature and often depict nudity and sexual acts. 

**Racy** images are defined as images that are sexually suggestive in nature and often contain less sexually explicit content than images tagged as **Adult**. 

## Identify adult and racy content

The [Analyze](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa) API.

The Analyze Image method returns two boolean properties, `isAdultContent` and `isRacyContent`, in the JSON response of the method to indicate adult and racy content respectively. The method also returns two properties, `adultScore` and `racyScore`, which represent the confidence scores for identifying adult and racy content respectively.

## Next steps

Learn concepts about [detecting domain-specific content](concept-detecting-domain-content.md) and [detecting faces](concept-detecting-faces.md).
