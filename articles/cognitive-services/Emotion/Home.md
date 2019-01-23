---
title: What is the Emotion API?
titlesuffix: Azure Cognitive Services
description: Use the cloud-based emotion recognition algorithm to build more personalized apps.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: emotion-api
ms.topic: overview
ms.date: 02/06/2017
ms.author: anroth
ROBOTS: NOINDEX
---

# What is the Emotion API?

> [!IMPORTANT]
> The Emotion API will be deprecated on February 15, 2019. The emotion recognition capability is now generally available as part of the [Face API](https://docs.microsoft.com/azure/cognitive-services/face/). 

Welcome to the Microsoft Emotion API, which allows you to build more personalized apps with Microsoft’s cloud-based emotion recognition algorithm.

### Emotion Recognition

The Emotion API beta takes an image as an input and returns the confidence across a set of emotions for each face in the image, as well as a bounding box for the face from the Face API. The emotions detected are happiness, sadness, surprise, anger, fear, contempt, disgust, or neutral. These emotions are communicated cross-culturally and universally via the same basic facial expressions, where are identified by Emotion API.

**Interpreting Results:**

In interpreting results from the Emotion API, the emotion detected should be interpreted as the emotion with the highest score, as scores are normalized to sum to one. Users may choose to set a higher confidence threshold within their application, depending on their needs.

For more information about emotion detection, see the API Reference:
  * Basic: If a user has already called the Face API, they can submit the face rectangle as an input and use the basic tier. [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5639d931ca73072154c1ce89/operations/56f23eb019845524ec61c4d7)
  * Standard: If a user does not submit a face rectangle, they should use standard mode.  [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5639d931ca73072154c1ce89/operations/563b31ea778daf121cc3a5fa)

For a sample on how to interpret streaming video with Emotion API, see [How to Analyze Videos in Real Time](https://docs.microsoft.com/azure/cognitive-services/emotion/emotion-api-how-to-topics/howtoanalyzevideo_emotion).
