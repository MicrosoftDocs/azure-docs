---
title: Container support
titleSuffix: Azure AI services
#services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-anomaly-detector
ms.topic: include 
ms.date: 09/10/2020
ms.author: mbullwin
---

## Create an Anomaly Detector resource

1. Sign in to the <a href="https://portal.azure.com" target="_blank">Azure portal</a>.
1. Select <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAnomalyDetector" target="_blank">Create Anomaly Detector</a> resource.
1. Enter all required settings:

    |Setting|Value|
    |--|--|
    |Name|Desired name (2-64 characters)|
    |Subscription|Select appropriate subscription|
    |Location|Select any nearby and available location|
    |Pricing Tier|`F0` - 10 Calls per second, 20K Transactions per month. <br> Or:<br> `S0` - 80 Calls per second|
    |Resource Group|Select an available resource group|

1. Select **Create** and wait for the resource to be created. After it is created, navigate to the resource page
1. Collect configured `endpoint` and an API key:

    |Keys and Endpoint tab in the portal|Setting|Value|
    |--|--|--|
    |**Overview**|Endpoint|Copy the endpoint. It looks similar to `https://<your-resource-name>.cognitiveservices.azure.com/`|
    |**Keys**|API Key|Copy 1 of the two keys. It is a 32 alphanumeric-character string with no spaces or dashes, `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`.|
