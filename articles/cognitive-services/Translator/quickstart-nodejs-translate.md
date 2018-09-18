---
title: "Quickstart: Translate text - Translator Text, Node.js"
titleSuffix: Azure Cognitive Services
description: In this quickstart, you translate text from one language to another using the Translator Text API with Node.js.
services: cognitive-services
author: noellelacharite
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: quickstart
ms.date: 06/21/2018
ms.author: nolachar
---
# Quickstart: Translate text with Node.js

In this quickstart, you translate text from one language to another using the Translator Text API.

## Prerequisites

You'll need [Node.js 6](https://nodejs.org/en/download/) to run this code.

To use the Translator Text API, you also need a subscription key; see [How to sign up for the Translator Text API](translator-text-how-to-signup.md).

## Translate request

The following code translates source text from one language to another using the [Translate](./reference/v3-0-translate.md) method.

1. Create a new Node.js project in your favorite code editor.
2. Add the code provided below.
3. Replace the `subscriptionKey` value with an access key valid for your subscription.
4. Run the program.

```javascript
'use strict';

let fs = require ('fs');
let https = require ('https');

// **********************************************
// *** Update or verify the following values. ***
// **********************************************

// Replace the subscriptionKey string value with your valid subscription key.
let subscriptionKey = 'ENTER KEY HERE';

let host = 'api.cognitive.microsofttranslator.com';
let path = '/translate?api-version=3.0';

// Translate to German and Italian.
let params = '&to=de&to=it';

let text = 'Hello, world!';

let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
        let json = JSON.stringify(JSON.parse(body), null, 4);
        console.log(json);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_guid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let Translate = function (content) {
    let request_params = {
        method : 'POST',
        hostname : host,
        path : path + params,
        headers : {
            'Content-Type' : 'application/json',
            'Ocp-Apim-Subscription-Key' : subscriptionKey,
            'X-ClientTraceId' : get_guid (),
        }
    };

    let req = https.request (request_params, response_handler);
    req.write (content);
    req.end ();
}

let content = JSON.stringify ([{'Text' : text}]);

Translate (content);
```

## Translate response

A successful response is returned in JSON as shown in the following example:

```json
[
  {
    "detectedLanguage": {
      "language": "en",
      "score": 1.0
    },
    "translations": [
      {
        "text": "Hallo Welt!",
        "to": "de"
      },
      {
        "text": "Salve, mondo!",
        "to": "it"
      }
    ]
  }
]
```

## Next steps

Explore the sample code for this quickstart and others, including transliteration and language identification, as well as other sample Translator Text projects on GitHub.

> [!div class="nextstepaction"]
> [Explore Node.js examples on GitHub](https://aka.ms/TranslatorGitHub?type=&language=javascript)
