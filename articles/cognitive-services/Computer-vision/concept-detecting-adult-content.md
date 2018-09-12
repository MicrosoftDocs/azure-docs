---
title: Describing adult and racy content
titleSuffix: Computer Vision - Cognitive Services - Azure
description: Concepts related to detecting adult and racy content in images using Computer Vision in Azure Cognitive Services.
services: cognitive-services
author: deken
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: article
ms.date: 08/29/2018
ms.author: v-deken
---

# Detecting adult and racy content

Among the various visual categories is the adult and racy group, which enables detection of adult materials and restricts the display of images containing sexual content. The filter for adult and racy content detection can be set on a sliding scale to accommodate the user's preference.

## Defining adult and racy content

Among the various visual features covered by the [Analyze Image method](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa), the Adult visual feature enables detection of adult and racy images. "Adult" images are defined as those that are pornographic in nature and often depict nudity and sexual acts. "Racy" images are defined as images that are sexually suggestive in nature and often contain less sexually explicit content than images tagged as "Adult."

The Analyze Image method returns two properties, `isAdultContent` and `isRacyContent`, in the JSON response of the method to indicate, respectively, adult and racy content. Both properties return a boolean value, either true or false. The method also returns two properties, `adultScore` and `racyScore`, which represent, respectively, confidence scores for adult and racy content. A confidence filter for adult and racy content detection can be set on a sliding scale to accommodate your preference based on your specific scenario. The Adult visual feature type is commonly used to restrict the display of images containing sexually suggestive and explicitly sexual content.

## Next steps

Learn concepts about [detecting domain-specific content](concept-detecting-domain-content.md) and [detecting faces](concept-detecting-faces.md).