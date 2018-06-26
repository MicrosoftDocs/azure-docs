---
title: Update Knowledge Base, Python Quickstart - Azure Cognitive Services | Microsoft Docs
description: How to update a knowledge base in Python for QnA Maker.
services: cognitive-services
author: noellelacharite
manager: nolachar

ms.service: cognitive-services
ms.technology: qna-maker
ms.topic: quickstart
ms.date: 06/18/2018
ms.author: nolachar
---

# Update a knowledge base in Python

The following code updates an existing knowledge base, using the [Update](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da7600) method.

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

def update_kb (path, content):
	print ('Calling ' + host + path + '.')
	headers = {
		'Ocp-Apim-Subscription-Key': subscriptionKey,
		'Content-Type': 'application/json',
		'Content-Length': len (content)
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("PATCH", path, content, headers)
	response = conn.getresponse ()
# PATCH /knowledgebases returns an HTTP header named Location that contains a URL
# to check the status of the operation to create the knowledgebase.
	return response.getheader('Location'), response.read ()

def check_status (path):
	print ('Calling ' + host + path + '.')
	headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}
	conn = http.client.HTTPSConnection(host)
	conn.request ("GET", path, None, headers)
	response = conn.getresponse ()
# If the operation is not finished, /operations returns an HTTP header named Retry-After
# that contains the number of seconds to wait before we query the operation again.
	return response.getheader('Retry-After'), response.read ()

req = {
  'add': {
    'qnaList': [
      {
        'id': 1,
        'answer': 'You can change the default message if you use the QnAMakerDialog. See this for details: https://docs.botframework.com/en-us/azure-bot-service/templates/qnamaker/#navtitle',
        'source': 'Custom Editorial',
        'questions': [
          'How can I change the default message from QnA Maker?'
        ],
        'metadata': []
      }
    ],
    'urls': [
      'https://docs.microsoft.com/en-us/azure/cognitive-services/Emotion/FAQ'
    ]
  },
  'update' : {
    'name' : 'New KB Name'
  },
  'delete': {
    'ids': [
      0
    ]
  }
}

path = service + method + kb
# Convert the request to a string.
content = json.dumps(req)
operation, result = update_kb (path, content)
print (pretty_print(result))

done = False
while False == done:
	path = service + operation
	wait, status = check_status (path)
	print (pretty_print(status))

# Convert the JSON response into an object and get the value of the operationState field.
	state = json.loads(status)['operationState']
# If the operation isn't finished, wait and query again.
	if state == 'Running' or state == 'NotStarted':
		print ('Waiting ' + wait + ' seconds...')
		time.sleep (int(wait))
	else:
		done = True
```

## The update a knowledge base response

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "operationState": "NotStarted",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:48Z",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
...
{
  "operationState": "Succeeded",
  "createdTimestamp": "2018-04-13T01:49:48Z",
  "lastActionTimestamp": "2018-04-13T01:49:50Z",
  "resourceLocation": "/knowledgebases/140a46f3-b248-4f1b-9349-614bfd6e5563",
  "userId": "2280ef5917bb4ebfa1aae41fb1cebb4a",
  "operationId": "5156f64e-e31d-4638-ad7c-a2bdd7f41658"
}
Press any key to continue.
```

## Get request status

You can call the [Operation](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/operations_getoperationdetails) method to check the status of a request to create or update a knowledge base. To see how this method is used, please see the sample code for the [Create](#Create) or [Update](#Update) method.

## Next steps

> [!div class="nextstepaction"]
> [QnA Maker (V4) REST API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/5a93fcf85b4ccd136866eb37/operations/5ac266295b4ccd1554da75ff)
