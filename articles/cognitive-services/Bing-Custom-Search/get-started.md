---
title: Bing Custom Search Get started | Microsoft Docs
description: Describes how to create a custom search instance
services: cognitive-services
author: brapel
manager: ehansen

ms.service: cognitive-services
ms.technology: bing-web-search
ms.topic: article
ms.date: 05/09/2017
ms.author: v-brapel
---

# Get started
Before you can make your first call, you need to get a Cognitive Services subscription key. To get a key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api).

You can access the Bing Custom Search portal at [https://customsearch.ai](https://customsearch.ai).

This article guides you through the minimum steps to create a Bing Custom Search instance and retrieve search results.

<a name="create"></a>
## Create a custom search instance

Follow these instructions to create a Bing Custom Search instance.

- Sign in to Bing Custom Search portal
- Click the button labeled **New custom search**, the window titled **Create a new custom search instance** is displayed

> [!NOTE]
> If you are signing in to Bing Custom Search for the first time the **Create a new custom search instance** window comes up automatically

- In the textbox labeled **Custom search instance name**, enter a name for your new custom search instance
- Click **Ok**.  You are taken to the **Definition Editor** for your new custom search instance
- Enter the domain name of a site to be included in your custom search 
- Press enter or click the add button

<a name="retrieve"></a>
## Retrieve Custom Search Results

Follow these instructions to retrieve search results from your custom search instance.

- Get a subscription key, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search-api)
- From the configuration screen for your custom search instance, select the **API EndPoint** tab
- Record the **Custom Configuration ID**
- Replace **YOUR-SUBSCRIPTION-KEY** and **YOUR-CUSTOM-CONFIG-ID** in the following code example with your values

```javascript
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

## Next steps
- [Define your slice](./define-your-slice.md)
- [Hosted UI](./hosted-ui.md)
- [Hit highlighting](./hit-highlighting.md)
- [Page webpages](./paging-webpages.md)
