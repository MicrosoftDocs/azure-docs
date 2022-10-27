---
title: Create a Cognitive Services Language resource
titleSuffix: Azure Cognitive Services
description: Learn how to create a Cognitive Services Language resource.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: include
ms.date: 11/02/2021
ms.author: aahi
ms.custom: ignite-fall-2021
---

## Create a Cognitive Services Language resource

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**, and then go to **AI + Machine Learning** > **Language**.
   Or, go to [Create a Language resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics).
1. Enter all the required settings:

    |Setting|Value|
    |--|--|
    |Name|Enter a name (2-64 characters).|
    |Subscription|Select the appropriate subscription.|
    |Location|Select a nearby location.|
    |Pricing tier| Enter **S**, the standard pricing tier.|
    |Resource group|Select an available resource group.|

1. Select **Create**, and wait for the resource to be created. Your browser automatically redirects to the newly created resource page.
1. Collect the configured `endpoint` and an API key:

    |Resource tab in portal|Setting|Value|
    |--|--|--|
    |**Overview**|Endpoint|Copy the endpoint. It appears similar to `https://my-resource.cognitiveservices.azure.com/text/analytics/v3.0`.|
    |**Keys**|API Key|Copy one of the two keys. It's a 32-character alphanumeric string with no spaces or dashes: <`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`>.|
