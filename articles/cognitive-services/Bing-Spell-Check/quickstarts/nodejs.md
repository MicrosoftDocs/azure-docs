---
title: "Quickstart: Check spelling with the REST API and Node.js - Bing Spell Check"
titleSuffix: Azure AI services
description: Get started using the Bing Spell Check REST API and Node.js to check spelling and grammar.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: bing-spell-check
ms.topic: quickstart
ms.date: 05/21/2020
ms.author: aahi
ms.devlang: javascript
ms.custom: devx-track-js, mode-api
---

# Quickstart: Check spelling with the Bing Spell Check REST API and Node.js

[!INCLUDE [Bing move notice](../../bing-web-search/includes/bing-move-notice.md)]

Use this quickstart to make your first call to the Bing Spell Check REST API. This simple JavaScript application sends a request to the API and returns a list of suggested corrections. 

Although this application is written in JavaScript, the API is a RESTful Web service compatible with most programming languages. The source code for this application is available on [GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/nodejs/Search/BingSpellCheckv7.js).

## Prerequisites

* [Node.js 6](https://nodejs.org/en/download/) or later.

[!INCLUDE [cognitive-services-bing-spell-check-signup-requirements](../../../../includes/cognitive-services-bing-spell-check-signup-requirements.md)]


## Create and initialize a project

1. Create a new JavaScript file in your favorite IDE or editor. Set the strictness, and require `https`. Then, create variables for your API endpoint's host, path, and your subscription key. You can use the global endpoint in the following code, or use the [custom subdomain](../../../ai-services/cognitive-services-custom-subdomains.md) endpoint displayed in the Azure portal for your resource.

    ```javascript
    'use strict';
    let https = require ('https');

    let host = 'api.cognitive.microsoft.com';
    let path = '/bing/v7.0/spellcheck';
    let key = '<ENTER-KEY-HERE>';
    ```

2. Create variables for your search parameters and the text you want to check: 

   1. Assign your market code to the `mkt` parameter with the `=` operator. The market code is the code of the country/region you make the request from. 

   1. Add the `mode` parameter with the `&` operator, and then assign the spell-check mode. The mode can be either `proof` (catches most spelling/grammar errors) or `spell` (catches most spelling errors, but not as many grammar errors).

    ```javascript
    let mkt = "en-US";
    let mode = "proof";
    let text = "Hollo, wrld!";
    let query_string = "?mkt=" + mkt + "&mode=" + mode;
    ```

## Create the request parameters

Create your request parameters by creating a new object with a `POST` method. Add your path by appending your endpoint path, and query string. Then, add your subscription key to the `Ocp-Apim-Subscription-Key` header.

```javascript
let request_params = {
   method : 'POST',
   hostname : host,
   path : path + query_string,
   headers : {
   'Content-Type' : 'application/x-www-form-urlencoded',
   'Content-Length' : text.length + 5,
      'Ocp-Apim-Subscription-Key' : key,
   }
};
```

## Create a response handler

Create a function called `response_handler` to take the JSON response from the API, and print it. Create a variable for the response body. Append the response when a `data` flag is received by using `response.on()`. After an `end` flag is received, print the JSON body to the console.

```javascript
let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let body_ = JSON.parse (body);
        console.log (body_);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};
```

## Send the request

Call the API using `https.request()` with your request parameters and response handler. Write your text to the API, and then  end the request.

```javascript
let req = https.request (request_params, response_handler);
req.write ("text=" + text);
req.end ();
```


## Run the application

1. Build and run your project.

1. If you're using the command line, use the following command to build and run the application:

   ```bash
   node <FILE_NAME>.js
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
> [Create a single-page web app](../tutorials/spellcheck.md)

- [What is the Bing Spell Check API?](../overview.md)
- [Bing Spell Check API v7 reference](/rest/api/cognitiveservices-bingsearch/bing-spell-check-api-v7-reference)
