---
title: "Bing Custom Search: Call endpoint by using Python | Microsoft Docs"
description: Describes how to call Bing Custom Search endpoint with python
services: cognitive-services
author: brapel
manager: ehansen
ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Call Bing Custom Search endpoint (Python)

This example shows how to request search results from your custom search instance using Python. To create a custom search instance, see [Create your first Bing Custom Search instance](quick-start.md).

## Prerequisites

You will need to install [Python](https://www.python.org/) to run this example.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard. 

  >[!NOTE]  
  >Existing Bing Custom Search customers who have a preview key provisioned on or before October 15, 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterward, they need to migrate to the generally available version on Azure.  

## Running the code

To run this example, follow these steps.

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
    <pre>
    python BingCustomSearch.py
    </pre>

## Next steps
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)