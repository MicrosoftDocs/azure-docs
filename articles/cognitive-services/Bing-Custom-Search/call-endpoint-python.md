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

Call Bing Custom Search endpoint using Python by performing these steps:
1. Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).
2. Install [Python](https://www.python.org/).
3. Create a folder for your code
4. From a command prompt or terminal, navigate to the folder you just created.
4. Run the following commands:
    <pre>
    pip install pipenv
    pipenv install requests
    </pre>
6. Create the file BingCustomSearch.py and copy the following code
9. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID.

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