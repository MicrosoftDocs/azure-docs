---
title: "Quickstart: Request and filter images using the SDK in Python"
description: In this quickstart, you request and filter the images returned by Bing Image Search, using Python.
titleSuffix: Azure Image Search SDK Python quickstart
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.component: bing-image-search
ms.topic: article
ms.date: 02/14/2018
ms.author: v-gedod
---
 # Quickstart: Request and filter images using the SDK and Python

The Bing Image Search SDK contains the functionality of the REST API for web queries and parsing results. 

The [source code for Python Bing Image Search SDK samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/search/image_search_samples.py) is available on Git Hub.

## Application dependencies
If you don't already have it, install Python. The SDK is compatible with Python 2.7, 3.3, 3.4, 3.5 and 3.6.

The general recommendation for Python development is to use a [virtual environment](https://docs.python.org/3/tutorial/venv.html). 
Install and initialize the virtual environment with the [venv module](https://pypi.python.org/pypi/virtualenv). You must install virtualenv for Python 2.7.
```
python -m venv mytestenv
```
Install Bing Image Search SDK dependencies:
```
cd mytestenv
python -m pip install azure-cognitiveservices-search-imagesearch
```
## Image Search client
Get a [Cognitive Services access key](https://azure.microsoft.com/try/cognitive-services/) under *Search*. 
Add imports:
```
from azure.cognitiveservices.search.imagesearch import ImageSearchAPI
from azure.cognitiveservices.search.imagesearch.models import ImageType, ImageAspect, ImageInsightModule
from msrest.authentication import CognitiveServicesCredentials

subscription_key = "YOUR-SUBSCRIPTION-KEY"
```
Create an instance of the `CognitiveServicesCredentials`, and instantiate the client:
```
client = ImageSearchAPI(CognitiveServicesCredentials(subscription_key))
```
Search images on query (Yosemite), filtered for animated gifs and wide aspect. Verify number of results and print out insightsToken, thumbnail URL, and web URL of first result.
```
image_results = client.images.search(
        query="Yosemite",
        image_type=ImageType.animated_gif, # Could be the str "AnimatedGif"
        aspect=ImageAspect.wide # Could be the str "Wide"
    )
    print("\r\nSearch images for \"Yosemite\" results that are animated gifs and wide aspect")

    if image_results.value:
        first_image_result = image_results.value[0]
        print("Image result count: {}".format(len(image_results.value)))
        print("First image insights token: {}".format(first_image_result.image_insights_token))
        print("First image thumbnail url: {}".format(first_image_result.thumbnail_url))
        print("First image web search url: {}".format(first_image_result.web_search_url))
    else:
        print("Couldn't find image results!")

```
Search images for (Yosemite), filtered for animated gifs and wide aspect.  Verify number of results.  Print out `insightsToken`, `thumbnail url` and `web url` of first result.
```
image_results = client.images.search(
    query="Yosemite",
    image_type=ImageType.animated_gif, # Could be the str "AnimatedGif"
    aspect=ImageAspect.wide # Could be the str "Wide"
)
print("\r\nSearch images for \"Yosemite\" results that are animated gifs and wide aspect")

if image_results.value:
    first_image_result = image_results.value[0]
    print("Image result count: {}".format(len(image_results.value)))
    print("First image insights token: {}".format(first_image_result.image_insights_token))
    print("First image thumbnail url: {}".format(first_image_result.thumbnail_url))
    print("First image web search url: {}".format(first_image_result.web_search_url))
else:
    print("Couldn't find image results!")

```

Get trending results:
```
trending_result = client.images.trending()
print("\r\nSearch trending images")

# Categorires
if trending_result.categories:
    first_category = trending_result.categories[0]
    print("Category count: {}".format(len(trending_result.categories)))
    print("First category title: {}".format(first_category.title))
    if first_category.tiles:
        first_tile = first_category.tiles[0]
        print("Subcategory tile count: {}".format(len(first_category.tiles)))
        print("First tile text: {}".format(first_tile.query.text))
        print("First tile url: {}".format(first_tile.query.web_search_url))
    else:
        print("Couldn't find subcategory tiles!")
    else:
        print("Couldn't find categories!")

```

## Next steps

[Cognitive Services Python SDK samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)


