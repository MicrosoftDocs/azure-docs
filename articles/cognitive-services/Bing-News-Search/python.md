---
title: "Quickstart: Bing News Search API, Python"
titlesuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Bing News Search API.
services: cognitive-services
author: v-jerkin
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-news-search
ms.topic: quickstart
ms.date: 9/21/2017
ms.author: v-jerkin
---

# Quickstart for Bing News Search API with Python
This walkthrough demonstrates a simple example of calling into the Bing News Search API and post-processing the resulting JSON object. For more information, see [Bing New Search documentation](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference).  

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge: 

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingNewsSearchAPI.ipynb)

## Prerequisites

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

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
