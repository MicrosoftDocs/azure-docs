---
title: "Quickstart: Project Answer Search, Python"
titlesuffix: Azure Cognitive Services
description: Python example get started using Project Answer Search.
services: cognitive-services
author: mikedodaro
manager: cgronlun

ms.service: cognitive-services
ms.component: project-answer-search
ms.topic: quickstart
ms.date: 04/13/2018
ms.author: rosh, v-gedod
---
# Quickstart Project Answer Search with Python

The following Python example creates and sends a request for information about "Rock of Gibraltar".

## Prerequisites

Get an access key for the free trial [Cognitive Services Labs](https://aka.ms/answersearchsubscription)

This example uses Python 3.6.4

## Code scenario 

The following code creates a URL Preview.
It is implemented in the following steps:
1. Declare variables to specify the endpoint by host and path.
2. Specify the query URL to preview, and add the query parameter.  
3. Set the query parameter.
4. Define the Search function that creates the request and adds the *Ocp-Apim-Subscription-Key* header.
5. Set the *Ocp-Apim-Subscription-Key* header. 
6. Make the connection, and send the request.
7. Print the JSON results.

The complete code for this demo follows:

````
import http.client, urllib.parse
import json

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'YOUR-SUBSCRIPTION-KEY'

host = 'https://api.labs.cognitive.microsoft.com'
path = '/answerSearch/v7.0/search '

query = 'Rock of Gibraltar'

params = '?q=' + urllib.parse.quote (query) + '&mkt=en-us'

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
- [C# quickstart](c-sharp-quickstart.md)
- [Java quickstart](java-quickstart.md)
- [Node quickstart](node-quickstart.md)