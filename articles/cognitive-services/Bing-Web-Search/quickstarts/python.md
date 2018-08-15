---
title: Quickstart: Use Python to call the Bing Web Search API
description: Get information and code samples to help you quickly get started using the Bing Web Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: v-jerkin
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: article
ms.date: 9/18/2017
ms.author: v-jerkin, erhopf
---

# Quickstart: Use Python to call the Bing Web Search API  

Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response in less than 10 minutes.  

[!INCLUDE [cognitive-services-bing-web-search-quickstart-signup](../../includes/cognitive-services-bing-web-search-quickstart-signup.md)]

This example is run as a Jupyter notebook on [MyBinder](https://mybinder.org). Click the launch Binder badge:

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingWebSearchAPI.ipynb)

## Make a call to the Bing Web Search API

Set `subscription_key` to your API key for the Bing API service.

```python
subscription_key = "YOUR_ACCESS_KEY"
assert subscription_key
```

Verify that the `search_url` endpoint is correct. If you run into any authorization errors, double-check this value against the Bing search endpoint in your Azure dashboard.

```python
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/search"
```

Set `search_term` to query Bing for Microsoft Cognitive Services.

```python
search_term = "Microsoft Cognitive Services"
```

This block uses the `requests` library in Python to call the Bing Web Search API and return results as a JSON object. The API key is passed in the `headers` dictionary and the search term via the `params` dictionary. For a complete list of options available to filter search results, see [REST API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference) documentation.


```python
import requests

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations":True, "textFormat":"HTML"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

The `search_results` object contains the search results along with metadata such as related queries and pages. This code block formats the top pages returned by the query.


```python
from IPython.display import HTML

rows = "\n".join(["""<tr>
                       <td><a href=\"{0}\">{1}</a></td>
                       <td>{2}</td>
                     </tr>""".format(v["url"],v["name"],v["snippet"]) \
                  for v in search_results["webPages"]["value"]])
HTML("<table>{0}</table>".format(rows))
```

## Sample response  

Responses from the Bing Web Search API are returned as JSON. This sample response has been formatted using the `IPython.display` library and renders the output in browser.  

## Next steps

> [!div class="nextstepaction"]
> [Bing Web search single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [cognitive-services-bing-web-search-quickstart-see-also](../cognitive-services-bing-web-search-quickstart-see-also.md)]  
