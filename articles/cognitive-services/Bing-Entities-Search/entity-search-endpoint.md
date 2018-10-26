---
title: Bing Entity Search endpoints
titlesuffix: Azure Cognitive Services
description: Summary of the Entity Search API endpoint.
services: cognitive-services
author: v-jaswel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-entity-search
ms.topic: conceptual
ms.date: 12/04/2017
ms.author: v-jaswel
---

# Entity Search endpoints
The **Entity Search API**  includes one endpoint.

## Endpoint
To request entity search results, send a request to the following endpoint. Use the headers and URL parameters to define further specifications.

Endpoint `GET`: 
``` 
https://api.cognitive.microsoft.com/bing/v7.0/entities
```

The following URL parameters are required:
- mkt. The market where the results come from. 
- q. The entity search query.

## Next steps

> [!div class="nextstepaction"]
> [Bing Entity Search quickstarts](quickstarts/csharp.md)

## See also 

[Bing Entity Search overview](search-the-web.md )
[API Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-entities-api-v7-reference)
