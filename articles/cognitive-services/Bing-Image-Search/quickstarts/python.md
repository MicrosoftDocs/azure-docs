---
title: "Quickstart: Perform an image search with Python - Bing Image Search API"
description: Use this quickstart to make your first call to the Bing Image Search API and receive a JSON response. This simple Python application sends a search query to the API and displays the raw results.
services: cognitive-services
author: aahill
manager: cgronlun
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: quickstart
ms.date: 8/20/2018
ms.author: aahi
---

# Quickstart: Send search queries using the REST API and Python

Use this quickstart to make your first call to the Bing Image Search API and receive a JSON response. This simple Python application sends a search query to the API and displays the raw results.

While this application is written in Python, the API is a RESTful Web service compatible with most programming languages.

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge:

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingImageSearchAPI.ipynb)


Additionally, the source code for this sample is available [on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingImageSearchv7.py).

## Prerequisites

[!INCLUDE [cognitive-services-bing-image-search-signup-requirements](../../../../includes/cognitive-services-bing-image-search-signup-requirements.md)]

## Running the quickstart

To get started, set `subscription_key` to a valid subscription key for the Bing API service.

```python
subscription_key = None
assert subscription_key
```

Next, verify that the `search_url` endpoint is correct. At this writing, only one endpoint is used for Bing search APIs. If you encounter authorization errors, double-check this value against the Bing search endpoint in your Azure dashboard.


```python
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/images/search"
```

Set `search_term` to look for images of puppies.


```python
search_term = "puppies"
```

The following block uses the `requests` library in Python to call out to the Bing search APIs and return the results as a JSON object. Observe that we pass in the API key via the `headers` dictionary and the search term via the `params` dictionary. To see the full list of options that can be used to filter search results, refer to the [REST API](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference) documentation.


```python
import requests

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "license": "public", "imageType": "photo"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

The `search_results` object contains the actual images along with rich metadata such as related items. For example, the following line of code can extract the thumbnail URLS for the first 16 results.


```python
thumbnail_urls = [img["thumbnailUrl"] for img in search_results["value"][:16]]
```

Then use the `PIL` library to download the thumbnail images and the `matplotlib` library to render them on a $4 \times 4$ grid.


```python
%matplotlib inline
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO

f, axes = plt.subplots(4, 4)
for i in range(4):
    for j in range(4):
        image_data = requests.get(thumbnail_urls[i+4*j])
        image_data.raise_for_status()
        image = Image.open(BytesIO(image_data.content))        
        axes[i][j].imshow(image)
        axes[i][j].axis("off")
plt.show()
```

## Sample JSON response

Responses from the Bing Image Search API are returned as JSON. This sample response has been truncated to show a single result.

```json
{
"_type":"Images",
"instrumentation":{
    "_type":"ResponseInstrumentation"
},
"readLink":"images\/search?q=tropical ocean",
"webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=tropical ocean&FORM=OIIARP",
"totalEstimatedMatches":842,
"nextOffset":47,
"value":[
    {
        "webSearchUrl":"https:\/\/www.bing.com\/images\/search?view=detailv2&FORM=OIIRPO&q=tropical+ocean&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&simid=608027248313960152",
        "name":"My Life in the Ocean | The greatest WordPress.com site in ...",
        "thumbnailUrl":"https:\/\/tse3.mm.bing.net\/th?id=OIP.fmwSKKmKpmZtJiBDps1kLAHaEo&pid=Api",
        "datePublished":"2017-11-03T08:51:00.0000000Z",
        "contentUrl":"https:\/\/mylifeintheocean.files.wordpress.com\/2012\/11\/tropical-ocean-wallpaper-1920x12003.jpg",
        "hostPageUrl":"https:\/\/mylifeintheocean.wordpress.com\/",
        "contentSize":"897388 B",
        "encodingFormat":"jpeg",
        "hostPageDisplayUrl":"https:\/\/mylifeintheocean.wordpress.com",
        "width":1920,
        "height":1200,
        "thumbnail":{
        "width":474,
        "height":296
        },
        "imageInsightsToken":"ccid_fmwSKKmK*mid_8607ACDACB243BDEA7E1EF78127DA931E680E3A5*simid_608027248313960152*thid_OIP.fmwSKKmKpmZtJiBDps1kLAHaEo",
        "insightsMetadata":{
        "recipeSourcesCount":0,
        "bestRepresentativeQuery":{
            "text":"Tropical Beaches Desktop Wallpaper",
            "displayText":"Tropical Beaches Desktop Wallpaper",
            "webSearchUrl":"https:\/\/www.bing.com\/images\/search?q=Tropical+Beaches+Desktop+Wallpaper&id=8607ACDACB243BDEA7E1EF78127DA931E680E3A5&FORM=IDBQDM"
        },
        "pagesIncludingCount":115,
        "availableSizesCount":44
        },
        "imageId":"8607ACDACB243BDEA7E1EF78127DA931E680E3A5",
        "accentColor":"0050B2"
    }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../tutorial-bing-image-search-single-page-app.md)

## See also

* [What is Bing Image Search?](https://docs.microsoft.com/azure/cognitive-services/bing-image-search/overview)  
* [Try an online interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)  
* [Get a free Cognitive Services access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-image-search-api)  
* [Azure Cognitive Services Documentation](https://docs.microsoft.com/azure/cognitive-services)
* [Bing Image Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-images-api-v7-reference)
