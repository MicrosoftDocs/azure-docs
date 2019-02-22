---
title: "Quickstart: Project URL Preview, Python"
titlesuffix: Azure Cognitive Services
description: Script sample to quickly get started using the Project URL Previewwith Python.
services: cognitive-services
author: mikedodaro
manager: nitinme

ms.service: cognitive-services
ms.subservice: url-preview
ms.topic: quickstart
ms.date: 03/29/2018
ms.author: rosh
---
# Quickstart: URL Preview with Python

The following Python example creates a Url Preview for the SwiftKey Web site: https://swiftkey.com/en.

## Prerequisites

Get an access key for the free trial [Cognitive Services Labs](https://aka.ms/answersearchsubscription)

This example uses Python 3.6.

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

```
import http.client, urllib.parse
import json

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'your-subscription-key'

host = 'api.labs.cognitive.microsoft.com'
path = '/urlpreview/v7.0/search'

query = 'https://SwiftKey.com'

params = '?q=' + urllib.parse.quote (query)

def get_preview ():
    headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}
    conn = http.client.HTTPSConnection (host)
    conn.request ("GET", path + params, None, headers)
    response = conn.getresponse ()
    return response.read ()

result = get_preview ()
print (json.dumps(json.loads(result), indent=4))
```
## Next steps
- [C# quickstart](csharp.md)
- [Java quickstart](java-quickstart.md)
- [JavaScript quickstart](javascript.md)
- [Node URL quickstart](node-quickstart.md)
