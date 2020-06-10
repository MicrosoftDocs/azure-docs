---
title: "Quickstart: Perform a news search with Python and the Bing News Search REST API"
titleSuffix: Azure Cognitive Services
description:  Use this quickstart to send a request to the Bing News Search REST API using Python, and receive a JSON response.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-news-search
ms.topic: quickstart
ms.date: 05/22/2020
ms.author: aahi
ms.custom: seodec2018, tracking-python
---

# Quickstart: Perform a news search using Python and the Bing News Search REST API

Use this quickstart to make your first call to the Bing News Search API. This simple Python application sends a search query to the API and processes the JSON result. 

Although this application is written in Python, the API is a RESTful Web service compatible with most programming languages.

To run this code sample as a Jupyter notebook on [MyBinder](https://mybinder.org), select the **launch binder** badge: 

[![launch binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingNewsSearchAPI.ipynb)

The source code for this sample is also available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingNewsSearchv7.py).

[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../includes/cognitive-services-bing-news-search-signup-requirements.md)]

## Create and initialize the application

Create a new Python file in your favorite IDE or editor, and import the request module. Create variables for your subscription key, endpoint, and search term. You can use the global endpoint in the following code, or use the [custom subdomain](../../cognitive-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

```python
import requests

subscription_key = "your subscription key"
search_term = "Microsoft"
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
```

## Create parameters for the request

Add your subscription key to a new dictionary, using `Ocp-Apim-Subscription-Key` as the key. Do the same for your search parameters.

```python
headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}
```

## Send a request and get a response

1. Use the requests library to call the Bing Visual Search API with your subscription key, and the dictionary objects you created in the previous step.

    ```python
    response = requests.get(search_url, headers=headers, params=params)
    response.raise_for_status()
    search_results = response.json()
    ```

2. Access the descriptions of the articles contained in the response from the API, which is stored in `search_results` as a JSON object. 
    
    ```python
    descriptions = [article["description"] for article in search_results["value"]]
    ```

## Display the results

These descriptions can then be rendered as a table with the search keyword highlighted in bold.

```python
from IPython.display import HTML
rows = "\n".join(["<tr><td>{0}</td></tr>".format(desc)
                  for desc in descriptions])
HTML("<table>"+rows+"</table>")
```

## Next steps

> [!div class="nextstepaction"]
> [Create a single-page web app](tutorial-bing-news-search-single-page-app.md)
