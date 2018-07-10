---
title: include file
description: include file
services: cognitive-services
author: wolfma61
manager: onano

ms.service: cognitive-services
ms.technology: Speech
ms.topic: include
ms.date: 05/07/2018
ms.author: wolfma
ms.custom: include file
---

Region|	Speech to Text endpoint
-|-
West US| `https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
East Asia| `https://eastasia.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`
North Europe| `https://northeurope.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`

> [!NOTE]
> You must append the required language in the URI to avoid an HTTP 401 error. So for en-US the correct URI would be:
> https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US

