---
title: Limits and quotas - Custom Vision Service
titleSuffix: Azure Cognitive Services
description: This article explains the different types of licensing keys and about the limits and quotas for the Custom Vision Service.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: conceptual
ms.date: 03/25/2019
ms.author: pafarley
---

# Limits and quotas

There are two tiers of keys for the Custom Vision service. You can sign up for a F0 (free) or S0 (standard) subscription through the Azure portal. See the corresponding [Cognitive Services Pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for details on pricing and transactions.

The number of training images per project and tags per project are expected to increase over time for S0 projects.

||**F0**|**S0**|
|-----|-----|-----|
|Projects|2|100|
|Training images per project |5,000|100,000|
|Predictions / month|10,000 |Unlimited|
|Tags / project|50|500|
|Iterations |10|10|
|Min labeled images per Tag, Classification (50+ recommended) |5|5|
|Min labeled images per Tag, Object Detection (50+ recommended)|15|15|
|How long prediction images stored|30 days|30 days|
|[Prediction](https://go.microsoft.com/fwlink/?linkid=865445) operations with storage (Transactions Per Second)|2|10|
|[Prediction](https://go.microsoft.com/fwlink/?linkid=865445) operations without storage (Transactions Per Second)|2|20|
|[TrainProject](https://go.microsoft.com/fwlink/?linkid=865446) (API calls Per Second)|2|10|
|[Other API calls](https://go.microsoft.com/fwlink/?linkid=865446) (Transactions Per Second)|10|10|
|Accepted image types|jpg, png, bmp, gif|jpg, png, bmp, gif|
|Min image height/width in pixels|256 (see note)|256 (see note)|
|Max image height/width in pixels|unlimited|unlimited|
|Max image size (training image upload) |6 MB|6 MB|
|Max image size (prediction)|4 MB|4 MB|
|Max regions per object detection training image|300|300|
|Max tags per classification image|100|100|

> [!NOTE]
> Images smaller than than 256 pixels will be accepted but upscaled.
