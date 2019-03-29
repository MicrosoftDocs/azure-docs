---
title: "Quickstart: Call your Bing Custom Search endpoint using the Python SDK | Microsoft Docs"
titleSuffix: Azure Cognitive Services
description: Use the Bing Custom Search SDK for Python to get custom search results.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-custom-search
ms.topic: quickstart
ms.date: 03/05/2019
ms.author: aahi
---

# Quickstart: Call your Bing Custom Search endpoint using the Python SDK 

Use this quickstart to begin requesting search results from your Bing Custom Search instance, using the Python SDK. While Bing Custom Search has a REST API compatible with most programming languages, the Bing Custom Search SDK provides an easy way to integrate the service into your applications. The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/search/custom_search_samples.py) with additional error handling and annotations.

## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](quick-start.md) for more information.
- Python [2.x or 3.x](https://www.python.org/) 
- The [Bing Custom Search SDK for Python](https://pypi.org/project/azure-cognitiveservices-search-customsearch/) 

## Install the Python SDK

Install the Bing Custom Search SDK with the following command.

```Console
python -m pip install azure-cognitiveservices-search-customsearch
```


## Create a new application

Create a new Python file in your favorite editor or IDE, and add the following imports.

```python
from azure.cognitiveservices.search.customsearch import CustomSearchClient
from msrest.authentication import CognitiveServicesCredentials
```

## Create a search client and send a request

1. Create a variable for your subscription key.

    ```python
    subscription_key = 'your-subscription-key'
    ```

2. Create an instance of `CustomSearchClient`, using a `CognitiveServicesCredentials` object with the subscription key. 

    ```python
    client = CustomSearchClient(CognitiveServicesCredentials(subscription_key))
    ```

3. Send a search request with `client.custom_instance.search()`. Append your search term to the `query` parameter, and set `custom_config` to your Custom Configuration ID to use your search instance. You can get your ID from the [Bing Custom Search portal](https://www.customsearch.ai/), by clicking the **Production** tab.

    ```python
    web_data = client.custom_instance.search(query="xbox", custom_config="your-configuration-id")
    ```

## View the search results

If any web page search results were found, get the first one and print its name, URL, and total web pages found.

```python
if web_data.web_pages.value:
    first_web_result = web_data.web_pages.value[0]
    print("Web Pages result count: {}".format(len(web_data.web_pages.value)))
    print("First Web Page name: {}".format(first_web_result.name))
    print("First Web Page url: {}".format(first_web_result.url))
else:
    print("Didn't see any web data..")
```

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web app](./tutorials/custom-search-web-page.md)
