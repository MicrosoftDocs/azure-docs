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

1. Create a folder for your project (or use your favorite IDE or editor).
2. From a command prompt or terminal, navigate to the folder you just created.
3. Install the request modules:  
  ```  
  npm install request  
  ```  
3. Install the form-data modules:  
  ```  
  npm install form-data  
  ```  
4. Create a file named GetVisualInsights.js and add the following code to it.
5. Replace the `subscriptionKey` value with your subscription key.
6. Replace the `insightsToken` value with an insights token from an /images/search response.
7. Run the program.  
  ```
  node GetVisualInsights.js
  ```

```javascript
var request = require('request');
var FormData = require('form-data');

var baseUri = 'https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch';
var subscriptionKey = '<yoursubscriptionkeygoeshere>';
var insightsToken = "ccid_tmaGQ2eU*mid_D12339146CFEDF3D409CC7A66D2C98D0D71904D4*simid_608022145667564759*thid_OIP.tmaGQ2eUI1yq3yll!_jn9kwHaFZ";

var knowledgeRequest = {
    "imageInfo" : {
        "imageInsightsToken" : insightsToken
    }
};

var form = new FormData();
form.append('knowledgeRequest', JSON.stringify(knowledgeRequest));

form.getLength(function(err, length){
  if (err) {
    return requestCallback(err);
  }

  var r = request.post(baseUri, requestCallback);
  r._form = form; 
  r.setHeader('Ocp-Apim-Subscription-Key', subscriptionKey);
});

function requestCallback(err, res, body) {
    console.log(JSON.stringify(JSON.parse(body), null, '  '))
}
```


## Next steps

[Get insights about an image you upload](../upload-image.md#using-nodejs)  
[Bing Visual Search single-page app tutorial](../tutorial-bing-visual-search-single-page-app.md)  
[Bing Visual Search overview](../overview.md)  
[Try it](https://aka.ms/bingvisualsearchtryforfree)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-visual-search-api)  
[Bing Visual Search API reference](https://aka.ms/bingvisualsearchreferencedoc)
