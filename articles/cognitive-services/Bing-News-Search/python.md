---
title: "Quickstart: Perform a news search with Python - Bing News Search REST API"
titlesuffix: Azure Cognitive Services
description:  Use this quickstart to send a request to the Bing News Search REST API using Python, and receive a JSON response.
services: cognitive-services
author: aahill
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-news-search
ms.topic: quickstart
ms.date: 9/21/2017
ms.author: aahi
ms.custom: seodec2018
---

# Quickstart: Perform a news search using Python and the Bing News Search REST API

Use this quickstart to make your first call to the Bing News Search API and receive a JSON response. This simple JavaScript application sends a search query to the API and processes the results.

While this application is written in Python, the API is a RESTful Web service compatible most programming languages.

You can run this code sample as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge: 

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingNewsSearchAPI.ipynb)

The source code for this sample is also available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingNewsSearchv7.py)

## Prerequisites

[!INCLUDE [cognitive-services-bing-news-search-signup-requirements](../../../includes/cognitive-services-bing-news-search-signup-requirements.md)]

See also [Cognitive Services Pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

## Running the walkthrough
First, set `subscription_key` to your API key for the Bing API service.


```python
subscription_key = None
assert subscription_key
```

Next, verify that the `search_url` endpoint is correct. At this writing, only one endpoint is used for Bing search APIs. If you encounter authorization errors, double-check this value against the Bing search endpoint in your Azure dashboard.


```python
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
```

Set `search_term` to look for news articles about Microsoft.


```python
search_term = "Microsoft"
```

The following block uses the `requests` library in Python to call out to the Bing search APIs and return the results as a JSON object. Observe that we pass in the API key via the `headers` dictionary and the search term via the `params` dictionary. To see the full list of options that can be used to filter search results, refer to the [REST API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-news-api-v7-reference) documentation.


```python
import requests

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

The `search_results` object contains the relevant new articles along with rich metadata. For example, the following line of code extracts the descriptions of the articles.


```python
descriptions = [article["description"] for article in search_results["value"]]
```

These descriptions can then be rendered as a table with the search keyword highlighted in **bold**.


```python
from IPython.display import HTML
rows = "\n".join(["<tr><td>{0}</td></tr>".format(desc) for desc in descriptions])
HTML("<table>"+rows+"</table>")
```

## Next steps

> [!div class="nextstepaction"]
> [Paging news](paging-news.md)
> [Using decoration markers to highlight text](hit-highlighting.md)

## See also 

 [Searching the web for news](search-the-web.md)  
 [Try it](https://azure.microsoft.com/services/cognitive-services/bing-news-search-api/)
