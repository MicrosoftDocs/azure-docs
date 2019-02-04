---
title: "Quickstart: Check spelling with the Bing Spell Check REST API and Python"
titlesuffix: Azure Cognitive Services
description: Get started using the Bing Spell Check REST API to check spelling and grammar.
services: cognitive-services
author: aahill
manager: cgronlun

ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 09/14/2017
ms.author: aahi
---
# Quickstart: Check spelling with the Bing Spell Check REST API and Python

Use this quickstart to make your first call to the Bing Spell Check REST API. This simple Python application sends a request to the API and returns a list of suggested corrections. While this application is written in Python, the API is a RESTful Web service compatible with most programming languages.

## Prerequisites

* Python [3.x](https://www.python.org)

## Initialize the application

1. Create a new Python file in your favorite IDE or editor, and add the following import statement.

   ```python
   import http.client, urllib.parse, json
   ```

2. Create a variable for the text you want to spell check, and it to a dictionary with `text` as a key. Then add variables for your subscription key, host, and path. 

    ```python
    text = 'Hollo, wrld!'
    data = {'text': text}
    host = 'api.cognitive.microsoft.com'
    path = '/bing/v7.0/spellcheck?'
    params = 'mkt=en-us&mode=proof'
    ```

3. Create a variable for your search parameters. append your market code to `mkt=` and your spell-check mode to `&mode`.

    ```python
    params = 'mkt=en-us&mode=proof'
    ```

4. Add your subscription key to the `Ocp-Apim-Subscription-Key` header.

    ```python
    headers = {
    'Ocp-Apim-Subscription-Key': key,
    'Content-Type': 'application/x-www-form-urlencoded'
    }
    ```

## send a spell check request and receive the response

1. Create an HTTP client to connect to your host path, and use `urllib.parse.urlencode()` to create the body of the request.

    ```python
        conn = http.client.HTTPSConnection(host)
        body = urllib.parse.urlencode (data)
    ```

2. Send the request with a `POST` command.
    
    ```python
    conn.request ("POST", path + params, body, headers)
    ```

3. Get the API response, and print the JSON.

    ```python
    response = conn.getresponse ()
    output = json.dumps(json.loads(response.read()), indent=4)
    print (output)
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
> [Bing Spell Check tutorial](../tutorials/spellcheck.md)

## See also

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 Reference](https://docs.microsoft.com/rest/api/cognitiveservices/bing-spell-check-api-v7-reference)
