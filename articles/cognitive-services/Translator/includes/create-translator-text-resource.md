---
title: Container support
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 09/17/2019
ms.author: dapine
---

## Create a Translator Text resource

1. Sign into the [Azure portal](https://portal.azure.com)
1. Click [Create **Translator Text**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) resource
1. Enter all required settings:

    |Setting|Value|
    |--|--|
    |Name|Desired name (2-64 characters)|
    |Subscription|Select appropriate subscription|
    |Pricing Tier|`F0` - the minimal pricing tier, or `S1 (Pay as you go)`|
    |Resource Group|Select an available resource group|

1. Click **Create** and wait for the resource to be created. After it is created, navigate to the resource page

[!INCLUDE [container-gathering-required-parameters](../../containers/includes/container-gathering-required-parameters.md)]
