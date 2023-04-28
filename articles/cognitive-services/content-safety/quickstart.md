---
title: "Quickstart: Analyze image and text content"
titleSuffix: Azure Cognitive Services
description: Get started using Content Safety to analyze image and text content for objectionable material.
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

# QuickStart: Analyze image and text content

Get started with the Content Studio, REST API, or client SDKs to do basic image and text moderation. The Content Safety service provides you with AI algorithms for flagging objectionable content. Follow these steps to try it out.

> [!NOTE]
> 
> The sample data and code may contain offensive content rated by the service as TBD risk level. User discretion is advised.

::: zone pivot="programming-language-rest"

[!INCLUDE [REST API quickstart](./includes/quickstarts/rest-quickstart.md)]

::: zone-end

::: zone pivot="programming-language-csharp"

[!INCLUDE [C# SDK quickstart](./includes/quickstarts/csharp-quickstart.md)]

::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Python SDK quickstart](./includes/quickstarts/python-quickstart.md)]

::: zone-end


### Response codes

The API may return the following HTTP response codes:

| Response code | Description                                                  |
| :------------ | :----------------------------------------------------------- |
| 200           | OK - Standard response for successful HTTP requests.         |
| 201           | Created - The request has been fulfilled, resulting in the creation of a new resource. |
| 204           | No content - The server successfully processed the request, and isn't returning any content. Usually this is returned for the DELETE operation. |
| 400           | Bad request – The server can't process the request due to a client error (for example, malformed request syntax, size too large, invalid request message framing, or deceptive request routing). |
| 401           | Unauthorized – Authentication is required and has failed.    |
| 403           | Forbidden – User not having the necessary permissions for a resource. |
| 404           | Not found - The requested resource couldn't be found.       |
| 429           | Too many requests – The user has sent too many requests in a given amount of time. Refer to "Quota Limit" section for limitations. |
| 500           | Internal server error – An unexpected condition was encountered on the server side. |
| 503           | Service unavailable – The server can't handle the request temporarily. Try again at a later time. |
| 504           | Gateway time out – The server didn't receive a timely response from the upstream service. Try again at a later time. |

## Clean up resources

TBD

## Next steps

Next, learn how to use custom blocklists to customize your text moderation process.

> [!div class="nextstepaction"]
> [Use custom blocklists](./how-to/use-custom-blocklist.md)