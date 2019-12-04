---
title: How to get V3 prediction endpoint
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 10/14/2019
ms.author: diberry
---


1. In the LUIS portal, in the Manage section (top right menu), on the Keys and endpoints page (left menu), select the endpoint URL at the bottom of the page.

    This action opens browser tab with the endpoint URL in the address bar.

    The URL has your app ID, key, and slot name. The V3 prediction endpoint URL looks like:

    `https://REGION.api.cognitive.microsoft.com/luis/prediction/v3.0/apps/APP-ID/slots/SLOT-NAME/predict?subscription-key=YOUR-KEY&<optional-name-value-pairs>&query=UTTERANCE-TEXT.`

