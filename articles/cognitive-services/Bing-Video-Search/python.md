---
title: "Quickstart: Bing Video Search, Python"
titlesuffix: Azure Cognitive Services
description: Get information and code samples to help you quickly get started using the Bing Video Search API.
services: cognitive-services
author: v-jerkin
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-video-search
ms.topic: quickstart
ms.date: 9/21/2017
ms.author: v-jerkin
---

# Quickstart: Bing Video Search API with Python

This walkthrough shows you how to use the Bing Video Search API, part of Microsoft Cognitive Services on Azure. Refer to the [API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference) for technical details about the APIs.

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge: 

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingVideoSearchAPI.ipynb)


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
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/videos/search"
```

Set `search_term` to look for videos of kittens


```python
search_term = "kittens"
```

The following block uses the `requests` library in Python to call out to the Bing search APIs and return the results as a JSON object. Observe that we pass in the API key via the `headers` dictionary and the search term via the `params` dictionary. To see the full list of options that can be used to filter search results, refer to the [REST API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-video-api-v7-reference) documentation.


```python
import requests

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "count":5, "pricing": "free", "videoLength":"short"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

The `search_results` object contains the relevant videos along with rich metadata. To view one of the videos, use its `embedHtml` property and insert it into an `IFrame`.


```python
from IPython.display import HTML
HTML(search_results["value"][0]["embedHtml"].replace("autoplay=1","autoplay=0"))
```

## Next steps

> [!div class="nextstepaction"]
> [Paging videos](paging-videos.md)
> [Resizing and cropping thumbnail images](resize-and-crop-thumbnails.md)

## See also 

 [Searching the web for videos](search-the-web.md)
 [Try it](https://azure.microsoft.com/services/cognitive-services/bing-video-search-api/)
