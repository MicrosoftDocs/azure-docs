---
title: "Use prediction API to programmatically score images with classifier - Custom Vision"
titleSuffix: Azure Cognitive Services
description: Learn how to use the API to programmatically test images with your Custom Vision Service classifier.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: custom-vision
ms.topic: conceptual
ms.date: 07/26/2021
ms.author: pafarley
---

# Call the Prediction API

In this guide, you'll learn how to call the prediction API to score images with your custom classifier. You'll learn the different ways you can configure the behavior of this API to meet your needs.

> [!NOTE]
> This document uses C# to submit an image to the Prediction API. For more information and examples, see the [Prediction API reference](https://southcentralus.dev.cognitive.microsoft.com/docs/services/Custom_Vision_Prediction_3.0/operations/5c82db60bf6a2b11a8247c15).

## Submit data to the service

[explain how you can attach your data to the API call]

`https://{endpoint}/vision/v3.2-preview.3/read/analyze[?language][&pages][&readingOrder]`

[explain the return value you'll get]

## Determine how to process the data

[explain all the ways you can customize the API call, through query parameters, headers, etc. ]

## Get results from the service

[If this is a separate API call, show it here. Then show a sample response value, and explain any parts of the response that aren't intuitive. Explain error cases if they're relevant enough]

## Next steps

To use the REST API, go to the [_ API Reference](link to API console).