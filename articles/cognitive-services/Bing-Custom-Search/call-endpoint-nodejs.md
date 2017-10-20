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

# Call Bing Custom Search endpoint (Node.js)

This example shows how to request search results from your custom search instance using Node.js. To create this example follow these steps:

1. Create your custom instance (see [Define a custom search instance](define-your-custom-view.md)).
2. Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).  

  >[!NOTE]  
  >Existing Bing Custom Search customers who have a preview key provisioned on or before October 15 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterward, they need to migrate to the generally available version on Azure.  

3. Install [Node.js](https://www.nodejs.org/).
4. Create a folder for your code.
5. From a command prompt or terminal, navigate to the folder you just created.
6. Install the **request** node module:
    <pre>
    npm install request
    </pre>
7. Create the file BingCustomSearch.js and copy the following code to it.
8. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID (see step 1).

``` Node.js
var request = require("request");

var subscriptionKey = 'YOUR-SUBSCRIPTION-KEY';
var customConfigId = 'YOUR-CUSTOM-CONFIG-ID';
var searchTerm = 'microsoft';

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
        console.log('name: ' + webPage.name);
        console.log('url: ' + webPage.url);
        console.log('displayUrl: ' + webPage.displayUrl);
        console.log('snippet: ' + webPage.snippet);
        console.log('dateLastCrawled: ' + webPage.dateLastCrawled);
        console.log();
    }
})
```

### Next steps
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)