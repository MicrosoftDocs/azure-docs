---
title: "Quickstart: Call your Bing Custom Search endpoint using Node.js | Microsoft Docs"
titlesuffix: Azure Cognitive Services
description: Use this quickstart to begin requesting search results from your Bing Custom Search instance using Node.js
services: cognitive-services
author: aahill
manager: cgronlun

ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: quickstart
ms.date: 05/07/2018
ms.author: aahi
---

# Quickstart: Call your Bing Custom Search endpoint using Node.js

Use this quickstart to begin requesting search results from your Bing Custom Search instance. While this application is written in JavaScript, the Bing Custom Search API is a RESTful web service compatible with most programming languages.

## Prerequisites

- A Bing Custom Search instance. See [Quickstart: Create your first Bing Custom Search instance](quick-start.md) for more information.

- [Node.js](https://www.nodejs.org/)

- The [JavaScript Request Library](https://github.com/request/request)

[!INCLUDE [cognitive-services-bing-web-search-prerequisites](../../../includes/cognitive-services-bing-web-search-prerequisites.md)]

## Create and initialize the application

1. Create a new JavaScript file in your favorite IDE or editor, and add a `require()` statement for the requests library. Create variables for your subscription key, Custom Configuration ID, and a search term. 

    ```javascript
    var request = require("request");
    
    var subscriptionKey = 'YOUR-SUBSCRIPTION-KEY';
    var customConfigId = 'YOUR-CUSTOM-CONFIG-ID';
    var searchTerm = 'microsoft';
    ```

## Send and receive a search request 

1. Create a variable to store the information being sent in your request. Construct the request URL by appending your search term to the `q=` query parameter, and your search instance's Custom Configuration ID to `customconfig=`. separate the parameters with a `&` character. 

    ```javascript
    var info = {
        url: 'https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?' + 
            'q=' + searchTerm + "&" +
            'customconfig=' + customConfigId,
        headers: {
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    }
    ```

1. Use the JavaScript Request Library to send a search request to your Bing Custom Search instance and print out information about the results, including its name, url, and the date the webpage was last crawled.

    ```javascript
    request(info, function(error, response, body){
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
    ```

## Full application code

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
    
    var info = {
        url: 'https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?' + 
          'q=' + searchTerm + 
          '&customconfig=' + customConfigId,
        headers: {
            'Ocp-Apim-Subscription-Key' : subscriptionKey
        }
    }
    
    request(info, function(error, response, body){
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
5. Run the code using the following command:  
  
    ```    
    node BingCustomSearch.js
    ``` 

## Next steps

> [!div class="nextstepaction"]
> [Build a Custom Search web page](./custom-search-web-page.md)

- [Configure your hosted UI experience](./hosted-ui.md)
- [Use decoration markers to highlight text](./hit-highlighting.md)
- [Page webpages](./page-webpages.md)
