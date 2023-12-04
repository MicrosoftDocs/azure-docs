---
title: Compare Custom Vision to alternative Azure services
titleSuffix: Azure AI services
description: Compare the Custom Vision service to other Azure AI services that offer the same or similar features.
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-custom-vision
ms.topic: conceptual
ms.date: 12/04/2023
ms.author: pafarley
ms.custom: 
---

# Compare Custom Vision to alternative Azure services

The [Azure AI Vision Image Analysis API](../../computer-vision/overview-image-analysis.md), a separate offering from Custom Vision, now supports custom models. Use this guide to compare the two services.

To migrate an existing Custom Vision project to the Image Analysis 4.0 system, see the [Migration guide](../../computer-vision/how-to/migrate-from-custom-vision.md).

## Custom model training

Instead of Custom Vision, you can use the [Image Analysis 4.0 model customization](../../computer-vision/how-to/model-customization.md) feature to create custom image identifier models with the latest technology from Azure.

[!INCLUDE [custom-vision-ia-compare](../../computer-vision/includes/custom-vision-ia-compare.md)]

## Product recognition

Instead of using the Custom Vision product-on-shelves model, you can use [Image Analysis 4.0 Product Recogntion](/azure/ai-services/computer-vision/concept-shelf-analysis) feature to train custom models that recognize retail products on shelves.

[!INCLUDE [custom-vision-shelf-compare](../../computer-vision/includes/custom-vision-shelf-compare.md)]
