---
title: "Quickstart: Python Publish Knowledge Base - QnA Maker"
titleSuffix: Azure Cognitive Services 
description: How to publish a knowledge base in Python for QnA Maker.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: qna-maker
ms.topic: quickstart
ms.date: 09/12/2018
ms.author: diberry
---

# Quickstart: Publish a knowledge base in Python

The following code publishes an existing knowledge base, using the [Publish](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75fe) method.

[!INCLUDE [Code is available in Azure-Samples Github repo](../../../../includes/cognitive-services-qnamaker-python-repo-note.md)]

1. Create a new Python project in your favorite IDE.
2. Add the code provided below.
3. Replace the `key` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse, json, time

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace this with a valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

# Replace this with a valid knowledge base ID.
kb = 'ENTER ID HERE';

host = 'westus.api.cognitive.microsoft.com'
service = '/qnamaker/v4.0'
method = '/knowledgebases/'

def pretty_print (content):
# Note: We convert content to and from an object so we can pretty-print it.
	return json.dumps(json.loads(content), indent=4)

def publish_kb (path, content):
	print ('Calling ' + host + path + '.')
	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-Type': 'application/json',
		'Content-Length': len (content)
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path, content, headers)
	response = conn.getresponse ()

	if response.status == 204:
		return json.dumps({'result' : 'Success.'})
	else:
		return response.read ()

path = service + method + kb
result = publish_kb (path, '')
print (pretty_print(result))
```

## The publish a knowledge base response

A successful response is returned in JSON, as shown in the following example:

```json
{
  "result": "Success."
}
```

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)

[QnA Maker overview](../Overview/overview.md)