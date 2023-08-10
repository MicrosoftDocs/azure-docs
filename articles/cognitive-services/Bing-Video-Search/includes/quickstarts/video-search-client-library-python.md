---
title: Bing Video Search Python client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 03/19/2020
ms.author: aahi
---

Use this quickstart to begin searching for news with the Bing Video Search client library for Python. While Bing Video Search has a REST API compatible with most programming languages, the client library provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/search/video_search_samples.py) with additional annotations, and features.

[!INCLUDE [cognitive-services-bing-video-search-signup-requirements](~/includes/cognitive-services-bing-video-search-signup-requirements.md)]

## Prerequisites

- [Python](https://www.python.org/) 2.x or 3.x
- The Bing Video Search client library for python

It is recommended that you use a Python [virtual environment](https://docs.python.org/3/tutorial/venv.html). You can install and initialize a virtual environment with the [venv module](https://pypi.python.org/pypi/virtualenv). Install virtualenv for Python 2.7 with:

```console
python -m venv mytestenv
```

Install the Bing Video Search client library with:

```console
cd mytestenv
python -m pip install azure-cognitiveservices-search-videosearch
```

## Create and initialize the application

1. Create a new Python file in your favorite IDE or editor, and add the following import statements. 

    ```python
    from azure.cognitiveservices.search.videosearch import VideoSearchClient
    from azure.cognitiveservices.search.videosearch.models import VideoPricing, VideoLength, VideoResolution, VideoInsightModule
    from msrest.authentication import CognitiveServicesCredentials
    ```

2. Create a variable for your subscription key. 

    ```python
    subscription_key = "YOUR-SUBSCRIPTION-KEY"
    endpoint = "YOUR-ENDPOINT"
    ```

## Create the search client

Create an instance of the `CognitiveServicesCredentials`, and instantiate the client:

```python
client = VideoSearchAPI(endpoint, CognitiveServicesCredentials(subscription_key))
```

## Send a search request and get a response

1. Use `client.videos.search()` with your search query to send a request to the Bing Video Search API, and get a response.

    ```python
    video_result = client.videos.search(query="SwiftKey")
    ```

2. If the response contains search results, get the first one, and print its ID, name, and url.

    ```python
    if video_result.value:
        first_video_result = video_result.value[0]
        print("Video result count: {}".format(len(video_result.value)))
        print("First video id: {}".format(first_video_result.video_id))
        print("First video name: {}".format(first_video_result.name))
        print("First video url: {}".format(first_video_result.content_url))
    else:
        print("Didn't see any video result data..")
    ```

## Next steps

> [!div class="nextstepaction"]
> [Create a single page web app](../../tutorial-bing-video-search-single-page-app.md)

## See also 

- [What is the Bing Video Search API?](../../overview.md)
- [Azure AI services .NET SDK samples](https://github.com/Azure-Samples/cognitive-services-dotnet-sdk-samples/tree/master/BingSearchv7)
