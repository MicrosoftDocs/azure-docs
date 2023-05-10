---
title: "Content Safety response codes"
titleSuffix: Azure Cognitive Services
description: See the possible response codes for the Content Safety APIs.
services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: cognitive-services
ms.subservice: content-safety
ms.topic: conceptual
ms.date: 05/09/2023
ms.author: pafarley
---


# Content Safety response codes

The content APIs may return the following HTTP response codes:

| Response code | Description              |
| :------------ | :----------------------- |
| `200`           | OK - Standard response for successful HTTP requests.         |
| `201`           | Created - The request has been fulfilled, resulting in the creation of a new resource. |
| `204`           | No content - The server successfully processed the request, and isn't returning any content. Usually this is returned for the DELETE operation. |
| `400`           | Bad request – The server can't process the request due to a client error (for example, malformed request syntax, size too large, invalid request message framing, or deceptive request routing). |
| `401`           | Unauthorized – Authentication is required and has failed.    |
| `403`           | Forbidden – User not having the necessary permissions for a resource. |
| `404`           | Not found - The requested resource couldn't be found.       |
| `429`           | Too many requests – The user has sent too many requests in a given amount of time. Refer to "Quota Limit" section for limitations. |
| `500`           | Internal server error – An unexpected condition was encountered on the server side. |
| `503`           | Service unavailable – The server can't handle the request temporarily. Try again at a later time. |
| `504`           | Gateway time out – The server didn't receive a timely response from the upstream service. Try again at a later time. |