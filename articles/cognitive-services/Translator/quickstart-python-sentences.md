---
title: "Quickstart: Get sentence lengths - Translator Text, Python"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you find the lengths of sentences in text using the Translator Text API with Python.
services: cognitive-services
author: noellelacharite
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 06/21/2018
ms.author: nolachar
---
# Quickstart: Get sentence lengths with Python

In this quickstart, you find the lengths of sentences in text using the Translator Text API.

## Prerequisites

You'll need [Python 3.x](https://www.python.org/downloads/) to run this code.

To use the Translator Text API, you also need a subscription key; see [How to sign up for the Translator Text API](translator-text-how-to-signup.md).

## BreakSentence request

The following code breaks the source text into sentences using the [BreakSentence](./reference/v3-0-break-sentence.md) method.

1. Create a new Python project in your favorite code editor.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse, uuid, json

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.cognitive.microsofttranslator.com'
path = '/breaksentence?api-version=3.0'

params = ''

text = 'How are you? I am fine. What did you do today?'

def breakSentences (content):

    headers = {
        'Ocp-Apim-Subscription-Key': subscriptionKey,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    conn = http.client.HTTPSConnection(host)
    conn.request ("POST", path + params, content, headers)
    response = conn.getresponse ()
    return response.read ()

requestBody = [{
    'Text' : text,
}]
content = json.dumps(requestBody, ensure_ascii=False).encode('utf-8')
result = breakSentences (content)

# Note: We convert result, which is JSON, to and from an object so we can pretty-print it.
# We want to avoid escaping any Unicode characters that result contains. See:
# https://stackoverflow.com/questions/18337407/saving-utf-8-texts-in-json-dumps-as-utf8-not-as-u-escape-sequence
output = json.dumps(json.loads(result), indent=4, ensure_ascii=False)

print (output)
```

## BreakSentence response

A successful response is returned in JSON as shown in the following example:

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1.0
    },
    "sentLen": [
      13,
      11,
      22
    ]
  }
]
```

## Next steps

Explore the sample code for this quickstart and others, including translation and transliteration, as well as other sample Translator Text projects on GitHub.

> [!div class="nextstepaction"]
> [Explore Python examples on GitHub](https://aka.ms/TranslatorGitHub?type=&language=python)
