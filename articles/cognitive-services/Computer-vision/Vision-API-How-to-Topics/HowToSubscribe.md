---
title: Get subscription keys for the Computer Vision API | Microsoft Docs
description: Learn how to get subscription keys for calls to the Computer Vision API in Cognitive Services.
services: cognitive-services
author: JuliaNik
manager: ytkuo

ms.service: cognitive-services
ms.technology: computer-vision
ms.topic: article
ms.date: 05/19/2017
ms.author: juliakuz
---

## Obtaining Subscription Keys

Computer Vision services require special subscription keys to use them with your Azure account. Every call to the Computer Vision API requires a subscription key. This key needs to be either passed through a query string parameter or specified in the request header.

To sign up for subscription keys, see [Subscriptions](https://azure.microsoft.com/en-us/try/cognitive-services/). It's free to sign up. Pricing for these services is subject to change.

NOTE: Your subscription keys are valid for only one [Microsoft Azure Region](https://azure.microsoft.com/en-us/regions/). 

If you sign up using the Computer Vision free trial, your subscription keys are valid for the **westcentral** region (`https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/`). That is the most common case. However, if you sign-up for Computer Vision with your Microsoft Azure account, you specify the region for your Computer Vision trial from a list of Microsoft Azure Regions. Currently, the list of regions for Computer Vision include **westcentralus**, **westus**, **eastus2**, **westeurope**, and **southeastasia**. 

If you sign up for Computer Vision with your Microsoft Azure account, and you specify `westus` for your region, you must use the `westus` region for your REST API calls (`https://westus.api.cognitive.microsoft.com/vision/v1.0/`).

Subscriptions

### Related Links:
* [Pricing Options for Microsoft Cognitive APIs](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/)
