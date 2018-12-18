---
title: "Quickstart: Create a visual search query, Node.js - Bing Visual Search"
titleSuffix: Azure Cognitive Services
description: Learn how to upload an image to the Bing Visual Search API and get insights about it.
services: cognitive-services
author: swhite-msft
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-visual-search
ms.topic: quickstart
ms.date: 5/16/2018
ms.author: scottwhi
---

# Quickstart: Get image insights using the Bing Visual Search REST API and Node.js

Use this quickstart to make your first call to the Bing Visual Search API and view the search results. This simple JavaScript application uploads an image to the API, and displays the information returned about it. While this application is written in JavaScript, the API is a RESTful Web service compatible with most programming languages.

When uploading a local image, the form data must include the Content-Disposition header. Its `name` parameter must be set to "image" and the `filename` parameter may be set to any string. The contents of the form is the binary of the image. The maximum image size you may upload is 1 MB.

```
--boundary_1234-abcd
Content-Disposition: form-data; name="image"; filename="myimagefile.jpg"

ÿØÿà JFIF ÖÆ68g-¤CWŸþ29ÌÄøÖ‘º«™æ±èuZiÀ)"óÓß°Î= ØJ9á+*G¦...

--boundary_1234-abcd--
```

## Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* The Request module for JavaScript
    * You can install this module using `npm install request`
* The form-data module
    * You can install this module using `npm install form-data`

For this quickstart, you will need to start a subscription at S9 price tier as shown in [Cognitive Services Pricing - Bing Search API](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/search-api/). 

To start a subscription in Azure portal:
1. Enter 'BingSearchV7' in the text box at the top of the Azure portal that says `Search resources, services, and docs`.  
2. Under Marketplace in the drop-down list, select `Bing Search v7`.
3. Enter `Name` for the new resource.
4. Select `Pay-As-You-Go` subscription.
5. Select `S9` pricing tier.
6. Click `Enable` to start the subscription.


## Initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and set the following requirements:

    ```javascript
    var request = require('request');
    var FormData = require('form-data');
    var fs = require('fs');
    ```

2. Create variables for your API endpoint, subscription key, and the path to your image.

    ```javascript
    var baseUri = 'https://api.cognitive.microsoft.com/bing/v7.0/images/visualsearch';
    var subscriptionKey = 'your-api-key';
    var imagePath = "path-to-your-image";
    ```

## Construct the search request

1. Create a new form-data using `FormData()`, and append your image path to it, using `fs.createReadStream()`.
    
    ```java
    var form = new FormData();
    form.append("image", fs.createReadStream(imagePath));
    ```

2. Use the request library to 

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
