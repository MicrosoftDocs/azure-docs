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

This example shows how to request search results from your custom search instance using Node.js. To create a custom search instance see [Create your first Bing Custom Search instance](quick-start.md).

## Prerequisites

You will need to install [Node.js](https://www.nodejs.org/) to run this example.

You must have a [Cognitive Services API account](https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account) with **Bing Search APIs**. The [free trial](https://azure.microsoft.com/try/cognitive-services/?api=bing-web-search-api) is sufficient for this quickstart. You need the access key provided when you activate your free trial, or you may use a paid subscription key from your Azure dashboard.

  >[!NOTE]  
  >Existing Bing Custom Search customers who have a preview key provisioned on or before October 15, 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterward, they need to migrate to the generally available version on Azure.  

## Running the code

To run this example, follow these steps.

1. Create a folder for your code.
2. From a command prompt or terminal, navigate to the folder you just created.
3. Install the **request** node module:
    <pre>
    npm install request
    </pre>
4. Create the file BingCustomSearch.js and copy the following code to it.
5. Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** with your key and configuration ID (see step 1).

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
6. Run the code using the following command.
    <pre>
    node BingCustomSearch.js
    </pre>

## Next steps
- [Configure and consume custom hosted UI](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)