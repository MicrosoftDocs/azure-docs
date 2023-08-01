---
title: Bing Image Search Python client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 01/05/2022
ms.author: aahi
---

Use this quickstart to make your first image search using the Bing Image Search client library, which is a wrapper for the API and contains the same features. This simple Python application sends an image search query, parses the JSON response, and displays the URL of the first image returned.

## Prerequisites

* [Python 2.7 or 3.6+](https://www.python.org/).

* The [Azure Image Search client library](https://pypi.org/project/azure-cognitiveservices-search-imagesearch/) for Python
    * Install using `pip install azure-cognitiveservices-search-imagesearch`

## Create and initialize the application

1. Create a new Python script in your favorite IDE or editor, and the following imports:

    ```python
    from azure.cognitiveservices.search.imagesearch import ImageSearchClient
    from msrest.authentication import CognitiveServicesCredentials
    ```

2. Create variables for your subscription key and search term.

    ```python
    subscription_key = "Enter your key here"
    subscription_endpoint = "Enter your endpoint here"
    search_term = "canadian rockies"
    ```

## Create the image search client

1. Create an instance of `CognitiveServicesCredentials`, and use it to instantiate the client:

    ```python
    client = ImageSearchClient(endpoint=subscription_endpoint, credentials=CognitiveServicesCredentials(subscription_key))
    ```

1. Send a search query to the Bing Image Search API:

    ```python
    image_results = client.images.search(query=search_term)
    ```

## Process and view the results

Parse the image results returned in the response.

If the response contains search results, store the first result and print out its details, such as a thumbnail URL, the original URL, along with the total number of returned images.  

```python
if image_results.value:
    first_image_result = image_results.value[0]
    print("Total number of images returned: {}".format(len(image_results.value)))
    print("First image thumbnail url: {}".format(
        first_image_result.thumbnail_url))
    print("First image content url: {}".format(first_image_result.content_url))
else:
    print("No image results returned!")
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Image Search single-page app tutorial](../../tutorial-bing-image-search-single-page-app.md)

## See also

* [What is Bing Image Search?](../../overview.md)  
* [Try an online interactive demo](https://azure.microsoft.com/services/cognitive-services/bing-image-search-api/)  
* [Python samples for the Azure AI services SDK](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)  
* [Azure AI services documentation](../../../../ai-services/index.yml)
* [Bing Image Search API reference](/rest/api/cognitiveservices-bingsearch/bing-images-api-v7-reference)
