---
title: "Quickstart: Use Node.js to call the Bing Web Search API"
description: In this quickstart, you will learn how to make your first call to the Bing Web Search API using Node.js and receive a JSON response.
services: cognitive-services
author: erhopf
ms.service: cognitive-services
ms.component: bing-web-search
ms.topic: quickstart
ms.date: 8/16/2018
ms.author: erhopf
#Customer intent: As a new developer, I want to make my first call to the Bing Web Search API and receive a response using Node.js. 
---

# Quickstart: Use Node.js to call the Bing Web Search API  

Use this quickstart to make your first call to the Bing Web Search API and receive a JSON response in less than 10 minutes.  

[!INCLUDE [quickstart-signup](../includes/quickstart-signup.md)]

## Prerequisites

* [Node.js 6](https://nodejs.org/en/download/) or later
* Subscription key  

## Create a project and declare required modules

Create a new Node.js project in your favorite IDE or editor. This code quickstart uses strict mode and requires the `https` module.

```javascript
// Use strict mode.
'use strict';

// Require the https module.
let https = require('https');
```

## Define variables

This code defines required variables and validates the subscription key. Confirm that the `host` and `path` are valid and replace the `subscriptionKey` value with a valid subscription key. Feel free to customize the search query by replacing the value for `term`.

```javascript
// Replace with a valid subscription key.
let subscriptionKey = 'enter key here';

/* 
 * Verify the endpoint URI. If you
 * encounter unexpected authorization errors, double-check this host against
 * the endpoint for your Bing Web search instance in your Azure dashboard.  
 */
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/search';
let term = 'Microsoft Cognitive Services';

// Validate the subscription key. 
if (subscriptionKey.length === 32) {
    bing_web_search(term);
} else {
    console.log('Invalid Bing Search API subscription key!');
    console.log('Please paste yours into the source code.');
}
```

## Declare a response handler

This code creates a handler to stringify and parse the response.

```javascript
let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        console.log('\nRelevant Headers:\n');
        for (var header in response.headers)
            // Headers are lowercased by Node.js.
            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                 console.log(header + ": " + response.headers[header]);
        // Stringify and parse the response body. 
        body = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('\nJSON Response:\n');
        console.log(body);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};
```

## Make a request

This code constructs the request, calls the Bing Web Search API, and prints the response.

```javascript
let bing_web_search = function (search) {
  console.log('Searching the Web for: ' + term);
    // Declare the method, hostname, path, and headers.
    let request_params = {
    method : 'GET',
    hostname : host,
    path : path + '?q=' + encodeURIComponent(search),
    headers : {
        'Ocp-Apim-Subscription-Key' : subscriptionKey,
    }
  };
  // Request to the Bing Web Search API. 
  let req = https.request(request_params, response_handler);
  req.end();
}
```

## Put it all together

The last step is to validate your code and run it! Here's the complete program:

```javascript
'use strict';

let https = require('https');

let subscriptionKey = 'enter key here';
let host = 'api.cognitive.microsoft.com';
let path = '/bing/v7.0/search';
let term = 'Microsoft Cognitive Services';

if (subscriptionKey.length === 32) {
    bing_web_search(term);
} else {
    console.log('Invalid Bing Search API subscription key!');
    console.log('Please paste yours into the source code.');
}

let response_handler = function (response) {
    let body = '';
    response.on('data', function (d) {
        body += d;
    });
    response.on('end', function () {
        console.log('\nRelevant Headers:\n');
        for (var header in response.headers)
            // Headers are lower-cased by Node.js.
            if (header.startsWith("bingapis-") || header.startsWith("x-msedge-"))
                 console.log(header + ": " + response.headers[header]);
        body = JSON.stringify(JSON.parse(body), null, '  ');
        console.log('\nJSON Response:\n');
        console.log(body);
    });
    response.on('error', function (e) {
        console.log('Error: ' + e.message);
    });
};

let bing_web_search = function (search) {
  console.log('Searching the Web for: ' + term);

    let request_params = {
    method : 'GET',
    hostname : host,
    path : path + '?q=' + encodeURIComponent(search),
    headers : {
        'Ocp-Apim-Subscription-Key' : subscriptionKey,
    }
  };

  let req = https.request(request_params, response_handler);
  req.end();
}
```


## Sample response

Responses from the Bing Web Search API are returned as JSON. This sample response has been truncated to show a single result.  

```json
{
  "_type": "SearchResponse",
  "queryContext": {
    "originalQuery": "Microsoft Cognitive Services"
  },
  "webPages": {
    "webSearchUrl": "https://www.bing.com/search?q=Microsoft+cognitive+services",
    "totalEstimatedMatches": 22300000,
    "value": [
      {
        "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0",
        "name": "Microsoft Cognitive Services",
        "url": "https://www.microsoft.com/cognitive-services",
        "displayUrl": "https://www.microsoft.com/cognitive-services",
        "snippet": "Knock down barriers between you and your ideas. Enable natural and contextual interaction with tools that augment users' experiences via the power of machine-based AI. Plug them in and bring your ideas to life.",
        "deepLinks": [
          {
            "name": "Face API",
            "url": "https://azure.microsoft.com/services/cognitive-services/face/",
            "snippet": "Add facial recognition to your applications to detect, identify, and verify faces using a Face API from Microsoft Azure. ... Cognitive Services; Face API;"
          },
          {
            "name": "Text Analytics",
            "url": "https://azure.microsoft.com/services/cognitive-services/text-analytics/",
            "snippet": "Cognitive Services; Text Analytics API; Text Analytics API . Detect sentiment, ... you agree that Microsoft may store it and use it to improve Microsoft services, ..."
          },
          {
            "name": "Computer Vision API",
            "url": "https://azure.microsoft.com/services/cognitive-services/computer-vision/",
            "snippet": "Extract the data you need from images using optical character recognition and image analytics with Computer Vision APIs from Microsoft Azure."
          },
          {
            "name": "Emotion",
            "url": "https://www.microsoft.com/cognitive-services/en-us/emotion-api",
            "snippet": "Cognitive Services Emotion API - microsoft.com"
          },
          {
            "name": "Bing Speech API",
            "url": "https://azure.microsoft.com/services/cognitive-services/speech/",
            "snippet": "Add speech recognition to your applications, including text to speech, with a speech API from Microsoft Azure. ... Cognitive Services; Bing Speech API;"
          },
          {
            "name": "Get Started for Free",
            "url": "https://azure.microsoft.com/services/cognitive-services/",
            "snippet": "Add vision, speech, language, and knowledge capabilities to your applications using intelligence APIs and SDKs from Cognitive Services."
          }
        ]
      }
    ]
  },
  "relatedSearches": {
    "id": "https://api.cognitive.microsoft.com/api/v7/#RelatedSearches",
    "value": [
      {
        "text": "microsoft bot framework",
        "displayText": "microsoft bot framework",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+bot+framework"
      },
      {
        "text": "microsoft cognitive services youtube",
        "displayText": "microsoft cognitive services youtube",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+youtube"
      },
      {
        "text": "microsoft cognitive services search api",
        "displayText": "microsoft cognitive services search api",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+search+api"
      },
      {
        "text": "microsoft cognitive services news",
        "displayText": "microsoft cognitive services news",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+news"
      },
      {
        "text": "ms cognitive service",
        "displayText": "ms cognitive service",
        "webSearchUrl": "https://www.bing.com/search?q=ms+cognitive+service"
      },
      {
        "text": "microsoft cognitive services text analytics",
        "displayText": "microsoft cognitive services text analytics",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+text+analytics"
      },
      {
        "text": "microsoft cognitive services toolkit",
        "displayText": "microsoft cognitive services toolkit",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+toolkit"
      },
      {
        "text": "microsoft cognitive services api",
        "displayText": "microsoft cognitive services api",
        "webSearchUrl": "https://www.bing.com/search?q=microsoft+cognitive+services+api"
      }
    ]
  },
  "rankingResponse": {
    "mainline": {
      "items": [
        {
          "answerType": "WebPages",
          "resultIndex": 0,
          "value": {
            "id": "https://api.cognitive.microsoft.com/api/v7/#WebPages.0"
          }
        }
      ]
    },
    "sidebar": {
      "items": [
        {
          "answerType": "RelatedSearches",
          "value": {
            "id": "https://api.cognitive.microsoft.com/api/v7/#RelatedSearches"
          }
        }
      ]
    }
  }
}
```

## Next steps

> [!div class="nextstepaction"]
> [Bing Web search single-page app tutorial](../tutorial-bing-web-search-single-page-app.md)

[!INCLUDE [quickstart-see-also](../includes/quickstart-see-also.md)]
