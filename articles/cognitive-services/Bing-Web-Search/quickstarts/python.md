---
title: "Quickstart: Perform a search with Python - Bing Web Search API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you will learn how to make your first call to the Bing Web Search API using Python and receive a JSON response.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: quickstart
ms.date: 8/16/2018
ms.author: erhopf
#Customer intent: As a new developer, I want to make my first call to the Bing Web Search API and receive a response using Python.
---

# Quickstart: Use Python to call the Bing Web Search API  

Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response in less than 10 minutes.  

[!INCLUDE [bing-web-search-quickstart-signup](../../../../includes/bing-web-search-quickstart-signup.md)]

This example is run as a Jupyter notebook on [MyBinder](https://mybinder.org). Click the launch Binder badge:

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingWebSearchAPI.ipynb)

## Define variables

Replace the `subscription_key` value with a valid subscription key from your Azure account.

```python
subscription_key = "YOUR_ACCESS_KEY"
assert subscription_key
```

Declare the Bing Web Search API endpoint. If you run into any authorization errors, double-check this value against the Bing search endpoint in your Azure dashboard.

```python
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/search"
```

Feel free to customize the search query by replacing the value for `search_term`.

```python
search_term = "Azure Cognitive Services"
```

## Make a request

This block uses the `requests` library to call the Bing Web Search API and return the results as a JSON object. The API key is passed in the `headers` dictionary, and the search term and query parameters are passed in the `params` dictionary. See [Bing Web Search API v7](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference) documentation for a complete list of options and parameters.

```python
import requests

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations":True, "textFormat":"HTML"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

## Format and display the response

The `search_results` object includes the search results and metadata such as related queries and pages. This code uses the `IPython.display` library to format and display the response in your browser.

```python
from IPython.display import HTML

rows = "\n".join(["""<tr>
                       <td><a href=\"{0}\">{1}</a></td>
                       <td>{2}</td>
                     </tr>""".format(v["url"],v["name"],v["snippet"]) \
                  for v in search_results["webPages"]["value"]])
HTML("<table>{0}</table>".format(rows))
```

## Sample code on Github

If you'd like to run this code locally, the complete [sample is available on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/nodejs/Search/BingWebSearchv7.js).

## Next steps

> [!div class="nextstepaction"]
> [Bing Web search single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [bing-web-search-quickstart-see-also](../../../../includes/bing-web-search-quickstart-see-also.md)]
