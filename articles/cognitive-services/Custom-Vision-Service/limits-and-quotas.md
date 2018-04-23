---
title: Get started building a classifier by using Custom Vision Service machine learning | Microsoft Docs
description: Build a classifier to discern objects in photographs.
services: cognitive-services
author: anrothMSFT
manager: corncar
ms.service: cognitive-services
ms.component: custom-vision
ms.topic: article
ms.date: 03/16/2018
ms.author: anroth
---

# Limits and quotas

There are three tiers of keys for Custom Vision Service. F0 and S0 resources are obtained via the Azure Portal. Details on pricing and transactions definitions are on the [pricing page](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/custom-vision-service/).  F0 projects can be upgraded to S0 projects.

Limited Trial project resources are attached to your Custom Vision login (ie an AAD account or MSA account.) They are intended to be used for short trials of the service.  Accounts created during early free preview, prior to the introduction of Azure previews (March 1, 2018) will retain their previous quotas for Limited Trials. 

||**Limited Trial**|**F0 (Azure)**|**S0 (Azure)**|
|-----|-----|-----|-----|
|Projects|2|2|100|
|Training images per project|5,000|5,000|25,000|
|Predictions/ month|10,000 |10,000|Unlimited|
|Tags/ project|50|50|100|
|Iterations |10|10|10|
|How long prediction images stored|30 days|30 days|30 days|
|[Prediction](https://go.microsoft.com/fwlink/?linkid=865445) operations with storage (Transactions Per Second)|2|2|10|
|[Prediction](https://go.microsoft.com/fwlink/?linkid=865445) operations without storage (Transactions Per Second)|2|2|20|
|[TrainProject](https://go.microsoft.com/fwlink/?linkid=865446) (API calls Per Second)|2|2|10|
|[Other API calls](https://go.microsoft.com/fwlink/?linkid=865446) (Transactions Per Second)|10|10|10|

Limitations on *# training images per project* and *# Tags/project* are expected to be increased over time for S0 projects. 
