---
title: Web Search SDK Python quickstart | Microsoft Docs
description: Setup for Web Search SDK console application.
titleSuffix: Azure Cognitive Services Web search SDK Python quickstart
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 02/14/2018
ms.author: v-gedod
---
# Web Search SDK Python quickstart

The Bing Web Search SDK contains the functionality of the REST API for web queries and parsing results. 

## Application dependencies
If you don't already have it, install Python. The SDK is compatible with Python 2.7, 3.3, 3.4, 3.5 and 3.6.

The general recommendation for Python development is to use a [virtual environment](https://docs.python.org/3/tutorial/venv.html). 
Install and initialize the virtual environment with the [venv module](https://pypi.python.org/pypi/virtualenv). You must install virtualenv for Python 2.7.
```
python -m venv mytestenv
```
Install Bing Web Search SDK dependencies:
```
cd mytestenv
python -m pip install azure-cognitiveservices-search-websearch
```
## Web Search client
Get a [Cognitive Services access key](https://azure.microsoft.com/try/cognitive-services/) under *Search*. 
Add imports, and create an instance of the `CognitiveServicesCredentials`:
```
from azure.cognitiveservices.search.websearch import WebSearchAPI
from azure.cognitiveservices.search.websearch.models import SafeSearch
from msrest.authentication import CognitiveServicesCredentials

subscription_key = "YOUR-SUBSCRIPTION-KEY"
```
Then, instantiate the client:
```
client = WebSearchAPI(CognitiveServicesCredentials(subscription_key))
```
Search for results, and print the first Web page result:
```
web_data = client.web.search(query="Yosemite")
print("\r\nSearched for Query# \" Yosemite \"")

# WebPages
if web_data.web_pages.value:

    print("\r\nWebpage Results#{}".format(len(web_data.web_pages.value)))

    first_web_page = web_data.web_pages.value[0]
    print("First web page name: {} ".format(first_web_page.name))
    print("First web page URL: {} ".format(first_web_page.url))

else:
    print("Didn't see any Web data..")
```
Print other result types, including images, news, and videos:
```
# Images
if web_data.images.value:

    print("\r\nImage Results#{}".format(len(web_data.images.value)))

    first_image = web_data.images.value[0]
    print("First Image name: {} ".format(first_image.name))
    print("First Image URL: {} ".format(first_image.url))

else:
    print("Didn't see any Image..")
        
# News
if web_data.news.value:

    print("\r\nNews Results#{}".format(len(web_data.news.value)))

    first_news = web_data.news.value[0]
    print("First News name: {} ".format(first_news.name))
    print("First News URL: {} ".format(first_news.url))

else:
    print("Didn't see any News..")
            
# Videos
if web_data.videos.value:

    print("\r\nVideos Results#{}".format(len(web_data.videos.value)))

    first_video = web_data.videos.value[0]
    print("First Videos name: {} ".format(first_video.name))
    print("First Videos URL: {} ".format(first_video.url))

else:
    print("Didn't see any Videos..")

```

## Next steps

[Cognitive Services Python SDK samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)


