---
title: "Quickstart: Search for videos using the Bing Video Search REST API and Python"
titlesuffix: Azure Cognitive Services
description: Use this quickstart to send video search requests to the Bing Video Search REST API using Python.
services: cognitive-services
author: aahill
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-video-search
ms.topic: quickstart
ms.date: 1/09/2019
ms.author: aahi
---

# Quickstart: Search for videos using the Bing Video Search REST API and Python

Use this quickstart to make your first call to the Bing Video Search API and view a search result from the JSON response. This simple Python application sends an HTTP video search query to the API, and displays the response. While this application is written in Python, the API is a RESTful Web service compatible with most programming languages. The source code for this sample is available [on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingVideoSearchv7.py) with additional error handling, and code annotations.

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge: 

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingVideoSearchAPI.ipynb)


## Prerequisites

* Python [2.x or 3.x](https://python.org)

[!INCLUDE [cognitive-services-bing-video-search-signup-requirements](../../../../includes/cognitive-services-bing-video-search-signup-requirements.md)

## Initialize the application

1. Create a new Python file in your favorite IDE or editor and import the following libraries,

    ```python
    import requests
    from IPython.display import HTML
    ```
2.  Create variables for your subscription key, search endpoint, and a search term.
    
    ```python
    subscription_key = None
    assert subscription_key
    search_url = "https://api.cognitive.microsoft.com/bing/v7.0/videos/search"
    search_term = "kittens"
    ```

3. Add your subscription key to a `Ocp-Apim-Subscription-Key` header by creating a new dictionary to associate the header string to your key.

    ```python
    headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
    ```

## Send your request

1. Add the parameters to your request by creating a dictionary named `params`. Add your search term to the `q` parameter, a video count of 5, `free` for the pricing of returned videos, and `short` for the video length.

    ```python
    params  = {"q": search_term, "count":5, "pricing": "free", "videoLength":"short"}
    ```

2. Use the `requests` library in Python to call the Bing Video Search API. Pass the API key and search parameters by using the `headers` and `params` dictionary.
    
    ```python
    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    ```

3. To view one of the returned videos, get a search result from the `search_results` object. Insert the result's `embedHtml` property into an `IFrame`.  

```python
HTML(search_results["value"][0]["embedHtml"].replace("autoplay=1","autoplay=0"))
```

## Next steps

> [!div class="nextstepaction"]
> [Build a single-page web app](tutorial-bing-video-search-single-page-app.md)

## See also 

 [What is the Bing Video Search API](search-the-web.md)
