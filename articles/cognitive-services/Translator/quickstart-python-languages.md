---
title: "Quickstart: Get supported languages - Translator Text, Python"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you get a list of languages supported for translation, transliteration, and dictionary lookup and examples using the Translator Text API with Java.
services: cognitive-services
author: noellelacharite
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 06/21/2018
ms.author: nolachar
---
# Quickstart: Get supported languages with Python

In this quickstart, you get a list of languages supported for translation, transliteration, and dictionary lookup and examples using the Translator Text API.

## Prerequisites

You'll need [Python 3.x](https://www.python.org/downloads/) to run this code.

To use the Translator Text API, you also need a subscription key; see [How to sign up for the Translator Text API](translator-text-how-to-signup.md).

## Languages request

The following code gets a list of supported languages for translation, transliteration, and dictionary lookup and examples, using the [Languages](./reference/v3-0-languages.md) method.

1. Create a new Python project in your favorite code editor.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. Run the program.

```python
# -*- coding: utf-8 -*-

import http.client, urllib.parse, json

# **********************************************
# *** Update or verify the following values. ***
# **********************************************

# Replace the subscriptionKey string value with your valid subscription key.
subscriptionKey = 'ENTER KEY HERE'

host = 'api.cognitive.microsofttranslator.com'
path = '/languages?api-version=3.0'

output_path = 'output.txt'

def get_languages ():

    headers = {'Ocp-Apim-Subscription-Key': subscriptionKey}

    conn = http.client.HTTPSConnection(host)
    conn.request ("GET", path, None, headers)
    response = conn.getresponse ()
    return response.read ()

result = get_languages ()

# Note: We convert result, which is JSON, to and from an object so we can pretty-print it.
# We want to avoid escaping any Unicode characters that result contains. See:
# https://stackoverflow.com/questions/18337407/saving-utf-8-texts-in-json-dumps-as-utf8-not-as-u-escape-sequence
json = json.dumps(json.loads(result), indent=4, ensure_ascii=False).encode('utf-8')

f = open(output_path, 'wb')
f.write (json)
f.close
```

## Languages response

A successful response is returned in JSON as shown in the following example:

```json
{
  "translation": {
    "af": {
      "name": "Afrikaans",
      "nativeName": "Afrikaans",
      "dir": "ltr"
    },
    "ar": {
      "name": "Arabic",
      "nativeName": "العربية",
      "dir": "rtl"
    },
...
  },
  "transliteration": {
    "ar": {
      "name": "Arabic",
      "nativeName": "العربية",
      "scripts": [
        {
          "code": "Arab",
          "name": "Arabic",
          "nativeName": "العربية",
          "dir": "rtl",
          "toScripts": [
            {
              "code": "Latn",
              "name": "Latin",
              "nativeName": "اللاتينية",
              "dir": "ltr"
            }
          ]
        },
        {
          "code": "Latn",
          "name": "Latin",
          "nativeName": "اللاتينية",
          "dir": "ltr",
          "toScripts": [
            {
              "code": "Arab",
              "name": "Arabic",
              "nativeName": "العربية",
              "dir": "rtl"
            }
          ]
        }
      ]
    },
...
  },
  "dictionary": {
    "af": {
      "name": "Afrikaans",
      "nativeName": "Afrikaans",
      "dir": "ltr",
      "translations": [
        {
          "name": "English",
          "nativeName": "English",
          "dir": "ltr",
          "code": "en"
        }
      ]
    },
    "ar": {
      "name": "Arabic",
      "nativeName": "العربية",
      "dir": "rtl",
      "translations": [
        {
          "name": "English",
          "nativeName": "English",
          "dir": "ltr",
          "code": "en"
        }
      ]
    },
...
  }
}
```

## Next steps

Explore the sample code for this quickstart and others, including translation and transliteration, as well as other sample Translator Text projects on GitHub.

> [!div class="nextstepaction"]
> [Explore Python examples on GitHub](https://aka.ms/TranslatorGitHub?type=&language=python)
