---
title: Container support
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 7/5/2019
ms.author: trbye
---

## Create a Speech resource

1. Sign into the [Azure portal](https://portal.azure.com)
1. Click [Create **Speech**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices) resource
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
    |**Overview**|Endpoint|Copy the endpoint. It looks similar to `https://speech.cognitiveservices.azure.com/sts/v1.0/issuetoken`|
    |**Keys**|API Key|Copy 1 of the two keys. It is a 32 alphanumeric-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|
