---
title: "Quickstart: Call your Bing Custom Search endpoint using Python | Microsoft Docs"
titleSuffix: Azure Cognitive Services
description: Use this quickstart to begin requesting search results from your Bing Custom Search instance using Python.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: quickstart
ms.date: 05/08/2020
ms.author: aahi
ms.custom: tracking-python
---

# Quickstart: Call your Bing Custom Search endpoint using Python

Use this quickstart to learn how to request search results from your Bing Custom Search instance. Although this application is written in Python, the Bing Custom Search API is a RESTful web service compatible with most programming languages. The source code for this sample is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingCustomSearchv7.py).

## Prerequisites

- A Bing Custom Search instance. For more information, see [Quickstart: Create your first Bing Custom Search instance](quick-start.md).
- [Python](https://www.python.org/) 2.x or 3.x.

[!INCLUDE [cognitive-services-bing-custom-search-prerequisites](../../../includes/cognitive-services-bing-custom-search-signup-requirements.md)]


## Create and initialize the application

- Create a new Python file in your favorite IDE or editor, and add the following import statements. Create variables for your subscription key, custom configuration ID, and search term.

    ```python
    import json
    import requests
    
    subscriptionKey = "YOUR-SUBSCRIPTION-KEY"
    customConfigId = "YOUR-CUSTOM-CONFIG-ID"
    searchTerm = "microsoft"
    ```

## Send and receive a search request 

1. Construct the request URL by appending your search term to the `q=` query parameter, and your search instance's custom configuration ID to the `customconfig=` parameter. Separate the parameters with an ampersand (`&`). You can use the global endpoint in the following code, or use the [custom subdomain](../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

    ```python
    url = 'https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?' + 'q=' + searchTerm + '&' + 'customconfig=' + customConfigId
    ```

2. Send the request to your Bing Custom Search instance, and print the returned search results.  

    ```python
    r = requests.get(url, headers={'Ocp-Apim-Subscription-Key': subscriptionKey})
    print(r.text)
    ```

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web app](./tutorials/custom-search-web-page.md)
