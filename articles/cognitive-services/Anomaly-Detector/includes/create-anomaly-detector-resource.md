---
title: Container support
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 09/10/2020
ms.author: mbullwin
---

## Create an Anomaly Detector resource

1. Sign into the <a href="https://portal.azure.com" target="_blank">Azure portal<span class="docon docon-navigate-external x-hidden-focus"></span></a>.
1. Select <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector" target="_blank">Create Anomaly Detector<span class="docon docon-navigate-external x-hidden-focus"></span></a> resource.
1. Enter all required settings:

    |Setting|Value|
    |--|--|
    |Name|Desired name (2-64 characters)|
    |Subscription|Select appropriate subscription|
    |Location|Select any nearby and available location|
    |Pricing Tier|`F0` - the minimal pricing tier|
    |Resource Group|Select an available resource group|

1. Click **Create** and wait for the resource to be created. After it is created, navigate to the resource page
1. Collect configured `endpoint` and an API key:

    |Resource Tab in Portal|Setting|Value|
    |--|--|--|
    |**Overview**|Endpoint|Copy the endpoint. It looks similar to `https://westus2.api.cognitive.microsoft.com/`|
    |**Keys**|API Key|Copy 1 of the two keys. It is a 32 alphanumeric-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|



