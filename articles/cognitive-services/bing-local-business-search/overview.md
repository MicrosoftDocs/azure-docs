---
title: What is the Bing Local Business Search API?
titleSuffix: Azure Cognitive Services
description: The Bing Local Business Search API is a RESTful service that enables your applications to find information about local places and businesses based on search queries.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-local-business
ms.topic: overview
ms.date: 03/24/2020
ms.author: aahi
---

# What is Bing Local Business Search?
The Bing Local Business Search API is a RESTful service that enables your applications to find information about local businesses based on search queries. For example, `q=<business-name> in Redmond, Washington`, or `q=Italian restaurants near me`. 

## Features
| Feature | Description |  
| -- | -- | 
| [Find local businesses and locations](quickstarts/local-quickstart.md) | The Bing Local Business Search API gets localized results from a query. Results include a URL for the business's website and display text, phone number, and geographical location, including: GPS coordinates, city, street address |  
| [Filter local results with geographic boundaries](specify-geographic-search.md) | Add coordinates as search parameters to limit results to a specific geographic area, specified by either a circular area or square bounding box. | 
| [Filter local business results by category](local-categories.md) | Search for local business results by category. This option uses reverse IP location or GPS coordinates of the caller to return localized results in various categories of business.|

## Workflow
Call the Bing Local Business Search API from any programming language that can make HTTP requests and parse JSON responses. This service is accessible using the REST API.
 
1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account)  with access to the Bing Search APIs. If you don't have an Azure subscription, you can [create a free account](https://azure.microsoft.com/free/cognitive-services/).   
2. URL encode your search terms for the `q=""` query parameter. For example, `q=nearby+restaurant` or `q=nearby%20restaurant`. Set pagination as well, if needed. 
3. Send a [request to the Bing Local Business Search API](quickstarts/local-quickstart.md) 
4. Parse the JSON response 

> [!NOTE]
> Currently, Local Business Search: 
> * Only supports only the `en-US` market. 
> * Does not support Bing Autosuggest. 

## Next steps
- [Query and response](local-search-query-response.md)
- [Local Business Search quickstart](quickstarts/local-quickstart.md)
- [Local Business Search API reference](local-search-reference.md)
- [Use and display requirements](use-display-requirements.md)
