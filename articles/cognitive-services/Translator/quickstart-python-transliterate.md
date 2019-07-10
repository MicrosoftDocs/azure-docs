---
title: "Quickstart: Transliterate text, Python - Translator Text API"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you'll learn how to transliterate (convert) text from one script to another using Python and the Translator Text REST API. In this sample, Japanese is transliterated to use the Latin alphabet.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: quickstart
ms.date: 06/04/2019
ms.author: swmachan
---

# Quickstart: Use the Translator Text API to transliterate text using Python

In this quickstart, you'll learn how to transliterate (convert) text from one script to another using Python and the Translator Text REST API. In the sample provided, Japanese is transliterated to use the Latin alphabet.

This quickstart requires an [Azure Cognitive Services account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with a Translator Text resource. If you don't have an account, you can use the [free trial](https://azure.microsoft.com/try/cognitive-services/) to get a subscription key.

>[!TIP]
> If you'd like to see all the code at once, the source code for this sample is available on [GitHub]().

## Prerequisites

This quickstart requires:

* Python 2.7.x or 3.x
* An Azure subscription key for Translator Text

## Create a project and import required modules

Create a new project using your favorite IDE or editor, or a new folder with a file named `transliterate-text.py` on your desktop. Then copy this code snippet into your project/file:

```python
# -*- coding: utf-8 -*-
import os
import requests
import uuid
import json
```

> [!NOTE]
> If you haven't used these modules you'll need to install them before running your program. To install these packages, run: `pip install requests uuid`.

The first comment tells your Python interpreter to use UTF-8 encoding. Then required modules are imported to read your subscription key from an environment variable, construct the http request, create a unique identifier, and handle the JSON response returned by the Translator Text API.

## Set the subscription key, base url, and path

This sample will try to read your Translator Text subscription key from the environment variable `TRANSLATOR_TEXT_KEY`. If you're not familiar with environment variables, you can set `subscriptionKey` as a string and comment out the conditional statement.

Copy this code into your project:

```python
# Checks to see if the Translator Text subscription key is available
# as an environment variable. If you are setting your subscription key as a
# string, then comment these lines out.
if 'TRANSLATOR_TEXT_KEY' in os.environ:
    subscriptionKey = os.environ['TRANSLATOR_TEXT_KEY']
else:
    print('Environment variable for TRANSLATOR_TEXT_KEY is not set.')
    exit()
# If you want to set your subscription key as a string, uncomment the line
# below and add your subscription key.
#subscriptionKey = 'put_your_key_here'
```

The Translator Text global endpoint is set as the `base_url`. `path` sets the `transliterate` route and identifies that we want to hit version 3 of the API.

The `params` are used to set the input language, and the input and output scripts. In this sample, we're transliterating from Japanese to the Latin alphabet.

>[!NOTE]
> For more information about endpoints, routes, and request parameters, see [Translator Text API 3.0: Transliterate](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-transliterate).

```python
base_url = 'https://api.cognitive.microsofttranslator.com'
path = '/transliterate?api-version=3.0'
params = '&language=ja&fromScript=jpan&toScript=latn'
constructed_url = base_url + path + params
```

## Add headers

The easiest way to authenticate a request is to pass in your subscription key as an
`Ocp-Apim-Subscription-Key` header, which is what we use in this sample. As an alternative, you can exchange your subscription key for an access token, and pass the access token along as an `Authorization` header to validate your request. For more information, see [Authentication](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication).

Copy this code snippet into your project:

```python
headers = {
    'Ocp-Apim-Subscription-Key': subscriptionKey,
    'Content-type': 'application/json',
    'X-ClientTraceId': str(uuid.uuid4())
}
```

If you are using a Cognitive Services multi-service subscription, you must also include the `Ocp-Apim-Subscription-Region` in your request parameters. [Learn more about authenticating with the multi-service subscription](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference#authentication).

## Create a request to transliterate text

Define the string (or strings) that you want to transliterate:

```python
# Transliterate "good afternoon" from source Japanese.
# Note: You can pass more than one object in body.
body = [{
    'text': 'こんにちは'
}]
```

Next, we'll create a POST request using the `requests` module. It takes three arguments: the concatenated URL, the request headers, and the request body:

```python
request = requests.post(constructed_url, headers=headers, json=body)
response = request.json()
```

## Print the response

The last step is to print the results. This code snippet prettifies the results by sorting the keys, setting indentation, and declaring item and key separators.

```python
print(json.dumps(response, sort_keys=True, indent=4,
                 ensure_ascii=False, separators=(',', ': ')))
```

## Put it all together

That's it, you've put together a simple program that will call the Translator Text API and return a JSON response. Now it's time to run your program:

```console
python transliterate-text.py
```

If you'd like to compare your code against ours, the complete sample is available on [GitHub](https://github.com/MicrosoftTranslator/Text-Translation-API-V3-Python).

## Sample response

```json
[
    {
        "script": "latn",
        "text": "konnichiwa"
    }
]
```

## Clean up resources

If you've hardcoded your subscription key into your program, make sure to remove the subscription key when you're finished with this quickstart.

## Next steps

Take a look at the API reference to understand everything you can do with the Translator Text API.

> [!div class="nextstepaction"]
> [API reference](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-reference)

## See also

Learn how to use the Translator Text API to:

* [Translate text](quickstart-python-translate.md)
* [Identify the language by input](quickstart-python-detect.md)
* [Get alternate translations](quickstart-python-dictionary.md)
* [Get a list of supported languages](quickstart-python-languages.md)
* [Determine sentence lengths from an input](quickstart-python-sentences.md)
