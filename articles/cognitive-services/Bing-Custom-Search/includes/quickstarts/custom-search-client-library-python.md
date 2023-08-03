---
title: Bing Custom Search Python client library quickstart 
titleSuffix: Azure AI services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include
ms.date: 02/27/2020
ms.author: aahi
---

Get started with the Bing Custom Search client library for Python. Follow these steps to install the package and try out the example code for basic tasks. The Bing Custom Search API enables you to create tailored, ad-free search experiences for topics that you care about.The source code for this sample can be found on [GitHub](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/blob/master/samples/search/custom_search_samples.py).

Use the Bing Custom Search client library for Python to:
* Find search results on the web, from your Bing Custom Search instance.

[Reference documentation](/python/api/azure-cognitiveservices-search-customsearch/) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/cognitiveservices/azure-cognitiveservices-search-customsearch) | [Package (PyPi)](https://pypi.org/project/azure-cognitiveservices-search-customsearch/) | [Samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples/)


## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](../../quick-start.md) for more information.
- Python [2.x or 3.x](https://www.python.org/) 
- The [Bing Custom Search SDK for Python](https://pypi.org/project/azure-cognitiveservices-search-customsearch/) 

[!INCLUDE [cognitive-services-bing-custom-search-prerequisites](~/includes/cognitive-services-bing-custom-search-signup-requirements.md)]

## Install the Python client library

Install the Bing Custom Search client library with the following command.

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

1. Create a variable for your subscription key and endpoint.

    ```python
    subscription_key = 'your-subscription-key'
    endpoint = 'your-endpoint'
    ```

2. Create an instance of `CustomSearchClient`, using a `CognitiveServicesCredentials` object with the subscription key. 

    ```python
    client = CustomSearchClient(endpoint=endpoint, credentials=CognitiveServicesCredentials(subscription_key))
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
> [Build a Custom Search web app](../../tutorials/custom-search-web-page.md)
