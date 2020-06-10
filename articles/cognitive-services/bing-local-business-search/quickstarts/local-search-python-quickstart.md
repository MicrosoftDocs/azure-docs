---
title: Quickstart - Send a query to the API in Python - Bing Local Business Search
titleSuffix: Azure Cognitive Services
description: Use this quickstart to start using the Bing Local Business Search API in Python.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-local-business
ms.topic: quickstart
ms.date: 05/12/2020
ms.author: aahi
ms.custom: tracking-python
---
# Quickstart: Send a query to the Bing Local Business Search API in Python

Use this quickstart to learn how to send requests to the Bing Local Business Search API, which is an Azure Cognitive Service. Although this simple application is written in Python, the API is a RESTful Web service compatible with any programming language capable of making HTTP requests and parsing JSON.

This example application gets local response data from the API for a search query.

## Prerequisites

* [Python](https://www.python.org/) 2.x or 3.x.
* A [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with Bing Search APIs. For this quickstart, the [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient. Save the API key that's provided when you activate your free trial. For more information, see [Cognitive Services Pricing - Bing Search API](https://azure.microsoft.com/pricing/details/cognitive-services/search-api/).

## Run the complete application

The following example gets localized results, which are implemented in the following steps:
1. Declare variables to specify the endpoint by host and path.
2. Specify the query parameter. 
3. Define the search function that creates the request and adds the `Ocp-Apim-Subscription-Key` header.
4. Set the `Ocp-Apim-Subscription-Key` header. 
5. Make the connection and send the request.
6. Print the JSON results.

The complete code for this demo is as follows:

```python
import http.client, urllib.parse
import json

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'YOUR-SUBSCRIPTION-KEY'

host = 'api.cognitive.microsoft.com'
path = '/bing/v7.0/localbusinesses/search'

query = 'restaurant in Bellevue'

params = '?q=' + urllib.parse.quote (query) + '&mkt=en-us'

def get_local():
    headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}
    conn = http.client.HTTPSConnection (host)
    conn.request ("GET", path + params, None, headers)
    response = conn.getresponse ()
    return response.read ()

result = get_local()
print (json.dumps(json.loads(result), indent=4))

```

## Next steps
- [Local Business Search Java quickstart](local-search-java-quickstart.md)
- [Local Business Search C# quickstart](local-quickstart.md)
- [Local Business Search Node.js quickstart](local-search-node-quickstart.md)
