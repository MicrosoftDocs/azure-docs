---
title: "Bing Custom Search: Call endpoint by using Python | Microsoft Docs"
description: Describes how to call Bing Custom Search endpoint with python
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Call Bing Custom Search endpoint (Python)

This example shows how to request search results from your custom search instance using Python. To create this example follow these steps:

1. Create your custom instance (see [Define a custom search instance](define-your-custom-view.md)).
2. Get a subscription key (if you don't have one see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api)).  

  >[!NOTE]  
  >Existing Bing Custom Search customers who have a preview key provisioned on or before October 15 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterward, they need to migrate to the generally available version on Azure.  

3. Install [Python](https://www.python.org/).
4. Create a folder for your code.
5. From a command prompt or terminal, navigate to the folder you just created.
6. Run the following commands:
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

### Next steps
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)