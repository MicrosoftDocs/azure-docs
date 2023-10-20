---
title: Bing Visual Search Python client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/26/2020
ms.author: aahi
---

Use this quickstart to begin getting image insights from the Bing Visual Search service, using the Python client library. While Bing Visual Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/search/visual_search_samples.py) 

[Reference documentation](/python/api/azure-cognitiveservices-search-visualsearch/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-search-visualsearch) | [Package (PyPi)](https://pypi.org/project/azure-cognitiveservices-search-visualsearch/) | [Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/)

## Prerequisites

* [Python](https://www.python.org/) 2.x or 3.x
* It is recommended to use a [virtual environment](https://docs.python.org/3/tutorial/venv.html). Install and initialize the virtual environment with the [venv module](https://pypi.python.org/pypi/virtualenv).
* The Bing Visual Search client library for Python. You can install it with the following commands:
    1. `cd mytestenv`
    2. `python -m pip install azure-cognitiveservices-search-visualsearch`

[!INCLUDE [cognitive-services-bing-visual-search-signup-requirements](~/includes/cognitive-services-bing-visual-search-signup-requirements.md)]


## Create and initialize the application

1. Create a new Python file in your favorite IDE or editor, and add the following import statements. 

    ```python
    import http.client, urllib.parse
    import json
    import os.path
    from azure.cognitiveservices.search.visualsearch import VisualSearchClient
    from azure.cognitiveservices.search.visualsearch.models import (
        VisualSearchRequest,
        CropArea,
        ImageInfo,
        Filters,
        KnowledgeRequest,
    )
    from msrest.authentication import CognitiveServicesCredentials
    ```
2. Create variables for your subscription key, Custom Configuration ID, and the image you want to upload. 
    
    ```python
    subscription_key = 'YOUR-VISUAL-SEARCH-ACCESS-KEY'
    PATH = 'C:\\Users\\USER\\azure-cognitive-samples\\mytestenv\\TestImages\\'
    image_path = os.path.join(PATH, "image.jpg")
    
    ```

3. Instantiate the client

    ```python
    client = VisualSearchClient(endpoint="https://api.cognitive.microsoft.com", credentials=CognitiveServicesCredentials(subscription_key))
    ```

## Send the search request

1. With the image file open, serialize `VisualSearchRequest()`, and pass it as the `knowledge_request` parameter for the `visual_search()`.

    ```python
    with open(image_path, "rb") as image_fd:
        # You need to pass the serialized form of the model
        knowledge_request = json.dumps(VisualSearchRequest().serialize())
    
        print("\r\nSearch visual search request with binary of dog image")
        result = client.images.visual_search(image=image_fd, knowledge_request=knowledge_request)
    ```

2. If any results were returned, print them, the tags, and the actions in the first tag.

    ```python
    if not result:
            print("No visual search result data.")
    
            # Visual Search results
        if result.image.image_insights_token:
            print("Uploaded image insights token: {}".format(result.image.image_insights_token))
        else:
            print("Couldn't find image insights token!")
    
        # List of tags
        if result.tags:
            first_tag = result.tags[0]
            print("Visual search tag count: {}".format(len(result.tags)))
    
            # List of actions in first tag
            if first_tag.actions:
                first_tag_action = first_tag.actions[0]
                print("First tag action count: {}".format(len(first_tag.actions)))
                print("First tag action type: {}".format(first_tag_action.action_type))
            else:
                print("Couldn't find tag actions!")
        else:
            print("Couldn't find image tags!")
    ```

## Next steps

> [!div class="nextstepaction"]
> [Build a single-page web app](../../tutorial-bing-visual-search-single-page-app.md)
