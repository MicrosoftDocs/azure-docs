---
title: What is Bing Local Business Search? | Microsoft Docs
description: Introduction to the Bing Local Business Search API.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.component: bing-local-business
ms.topic: article
ms.date: 08/02/2018
ms.author: rosh
---

# What is Bing Local Business Search?
The Bing Local Business Search API is a RESTful service that enables your applications to find information about local places and businesses based on search queries. For example, `<business-name> in Redmond, Washington`, or `Italian restaurants near me`. Currently, only the `en-US` market is supported. Other options may return results from nearest match. 

## Features
| Feature | Description |  
| -- | -- | 
| [Find local businesses and locations](quickstarts/local-quickstart.md) | The Bing Local Business Search API gets localized information from a query. Results include a URL for the business's website, phone number, display text, and its geographical location, including: city, street address, and neighborhood |  
| [Filter local results with geographic boundaries](specify-geographic-search.md) | Add coordinates as search parameters to limit results to a specific geographic area, specified by either a circular area or square bounding box. | 
| [Filter local results by category](local-categories.md) | Search for local business entities by category. This option uses reverse IP location of the caller to return localized results of various categories of business.|

## Workflow
The Bing Local Business Search API is easy to call from any programming language that can make HTTP requests and parse JSON responses. The service is accessible using the REST API.
 
1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account)  with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/en-us/try/cognitive-services/?api=bing-web-search-api).   
2. URL encode your search terms for the `q=""` query parameter. For example, `q=nearby+restaurant` or `q=nearby%20restaurant`. Set pagination as well, if needed. 
3. Send a [request to the Bing Local Business Search API](quickstarts/local-quickstart.md) 
4. Parse the JSON response 

## Next steps
- [Query and response](local-search-query-response.md)
- [Local Search quickstart](quickstarts/local-quickstart.md)
- [Local Business Search API reference](local-search-reference.md)
- [Use and display requirements](use-display-requirements.md)