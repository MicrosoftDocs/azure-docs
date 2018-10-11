---
title: Limits and quotas - Custom Vision Service
titlesuffix: Azure Cognitive Services
description: Learn about the limits and quotas for the Custom Vision Service.
services: cognitive-services
author: anrothMSFT
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-vision
ms.topic: conceptual
ms.date: 03/16/2018
ms.author: anroth
---

# Limits and quotas

There are three tiers of keys for Custom Vision Service. F0 and S0 resources are obtained via the Azure portal. Details on pricing and transactions definitions are on the [pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/).  F0 projects can be upgraded to S0 projects.

Limited Trial project resources are attached to your Custom Vision login (that is, an AAD account or MSA account.) They are intended to be used for short trials of the service.  Accounts created during early free preview, prior to the introduction of Azure previews (March 1, 2018) will retain their previous quotas for Limited Trials. 

||**Limited Trial**|**F0 (Azure)**|**S0 (Azure)**|
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
|Max image size (training image upload) |6MB|6MB|6MB|
|Max image size (prediction)|4MB|4MB|4MB|

Limitations on *# training images per project* and *# Tags/project* are expected to be increased over time for S0 projects. 
