---
title: "Quickstart: Perform a news search with Python and the Bing News Search REST API"
titlesuffix: Azure Cognitive Services
description:  Use this quickstart to send a request to the Bing News Search REST API using Python, and receive a JSON response.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-news-search
ms.topic: quickstart
ms.date: 6/18/2019
ms.author: aahi
ms.custom: seodec2018
---

# Quickstart: Perform a news search using Python and the Bing News Search REST API

Use this quickstart to make your first call to the Bing News Search API and receive a JSON response. This simple JavaScript application sends a search query to the API and processes the results. While this application is written in Python, the API is a RESTful Web service compatible most programming languages.

You can run this code sample as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge: 

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingNewsSearchAPI.ipynb)

The source code for this sample is also available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingNewsSearchv7.py).

## Prerequisites

[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../includes/cognitive-services-bing-news-search-signup-requirements.md)]

See also [Cognitive Services Pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

## Create and initialize the application

1. Create a new Python file in your favorite IDE or editor, and import the request module. Create variables for your subscription key, endpoint and a search term. You can find your endpoint in the Azure dashboard.

```python
import requests

subscription_key = "your subscription key"
search_term = "Microsoft"
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
```

### Create parameters for the request

1. Add your subscription key to a new dictionary, using `"Ocp-Apim-Subscription-Key"` as the key. Do the same for your search parameters.

    ```python
    headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
    params  = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}
    ```

## Send a request and get a response

1. Use the requests library to call the Bing Visual Search API using your subscription key, and the dictionary objects created in the last step.

    ```python
    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    ```

2. `search_results` contains the response from the API as a JSON object. Access the descriptions of the articles contained in the response.
    
    ```python
    descriptions = [article["description"] for article in search_results["value"]]
    ```

## Displaying the results

These descriptions can then be rendered as a table with the search keyword highlighted in **bold**.

```python
from IPython.display import HTML
rows = "\n".join(["<tr><td>{0}</td></tr>".format(desc)
                  for desc in descriptions])
HTML("<table>"+rows+"</table>")
```

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](tutorial-bing-news-search-single-page-app.md)
