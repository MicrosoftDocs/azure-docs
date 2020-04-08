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

## Create an Anomaly Detector resource

1. Sign into the [Azure portal](https://portal.azure.com)
1. Click [Create **Anomaly Detector**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector) resource
1. Enter all required settings:

    |Setting|Value|
    |--|--|
    |Name|Desired name (2-64 characters)|
    |Subscription|Select appropriate subscription|
    |Location|Select any nearby and available location|
    |Pricing Tier|`F0` - the minimal pricing tier|
    |Resource Group|Select an available resource group|
    |Preview Confirmation Checkbox (required)|Whether or not you've read the **Preview** notice|

1. Click **Create** and wait for the resource to be created. After it is created, navigate to the resource page
1. Collect configured `endpoint` and an API key:

    |Resource Tab in Portal|Setting|Value|
    |--|--|--|
    |**Overview**|Endpoint|Copy the endpoint. It looks similar to `https://westus2.api.cognitive.microsoft.com/`|
    |**Keys**|API Key|Copy 1 of the two keys. It is a 32 alphanumeric-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|



