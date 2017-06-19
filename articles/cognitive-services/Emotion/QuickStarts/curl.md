---
title: Emotion API cURL quick start | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Emotion API with cURL in Cognitive Services.
services: cognitive-services
author: v-royhar
manager: yutkuo

ms.service: cognitive-services
ms.technology: emotion
ms.topic: article
ms.date: 05/23/2017
ms.author: anroth
---

# Emotion API cURL Quick Start
This article provides information and code samples to help you quickly get started using the [Emotion API Recognize method](https://dev.projectoxford.ai/docs/services/5639d931ca73072154c1ce89/operations/563b31ea778daf121cc3a5fa) with cURL to recognize the emotions expressed by one or more people in an image. 

## Prerequisite
* Get your free Subscription Key [here](https://azure.microsoft.com/en-us/try/cognitive-services/)

## Recognize Emotions cURL Example Request

> [!NOTE]
> You must use the same location in your REST call as you used to obtain your subscription keys. For example, if you obtained your subscription keys from westcentralus, replace "westus" in the URL below with "westcentralus".

```json
@ECHO OFF

curl -v -X POST "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize"
-H "Content-Type: application/json"
-H "Ocp-Apim-Subscription-Key: {subscription key}"

--data-ascii "{body}" 
```

## Recognize Emotions Sample Response
A successful call returns an array of face entries and their associated emotion scores, ranked by face rectangle size in descending order. An empty response indicates that no faces were detected. An emotion entry contains the following fields:
* faceRectangle - Rectangle location of face in the image.
* scores - Emotion scores for each face in the image. 

```json
application/json 
[
  {
    "faceRectangle": {
      "left": 68,
      "top": 97,
      "width": 64,
      "height": 97
    },
    "scores": {
      "anger": 0.00300731952,
      "contempt": 5.14648448E-08,
      "disgust": 9.180124E-06,
      "fear": 0.0001912825,
      "happiness": 0.9875571,
      "neutral": 0.0009861537,
      "sadness": 1.889955E-05,
      "surprise": 0.008229999
    }
  }
]

