---
title: JavaScript Quickstart for Bing Visual Search API | Microsoft Docs
titleSuffix: Bing Web Search APIs - Cognitive Services
description: Shows how to quickly get started using the Visual Search API to get insights about an image.
services: cognitive-services
author: swhite-msft
manager: rosh

ms.service: cognitive-services
ms.technology: bing-visual-search
ms.topic: article
ms.date: 4/19/2018
ms.author: scottwhi
---

# Your first Bing Visual Search query in JavaScript

Bing Visual Search API lets you send a request to Bing to get insights about an image. To call the API, send an HTTP POST  request to https:\/\/api.cognitive.microsoft.com/bing/v7.0/images/visualsearch. The response contains JSON objects that you parse to get the insights.

This article includes a simple console application that sends a Bing Visual Search API request and displays the JSON search results. While this application is written in JavaScript, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

## Prerequisites

You need [Node.js 6](https://nodejs.org/en/download/) to run this code.

For this quickstart, you may use a [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) subscription key or a paid subscription key.

## Running the application

To run this application, follow these steps:

1. Create a new Node.js project in your favorite IDE or editor.
2. Add the provided code.
3. Replace the `subscriptionKey` value with your subscription key.
3. Replace the `insightsToken` value with an insights token from an /images/search response.
4. Run the program.

```javascript
var request = require("request");

var baseUri = 'https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch';
var subscriptionKey = '<YOUR-SUBSCRIPTION-KEY-GOES-HERE>';
var insightsToken = '<YOUR-INSIGHTS-TOKEN-GOES-HERE>';

var BOUNDARY = 'boundary_ABC123DEF456'
var START_BOUNDARY = '--' + BOUNDARY
var END_BOUNDARY = '--' + BOUNDARY + '--'


CRLF = '\r\n'
POST_BODY_HEADER = "Content-Disposition: form-data; name=\"knowledgeRequest\"" + CRLF + CRLF

requestBody = START_BOUNDARY + CRLF;
requestBody += POST_BODY_HEADER;
requestBody += "{\"imageInfo\":{\"imageInsightsToken\":\"" + insightsToken + "\"}}" + CRLF + CRLF;
requestBody += END_BOUNDARY + CRLF;


var options = {
    url: baseUri,
    method: 'POST',
    headers: {
        'Ocp-Apim-Subscription-Key' : subscriptionKey,
        'Content-Type' : 'multipart/form-data; boundary=' + BOUNDARY
    },
    body: requestBody
}


var req = request(options, function(err, resp, body) {
    if (err) {
        console.log('Error ', err);
    } 
    else {
        console.log(JSON.stringify(JSON.parse(body), null, '  '))
    }
});
```


## Next steps

> [!div class="nextstepaction"]
> [Bing Visual Search single-page app tutorial](../tutorial-bing-visual-search-single-page-app.md)

## See also 

[Bing Visual Search overview](../overview.md)  
[Try it](https://aka.ms/bingvisualsearchtryforfree)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-visual-search-api)  
[Bing Visual Search API reference](https://aka.ms/bingvisualsearchreferencedoc)
