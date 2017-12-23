---
title: Python Quickstart for Azure Cognitive Services, Bing News Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing News Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: jerrykindall
ms.service: cognitive-services
ms.technology: bing-search
ms.topic: article
ms.date: 9/21/2017
ms.author: v-jerkin
---

# Quickstart for Bing News Search API with Python
This walkthrough demonstrates a simple example of calling into the Bing News Search API and post-processing the resulting JSON object. Please refer to the [Bing New Search documentation](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference) for more details on the REST APIs.  

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge: 

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingNewsSearchAPI.ipynb)

## Prerequisites

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

## Running the walkthrough

Please set `subscriptionKey` below to your API key for the Bing API service.


```python
subscription_key = "96d05359d76f4e758906539daeab939e"
assert subscription_key
```

Next, please verify that the `search_url` endpoint is correct. At this writing, only one endpoint is used for Bing search APIs.  In the future, regional endpoints may be available.  If you encounter unexpected authorization errors, double-check this value against the endpoint for your Bing search instance in your Azure dashboard.


```python
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/news/search"
```

We will now search Bing for news about Microsoft!


```python
search_term = "Microsoft"
```

The following block uses the `requests` library in Python to call out to the Bing seach APIs and return the results as a JSON object. Observe that we pass in the API key via the `headers` dictionary and the search term via the `params` dictionary. To see the full list of options that can be used to filter search results, please see the [REST API](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-news-api-v7-reference) documentation.


```python
import requests

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations": True, "textFormat": "HTML"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

The `search_results` object contains the relevant new articles along with rich metadata. For example, we can extract the descriptions of the articles using the following line of code.


```python
descriptions = [article["description"] for article in search_results["value"]]
```

We can then render the results in a table with the search keyword highlighted in **bold**.


```python
from IPython.display import HTML
rows = "\n".join(["<tr><td>{0}</td></tr>".format(desc) for desc in descriptions])
HTML("<table>"+rows+"</table>")
```




<table><tr><td>Magic Leap is a secretive Florida-based startup that raised $1.9 billion to make a pair of augmented-reality smartglasses. The glasses were finally unveiled on Wednesday morning — a huge reveal six years and $1.9 billion in the making. Rolling Stone was ...</td></tr>
<tr><td>Video: <b>Microsoft</b> democratizes AI adding it to core products and services <b>Microsoft</b>&#39;s latest Windows 10 &#39;Redstone 4&#39; test build -- No. 17063-- includes, as promised, the coming Timeline feature, plus various UI changes. <b>Microsoft</b> rolled out Build 17063 to ...</td></tr>
<tr><td><b>Microsoft</b> has become one of the most relevant mobile developers by offering its best products and services to (virtually) everyone who owns a smartphone and tablet -- for free. Major apps like Word, Skype and Outlook are among the most popular titles in ...</td></tr>
<tr><td>Today&#39;s major tech stories include appreciations for Facebook and <b>Microsoft</b> for their help fighting North Korean cyberattacks, YouTube&#39;s TV app eventually reaching Roku and Apple TV, and Facebook&#39;s new facial recognition options.</td></tr>
<tr><td>This past Sunday morning at 1am, I was at home watching TV when my phone buzzed with an incoming WhatsApp message. “Hey Ben, just letting you know that we have updated V drivers after community feedback.” The message is from Konstantinos Karatsevidis ...</td></tr>
<tr><td><b>Microsoft</b> has released three new fleet management APIs for Bing Maps that developers can use to create applications for transportation companies and other vehicle fleet managers that value precise travel guidance and tracking. Typically, taking a wrong ...</td></tr>
<tr><td>SAN FRANCISCO — <b>Microsoft</b> is supporting a Senate bill that would ban provisions in employment contracts that keep victims of sexual harassment and gender discrimination from making their case in open court. The giant software maker says it&#39;s also ...</td></tr>
<tr><td>On Tuesday, <b>Microsoft</b> announced that it will no longer require employees to resolve sexual-harassment claims through private arbitration, one of the first signs that the legal contracts long used to hide workplace misconduct may be starting to crumble ...</td></tr>
<tr><td>Google published a Chrome app in the Windows Store earlier today, which just directed users to a download link to install the browser. <b>Microsoft</b> isn’t impressed with Google’s obvious snub of the Windows Store, and it’s taking action. “We have ...</td></tr>
<tr><td>Homeland Security adviser Tom Bossert blames North Korea for the massive, wolrdwide &#39;WannaCry&#39; ransomware attack in May of this year.</td></tr></table>



## Next steps

> [!div class="nextstepaction"]
> [Paging news](paging-news.md)
> [Using decoration markers to highlight text](hit-highlighting.md)

## See also 

 [Searching the web for news](search-the-web.md)  
 [Try it](https://azure.microsoft.com/services/cognitive-services/bing-news-search-api/)
