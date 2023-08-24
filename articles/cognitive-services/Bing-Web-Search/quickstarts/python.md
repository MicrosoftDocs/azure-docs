---
title: "Quickstart: Perform a search with Python - Bing Web Search API"
titleSuffix: Azure AI services
description: Use this quickstart to send requests to the Bing Web Search REST API using Python, and receive a JSON response
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-web-search
ms.topic: quickstart
ms.date: 05/22/2020
ms.author: aahi
ms.custom: seodec2018, devx-track-python, mode-api
#Customer intent: As a new developer, I want to make my first call to the Bing Web Search API and receive a response using Python.
---

# Quickstart: Use Python to call the Bing Web Search API  

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Web Search API. This Python application sends a search request to the API, and shows the JSON response. Although this application is written in Python, the API is a RESTful Web service compatible with most programming languages.

This example is run as a Jupyter notebook on [MyBinder](https://mybinder.org). To run it, select the launch binder badge:

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingWebSearchAPI.ipynb)

## Prerequisites

* [Python 2.x or 3.x](https://www.python.org/)

[!INCLUDE [bing-web-search-quickstart-signup](../../../../includes/bing-web-search-quickstart-signup.md)]

## Define variables

1. Replace the `subscription_key` value with a valid subscription key from your Azure account.

   ```python
   subscription_key = "YOUR_ACCESS_KEY"
   assert subscription_key
   ```

2. Declare the Bing Web Search API endpoint. You can use the global endpoint in the following code, or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

   ```python
   search_url = "https://api.bing.microsoft.com/v7.0/search"
   ```

3. Optionally, customize the search query by replacing the value for `search_term`.

   ```python
   search_term = "Azure Cognitive Services"
   ```

## Make a request

This code uses the `requests` library to call the Bing Web Search API and return the results as a JSON object. The API key is passed in the `headers` dictionary, and the search term and query parameters are passed in the `params` dictionary. 

For a complete list of options and parameters, see [Bing Web Search API v7](/rest/api/cognitiveservices-bingsearch/bing-web-api-v7-reference).

```python
import requests

headers = {"Ocp-Apim-Subscription-Key": subscription_key}
params = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

## Format and display the response

The `search_results` object includes the search results, and such metadata as related queries and pages. This code uses the `IPython.display` library to format and display the response in your browser.

```python
from IPython.display import HTML

rows = "\n".join(["""<tr>
                       <td><a href=\"{0}\">{1}</a></td>
                       <td>{2}</td>
                     </tr>""".format(v["url"], v["name"], v["snippet"])
                  for v in search_results["webPages"]["value"]])
HTML("<table>{0}</table>".format(rows))
```

## Sample code on GitHub

To run this code locally, see the complete [sample available on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingWebSearchv7.py).

## Next steps

> [!div class="nextstepaction"]
> [Bing Web Search API single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [bing-web-search-quickstart-see-also](../../../../includes/bing-web-search-quickstart-see-also.md)]
