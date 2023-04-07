---
title: "Quickstart: Azure Content Safety"
titleSuffix: Azure Cognitive Services
description: Get started moderating text and image content using the Content Safety APIs.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: quickstart
ms.date: 04/06/2023
ms.author: pafarley
zone_pivot_groups: programming-languages-content-safety
keywords: 
---

# Quickstart: Azure Content Safety

Get started with the Content Safety REST API or Content Safety Studio to do basic image and text moderation. The Content Safety service provides you with AI algorithms for flagging objectionable content. Follow these steps to try it out.

::: zone pivot="content-safety-studio"

[!INCLUDE [Studio quickstart](./includes/quickstarts/studio-quickstart.md)]

::: zone-end

::: zone pivot="programming-language-rest"

[!INCLUDE [REST API quickstart](./includes/quickstarts/rest-quickstart.md)]

::: zone-end


### Response codes

The API may return the following HTTP response codes:

| Response code | Description                                                  |
| :------------ | :----------------------------------------------------------- |
| 200           | OK - Standard response for successful HTTP requests.         |
| 201           | Created - The request has been fulfilled, resulting in the creation of a new resource. |
| 204           | No content - The server successfully processed the request, and is not returning any content. Usually you will see it for DELETE operation. |
| 400           | Bad request – The server cannot or will not process the request due to a client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing). |
| 401           | Unauthorized – Authentication is required and has failed.    |
| 403           | Forbidden – User not having the necessary permissions for a resource. |
| 404           | Not found - The requested resource could not be found.       |
| 429           | Too many requests – The user has sent too many requests in a given amount of time. Please refer to "Quota Limit" section for limitations. |
| 500           | Internal server error – An unexpected condition was encountered on the server side. |
| 503           | Service unavailable – The server cannot handle the request temporarily. Please try again later. |
| 504           | Gateway timeout – The server did not receive a timely response from the upstream service. Please try again later. |