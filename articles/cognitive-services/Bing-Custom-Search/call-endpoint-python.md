---
title: "Quickstart: Call your Bing Custom Search endpoint using Python | Microsoft Docs"
titlesuffix: Azure Cognitive Services
description: Use this quickstart to begin requesting search results from your Bing Custom Search instance using Python
services: cognitive-services
author: aahill
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: quickstart
ms.date: 05/07/2018
ms.author: aahi
---

# Quickstart: Call your Bing Custom Search endpoint using Python

Use this quickstart to begin requesting search results from your Bing Custom Search instance. While this application is written in Python, the Bing Custom Search API is a RESTful web service compatible with most programming languages.

## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](quick-start.md) for more information.
- [Python](https://www.python.org/) 2.x or 3.x

[!INCLUDE [cognitive-services-bing-web-search-prerequisites](../../../includes/cognitive-services-bing-web-search-prerequisites.md)]


## Create and initialize the application

1. Create a new Python file in your favorite IDE or editor, and add the following import statements. Create variables for your subscription key, Custom Configuration ID, and a search term. 

    ```python
    import json
    import requests
    
    subscriptionKey = "YOUR-SUBSCRIPTION-KEY"
    customConfigId = "YOUR-CUSTOM-CONFIG-ID"
    searchTerm = "microsoft"
    ```

## Send and receive a search request 

1. Construct the request URL by appending your search term to the `q=` query parameter, and your search instance's Custom Configuration ID to `customconfig=`. separate the parameters with a `&` character. 

    ```python
    url = 'https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?' + 'q=' + searchTerm + '&' + 'customconfig=' + customConfigId
    ```

2. Send the request to your Bing Custom Search instance, and print out the returned search results.  

    ```python
    r = requests.get(url, headers={'Ocp-Apim-Subscription-Key': subscriptionKey})
    print(r.text)
    ```

## Full application code

To run this example, follow these steps:

1. Create a folder for your code.  
  
2. From an administrator command prompt or terminal, navigate to the folder you just created.  
  
3. Install the **requests** python module:  
  
    <pre>
    pip install pipenv
    pipenv install requests
    </pre>  
      
4. Create a file named BingCustomSearch.py in the folder you created and copy the following code into it. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your subscriptioin key and configuration ID.  
  
    ``` Python
    import json
    import requests
    
    subscriptionKey = "YOUR-SUBSCRIPTION-KEY"
    customConfigId = "YOUR-CUSTOM-CONFIG-ID"
    searchTerm = "microsoft"
    
    url = 'https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?q=' + searchTerm + '&customconfig=' + customConfigId
    r = requests.get(url, headers={'Ocp-Apim-Subscription-Key': subscriptionKey})
    print(r.text)
    ```  
 
5. Run the code using the following command.  
  
    ```
    python BingCustomSearch.py
    ```

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web page](./custom-search-web-page.md)

- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
