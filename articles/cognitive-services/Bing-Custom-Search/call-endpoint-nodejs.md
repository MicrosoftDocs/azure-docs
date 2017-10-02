---
title: "Bing Custom Search: Call endpoint by using NodeJs | Microsoft Docs"
description: Describes how to call Bing Custom Search endpoint with nodejs
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Call Bing Custom Search endpoint (NodeJs)

Call Bing Custom Search endpoint using NodeJs by performing these steps:
1. Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).
2. Install [NodeJs](https://www.nodejs.org/).
3. Create a folder for your code
4. From a command prompt or terminal, navigate to the folder you just created.
5. Run npm init and follow the prompts:
    ```
    npm init
    ```
6. Install the **request** node module:
   ```
   npm install request
   ```
7. Create the file BingCustomSearch.js and copy the following code
8. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID.

``` NodeJS
var request = require("request");

var subscriptionKey = 'YOUR-SUBSCRIPTION-KEY';
var customConfigId = 'YOUR-CUSTOM-CONFIG-ID';
var searchTerm = 'user input';

var options = {
    url: 'https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?' + 
      'q=' + searchTerm + 
      '&customconfig=' + customConfigId,
    headers: {
        'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
}

request(options, function(error, response, body){
    var searchResponse = JSON.parse(body);
    for(var i = 0; i < searchResponse.webPages.value.length; ++i){
        var webPage = searchResponse.webPages.value[i];
        console.log('id: ' + webPage.id);
        console.log('name: ' + webPage.name);
        console.log('url: ' + webPage.url);
        console.log('urlPingSuffix: ' + webPage.urlPingSuffix);
        console.log('displayUrl: ' + webPage.displayUrl);
        console.log('snippet: ' + webPage.snippet);
        console.log('dateLastCrawled: ' + webPage.dateLastCrawled);
        console.log();
    }
})
```
