---
title: What is Bing Local Business Search? | Microsoft Docs
description: Introduction to the Bing Local Business Search API.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-local-business
ms.topic: article
ms.date: 08/02/2018
ms.author: rosh
---

# What is Bing Local Business Search?
The Local Businesss Search API is similar to other Bing endpoints, but it returns localized businesses or places relevant to the search. 

To get local search results, call this API instead of the more general Web Search API. 

The Local Search query can specify an entity such as "<business-name> in Bellevue", or it can use a category such as "Italian restaurants near me".

Search parameters can also specify longitude/latitude to limit the results geographically. The coordinates can specify center and radius or a bounding box defined by the southeast and northwest corners of the map.

Currently, the only market supported is en-US.  Other options may return results from nearest match.

## Features
The Bing Local Business Search API provides functionality to find local businesses by query or geographical boundaries.

## Workflow
1. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can create a free account.
2. Specify the query terms.
3. URL encode the terms of the `q=""` query parameter. For example, if the user enters restaurant in Bellevue, set `q=restaurant+Bellevue` or `q=restaurant%20Bellevue`. 
4. Set pagination, if needed, using the `count` and `first` parameters. The `count` parameter specifies the number of results.  The `first` parameter specifies the index of the first result.
5. Set the Ocp-Apim-Subscription-Key header.
6. Send a request to the Bing Web Search API.
7. Parse the JSON response.

## Next steps
- [Query and response](local-search-query-response.md)
- [Local Search quickstart](local-quickstart.md)
- [Local Search Java quickstart](local-search-java-quickstart.md)
- [Local Search Node quickstart](local-search-node-quickstart.md)
- [Local Search Python quickstart](local-search-python-quickstart.md)
- [Local Business Search API reference](local-search-reference.md)
- [Use and display requirements](use-display-requirements.md)