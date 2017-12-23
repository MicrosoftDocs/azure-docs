---
title: Call and response - Python Quickstart for Azure Cognitive Services, Bing Web Search API | Microsoft Docs
description: Get information and code samples to help you quickly get started using the Bing Web Search API in Microsoft Cognitive Services on Azure.
services: cognitive-services
author: jerrykindall
ms.service: cognitive-services
ms.technology: bing-search
ms.topic: article
ms.date: 9/18/2017
ms.author: v-jerkin
---

# Call and response: your first Bing Web Search query in Python

The Bing Web Search API provides a experience similar to Bing.com/Search by returning search results that Bing determines are relevant to the user's query. The results may include Web pages, images, videos, news, and entities, along with related search queries, spelling corrections, time zones, unit conversion, translations, and calculations. The kinds of results you get are based on their relevance and the tier of the Bing Search APIs to which you subscribe.

Refer to the [API reference](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference) for technical details about the APIs.

You can run this example as a Jupyter notebook on [MyBinder](https://mybinder.org) by clicking on the launch Binder badge: 

[![Binder](https://mybinder.org/badge.svg)](https://mybinder.org/v2/gh/Microsoft/cognitive-services-notebooks/master?filepath=BingWebSearchAPI.ipynb)


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
search_url = "https://api.cognitive.microsoft.com/bing/v7.0/search"
```

We will now search Bing for Microsoft Cognitive Services.


```python
search_term = "Microsoft Cognitive Services"
```

The following block uses the `requests` library in Python to call out to the Bing seach APIs and return the results as a JSON object. Observe that we pass in the API key via the `headers` dictionary and the search term via the `params` dictionary. To see the full list of options that can be used to filter search results, please see the [REST API](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference) documentation.


```python
import requests

headers = {"Ocp-Apim-Subscription-Key" : subscription_key}
params  = {"q": search_term, "textDecorations":True, "textFormat":"HTML"}
response = requests.get(search_url, headers=headers, params=params)
response.raise_for_status()
search_results = response.json()
```

The `search_results` object contains the research results along with rich metadata such as related queries and pages. We can format the top pages returned by the query using the following lines of code


```python
from IPython.display import HTML

rows = "\n".join(["""<tr>
                       <td><a href=\"{0}\">{1}</a></td>
                       <td>{2}</td>
                     </tr>""".format(v["url"],v["name"],v["snippet"]) \
                  for v in search_results["webPages"]["value"]])
HTML("<table>{0}</table>".format(rows))
```




<table><tr>
                       <td><a href="https://www.microsoft.com/cognitive-services"><b>Microsoft</b> <b>Cognitive</b> <b>Services</b></a></td>
                       <td>Knock down barriers between you and your ideas. Enable natural and contextual interaction with tools that augment users&#39; experiences via the power of machine-based AI. Plug them in and bring your ideas to life.</td>
                     </tr>
<tr>
                       <td><a href="https://azure.microsoft.com/en-us/try/cognitive-services/"><b>Cognitive</b> Service Try experience | <b>Microsoft Azure</b></a></td>
                       <td><b>Microsoft Cognitive Services</b> Try experience lets you build apps with powerful algorithms using just a few lines of code through a 30 day trial.</td>
                     </tr>
<tr>
                       <td><a href="https://docs.microsoft.com/en-us/azure/cognitive-services/Welcome">What is <b>Microsoft Cognitive Services</b>? | <b>Microsoft</b> Docs</a></td>
                       <td><b>Microsoft Cognitive Services</b> is a set of APIs, SDKs, and <b>services</b> that you can use with <b>Microsoft</b> Azure that make applications more intelligent, engaging, and ...</td>
                     </tr>
<tr>
                       <td><a href="https://www.microsoft.com/en-us/trustcenter/cloudservices/cognitiveservices"><b>Microsoft</b> Trust Center | <b>Microsoft Cognitive Services</b></a></td>
                       <td><b>Microsoft Cognitive Services</b> is a collection of intelligent APIs that allow systems to understand and interpret people’s needs by using natural methods of ...</td>
                     </tr>
<tr>
                       <td><a href="https://customers.microsoft.com/en-us/search?sq=%22Microsoft%20Cognitive%20Services%22&ff=&p=0&so=story_publish_date%20desc"><b>Microsoft Cognitive Services</b> - customers.<b>microsoft</b>.com</a></td>
                       <td><b>Microsoft</b> customer stories. See how <b>Microsoft</b> tools help companies run their business.</td>
                     </tr>
<tr>
                       <td><a href="https://msdn.microsoft.com/en-us/magazine/mt742868.aspx"><b>Cognitive Services</b> - <b>msdn.microsoft.com</b></a></td>
                       <td>This article explains how you can recognize face attributes and emotions using the new Face and Emotion APIs from the <b>Microsoft Cognitive Services</b> in Xamarin.Forms by ...</td>
                     </tr>
<tr>
                       <td><a href="https://labs.cognitive.microsoft.com/en-us/project-prague"><b>Microsoft Cognitive Services</b> Labs - <b>Project Prague</b></a></td>
                       <td>Labs provides early adopters with an early look at emerging <b>Cognitive Services</b> technologies. These technologies are still under development and do not have the same ...</td>
                     </tr>
<tr>
                       <td><a href="https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa"><b>Microsoft Cognitive Services</b></a></td>
                       <td>Computer Vision API - v1.0. The Computer Vision API provides state-of-the-art algorithms to process images and return information. For example, it can be used to ...</td>
                     </tr>
<tr>
                       <td><a href="https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f"><b>Microsoft Cognitive Services</b></a></td>
                       <td>Application name length has to be less than 50 characters. The culture of an app cannot be changed after the app is created. The default version is &quot;0.1&quot;</td>
                     </tr></table>



## Next steps

> [!div class="nextstepaction"]
> [Bing Web search single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

## See also 

[Bing Web Search overview](../overview.md)  
[Try it](https://azure.microsoft.com/services/cognitive-services/bing-web-search-api/)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api)
[Bing Web Search API reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-web-api-v7-reference)
