---
title: "Quickstart: Call endpoint by using Node.js - Bing Custom Search"
titlesuffix: Azure Cognitive Services
description: This quickstart shows how to request search results from your custom search instance by using Node.js to call the Bing Custom Search endpoint. 
services: cognitive-services
author: brapel
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: quickstart
ms.date: 05/07/2018
ms.author: v-brapel
---

# Quickstart: Call Bing Custom Search endpoint (Node.js)

This quickstart shows how to request search results from your custom search instance using Node.js to call the Bing Custom Search endpoint. 

## Prerequisites

To complete this quickstart, you need:

- A ready-to-use custom search instance. See [Create your first Bing Custom Search instance](quick-start.md).
- [Node.js](https://www.nodejs.org/) installed.
- A subscription key. You can get a subscription key when you activate your [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search), or you can use a paid subscription key from your Azure dashboard (see [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account)).    

## Run the code

To run this example, follow these steps:

1. Create a folder for your code.  
  
2. From a command prompt or terminal, navigate to the folder you just created.  
  
3. Install the **request** node module:
    <pre>
    npm install request
    </pre>  
    
4. Create a file named BingCustomSearch.js in the folder you created and copy the following code into it. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your subscription key and configuration ID.  
  
    ``` javascript
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
  
6. Run the code using the following command:  
  
    ```    
    node BingCustomSearch.js
    ``` 

## Next steps
- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
