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
The Local Search API is similar to other Bing endpoints, but the Local Search API query gets localized results: businesses or places relevant to the search.  The Local Search API currently only supports en-us market and language.

To get local search results, call this API instead of the more general Web Search API. 

The Local Search query can specify an entity such as "<business-name> in Bellevue", or it can use a category such as "Italian restaurants near me".

Search parameters can also specify longitude/latitude center and radius to limit the results geographically. There is also a bounding box defined by the southeast and northwest corners of a local map.

After the user enters query terms, URL encode the terms before setting the `q=""` query parameter. For example, if the user enters restaurant in Bellevue, set `q=restaurant+Bellevue` or `q=restaurant%20Bellevue`. 

Currently, the only market supported is en-US.  Other options may return results from nearest match.

Set pagination, if needed, using the `count` and `first` parameters. The `count` parameter specifies the number of results.  The `first` parameter specifies the index of the first result.

## Features
In addition to instant answers, Bing Web Search provides additional features and functionality that allow you to customize search results for your users.

## Workflow
1. Call the Bing Local Business Search REST API from any programming language that can make HTTP requests and parse JSON responses. 
2. Create a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with access to the Bing Search APIs. If you don't have an Azure subscription, you can create a free account.
3. Send a request to the Bing Web Search API.
Parse the JSON response.

## Next steps
- [Query and response](local-search-query-response.md)
- [Local Search quickstart](local-quickstart.md)
- [Local Search Java quickstart](local-search-java-quickstart.md)
- [Local Search Node quickstart](local-search-node-quickstart.md)
- [Local Search Python quickstart](local-search-python-quickstart.md)
- [Local Business Search API reference](local-search-reference.md)
- [Use and display requirements](use-display-requirements.md)