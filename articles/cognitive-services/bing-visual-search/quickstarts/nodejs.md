---
title: "Quickstart: Create a visual search query, Node.js - Bing Visual Search"
titleSuffix: Azure Cognitive Services
description: How to upload an image to Bing Visual Search API and get back insights about the image.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-visual-search
ms.topic: quickstart
ms.date: 5/16/2018
ms.author: scottwhi
---

# Quickstart: Your first Bing Visual Search query in JavaScript

Bing Visual Search API returns information about an image that you provide. You can provide the image by using the URL of the image, an insights token, or by uploading an image. For information about these options, see [What is Bing Visual Search API?](../overview.md) This article demonstrates uploading an image. Uploading an image could be useful in mobile scenarios where you take a picture of a well-known landmark and get back information about it. For example, the insights could include trivia about the landmark. 

If you upload a local image, the following shows the form data you must include in the body of the POST. The form data must include the Content-Disposition header. Its `name` parameter must be set to "image" and the `filename` parameter may be set to any string. The contents of the form is the binary of the image. The maximum image size you may upload is 1 MB. 

```
--boundary_1234-abcd
Content-Disposition: form-data; name="image"; filename="myimagefile.jpg"

ÿØÿà JFIF ÖÆ68g-¤CWŸþ29ÌÄøÖ‘º«™æ±èuZiÀ)"óÓß°Î= ØJ9á+*G¦...

--boundary_1234-abcd--
```

This article includes a simple console application that sends a Bing Visual Search API request and displays the JSON search results. While this application is written in JavaScript, the API is a RESTful Web service compatible with any programming language that can make HTTP requests and parse JSON. 

## Prerequisites

You need [Node.js 6](https://nodejs.org/en/download/) to run this code.

For this quickstart, you may use a [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) subscription key or a paid subscription key.

## Running the application

The following shows how to send the message using FormData in Node.js.

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
6. Replace the `imagePath` value with the path of the image to upload.
7. Run the program.  
  ```
  node GetVisualInsights.js
  ```

```javascript
var request = require('request');
var FormData = require('form-data');
var fs = require('fs');

var baseUri = 'https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch';
var subscriptionKey = '<yoursubscriptionkeygoeshere>';
var imagePath = "<pathtoyourimagegoeshere>";

var form = new FormData();
form.append("image", fs.createReadStream(imagePath));

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

[Get insights about an image using an insights token](../use-insights-token.md)  
[Bing Visual Search image upload tutorial](../tutorial-visual-search-image-upload.md)
[Bing Visual Search single-page app tutorial](../tutorial-bing-visual-search-single-page-app.md)  
[Bing Visual Search overview](../overview.md)  
[Try it](https://aka.ms/bingvisualsearchtryforfree)  
[Get a free trial access key](https://azure.microsoft.com/try/cognitive-services/?api=bing-visual-search-api)  
[Bing Visual Search API reference](https://aka.ms/bingvisualsearchreferencedoc)
