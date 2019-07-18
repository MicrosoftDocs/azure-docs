---
title: "Quickstart: Check spelling with the Bing Spell Check REST API and Python"
titlesuffix: Azure Cognitive Services
description: Get started using the Bing Spell Check REST API to check spelling and grammar.
services: cognitive-services
author: aahill
manager: nitinme

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 02/20/2019
ms.author: aahi
---
# Quickstart: Check spelling with the Bing Spell Check REST API and Python

Use this quickstart to make your first call to the Bing Spell Check REST API. This simple Python application sends a request to the API and returns a list of suggested corrections. While this application is written in Python, the API is a RESTful Web service compatible with most programming languages. The source code for this application is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/python/Search/BingEntitySearchv7.py)

## Prerequisites

* Python [3.x](https://www.python.org)

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]

## Initialize the application

1. Create a new Python file in your favorite IDE or editor, and add the following import statement.

   ```python
   import requests
   import json
   ```

2. Create variables for the text you want to spell check, your subscription key, and your Bing Spell Check endpoint.

    ```python
    api_key = "<ENTER-KEY-HERE>"
    example_text = "Hollo, wrld" # the text to be spell-checked
    endpoint = "https://api.cognitive.microsoft.com/bing/v7.0/SpellCheck"
    ```

## Create the parameters for the request

1. Create a new dictionary with `text` as the key, and your text as the value.

    ```python
    data = {'text': example_text}
    ```

2. Add the parameters for your request. Append your market code after `mkt=`. The market code is the country you make the request from. Also, append your spell-check mode after `&mode=`. Mode is either `proof` (catches most spelling/grammar errors) or `spell` (catches most spelling but not as many grammar errors).

    ```python
    params = {
        'mkt':'en-us',
        'mode':'proof'
        }
    ```

3. Add a `Content-Type` header, and your subscription key to the `Ocp-Apim-Subscription-Key` header.

    ```python
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Ocp-Apim-Subscription-Key': api_key,
        }
    ```

## Send the request and read the response

1. Send the POST request using the requests library.

    ```python
    response = requests.post(endpoint, headers=headers, params=params, data=data)
    ```

2. Get the JSON response, and print it.

    ```python
    json_response = response.json()
    print(json.dumps(json_response, indent=4))
    ```

## Example JSON response

A successful response is returned in JSON, as shown in the following example:

```json
{
   "_type": "SpellCheck",
   "flaggedTokens": [
      {
         "offset": 0,
         "token": "Hollo",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "Hello",
               "score": 0.9115257530801
            },
            {
               "suggestion": "Hollow",
               "score": 0.858039839213461
            },
            {
               "suggestion": "Hallo",
               "score": 0.597385084464481
            }
         ]
      },
      {
         "offset": 7,
         "token": "wrld",
         "type": "UnknownToken",
         "suggestions": [
            {
               "suggestion": "world",
               "score": 0.9115257530801
            }
         ]
      }
   ]
}
```

## Next steps

> [!div class="nextstepaction"]
> [Create a single page web-app](../tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 Reference](https://docs.microsoft.com/rest/api/cognitiveservices-bingsearch/bing-spell-check-api-v7-reference)
