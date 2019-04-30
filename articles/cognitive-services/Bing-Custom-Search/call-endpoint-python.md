---
title: "Quickstart: Call your Bing Custom Search endpoint using Python | Microsoft Docs"
titlesuffix: Azure Cognitive Services
description: Use this quickstart to begin requesting search results from your Bing Custom Search instance using Python
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: quickstart
ms.date: 03/04/2019
ms.author: aahi
---

# Quickstart: Call your Bing Custom Search endpoint using Python

Use this quickstart to begin requesting search results from your Bing Custom Search instance. While this application is written in Python, the Bing Custom Search API is a RESTful web service compatible with most programming languages. The source code for this sample is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingCustomSearchv7.py).

## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](quick-start.md) for more information.
- [Python](https://www.python.org/) 2.x or 3.x

[!INCLUDE [cognitive-services-bing-custom-search-prerequisites](../../../includes/cognitive-services-bing-custom-search-signup-requirements.md)]


## Create and initialize the application

1. Create a new Python file in your favorite IDE or editor, and add the following import statements. Create variables for your subscription key, Custom Configuration ID, and a search term. 

    ```python
    import json
    import requests
    
    subscriptionKey = "YOUR-SUBSCRIPTION-KEY"
    customConfigId = "YOUR-CUSTOM-CONFIG-ID"
    searchTerm = "microsoft"
    ```

## Send and receive a search request 

1. Construct the request URL by appending your search term to the `q=` query parameter, and your search instance's Custom Configuration ID to `customconfig=`. separate the parameters with a `&` character. 

    ```python
    url = 'https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?' + 'q=' + searchTerm + '&' + 'customconfig=' + customConfigId
    ```

2. Send the request to your Bing Custom Search instance, and print out the returned search results.  

    ```python
    r = requests.get(url, headers={'Ocp-Apim-Subscription-Key': subscriptionKey})
    print(r.text)
    ```

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web app](./tutorials/custom-search-web-page.md)
