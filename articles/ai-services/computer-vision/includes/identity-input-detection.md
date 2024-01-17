---
title: Face identity input technicals
titleSuffix: Azure AI services
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-vision
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 11/07/2023
ms.author: pafarley
---

* The minimum detectable face size is 36 x 36 pixels in an image that is no larger than 1920 x 1080 pixels. Images with larger than 1920 x 1080 pixels have a proportionally larger minimum face size. Reducing the face size might cause some faces not to be detected, even if they're larger than the minimum detectable face size.
* The maximum detectable face size is 4096 x 4096 pixels.
* Faces outside the size range of 36 x 36 to 4096 x 4096 pixels will not be detected.
