---
title: "Quickstart: Use the Bing Web Search SDK for Python"
description: Setup for Web Search SDK console application.
titleSuffix: Azure Cognitive Services Web search SDK Python quickstart
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: article
ms.date: 08/16/2018
ms.author: v-gedod, erhopf
---
# Quickstart: Use the Bing Web Search SDK for Python

The Bing Web Search SDK makes it easy to integrate Bing Web Search into your application. In this quickstart, you'll learn how to use the Bing Web Search SDK for Python to make a call to the REST API, receive a JSON response, and filter and parse the results. [Sample code for this quickstart is available on GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/search/web_search_samples.py).

[!INCLUDE [quickstart-signup](includes/quickstart-signup.md)]

## Prerequisites

The Bing Web Search SDK is compatible with Python 2.7, 3.3, 3.4, 3.5, and 3.6. We recommend using a virtual environment for this quickstart. 

* Python 2.7, 3.3, 3.4, 3.5 or 3.6
* [virtualenv](https://docs.python.org/3/tutorial/venv.html) for Python 2.7
* [venv](https://pypi.python.org/pypi/virtualenv) for Python 3.x

## Create and configure your virtual environment

The instructions to set up and configure a virtual environment are different for Python 2.x and Python 3.x. Follow the steps below to create and initialize your virtual environment.

### Python 3.x

Create a virtual environment with `venv` for Python 3.x: 
```
python -m venv mytestenv
```
Install Bing Web Search SDK dependencies:
```
cd mytestenv
python -m pip install azure-cognitiveservices-search-websearch
```

### Python 2.x

Create a virtual environment with `virtualenv` for Python 2.7:
```
virtualenv mytestenv
```

Activate your environment:
```
cd mytestenv
source bin/activate
```

Install Bing Web Search SDK dependencies: 
```
python -m pip install azure-cognitiveservices-search-websearch
```

## Create a client and print your first results

Now that you've set up your virtual environment and installed the Bing Web Search dependencies, we'll create a client that can make calls to and receive JSON responses from the Bing Web Search API.  

1. Create a new Python project using your favorite IDE or editor.
2. Copy this sample code into your project:  
    ```
    # Import required modules.
    from azure.cognitiveservices.search.websearch import WebSearchAPI
    from azure.cognitiveservices.search.websearch.models import SafeSearch
    from msrest.authentication import CognitiveServicesCredentials
    
    # Replace with your subscription key.
    subscription_key = "26a2e47f92974df2be21f95cd949a42b"
    
    # Instantiate the client.
    client = WebSearchAPI(CognitiveServicesCredentials(subscription_key))
    
    # Create a query and print web page results. Replace Yosemite if you'd like.
    web_data = client.web.search(query="Yosemite")
    print("\r\nSearched for Query# \" Yosemite \"")
    
    '''
    Web pages
    If the search response contains web pages, the first result's name and url
    are printed.
    '''
    if hasattr(web_data.web_pages, 'value'):
    
        print("\r\nWebpage Results#{}".format(len(web_data.web_pages.value)))
    
        first_web_page = web_data.web_pages.value[0]
        print("First web page name: {} ".format(first_web_page.name))
        print("First web page URL: {} ".format(first_web_page.url))
    
    else:
        print("Didn't find any web pages...")
    
    '''
    Images
    If the search response contains images, the first result's name and url
    are printed.
    '''
    if hasattr(web_data.images, 'value'):
    
        print("\r\nImage Results#{}".format(len(web_data.images.value)))
    
        first_image = web_data.images.value[0]
        print("First Image name: {} ".format(first_image.name))
        print("First Image URL: {} ".format(first_image.url))
    
    else:
        print("Didn't find any images...")
    
    '''
    News
    If the search response contains news, the first result's name and url
    are printed.
    '''
    if hasattr(web_data.news, 'value'):
    
        print("\r\nNews Results#{}".format(len(web_data.news.value)))
    
        first_news = web_data.news.value[0]
        print("First News name: {} ".format(first_news.name))
        print("First News URL: {} ".format(first_news.url))
    
    else:
        print("Didn't find any news...")
    
    '''
    If the search response contains videos, the first result's name and url
    are printed.
    '''
    if hasattr(web_data.videos, 'value'):
    
        print("\r\nVideos Results#{}".format(len(web_data.videos.value)))
    
        first_video = web_data.videos.value[0]
        print("First Videos name: {} ".format(first_video.name))
        print("First Videos URL: {} ".format(first_video.url))
    
    else:
        print("Didn't find any videos...")
    ```
3. Replace `subscription_key` with a valid subscription key.
4. Run the program. For example: `python your_program.py`.

## Define functions and filter results

Now that you've made your first call to the Bing Web Search API, let's take a look at additional functionality and filtering.

### Set the response filter to news and freshness to today

### Enable Safe Search, set the answer count and use the promote filter

## Next steps

[Cognitive Services Python SDK samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)
