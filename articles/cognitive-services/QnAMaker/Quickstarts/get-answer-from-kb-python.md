
## Get answers to a question using a knowledge base

The following code gets answers to a question using the specified knowledge base, using the **Generate answers** method.

1. Create a new Python project in your favorite IDE.
1. Add the code provided below.
1. Replace the `host` value with the Website name for your QnA Maker subscription. For more information see [Create a QnA Maker service](../How-To/set-up-qnamaker-service-azure.md).
1. Replace the `endpoint_key` value with a valid endpoint key for your subscription. Note this is not the same as your subscription key. You can get your endpoint keys using the [Get endpoint keys](#GetKeys) method.
1. Replace the `kb` value with the ID of the knowledge base you want to query for answers. Note this knowledge base must already have been published using the [Publish](#Publish) method.
1. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse, json, time

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# NOTE: Replace this with a valid host name.
host = "ENTER HOST HERE"

# NOTE: Replace this with a valid endpoint key.
# This is not your subscription key.
# To get your endpoint keys, call the GET /endpointkeys method.
endpoint_key = "ENTER KEY HERE"

# NOTE: Replace this with a valid knowledge base ID.
# Make sure you have published the knowledge base with the
# POST /knowledgebases/{knowledge base ID} method.
kb = "ENTER KB ID HERE"

method = "/qnamaker/knowledgebases/" + kb + "/generateAnswer"

question = {
    'question': 'Is the QnA Maker Service free?',
    'top': 3
}

def pretty_print (content):
# Note: We convert content to and from an object so we can pretty-print it.
	return json.dumps(json.loads(content), indent=4)

def get_answers (path, content):
	print ('Calling ' + host + path + '.')
	headers = {
		'Authorization': 'EndpointKey ' + endpoint_key,
		'Content-Type': 'application/json',
		'Content-Length': len (content)
	}
	conn = http.client.HTTPSConnection(host)
	conn.request ("POST", path, content, headers)
	response = conn.getresponse ()
	return response.read ()

# Convert the request to a string.
content = json.dumps(question)
result = get_answers (method, content)
print (pretty_print(result))
```

**Get answers response**

A successful response is returned in JSON, as shown in the following example: 

```json
{
  "answers": [
    {
      "questions": [
        "Can I use BitLocker with the Volume Shadow Copy Service?"
      ],
      "answer": "Yes. However, shadow copies made prior to enabling BitLocker will be automatically deleted when BitLocker is enabled on software-encrypted drives. If you are using a hardware encrypted drive, the shadow copies are retained.",
      "score": 17.3,
      "id": 62,
      "source": "https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-frequently-asked-questions",
      "metadata": []
    },
...
  ]
}
```
