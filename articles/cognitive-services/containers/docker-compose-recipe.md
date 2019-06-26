---
title: Docker compose container recipes
titleSuffix: Azure Cognitive Services
description: 

services: cognitive-services
author: IEvangelist
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: conceptual 
ms.date: 06/19/2019
ms.author: dapine
#As a potential customer, I want to know how to configure containers so I can reuse them.

# SME: Brendan Walsh
---

# Use multiple containers in a private network with Docker Compose

Provide the appropriate _apikey_, _billing_, and _endpoint URI_ values.

```docker-compose
version: '3.3'
services:
  forms:
    image:  "containerpreview.azurecr.io/microsoft/cognitive-services-form-recognizer"
    environment:
       eula: accept
       billing: "< Your billing URL >"
       apikey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
       FormRecognizer__ComputerVisionApiKey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
       FormRecognizer__ComputerVisionEndpointUri: "< Your computer vision, form recognizer URI >"
    volumes:
       - type: bind
         source: e:\publicpreview\output
         target: /output
       - type: bind
         source: e:\publicpreview\input
         target: /input
    ports:
      - "5010:5000"

  ocr:
    image: "containerpreview.azurecr.io/microsoft/cognitive-services-recognize-text"
    environment:
      eula: accept
      apikey: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      billing: "< Your billing URL >"
    ports:
      - "5021:5000"
```
