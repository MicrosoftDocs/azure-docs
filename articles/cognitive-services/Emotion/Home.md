---
title: Emotion API overview | Microsoft Docs
description: Use the Microsoft cutting-edge, cloud-based emotion recognition algorithm to build more personalized apps, with the Emotion API in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: emotion
ms.topic: article
ms.date: 02/06/2017
ms.author: anroth
---

# Emotion API

> [!IMPORTANT]
> Video API Preview will end on October 30th, 2017. Try the new [Video Indexer API Preview](https://azure.microsoft.com/services/cognitive-services/video-indexer/) to easily extract insights from 
videos and to enhance content discovery experiences, such as search results, by detecting spoken words, faces, characters, and emotions. [Learn more](https://docs.microsoft.com/azure/cognitive-services/video-indexer/video-indexer-overview).

Welcome to the Microsoft Emotion API, which allows you to build more personalized apps with Microsoft’s cutting edge cloud-based emotion recognition algorithm.

### Emotion Recognition

The Emotion API beta takes an image as an input, and returns the confidence across a set of emotions for each face in the image, as well as bounding box for the face, from the Face API. The emotions detected are happiness, sadness, surprise, anger, fear, contempt, disgust or neutral. These emotions are communicated cross-culturally and universally via the same basic facial expressions, where are identified by Emotion API. 

**Interpreting Results:** 

In interpreting results from the Emotion API, the emotion detected should be interpreted as the emotion with the highest score, as scores are normalized to sum to one. Users may choose to set a higher confidence threshold within their application, depending on their needs. 

For more details about emotion detection, please refer to the API Reference: 
  * Basic: If a user has already called the Face API, they can submit the face rectangle as an input and use the basic tier. [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5639d931ca73072154c1ce89/operations/56f23eb019845524ec61c4d7)
  * Standard: If a user does not submit a face rectangle, they should use standard mode.  [API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5639d931ca73072154c1ce89/operations/563b31ea778daf121cc3a5fa)

*Please note, Emotion API for Video was deprecated on October 30, 2017. For a sample on how to interpret streaming video with Emotion API, please see [How to Analyze Videos in Real Time](https://docs.microsoft.com/en-us/azure/cognitive-services/emotion/emotion-api-how-to-topics/howtoanalyzevideo_emotion).*

