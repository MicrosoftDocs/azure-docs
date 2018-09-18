---
title: Get subscription keys for the Computer Vision API
titlesuffix: Azure Cognitive Services
description: Learn how to get subscription keys for calls to the Computer Vision API in Azure Cognitive Services.
services: cognitive-services
author: KellyDF
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: article
ms.date: 05/19/2017
ms.author: kefre
---
# How to obtain subscription keys

Computer Vision services require special subscription keys. Every call to the Computer Vision API requires a subscription key. This key needs to be either passed through a query string parameter or specified in the request header.

To sign up for subscription keys, see [Subscriptions](https://azure.microsoft.com/try/cognitive-services/). It's free to sign up. Pricing for these services is subject to change.

>[!NOTE]
Your subscription keys are valid for only one of these [Microsoft Azure Regions](https://azure.microsoft.com/regions/). 

| Region | Address |
|---|---|
| West US | westus.api.cognitive.microsoft.com |
| East US 2 | eastus2.api.cognitive.microsoft.com |
| West Central US | westcentralus.api.cognitive.microsoft.com |
| West Europe | westeurope.api.cognitive.microsoft.com |
| Southeast Asia | southeastasia.api.cognitive.microsoft.com |

If you sign up using the Computer Vision free trial, your subscription keys are valid for the **westcentral** region (`https://westcentralus.api.cognitive.microsoft.com/`). That is the most common case. However, if you sign-up for Computer Vision with your Microsoft Azure account through the [https://azure.microsoft.com/](https://azure.microsoft.com/) website, you specify the region for your trial from the preceding list of regions.

For example, if you sign up for Computer Vision with your Microsoft Azure account and you specify `westus` for your region, you must use the `westus` region for your REST API calls (`https://westus.api.cognitive.microsoft.com/`).

If you forget the region for your subscription key after obtaining your trial key, you can find your region at [https://azure.microsoft.com/try/cognitive-services/my-apis/](https://azure.microsoft.com/try/cognitive-services/my-apis/).

### Related Links:

* [Pricing Options for Azure Cognitive Services APIs](https://azure.microsoft.com/pricing/details/cognitive-services/)
