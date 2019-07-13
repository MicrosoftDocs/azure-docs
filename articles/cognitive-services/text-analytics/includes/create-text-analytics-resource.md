---
title: Create a Cognitive Services Text Analytics resource
titleSuffix: Azure Cognitive Services
description: Learn how to create a Cognitive Services Text Analytics resource.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 06/26/2019
ms.author: dapine
---

## Create a Cognitive Services Text Analytics resource

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**, and then go to **AI + Machine Learning** > **Text Analytics**.
   Or, go to [Create Text Analytics](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics).
1. Enter all the required settings:

    |Setting|Value|
    |--|--|
    |Name|Enter a name (2-64 characters)|
    |Subscription|Select the appropriate subscription|
    |Location|Select a nearby location|
    |Pricing tier| Enter **S**, the standard pricing tier|
    |Resource group|Select an available resource group|

1. Select **Create** and wait for the resource to be created. Your browser automatically redirects to the newly created resource page.
1. Collect the configured `endpoint` and an API key:

    |Resource tab in portal|Setting|Value|
    |--|--|--|
    |**Overview**|Endpoint|Copy the endpoint. It appears similar to `https://northeurope.api.cognitive.microsoft.com/text/analytics/v2.0`|
    |**Keys**|API Key|Copy one of the two keys. It's a 32-character alphanumeric string with no spaces or dashes: <`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`>.|
