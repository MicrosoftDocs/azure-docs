---
title: Container support
titleSuffix: Azure Cognitive Services
description: Learn how to create an cognitive services text analytics resource.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 06/26/2019
ms.author: dapine
---

## Create a Cognitive Services Text Analytics resource

1. Sign into the [Azure portal](https://portal.azure.com)
1. Select **+ Create a resource**, Navigate to **AI + Machine Learning > Text Analytics**,
   or click [Create **Text Analytics**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics)
1. Enter all required settings:

    |Setting|Value|
    |--|--|
    |Name|Desired name (2-64 characters)|
    |Subscription|Select appropriate subscription|
    |Location|Select a nearby location|
    |Pricing Tier|`S` - the standard pricing tier|
    |Resource Group|Select an available resource group|

1. Click **Create** and wait for the resource to be created. After it is created, your browser automatically redirects to the newly created resource page
1. Collect configured `endpoint` and an API key:

    |Resource Tab in Portal|Setting|Value|
    |--|--|--|
    |**Overview**|Endpoint|Copy the endpoint. It looks similar to `https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.0`|
    |**Keys**|API Key|Copy 1 of the two keys. It is a 32 alphanumeric-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|