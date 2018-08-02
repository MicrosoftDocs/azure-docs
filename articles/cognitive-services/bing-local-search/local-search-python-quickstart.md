---
title: Local Search API Python quickstart | Microsoft Docs
description: How to start using the Bing Local Search API in Python.
services: cognitive-services
author: mikedodaro
manager: rosh
ms.service: cognitive-services
ms.technology: bing-local-search
ms.topic: article
ms.date: 08/02/2018
ms.author: rosh, v-gedod
---
# Local Search Python quickstart

The following Python example gets localized search data from a query for *restaurant in Bellevue*.

## Prerequisites
You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with Bing APIs. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. Use the access key provided by the free trial.

## Code scenario
The following code gets localized data. It is implemented in the following steps:
1. Declare variables to specify the endpoint by host and path.
2. Specify the query parameter. 
3. Define the Search function that creates the request and adds the Ocp-Apim-Subscription-Key header.
4. Set the Ocp-Apim-Subscription-Key header. 
5. Make the connection and send the request.
6. Print the JSON results.

The complete code for this demo follows:

````
import http.client, urllib.parse
import json

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'YOUR-SUBSCRIPTION-KEY'

host = 'www.bingapis.com'
path = '/api/v7/localbusinesses/search'

query = 'restaurant in Bellevue'

params = '?q=' + urllib.parse.quote (query) + '&appid=' + subscriptionKey + '&traffictype=Internal_monitor&mkt=en-us'

def get_local():
    headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}
    conn = http.client.HTTPSConnection (host)
    conn.request ("GET", path + params, None, headers)
    response = conn.getresponse ()
    return response.read ()

result = get_local()
print (json.dumps(json.loads(result), indent=4))

````

## Next steps
[Local Search Java Quickstart](local-search-java-quickstart.md)
[Local Search C# Quickstart](local-quickstart.md)
[Local Search Node Quickstart](local-search-node-quickstart.md)