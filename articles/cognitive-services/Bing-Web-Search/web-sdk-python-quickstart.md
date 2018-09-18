---
title: "Quickstart: Use the Bing Web Search SDK for Python"
titleSuffix: Azure Cognitive Services
description: The Bing Web Search SDK makes it easy to integrate Bing Web Search into your Python application. In this quickstart, you'll learn how to send a request, receive a JSON response, and filter and parse the results.
services: cognitive-services
author: erhopf
manager: cgronlun
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: quickstart
ms.date: 08/16/2018
ms.author: erhopf
---

# Quickstart: Use the Bing Web Search SDK for Python

The Bing Web Search SDK makes it easy to integrate Bing Web Search into your Python application. In this quickstart, you'll learn how to send a request, receive a JSON response, and filter and parse the results.

Want to see the code right now? The [Bing Web Search SDK for Python samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples) are available on GitHub.

[!INCLUDE [bing-web-search-quickstart-signup](../../../includes/bing-web-search-quickstart-signup.md)]

## Prerequisites

The Bing Web Search SDK is compatible with Python 2.7, 3.3, 3.4, 3.5, and 3.6. We recommend using a virtual environment for this quickstart.

* Python 2.7, 3.3, 3.4, 3.5 or 3.6
* [virtualenv](https://docs.python.org/3/tutorial/venv.html) for Python 2.7
* [venv](https://pypi.python.org/pypi/virtualenv) for Python 3.x

## Create and configure your virtual environment

The instructions to set up and configure a virtual environment are different for Python 2.x and Python 3.x. Follow the steps below to create and initialize your virtual environment.

### Python 2.x

Create a virtual environment with `virtualenv` for Python 2.7:

```console
virtualenv mytestenv
```

Activate your environment:

```console
cd mytestenv
source bin/activate
```

Install Bing Web Search SDK dependencies:

```console
python -m pip install azure-cognitiveservices-search-websearch
```

### Python 3.x

Create a virtual environment with `venv` for Python 3.x:

```console
python -m venv mytestenv
```

Install Bing Web Search SDK dependencies:

```console
cd mytestenv
python -m pip install azure-cognitiveservices-search-websearch
```

## Create a client and print your first results

Now that you've set up your virtual environment and installed dependencies, let's create a client. The client will handle requests to and responses from the Bing Web Search API.

If the response contains web pages, images, news, or videos, the first result for each is printed.

1. Create a new Python project using your favorite IDE or editor.
2. Copy this sample code into your project:  
    ```python
    # Import required modules.
    from azure.cognitiveservices.search.websearch import WebSearchAPI
    from azure.cognitiveservices.search.websearch.models import SafeSearch
    from msrest.authentication import CognitiveServicesCredentials

    # Replace with your subscription key.
    subscription_key = "YOUR_SUBSCRIPTION_KEY"

    # Instantiate the client.
    client = WebSearchAPI(CognitiveServicesCredentials(subscription_key))

    # Make a request. Replace Yosemite if you'd like.
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

Now that you've made your first call to the Bing Web Search API, let's look at a few functions that highlight SDK functionality for refining queries and filtering results. Each function can be added to your Python program that was created in the previous section.

### Limit the number of results returned by Bing

This sample uses the `count` and `offset` parameters to limit the number of results returned using the SDK's [`search` method](https://docs.microsoft.com/python/api/azure-cognitiveservices-search-websearch/azure.cognitiveservices.search.websearch.operations.weboperations?view=azure-python#search). The `name` and `URL` for the first result are printed.

1. Add this code to your Python project:
    ```python
    # Declare the function.
    def web_results_with_count_and_offset(subscription_key):
        client = WebSearchAPI(CognitiveServicesCredentials(subscription_key))

        try:
            '''
            Set the query, offset, and count using the SDK's search method. See:
            https://docs.microsoft.com/python/api/azure-cognitiveservices-search-websearch/azure.cognitiveservices.search.websearch.operations.weboperations?view=azure-python#search.
            '''
            web_data = client.web.search(query="Best restaurants in Seattle", offset=10, count=20)
            print("\r\nSearching for \"Best restaurants in Seattle\"")

            if web_data.web_pages.value:
                '''
                If web pages are available, print the # of responses, and the first and second
                web pages returned.
                '''
                print("Webpage Results#{}".format(len(web_data.web_pages.value)))

                first_web_page = web_data.web_pages.value[0]
                print("First web page name: {} ".format(first_web_page.name))
                print("First web page URL: {} ".format(first_web_page.url))

            else:
                print("Didn't find any web pages...")

        except Exception as err:
            print("Encountered exception. {}".format(err))
    ```
2. Run the program.

### Filter for news and freshness

This sample uses the `response_filter` and `freshness` parameters to filter search results using the SDK's [`search` method](https://docs.microsoft.com//api/azure-cognitiveservices-search-websearch/azure.cognitiveservices.search.websearch.operations.weboperations?view=azure-python#search). The search results returned are limited to news articles and pages that Bing has discovered within the last 24 hours. The `name` and `URL` for the first result are printed.

1. Add this code to your Python project:
    ```python
    # Declare the function.
    def web_search_with_response_filter(subscription_key):
        client = WebSearchAPI(CognitiveServicesCredentials(subscription_key))
        try:
            '''
            Set the query, response_filter, and freshness using the SDK's search method. See:
            https://docs.microsoft.com/python/api/azure-cognitiveservices-search-websearch/azure.cognitiveservices.search.websearch.operations.weboperations?view=azure-python#search.
            '''
            web_data = client.web.search(query="xbox",
                response_filter=["News"],
                freshness="Day")
            print("\r\nSearching for \"xbox\" with the response filter set to \"News\" and freshness filter set to \"Day\".")

            '''
            If news articles are available, print the # of responses, and the first and second
            articles returned.
            '''
            if web_data.news.value:

                print("# of news results: {}".format(len(web_data.news.value)))

                first_web_page = web_data.news.value[0]
                print("First article name: {} ".format(first_web_page.name))
                print("First article URL: {} ".format(first_web_page.url))

                print("")

                second_web_page = web_data.news.value[1]
                print("\nSecond article name: {} ".format(second_web_page.name))
                print("Second article URL: {} ".format(second_web_page.url))

            else:
                print("Didn't find any news articles...")

        except Exception as err:
            print("Encountered exception. {}".format(err))

    # Call the function.
    web_search_with_response_filter(subscription_key)
    ```
2. Run the program.

### Use safe search, answer count, and the promote filter

This sample uses the `answer_count`, `promote`, and `safe_search` parameters to filter search results using the SDK's [`search` method](https://docs.microsoft.com/python/api/azure-cognitiveservices-search-websearch/azure.cognitiveservices.search.websearch.operations.weboperations?view=azure-python#search). The `name` and `URL` for the first result are displayed.

1. Add this code to your Python project:
    ```python
    # Declare the function.
    def web_search_with_answer_count_promote_and_safe_search(subscription_key):

        client = WebSearchAPI(CognitiveServicesCredentials(subscription_key))

        try:
            '''
            Set the query, answer_count, promote, and safe_search parameters using the SDK's search method. See:
            https://docs.microsoft.com/python/api/azure-cognitiveservices-search-websearch/azure.cognitiveservices.search.websearch.operations.weboperations?view=azure-python#search.
            '''
            web_data = client.web.search(
                query="Niagara Falls",
                answer_count=2,
                promote=["videos"],
                safe_search=SafeSearch.strict  # or directly "Strict"
            )
            print("\r\nSearching for \"Niagara Falls\"")

            '''
            If results are available, print the # of responses, and the first result returned.
            '''
            if web_data.web_pages.value:

                print("Webpage Results#{}".format(len(web_data.web_pages.value)))

                first_web_page = web_data.web_pages.value[0]
                print("First web page name: {} ".format(first_web_page.name))
                print("First web page URL: {} ".format(first_web_page.url))

            else:
                print("Didn't see any Web data..")

        except Exception as err:
            print("Encountered exception. {}".format(err))
    ```
2. Run the program.

## Clean up resources

When you're done with this project, make sure to remove your subscription key from the program's code and to deactivate your virtual environment.

## Next steps

> [!div class="nextstepaction"]
> [Cognitive Services Python SDK samples](https://github.com/Azure-Samples/cognitive-services-python-sdk-samples)

## See also

* [Azure Python SDK reference](https://docs.microsoft.com/python/api/overview/azure/cognitiveservices/websearch)
