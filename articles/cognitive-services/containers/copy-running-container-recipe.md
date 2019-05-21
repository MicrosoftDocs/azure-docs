---
title: Docker container recipes
titleSuffix: Azure Cognitive Services
description: Learn how to create Cognitive Services Containers for reuse
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: article 
ms.date: 05/16/2019
ms.author: diberry
#As a potential customer, I want to know how to configure containers so I can reuse them.

# SME: Siddhartha Prasad <siprasa@microsoft.com>
---

# "Recipe: Create containers for reuse

Use these container recipes to create Cognitive Services Containers that can be reused.

## Store all configuration settings

Bake in everything

FROM containerpreview.azurecr.io/microsoft/cognitive-services-luis:<tag>
ENV billing=<billing value>
ENV apikey=<apikey value>
COPY luisModel1 /input/
COPY luisModel2 /input/


## Store no configuration settings


## Store billing configuration settings 

Bake in billing info (billing key and endpoint) only :

FROM containerpreview.azurecr.io/microsoft/cognitive-services-luis:<tag>
ENV billing=<billing value>
ENV apikey=<apikey value>


## Store input and out configuration settings

Bake in input params only

FROM containerpreview.azurecr.io/microsoft/cognitive-services-luis:<tag>
COPY luisModel1 /input/
COPY luisModel2 /input/
