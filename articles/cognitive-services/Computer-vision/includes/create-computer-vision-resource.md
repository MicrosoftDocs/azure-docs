---
title: Container support
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 04/01/2020
ms.author: aahi
---

## Create an Computer Vision resource

1. Sign into the [Azure portal](https://portal.azure.com).
1. Click [Create **Computer Vision**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesComputerVision) resource.
1. Enter all required settings:

    |Setting|Value|
    |--|--|
    |Name|Desired name (2-64 characters)|
    |Subscription|Select appropriate subscription|
    |Location|Select any nearby and available location|
    |Pricing Tier|`F0` - the minimal pricing tier|
    |Resource Group|Select an available resource group|

1. Click **Create** and wait for the resource to be created. After it is created, navigate to the resource page.
1. Collect configured `{ENDPOINT_URI}` and `{API_KEY}`, see [gathering required parameters](../computer-vision-how-to-install-containers.md#gathering-required-parameters) for details.
