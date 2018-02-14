---
title: Image search SDK Python quickstart | Microsoft Docs
description: Setup for Image search SDK console application.
titleSuffix: Azure cognitive services Web search SDK Python quickstart
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-image-search
ms.topic: article
ms.date: 02/14/2018
ms.author: v-gedod
---
# Web Search SDK Python quickstart

The Bing Image Search SDK contains the functionality of the REST API for web queries and parsing results. 

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
Add imports, and create an instance of the `CognitiveServicesCredentials`:
```


subscription_key = "YOUR-SUBSCRIPTION-KEY"
```
Then, instantiate the client:
```
client = WebSearchAPI(CognitiveServicesCredentials(subscription_key))
```
Search for results, and print the first Web page result:
```
```
Print other results:
```


```

## Next steps

[Cognitive services Node.js SDK samples](https://github.com/Azure-Samples/cognitive-services-node-sdk-samples)


