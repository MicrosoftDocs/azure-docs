---
title: Call endpoint by using Python - Bing Custom Search - Microsoft Cognitive Services
description: This quickstart shows how to request search results from your custom search instance by using Python to call the Bing Custom Search endpoint.
services: cognitive-services
author: brapel
manager: ehansen
ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: article
ms.date: 05/07/2018
ms.author: v-brapel
---

# Call Bing Custom Search endpoint (Python)

This quickstart shows how to request search results from your custom search instance by using Python to call the Bing Custom Search endpoint. 

## Prerequisites
To complete this quickstart, you need:

- A custom search instance. See [Create your first Bing Custom Search instance](quick-start.md).

-  [Python](https://www.python.org/) installed.

- A [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard. 

## Run the code

To call the Bing Custom Search endpoint, follow these steps:

1. Create a folder for your code.

2. From an administrator command prompt or terminal, navigate to the folder you just created.

3. Install the **requests** python module:

    <pre>
    pip install pipenv
    pipenv install requests
    </pre>
    
7. Create the file BingCustomSearch.py and copy the following code to it.

8. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID (see step 1).

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
9. Run the code using the following command.
    ```
    python BingCustomSearch.py
    ```

## Next steps
- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
