---
title: "Bing Custom Search: Search a custom view | Microsoft Docs"
description: Describes how to search a custom view of the web
services: cognitive-services
author: brapel
manager: ehansen
ms.service: cognitive-services
ms.component: bing-custom-search
ms.topic: article
ms.date: 09/28/2017
ms.author: v-brapel
---

# Call your custom search
Before making your first call to the Custom Search API to get search results for your instance, you need to get a Cognitive Services subscription key. To get a key for Custom Search API, see [Try Cognitive Services](https://azure.microsoft.com/try/cognitive-services/?api=bing-custom-search).

> [!NOTE]
> Existing Bing Custom Search customers who have a preview key provisioned on or before October 15, 2017 will be able to use their keys until November 30 2017, or until they have exhausted the maximum number of queries allowed. Afterwards, they need to migrate to the generally available version on Azure.

## Try it out
After you've configured your custom search experience, you can test the configuration from within the Custom Search portal. Sign into [Custom Search](https://customsearch.ai), click a Custom Search instance, and click the **Production** tab. The **Endpoints** tab is displayed. Your subscription will determine which endpoints are available to try, see [pricing pages](https://azure.microsoft.com/pricing/details/cognitive-services/bing-custom-search/). To test an endpoint, select it from the dropdown and set the associated configuration options. 

The following are the available options.

- **Query**: The search term to search for. Only available for Web, Image, and Autosuggest endpoints.
- **Custom Configuration ID**: The configuration ID of the selected Custom Search instance. This field is read only.
- **Market**: The market where the results come from. Only available for Web, Image, and Hosted UI endpoints.
- **Subscription Key**: The subscription key to test with. You may select a key from the dropdown or enter one manually.
- **Safe Search**: A filter used to filter webpages for adult content. Only available for Web, Image, and Hosted UI endpoints.
- **Count**: The number of search results to return in the response. Only available for Web and Image endpoints.
- **Offset**: The number of search results to return in the response. Only available for Web and Image endpoints.

After you've specified all required options for Web, Image, or Autosuggest, click **Call** to view the JSON response in the right pane. 

If you select the Hosted UI endpoint, you can test the search experience from the right pane.

## Next steps
- [Call your custom view with C#](./call-endpoint-csharp.md)
- [Call your custom view with Java](./call-endpoint-java.md)
- [Call your custom view with NodeJs](./call-endpoint-nodejs.md)
- [Call your custom view with Python](./call-endpoint-python.md)