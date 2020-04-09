---
title: "SPX basics - Speech service"
titleSuffix: Azure Cognitive Services
description: Learn how to use the SPX command line tool to work with the Speech SDK with no code and minimal setup. 
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: quickstart
ms.date: 04/04/2020
ms.author: trbye
---

# Learn the basics of SPX

## Prerequisites

The only prerequisite is an Azure Speech subscription. See the [guide](get-started.md#new-resource) on creating a new subscription if you don't already have one.

## Download and install

## Create subscription config

To start using SPX, you first need to enter your Speech subscription key and region information. See the [region support](https://docs.microsoft.com/azure/cognitive-services/speech-service/regions#speech-sdk) page to find your region identifier. Once you have your subscription key and region identifier (ex. `eastus`, `westus`), run the following commands.

```shell
spx config @key --set YOUR-SUBSCRIPTION-KEY
spx config @region --set YOUR-REGION-ID
```

Your subscription authentication is now stored for future SPX requests. If you need to remove either of these stored values, run `spx config @region --clear` or `spx config @key --clear`.