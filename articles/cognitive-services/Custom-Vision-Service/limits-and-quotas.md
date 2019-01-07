---
title: Pricing and limits - Custom Vision Service
titlesuffix: Azure Cognitive Services
description: Learn about the limits and quotas for the Custom Vision Service.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: conceptual
ms.date: 10/16/2018
ms.author: anroth
---

# Pricing and limits

There are three tiers of keys for the Custom Vision service. Limited Trial project resources are attached to your Custom Vision login (that is, an Azure Active Directory account or MSA account). They are intended to be used for short trials of the service. You can sign up for a F0 (free) or S0 (standard) subscription through the Azure portal. See the corresponding [Cognitive Services Pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) for details on pricing and transactions.

Accounts created during early free preview, before the introduction of Azure previews (March 1, 2018), will retain their previous quotas for Limited Trials. 

The number of training images per project and tags per project are expected to increase over time for S0 projects.

||**Limited Trial**|**F0**|**S0**|
|-----|-----|-----|-----|
|Projects|2|2|100|
|Training images per project, Classification|5,000|5,000|50,000|
|Training images per project, Object Detection|5,000|5,000|10,000|
|Predictions/ month|10,000 |10,000|Unlimited|
|Tags/ project|50|50|250|
|Iterations |10|10|10|
|Minimum labeled images per Tag, Classification (50+ recommended) |5|5|5|
|Minimum labeled images per Tag, Object Detection (50+ recommended)|15|15|15|
|How long prediction images stored|30 days|30 days|30 days|
|[Prediction](https://go.microsoft.com/fwlink/?linkid=865445) operations with storage (Transactions Per Second)|2|2|10|
|[Prediction](https://go.microsoft.com/fwlink/?linkid=865445) operations without storage (Transactions Per Second)|2|2|20|
|[TrainProject](https://go.microsoft.com/fwlink/?linkid=865446) (API calls Per Second)|2|2|10|
|[Other API calls](https://go.microsoft.com/fwlink/?linkid=865446) (Transactions Per Second)|10|10|10|
|Max image size (training image upload) |6 MB|6 MB|6 MB|
|Max image size (prediction)|4 MB|4 MB|4 MB|


